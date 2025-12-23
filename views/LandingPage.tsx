
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [showTour, setShowTour] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FCFCFD] dark:bg-[#020617] min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden transition-colors duration-500">
      {/* Parallax Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full"
          style={{ transform: `translate3d(${scrollY * 0.1}px, ${scrollY * 0.2}px, 0)` }}
        ></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-600/10 blur-[120px] rounded-full"
          style={{ transform: `translate3d(${-scrollY * 0.05}px, ${-scrollY * 0.1}px, 0)` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-xl tracking-tighter">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">BizPilot AI</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Invoicing', 'Optimization', 'Recruiting'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Sign In</button>
            <button onClick={onGetStarted} className="bg-blue-600 text-white px-7 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-8 z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Enterprise Operating System for SME
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[1] tracking-tight text-slate-900 dark:text-white">
            Your Business, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-emerald-400 italic">Refined.</span>
          </h1>
          
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            BizPilot automates the "busywork" of running a company. Capture invoices, optimize recurring spend, and hire top talent—all from a single, autonomous command center.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <button onClick={onGetStarted} className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
              Start Free Trial
            </button>
            <button onClick={() => setShowTour(true)} className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white rounded-full font-black uppercase tracking-widest text-xs hover:border-blue-500 transition-all active:scale-95">
              Watch Tour
            </button>
          </div>
        </div>

        {/* Parallax Dashboard Mockup */}
        <div 
          className="mt-24 relative w-full max-w-6xl aspect-[16/10] rounded-[3rem] p-1.5 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-200 ease-out"
          style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
        >
          <div className="w-full h-full bg-[#F8FAFC] dark:bg-slate-950 rounded-[2.8rem] overflow-hidden relative border border-white/50 dark:border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover opacity-90 dark:opacity-30 grayscale-[20%] dark:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-8 relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        {[
          { icon: ICONS.Finances, title: 'Intelligent Invoicing', desc: 'Smarter OCR that actually learns. Just drag and drop; we handle the ledger entries.' },
          { icon: ICONS.Optimization, title: 'System Optimization', desc: 'Identify software bloat and redundant infrastructure. We find the savings for you.' },
          { icon: ICONS.Hiring, title: 'Precision Hiring', desc: 'Generate role-specific technical assessments and JDs that attract elite talent.' },
        ].map((f, i) => (
          <div key={i} className="group space-y-6">
            <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-sm">
              <f.icon className="w-7 h-7 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Video Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowTour(false)}></div>
           <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500">
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                 <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 group cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
                 <div className="text-center">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Platform Deep-Dive</h3>
                    <p className="text-slate-400 font-medium">See the autonomous SME operations layer in action.</p>
                 </div>
                 <button onClick={() => setShowTour(false)} className="px-6 py-2.5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Close Player</button>
              </div>
              <div className="absolute bottom-10 left-10 flex gap-1 items-end h-8">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`w-1 bg-blue-500/40 rounded-full animate-pulse`} style={{height: `${Math.random()*100}%`}}></div>)}
              </div>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-white/5 text-center px-8 relative z-10 bg-white dark:bg-[#020617]">
         <div className="flex justify-center gap-12 mb-10">
            {['Privacy', 'Enterprise', 'Changelog'].map(t => (
              <a key={t} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{t}</a>
            ))}
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">© 2025 BizPilot Systems</p>
      </footer>
    </div>
  );
};

export default LandingPage;
