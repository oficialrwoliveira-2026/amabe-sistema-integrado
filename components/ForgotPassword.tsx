
import React, { useState } from 'react';
import { Mail, ChevronRight, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordProps {
    onSendResetEmail: (email: string) => Promise<void>;
    onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSendResetEmail, onBack }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSendResetEmail(email);
            setSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
                        <Send size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 italic uppercase mb-4">E-mail Enviado!</h2>
                    <p className="text-slate-500 font-bold text-sm mb-12">
                        Verifique sua caixa de entrada. Enviamos um link para você redefinir sua senha com segurança.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-slate-800 transition-all"
                    >
                        Voltar ao Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-orange-600 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Recuperar Acesso</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Digite seu e-mail para receber o link</p>
                </div>

                <div className="bg-white p-12 rounded-[56px] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] border border-slate-100 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">E-mail Cadastrado</label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                                <input
                                    type="email"
                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-orange-600/40 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                        >
                            <span>{loading ? 'Enviando...' : 'Enviar Link'}</span>
                            {!loading && <ChevronRight size={22} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
