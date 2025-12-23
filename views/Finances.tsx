
import React, { useState } from 'react';
import { Invoice, Currency } from '../types';
import { ICONS } from '../constants';
import { extractInvoiceData } from '../services/geminiService';

interface FinancesProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onRemoveInvoice: (id: string) => void;
  onApproveInvoice: (id: string) => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkRemove: (ids: string[]) => void;
  conversionRate: number;
  currency: Currency;
  isDarkMode: boolean;
}

const Finances: React.FC<FinancesProps> = ({ 
  invoices, 
  onAddInvoice, 
  onRemoveInvoice, 
  onApproveInvoice, 
  onBulkApprove, 
  onBulkRemove,
  conversionRate, 
  currency,
  isDarkMode
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const currencySymbol = currency === 'EUR' ? '€' : '$';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileList = Array.from(files) as File[];
    
    for (const file of fileList) {
      setProcessingQueue(prev => [...prev, file.name]);
      
      try {
        const reader = new FileReader();
        const mimeType = file.type || 'application/octet-stream';
        
        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64String = reader.result as string;
              const extracted = await extractInvoiceData(base64String, mimeType);
              
              const newInvoice: Invoice = {
                id: Math.random().toString(36).substr(2, 9),
                vendorName: extracted.vendorName || 'Unknown Vendor',
                amount: extracted.amount || 0,
                currency: extracted.currency || 'EUR',
                date: extracted.date || new Date().toISOString().split('T')[0],
                category: extracted.category || 'General',
                status: 'pending'
              };

              onAddInvoice(newInvoice);
              resolve(true);
            } catch (apiError) {
              console.error('Error in extractInvoiceData:', apiError);
              reject(apiError);
            }
          };
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.error(`Failed to process ${file.name}`, err);
      } finally {
        setProcessingQueue(prev => prev.filter(name => name !== file.name));
      }
    }
    
    setIsUploading(false);
    e.target.value = '';
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map(inv => inv.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    onBulkApprove(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} invoices?`)) {
      onBulkRemove(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Finance Ledger</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-lg mt-1 font-medium italic`}>Batch processing powered by Gemini 3 Flash.</p>
        </div>
        <label className="cursor-pointer bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 active:scale-95 group">
          <ICONS.Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Batch Upload
          <input 
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf" 
            onChange={handleFileUpload} 
            disabled={isUploading}
            multiple 
          />
        </label>
      </div>

      {processingQueue.length > 0 && (
        <div className={`${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'} p-6 rounded-[2rem] space-y-4 animate-pulse border`}>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className={`font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} text-[11px] uppercase tracking-[0.2em]`}>AI Synthesis in Progress ({processingQueue.length} remaining)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {processingQueue.map((name, idx) => (
              <span key={idx} className={`${isDarkMode ? 'bg-slate-800 text-blue-400 border-slate-700' : 'bg-white text-blue-600 border-blue-200'} text-[10px] font-black px-3 py-1.5 rounded-xl border shadow-sm`}>{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[2rem] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-top-4 duration-500 sticky top-24 z-30 border border-slate-800">
          <div className="flex items-center gap-4 px-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
              {selectedIds.length}
            </div>
            <p className="text-white font-black text-xs uppercase tracking-widest">Invoices Selected</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBulkApprove}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Approve
            </button>
            <button 
              onClick={handleBulkDelete}
              className="px-6 py-2.5 bg-slate-800 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-2.5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-[2.5rem] shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'} border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <tr>
                <th className="px-8 py-6 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                    checked={invoices.length > 0 && selectedIds.length === invoices.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vendor Entity</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Date</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
              {invoices.map((inv) => (
                <tr key={inv.id} className={`group transition-all ${selectedIds.includes(inv.id) ? (isDarkMode ? 'bg-blue-500/5' : 'bg-blue-50/30') : (isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50')}`}>
                  <td className="px-8 py-5 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      checked={selectedIds.includes(inv.id)}
                      onChange={() => toggleSelect(inv.id)}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-xl flex items-center justify-center font-black transition-all border ${isDarkMode ? 'border-slate-600 group-hover:border-blue-500/50' : 'border-slate-200 group-hover:border-blue-200'}`}>
                        {inv.vendorName[0]}
                      </div>
                      <span className="font-bold tracking-tight">{inv.vendorName}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-5 text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{inv.date}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 ${isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-100 text-slate-600 border-slate-200'} text-[10px] rounded-lg font-black uppercase tracking-widest border`}>
                      {inv.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black">
                    {currencySymbol}{(inv.amount * conversionRate).toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                      inv.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {inv.status === 'pending' && (
                        <button 
                          onClick={() => onApproveInvoice(inv.id)}
                          className={`p-2 ${isDarkMode ? 'bg-slate-700 text-emerald-400 border-slate-600 hover:bg-emerald-500/20' : 'bg-white text-emerald-500 border-slate-200 hover:bg-emerald-50'} border rounded-xl shadow-sm transition-all active:scale-90`}
                          title="Approve"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={() => onRemoveInvoice(inv.id)}
                        className={`p-2 ${isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-red-500/20 hover:text-red-400' : 'bg-white text-slate-400 border-slate-200 hover:bg-red-50 hover:text-red-600'} border rounded-xl shadow-sm transition-all active:scale-90`}
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 && (
          <div className="py-32 text-center">
            <div className={`w-24 h-24 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border shadow-sm`}>
               <ICONS.Finances className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Financial Ledger Empty</h3>
            <p className="text-slate-400 font-medium italic mt-2">Upload multiple documents to initiate the AI verification pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finances;
