
import React, { useState, useEffect, useRef } from 'react';
import { User, BenefitUsage, MemberStatus, DashboardTab, Partner, Offer } from '../types';
import { CATEGORIES } from '../constants';
import {
   ShieldCheck,
   TrendingUp,
   Users,
   Smartphone,
   X,
   Check,
   Search,
   History,
   Ticket,
   Building2,
   MapPin,
   Phone,
   MessageCircle,
   Hash,
   Tag,
   Image as ImageIcon,
   PlusCircle,
   Save,
   Store,
   TicketPlus,
   Calendar,
   Trash2,
   UploadCloud,
   Instagram,
   Facebook,
   Camera,
   Plus,
   Lock,
   Eye,
   EyeOff,
   ImagePlus,
   Globe,
   Trophy,
   PieChart,
   Award
} from 'lucide-react';

interface PartnerDashboardProps {
   activeTab: DashboardTab;
   user: User;
   history: BenefitUsage[];
   members: User[];
   partners: Partner[];
   onValidate: (usage: BenefitUsage) => void;
   onUpdatePartner: (partner: Partner) => void;
   showAlert: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
   showConfirm: (title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) => void;
   onLoadFullProfile?: (userId: string) => Promise<any>;
   onLogout?: () => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
   activeTab,
   user,
   history,
   members,
   partners,
   onValidate,
   onUpdatePartner,
   showAlert,
   showConfirm,
   onLoadFullProfile,
   onLogout
}) => {
   const [showScanner, setShowScanner] = useState(false);
   const [manualId, setManualId] = useState('');
   const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; type: 'MEMBER' | 'VOUCHER' } | null>(null);

   const currentPartner = partners.find(p => p.name === (user.companyName || user.name)) || partners[1];
   const [formData, setFormData] = useState<Partner>(currentPartner);
   const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
   const [showPass, setShowPass] = useState(false);

   const logoInputRef = useRef<HTMLInputElement>(null);
   const galleryInputRef = useRef<HTMLInputElement>(null);

   const [showOfferForm, setShowOfferForm] = useState(false);
   const [newOffer, setNewOffer] = useState<Partial<Offer>>({
      title: '',
      discount: '',
      description: '',
      rules: '',
      expiryDate: '',
      isActive: true
   });

   useEffect(() => {
      if (currentPartner) setFormData(currentPartner);
   }, [currentPartner]);

   useEffect(() => {
      if (user.id && onLoadFullProfile && (!user.offers || (user as any).offers?.length === 0)) {
         onLoadFullProfile(user.id);
      }
   }, [user.id, onLoadFullProfile]);

   const handleValidate = () => {
      const input = manualId.trim().toUpperCase();
      const isVoucher = input.length > 8 && !input.match(/AMB-\d{4}-\d{3}/);
      let member: User | undefined;

      if (isVoucher) {
         member = members.find(m => m.status === MemberStatus.ACTIVE);
         if (!input.startsWith('AMB-')) {
            setValidationResult({ success: false, message: 'Código de cupom inválido.', type: 'VOUCHER' });
            return;
         }
      } else {
         member = members.find(m => m.memberId?.toUpperCase() === input);
      }

      if (!member) {
         setValidationResult({
            success: false,
            message: isVoucher ? 'Cupom expirado ou inexistente.' : 'Matrícula não localizada.',
            type: isVoucher ? 'VOUCHER' : 'MEMBER'
         });
         return;
      }

      if (member.status !== MemberStatus.ACTIVE) {
         setValidationResult({
            success: false,
            message: 'Cadastro INATIVO. Bloqueado.',
            type: isVoucher ? 'VOUCHER' : 'MEMBER'
         });
         return;
      }

      const usage: BenefitUsage = {
         id: Math.random().toString(36).substr(2, 9),
         memberId: member.memberId!,
         memberName: member.name,
         beneficiaryName: member.name,
         beneficiaryId: member.memberId!,
         partnerName: user.companyName || user.name,
         date: new Date().toLocaleString('pt-BR'),
         status: 'VALIDADO'
      };

      onValidate(usage);
      setValidationResult({
         success: true,
         message: isVoucher
            ? `Validado para ${member.name.split(' ')[0]}!`
            : `Liberado para ${member.name.split(' ')[0]}.`,
         type: isVoucher ? 'VOUCHER' : 'MEMBER'
      });
      setManualId('');
   };

   // Fixed the error by explicitly casting file as Blob to satisfy TypeScript's Blob requirement
   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData(prev => ({ ...prev, logo: reader.result as string }));
         };
         reader.readAsDataURL(file as Blob);
      }
   };

   // Fixed potential error in loop by casting file as Blob and ensuring explicit type in Array.from
   const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
         Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
               setFormData(prev => ({
                  ...prev,
                  gallery: [...(prev.gallery || []), reader.result as string].slice(0, 8)
               }));
            };
            reader.readAsDataURL(file as Blob);
         });
      }
   };

   const removeGalleryImage = (index: number) => {
      setFormData(prev => ({
         ...prev,
         gallery: (prev.gallery || []).filter((_, i) => i !== index)
      }));
   };

   const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwords.new && passwords.new !== passwords.confirm) {
         showAlert('Senhas Diferentes', 'As novas senhas não coincidem!', 'warning');
         return;
      }
      onUpdatePartner(formData);
      showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success');
      setPasswords({ current: '', new: '', confirm: '' });
   };

   const handleCreateOffer = (e: React.FormEvent) => {
      e.preventDefault();
      const offer: Offer = {
         ...newOffer as Offer,
         id: Math.random().toString(36).substr(2, 9),
         isActive: true
      };
      const updatedPartner = {
         ...formData,
         offers: [...(formData.offers || []), offer]
      };
      onUpdatePartner(updatedPartner);
      setFormData(updatedPartner);
      setShowOfferForm(false);
      setNewOffer({ title: '', discount: '', description: '', rules: '', expiryDate: '', isActive: true });
   };

   const deleteOffer = (id: string) => {
      showConfirm(
         'Excluir Oferta',
         'Deseja realmente excluir esta oferta? Esta ação não pode ser desfeita.',
         () => {
            const updatedPartner = {
               ...formData,
               offers: (formData.offers || []).filter(o => o.id !== id)
            };
            onUpdatePartner(updatedPartner);
            setFormData(updatedPartner);
         }
      );
   };

   const renderHome = () => (
      <div className="space-y-6 md:space-y-12 animate-in fade-in duration-500 max-w-full">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 bg-white p-6 md:p-12 rounded-[32px] md:rounded-[56px] border border-orange-50 shadow-sm">
            <div className="max-w-md text-center md:text-left">
               <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Painel Parceiro</h1>
               <p className="text-slate-400 font-medium mt-1.5 md:mt-2 text-xs md:text-lg italic leading-relaxed">Valide benefícios em segundos.</p>
            </div>
            <button
               onClick={() => setShowScanner(true)}
               className="w-full md:w-auto flex items-center justify-center space-x-3 md:space-x-4 bg-orange-600 text-white px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl md:shadow-2xl shadow-orange-600/30 hover:bg-orange-700 active:scale-95 transition-all"
            >
               <Smartphone size={20} className="md:hidden" />
               <Smartphone size={24} className="hidden md:block" />
               <span>Validar QR Code</span>
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
               { label: 'Validações', value: history.length, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
               { label: 'Membros', value: members.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
               { label: 'Selo', value: 'ATIVO', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
               <div key={i} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[48px] shadow-sm border border-slate-100 flex items-center space-x-4 md:space-x-8 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[28px] flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                     <stat.icon size={24} className="md:hidden" />
                     <stat.icon size={36} className="hidden md:block" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mb-1">{stat.label}</p>
                     <p className="text-xl md:text-4xl font-black text-slate-900 truncate tracking-tighter italic">{stat.value}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[56px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6 md:mb-12">
               <h3 className="text-lg md:text-2xl font-black text-slate-900 italic uppercase">Uso Recente</h3>
            </div>
            <div className="space-y-4 md:space-y-6">
               {history.length > 0 ? history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 md:p-8 bg-orange-50/20 rounded-2xl md:rounded-[40px] border border-orange-100/50 group hover:bg-white transition-all gap-3">
                     <div className="flex items-center space-x-3 md:space-x-8">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl md:rounded-3xl flex items-center justify-center border border-emerald-100 text-emerald-500 shadow-sm shrink-0">
                           <Check size={20} className="md:hidden" />
                           <Check size={32} className="hidden md:block" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm md:text-xl font-black text-slate-900 truncate italic uppercase leading-tight">{h.memberName}</p>
                           <p className="text-[7px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1 md:mt-1.5">{h.memberId}</p>
                        </div>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-sm md:text-lg font-black text-slate-900 italic">{h.date.split(' ')[1]}</p>
                        <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{h.date.split(' ')[0]}</p>
                     </div>
                  </div>
               )) : (
                  <div className="py-12 md:py-24 text-center border-2 md:border-4 border-dashed border-orange-50 rounded-3xl md:rounded-[48px]">
                     <p className="text-orange-300 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic text-[10px] md:text-base">Nenhuma atividade ainda</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );

   const renderValidation = () => (
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
         <div className="bg-white p-8 md:p-16 rounded-[48px] md:rounded-[64px] shadow-sm border border-slate-100 text-center">
            <header className="mb-10 md:mb-16">
               <div className="w-16 h-16 md:w-24 md:h-24 bg-orange-600 rounded-[32px] md:rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-orange-600/20 mx-auto mb-6 md:mb-8 group-hover:rotate-3 transition-transform">
                  <ShieldCheck size={48} />
               </div>
               <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">Validar Benefício</h2>
               <p className="text-slate-400 font-medium mt-2 md:mt-4 text-xs md:text-lg italic">Aponte a câmera para o QR Code ou digite o cupom.</p>
            </header>

            <div className="max-w-md mx-auto space-y-10 md:space-y-14">
               {!validationResult ? (
                  <>
                     <div
                        onClick={() => setShowScanner(true)}
                        className="aspect-square bg-slate-50 rounded-[40px] md:rounded-[60px] flex flex-col items-center justify-center border-4 border-dashed border-orange-100 relative overflow-hidden shadow-inner cursor-pointer hover:bg-orange-50/30 transition-all group"
                     >
                        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-orange-500/10 to-transparent animate-scan-bounce"></div>
                        <Smartphone size={80} className="text-orange-200 mb-6 group-hover:scale-110 transition-transform" />
                        <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl">Abrir Câmera</span>
                     </div>

                     <div className="space-y-6">
                        <div className="relative">
                           <Ticket size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
                           <input
                              type="text"
                              placeholder="CÓDIGO DO CUPOM"
                              className="w-full pl-16 pr-8 py-5 md:py-8 bg-slate-50 border border-slate-100 rounded-[28px] md:rounded-[40px] outline-none focus:ring-4 focus:ring-orange-100 font-black text-center text-sm md:text-xl uppercase tracking-[0.2em] transition-all shadow-inner"
                              value={manualId}
                              onChange={(e) => setManualId(e.target.value)}
                           />
                        </div>
                        <button
                           onClick={handleValidate}
                           disabled={!manualId}
                           className="w-full py-5 md:py-8 bg-[#0F172A] text-white rounded-[28px] md:rounded-[40px] font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center gap-3"
                        >
                           <Check size={20} />
                           Validar Agora
                        </button>
                     </div>
                  </>
               ) : (
                  <div className="py-10 animate-in zoom-in duration-500">
                     <div className={`w-24 h-24 md:w-36 md:h-36 rounded-[40px] md:rounded-[56px] flex items-center justify-center mx-auto shadow-2xl mb-8 ${validationResult.success ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
                        }`}>
                        {validationResult.success ? <Check size={80} strokeWidth={4} /> : <X size={80} strokeWidth={4} />}
                     </div>
                     <div className="space-y-4 mb-10">
                        <h4 className={`text-3xl md:text-5xl font-black italic tracking-tighter uppercase ${validationResult.success ? 'text-emerald-600' : 'text-red-600'}`}>
                           {validationResult.success ? 'VALIDADO!' : 'NEGADO'}
                        </h4>
                        <p className="text-slate-500 font-bold text-sm md:text-xl leading-relaxed italic px-4">{validationResult.message}</p>
                     </div>
                     <button
                        onClick={() => setValidationResult(null)}
                        className="w-full py-5 md:py-8 bg-slate-100 text-slate-900 rounded-[28px] md:rounded-[40px] font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-sm"
                     >
                        Nova Validação
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );

   const renderOffersManagement = () => (
      <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 max-w-full">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 bg-[#0F172A] p-8 md:p-12 rounded-[32px] md:rounded-[56px] text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-orange-600 hidden md:block"><TicketPlus size={200} /></div>
            <div className="relative z-10 text-center md:text-left">
               <h2 className="text-2xl md:text-5xl font-black tracking-tighter italic uppercase leading-tight">Minhas Ofertas</h2>
               <p className="text-slate-400 font-medium mt-1.5 md:mt-3 max-w-sm italic text-xs md:text-base">Crie promoções exclusivas para o clube.</p>
            </div>
            <button
               onClick={() => setShowOfferForm(true)}
               className="relative z-10 w-full md:w-auto px-6 md:px-10 py-4 md:py-6 bg-orange-600 text-white rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-xl md:shadow-2xl shadow-orange-600/30 active:scale-95"
            >
               <PlusCircle size={20} />
               <span>Nova Oferta</span>
            </button>
         </div>

         {showOfferForm && (
            <div className="bg-white p-6 md:p-16 rounded-[32px] md:rounded-[64px] shadow-2xl border-2 md:border-4 border-orange-50 animate-in zoom-in duration-500 overflow-y-auto max-h-[80vh] no-scrollbar">
               <div className="flex justify-between items-center mb-8 md:mb-12">
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 italic tracking-tight uppercase">Configurar Benefício</h3>
                  <button onClick={() => setShowOfferForm(false)} className="p-3 bg-orange-50 text-orange-400 rounded-full hover:bg-orange-600 hover:text-white transition-all"><X size={20} /></button>
               </div>

               <form onSubmit={handleCreateOffer} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] ml-2">Chamada da Oferta</label>
                        <input
                           type="text"
                           placeholder="Ex: Almoço 2x1"
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] outline-none font-black text-slate-700 italic uppercase text-xs md:text-base"
                           value={newOffer.title}
                           onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] ml-2">Valor/Desconto</label>
                        <input
                           type="text"
                           placeholder="Ex: 50% OFF"
                           className="w-full px-6 py-4 bg-orange-50 border border-orange-100 rounded-2xl md:rounded-[32px] outline-none font-black text-orange-700 italic uppercase text-xs md:text-base"
                           value={newOffer.discount}
                           onChange={e => setNewOffer({ ...newOffer, discount: e.target.value })}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] ml-2">Validade</label>
                        <input
                           type="date"
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] outline-none font-black text-slate-700 text-xs md:text-base"
                           value={newOffer.expiryDate}
                           onChange={e => setNewOffer({ ...newOffer, expiryDate: e.target.value })}
                           required
                        />
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] ml-2">Descrição</label>
                        <textarea
                           className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] md:rounded-[40px] outline-none font-bold text-slate-600 text-xs md:text-base min-h-[100px] md:min-h-[140px]"
                           value={newOffer.description}
                           onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] ml-2">Regras</label>
                        <textarea
                           className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] md:rounded-[40px] outline-none font-bold text-slate-500 text-[10px] md:text-sm min-h-[80px] md:min-h-[110px]"
                           value={newOffer.rules}
                           onChange={e => setNewOffer({ ...newOffer, rules: e.target.value })}
                           required
                        />
                     </div>
                  </div>
                  <div className="md:col-span-2 pt-4">
                     <button type="submit" className="w-full py-5 md:py-7 bg-orange-600 text-white rounded-[28px] md:rounded-[40px] font-black text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                        <Save size={20} />
                        <span>Publicar Oferta</span>
                     </button>
                  </div>
               </form>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {(formData.offers || []).length > 0 ? (formData.offers || []).map((offer) => (
               <div key={offer.id} className="bg-white rounded-[32px] md:rounded-[64px] p-8 md:p-12 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10">
                     <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-50 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                        <Ticket size={24} className="md:hidden" />
                        <Ticket size={32} className="hidden md:block" />
                     </div>
                     <button
                        onClick={() => deleteOffer(offer.id)}
                        className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tighter italic uppercase relative z-10">{offer.title}</h4>
                  <div className="inline-flex items-center gap-2 mb-6 bg-orange-50/50 px-4 py-1.5 rounded-full border border-orange-100/50 w-fit relative z-10">
                     <span className="text-[8px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest">{offer.discount}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed mb-8 flex-1 line-clamp-3 italic">"{offer.description}"</p>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-orange-400" />
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Venc: {new Date(offer.expiryDate).toLocaleDateString('pt-BR')}</span>
                     </div>
                     <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-100">Ativa</span>
                  </div>
               </div>
            )) : (
               <div className="col-span-full py-20 md:py-48 text-center bg-white rounded-[40px] md:rounded-[72px] border-2 md:border-4 border-dashed border-orange-50 px-6">
                  <h3 className="text-xl md:text-3xl font-black text-orange-900 tracking-tight italic uppercase">Sem ofertas no momento</h3>
                  <p className="text-slate-400 font-medium text-xs md:text-base mt-2 md:mt-4 italic">Crie agora sua primeira promoção vip.</p>
               </div>
            )}
         </div>
      </div>
   );

   const renderProfileEdit = () => (
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
         <div className="bg-white p-6 md:p-16 rounded-[48px] md:rounded-[64px] shadow-sm border border-slate-100 relative">
            <header className="mb-10 md:mb-16 border-b border-slate-50 pb-8 flex items-center justify-between">
               <div>
                  <h2 className="text-2xl md:text-5xl font-black text-[#0A101E] tracking-tighter italic uppercase leading-none">Dados Empresa</h2>
                  <p className="text-slate-400 font-medium mt-2 text-xs md:text-lg italic opacity-80">Personalize seu perfil no clube.</p>
               </div>
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
                  <Building2 size={28} />
               </div>
            </header>

            <form onSubmit={handleSaveProfile} className="space-y-12">
               {/* Upload de Logo */}
               <div className="flex flex-col md:flex-row items-center gap-10 border-b border-slate-50 pb-12">
                  <div className="relative group">
                     <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl md:rounded-[40px] border-4 border-slate-50 shadow-xl overflow-hidden bg-white group-hover:scale-[1.02] transition-transform duration-500">
                        <img src={formData.logo} className="w-full h-full object-contain p-2" alt="Logo" />
                     </div>
                     <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-10 h-10 md:w-14 md:h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-orange-700 active:scale-90 border-4 border-white transition-all"
                     >
                        <Camera size={18} />
                     </button>
                     <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="text-lg md:text-2xl font-black text-slate-800 uppercase italic tracking-tight">Logotipo da Marca</h3>
                     <p className="text-slate-400 text-xs md:text-base font-medium mt-2 italic max-w-sm">Recomendamos imagens quadradas (PNG ou JPG) com fundo branco para melhor visibilidade.</p>
                  </div>
               </div>

               {/* Informações Gerais */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Nome Fantasia</label>
                     <div className="relative group">
                        <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                        <input
                           type="text"
                           className="w-full pl-14 pr-5 py-4 md:pl-16 md:pr-8 md:py-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl md:rounded-[36px] outline-none font-black text-slate-700 italic uppercase text-xs md:text-base transition-all focus:ring-4 focus:ring-orange-50"
                           value={formData.name}
                           onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Área de Atuação</label>
                     <div className="relative">
                        <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                        <select
                           className="w-full pl-14 pr-8 py-4 md:pl-16 md:pr-8 md:py-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl md:rounded-[36px] outline-none font-black text-slate-700 uppercase appearance-none cursor-pointer text-xs md:text-base transition-all focus:ring-4 focus:ring-orange-50"
                           value={formData.category}
                           onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                           {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                  <div className="md:col-span-12 space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Localização</label>
                     <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                        <input
                           type="text"
                           className="w-full pl-14 pr-5 py-4 md:pl-16 md:pr-8 md:py-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl md:rounded-[36px] outline-none font-bold text-slate-600 text-[10px] md:text-sm italic"
                           value={formData.address || ''}
                           onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="md:col-span-4 space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">WhatsApp</label>
                     <div className="relative group">
                        <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                        <input
                           type="text"
                           className="w-full pl-14 pr-5 py-4 md:pl-16 md:pr-8 md:py-6 bg-[#F0FDF4] border border-[#10B981]/20 rounded-2xl md:rounded-[36px] outline-none font-black text-emerald-800 text-xs md:text-sm"
                           value={formData.whatsapp || ''}
                           onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="md:col-span-4 space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">CNPJ</label>
                     <div className="relative group">
                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                        <input
                           type="text"
                           className="w-full pl-14 pr-5 py-4 md:pl-16 md:pr-8 md:py-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl md:rounded-[36px] outline-none font-black text-slate-700 text-xs md:text-sm"
                           value={formData.cnpj || ''}
                           onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="md:col-span-4 space-y-2 md:space-y-4">
                     <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Desconto Padrão</label>
                     <input
                        type="text"
                        className="w-full px-6 py-4 md:px-8 md:py-6 bg-orange-50/30 border border-orange-100 rounded-2xl md:rounded-[36px] outline-none font-black text-orange-700 italic uppercase text-xs md:text-base"
                        value={formData.discount}
                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                     />
                  </div>
               </div>

               {/* Redes Sociais */}
               <div className="pt-6 border-t border-slate-50 space-y-8 md:space-y-10">
                  <div className="flex items-center gap-3">
                     <Globe size={18} className="text-orange-500" />
                     <h3 className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] italic">Redes Sociais e Presença Digital</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram (@usuario)</label>
                        <div className="relative group">
                           <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={16} />
                           <input
                              type="text"
                              placeholder="@amabeclube"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs transition-all focus:ring-4 focus:ring-pink-50"
                              value={formData.instagram || ''}
                              onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Facebook (Link ou Perfil)</label>
                        <div className="relative group">
                           <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={16} />
                           <input
                              type="text"
                              placeholder="facebook.com/amabe"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs transition-all focus:ring-4 focus:ring-blue-50"
                              value={formData.facebook || ''}
                              onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Website Oficial</label>
                        <div className="relative group">
                           <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                           <input
                              type="text"
                              placeholder="www.amabe.com"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs transition-all focus:ring-4 focus:ring-orange-50"
                              value={formData.website || ''}
                              onChange={e => setFormData({ ...formData, website: e.target.value })}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Bio da Empresa</label>
                  <textarea
                     className="w-full p-6 md:p-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[32px] md:rounded-[48px] outline-none font-bold text-slate-700 text-sm md:text-lg leading-relaxed min-h-[140px] md:min-h-[180px] italic shadow-inner no-scrollbar"
                     value={formData.description}
                     onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
               </div>

               {/* Segurança e Senha */}
               <div className="pt-6 border-t border-slate-50 space-y-8 md:space-y-10">
                  <div className="flex items-center gap-3">
                     <Lock size={18} className="text-orange-500" />
                     <h3 className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] italic">Segurança de Acesso</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha Atual</label>
                        <input
                           type={showPass ? 'text' : 'password'}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs"
                           value={passwords.current}
                           onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                        <input
                           type={showPass ? 'text' : 'password'}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs"
                           value={passwords.new}
                           onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2 relative">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova</label>
                        <input
                           type={showPass ? 'text' : 'password'}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-xs"
                           value={passwords.confirm}
                           onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPass(!showPass)}
                           className="absolute right-4 bottom-4 text-slate-300 hover:text-orange-600"
                        >
                           {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                  </div>
               </div>

               {/* Galeria de Fotos */}
               <div className="pt-6 border-t border-slate-50 space-y-8 md:space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <ImagePlus size={18} className="text-orange-500" />
                        <h3 className="text-[9px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] italic">Galeria do Estabelecimento</h3>
                     </div>
                     <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-[8px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-600 hover:text-white transition-all border border-orange-100"
                     >
                        Adicionar Fotos
                     </button>
                     <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                     {(formData.gallery || []).length > 0 ? (formData.gallery || []).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-3xl overflow-hidden relative group border border-slate-100 shadow-sm transition-all hover:scale-[1.03]">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                           <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                     )) : (
                        <div className="col-span-full py-16 text-center border-4 border-dashed border-slate-50 rounded-[40px] flex flex-col items-center justify-center bg-slate-50/30">
                           <ImageIcon size={48} className="text-slate-200 mb-4" strokeWidth={1} />
                           <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">Sua galeria está vazia</p>
                        </div>
                     )}
                  </div>
               </div>

               <div className="pt-10">
                  <button
                     type="submit"
                     className="w-full py-6 md:py-8 bg-orange-600 text-white rounded-[32px] md:rounded-[44px] font-black text-[11px] md:text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-orange-600/30 active:scale-95 transition-all hover:bg-orange-700"
                  >
                     <Save size={24} />
                     <span>Salvar Alterações</span>
                  </button>
               </div>
            </form>
         </div>
      </div>
   );

   return (
      <div className="w-full max-w-7xl mx-auto pb-10 md:pb-20">
         {activeTab === 'dash' && renderHome()}
         {activeTab === 'validate' && renderValidation()}
         {activeTab === 'offers' && renderOffersManagement()}
         {activeTab === 'partners' && renderProfileEdit()}
         {activeTab === 'history' && (
            <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500 max-w-full">
               {/* KPIs Financeiros */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {(() => {
                     const totalVouchers = history.length;
                     const now = new Date();
                     const currentMonth = now.getMonth();
                     const currentYear = now.getFullYear();

                     const monthlyUsage = history.filter(h => {
                        const datePart = h.date.split(',')[0].trim();
                        const [day, month, year] = datePart.split('/');
                        return parseInt(month) - 1 === currentMonth && parseInt(year) === currentYear;
                     }).length;

                     const memberStats = history.reduce((acc, curr) => {
                        acc[curr.memberId] = (acc[curr.memberId] || 0) + 1;
                        return acc;
                     }, {} as Record<string, number>);

                     const memberIds = Object.keys(memberStats);
                     const topMemberId = memberIds.length > 0
                        ? memberIds.reduce((a, b) => memberStats[a] > memberStats[b] ? a : b)
                        : '';
                     const topMember = history.find(h => h.memberId === topMemberId);
                     const topCount = topMemberId ? memberStats[topMemberId] : 0;

                     return (
                        <>
                           <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-md transition-all">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-2xl md:rounded-[28px] flex items-center justify-center shrink-0 text-orange-600">
                                 <PieChart size={32} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Vouchers</p>
                                 <p className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter">{totalVouchers}</p>
                              </div>
                           </div>
                           <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-md transition-all">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-[28px] flex items-center justify-center shrink-0 text-emerald-600">
                                 <TrendingUp size={32} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uso no Mês</p>
                                 <p className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter">{monthlyUsage}</p>
                              </div>
                           </div>
                           <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-md transition-all">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-2xl md:rounded-[28px] flex items-center justify-center shrink-0 text-amber-600">
                                 <Trophy size={32} />
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membro VIP</p>
                                 <p className="text-lg md:text-xl font-black text-slate-900 italic truncate leading-none mb-1 uppercase tracking-tighter">{topMember?.memberName || 'Nenhum'}</p>
                                 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">{topCount} utilizações</p>
                              </div>
                           </div>
                        </>
                     );
                  })()}
               </div>

               {/* Histórico Recente */}
               <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[64px] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8 md:mb-12">
                     <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
                        <History size={24} className="text-orange-600" />
                        Atividades
                     </h2>
                     <span className="px-5 py-2 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">{history.length} Registros</span>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                     {history.length > 0 ? history.map((h) => (
                        <div key={h.id} className="p-6 md:p-10 bg-slate-50/50 rounded-3xl md:rounded-[44px] border border-slate-100/50 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white transition-all gap-4 group">
                           <div className="flex items-center gap-4 md:gap-8">
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-200 text-slate-400 group-hover:border-orange-200 group-hover:text-orange-600 shadow-sm shrink-0 transition-all">
                                 <Award size={20} className="md:hidden" />
                                 <Award size={28} className="hidden md:block" />
                              </div>
                              <div className="min-w-0">
                                 <p className="font-black text-lg md:text-2xl text-slate-900 italic uppercase leading-none truncate tracking-tighter">{h.memberName}</p>
                                 <p className="text-[8px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 md:mt-3 group-hover:text-orange-400 transition-colors">{h.memberId}</p>
                              </div>
                           </div>
                           <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                              <p className="font-black text-sm md:text-xl text-slate-900 italic">{h.date.split(',')[0]}</p>
                              <p className="text-[7px] md:text-[10px] font-black text-emerald-500 uppercase mt-1 md:mt-3 tracking-widest bg-emerald-50 px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-emerald-100 shadow-sm">Validado</p>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center border-4 border-dashed border-orange-50 rounded-[40px]">
                           <p className="text-orange-300 font-black uppercase tracking-widest italic">Nenhum registro encontrado</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {showScanner && (
            <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
               <div className="bg-white w-full max-w-lg rounded-[32px] md:rounded-[64px] overflow-hidden shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar">
                  <div className="p-6 md:p-10 bg-[#0F172A] text-white flex justify-between items-center sticky top-0 z-20">
                     <div className="flex items-center space-x-3 md:space-x-4">
                        <ShieldCheck size={24} className="text-orange-600" />
                        <h3 className="text-sm md:text-xl font-black uppercase tracking-tight italic">AMABE Scanner</h3>
                     </div>
                     <button onClick={() => { setShowScanner(false); setValidationResult(null); }} className="p-2 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all"><X size={24} /></button>
                  </div>

                  <div className="p-8 md:p-14 space-y-8 md:space-y-12">
                     {!validationResult ? (
                        <>
                           <div className="aspect-square bg-slate-50 rounded-[40px] md:rounded-[56px] flex flex-col items-center justify-center border-2 md:border-4 border-dashed border-orange-100 relative overflow-hidden shadow-inner max-w-[280px] mx-auto w-full">
                              <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-orange-500/20 to-transparent animate-scan-bounce"></div>
                              <Smartphone size={60} className="text-orange-200 mb-4 md:hidden" />
                              <Smartphone size={100} className="text-orange-200 mb-6 hidden md:block" />
                              <p className="text-orange-400 text-[8px] md:text-xs font-black uppercase tracking-widest text-center px-6 italic">Aponte a câmera</p>
                           </div>

                           <div className="space-y-4 md:space-y-6">
                              <input
                                 type="text"
                                 placeholder="MATRÍCULA OU CUPOM"
                                 className="w-full px-6 py-4 md:py-7 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] outline-none focus:ring-4 focus:ring-orange-100 font-black text-center text-sm md:text-lg uppercase tracking-widest transition-all"
                                 value={manualId}
                                 onChange={(e) => setManualId(e.target.value)}
                              />
                              <button
                                 onClick={handleValidate}
                                 disabled={!manualId}
                                 className="w-full py-4 md:py-7 bg-orange-600 text-white rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-xl transition-all disabled:opacity-20 active:scale-95"
                              >
                                 Processar
                              </button>
                           </div>
                        </>
                     ) : (
                        <div className="text-center space-y-6 md:space-y-8 py-4 animate-in zoom-in duration-500">
                           <div className={`w-20 h-20 md:w-32 md:h-32 rounded-[32px] md:rounded-[44px] flex items-center justify-center mx-auto shadow-xl ${validationResult.success ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                              }`}>
                              {validationResult.success ? <Check size={40} className="md:hidden" strokeWidth={4} /> : <X size={40} className="md:hidden" strokeWidth={4} />}
                              {validationResult.success ? <Check size={64} className="hidden md:block" strokeWidth={4} /> : <X size={64} className="hidden md:block" strokeWidth={4} />}
                           </div>
                           <div className="space-y-2">
                              <h4 className={`text-2xl md:text-4xl font-black italic tracking-tighter uppercase ${validationResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                                 {validationResult.success ? 'VALIDADO!' : 'NEGADO'}
                              </h4>
                              <p className="text-slate-500 font-black text-xs md:text-base leading-relaxed italic max-w-[240px] mx-auto">{validationResult.message}</p>
                           </div>
                           <button
                              onClick={() => setValidationResult(null)}
                              className="w-full py-4 md:py-6 bg-slate-100 text-slate-900 rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-orange-600 transition-all active:scale-95"
                           >
                              Próximo
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PartnerDashboard;
