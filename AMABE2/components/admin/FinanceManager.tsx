import React, { memo } from 'react';
import { DollarSign, Activity, ShieldAlert, Search, Download, Eye, CreditCard, RotateCcw, Trash2 } from 'lucide-react';
import { User, Payment, PaymentStatus, DashboardTab } from '../../types';

interface FinanceManagerProps {
    analytics: {
        totalRevenue: number;
        pendingRevenue: number;
        overdueRevenue: number;
        overdueMembersCount: number;
        revenueTrend: number;
        pendingTrend: number;
        overdueTrend: number;
    };
    paymentStatusFilter: 'all' | 'paid' | 'overdue';
    setPaymentStatusFilter: (val: 'all' | 'paid' | 'overdue') => void;
    paymentSearch: string;
    setPaymentSearch: (val: string) => void;
    memberFinancialStatus: any[];
    onExport: (format: 'pdf' | 'excel' | 'csv') => void;
    onSelectMember: (user: User) => void;
    onGenerateInstallments: (memberId: string, name: string) => void;
    onQuickPay: (memberId: string) => void;
    onPayInstallment: (id: string) => void;
    onCancelPayment: (id: string) => void;
    onDeletePayment: (id: string) => void;
    membersCount: number;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({
    analytics,
    paymentStatusFilter,
    setPaymentStatusFilter,
    paymentSearch,
    setPaymentSearch,
    memberFinancialStatus,
    onExport,
    onSelectMember,
    onGenerateInstallments,
    onQuickPay,
    onPayInstallment,
    onCancelPayment,
    onDeletePayment,
    membersCount
}) => {
    const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);

