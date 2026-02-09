import React, { memo } from 'react';
import { Search, UserPlus, Fingerprint, ShieldAlert, ShieldCheck, Pencil, Key, Trash2 } from 'lucide-react';
import { User, MemberStatus } from '../../types';

interface MemberListProps {
    members: User[];
    memberSearch: string;
    setMemberSearch: (val: string) => void;
    onToggleMemberStatus: (id: string, currentStatus: MemberStatus) => void;
    setEditingMember: (user: User) => void;
    setIsCreatingMember: (val: boolean) => void;
    onResetPassword: (id: string) => void;
    onDeleteUser: (id: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({
    members,
    memberSearch,
    setMemberSearch,
    onToggleMemberStatus,
    setEditingMember,
    setIsCreatingMember,
    onResetPassword,
    onDeleteUser
}) => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-white/40 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-600/5 rounded-full -ml-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col relative z-10">
                    <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Gestão de Associados</h2>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.4em] mt-2 opacity-70">Painel de Controle v2.0</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10 mt-6 md:mt-0">
                    <div className="relative group/search w-full md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-orange-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Localizar associado..."
                            className="w-full pl-16 pr-8 py-5 bg-white/50 border border-slate-100 rounded-[28px] outline-none focus:ring-4 focus:ring-orange-50 font-bold text-sm transition-all placeholder:text-slate-300"
                            value={memberSearch}
                            onChange={e => setMemberSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setEditingMember(null as any); setIsCreatingMember(true); }}
                        className="w-full md:w-auto px-8 py-5 bg-[#0F172A] text-white rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <UserPlus size={18} /> Novo Membro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-load">
                {members.length > 0 ? (
                    members.map((m) => (
                        <div key={m.id} className="glass-card-light rounded-[52px] border-white/40 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-600/10 transition-colors"></div>

                            {/* Card Content */}
                            <div className="p-6 md:p-10 flex-1 relative z-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-orange-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <img
                                            src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=ea580c&color=fff`}
                                            className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] object-cover border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                                            alt=""
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-2xl flex items-center justify-center border-[3px] border-white shadow-lg relative z-20 ${m.status === MemberStatus.ACTIVE ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}>
                                            {m.status === MemberStatus.ACTIVE ? <ShieldCheck size={12} className="text-white" /> : <ShieldAlert size={12} className="text-white" />}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 px-2 py-1">
                                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold tracking-[0.2em] border ${m.role === 'ADMIN' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {m.role === 'MEMBER' ? 'USUÁRIO' : m.role}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <Fingerprint size={12} className="text-slate-300" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{m.loginCount || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tighter leading-none group-hover:text-orange-600 transition-colors truncate">
                                        {m.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-[2px] bg-orange-600/30"></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] italic truncate">
                                            {m.memberId || 'SEM IDENTIDADE'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Row - Elegantly Grouped */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100/50 flex gap-3 relative z-10 backdrop-blur-sm">
                                <button
                                    onClick={() => onToggleMemberStatus(m.id, m.status)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm ${m.status === MemberStatus.ACTIVE
                                        ? 'bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                                        : 'bg-white border border-emerald-100 text-emerald-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                        }`}
                                >
                                    {m.status === MemberStatus.ACTIVE ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                                    {m.status === MemberStatus.ACTIVE ? 'Bloquear' : 'Ativar'}
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingMember(m)}
                                        className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-[22px] hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm group/edit"
                                        title="Editar Cadastro"
                                    >
                                        <Pencil size={18} className="group-hover/edit:rotate-12 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => onResetPassword(m.id)}
                                        className="w-12 h-12 flex items-center justify-center bg-white border border-orange-50 text-orange-400 rounded-[22px] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                                        title="Resetar Senha"
                                    >
                                        <Key size={18} />
                                    </button>

                                    <button
                                        onClick={() => onDeleteUser(m.id)}
                                        className="w-12 h-12 flex items-center justify-center bg-white border border-rose-50 text-rose-400 rounded-[22px] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                        title="Excluir Cadastro"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 glass-card-light rounded-[64px] border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                            <UserPlus size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold italic uppercase text-slate-400 tracking-tighter">Nenhum associado na rede</h3>
                        <p className="text-slate-400 text-xs font-medium mt-3 max-w-xs uppercase tracking-widest opacity-60">Sincronize sua base de dados ou adicione manualmente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Redundant custom icons removed. Using lucide-react instead.
export default memo(MemberList);
