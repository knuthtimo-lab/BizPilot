
import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, Subscription, Currency, OptimizationTask } from '../types';
import { analyzeSpendings, identifySubscriptions } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ICONS } from '../constants';

interface OptimizationProps {
  invoices: Invoice[];
  subscriptions: Subscription[];
  onUpdateSubscriptions: (subs: Subscription[]) => void;
  onRemoveSubscription: (id: string) => void;
  optimizationHistory: OptimizationTask[];
  onAddTask: (task: OptimizationTask) => void;
  onUpdateTaskStatus: (id: string, status: OptimizationTask['status']) => void;
  conversionRate: number;
  currency: Currency;
  isDarkMode: boolean;
}

const Optimization: React.FC<OptimizationProps> = ({ 
  invoices, subscriptions, onUpdateSubscriptions, onRemoveSubscription, 
  optimizationHistory, onAddTask, onUpdateTaskStatus, conversionRate, currency, isDarkMode 
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'history'>('recommendations');
  
  const currencySymbol = currency === 'EUR' ? '€' : '$';

  const chartData = useMemo(() => {
    if (invoices.length === 0) return [];
    const monthlyData: Record<string, any> = {};
    invoices.forEach(inv => {
      const date = new Date(inv.date);
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const category = inv.category || 'Other';
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { month: monthKey };
      monthlyData[monthKey][category] = (monthlyData[monthKey][category] || 0) + (inv.amount * conversionRate);
    });
    return Object.values(monthlyData).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [invoices, conversionRate]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (invoices.length === 0) return;
      setIsLoading(true);
      try {
        const result = await analyzeSpendings(invoices);
        setRecommendations(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, [invoices]);

  const handleSyncSubscriptions = async () => {
    if (invoices.length === 0) return;
    setIsSyncing(true);
    try {
      const identified = await identifySubscriptions(invoices);
      const newSubs: Subscription[] = identified.map((s, idx) => ({
        id: `detected-${idx}-${Date.now()}`,
        vendorName: s.vendorName || 'Unknown',
        monthlyCost: s.monthlyCost || 0,
        renewalDate: s.renewalDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        isFlagged: s.isFlagged || false,
        reason: s.reason,
        status: 'active'
      }));
      onUpdateSubscriptions([...subscriptions, ...newSubs]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const initiateAction = (rec: any, idx: number) => {
    const taskId = Math.random().toString(36).substr(2, 9);
    const task: OptimizationTask = {
      id: taskId,
      vendorName: rec.vendorName,
      reason: rec.reason,
      estimatedSaving: rec.estimatedSaving,
      action: rec.action,
      status: 'in-progress',
      timestamp: new Date().toLocaleTimeString()
    };
    
    onAddTask(task);
    setRecommendations(prev => prev.filter((_, i) => i !== idx));
    
    // Simulate background processing
    setTimeout(() => {
      onUpdateTaskStatus(taskId, 'completed');
    }, 4500);
  };

  const totalFlaggedSavings = subscriptions.filter(s => s.isFlagged).reduce((acc, s) => acc + s.monthlyCost, 0) * conversionRate;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Intelligence Center</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-lg mt-1 font-medium italic`}>Operational health monitoring & ROI trajectory.</p>
        </div>
        <button 
          onClick={handleSyncSubscriptions}
          disabled={isSyncing || invoices.length === 0}
          className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95"
        >
          {isSyncing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ICONS.Optimization className="w-5 h-5" />}
          {isSyncing ? 'Syncing...' : 'Audit Assets'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/10">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Yearly Savings Engine</p>
          <h3 className="text-4xl font-black">{currencySymbol}{(totalFlaggedSavings * 12).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
        <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border shadow-sm`}>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ongoing Optimizations</p>
          <h3 className={`text-4xl font-black ${optimizationHistory.filter(t => t.status === 'in-progress').length > 0 ? 'text-blue-600' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
            {optimizationHistory.filter(t => t.status === 'in-progress').length}
          </h3>
        </div>
        <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border shadow-sm`}>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Completed Tasks</p>
          <h3 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{optimizationHistory.filter(t => t.status === 'completed').length}</h3>
        </div>
      </div>

      {/* ROI Area Chart */}
      <div className={`p-10 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border shadow-sm`}>
        <h3 className="text-xl font-black mb-10 tracking-tight">Financial DNA & Velocity</h3>
        <div className="h-80 w-full">
          {invoices.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={val => `${currencySymbol}${val}`} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 700, background: isDarkMode ? '#1E293B' : '#FFF', color: isDarkMode ? '#FFF' : '#000' }} />
                <Area type="monotone" dataKey="Software" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                <Area type="monotone" dataKey="Infrastructure" stackId="1" stroke="#8b5cf6" fillOpacity={0} strokeWidth={3} />
                <Area type="monotone" dataKey="Other" stackId="1" stroke="#10b981" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic font-bold">Awaiting financial ledger data for ROI trajectory.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Strategy Workspace */}
        <div className={`lg:col-span-7 flex flex-col rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border shadow-sm overflow-hidden`}>
          <div className="flex border-b border-slate-100 dark:border-slate-700">
            <button onClick={() => setActiveTab('recommendations')} className={`flex-1 py-6 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'recommendations' ? 'text-blue-600 bg-blue-50/5' : 'text-slate-400 hover:text-slate-600'}`}>Recommended Actions</button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 py-6 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'history' ? 'text-blue-600 bg-blue-50/5' : 'text-slate-400 hover:text-slate-600'}`}>Execution Log</button>
          </div>
          <div className="p-8 space-y-4 max-h-[600px] overflow-auto custom-scrollbar">
            {activeTab === 'recommendations' ? (
              <>
                {isLoading ? (
                  <div className="text-center py-20 animate-pulse text-slate-400 font-bold italic">AI scanning for redundant operational nodes...</div>
                ) : recommendations.length > 0 ? recommendations.map((rec, idx) => (
                  <div key={idx} className={`p-6 rounded-[2rem] border transition-all group ${isDarkMode ? 'bg-slate-700/30 border-slate-700 hover:border-blue-500/50' : 'bg-slate-50 border-slate-100 hover:border-blue-500/50'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-sm uppercase tracking-wide">{rec.vendorName}</h4>
                      <p className="text-emerald-500 font-black text-sm">Save {currencySymbol}{(rec.estimatedSaving * conversionRate).toFixed(2)}/mo</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium italic">"{rec.reason}"</p>
                    <button 
                      onClick={() => initiateAction(rec, idx)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      {rec.action}
                    </button>
                  </div>
                )) : <div className="text-center py-20 text-slate-400 font-medium italic">Systems verified. Efficiency optimal.</div>}
              </>
            ) : (
              <div className="space-y-4">
                {optimizationHistory.length > 0 ? optimizationHistory.map(task => (
                  <div key={task.id} className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'} flex items-center justify-between group transition-all`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500 animate-spin-slow'}`}>
                         {task.status === 'completed' ? '✓' : '⚙️'}
                       </div>
                       <div className="overflow-hidden">
                         <p className="font-black text-sm uppercase tracking-wide truncate">{task.action}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{task.vendorName} • Initiated {task.timestamp}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                         {task.status === 'in-progress' ? 'Running' : task.status}
                       </span>
                    </div>
                  </div>
                )) : <div className="text-center py-20 text-slate-400 italic">No tasks in audit log.</div>}
              </div>
            )}
          </div>
        </div>

        {/* Recurring Assets Column */}
        <div className={`lg:col-span-5 p-10 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border shadow-sm`}>
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black tracking-tight">Asset Audit</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{subscriptions.length} Stream(s)</span>
           </div>
           <div className="space-y-5 max-h-[600px] overflow-auto pr-3 custom-scrollbar">
              {subscriptions.map(sub => (
                <div key={sub.id} className={`p-5 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-slate-50 border-slate-100'} flex items-center justify-between group hover:border-blue-500/30`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${isDarkMode ? 'bg-slate-700 text-slate-500 border-slate-600' : 'bg-white text-slate-400 border-slate-100'} rounded-2xl flex items-center justify-center font-black shadow-sm border transition-transform group-hover:scale-110`}>
                        {sub.vendorName[0]}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-wide">{sub.vendorName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Renewal: {sub.renewalDate}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-sm">{currencySymbol}{(sub.monthlyCost * conversionRate).toFixed(2)}/mo</p>
                      <button onClick={() => onRemoveSubscription(sub.id)} className="text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600 transition-colors mt-1.5">Detach</button>
                   </div>
                </div>
              ))}
              {subscriptions.length === 0 && <p className="text-center py-24 text-slate-400 italic">No recurring streams detected.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
