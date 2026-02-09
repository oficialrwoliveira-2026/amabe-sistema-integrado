import React, { memo } from 'react';
import { Ticket, User as UserIcon, Clock } from 'lucide-react';
import { BenefitUsage } from '../../types';

interface VouchersManagerProps {
    history: BenefitUsage[];
}

const VouchersManager: React.FC<VouchersManagerProps> = ({
    history
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm gap-8 transition-all">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-black text-slate-900 italic uppercase leading-tight">Log de Validações</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Histórico de Vouchers do Clube AMABE</p>
                </div>
                <div className="bg-orange-50 px-8 py-4 rounded-[28px] border border-orange-100 flex items-center gap-4 self-center lg:self-auto shadow-sm">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Ticket size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">Total Emitido</p>
                        <p className="text-2xl font-black text-slate-900 mt-1 italic leading-none">{history.length}</p>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                {/* View para Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiário</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Associado Titular</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parceiro</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Emitido em</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {history.map((h) => (
                                <tr key={h.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                                <UserIcon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 italic uppercase tracking-tighter leading-none">{h.beneficiaryName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{h.beneficiaryId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-700 italic uppercase tracking-tight">{h.memberName}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">ID: {h.memberId}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                            {h.partnerName}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={12} />
                                            <span className="text-[11px] font-bold uppercase tracking-widest">
                                                {new Date(h.date).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex justify-center">
                                            <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm border ${h.status === 'VALIDADO'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${h.status === 'VALIDADO' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`}></div>
                                                {h.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View para Mobile */}
                <div className="lg:hidden divide-y divide-slate-100">
                    {history.map((h) => (
                        <div key={h.id} className="p-8 space-y-6 hover:bg-slate-50/30 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                                        <UserIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 italic uppercase tracking-tighter leading-tight text-base">{h.beneficiaryName}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{h.beneficiaryId}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm border shrink-0 ${h.status === 'VALIDADO'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    {h.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Associado Titular</p>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-700 italic uppercase tracking-tight">{h.memberName}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">ID: {h.memberId}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex flex-col justify-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Parceiro</p>
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-tight truncate">
                                            {h.partnerName}
                                        </span>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex flex-col justify-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Emitido em</p>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Clock size={10} />
                                            <span className="text-[10px] font-bold uppercase tracking-tight">
                                                {new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {new Date(h.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(VouchersManager);