    const selectedHistory = React.useMemo(() => {
        if (!selectedMemberId) return null;
        return memberFinancialStatus.find(item => item.member.id === selectedMemberId);
    }, [selectedMemberId, memberFinancialStatus]);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Modal de Histórico */}
            {selectedHistory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setSelectedMemberId(null)}
                    ></div>

                    <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[85vh]">
                        <div className="p-8 md:p-12 border-b border-slate-100 flex items-center justify-between bg-white/50">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedHistory.member.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2 italic">
                                    {selectedHistory.member.memberId} • Histórico de Parcelas
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMemberId(null)}
                                className="w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
                            >
                                <RotateCcw size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedHistory.allPayments && selectedHistory.allPayments.length > 0 ? (
                                    selectedHistory.allPayments.map((p, idx) => (
                                        <div key={p.id} className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-emerald-500">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                    Parcela {idx + 1}
                                                </span>
                                                <span className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${p.status === PaymentStatus.PAID ? 'bg-emerald-50 text-emerald-600' :
                                                    p.status === PaymentStatus.OVERDUE ? 'bg-rose-50 text-rose-600 animate-pulse' :
                                                        'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {p.status === 'PAID' ? 'Pago' : p.status === 'OVERDUE' ? 'Atrasado' : 'Pendente'}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmDelete(p.id);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                                                    title="Excluir Parcela"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 italic">
                                                {new Date(p.dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                            </h4>
                                            <div className="mt-6 pt-6 border-t border-slate-50 space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Vencimento</p>
                                                        <p className="text-xs font-bold text-slate-600 mt-1">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Valor</p>
                                                        <p className="text-sm font-bold text-emerald-600 mt-1">R$ {p.amount.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                {p.status !== PaymentStatus.PAID ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPayInstallment(p.id);
                                                        }}
                                                        className="w-full py-4 bg-[#0F172A] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 group/payitem active:scale-95 shadow-lg shadow-slate-900/10"
                                                    >
                                                        <CreditCard size={14} className="group-hover/payitem:rotate-12 transition-transform" />
                                                        Pagar Parcela
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onCancelPayment(p.id);
                                                        }}
                                                        className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-3 group/cancelitem active:scale-95 shadow-sm"
                                                    >
                                                        <RotateCcw size={14} className="group-hover/cancelitem:-rotate-180 transition-transform duration-500" />
                                                        Cancelar Pagamento
                                                    </button>
                                                )}

                                                {p.updatedBy && (
                                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                                        <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold uppercase tracking-wider italic">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                            Alterado por {p.updatedBy} em {new Date(p.updatedAt || '').toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Fluxo de Confirmação de Exclusão */}
                                            {confirmDelete === p.id && (
                                                <div className="absolute inset-0 z-50 bg-rose-600/95 backdrop-blur-sm rounded-[32px] p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                                        <Trash2 size={32} className="text-white" />
                                                    </div>
                                                    <h5 className="text-white font-bold text-xl mb-2">Excluir Parcela?</h5>
                                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-8">Esta ação não pode ser desfeita.</p>
                                                    <div className="flex items-center gap-4 w-full">
                                                        <button
                                                            onClick={() => setConfirmDelete(null)}
                                                            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onDeletePayment(p.id);
                                                                setConfirmDelete(null);
                                                            }}
                                                            className="flex-1 py-4 bg-white text-rose-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl"
                                                        >
                                                            Confirmar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-slate-400 font-bold italic">Nenhuma parcela gerada para este associado.</p>
                                        <button
                                            onClick={() => {
                                                onGenerateInstallments(selectedHistory.member.id, selectedHistory.member.name);
                                            }}
                                            className="mt-6 px-8 py-4 bg-orange-600 text-white rounded-[24px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all shadow-xl"
                                        >
                                            Gerar 12 Parcelas Agora
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedMemberId(null)}
                                className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-bold uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
                            >
                                Fechar Histórico
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-[4px] bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
                    <h2 className="text-4xl font-bold text-slate-800 tracking-tighter leading-none">Gestão Financeira</h2>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em] mt-3 opacity-70 italic">
                        Fluxo de Caixa e Cobrança
                    </p>
                </div>
                <div className="relative group/export">
                    <button className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-100 text-slate-900 rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} className="text-slate-400" /> Exportar
                    </button>
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white p-2 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50">
                        <button onClick={() => onExport('pdf')} className="w-full px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-[24px] transition-all flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div> PDF
                        </button>
                        <button onClick={() => onExport('excel')} className="w-full px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-[24px] transition-all flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> EXCEL
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: 'Arrecadado', value: analytics.totalRevenue, color: 'text-emerald-600', icon: DollarSign, trend: analytics.revenueTrend },
                    { label: 'Em Aberto', value: analytics.pendingRevenue, color: 'text-amber-600', icon: Activity, trend: analytics.pendingTrend },
                    { label: 'Vencido', value: analytics.overdueRevenue, color: 'text-rose-600', icon: ShieldAlert, trend: analytics.overdueTrend },
                ].map((kpi, i) => (
                    <div key={i} className="glass-card-light p-10 rounded-[48px] border-white/40 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-5 rounded-[24px] bg-white shadow-xl ${kpi.color} group-hover:scale-110 transition-transform duration-500`}>
                                <kpi.icon size={28} />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">{kpi.label}</p>
                        <h4 className="text-4xl font-bold text-slate-800 tracking-tighter leading-none pl-1">R$ {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                    </div>
                ))}
            </div>

            <div className="glass-card-light rounded-[56px] border-white/40 shadow-sm overflow-hidden">
                <div className="p-10 lg:p-12 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                        <div className="flex bg-slate-100/50 p-1.5 rounded-[28px] border border-slate-100">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'paid', label: 'Em Dia' },
                                { id: 'overdue', label: 'Atrasado' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setPaymentStatusFilter(f.id as any)}
                                    className={`px-5 py-3 rounded-[24px] text-[9px] font-bold uppercase tracking-widest transition-all ${paymentStatusFilter === f.id
                                        ? `bg-white text-slate-900 shadow-md`
                                        : `text-slate-400 hover:text-slate-600`
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text" placeholder="Nome ou ID do associado..."
                                className="w-full pl-16 pr-8 py-5 bg-white/60 border border-slate-100 rounded-[28px] outline-none focus:ring-4 focus:ring-emerald-50 font-bold text-sm transition-all"
                                value={paymentSearch} onChange={e => setPaymentSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* View para Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="pl-12 pr-6 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Associado</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Última Parcela</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Valor Médio</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Status Global</th>
                                <th className="pr-12 pl-6 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {memberFinancialStatus.map(item => (
                                <tr key={item.member.id} className={`group hover:bg-slate-50/30 transition-all ${item.status === 'overdue' ? 'bg-rose-50/20' : ''}`}>
                                    <td className="pl-12 pr-6 py-10">
                                        <p className={`font-bold text-lg transition-colors tracking-tight truncate max-w-[200px] leading-tight ${item.status === 'overdue' ? 'text-rose-600 group-hover:text-rose-700' : 'text-slate-800 group-hover:text-emerald-600'}`}>
                                            {item.member.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">
                                            {item.member.memberId}
                                        </p>
                                    </td>
                                    <td className="px-6 py-10">
                                        {item.lastPayment ? (
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-700 italic">
                                                    {new Date(item.lastPayment.dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    Vencimento: {new Date(item.lastPayment.dueDate).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onGenerateInstallments(item.member.id, item.member.name)}
                                                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-2 group/gen underline"
                                            >
                                                <RotateCcw size={12} className="group-hover/gen:rotate-180 transition-transform duration-500" /> Gerar 12 Parcelas
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-10 text-right">
                                        <span className="text-sm font-bold text-slate-900 tracking-tight">
                                            R$ {item.lastPayment?.amount?.toFixed(2) || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-10">
                                        <div className="flex justify-center">
                                            <span className={`px-5 py-2.5 rounded-[22px] text-[9px] font-bold uppercase tracking-widest flex items-center gap-3 border shadow-sm ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                {item.status === 'paid' ? 'EM DIA' : 'EM ATRASO'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="pr-12 pl-6 py-10">
                                        <div className="flex items-center justify-end gap-3">
                                            {item.status !== 'paid' && (
                                                <button
                                                    onClick={() => onQuickPay(item.member.id)}
                                                    className="px-6 py-3 bg-[#0F172A] text-white rounded-[20px] text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg flex items-center gap-3 active:scale-95 group/pay"
                                                >
                                                    <CreditCard size={14} className="group-hover/pay:rotate-12 transition-transform" /> Pagar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedMemberId(item.member.id)}
                                                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View para Mobile */}
                <div className="lg:hidden divide-y divide-slate-100">
                    {memberFinancialStatus.map(item => (
                        <div key={item.member.id} className={`p-8 space-y-6 ${item.status === 'overdue' ? 'bg-rose-50/20' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className={`font-bold text-lg leading-tight ${item.status === 'overdue' ? 'text-rose-600' : 'text-slate-800'}`}>
                                        {item.member.name}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
                                        {item.member.memberId}
                                    </p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-sm border ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                    {item.status === 'paid' ? 'EM DIA' : 'ATRASADO'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-2xl border border-slate-50">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Última Parcela</p>
                                    <p className="text-xs font-bold text-slate-700 italic">
                                        {item.lastPayment ? (
                                            new Date(item.lastPayment.dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                                        ) : (
                                            <button
                                                onClick={() => onGenerateInstallments(item.member.id, item.member.name)}
                                                className="text-[9px] font-bold text-orange-500 hover:text-orange-600 underline"
                                            >
                                                Gerar Parcelas
                                            </button>
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white/50 p-4 rounded-2xl border border-slate-50">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Valor Médio</p>
                                    <p className="text-xs font-bold text-slate-900">
                                        R$ {item.lastPayment?.amount?.toFixed(2) || '89.90'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setSelectedMemberId(item.member.id)}
                                    className="w-full px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                                >
                                    <Eye size={14} /> Histórico
                                </button>
                                {item.allPayments.some((p: any) => p.status !== PaymentStatus.PAID) && (
                                    <button
                                        onClick={() => onQuickPay(item.member.id)}
                                        className="w-full px-6 py-4 bg-[#0F172A] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                                    >
                                        <CreditCard size={14} /> Pagar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default memo(FinanceManager);
