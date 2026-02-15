import React, { memo } from 'react';
import { X, Camera, Key, Users, UserPlus, Trash2 } from 'lucide-react';
import { User, UserRole, MemberStatus } from '../../types';

interface MemberEditorProps {
    editingMember: User | null;
    memberForm: Partial<User>;
    setMemberForm: React.Dispatch<React.SetStateAction<Partial<User>>>;
    isSaving: boolean;
    onSave: () => void;
    onClose: () => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'member') => void;
}

const MemberEditor: React.FC<MemberEditorProps> = ({
    editingMember,
    memberForm,
    setMemberForm,
    isSaving,
    onSave,
    onClose,
    handleImageUpload
}) => {
    const addDependent = () => {
        const nextSuffix = (memberForm.dependents || []).reduce((max, d) => {
            const match = d.memberId?.match(/-D(\d+)$/);
            return match ? Math.max(max, parseInt(match[1])) : max;
        }, 0) + 1;

        const newDep: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            email: '',
            role: UserRole.MEMBER,
            status: memberForm.status || MemberStatus.ACTIVE,
            memberId: `${memberForm.memberId}-D${nextSuffix}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
            relationship: 'Filho'
        };
        setMemberForm(prev => ({
            ...prev,
            dependents: [...(prev.dependents || []), newDep]
        }));
    };

    const removeDependent = (id: string) => {
        setMemberForm(prev => ({
            ...prev,
            dependents: prev.dependents?.filter(d => d.id !== id)
        }));
    };

    const updateDependent = (idx: number, updates: Partial<User>) => {
        const newDeps = [...(memberForm.dependents || [])];
        newDeps[idx] = { ...newDeps[idx], ...updates };
        setMemberForm(prev => ({ ...prev, dependents: newDeps }));
    };

    const avatarInputRef = React.useRef<HTMLInputElement>(null);

    console.log('MemberEditor: Renderizando formulário. Avatar presente:', !!memberForm.avatar);
    if (memberForm.avatar && memberForm.avatar.length > 100) {
        console.log('MemberEditor: Avatar parece ser Base64 válido (tamanho):', memberForm.avatar.length);
    }

    return (
        <div className="fixed inset-0 bg-[#0A101E]/80 backdrop-blur-xl z-[60] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl md:rounded-[56px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500 h-full md:h-auto max-h-none md:max-h-[95vh]">
                <div className="w-full md:w-[320px] bg-[#0A101E] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none whitespace-pre-line">
                            {editingMember ? 'Editar\nAssociado' : 'Novo\nAssociado'}
                        </h2>
                        <p className="text-orange-400 font-bold text-[10px] uppercase tracking-[0.4em] italic">Membro do Clube</p>
                    </div>
                </div>

                <div className="flex-1 p-8 md:p-16 overflow-y-auto no-scrollbar bg-white">
                    <div className="flex justify-end mb-8">
                        <button onClick={onClose} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-10">
                        <div className="flex flex-col items-center mb-12">
                            <div
                                className="group relative cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
                            >
                                <div className="relative">
                                    {memberForm.avatar ? (
                                        <img
                                            src={memberForm.avatar}
                                            className="w-32 h-32 object-cover rounded-[40px] border-4 border-slate-50 shadow-xl transition-transform group-hover:scale-105"
                                            alt="Avatar Preview"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-orange-500 transition-all">
                                            <Camera size={32} className="text-slate-300 group-hover:text-orange-500" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                        <Camera size={18} />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => handleImageUpload(e, 'member')}
                                />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">Foto do Associado</p>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Informações Pessoais</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nível de Acesso</label>
                                        </div>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={memberForm.role || UserRole.MEMBER}
                                            onChange={e => setMemberForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                                        >
                                            <option value={UserRole.MEMBER}>Usuário</option>
                                            <option value={UserRole.ADMIN}>Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nome</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={memberForm.name || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Nome..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Sobrenome</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={memberForm.surname || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, surname: e.target.value }))}
                                            placeholder="Sobrenome..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">CPF</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={memberForm.cpf || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, cpf: e.target.value }))}
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">RG</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={memberForm.rg || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, rg: e.target.value }))}
                                            placeholder="RG..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">E-mail de acesso</label>
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all lowercase"
                                            value={memberForm.email || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="email@exemplo.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1 px-4">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Acesso Temporário (Senha)</label>
                                        </div>
                                        <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50 space-y-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex-1 relative group">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border border-slate-200 rounded-[22px] pl-8 pr-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all shadow-sm"
                                                        value={memberForm.password || ''}
                                                        onChange={e => setMemberForm(prev => ({ ...prev, password: e.target.value, mustChangePassword: true }))}
                                                        placeholder="Digite uma senha ou use o gerador"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setMemberForm(prev => ({ ...prev, password: 'Amabe' + Math.floor(Math.random() * 900 + 100) + '*', mustChangePassword: true }))}
                                                    className="px-8 bg-[#0A101E] text-white rounded-[22px] text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                                                >
                                                    <Key size={14} className="text-orange-400" />
                                                    Gerar
                                                </button>
                                            </div>
                                            <p className="text-[8px] font-bold text-slate-400 px-4 italic">* Definir a senha inicial do associado para o primeiro acesso.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Cadastro SIM</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase"
                                            value={memberForm.simRegistry || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, simRegistry: e.target.value }))}
                                            placeholder="000.000.000"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nascimento</label>
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all font-medium"
                                            value={memberForm.birthDate || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, birthDate: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Cidade</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase"
                                            value={memberForm.city || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, city: e.target.value }))}
                                            placeholder="Cidade..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-8 flex items-end pb-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Endereço Completo</label>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase font-medium"
                                        value={memberForm.address || ''}
                                        onChange={e => setMemberForm(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Rua, número, bairro, cidade - UF"
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Contato e Redes</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">WhatsApp</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={memberForm.whatsapp || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Instagram</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all lowercase"
                                            value={memberForm.instagram || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, instagram: e.target.value }))}
                                            placeholder="@usuario"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Facebook</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={memberForm.facebook || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, facebook: e.target.value }))}
                                            placeholder="Facebook..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Website / Outros</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all lowercase"
                                            value={memberForm.website || ''}
                                            onChange={e => setMemberForm(prev => ({ ...prev, website: e.target.value }))}
                                            placeholder="https://exemplo.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 pb-10">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Gestão de Dependentes</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addDependent}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        <UserPlus size={12} /> Adicionar Dependente
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {memberForm.dependents && memberForm.dependents.length > 0 ? (
                                        memberForm.dependents.map((dep, idx) => (
                                            <div key={dep.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row gap-6 relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => removeDependent(dep.id)}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-rose-500 rounded-full shadow-md flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-rose-100 z-10"
                                                >
                                                    <X size={14} />
                                                </button>

                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white">
                                                        <img src={dep.avatar} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{dep.memberId}</span>
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-100"
                                                            value={dep.name}
                                                            onChange={e => updateDependent(idx, { name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Vínculo</label>
                                                        <select
                                                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-100"
                                                            value={dep.relationship}
                                                            onChange={e => updateDependent(idx, { relationship: e.target.value as any })}
                                                        >
                                                            <option value="Filho">Filho(a)</option>
                                                            <option value="Pai/Mãe">Pai/Mãe</option>
                                                            <option value="Outro">Outro</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">CPF</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-100"
                                                            value={dep.cpf || ''}
                                                            onChange={e => updateDependent(idx, { cpf: e.target.value })}
                                                            placeholder="000.000.000-00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-10 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-center">
                                            <Users size={24} className="text-slate-200 mb-2" />
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Nenhum dependente vinculado</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={onSave}
                                disabled={isSaving}
                                className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#0A101E] transition-all transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSaving ? 'Salvando...' : (editingMember ? 'Salvar Alterações' : 'Criar Usuário Elite')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(MemberEditor);
