
import React from 'react';
import { Invoice, JobPosting, Subscription, View, Currency, OptimizationTask } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  invoices: Invoice[];
  subscriptions: Subscription[];
  jobs: JobPosting[];
  onNavigate: (view: View) => void;
  optimizationHistory: OptimizationTask[];
  conversionRate: number;
  currency: Currency;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  invoices, subscriptions, jobs, onNavigate, optimizationHistory, conversionRate, currency, isDarkMode 
}) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const totalSpend = invoices.reduce((acc, inv) => acc + inv.amount, 0) * conversionRate;
  const activeOptimizations = optimizationHistory.filter(t => t.status === 'in-progress');
  const completedOptimizations = optimizationHistory.filter(t => t.status === 'completed');
  const identifiedSavings = subscriptions.filter(s => s.isFlagged).reduce((acc, s) => acc + s.monthlyCost, 0) * conversionRate;
  const currencySymbol = currency === 'EUR' ? '€' : '$';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Command Center</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-lg mt-1 font-medium italic`}>System status: Stable. Operational efficiency at peak.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(View.FINANCES)}
            className={`flex items-center gap-2 px-5 py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'} border rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95`}
          >
            <ICONS.Plus className="w-5 h-5 text-blue-600" />
            New Invoice
          </button>
          <button 
            onClick={() => onNavigate(View.HIRING)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <ICONS.Plus className="w-5 h-5" />
            New Role
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Expenses Card */}
        <div className={`relative group p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ICONS.Finances className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">Expenses • {currentMonth}</p>
          <h3 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>{currencySymbol}{totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Analyzing Live
          </div>
        </div>

        {/* Savings Card */}
        <div className={`relative group p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer`} onClick={() => onNavigate(View.OPTIMIZATION)}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ICONS.Optimization className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">Savings Pipeline</p>
          <h3 className="text-4xl font-black text-orange-600 leading-none">{currencySymbol}{identifiedSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          <div className="mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            {activeOptimizations.length} running tasks
          </div>
        </div>

        {/* Hiring Card */}
        <div className={`relative group p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer`} onClick={() => onNavigate(View.HIRING)}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ICONS.Hiring className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">Talent Engine</p>
          <h3 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>{jobs.length} Active</h3>
          <p className="mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
            {jobs.length > 0 ? `Latest: ${jobs[0].title}` : 'Workspace ready to scale.'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Financial Ledger Section */}
        <div className={`xl:col-span-8 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-[2.5rem] border shadow-sm overflow-hidden`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
            <button onClick={() => onNavigate(View.FINANCES)} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">
                  <th className="px-8 py-4">Vendor</th>
                  <th className="px-4 py-4">Classification</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {invoices.slice(0, 5).map(inv => (
                  <tr key={inv.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center font-black text-slate-500 shadow-sm border border-slate-200 dark:border-slate-600">
                        {inv.vendorName[0]}
                      </div>
                      <span className="font-bold">{inv.vendorName}</span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] rounded-lg font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600">
                        {inv.category}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${inv.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'}`}>{inv.status}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-black">{currencySymbol}{(inv.amount * conversionRate).toFixed(2)}</td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                      No invoices logged yet. Batch upload documents to start tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy & Health Column */}
        <div className="xl:col-span-4 space-y-8">
          {/* Optimization Log */}
          <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 flex flex-col">
            <h3 className="text-xl font-black mb-6">Optimization Log</h3>
            <div className="space-y-4 flex-1">
              {(activeOptimizations.length > 0 || completedOptimizations.length > 0) ? (
                <>
                  {activeOptimizations.slice(0, 2).map(task => (
                    <div key={task.id} className="bg-white/10 rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center animate-spin-slow">⚙️</div>
                      <div className="overflow-hidden">
                        <p className="font-black text-sm truncate">{task.action}</p>
                        <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">{task.vendorName} • Active</p>
                      </div>
                    </div>
                  ))}
                  {completedOptimizations.slice(0, 2).map(task => (
                    <div key={task.id} className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-500/20 flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-500/40 rounded-lg flex items-center justify-center text-xs">✅</div>
                      <div className="overflow-hidden">
                        <p className="font-black text-sm truncate">Optimized {task.vendorName}</p>
                        <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">ROI Identified</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm opacity-60 italic py-10 text-center">No active optimization streams. Upload recurring invoices to start saving.</p>
              )}
            </div>
            <button onClick={() => onNavigate(View.OPTIMIZATION)} className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-black uppercase tracking-widest border border-white/20">Strategy Workspace</button>
          </div>

          {/* System Health */}
          <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm`}>
             <h3 className={`text-xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Health</h3>
             <div className="space-y-6 mt-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <span>Invoicing Engine</span>
                      <span className="text-emerald-500">94% Capacity</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[94%]"></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <span>Savings Analysis</span>
                      <span className="text-blue-500">Live Scanning</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-full animate-pulse"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
