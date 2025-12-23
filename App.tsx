
import React, { useState, useEffect } from 'react';
import { View, Invoice, Subscription, JobPosting, Currency, OptimizationTask } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Finances from './views/Finances';
import Optimization from './views/Optimization';
import Hiring from './views/Hiring';
import LandingPage from './views/LandingPage';
import AuthModal from './components/AuthModal';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationTask[]>([]);

  // Toggle theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simple conversion rate for display purposes
  const conversionRate = currency === 'USD' ? 1.08 : 1.0;

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentView(View.DASHBOARD);
    setInvoices([]);
    setSubscriptions([]);
    setJobs([]);
    setOptimizationHistory([]);
  };

  const addInvoice = (inv: Invoice) => setInvoices(prev => [inv, ...prev]);
  const approveInvoice = (id: string) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'approved' } : inv));
  const bulkApproveInvoices = (ids: string[]) => setInvoices(prev => prev.map(inv => ids.includes(inv.id) ? { ...inv, status: 'approved' } : inv));
  const removeInvoice = (id: string) => setInvoices(prev => prev.filter(inv => inv.id !== id));
  const bulkRemoveInvoices = (ids: string[]) => setInvoices(prev => prev.filter(inv => !ids.includes(inv.id)));

  const addJob = (job: JobPosting) => setJobs(prev => [job, ...prev]);
  const removeJob = (id: string) => setJobs(prev => prev.filter(j => j.id !== id));

  const updateSubscriptions = (subs: Subscription[]) => setSubscriptions(subs);
  const removeSubscription = (id: string) => setSubscriptions(prev => prev.filter(s => s.id !== id));

  const addOptimizationTask = (task: OptimizationTask) => {
    setOptimizationHistory(prev => [task, ...prev]);
  };

  const updateOptimizationStatus = (id: string, status: OptimizationTask['status']) => {
    setOptimizationHistory(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const renderView = () => {
    const props = { conversionRate, currency, isDarkMode };
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard invoices={invoices} subscriptions={subscriptions} jobs={jobs} onNavigate={setCurrentView} optimizationHistory={optimizationHistory} {...props} />;
      case View.FINANCES:
        return (
          <Finances 
            invoices={invoices} 
            onAddInvoice={addInvoice} 
            onRemoveInvoice={removeInvoice} 
            onApproveInvoice={approveInvoice}
            onBulkApprove={bulkApproveInvoices}
            onBulkRemove={bulkRemoveInvoices}
            {...props} 
          />
        );
      case View.OPTIMIZATION:
        return (
          <Optimization 
            invoices={invoices} 
            subscriptions={subscriptions} 
            onUpdateSubscriptions={updateSubscriptions} 
            onRemoveSubscription={removeSubscription}
            optimizationHistory={optimizationHistory}
            onAddTask={addOptimizationTask}
            onUpdateTaskStatus={updateOptimizationStatus}
            {...props}
          />
        );
      case View.HIRING:
        return <Hiring jobs={jobs} onAddJob={addJob} onRemoveJob={removeJob} isDarkMode={isDarkMode} />;
      default:
        return <Dashboard invoices={invoices} subscriptions={subscriptions} jobs={jobs} onNavigate={setCurrentView} optimizationHistory={optimizationHistory} {...props} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage 
          onLogin={() => setAuthModal('login')} 
          onGetStarted={() => setAuthModal('signup')} 
        />
        {authModal && (
          <AuthModal 
            mode={authModal} 
            onClose={() => setAuthModal(null)} 
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-300`}>
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
        userEmail={userEmail}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 ml-64 min-h-screen">
        <header className={`h-20 ${isDarkMode ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300`}>
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <ICONS.Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} group-focus-within:text-blue-600 transition-colors`} />
              <input
                type="text"
                placeholder="Search resources, invoices, or roles..."
                className={`w-full ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-100/50 border-slate-200 text-slate-900'} pl-11 pr-4 py-2.5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-500'} hover:scale-110 active:scale-95`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {/* Currency Switcher */}
            <div className={`flex items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} rounded-xl p-1 border`}>
              {(['EUR', 'USD'] as Currency[]).map(c => (
                <button 
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === c ? (isDarkMode ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className={`h-8 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

            <button className={`p-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} hover:text-blue-600 transition-all relative`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-[#1E293B] shadow-sm"></span>
            </button>
            
            <div className={`flex items-center gap-3 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50/50 border-blue-100'} px-3 py-1.5 rounded-2xl border`}>
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                PRO
              </div>
              <div className="hidden lg:block">
                <p className={`text-[10px] font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-wider leading-none`}>Enterprise</p>
                <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Plan</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto transition-opacity duration-300">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
