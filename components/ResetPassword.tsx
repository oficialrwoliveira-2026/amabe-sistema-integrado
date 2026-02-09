
import React, { useState } from 'react';
import { Lock, ChevronRight, Check } from 'lucide-react';

interface ResetPasswordProps {
    onUpdatePassword: (password: string) => Promise<void>;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onUpdatePassword }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await onUpdatePassword(password);
            setSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 text-center">
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                        <Check size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 italic uppercase mb-4">Senha Alterada!</h2>
                    <p className="text-slate-500 font-bold text-sm mb-12">
                        Sua senha foi redefinida com sucesso. Você já pode acessar o portal normalmente.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-slate-800 transition-all"
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-600/20 mb-6">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Nova Senha Segura</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-3">Defina sua nova credencial de acesso</p>
                </div>

                <div className="bg-white p-12 rounded-[56px] shadow-[0_50px_100px_-20px_rgba(234,88,12,0.15)] border border-slate-100 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Nova Senha</label>
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

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Confirmar Senha</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                                <input
                                    type="password"
                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-8 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-orange-600/40 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                        >
                            <span>{loading ? 'Salvando...' : 'Redefinir Senha'}</span>
                            {!loading && <ChevronRight size={22} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
