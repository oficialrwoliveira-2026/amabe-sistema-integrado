
import React, { useState, useEffect } from 'react';
import { User, Partner, Offer, BenefitUsage, DashboardTab, Payment, PaymentStatus, NewsItem, SystemNotification } from '../types';
import DigitalCard from './DigitalCard';
import {
   DollarSign, Clock, CreditCard, User as UserIcon, UserPlus, Building2,
   History as HistoryIcon, LogOut, CheckCircle2, Info, ChevronRight, Search,
   Tag, MapPin, MessageCircle, Instagram, Image as ImageIcon, ShieldCheck, Smartphone, X, Ticket, QrCode, UserCircle, Users, Pencil, Trash2, Camera, ArrowUpRight, ChevronLeft, Bell, Key
} from 'lucide-react';
import { CATEGORIES } from '../constants';

interface MemberDashboardProps {
   activeTab: DashboardTab;
   setActiveTab: (tab: DashboardTab) => void;
   user: User;
   onUpdateUser: (user: User) => void;
   partners: Partner[];
   history: BenefitUsage[];
   payments: Payment[];
   onRedeemBenefit: (usage: BenefitUsage) => void;
   onLogout?: () => void;
   news: NewsItem[];
   systemNotification: SystemNotification | null;
   onRegisterNotificationView?: (userId: string) => void;
   onRegisterNewsView?: (newsId: string, userId: string) => void;
   showAlert: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
   showConfirm: (title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) => void;
   onLoadFullProfile?: (userId: string) => Promise<any>;
}


