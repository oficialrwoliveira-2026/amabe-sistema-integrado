
import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User as UserIcon, ChevronLeft, CheckCircle2, MapPin, Building2, Phone, Hash } from 'lucide-react';

import { SystemSettings } from '../types';

interface RegisterPageProps {
  onRegister: (data: { name: string; email: string; city?: string; whatsapp?: string; cnpj?: string; password?: string; role: 'MEMBER' | 'PARTNER' }) => void;
  onBackToLogin: () => void;
  systemSettings?: SystemSettings | null;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onBackToLogin, systemSettings }) => {
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [regType, setRegType] = useState<'MEMBER' | 'PARTNER'>('MEMBER');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onRegister({
        name,
        email,
        city: regType === 'MEMBER' ? city : undefined,
        whatsapp: regType === 'PARTNER' ? whatsapp : undefined,
        cnpj: regType === 'PARTNER' ? cnpj : undefined,
        password,
        role: regType
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (type: 'MEMBER' | 'PARTNER') => {
    setRegType(type);
    setStep('form');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-md bg-white p-16 rounded-[64px] shadow-2xl text-center space-y-8 border border-orange-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[36px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100/50 rotate-3">
            <CheckCircle2 size={56} strokeWidth={2.5} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Solicitação<br />Enviada!</h2>
            <p className="text-slate-500 font-medium leading-relaxed italic text-lg">
              Recebemos seu pedido. Nossa equipe vai revisar seus dados e liberar seu acesso VIP em instantes.
            </p>
          </div>
          <button
            onClick={onBackToLogin}
            className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl shadow-orange-600/40 hover:bg-orange-700 transition-all active:scale-95"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] -z-10 opacity-40"></div>

      <div className="w-full max-w-md animate-in slide-in-from-top-8 duration-700">
        <button
          onClick={step === 'choice' ? onBackToLogin : () => setStep('choice')}
          className="mb-10 flex items-center space-x-3 text-slate-400 hover:text-orange-600 transition-all font-black text-xs uppercase tracking-[0.3em] group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{step === 'choice' ? 'Voltar ao Login' : 'Voltar para Escolha'}</span>
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-orange-600/40 mb-8 border border-white/20 -rotate-3 hover:rotate-0 transition-all overflow-hidden">
            {systemSettings?.logo_url ? (
              <img src={systemSettings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              regType === 'PARTNER' && step === 'form' ? <Building2 size={44} strokeWidth={1.5} /> : <UserPlus size={44} strokeWidth={1.5} />
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">
            {step === 'choice' ? 'Cadastre-se' : regType === 'PARTNER' ? 'Parceria' : 'Filie-se'}
          </h1>
          <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mt-3 italic px-4">
            {step === 'choice' ? 'Escolha como deseja se unir a nós' : 'Entre para o Elite Club AMABE'}
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[48px] md:rounded-[56px] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] border border-slate-100 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-50 rounded-tl-full opacity-50"></div>

          {step === 'choice' ? (
            <div className="space-y-6 relative z-10">
              <button
                onClick={() => handleChoice('PARTNER')}
                className="w-full p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-orange-200 hover:bg-orange-50/50 transition-all group text-left active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                    <Building2 size={24} className="md:hidden" />
                    <Building2 size={28} className="hidden md:block" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 italic uppercase leading-none mb-1">Empresa Parceira</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Benfícios exclusivos</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleChoice('MEMBER')}
                className="w-full p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-orange-200 hover:bg-orange-50/50 transition-all group text-left active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                    <UserIcon size={24} className="md:hidden" />
                    <UserIcon size={28} className="hidden md:block" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 italic uppercase leading-none mb-1">Irmão ou Cunhada</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acesso total VIP</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Nome {regType === 'PARTNER' ? 'da Empresa' : 'Completo'}</label>
                <div className="relative">
                  <UserIcon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    type="text"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700 italic uppercase"
                    placeholder={regType === 'PARTNER' ? "Nome da Empresa" : "Seu nome"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {regType === 'PARTNER' ? (
                <>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                      <input
                        type="text"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                        placeholder="(00) 00000-0000"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">CNPJ</label>
                    <div className="relative">
                      <Hash size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                      <input
                        type="text"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                        placeholder="00.000.000/0000-00"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Cidade</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input
                      type="text"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700 italic uppercase"
                      placeholder="Sua cidade"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">E-mail de Acesso</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    type="email"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Criar Senha</label>
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

              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-rose-100 italic">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl shadow-orange-600/40 hover:bg-orange-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Processando...' : 'Enviar Solicitação'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
