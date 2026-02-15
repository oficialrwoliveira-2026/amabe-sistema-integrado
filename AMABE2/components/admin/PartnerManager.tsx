import React, { memo } from 'react';
import { Building2, Search, Ticket, MapPin, Edit2, CheckCircle, Trash2, X, Camera, Image, Plus, Trash, Key, Globe, Instagram, Facebook, Filter, Check } from 'lucide-react';
import { Partner } from '../../types';
import { CATEGORIES, PARA_CITIES, DEFAULT_COMPANY_LOGO } from '../../constants';

interface PartnerManagerProps {
    partners: Partner[];
    partnerSearch: string;
    setPartnerSearch: (val: string) => void;
    isCreatingPartner: boolean;
    setIsCreatingPartner: (val: boolean) => void;
    editingPartner: Partner | null;
    setEditingPartner: (p: Partner | null) => void;
    partnerForm: Partial<Partner>;
    setPartnerForm: React.Dispatch<React.SetStateAction<Partial<Partner>>>;
    isSaving: boolean;
    onSave: () => void;
    onApprove: (id: string) => void;
    onDelete: (id: string) => void;
    onResetPassword?: (id: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'partner' | 'gallery') => void;
    onRemoveGalleryImage?: (index: number) => void;
    showAlert: (title: string, msg: string, type?: any) => void;
}

