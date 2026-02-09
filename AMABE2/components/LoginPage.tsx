
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ChevronRight } from 'lucide-react';

import { SystemSettings } from '../types';

interface LoginPageProps {
  onLogin: (email: string, password?: string) => void;
  onToggleRegister: () => void;
  onToggleForgotPassword: () => void;
  systemSettings?: SystemSettings | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onToggleRegister, onToggleForgotPassword, systemSettings }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur - Orange scheme */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100 rounded-full blur-[100px] -z-10 opacity-60"></div>

      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-orange-600/40 mb-8 rotate-3 hover:rotate-6 transition-transform border border-white/20 overflow-hidden">
            {systemSettings?.logo_url ? (
              <img src={systemSettings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <ShieldCheck size={44} strokeWidth={1.5} />
            )}
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            {systemSettings?.name || 'AMABE'}
          </h1>
          <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.5em] mt-3">
            Elite Club & Gestão
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[48px] md:rounded-[56px] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] border border-slate-100 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold uppercase tracking-wider text-center animate-in fade-in zoom-in-95 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">E-mail Corporativo</label>
              <div className="relative">
                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="email"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="seu@acesso.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Senha Segura</label>
              <div className="relative">
                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="password"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] px-3">
              <label className="flex items-center space-x-3 text-slate-400 font-bold group cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-200 text-orange-600 focus:ring-orange-500" />
                <span className="group-hover:text-slate-600 transition-colors uppercase tracking-widest">Lembrar</span>
              </label>
              <button
                type="button"
                onClick={onToggleForgotPassword}
                className="text-orange-600 font-black hover:tracking-[0.2em] transition-all uppercase italic"
              >
                Recuperar
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.5em] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${loading
                ? 'bg-orange-700 animate-pulse shadow-orange-900/40 relative overflow-hidden'
                : 'bg-orange-600 shadow-orange-600/40 hover:bg-orange-700 hover:-translate-y-1'
                }`}
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              )}
              <span>{loading ? 'Validando...' : 'Acessar Portal'}</span>
              {!loading && <ChevronRight size={22} />}
            </button>
          </form>
        </div>

        <div className="mt-14 text-center space-y-8 animate-in fade-in duration-1000 delay-300">
          <p className="text-slate-400 text-xs font-bold tracking-tight">
            Não faz parte? <button onClick={onToggleRegister} className="text-orange-600 font-black uppercase tracking-widest hover:underline ml-1">Cadastre-se</button>
          </p>

          <div className="p-6 md:p-8 bg-[#0A101E] rounded-[48px] border border-white/5 text-center shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 cursor-pointer" onClick={onToggleRegister}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-600/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full -ml-16 -mb-16"></div>

            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.6em] mb-4 opacity-80 animate-pulse">Oportunidade Única</p>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
              Cunhadas <span className="text-orange-500">AMABE</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest px-4">
              Faça parte da nossa elite e aproveite benefícios exclusivos em toda a rede.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:gap-4 transition-all">
              <span>Cadastre-se Agora</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