const MemberDashboard: React.FC<MemberDashboardProps> = ({
   activeTab, setActiveTab, user, payments, history, partners, onLogout, onRedeemBenefit, onUpdateUser, news, systemNotification, onRegisterNotificationView, onRegisterNewsView,
   showAlert, showConfirm, onLoadFullProfile
}) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('Todos');
   const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
   const [showVoucherSelection, setShowVoucherSelection] = useState(false);
   const [showAddDependent, setShowAddDependent] = useState(false);
   const [editingDependentId, setEditingDependentId] = useState<string | null>(null);
   const [tempPhoto, setTempPhoto] = useState<string | null>(null);
   const [selectedDependentCard, setSelectedDependentCard] = useState<User | null>(null);
   const [dependentForm, setDependentForm] = useState({ name: '', cpf: '', rg: '', birthDate: '', relationship: 'Filho' as 'Filho' | 'Filha' });
   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
   const [showGlobalAlert, setShowGlobalAlert] = useState(false);
   const [showAllCards, setShowAllCards] = useState(false);
   const [showPasswordChange, setShowPasswordChange] = useState(false);
   const [showSelfPasswordChange, setShowSelfPasswordChange] = useState(false);
   const [newPasswords, setNewPasswords] = useState({ password: '', confirm: '' });
   const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

   useEffect(() => {
      if (systemNotification?.isActive) {
         setShowGlobalAlert(true);
         if (onRegisterNotificationView) {
            onRegisterNotificationView(user.id);
         }
      }
      if (user.mustChangePassword) {
         setShowPasswordChange(true);
      }
   }, [systemNotification, user.id, onRegisterNotificationView, user.mustChangePassword]);

   useEffect(() => {
      if (selectedPartner && onLoadFullProfile && (!selectedPartner.gallery || selectedPartner.gallery.length === 0)) {
         onLoadFullProfile(selectedPartner.id);
      }
   }, [selectedPartner, onLoadFullProfile]);

   useEffect(() => {
      if (selectedNews && onRegisterNewsView) {
         onRegisterNewsView(selectedNews.id, user.id);
      }
   }, [selectedNews, user.id, onRegisterNewsView]);

   useEffect(() => {
      if (selectedPartner) {
         const upToDate = partners.find(p => p.id === selectedPartner.id);
         if (upToDate && (upToDate.gallery?.length !== selectedPartner.gallery?.length || upToDate.offers?.length !== selectedPartner.offers?.length)) {
            setSelectedPartner(upToDate);
         }
      }
   }, [partners, selectedPartner]);

   const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

   const bannerNews = news.filter(n => n.showInBanner);

   useEffect(() => {
      if (bannerNews.length > 1) {
         const interval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % bannerNews.length);
         }, 5000);
         return () => clearInterval(interval);
      }
   }, [bannerNews.length]);
   const [profileForm, setProfileForm] = useState({
      name: (user.name || '').split(' ')[0] || '',
      surname: user.surname || (user.name || '').split(' ').slice(1).join(' ') || '',
      cpf: user.cpf || '',
      rg: user.rg || '',
      simRegistry: user.simRegistry || '',
      address: user.address || '',
      whatsapp: user.whatsapp || '',
      instagram: user.instagram || '',
      facebook: user.facebook || '',
      linkedin: user.linkedin || '',
      website: user.website || '',
      avatar: user.avatar || '',
      birthDate: user.birthDate || '',
      city: user.city || ''
   });

   // Objeto unificado que reflete as alterações em tempo real em todo o dashboard
   const liveUser: User = {
      ...user,
      name: `${profileForm.name} ${profileForm.surname}`.trim() || user.name,
      surname: profileForm.surname,
      cpf: profileForm.cpf,
      rg: profileForm.rg,
      simRegistry: profileForm.simRegistry,
      address: profileForm.address,
      whatsapp: profileForm.whatsapp,
      instagram: profileForm.instagram,
      facebook: profileForm.facebook,
      linkedin: profileForm.linkedin,
      website: profileForm.website,
      avatar: profileForm.avatar,
      birthDate: profileForm.birthDate,
      city: profileForm.city
   };

   const updateGlobalUser = (updatedFields: Partial<typeof profileForm>) => {
      setProfileForm(prev => {
         const newForm = { ...prev, ...updatedFields };

         // Atualização global assíncrona para não bloquear a UI
         setTimeout(() => {
            onUpdateUser({
               ...user,
               name: `${newForm.name} ${newForm.surname}`.trim(),
               surname: newForm.surname,
               cpf: newForm.cpf,
               rg: newForm.rg,
               simRegistry: newForm.simRegistry,
               address: newForm.address,
               whatsapp: newForm.whatsapp,
               instagram: newForm.instagram,
               facebook: newForm.facebook,
               linkedin: newForm.linkedin,
               website: newForm.website,
               avatar: newForm.avatar,
               birthDate: newForm.birthDate,
               city: newForm.city
            });
         }, 0);

         return newForm;
      });
   };

   // Sincronizar formulário apenas quando o ID do usuário mudar (ex: login ou troca de conta)
   useEffect(() => {
      if (!user) return;

      setProfileForm({
         name: (user.name || '').split(' ')[0] || '',
         surname: user.surname || (user.name || '').split(' ').slice(1).join(' ') || '',
         cpf: user.cpf || '',
         rg: user.rg || '',
         simRegistry: user.simRegistry || '',
         address: user.address || '',
         whatsapp: user.whatsapp || '',
         instagram: user.instagram || '',
         facebook: user.facebook || '',
         linkedin: user.linkedin || '',
         website: user.website || '',
         avatar: user.avatar || '',
         birthDate: user.birthDate || '',
         city: user.city || ''
      });
   }, [user?.id]);

   const handleSaveProfile = () => {
      console.log('Salvando perfil AMABE Elite...', liveUser);
      try {
         // A atualização já acontece em tempo real via updateGlobalUser,
         // mas forçamos aqui para garantir persistência imediata e feedback
         onUpdateUser(liveUser);

         // Feedback visual via sistema de notificação global do dashboard
         setNotification({
            message: 'Seu perfil foi atualizado com sucesso no sistema AMABE!',
            type: 'success'
         });
      } catch (err: any) {
         console.error('Erro ao salvar no MemberDashboard:', err);
         showAlert('Erro ao Salvar', err.message || 'Não foi possível salvar as alterações. Tente novamente.', 'error');
      }
   };
   const [generatedVoucher, setGeneratedVoucher] = useState<{
      id: string;
      beneficiaryName: string;
      beneficiaryId: string;
      partnerName: string;
      partnerLogo: string;
      discount: string;
      code: string;
      date: string;
   } | null>(null);

   const categories = ['Todos', ...CATEGORIES];

   const handleGenerateVoucher = (beneficiary: { name: string, id: string }) => {
      if (!selectedPartner) return;

      // Verificar se o beneficiário já possui um voucher GERADO para este parceiro específico
      const hasActiveVoucherForPartner = history.some(h =>
         h.beneficiaryId === beneficiary.id &&
         h.partnerId === selectedPartner.id &&
         h.status === 'GERADO'
      );

      if (hasActiveVoucherForPartner) {
         showAlert('Voucher Ativo', `Ops! ${beneficiary.name} já possui um voucher ativo para ${selectedPartner.name}. É necessário utilizá-lo antes de gerar um novo para este parceiro.`, 'warning');
         return;
      }

      const voucherId = `VCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const currentDate = new Date().toISOString(); // Usar ISO para o banco de dados

      const discountToUse = selectedOffer ? selectedOffer.discount : selectedPartner.discount;
      const offerTitleToUse = selectedOffer ? `Oferta: ${selectedOffer.title}` : 'Voucher Gerado';
      const voucherCode = Math.random().toString(36).substr(2, 6).toUpperCase();

      const newVoucher = {
         id: voucherId,
         beneficiaryName: beneficiary.name,
         beneficiaryId: beneficiary.id,
         partnerName: selectedPartner.name,
         partnerLogo: selectedPartner.logo,
         discount: discountToUse,
         code: voucherCode,
         date: currentDate,
      };

      // Registrar no histórico global com status GERADO
      onRedeemBenefit({
         id: voucherId,
         memberId: user.id, // ID único do banco (UUID)
         memberName: user.name,
         beneficiaryName: beneficiary.name,
         beneficiaryId: beneficiary.id,
         partnerId: selectedPartner.id,
         partnerName: selectedPartner.name,
         date: currentDate,
         offerTitle: offerTitleToUse,
         offerDiscount: discountToUse,
         code: voucherCode,
         status: 'GERADO'
      });

      setGeneratedVoucher(newVoucher);
      setShowVoucherSelection(false);
      setSelectedOffer(null); // Resetar após gerar
   };

   const handleViewReceipt = (h: BenefitUsage) => {
      const partner = partners.find(p => p.id === h.partnerId || p.name === h.partnerName);
      setGeneratedVoucher({
         id: h.id,
         beneficiaryName: h.beneficiaryName,
         beneficiaryId: h.beneficiaryId,
         partnerName: h.partnerName,
         partnerLogo: partner?.logo || '',
         discount: h.offerDiscount || 'Benefício',
         code: h.code || (h.id.includes('VCH-') ? h.id.split('-').pop() : h.id.substring(0, 6).toUpperCase()) || 'CODE',
         date: h.date,
      });
   };

   const formatVoucherDate = (dateStr: string) => {
      if (!dateStr) return { date: '-', time: '-' };
      try {
         // Se já estiver no formato BR legível ou ISO
         const date = new Date(dateStr);
         if (!isNaN(date.getTime())) {
            return {
               date: date.toLocaleDateString('pt-BR'),
               time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
         }
         // Fallback para o split original se for um formato customizado que falhou no Date
         const parts = dateStr.split(' ');
         return {
            date: parts[0] || '-',
            time: parts[1]?.substring(0, 5) || '-'
         };
      } catch (e) {
         return { date: dateStr.split(' ')[0], time: '-' };
      }
   };

   const renderPasswordChangeModal = () => {
      if (!showPasswordChange) return null;

      const handleUpdatePassword = () => {
         if (newPasswords.password !== newPasswords.confirm) {
            showAlert('Senhas Diferentes', 'As senhas não coincidem!', 'warning');
            return;
         }
         if (newPasswords.password.length < 4) {
            showAlert('Senha Curta', 'A senha deve ter pelo menos 4 caracteres.', 'warning');
            return;
         }

         onUpdateUser({
            ...user,
            password: newPasswords.password,
            mustChangePassword: false
         });
         setShowPasswordChange(false);
         showAlert('Sucesso', 'Senha atualizada com sucesso!', 'success');
      };

      return (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-2xl"></div>
            <div className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 p-12 text-center">
               <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-orange-600/20">
                  <Key size={36} />
               </div>
               <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-4">Segurança Necessária</h3>
               <p className="text-slate-500 font-medium italic mb-10 leading-relaxed">
                  Para sua proteção, você precisa definir uma nova senha pessoal em seu primeiro acesso.
               </p>

               <div className="space-y-6 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nova Senha</label>
                     <input
                        type="password"
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                        placeholder="••••••••"
                        value={newPasswords.password}
                        onChange={e => setNewPasswords({ ...newPasswords, password: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Confirmar Senha</label>
                     <input
                        type="password"
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                        placeholder="••••••••"
                        value={newPasswords.confirm}
                        onChange={e => setNewPasswords({ ...newPasswords, confirm: e.target.value })}
                     />
                  </div>

                  <button
                     onClick={handleUpdatePassword}
                     className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#0A101E] transition-all transform hover:-translate-y-1 shadow-2xl mt-4"
                  >
                     Atualizar Senha Elite
                  </button>
               </div>
            </div>
         </div>
      );
   };

   const renderVoucherTicket = () => {
      if (!generatedVoucher) return null;

      return (
         <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-xl" onClick={() => setGeneratedVoucher(null)}></div>
            <div className="relative w-full max-w-[340px] md:max-w-md bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
               {/* Cabeçalho do Ticket */}
               <div className="bg-orange-600 p-5 md:p-8 text-white text-center relative shrink-0">
                  <div className="absolute -bottom-4 left-0 right-0 h-8 bg-white rounded-t-[32px] md:rounded-t-[40px]"></div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] italic mb-1">Voucher AMABE</h3>
                  <div className="w-12 md:w-16 h-1 bg-white/20 mx-auto rounded-full"></div>
               </div>

               {/* Corpo do Ticket */}
               <div className="p-6 md:p-10 pt-8 md:pt-12 space-y-4 md:space-y-8 text-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-2xl md:rounded-3xl p-3 md:p-4 flex items-center justify-center border border-slate-100 mx-auto shadow-inner mb-4 md:mb-0">
                     <img src={generatedVoucher.partnerLogo} className="w-full h-full object-contain" alt="" />
                  </div>

                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Empresa Parceira</p>
                     <p className="text-lg md:text-2xl font-black text-slate-900 italic uppercase truncate px-2">{generatedVoucher.partnerName}</p>
                  </div>

                  <div className="bg-orange-50 border-2 border-dashed border-orange-200 p-4 md:p-6 rounded-2xl md:rounded-3xl">
                     <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Benefício</p>
                     <p className="text-xl md:text-3xl font-black text-orange-600 italic leading-none">{generatedVoucher.discount}</p>
                  </div>

                  <div className="py-3 md:py-6 border-y border-slate-100 flex items-center justify-between px-2">
                     <div className="text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Portador</p>
                        <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic truncate max-w-[120px] md:max-w-[150px]">{generatedVoucher.beneficiaryName}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Membro</p>
                        <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic">{generatedVoucher.beneficiaryId}</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="bg-slate-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center gap-3 md:gap-4 border border-slate-100">
                        <QrCode size={80} className="text-slate-900 md:hidden" />
                        <QrCode size={120} className="text-slate-900 hidden md:block" />
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Código de Resgate</p>
                           <p className="text-xl md:text-2xl font-black text-slate-900 tracking-[0.2em] md:tracking-[0.3em] font-mono leading-none">{generatedVoucher.code}</p>
                        </div>
                     </div>
                  </div>

                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Gerado em: {formatVoucherDate(generatedVoucher.date).date} às {formatVoucherDate(generatedVoucher.date).time}</p>
               </div>

               {/* Footer / Corte */}
               <div className="bg-slate-900 p-4 md:p-6 flex flex-col gap-3 md:gap-4 shrink-0">
                  <button
                     onClick={() => setGeneratedVoucher(null)}
                     className="w-full py-3 md:py-4 bg-orange-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-orange-700 transition-all active:scale-95"
                  >
                     Fechar Voucher
                  </button>
                  <p className="text-center text-[7px] text-slate-400 font-bold uppercase tracking-[0.2em]">Apresente este voucher na recepção do parceiro</p>
               </div>
            </div>
         </div>
      );
   };

   const renderVoucherSelectionModal = () => {
      if (!showVoucherSelection || !selectedPartner) return null;

      return (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowVoucherSelection(false)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-8 md:p-12 space-y-10">
                  <header>
                     <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight mb-2">Para quem é este benefício?</h3>
                     <p className="text-slate-400 font-medium italic text-sm md:text-base">Selecione o beneficiário do voucher para <span className="text-orange-600 font-black">{selectedPartner.name}</span></p>
                  </header>

                  <div className="space-y-4">
                     {/* Titular */}
                     <button
                        onClick={() => handleGenerateVoucher({ name: user.name, id: user.id })}
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-orange-200 hover:bg-orange-50/50 transition-all"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:scale-110 transition-all shadow-sm">
                              <UserCircle size={24} />
                           </div>
                           <div className="text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titular</p>
                              <p className="text-lg font-black text-slate-900 uppercase italic">{user.name}</p>
                           </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-orange-600" />
                     </button>

                     {/* Dependentes */}
                     {user.dependents && user.dependents.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Dependentes Cadastrados</p>
                           {user.dependents.map(dep => (
                              <button
                                 key={dep.id}
                                 onClick={() => handleGenerateVoucher({ name: dep.name, id: dep.id })}
                                 className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-orange-200 hover:bg-orange-50/50 transition-all"
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:scale-110 transition-all shadow-sm">
                                       <Users size={24} />
                                    </div>
                                    <div className="text-left">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dependente</p>
                                       <p className="text-lg font-black text-slate-900 uppercase italic">{dep.name}</p>
                                    </div>
                                 </div>
                                 <ChevronRight className="text-slate-300 group-hover:text-orange-600" />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <button
                     onClick={() => setShowVoucherSelection(false)}
                     className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all"
                  >
                     Cancelar
                  </button>
               </div>
            </div>
         </div>
      );
   };

   const renderPartnerModal = () => {
      if (!selectedPartner) return null;

      return (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPartner(null)}></div>
            <div className="relative w-full max-w-5xl bg-white rounded-[40px] md:rounded-[64px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
               <button
                  onClick={() => setSelectedPartner(null)}
                  className="absolute top-6 right-6 md:top-10 md:right-10 z-50 p-4 bg-white/80 backdrop-blur-sm text-slate-900 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all active:scale-95"
               >
                  <X size={24} />
               </button>

               <div className="overflow-y-auto custom-scrollbar flex-1">
                  <div className="relative h-64 md:h-96 w-full">
                     <img src={selectedPartner.logo} className="w-full h-full object-cover blur-2xl opacity-20" alt="" />
                     <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="w-40 h-40 md:w-64 md:h-64 bg-white rounded-[40px] md:rounded-[60px] shadow-2xl flex items-center justify-center p-8 border-8 border-white">
                           <img src={selectedPartner.logo} className="w-full h-full object-contain" alt={selectedPartner.name} />
                        </div>
                     </div>
                  </div>

                  <div className="px-8 md:px-20 py-10 md:py-16 space-y-12 md:space-y-20">
                     <div className="text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                           <span className="px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100">{selectedPartner.category}</span>
                           <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 italic">Benefício VIP</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none mb-6">{selectedPartner.name}</h2>
                        <p className="text-slate-500 text-lg md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto md:mx-0">"{selectedPartner.description}"</p>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                        <div className="space-y-12">
                           <section>
                              <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase italic mb-8">
                                 <Tag className="text-orange-600" size={24} /> Ofertas e Cupons
                              </h3>
                              <div className="space-y-6">
                                 <div className="bg-orange-50/50 p-8 rounded-[40px] border border-orange-100/50 shadow-inner">
                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">Oferta Principal</p>
                                    <p className="text-3xl md:text-4xl font-black text-orange-600 italic tracking-tighter mb-4">{selectedPartner.discount}</p>
                                    <p className="text-slate-600 font-bold leading-relaxed italic">{selectedPartner.rules || "Regras de uso não especificadas."}</p>
                                 </div>

                                 {selectedPartner.offers && selectedPartner.offers.length > 0 && (
                                    <div className="space-y-4">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Ofertas Exclusivas do Mês</p>
                                       {selectedPartner.offers.map(offer => (
                                          <button
                                             key={offer.id}
                                             onClick={() => { setSelectedOffer(offer); setShowVoucherSelection(true); }}
                                             className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group/offer hover:border-orange-200 transition-all text-left"
                                          >
                                             <div>
                                                <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{offer.title}</h4>
                                                <p className="text-orange-500 font-black text-xs uppercase italic">{offer.discount}</p>
                                             </div>
                                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover/offer:bg-orange-600 group-hover/offer:text-white transition-all">
                                                <ChevronRight size={18} />
                                             </div>
                                          </button>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </section>

                           <section>
                              <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase italic mb-8">
                                 <MapPin className="text-orange-600" size={24} /> Localização e Contato
                              </h3>
                              <div className="space-y-6">
                                 <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <MapPin className="text-slate-400 shrink-0 mt-1" size={20} />
                                    <p className="text-slate-700 font-bold text-sm md:text-base">{selectedPartner.address}</p>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    {selectedPartner.whatsapp && (
                                       <a
                                          href={`https://wa.me/55${selectedPartner.whatsapp.replace(/\D/g, '')}`}
                                          target="_blank"
                                          className="flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                       >
                                          <MessageCircle size={18} /> WhatsApp
                                       </a>
                                    )}
                                    {selectedPartner.instagram && (
                                       <a
                                          href={`https://instagram.com/${selectedPartner.instagram.replace('@', '')}`}
                                          target="_blank"
                                          className="flex items-center justify-center gap-3 py-4 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-pink-500/20"
                                       >
                                          <Instagram size={18} /> Instagram
                                       </a>
                                    )}
                                 </div>
                              </div>
                           </section>
                        </div>

                        <section>
                           <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 uppercase italic mb-8">
                              <ImageIcon className="text-orange-600" size={24} /> Galeria de Fotos
                           </h3>
                           <div className="grid grid-cols-2 gap-4">
                              {selectedPartner.gallery && selectedPartner.gallery.length > 0 ? selectedPartner.gallery.map((img, idx) => (
                                 <img key={idx} src={img} className="w-full aspect-video md:aspect-square object-cover rounded-3xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer" alt="" />
                              )) : (
                                 <div className="col-span-2 py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon size={48} className="mb-4 opacity-50" />
                                    <span className="font-black uppercase tracking-widest text-[10px]">Nenhuma foto disponível</span>
                                 </div>
                              )}
                           </div>
                        </section>
                     </div>

                     <footer className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                           <ShieldCheck className="text-emerald-500" size={32} />
                           <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest italic leading-tight">
                              Apresente seu QR Code <br className="hidden md:block" /> para validar o benefício
                           </p>
                        </div>
                        <button
                           onClick={() => { setSelectedOffer(null); setShowVoucherSelection(true); }}
                           className="w-full md:w-auto px-12 py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-3 animate-pulse hover:animate-none"
                        >
                           <Ticket size={20} /> Gerar Voucher Agora
                        </button>
                     </footer>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setTempPhoto(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleAddDependent = () => {
      if (!dependentForm.name) return;

      let updatedDependents;

      if (editingDependentId) {
         // Lógica de Edição
         updatedDependents = (user.dependents || []).map(dep =>
            dep.id === editingDependentId
               ? {
                  ...dep,
                  name: dependentForm.name,
                  relationship: dependentForm.relationship,
                  cpf: dependentForm.cpf,
                  rg: dependentForm.rg,
                  birthDate: dependentForm.birthDate,
                  avatar: tempPhoto || dep.avatar
               }
               : dep
         );
      } else {
         // Lógica de Criação
         const nextSuffix = (user.dependents || []).reduce((max, d) => {
            const match = d.memberId?.match(/-D(\d+)$/);
            return match ? Math.max(max, parseInt(match[1])) : max;
         }, 0) + 1;

         const newDependent: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: dependentForm.name,
            email: '',
            role: user.role,
            memberId: `${user.memberId}-D${nextSuffix}`,
            status: user.status,
            validUntil: user.validUntil,
            cpf: dependentForm.cpf,
            rg: dependentForm.rg,
            birthDate: dependentForm.birthDate,
            avatar: tempPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dependentForm.name}`,
            relationship: dependentForm.relationship
         };
         updatedDependents = [...(user.dependents || []), newDependent];
      }

      onUpdateUser({
         ...user,
         dependents: updatedDependents
      });

      setShowAddDependent(false);
      setEditingDependentId(null);
      setTempPhoto(null);
      setDependentForm({ name: '', cpf: '', rg: '', birthDate: '', relationship: 'Filho' });
   };

   const handleDeleteDependent = (id: string) => {
      showConfirm(
         'Remover Dependente',
         'Tem certeza que deseja remover este dependente? Esta ação não pode ser desfeita.',
         () => {
            onUpdateUser({
               ...user,
               dependents: (user.dependents || []).filter(dep => dep.id !== id)
            });
         }
      );
   };

   const renderAddDependentModal = () => {
      if (!showAddDependent) return null;

      return (
         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => {
               setShowAddDependent(false);
               setEditingDependentId(null);
               setDependentForm({ name: '', cpf: '', rg: '', birthDate: '', relationship: 'Filho' });
            }}></div>
            <div className="relative w-full max-w-lg bg-white rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-8 md:p-12 space-y-10">
                  <header>
                     <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight mb-2">
                        {editingDependentId ? 'Editar Dependente' : 'Novo Dependente'}
                     </h3>
                     <p className="text-slate-400 font-medium italic text-sm md:text-base">
                        {editingDependentId ? 'Atualize os dados do membro familiar' : 'Adicione um novo membro à sua conta AMABE Elite'}
                     </p>
                  </header>

                  <div className="space-y-8">
                     {/* Seletor de Foto */}
                     <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                           <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100 flex items-center justify-center relative">
                              {tempPhoto || (editingDependentId && (user.dependents || []).find(d => d.id === editingDependentId)?.avatar) ? (
                                 <img
                                    src={tempPhoto || (user.dependents || []).find(d => d.id === editingDependentId)?.avatar}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                 />
                              ) : (
                                 <UserCircle size={64} className="text-slate-300" />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                 <Camera className="text-white" size={32} />
                              </div>
                           </div>
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                           />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clique para {editingDependentId ? 'Trocar' : 'Adicionar'} Foto</p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nome Completo</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                              placeholder="Ex: Maria Oliveira"
                              value={dependentForm.name}
                              onChange={e => setDependentForm({ ...dependentForm, name: e.target.value })}
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CPF</label>
                              <input
                                 type="text"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                 placeholder="000.000.000-00"
                                 value={dependentForm.cpf}
                                 onChange={e => setDependentForm({ ...dependentForm, cpf: e.target.value })}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">RG</label>
                              <input
                                 type="text"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                 placeholder="00.000.000-0"
                                 value={dependentForm.rg}
                                 onChange={e => setDependentForm({ ...dependentForm, rg: e.target.value })}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Data de Nascimento</label>
                           <input
                              type="date"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={dependentForm.birthDate}
                              onChange={e => setDependentForm({ ...dependentForm, birthDate: e.target.value })}
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Parentesco</label>
                           <div className="grid grid-cols-3 gap-3">
                              {['Filho', 'Filha'].map((rel) => (
                                 <button
                                    key={rel}
                                    onClick={() => setDependentForm({ ...dependentForm, relationship: rel as any })}
                                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${dependentForm.relationship === rel
                                       ? 'bg-[#0A101E] text-white border-slate-900 shadow-xl'
                                       : 'bg-white text-slate-400 border-slate-50 hover:border-orange-100'
                                       }`}
                                 >
                                    {rel}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                           <button
                              onClick={() => {
                                 setShowAddDependent(false);
                                 setEditingDependentId(null);
                                 setDependentForm({ name: '', cpf: '', rg: '', birthDate: '', relationship: 'Filho' });
                              }}
                              className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-100 transition-all"
                           >
                              Cancelar
                           </button>
                           <button
                              onClick={handleAddDependent}
                              className="flex-1 py-5 bg-orange-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
                           >
                              {editingDependentId ? 'Salvar' : 'Adicionar'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const renderAllCardsModal = () => {
      if (!showAllCards) return null;

      const allFamily = [liveUser, ...(user.dependents || [])];

      return (
         <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
            <button
               onClick={() => setShowAllCards(false)}
               className="absolute top-10 right-10 w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-20"
            >
               <X size={32} />
            </button>

            <div className="w-full max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6">
               <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-tight">Painel da Família</h2>
                  <p className="text-orange-500 font-bold text-xs md:text-sm uppercase tracking-[0.4em] mt-4 italic">Todas as carteirinhas AMABE Elite</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
                  {allFamily.map((member, idx) => (
                     <div key={member.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="mb-6 flex items-center justify-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                              <img src={member.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">{member.relationship || 'Titular'}</p>
                              <h4 className="text-lg font-black italic text-white uppercase mt-1">{member.name}</h4>
                           </div>
                        </div>
                        <div className="lg:scale-100 transition-transform">
                           <DigitalCard member={member} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      );
   };
   const renderWallet = () => {
      const allDependents = user.dependents || [];

      return (
         <div className="max-w-6xl mx-auto space-y-12 sm:space-y-20 lg:space-y-24 animate-in fade-in duration-700 font-inter">
            {/* Seção Titular */}
            <section className="space-y-8 md:space-y-12">
               <div className="flex items-center justify-between px-4">
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">Minha Carteira</h2>
                     <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 italic">Acesso exclusivo AMABE Elite</p>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                     {/* Upload de Foto Titular */}
                     <div className="relative group">
                        <input
                           type="file"
                           id="titular-photo"
                           accept="image/*"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                    onUpdateUser({ ...user, avatar: reader.result as string });
                                 };
                                 reader.readAsDataURL(file);
                              }
                           }}
                           className="hidden"
                        />
                        <button
                           onClick={() => document.getElementById('titular-photo')?.click()}
                           className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl"
                        >
                           <Camera size={14} /> Alterar Minha Foto
                        </button>
                     </div>
                     <ShieldCheck size={32} className="text-orange-500" />
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="w-full">
                     <DigitalCard member={liveUser} />
                  </div>
                  <div className="space-y-8 bg-white p-6 sm:p-10 lg:p-14 rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] border border-slate-100 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                     <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                        <Info className="text-orange-500" size={24} /> Informações do Titular
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Status da Conta</p>
                           <p className="text-emerald-500 font-black italic text-lg uppercase">Usuario Ativo</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Exclusivo</p>
                           <p className="text-slate-900 font-black italic text-lg uppercase">Elite Diamond</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">ID Identificador</p>
                           <p className="text-orange-600 font-black italic text-lg uppercase">{user.memberId}</p>
                        </div>
                     </div>
                     <div className="pt-8 border-t border-slate-50">
                        <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed">
                           Sua carteira digital AMABE é aceita em toda a rede credenciada nacional.
                           Mantenha seu status sempre ativo para desfrutar de todos os benefícios.
                        </p>
                     </div>
                  </div>
               </div>
            </section>

            {/* Seção Dependentes */}
            <section className="space-y-8 md:space-y-12 pb-20">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
                  <div className="flex items-center gap-4 md:gap-5">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Users size={20} className="md:size-6" />
                     </div>
                     <div>
                        <h2 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">Meus Dependentes</h2>
                        <p className="text-slate-400 font-bold text-[8px] md:text-xs uppercase tracking-[0.2em] mt-1 italic">Gestão de benefícios familiares</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                     <button
                        onClick={() => setShowAllCards(true)}
                        className="flex-1 sm:flex-none px-4 py-3 md:px-10 md:py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:bg-orange-600 hover:scale-105 transition-all active:scale-95"
                     >
                        <QrCode size={16} /> <span className="hidden sm:inline">Ver Todas as Carteirinhas</span><span className="sm:hidden">Todas</span>
                     </button>
                     <button
                        onClick={() => setShowAddDependent(true)}
                        className="flex-1 sm:flex-none px-4 py-3 md:px-10 md:py-4 bg-orange-600 text-white rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-105 transition-all active:scale-95"
                     >
                        <UserPlus size={16} /> <span className="hidden sm:inline">Adicionar Dependente</span><span className="sm:hidden">Novo</span>
                     </button>
                  </div>
               </div>

               {allDependents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                     {allDependents.map((dep) => (
                        <div key={dep.id} className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                           {/* Botões de Ação */}
                           <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                 onClick={() => {
                                    setEditingDependentId(dep.id);
                                    setDependentForm({
                                       name: dep.name,
                                       cpf: dep.cpf || '',
                                       rg: dep.rg || '',
                                       relationship: dep.relationship as any,
                                       birthDate: dep.birthDate || ''
                                    });
                                    setShowAddDependent(true);
                                 }}
                                 className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Pencil size={14} />
                              </button>
                              <button
                                 onClick={() => handleDeleteDependent(dep.id)}
                                 className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>

                           <div className="flex items-center gap-5 mb-8">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-slate-50">
                                 <img src={dep.avatar} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1 italic">{dep.relationship}</p>
                                 <h4 className="text-xl font-black italic text-slate-900 uppercase truncate leading-none">{dep.name}</h4>
                              </div>
                           </div>
                           <button
                              onClick={() => setSelectedDependentCard(dep)}
                              className="w-full py-4 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#0A101E] group-hover:text-white transition-all shadow-sm"
                           >
                              <Smartphone size={16} /> Ver Carteirinha
                           </button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[64px] bg-slate-50/50">
                     <UserCircle size={64} className="mx-auto text-slate-200 mb-6 opacity-50" />
                     <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic">Nenhum dependente cadastrado</p>
                     <p className="text-slate-300 font-bold text-xs mt-4">Adicione membros da sua família para estender seus benefícios</p>
                  </div>
               )}
            </section>

            {/* Seção de Histórico de Vouchers (Consolidada) */}
            <section className="space-y-8 md:space-y-12 pb-20 border-t border-slate-100 pt-16">
               <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">Meu Histórico</h2>
                     <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 italic">Acompanhe seu uso e de seus dependentes</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm w-fit">
                     <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{history.length} Utilizeções</span>
                  </div>
               </header>

               <div className="space-y-4 md:space-y-6">
                  {history.length > 0 ? history.map(h => (
                     <div key={h.id} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                        <div className="flex items-center gap-5 md:gap-8">
                           <div className="w-16 h-16 md:w-24 md:h-24 bg-orange-50 text-orange-600 rounded-[28px] md:rounded-[40px] flex items-center justify-center shrink-0 border border-orange-100 group-hover:scale-105 transition-transform">
                              <CheckCircle2 size={32} className="md:hidden" />
                              <CheckCircle2 size={48} className="hidden md:block" strokeWidth={2.5} />
                           </div>
                           <div className="min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                 {h.status === 'VALIDADO' ? (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic flex items-center gap-1">
                                       <ShieldCheck size={10} /> Validado
                                    </span>
                                 ) : (
                                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-orange-100 italic flex items-center gap-1">
                                       <Clock size={10} /> Aguardando Uso
                                    </span>
                                 )}
                                 <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">{formatVoucherDate(h.date).date}</span>
                              </div>
                              <h4 className="text-xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-3 group-hover:text-orange-600 transition-colors truncate">{h.partnerName}</h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                 <div className="flex items-center gap-2 text-slate-500">
                                    <UserCircle size={14} className="text-orange-400" />
                                    <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wide">
                                       Por: <span className="text-slate-900">{h.beneficiaryName}</span>
                                    </span>
                                 </div>
                                 {h.offerTitle && (
                                    <div className="flex items-center gap-2 text-slate-400 border-l border-slate-200 pl-4">
                                       <Ticket size={14} className="text-orange-400" />
                                       <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{h.offerTitle}</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 pt-4 md:pt-0 gap-3">
                           <div className="text-right">
                              <p className="text-lg md:text-2xl font-black text-slate-900 italic leading-none">{formatVoucherDate(h.date).time}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Horário</p>
                           </div>
                           <button
                              onClick={() => handleViewReceipt(h)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0A101E] hover:text-white transition-all shadow-sm"
                           >
                              Ver Recibo <ChevronRight size={14} />
                           </button>
                        </div>
                     </div>
                  )) : (
                     <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[64px] bg-slate-50/50">
                        <HistoryIcon size={64} className="mx-auto text-slate-200 mb-6 opacity-50" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Nenhum registro encontrado</p>
                        <p className="text-slate-300 font-bold text-xs mt-4">Suas utilizações aparecerão aqui</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Modal de Carteirinha do Dependente */}
            {selectedDependentCard && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                  <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-xl" onClick={() => setSelectedDependentCard(null)}></div>
                  <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-500 flex flex-col items-center">
                     <button
                        onClick={() => setSelectedDependentCard(null)}
                        className="absolute -top-16 right-0 p-4 bg-white/10 text-white rounded-full hover:bg-orange-600 transition-all"
                     >
                        <X size={24} />
                     </button>
                     <DigitalCard member={selectedDependentCard} />
                     <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mt-10 italic">Carteira Digital Dependente AMABE</p>
                  </div>
               </div>
            )}

            {renderAddDependentModal()}
         </div>
      );
   };

   const renderNotification = () => {
      if (!notification) return null;

      return (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md" onClick={() => setNotification(null)}></div>
            <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-100">
               <div className={`p-8 text-center space-y-6`}>
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ${notification.type === 'warning' ? 'bg-orange-50 text-orange-500' :
                     notification.type === 'error' ? 'bg-rose-50 text-rose-500' :
                        'bg-emerald-50 text-emerald-500'
                     }`}>
                     {notification.type === 'warning' && <Clock size={40} strokeWidth={2.5} />}
                     {notification.type === 'error' && <X size={40} strokeWidth={2.5} />}
                     {notification.type === 'success' && <ShieldCheck size={40} strokeWidth={2.5} />}
                  </div>

                  <div className="space-y-2">
                     <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        {notification.type === 'warning' ? 'Atenção!' :
                           notification.type === 'error' ? 'Erro!' :
                              'Sucesso!'}
                     </h3>
                     <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                        {notification.message}
                     </p>
                  </div>

                  <button
                     onClick={() => setNotification(null)}
                     className="w-full py-5 bg-[#0A101E] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                  >
                     Entendido
                  </button>
               </div>
            </div>
         </div>
      );
   };

   const renderClub = () => {
      const filteredPartners = (partners || []).filter(p => {
         const matchesSearch = (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
            (p.category || '').toLowerCase().includes((searchTerm || '').toLowerCase());
         const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
         return matchesSearch && matchesCategory;
      });

      return (
         <div className="space-y-10 md:space-y-16 animate-in fade-in duration-700">
            <div className="bg-white p-6 md:p-12 rounded-[40px] md:rounded-[60px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
               <div className="max-w-md text-center lg:text-left">
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">Clube de Benefícios</h2>
                  <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 italic">Exclusivo para membros AMABE Elite</p>
               </div>

               <div className="flex flex-col md:flex-row gap-4 w-full lg:max-w-xl">
                  <div className="relative flex-1 group">
                     <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                     <input
                        type="text"
                        placeholder="DIGITE O NOME OU CATEGORIA..."
                        className="w-full pl-16 pr-8 py-5 md:py-7 bg-slate-50 border border-slate-100 rounded-[28px] md:rounded-[40px] outline-none focus:ring-4 focus:ring-orange-100 font-black text-xs md:text-base uppercase tracking-widest transition-all shadow-inner"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                     />
                  </div>

                  {/* Mobile Category Select */}
                  <div className="md:hidden relative">
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-8 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:ring-4 focus:ring-orange-100 font-black text-xs uppercase tracking-widest appearance-none shadow-inner"
                     >
                        {categories.map(cat => (
                           <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                     </select>
                     <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                  </div>
               </div>
            </div>

            <div className="hidden md:flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-4">
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-8 py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2 shadow-sm active:scale-95 ${selectedCategory === cat
                        ? 'bg-[#0F172A] text-white border-slate-900 shadow-xl'
                        : 'bg-white text-slate-400 border-slate-50 hover:border-orange-200'
                        }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 stagger-load">
               {filteredPartners.length > 0 ? filteredPartners.map(p => (
                  <div
                     key={p.id}
                     onClick={() => setSelectedPartner(p)}
                     className="group bg-white rounded-[56px] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col min-h-[480px] hover:-translate-y-2"
                  >
                     <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-orange-600/10 transition-colors duration-700"></div>

                     <div className="mb-10 relative z-10 flex items-center justify-between">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[28px] md:rounded-[36px] p-4 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                           <img src={p.logo} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-600 transition-colors duration-500">
                           <Tag size={20} className="text-orange-500 group-hover:text-white transition-colors" />
                        </div>
                     </div>

                     <div className="space-y-4 mb-10 relative z-10 flex-1">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.3em] italic">{p.category}</span>
                           <h4 className="text-2xl md:text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h4>
                        </div>
                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-3 italic">
                           {p.description || "Descrição em breve..."}
                        </p>
                     </div>

                     {/* Mini Gallery (3 photos) */}
                     {p.gallery && p.gallery.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-8 relative z-10 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                           {p.gallery.slice(0, 3).map((img, i) => (
                              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group/thumb">
                                 <img
                                    src={img}
                                    className="w-full h-full object-cover group-hover/thumb:scale-125 transition-transform duration-700"
                                    alt={`Galeria ${i + 1}`}
                                 />
                              </div>
                           ))}
                        </div>
                     )}

                     <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-8 relative z-10 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all duration-500 overflow-hidden">
                        <p className="text-xs md:text-lg font-black italic tracking-tighter uppercase leading-none text-slate-900 group-hover:text-orange-600">{p.discount}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{p.rules?.split('.')[0] || "Consultar regras no local"}</p>
                     </div>

                     <button className="w-full py-5 bg-[#0A101E] text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                        Resgatar Benefício <ChevronRight size={14} />
                     </button>
                  </div>
               )) : (
                  <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-100 rounded-[64px] bg-slate-50/50">
                     <Building2 size={64} className="mx-auto text-slate-200 mb-6 opacity-50" />
                     <p className="text-slate-400 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Nenhum parceiro encontrado</p>
                     <p className="text-slate-300 font-bold text-xs mt-4 italic">Tente mudar a categoria ou termo de busca</p>
                  </div>
               )}
            </div>
            {renderPartnerModal()}
         </div>
      );
   };

   const renderProfile = () => {
      return (
         <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-xl">
                     <UserIcon size={28} />
                  </div>
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">Meu Perfil</h2>
                     <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1 italic">Gerencie sua identidade AMABE Elite</p>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button
                     type="button"
                     onClick={handleSaveProfile}
                     className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-105 transition-all active:scale-95 relative z-10"
                  >
                     Salvar Alterações
                  </button>
                  <button
                     type="button"
                     onClick={() => setShowSelfPasswordChange(true)}
                     className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-orange-600 transition-all active:scale-95 relative z-10"
                  >
                     <Key size={18} /> Alterar Senha
                  </button>
               </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Preview da Carteira em Tempo Real */}
               <div className="lg:col-span-3 mb-4">
                  <div className="bg-[#0A101E] p-8 md:p-12 rounded-[56px] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-orange-600/20"></div>
                     <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="hidden md:flex items-center justify-center relative w-full md:w-[460px] shrink-0">
                           <div className="relative">
                              <div className="absolute inset-0 bg-orange-600/20 blur-[80px] rounded-full"></div>
                              <div className="relative flex flex-col items-center animate-in zoom-in duration-700">
                                 <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-600 rounded-[32px] md:rounded-[48px] flex items-center justify-center text-white shadow-2xl shadow-orange-600/40 rotate-6 border-[3px] border-white/20">
                                    <ShieldCheck size={60} strokeWidth={1.5} className="md:hidden" />
                                    <ShieldCheck size={80} strokeWidth={1.5} className="hidden md:block" />
                                 </div>
                                 <div className="mt-6 text-center">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase text-white leading-none">AMABE</h1>
                                    <p className="text-orange-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.8em] mt-2 mr-[-0.8em] italic">Elite Club</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center md:justify-start">
                           <div className="relative group/logo">
                              <h2 className="text-4xl md:text-6xl font-black text-white/10 uppercase tracking-[0.2em] italic select-none group-hover/logo:text-white/20 transition-colors duration-700">
                                 Elite Access
                              </h2>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Coluna Lateral: Foto e SIM */}
               <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm text-center space-y-6">
                     <div className="relative group mx-auto w-40 h-40">
                        <div className="w-full h-full rounded-[48px] overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100 flex items-center justify-center relative">
                           {profileForm.avatar ? (
                              <img src={profileForm.avatar} className="w-full h-full object-cover" alt="Profile" />
                           ) : (
                              <UserCircle size={80} className="text-slate-300" />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <Camera className="text-white" size={40} />
                           </div>
                        </div>
                        <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                    const result = reader.result as string;
                                    setProfileForm(prev => ({ ...prev, avatar: result }));
                                    updateGlobalUser({ avatar: result });
                                 };
                                 reader.readAsDataURL(file);
                              }
                           }}
                           className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Associado</p>
                        <p className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">{user.memberId}</p>
                     </div>
                     <div className="pt-6 border-t border-slate-50">
                        <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                           <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">Cadastro SIM</p>
                           <input
                              type="text"
                              className="w-full bg-transparent text-center font-black text-slate-900 italic outline-none placeholder:text-orange-200"
                              placeholder="000.000.000"
                              value={profileForm.simRegistry}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, simRegistry: val }));
                                 updateGlobalUser({ simRegistry: val });
                              }}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Coluna Central: Dados Pessoais e Endereço */}
               <div className="md:col-span-2 space-y-8">
                  <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-[32px] sm:rounded-[48px] lg:rounded-[56px] border border-slate-100 shadow-sm space-y-8">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 italic">
                        <Info size={16} className="text-orange-500" /> Informações Pessoais
                     </h3>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nome</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 sm:px-8 sm:py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={profileForm.name}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, name: val }));
                                 updateGlobalUser({ name: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Cidade</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all font-sans"
                              placeholder="Ex: São Paulo"
                              value={profileForm.city}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, city: val }));
                                 updateGlobalUser({ city: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sobrenome</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={profileForm.surname}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, surname: val }));
                                 updateGlobalUser({ surname: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CPF</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={profileForm.cpf}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, cpf: val }));
                                 updateGlobalUser({ cpf: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">RG</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={profileForm.rg}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, rg: val }));
                                 updateGlobalUser({ rg: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Data de Nascimento</label>
                           <input
                              type="date"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all font-sans"
                              value={profileForm.birthDate}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, birthDate: val }));
                                 updateGlobalUser({ birthDate: val });
                              }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Cidade</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all font-sans"
                              placeholder="Sua cidade"
                              value={profileForm.city}
                              onChange={e => {
                                 const val = e.target.value;
                                 setProfileForm(prev => ({ ...prev, city: val }));
                                 updateGlobalUser({ city: val });
                              }}
                           />
                        </div>
                     </div>

                     <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 line-clamp-1">Endereço Completo</label>
                        <input
                           type="text"
                           className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                           placeholder="Rua, Número, Bairro, Cidade - UF"
                           value={profileForm.address}
                           onChange={e => { setProfileForm(prev => ({ ...prev, address: e.target.value })); updateGlobalUser({ address: e.target.value }); }}
                        />
                     </div>
                  </div>

                  <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-[32px] sm:rounded-[48px] lg:rounded-[56px] border border-slate-100 shadow-sm space-y-8">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 italic">
                        <Smartphone size={16} className="text-orange-500" /> Contato e Redes
                     </h3>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">WhatsApp</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              placeholder="(00) 00000-0000"
                              value={profileForm.whatsapp}
                              onChange={e => { setProfileForm(prev => ({ ...prev, whatsapp: e.target.value })); updateGlobalUser({ whatsapp: e.target.value }); }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Instagram</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              placeholder="@usuario"
                              value={profileForm.instagram}
                              onChange={e => { const val = e.target.value; setProfileForm(prev => ({ ...prev, instagram: val })); updateGlobalUser({ instagram: val }); }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Facebook</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              value={profileForm.facebook}
                              onChange={e => { const val = e.target.value; setProfileForm(prev => ({ ...prev, facebook: val })); updateGlobalUser({ facebook: val }); }}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Website / Outros</label>
                           <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                              placeholder="https://exemplo.com"
                              value={profileForm.website}
                              onChange={e => { const val = e.target.value; setProfileForm(prev => ({ ...prev, website: val })); updateGlobalUser({ website: val }); }}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const renderFinancial = () => {
      return (
         <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><DollarSign size={24} /></div>
               <div>
                  <h2 className="text-3xl font-black text-slate-900 italic uppercase">Financeiro</h2>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Transparência Clube AMABE</p>
               </div>
            </div>

            {/* Resumo Financeiro Dinâmico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase italic mb-2">Próximo Vencimento</p>
                  <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">
                     {(() => {
                        const unpaidPayments = payments
                           .filter(p => p.status !== PaymentStatus.PAID)
                           .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

                        if (unpaidPayments.length > 0) {
                           return new Date(unpaidPayments[0].dueDate).toLocaleDateString('pt-BR');
                        }
                        return 'Nenhum débito';
                     })()}
                  </h3>
                  <div className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-full w-fit ${payments.some(p => p.status === PaymentStatus.OVERDUE)
                     ? 'text-rose-600 bg-rose-50'
                     : 'text-amber-600 bg-amber-50'
                     }`}>
                     <Clock size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">
                        {payments.some(p => p.status === PaymentStatus.OVERDUE) ? 'Pagamento Atrasado' : 'Aguardando Pagamento'}
                     </span>
                  </div>
               </div>
               <div className="bg-[#0A101E] p-8 rounded-[40px] text-white shadow-2xl">
                  <p className="text-[10px] font-black text-orange-400 uppercase italic mb-2">Plano de Assinatura</p>
                  <h3 className="text-3xl font-black italic tracking-tighter">R$ 89,90/mês</h3>
                  <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Individual Elite</p>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 italic">Histórico de Mensalidades</h3>
               {payments.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.status === PaymentStatus.PAID ? 'bg-emerald-50 text-emerald-600' : (new Date(p.dueDate) < new Date() ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600')}`}><CreditCard size={28} /></div>
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase italic mb-1">Vencimento {new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                           <h4 className="text-lg font-black text-slate-900 italic tracking-tighter">R$ {p.amount.toFixed(2)}</h4>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${p.status === PaymentStatus.PAID
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : (new Date(p.dueDate) < new Date() ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100')
                        }`}>
                        {p.status === PaymentStatus.PAID ? 'PAGO' : (new Date(p.dueDate) < new Date() ? 'ATRASADO' : 'PENDENTE')}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="min-h-screen bg-[#F8FAFC]">
         {/* Renderização Condicional de Modais e Notificações */}
         {renderPasswordChangeModal()}
         {showSelfPasswordChange && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
               <div className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-2xl" onClick={() => setShowSelfPasswordChange(false)}></div>
               <div className="relative w-full max-w-md bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 p-8 sm:p-12 text-center">
                  <button
                     onClick={() => setShowSelfPasswordChange(false)}
                     className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                     <X size={24} />
                  </button>
                  <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-orange-600/20">
                     <Key size={36} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-4">Alterar Senha</h3>
                  <p className="text-slate-500 font-medium italic mb-10 leading-relaxed">
                     Defina uma nova senha de acesso para sua conta AMABE Elite.
                  </p>

                  <div className="space-y-6 text-left">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Nova Senha</label>
                        <input
                           type="password"
                           className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                           placeholder="••••••••"
                           value={newPasswords.password}
                           onChange={e => setNewPasswords({ ...newPasswords, password: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Confirmar Nova Senha</label>
                        <input
                           type="password"
                           className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all"
                           placeholder="••••••••"
                           value={newPasswords.confirm}
                           onChange={e => setNewPasswords({ ...newPasswords, confirm: e.target.value })}
                        />
                     </div>

                     <button
                        onClick={() => {
                           if (newPasswords.password !== newPasswords.confirm) {
                              showAlert('Senhas Diferentes', 'As senhas não coincidem!', 'warning');
                              return;
                           }
                           if (newPasswords.password.length < 4) {
                              showAlert('Senha Curta', 'A senha deve ter pelo menos 4 caracteres.', 'warning');
                              return;
                           }
                           onUpdateUser({
                              ...user,
                              password: newPasswords.password
                           });
                           setShowSelfPasswordChange(false);
                           setNewPasswords({ password: '', confirm: '' });
                           showAlert('Sucesso', 'Sua senha foi atualizada com sucesso!', 'success');
                        }}
                        className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#0A101E] transition-all transform hover:-translate-y-1 shadow-2xl mt-4"
                     >
                        Confirmar Alteração
                     </button>
                  </div>
               </div>
            </div>
         )}
         {renderNotification()}
         {renderAllCardsModal()}
         {renderVoucherSelectionModal()}
         {renderVoucherTicket()}
         {renderAddDependentModal()}
         {renderPartnerModal()}

         {activeTab === 'dash' && (
            <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-700 pb-20">
               {/* Hero Section / Banner de Notícias */}
               <div className="relative group">
                  {bannerNews.length > 0 ? (
                     <div className="relative h-[300px] md:h-[500px] rounded-[64px] overflow-hidden shadow-2xl">
                        {bannerNews.map((banner, idx) => (
                           <div
                              key={banner.id}
                              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentBannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                           >
                              <img src={banner.image} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0A101E] via-[#0A101E]/40 to-transparent flex items-end">
                                 <div className="hidden md:flex px-6 md:px-12 lg:px-24 pb-16 md:pb-20 w-full flex flex-col items-center md:items-start text-center md:text-left">
                                    <p className="text-orange-500 font-black text-[10px] md:text-[13px] uppercase tracking-[0.4em] mb-4 italic animate-in fade-in slide-in-from-bottom duration-700">{banner.category}</p>
                                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter italic mb-4 md:mb-8 uppercase leading-tight md:leading-[1.1] text-white animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                                       {banner.title}
                                    </h2>
                                    <p className="text-slate-300 text-[10px] md:text-base font-medium leading-relaxed mb-6 md:mb-10 line-clamp-3 md:line-clamp-2 max-w-lg animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                                       {banner.excerpt}
                                    </p>
                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 w-full md:w-auto">
                                       <button
                                          onClick={() => setSelectedNews(banner)}
                                          className="w-full md:w-auto px-10 py-5 bg-orange-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-orange-600 transition-all shadow-2xl flex items-center justify-center gap-3 group/btn"
                                       >
                                          Ler Matéria Completa <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                       </button>
                                       {banner.link && (
                                          <a href={banner.link} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                                             Abrir Link <ArrowUpRight size={14} />
                                          </a>
                                       )}
                                    </div>
                                    {/* Botão Simplificado para Mobile */}
                                    <div className="md:hidden absolute bottom-8 left-8 right-8 z-20">
                                       <button
                                          onClick={() => setSelectedNews(banner)}
                                          className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                       >
                                          Ver Destaque <ChevronRight size={14} />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}

                        {/* Controles do Carrossel */}
                        {bannerNews.length > 1 && (
                           <>
                              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                                 {bannerNews.map((_, idx) => (
                                    <button
                                       key={idx}
                                       onClick={() => setCurrentBannerIndex(idx)}
                                       className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${idx === currentBannerIndex ? "w-6 md:w-10 bg-orange-600" : "w-2 md:w-4 bg-white/20 hover:bg-white/40"}`}
                                    />
                                 ))}
                              </div>
                              <div className="absolute inset-y-0 left-8 right-8 flex items-center justify-between pointer-events-none">
                                 <button
                                    onClick={() => setCurrentBannerIndex(prev => (prev - 1 + bannerNews.length) % bannerNews.length)}
                                    className="w-10 h-10 md:w-14 md:h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-orange-600 hover:border-orange-600 transition-all pointer-events-auto"
                                 >
                                    <ChevronLeft size={24} />
                                 </button>
                                 <button
                                    onClick={() => setCurrentBannerIndex(prev => (prev + 1) % bannerNews.length)}
                                    className="w-10 h-10 md:w-14 md:h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-orange-600 hover:border-orange-600 transition-all pointer-events-auto"
                                 >
                                    <ChevronRight size={24} />
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  ) : (
                     /* Layout Original / Fallback se não houver banner */
                     <div className="bg-[#0F172A] rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] p-6 sm:p-12 lg:p-24 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-orange-600/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                           <div className="max-w-xl">
                              <p className="text-orange-500 font-black text-[11px] md:text-[13px] uppercase tracking-[0.4em] mb-4 italic">Clube de Benefícios AMABE</p>
                              <h1 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter italic mb-4 md:mb-8 uppercase leading-[1.1]">Olá, <br /><span className="text-orange-600">{liveUser.name.split(' ')[0]}</span></h1>
                              <div className="flex flex-wrap gap-2 md:gap-3 mt-6 md:mt-10">
                                 <div className="bg-emerald-600/10 text-emerald-400 px-5 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-2.5 w-fit">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">Benefícios Ativos</span>
                                 </div>
                                 <div className="bg-white/5 text-white/60 px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-2.5 w-fit">
                                    <ShieldCheck size={14} className="text-orange-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">Acesso Elite</span>
                                 </div>
                              </div>
                           </div>
                           <div className="hidden xl:flex items-center justify-center relative flex-1">
                              <div className="relative">
                                 {/* Decorative Glow behind logo */}
                                 <div className="absolute inset-0 bg-orange-600/20 blur-[100px] rounded-full"></div>

                                 <div className="relative flex flex-col items-center animate-in zoom-in duration-1000">
                                    <div className="w-32 h-32 md:w-48 md:h-48 bg-orange-600 rounded-[40px] md:rounded-[64px] flex items-center justify-center text-white shadow-2xl shadow-orange-600/40 rotate-6 hover:rotate-12 transition-all duration-700 border-4 border-white/20">
                                       <ShieldCheck size={80} strokeWidth={1.5} className="md:hidden" />
                                       <ShieldCheck size={120} strokeWidth={1.5} className="hidden md:block" />
                                    </div>
                                    <div className="mt-10 text-center">
                                       <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-white leading-none">AMABE</h1>
                                       <p className="text-orange-500 font-black text-[12px] md:text-sm uppercase tracking-[1em] mt-4 mr-[-1em] italic">Elite Club</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-1 gap-16 px-4">
                  {/* Seção de Destaques dos Parceiros */}
                  {news.some(n => n.isFeatured) && (
                     <div className="space-y-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 transform group-hover:rotate-0 transition-transform"><Tag size={20} /></div>
                           <div>
                              <h2 className="text-xl md:text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Destaques</h2>
                              <p className="text-slate-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest mt-1">Club de Parceiros</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                           {/* Notícias em Destaque Reais do Admin */}
                           {news.filter(n => n.isFeatured).slice(0, 6).map((item) => (
                              <div key={item.id} className="group bg-white rounded-3xl md:rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                                 <div className="relative h-32 md:h-48 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                       <span className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-slate-900/60 border border-white/20 shadow-sm">
                                          {item.category}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-4 md:p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1.5 mb-2">
                                       <div className="w-1 h-1 rounded-full bg-orange-600 animate-pulse"></div>
                                       <span className="text-[7px] md:text-[9px] font-black text-orange-600 uppercase tracking-widest italic">Destaque</span>
                                    </div>
                                    <h3 className="text-sm md:text-xl font-black text-slate-900 italic mb-4 leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight line-clamp-2">
                                       {item.title}
                                    </h3>
                                    <button
                                       onClick={() => setSelectedNews(item)}
                                       className="mt-auto w-full py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
                                    >
                                       Ler Matéria <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Seção de Notícias AMABE */}
                  {news.length > 0 && (
                     <div className="space-y-10">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                           <div>
                              <h2 className="text-2xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Notícias AMABE</h2>
                              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">O que acontece na sua associação</p>
                           </div>
                           <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0A101E] hover:text-white transition-all group">
                              Todas Notícias <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                           {[...news].sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1)).map((item) => (
                              <div key={item.id} className="group bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                                 <div className="relative h-32 md:h-64 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-8 left-8">
                                       <span className="px-5 py-2 bg-white/60 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-slate-900/60 border border-white/20 shadow-sm">
                                          {item.category}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-4 md:p-10 flex-1 flex flex-col">
                                    {item.isFeatured && (
                                       <div className="flex items-center gap-2 mb-2 md:mb-3">
                                          <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-orange-600 animate-pulse"></div>
                                          <span className="text-[7px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest italic">Destaque</span>
                                       </div>
                                    )}
                                    <p className="text-[7px] md:text-[10px] font-black text-orange-500/60 uppercase tracking-widest mb-2 md:mb-4">{item.date}</p>
                                    <h3 className="text-xs md:text-2xl font-black text-slate-900 italic mb-2 md:mb-4 leading-[1.1] group-hover:text-orange-600 transition-colors uppercase tracking-tight line-clamp-2 md:line-clamp-none">
                                       {item.title}
                                    </h3>
                                    <p className="hidden md:block text-slate-500 text-[13px] font-medium leading-relaxed mb-8 line-clamp-2">
                                       {item.excerpt}
                                    </p>
                                    <button
                                       onClick={() => setSelectedNews(item)}
                                       className="mt-auto w-full py-3 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-[24px] text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-slate-900/10 active:scale-95 group/btn"
                                    >
                                       Ler Matéria <ChevronRight size={14} className="md:size-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               {/* Banner de CTA Final Rodapé Full Width */}
               <div className="px-4 mt-20">
                  <div className="bg-[#0A101E] p-6 sm:p-10 lg:p-16 rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] text-white relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-orange-600/20 transition-all duration-700"></div>
                     <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                     <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">
                        <div className="max-w-2xl text-center xl:text-left space-y-4">
                           <h4 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Quer anunciar aqui?</h4>
                           <p className="text-slate-400 text-xs md:text-lg font-bold uppercase tracking-widest">
                              Seja um parceiro <span className="text-orange-500">AMABE Elite</span> e alcance milhares de associados com exclusividade.
                           </p>
                        </div>
                        <a
                           href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre como anunciar no AMABE Elite."
                           target="_blank"
                           rel="noreferrer"
                           className="px-12 py-6 bg-orange-600 text-white rounded-[32px] font-black text-xs md:text-base uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-orange-600 transition-all active:scale-95 flex items-center gap-4 whitespace-nowrap"
                        >
                           Fale Conosco agora <MessageCircle size={20} />
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'card' && renderWallet()}
         {activeTab === 'profile' && renderProfile()}
         {activeTab === 'payments' && renderFinancial()}
         {activeTab === 'club' && renderClub()}

         {/* Modal de Notícia na Íntegra */}
         {selectedNews && (
            <div className="fixed inset-0 bg-[#0A101E]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
               <div className="absolute inset-0" onClick={() => setSelectedNews(null)}></div>
               <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-[48px] md:rounded-[64px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-500">
                  <button
                     onClick={() => setSelectedNews(null)}
                     className="absolute top-8 right-8 z-50 p-4 bg-white/10 backdrop-blur-md text-white md:text-slate-400 md:bg-slate-50 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                  >
                     <X size={24} />
                  </button>

                  <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
                     <img src={selectedNews.image} className="w-full h-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                     <div className="absolute bottom-6 left-8 md:hidden text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{selectedNews.category}</p>
                        <h2 className="text-2xl font-black italic uppercase leading-tight mt-1">{selectedNews.title}</h2>
                     </div>
                  </div>

                  <div className="flex-1 p-8 md:p-16 overflow-y-auto no-scrollbar bg-white">
                     <div className="hidden md:block mb-10">
                        <p className="text-orange-600 font-black text-[11px] uppercase tracking-[0.4em] mb-3 italic">{selectedNews.category}</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 italic uppercase leading-[1.1] tracking-tighter mb-4">{selectedNews.title}</h2>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                           <Clock size={12} /> {selectedNews.date}
                        </div>
                     </div>

                     <div className="prose prose-slate max-w-none">
                        <div className="text-slate-600 font-medium leading-relaxed text-sm md:text-lg space-y-6">
                           {selectedNews.content ? (
                              selectedNews.content.split('\n').map((para, i) => (
                                 <p key={i}>{para}</p>
                              ))
                           ) : (
                              <p>{selectedNews.excerpt}</p>
                           )}
                        </div>
                     </div>

                     {selectedNews.link && (
                        <div className="mt-12 pt-10 border-t border-slate-100">
                           <a
                              href={selectedNews.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A101E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                           >
                              Saiba Mais na Fonte <ArrowUpRight size={16} />
                           </a>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
         {/* Alerta Global do Sistema */}
         {showGlobalAlert && systemNotification && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
               <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 relative">
                  <button
                     onClick={() => setShowGlobalAlert(false)}
                     className="absolute top-8 right-8 w-12 h-12 bg-slate-100 hover:bg-[#0A101E] text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all z-10 shadow-sm"
                  >
                     <X size={20} />
                  </button>

                  {systemNotification.image && (
                     <div className="aspect-[16/10] w-full overflow-hidden">
                        <img src={systemNotification.image} className="w-full h-full object-cover" alt="alerta" />
                     </div>
                  )}

                  <div className="p-10 text-center">
                     <div className="w-16 h-16 bg-orange-600 rounded-[28px] flex items-center justify-center text-white shadow-xl mx-auto mb-6 -mt-18 border-4 border-white relative z-10">
                        <Bell size={28} className="animate-bounce" />
                     </div>

                     <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight mb-4">
                        {systemNotification.title}
                     </h2>

                     <div className="prose prose-slate max-w-none">
                        <p className="text-slate-500 font-bold text-sm leading-relaxed whitespace-pre-line">
                           {systemNotification.message}
                        </p>
                     </div>

                     <button
                        onClick={() => setShowGlobalAlert(false)}
                        className="w-full mt-10 py-5 bg-[#0A101E] text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                     >
                        Entendido, obrigado!
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default MemberDashboard;