const PartnerManager: React.FC<PartnerManagerProps> = ({
    partners,
    partnerSearch,
    setPartnerSearch,
    isCreatingPartner,
    setIsCreatingPartner,
    editingPartner,
    setEditingPartner,
    partnerForm,
    setPartnerForm,
    isSaving,
    onSave,
    onApprove,
    onDelete,
    onResetPassword,
    handleImageUpload,
    onRemoveGalleryImage,
    showAlert
}) => {
    const filteredPartners = (partners || []).filter(p =>
        (p.name || '').toLowerCase().includes(partnerSearch.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(partnerSearch.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/20 shadow-sm relative overflow-hidden group">
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 italic uppercase">Gestão de Parceiros</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Rede de Benefícios AMABE</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10 mt-6 md:mt-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar parceiro..."
                            className="w-full pl-16 pr-8 py-5 bg-white/50 border border-slate-100 rounded-[28px] outline-none focus:ring-4 focus:ring-orange-50 font-bold text-sm transition-all shadow-sm"
                            value={partnerSearch}
                            onChange={e => setPartnerSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setIsCreatingPartner(true); setEditingPartner(null); }}
                        className="w-full md:w-auto px-8 py-5 bg-[#0F172A] text-white rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Building2 size={16} /> Novo Parceiro
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-load">
                {filteredPartners.map((partner) => (
                    <div key={partner.id} className="glass-card-light rounded-[52px] border-white/40 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col overflow-hidden relative h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-600/10 transition-colors"></div>

                        <div className="p-6 md:p-10 flex-1 relative z-10">
                            <div className="flex items-start justify-between mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-600/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] overflow-hidden border-4 border-white shadow-xl bg-white p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={partner.logo || DEFAULT_COMPANY_LOGO}
                                            className="w-full h-full object-contain"
                                            alt=""
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target.src !== DEFAULT_COMPANY_LOGO) {
                                                    target.src = DEFAULT_COMPANY_LOGO;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-2xl flex items-center justify-center border-[3px] border-white shadow-lg relative z-20 ${partner.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`}>
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 px-2 py-1">
                                    <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold tracking-[0.2em] border ${partner.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'} `}>
                                        {partner.status === 'ACTIVE' ? 'PLATINUM' : 'PENDENTE'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tighter leading-none group-hover:text-orange-600 transition-colors truncate">
                                        {partner.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-[2px] bg-orange-600/30"></div>
                                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] italic">{partner.category}</p>
                                    </div>
                                </div>

                                {partner.description && (
                                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed line-clamp-2">
                                        {partner.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/40 p-4 rounded-3xl border border-white/60 group-hover:bg-white/60 transition-colors">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Benefício</div>
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <Ticket size={14} className="shrink-0" />
                                        <span className="text-[10px] font-bold uppercase truncate">{partner.discount || 'CONFERIR'}</span>
                                    </div>
                                </div>
                                <div className="bg-white/40 p-4 rounded-3xl border border-white/60 group-hover:bg-white/60 transition-colors">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Cidade</div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={14} className="shrink-0" />
                                        <span className="text-[10px] font-bold uppercase truncate">{partner.city || 'PARÁ'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100/50 flex gap-3 relative z-10 backdrop-blur-sm">
                            <button
                                onClick={() => { setEditingPartner(partner); setPartnerForm({ ...partner, password: '' }); setIsCreatingPartner(true); }}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 text-slate-400 rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm group/btn"
                            >
                                <Building2 size={14} className="group-hover/btn:scale-110 transition-transform" /> Dashboard
                            </button>
                            <button
                                onClick={() => onApprove(partner.id)}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-emerald-50 text-emerald-500 rounded-[22px] hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                                title="Aprovação Rápida"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => onResetPassword && onResetPassword(partner.id)}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-orange-50 text-orange-500 rounded-[22px] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                                title="Redefinir Senha"
                            >
                                <Key size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(partner.id)}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-rose-50 text-rose-400 rounded-[22px] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                title="Excluir Cadastro"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isCreatingPartner && (
                <div className="fixed inset-0 bg-[#0A101E]/80 backdrop-blur-xl z-[60] flex items-center justify-center p-0 md:p-6">
                    <div className="bg-white w-full max-w-5xl md:rounded-[56px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-500 h-full md:h-auto max-h-none md:max-h-[95vh]">
                        <div className="w-full md:w-[320px] bg-[#0A101E] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                                    {editingPartner ? 'Editar\nParceiro' : 'Novo\nParceiro'}
                                </h2>
                                <p className="text-orange-400 font-bold text-[10px] uppercase tracking-[0.4em] italic mb-10">Conexão Estratégica</p>
                            </div>

                            <div className="relative z-10 space-y-8 flex md:block flex-col items-center">
                                <div className="p-6 md:p-8 bg-white/5 rounded-[40px] border border-white/10 text-center group relative cursor-pointer overflow-hidden w-full max-w-[240px] md:max-w-none" onClick={(e) => { e.stopPropagation(); document.getElementById('partner-logo')?.click(); }}>
                                    <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-4 md:mb-6">Logomarca</p>
                                    {partnerForm.logo ? (
                                        <div className="relative">
                                            <img
                                                src={partnerForm.logo || DEFAULT_COMPANY_LOGO}
                                                className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain bg-white rounded-2xl p-4 shadow-2xl"
                                                alt=""
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (target.src !== DEFAULT_COMPANY_LOGO) {
                                                        target.src = DEFAULT_COMPANY_LOGO;
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                                <Edit2 size={24} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-orange-500 transition-colors">
                                            <Camera size={32} className="text-white/20 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    )}
                                    <input type="file" id="partner-logo" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'partner')} />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 md:p-16 overflow-y-auto no-scrollbar bg-white">
                            <div className="flex justify-end mb-8">
                                <button onClick={() => { setIsCreatingPartner(false); setEditingPartner(null); }} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nome do Estabelecimento</label>
                                        </div>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={partnerForm.name || ''}
                                            onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                                            placeholder="Ex: Farmácia do Povo"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">E-mail de Acesso</label>
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={partnerForm.email || ''}
                                            onChange={e => setPartnerForm({ ...partnerForm, email: e.target.value })}
                                            placeholder="parceiro@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Categoria</label>
                                        </div>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={partnerForm.category || 'Saúde'}
                                            onChange={e => setPartnerForm({ ...partnerForm, category: e.target.value })}
                                        >
                                            {CATEGORIES.filter(c => c !== 'Todos').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Benefício Principal</label>
                                        </div>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={partnerForm.discount || ''}
                                            onChange={e => setPartnerForm({ ...partnerForm, discount: e.target.value })}
                                            placeholder="Ex: 20% de Desconto Real"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Cidade (Pará)</label>
                                        </div>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                            value={partnerForm.city || ''}
                                            onChange={e => setPartnerForm({ ...partnerForm, city: e.target.value })}
                                        >
                                            <option value="">Selecione...</option>
                                            {PARA_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 flex items-end pb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">WhatsApp de Contato</label>
                                        </div>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                                            value={partnerForm.whatsapp || ''}
                                            onChange={e => setPartnerForm({ ...partnerForm, whatsapp: e.target.value })}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-8 flex items-end pb-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Endereço Completo</label>
                                    </div>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all uppercase italic"
                                        value={partnerForm.address || ''}
                                        onChange={e => setPartnerForm({ ...partnerForm, address: e.target.value })}
                                        placeholder="Endereço..."
                                    />
                                </div>

                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all min-h-[120px] resize-none"
                                    value={partnerForm.description || ''}
                                    onChange={e => setPartnerForm({ ...partnerForm, description: e.target.value })}
                                    placeholder="Breve descrição dos serviços..."
                                />
                            </div>

                            {/* Seção de Segurança */}
                            <div className="space-y-6 pt-8 border-t border-slate-100">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                        <Key size={20} />
                                    </div>
                                    <label className="text-sm font-black uppercase tracking-widest italic text-slate-800">Senha de Acesso</label>
                                </div>

                                <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50 space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative group">
                                            <input
                                                type="text"
                                                className="w-full bg-white border border-slate-200 rounded-[24px] pl-8 pr-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all shadow-sm"
                                                value={partnerForm.password || ''}
                                                onChange={e => setPartnerForm({ ...partnerForm, password: e.target.value })}
                                                placeholder="Digite uma senha ou use o gerador"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Edit2 size={16} className="text-slate-300" />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPartnerForm({ ...partnerForm, password: 'Amabe' + Math.floor(Math.random() * 900 + 100) + '*' })}
                                            className="px-10 bg-[#0A101E] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 whitespace-nowrap"
                                        >
                                            <Key size={14} className="text-orange-400" />
                                            Gerar Automático
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 bg-orange-50/50 py-3 rounded-2xl border border-orange-100/50">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest italic">
                                            * Deixe em branco para manter a senha atual ou digite/gere uma nova.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Galeria de Fotos */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3 text-slate-800">
                                        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                            <Image size={20} />
                                        </div>
                                        <label className="text-sm font-black uppercase tracking-widest italic">Galeria do Espaço</label>
                                    </div>
                                    <button
                                        onClick={() => document.getElementById('gallery-upload')?.click()}
                                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                                    >
                                        <Plus size={14} /> Adicionar Foto
                                    </button>
                                    <input
                                        type="file"
                                        id="gallery-upload"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={e => handleImageUpload(e, 'gallery')}
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-2">
                                    {(partnerForm.gallery || []).map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-[32px] overflow-hidden bg-slate-100 group border-4 border-white shadow-md hover:shadow-xl transition-all hover:scale-[1.02]">
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => onRemoveGalleryImage?.(idx)}
                                                    className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {(!partnerForm.gallery || partnerForm.gallery.length === 0) && (
                                        <div className="col-span-full py-12 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-slate-300">
                                            <Image size={40} className="mb-4 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Nenhuma foto adicionada</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={onSave}
                                disabled={isSaving}
                                className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#0A101E] transition-all transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar Parceiro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(PartnerManager);
