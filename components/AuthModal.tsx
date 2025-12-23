
import React, { useState } from 'react';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email || 'demo@user.com');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">BizPilot AI</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {mode === 'login' ? 'Willkommen zurück' : 'Account erstellen'}
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            {mode === 'login' 
              ? 'Logge dich ein, um deine Finanzen zu verwalten.' 
              : 'Starte heute mit deinem kostenlosen 14-Tage-Trial.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">E-Mail Adresse</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="name@firma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Passwort</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {mode === 'login' ? 'Anmelden' : 'Registrieren'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
             <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                <span className="text-sm font-semibold text-slate-700">Mit Google fortfahren</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
