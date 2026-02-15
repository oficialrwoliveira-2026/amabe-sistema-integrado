import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Partner, User, BenefitUsage, MemberStatus, DashboardTab, UserRole, Payment, PaymentStatus, NewsItem, SystemNotification, SystemSettings } from '../types';
import { CATEGORIES, PARA_CITIES } from '../constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CheckCircle, UserCircle, Camera, Pencil, Settings, Image as ImageIcon } from 'lucide-react';

// Modular Components
import StatsOverview from './admin/StatsOverview';
import MemberList from './admin/MemberList';
import MemberEditor from './admin/MemberEditor';
import PartnerManager from './admin/PartnerManager';
import FinanceManager from './admin/FinanceManager';
import NewsManager from './admin/NewsManager';
import IntelligenceView from './admin/IntelligenceView';
import VouchersManager from './admin/VouchersManager';

interface AdminDashboardProps {
  activeTab: DashboardTab;
  partners: Partner[];
  members: User[];
  history: BenefitUsage[];
  payments: Payment[];
  onApprovePartner: (id: string) => void;
  onApproveMember: (id: string) => void;
  onUpdatePartner: (partner: Partner) => void;
  onAddPartner: (partner: Partner) => void;
  onToggleMemberStatus: (id: string) => void;
  onUpdateMember: (user: User) => void;
  onAddMember: (user: User) => void;
  news: NewsItem[];
  systemNotification: SystemNotification | null;
  onUpdateNews: (news: NewsItem) => void;
  onAddNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onUpdateSystemNotification: (notification: SystemNotification | null) => void;
  setActiveTab?: (tab: DashboardTab) => void;
  currentUser: User | null;
  onUpdatePaymentStatus: (paymentId: string, status: PaymentStatus, adminName: string) => void;
  onGenerateYearlyPayments: (memberId: string, memberName: string, year: number) => void;
  onDeletePayment: (paymentId: string) => void;
  onResetPassword: (id: string) => void;
  onDeleteUser: (userId: string) => void;
  showAlert: (title: string, message: string, type?: any) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onLoadFullProfile?: (userId: string) => Promise<any>;
  systemSettings: SystemSettings | null;
  onUpdateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

const STATUS_COLORS: Record<string, string> = {
  'Ativos': '#10b981',
  'Pendentes': '#f59e0b',
  'Inativos': '#ef4444'
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab, partners, members, history, payments,
  onApprovePartner, onApproveMember, onUpdatePartner, onAddPartner,
  onToggleMemberStatus, onUpdateMember, onAddMember,
  news, onUpdateNews, onAddNews, onDeleteNews,
  systemNotification, onUpdateSystemNotification,
  currentUser, onUpdatePaymentStatus, onGenerateYearlyPayments, onDeletePayment, onResetPassword, onDeleteUser,
  showAlert, showConfirm, onLoadFullProfile, systemSettings, onUpdateSystemSettings
}) => {
  // --- States ---
  const [memberSearch, setMemberSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'overdue'>('all');
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [memberForm, setMemberForm] = useState<Partial<User>>({
    name: '', email: '', role: UserRole.MEMBER, status: MemberStatus.ACTIVE,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    dependents: []
  });

  const [partnerSearch, setPartnerSearch] = useState('');
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerForm, setPartnerForm] = useState<Partial<Partner>>({
    name: '', email: '', category: 'Saúde', status: 'ACTIVE', gallery: []
  });

  const [showAddNews, setShowAddNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [notificationForm, setNotificationForm] = useState<Partial<SystemNotification>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [adminProfileForm, setAdminProfileForm] = useState({
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    avatar: currentUser?.avatar || ''
  });

  const [settingsForm, setSettingsForm] = useState<Partial<SystemSettings>>({
    name: systemSettings?.name || 'AMABE',
    logo_url: systemSettings?.logo_url || '',
    primary_color: systemSettings?.primary_color || '#ff6b00'
  });

  useEffect(() => {
    if (systemSettings) {
      setSettingsForm({
        name: systemSettings.name,
        logo_url: systemSettings.logo_url,
        primary_color: systemSettings.primary_color
      });
    }
  }, [systemSettings]);


  useEffect(() => {
    if (currentUser) {
      setAdminProfileForm({
        name: currentUser.name || '',
        surname: currentUser.surname || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  // --- Effects ---
  useEffect(() => {
    if (editingMember) {
      setMemberForm(editingMember);
      setIsCreatingMember(true);
      if (onLoadFullProfile && (!editingMember.dependents || editingMember.dependents.length === 0)) {
        onLoadFullProfile(editingMember.id);
      }
    }
  }, [editingMember, onLoadFullProfile]);

  // Sincronização de formulários - Refatorada para ser mais robusta
  useEffect(() => {
    if (editingPartner) {
      console.log('AdminDashboard: Sincronizando partnerForm com editingPartner:', editingPartner.id);
      setIsCreatingPartner(true);

      // Busca a versão mais recente do parceiro na lista global
      const livePartner = partners.find(p => p.id === editingPartner.id);

      setPartnerForm(prev => {
        // Se o ID mudou ou o formulário está vazio, inicializa com o parceiro live
        if (!prev.id || prev.id !== editingPartner.id) {
          console.log('AdminDashboard: Inicializando formulário para novo parceiro em edição');
          return { ... (livePartner || editingPartner), password: '' };
        }
        // Se já estamos editando o mesmo parceiro, só atualizamos campos que NÃO foram alterados localmente
        // Isso evita que o upload de imagem (logo) seja sobrescrito por um refresh do banco
        return { ...livePartner, ...prev };
      });

      if (onLoadFullProfile && (!editingPartner.gallery || editingPartner.gallery.length === 0)) {
        onLoadFullProfile(editingPartner.id);
      }
    }
  }, [editingPartner, onLoadFullProfile, partners]); // Adicionado partners para reagir a updates do banco, mas setPartnerForm protege as mudanças locais

  useEffect(() => {
    if (systemNotification) {
      setNotificationForm(systemNotification);
    }
  }, [systemNotification]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // --- Analytics & Derived Data ---
  const memberFinancialStatus = useMemo(() => {
    const now = new Date();
    return members
      .filter(m => (m.name || '').toLowerCase().includes((paymentSearch || '').toLowerCase()) || (m.memberId || '').toLowerCase().includes((paymentSearch || '').toLowerCase()))
      .map(member => {
        const memberPayments = payments.filter(p => p.memberId === member.id);

        // Dynamic check for overdue if not updated in DB
        const processedPayments = memberPayments.map(p => {
          if (p.status === PaymentStatus.PENDING && new Date(p.dueDate) < now) {
            return { ...p, status: PaymentStatus.OVERDUE };
          }
          return p;
        });

        const sortedPayments = [...processedPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        const lastPayment = [...processedPayments].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0];

        const hasOverdue = processedPayments.some(p => p.status === PaymentStatus.OVERDUE);
        const status = hasOverdue ? 'overdue' : 'paid';

        return { member, lastPayment, status, allPayments: sortedPayments };
      })
      .filter(item => paymentStatusFilter === 'all' || item.status === paymentStatusFilter);
  }, [members, payments, paymentSearch, paymentStatusFilter]);

  // --- Analytics & Derived Data ---
  // --- Analytics & Derived Data ---
  const analytics = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === MemberStatus.ACTIVE).length;
    const pendingMembers = members.filter(m => m.status === MemberStatus.PENDING).length;

    const now = new Date();

    // Revenue calculations independent of table filters BUT scoped to existing members
    const validMemberIds = new Set<string>();
    members.forEach(m => {
      if (m.id) validMemberIds.add(m.id);
      if (m.memberId) validMemberIds.add(m.memberId);
    });

    let totalRevenue = 0;
    let pendingRevenue = 0;
    let overdueRevenue = 0;

    let prevTotalRevenue = 0;
    let prevPendingRevenue = 0;
    let prevOverdueRevenue = 0;

    payments.forEach(p => {
      if (!p.memberId || !validMemberIds.has(p.memberId)) return;

      const d = new Date(p.dueDate);
      const amount = Number(p.amount) || 0;

      if (p.status === PaymentStatus.PAID) {
        totalRevenue += amount;
      } else {
        const isOverdue = p.status === PaymentStatus.OVERDUE || d < now;
        if (isOverdue) overdueRevenue += amount;
        else pendingRevenue += amount;
      }
    });

    totalRevenue = Math.round(totalRevenue * 100) / 100;
    pendingRevenue = Math.round(pendingRevenue * 100) / 100;
    overdueRevenue = Math.round(overdueRevenue * 100) / 100;

    const calculateTrend = (current: number, previous: number) => 0;

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const activityByDay = history.reduce((acc, current) => {
      const day = new Date(current.date).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const trendData = [
      { name: 'Seg', total: activityByDay[1] || 0 },
      { name: 'Ter', total: activityByDay[2] || 0 },
      { name: 'Qua', total: activityByDay[3] || 0 },
      { name: 'Qui', total: activityByDay[4] || 0 },
      { name: 'Sex', total: activityByDay[5] || 0 },
      { name: 'Sab', total: activityByDay[6] || 0 },
      { name: 'Dom', total: activityByDay[0] || 0 }
    ];

    const usersStatusData = [
      { name: 'Ativos', value: activeMembers },
      { name: 'Pendentes', value: pendingMembers },
      { name: 'Inativos', value: members.filter(m => m.status === MemberStatus.INACTIVE).length }
    ];

    const topPartners = Object.entries(history.reduce((acc, h) => {
      acc[h.partnerName] = (acc[h.partnerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 5).map(([name, value]) => ({ name, value }));

    const engagedCategories = Object.entries(history.reduce((acc, h) => {
      acc[h.category || 'Geral'] = (acc[h.category || 'Geral'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 5).map(([name, value]) => ({ name, value }));

    const cityDistribution = Object.entries(members.reduce((acc, m) => {
      const city = m.city || 'Outros';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .map(([name, value]) => ({ name, value }));

    const partnerCityDistribution = Object.entries(partners.reduce((acc, p) => {
      const city = p.city || 'Outros';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .map(([name, value]) => ({ name, value }));

    return {
      totalMembers, activeMembers, pendingMembers,
      totalRevenue, pendingRevenue, overdueRevenue,
      revenueTrend: calculateTrend(totalRevenue, 0),
      pendingTrend: calculateTrend(pendingRevenue, 0),
      overdueTrend: calculateTrend(overdueRevenue, 0),
      overdueMembersCount: members.filter(m => {
        const memberPayments = payments.filter(p => p.memberId === m.id || p.memberId === m.memberId);
        return memberPayments.some(p => p.status === PaymentStatus.OVERDUE || (p.status === PaymentStatus.PENDING && new Date(p.dueDate) < now));
      }).length,
      partnersCount: partners.length,
      totalAccesses: members.reduce((sum, u) => sum + (u.loginCount || 0), 0),
      trendData, usersStatusData, topPartners, engagedCategories, cityDistribution, partnerCityDistribution
    };
  }, [members, payments, history, partners.length]);

  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      (m.name || '').toLowerCase().includes((memberSearch || '').toLowerCase()) ||
      (m.memberId || '').toLowerCase().includes((memberSearch || '').toLowerCase()) ||
      (m.cpf || '').includes(memberSearch)
    );
  }, [members, memberSearch]);


  // --- Handlers ---
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'member' | 'partner' | 'gallery' | 'news' | 'notification') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    const processFile = (file: File) => {
      if (file.size > MAX_SIZE) {
        showAlert('Arquivo muito grande', 'O tamanho máximo permitido é 2MB.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log(`AdminDashboard: Leitura concluída para ${file.name}. Tamanho base64:`, base64.length);
        if (type === 'member') setMemberForm(prev => ({ ...prev, avatar: base64 }));
        else if (type === 'partner') {
          console.log('AdminDashboard: Atualizando partnerForm.logo');
          setPartnerForm(prev => ({ ...prev, logo: base64 }));
        }
        else if (type === 'gallery') setPartnerForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), base64] }));
        else if (type === 'news') setNewsForm(prev => ({ ...prev, image: base64 }));
        else if (type === 'notification') setNotificationForm(prev => ({ ...prev, image: base64 }));
      };
      reader.onerror = (err) => {
        console.error('AdminDashboard: Erro ao ler arquivo:', err);
        showAlert('Erro no Upload', 'Ocorreu um erro ao ler o arquivo.', 'error');
      };
      reader.readAsDataURL(file);
    };

    Array.from(files).forEach(processFile);

    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [showAlert]);

  const handleRemoveGalleryImage = useCallback((index: number) => {
    setPartnerForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index)
    }));
  }, []);

  const handleSaveMember = useCallback(async () => {
    if (!memberForm.name || !memberForm.email) {
      showAlert('Campos Obrigatórios', 'Nome e E-mail são obrigatórios.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      if (editingMember) {
        await onUpdateMember({ ...editingMember, ...memberForm } as User);
      } else {
        await onAddMember({
          ...memberForm,
          role: memberForm.role || UserRole.MEMBER,
          status: MemberStatus.ACTIVE,
          loginCount: 0,
          mustChangePassword: !!memberForm.password
        } as User);
      }
      setIsCreatingMember(false);
      setEditingMember(null);
      setSuccessMsg('Associado Salvo!');
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally { setIsSaving(false); }
  }, [memberForm, editingMember, onUpdateMember, onAddMember, showAlert]);

  const handleSavePartner = useCallback(async () => {
    if (!partnerForm.name || !partnerForm.email) {
      showAlert('Campos Obrigatórios', 'Nome e E-mail são obrigatórios.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      if (editingPartner) {
        await onUpdatePartner({ ...editingPartner, ...partnerForm } as Partner);
      } else {
        await onAddPartner({ ...partnerForm, status: 'ACTIVE' } as Partner);
      }
      setIsCreatingPartner(false);
      setEditingPartner(null);
      setSuccessMsg('Parceiro Salvo!');
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally { setIsSaving(false); }
  }, [partnerForm, editingPartner, onUpdatePartner, onAddPartner, showAlert]);

  const handleSaveNews = useCallback(async () => {
    if (!newsForm.title || !newsForm.content) {
      showAlert('Campos Obrigatórios', 'Título e Conteúdo são obrigatórios.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      if (editingNews) {
        await onUpdateNews({ ...editingNews, ...newsForm } as NewsItem);
      } else {
        await onAddNews({
          ...newsForm,
          date: new Date().toISOString(),
          viewedBy: []
        } as NewsItem);
      }
      setShowAddNews(false);
      setEditingNews(null);
      setSuccessMsg('Matéria Salva!');
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally { setIsSaving(false); }
  }, [newsForm, editingNews, onUpdateNews, onAddNews, showAlert]);

  const handleQuickPay = useCallback((memberId: string) => {
    const memberPayments = payments.filter(p => p.memberId === memberId && p.status !== PaymentStatus.PAID);
    if (memberPayments.length === 0) return;

    // Find the most overdue (earliest dueDate)
    const mostOverdue = [...memberPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    onUpdatePaymentStatus(mostOverdue.id, PaymentStatus.PAID, currentUser?.name || 'Admin');
    setSuccessMsg(`Pagamento de ${new Date(mostOverdue.dueDate).toLocaleDateString('pt-BR', { month: 'long' })} registrado!`);
    setShowSuccess(true);
  }, [payments, onUpdatePaymentStatus, currentUser]);

  const handlePayInstallment = useCallback((paymentId: string) => {
    onUpdatePaymentStatus(paymentId, PaymentStatus.PAID, currentUser?.name || 'Admin');
    setSuccessMsg("Pagamento registrado com sucesso!");
    setShowSuccess(true);
  }, [onUpdatePaymentStatus, currentUser]);

  const handleCancelPayment = useCallback((paymentId: string) => {
    onUpdatePaymentStatus(paymentId, PaymentStatus.PENDING, currentUser?.name || 'Admin');
    setSuccessMsg("Pagamento cancelado e estornado com sucesso!");
    setShowSuccess(true);
  }, [onUpdatePaymentStatus, currentUser]);

  const handleGenerateInstallments = useCallback((memberId: string, memberName: string) => {
    const year = new Date().getFullYear();
    onGenerateYearlyPayments(memberId, memberName, year);
    setSuccessMsg(`12 parcelas de ${year} geradas para ${memberName}!`);
    setShowSuccess(true);
  }, [onGenerateYearlyPayments]);

  const handleSaveAdminProfile = useCallback(async () => {
    if (!adminProfileForm.name) {
      showAlert('Campo Obrigatório', 'O nome é obrigatório.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      if (currentUser) {
        await onUpdateMember({
          ...currentUser,
          name: adminProfileForm.name,
          surname: adminProfileForm.surname,
          avatar: adminProfileForm.avatar
        } as User);
        setSuccessMsg('Perfil Atualizado!');
        setShowSuccess(true);
      }
    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível atualizar o perfil.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [adminProfileForm, currentUser, onUpdateMember, showAlert]);

  const exportFinancials = useCallback((format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Relatório Financeiro AMABE', 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Associado', 'ID', 'Status', 'Valor']],
        body: memberFinancialStatus.map(f => [f.member.name, f.member.memberId, f.status, f.lastPayment?.amount || 0])
      });
      doc.save('financeiro-amabe.pdf');
    } else {
      const ws = XLSX.utils.json_to_sheet(memberFinancialStatus.map(f => ({
        Nome: f.member.name,
        ID: f.member.memberId,
        Status: f.status,
        Valor: f.lastPayment?.amount || 0
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Financeiro');
      XLSX.writeFile(wb, `financeiro-amabe.${format === 'excel' ? 'xlsx' : 'csv'}`);
    }
  }, [memberFinancialStatus]);

  // --- Render ---
  return (
    <div className="w-full max-w-full mx-auto pb-10 relative">
      {activeTab === 'dash' && (
        <div className="relative space-y-8 sm:space-y-12 lg:space-y-16 p-6 sm:p-10 lg:p-16 min-h-screen overflow-hidden">
          {/* Background Tech Effects - Subtly refined */}
          <div className="absolute inset-0 tech-grid opacity-[0.02] pointer-events-none"></div>
          <div className="scanline"></div>

          <div className="relative z-10 space-y-16">
            <StatsOverview analytics={analytics} />
            <IntelligenceView analytics={analytics} statusColors={STATUS_COLORS} />
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <>
          <MemberList
            members={filteredMembers}
            memberSearch={memberSearch}
            setMemberSearch={setMemberSearch}
            onToggleMemberStatus={onToggleMemberStatus}
            setEditingMember={setEditingMember}
            setIsCreatingMember={setIsCreatingMember}
            onResetPassword={onResetPassword}
            onDeleteUser={onDeleteUser}
          />
          {isCreatingMember && (
            <MemberEditor
              isOpen={isCreatingMember}
              onClose={() => { setIsCreatingMember(false); setEditingMember(null); }}
              memberForm={memberForm}
              setMemberForm={setMemberForm}
              onSave={handleSaveMember}
              isSaving={isSaving}
              handleImageUpload={handleImageUpload}
              editingMember={editingMember}
            />
          )}
        </>
      )}

      {activeTab === 'partners' && (
        <PartnerManager
          partners={partners}
          partnerSearch={partnerSearch}
          setPartnerSearch={setPartnerSearch}
          isCreatingPartner={isCreatingPartner}
          setIsCreatingPartner={setIsCreatingPartner}
          editingPartner={editingPartner}
          setEditingPartner={setEditingPartner}
          partnerForm={partnerForm}
          setPartnerForm={setPartnerForm}
          isSaving={isSaving}
          onSave={handleSavePartner}
          onApprove={onApprovePartner}
          onDelete={onDeleteUser}
          onResetPassword={onResetPassword}
          handleImageUpload={handleImageUpload}
          onRemoveGalleryImage={handleRemoveGalleryImage}
          showAlert={showAlert}
        />
      )}

      {activeTab === 'payments' && (
        <FinanceManager
          analytics={analytics}
          paymentStatusFilter={paymentStatusFilter}
          setPaymentStatusFilter={setPaymentStatusFilter}
          paymentSearch={paymentSearch}
          setPaymentSearch={setPaymentSearch}
          memberFinancialStatus={memberFinancialStatus}
          onExport={exportFinancials}
          onSelectMember={(user) => { /* Could open a detail view */ }}
          onGenerateInstallments={handleGenerateInstallments}
          onQuickPay={handleQuickPay}
          onPayInstallment={handlePayInstallment}
          onCancelPayment={handleCancelPayment}
          onDeletePayment={onDeletePayment}
        />
      )}

      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-2xl sm:rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-orange-600/20">
              <UserCircle size={24} className="sm:hidden" />
              <UserCircle size={32} className="hidden sm:block" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Meu Perfil</h2>
              <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1">Configurações de Administrador</p>
            </div>
          </div>

          <div className="bg-white rounded-[40px] sm:rounded-[56px] border border-slate-100 shadow-xl overflow-hidden">
            <div className="flex flex-col md:grid md:grid-cols-3">
              <div className="bg-[#0A101E] p-8 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-orange-600/10 to-transparent"></div>

                <div
                  className="group relative cursor-pointer z-10"
                  onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] border-4 border-white/10 overflow-hidden shadow-2xl transition-all group-hover:scale-105 group-hover:border-orange-500/50">
                    <img
                      src={adminProfileForm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfileForm.name)}&background=ea580c&color=fff`}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="admin-avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAdminProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-xl sm:rounded-2xl absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 border-2 sm:border-4 border-[#0A101E] flex items-center justify-center text-white shadow-xl">
                    <Pencil size={10} className="sm:hidden" />
                    <Pencil size={12} className="hidden sm:block" />
                  </div>
                </div>

                <div className="z-10">
                  <h3 className="text-white font-black text-lg sm:text-xl italic uppercase tracking-tight line-clamp-1">{adminProfileForm.name}</h3>
                  <p className="text-orange-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 sm:mt-2">Nível: Administrador</p>
                </div>
              </div>

              <div className="md:col-span-2 p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 ml-3 sm:ml-4">
                      <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
                      <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Primeiro Nome</label>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-xs sm:text-sm"
                      value={adminProfileForm.name}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 ml-3 sm:ml-4">
                      <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
                      <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sobrenome</label>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-xs sm:text-sm"
                      value={adminProfileForm.surname}
                      onChange={e => setAdminProfileForm(prev => ({ ...prev, surname: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 ml-3 sm:ml-4">
                    <div className="w-1 h-3 bg-slate-200 rounded-full"></div>
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest italic">E-mail de Acesso (Não editável)</label>
                  </div>
                  <input
                    type="email"
                    disabled
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-5 outline-none font-bold text-slate-400 cursor-not-allowed text-xs sm:text-sm"
                    value={currentUser?.email || ''}
                  />
                </div>

                <div className="pt-4 sm:pt-6 flex justify-end">
                  <button
                    onClick={handleSaveAdminProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-[#0A101E] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-[28px] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : (
                      <>
                        <CheckCircle size={16} className="sm:hidden" />
                        <CheckCircle size={18} className="hidden sm:block group-hover:rotate-12 transition-transform" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 rounded-2xl sm:rounded-[28px] flex items-center justify-center text-white shadow-2xl">
              <Settings size={24} className="sm:hidden" />
              <Settings size={32} className="hidden sm:block" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Configurações</h2>
              <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1">Personalização do Sistema</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-16 space-y-10 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-orange-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Branding e Identidade</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nome do Sistema</label>
                  </div>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-sm"
                    value={settingsForm.name}
                    onChange={e => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Cor Primária (HEX)</label>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      className="w-16 h-15 bg-slate-50 border border-slate-100 rounded-2xl p-1 cursor-pointer"
                      value={settingsForm.primary_color}
                      onChange={e => setSettingsForm(prev => ({ ...prev, primary_color: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-sm"
                      value={settingsForm.primary_color}
                      onChange={e => setSettingsForm(prev => ({ ...prev, primary_color: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Logo do Sistema</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div
                    className="group relative cursor-pointer"
                    onClick={() => document.getElementById('system-logo-upload')?.click()}
                  >
                    <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center p-4 border border-slate-800 overflow-hidden shadow-xl transition-all group-hover:scale-105 group-hover:border-orange-500/50">
                      {settingsForm.logo_url ? (
                        <img src={settingsForm.logo_url} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-700" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      id="system-logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSettingsForm(prev => ({ ...prev, logo_url: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="w-6 h-6 bg-orange-600 rounded-xl absolute -bottom-1 -right-1 border-2 border-white flex items-center justify-center text-white shadow-xl">
                      <Pencil size={10} />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 flex items-center justify-between group cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-all" onClick={() => document.getElementById('system-logo-upload')?.click()}>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-orange-600 truncate max-w-[200px]">
                        {settingsForm.logo_url && settingsForm.logo_url.startsWith('data:') ? 'Imagem carregada' : (settingsForm.logo_url || 'Nenhuma imagem selecionada')}
                      </span>
                      <button className="text-[9px] font-black text-white bg-[#0A101E] px-4 py-2 rounded-xl uppercase tracking-widest group-hover:bg-orange-600 transition-all">Upload</button>
                    </div>
                    <div className="flex gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-1"></div>
                      A imagem será salva diretamente na galeria do sistema.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await onUpdateSystemSettings(settingsForm);
                    showAlert('Sucesso', 'Configurações do sistema aplicadas com sucesso!', 'success');
                  } catch (err) {
                    // Erro já tratado e exibido no App.tsx
                    console.error('Falha ao salvar configurações:', err);
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="w-full sm:w-auto bg-[#0A101E] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-[28px] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
              >
                {isSaving ? 'Aplicando...' : (
                  <>
                    <CheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
                    Aplicar Configurações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {activeTab === 'news' && (
        <NewsManager
          news={news}
          systemNotification={systemNotification}
          showAddNews={showAddNews}
          setShowAddNews={setShowAddNews}
          editingNews={editingNews}
          setEditingNews={setEditingNews}
          newsForm={newsForm}
          setNewsForm={setNewsForm}
          notificationForm={notificationForm}
          setNotificationForm={setNotificationForm}
          showNotificationManager={showNotificationManager}
          setShowNotificationManager={setShowNotificationManager}
          onSaveNews={handleSaveNews}
          onDeleteNews={onDeleteNews}
          onUpdateSystemNotification={onUpdateSystemNotification}
          handleImageUpload={handleImageUpload}
          setShowSuccess={setShowSuccess}
          setSuccessMsg={setSuccessMsg}
          members={members}
        />
      )}

      {/* Success Notification Toast */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-emerald-600 text-white px-10 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 border-4 border-white">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle size={18} />
            </div>
            <span className="font-black uppercase tracking-widest text-xs italic">{successMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminDashboard);
