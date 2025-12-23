
import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
  userEmail: string;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout, userEmail, isDarkMode }) => {
  const items = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: ICONS.Dashboard },
    { id: View.FINANCES, label: 'Finances', icon: ICONS.Finances },
    { id: View.OPTIMIZATION, label: 'Optimization', icon: ICONS.Optimization },
    { id: View.HIRING, label: 'Hiring', icon: ICONS.Hiring },
  ];

  return (
    <aside className={`w-64 ${isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col h-screen fixed left-0 top-0 transition-colors duration-300 z-50`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            BizPilot AI
          </h1>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : `text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white`
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto p-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-6">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt="Avatar" className={`w-10 h-10 rounded-full border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />
          <div className="overflow-hidden">
            <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userEmail.split('@')[0]}</p>
            <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Enterprise</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
