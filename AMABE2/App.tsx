import React, { useState, useEffect } from 'react';
import { Bell, X, Key } from 'lucide-react';
import { User, UserRole, Partner, BenefitUsage, MemberStatus, DashboardTab, Payment, PaymentStatus, NewsItem, SystemNotification, SystemSettings } from './types';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import PartnerDashboard from './components/PartnerDashboard';
import Layout from './components/Layout';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { supabase } from './supabase';
import SystemNotificationComponent, { NotificationType } from './components/SystemNotification';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const isFetchingRef = React.useRef(false);
  const isFetchingProfileRef = React.useRef(false);
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword' | 'resetPassword'>('login');
  const [activeTab, setActiveTab] = useState<DashboardTab>('dash');

  const [partners, setPartners] = useState<Partner[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<BenefitUsage[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [systemNotification, setSystemNotification] = useState<SystemNotification | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<{ id: string; name: string } | null>(null);
  const [customPassword, setCustomPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Interface de Notificações Customizadas
  const [appNotification, setAppNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string, type: NotificationType = 'info') => {
    setAppNotification({ isOpen: true, type, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setAppNotification({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  // --- Funções de Carregamento ---

  const fetchPublicData = async () => {
    try {
      const { data: newsData } = await supabase
        .from('news')
        .select('id, title, excerpt, content, category, image_url, date, is_featured, show_in_banner, viewed_by, author')
        .order('date', { ascending: false })
        .limit(20);
      if (newsData) {
        setNews(newsData.map(n => ({
          ...n,
          image: n.image_url,
          isFeatured: n.is_featured,
          showInBanner: n.show_in_banner,
          viewedBy: n.viewed_by || []
        } as unknown as NewsItem)));
      }

      const { data: notifData } = await supabase
        .from('system_notifications')
        .select('id, title, message, image_url, is_active, viewed_by, created_by')
        .eq('is_active', true)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (notifData) {
        setSystemNotification({
          ...notifData,
          image: notifData.image_url,
          isActive: notifData.is_active,
          viewedBy: notifData.viewed_by || [],
          createdBy: notifData.created_by
        } as SystemNotification);
      } else {
        setSystemNotification(null);
      }

      const { data: settingsData } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (settingsData) {
        setSystemSettings(settingsData);
        // Apply primary color globally
        document.documentElement.style.setProperty('--neon-orange', settingsData.primary_color);
        document.documentElement.style.setProperty('--neon-orange-glow', `${settingsData.primary_color}66`);
      }
    } catch (err) {
      console.error('Erro ao buscar dados públicos:', err);
    }
  };

  const fetchPrivateData = async () => {
    if (!user || isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const userRoleStr = String(user.role).toUpperCase();
      const isAdmin = userRoleStr === 'ADMIN';
      const isPartner = userRoleStr === 'PARTNER' || userRoleStr === 'PARCEIRO' || userRoleStr === 'EMPRESA PARCEIRA';

      // Consultas independentes para evitar falhas em cascata
      // 1. Otimização: Filtrar no banco de dados para evitar download de dados desnecessários
      let usageQuery = supabase.from('benefit_usage').select('id, member_id, member_name, beneficiary_name, beneficiary_id, partner_id, partner_name, date, offer_title, offer_discount, status').order('date', { ascending: false }).limit(50);
      let paymentQuery = supabase.from('payments').select('id, member_id, member_name, amount, due_date, status, updated_at, updated_by').order('due_date', { ascending: false }).limit(100);

      if (!isAdmin) {
        if (isPartner) {
          // Parceiros vêem apenas seu histórico
          usageQuery = usageQuery.or(`partner_id.eq.${user.id},partner_name.eq.${user.companyName || user.name}`);
          // Parceiros não precisam carregar mensalidades de terceiros
          paymentQuery = paymentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        } else {
          // Membros vêem apenas seus próprios dados
          usageQuery = usageQuery.eq('member_id', user.id);
          paymentQuery = paymentQuery.eq('member_id', user.id);
        }
      }

      // Otimização de Performance: Carregar apenas colunas leves na listagem inicial.
      // Campos pesados (gallery, offers, dependents) serão carregados sob demanda.
      const profilesColumns = 'id, name, surname, email, role, avatar_url, member_id, status, valid_until, company_name, city, created_at, birth_date, whatsapp, address, description, rg, cpf, sim_registry, instagram, facebook, linkedin, website, category, discount, rules';

      const [usageResult, paymentResult, profilesResult] = await Promise.allSettled([
        usageQuery,
        paymentQuery,
        (isAdmin || isPartner)
          ? supabase.from('profiles').select(profilesColumns).order('name').limit(100)
          : supabase.from('profiles').select(profilesColumns).or(`role.ilike.PARTNER,role.ilike.PARCEIRO,id.eq.${user.id}`).order('name').limit(100)
      ]);

      // Processar Histórico
      if (usageResult.status === 'fulfilled') {
        if (usageResult.value.error) {
          console.warn('Erro ao carregar histórico (tentando fallback):', usageResult.value.error);
          // Fallback: Tentar carregar sem as novas colunas
          const { data: fallbackData } = await supabase.from('benefit_usage')
            .select('id, member_id, member_name, beneficiary_name, beneficiary_id, partner_id, partner_name, date')
            .order('date', { ascending: false })
            .limit(50);

          if (fallbackData) {
            setHistory(fallbackData.map(h => ({
              ...h,
              memberId: h.member_id,
              memberName: h.member_name,
              beneficiaryName: h.beneficiary_name,
              beneficiaryId: h.beneficiary_id,
              partnerId: h.partner_id,
              partnerName: h.partner_name,
              status: 'VALIDADO'
            } as unknown as BenefitUsage)));
          }
        } else if (usageResult.value.data) {
          setHistory(usageResult.value.data.map(h => ({
            ...h,
            memberId: h.member_id,
            memberName: h.member_name,
            beneficiaryName: h.beneficiary_name,
            beneficiaryId: h.beneficiary_id,
            partnerId: h.partner_id,
            partnerName: h.partner_name,
            offerTitle: h.offer_title,
            offerDiscount: h.offer_discount,
            code: h.id.includes('VCH-') ? h.id.split('-').pop() : h.id.substring(0, 6).toUpperCase()
          } as unknown as BenefitUsage)));
        }
      } else if (usageResult.status === 'rejected') {
        console.warn('Erro crítico ao carregar histórico:', usageResult.reason);
      }

      // Processar Pagamentos
      if (paymentResult.status === 'fulfilled' && paymentResult.value.data) {
        setPayments(paymentResult.value.data.map(p => ({
          ...p,
          memberId: p.member_id,
          memberName: p.member_name,
          dueDate: p.due_date,
          updatedAt: p.updated_at,
          updatedBy: p.updated_by
        } as unknown as Payment)));
      } else if (paymentResult.status === 'rejected') {
        console.warn('Erro ao carregar pagamentos:', paymentResult.reason);
      }

      // Processar Perfis
      if (profilesResult.status === 'fulfilled' && profilesResult.value.data) {
        const profilesData = profilesResult.value.data;
        const mappedUsers: User[] = profilesData
          .filter(d => {
            const r = String(d.role || '').toUpperCase();
            return r === 'MEMBER' || (r !== 'ADMIN' && r !== 'PARTNER' && r !== 'PARCEIRO' && r !== 'EMPRESA PARCEIRA');
          })
          .map(d => ({
            ...d,
            avatar: d.avatar_url,
            memberId: d.member_id,
            validUntil: d.valid_until,
            birthDate: d.birth_date,
            companyName: d.company_name,
            simRegistry: d.sim_registry,
            createdAt: d.created_at,
          }));
        setAllUsers(mappedUsers);

        const mappedPartners: Partner[] = profilesData
          .filter(p => {
            const r = String(p.role || '').toUpperCase();
            return r === 'PARTNER' || r === 'PARCEIRO' || r === 'EMPRESA PARCEIRA';
          })
          .map(p => ({
            ...p,
            name: p.name || p.company_name || 'Parceiro Sem Nome',
            logo: p.avatar_url || '',
            companyName: p.company_name,
            category: p.category || 'Serviços',
            discount: p.discount || '',
            description: p.description || '',
            rules: p.rules || '',
            gallery: (p as any).gallery || [],
            offers: (p as any).offers || [],
            city: p.city || ''
          }));
        setPartners(mappedPartners);

        console.log(`Dados carregados - Sócios: ${mappedUsers.length}, Parceiros: ${mappedPartners.length}`);
        if (mappedPartners.length > 0) {
          console.log('Parceiro Detectado:', mappedPartners[0]);
        }

        if (isAdmin && mappedUsers.length === 0 && profilesData.length > 0) {
          console.warn('Aviso: Você é Admin mas 0 sócios foram mapeados. Verifique se os sócios têm o cargo MEMBER no banco.');
        }
      } else if (profilesResult.status === 'rejected') {
        console.error('Erro crítico ao carregar perfis:', profilesResult.reason);
      }
    } catch (err: any) {
      console.error('Erro ao buscar dados privados:', err);
      if (err.message?.includes('recursion')) {
        showAlert('Erro de Segurança', 'O banco de dados entrou em um loop de permissão (Recursão). Por favor, rode o script SQL de correção.', 'error');
      }
    } finally {
      isFetchingRef.current = false;
    }
  };
  const handleLogout = async () => {
    // 1. Clear local state immediately for instant UI feedback
    setUser(null);
    setAllUsers([]);
    setPartners([]);
    setHistory([]);
    setPayments([]);
    setView('login');
    setActiveTab('dash');

    // 2. Perform Supabase sign out in the background
    try {
      // Don't await here to avoid hanging UI on network/Supabase instability
      supabase.auth.signOut().then(({ error }) => {
        if (error) console.warn('Supabase signOut error:', error);
      });
    } catch (err) {
      console.error('Logout process error:', err);
    }
  };

  const fetchProfile = async (userId: string) => {
    if (isFetchingProfileRef.current) return;
    isFetchingProfileRef.current = true;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, avatar_url, member_id, status, valid_until, birth_date, company_name, sim_registry, login_count, created_at, city, dependents, whatsapp, address, rg, cpf, surname, state')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Dados do Perfil carregados:', { id: data.id, role: data.role, status: data.status });

        const userRole = String(data.role || '').toUpperCase();
        const isAdmin = userRole === 'ADMIN';
        const isPartner = userRole === 'PARTNER' || userRole === 'PARCEIRO' || userRole === 'EMPRESA PARCEIRA';
        if (data.status === 'PENDING' && !isAdmin) {
          console.warn('Acesso bloqueado: Usuário pendente e não é admin.');
          showAlert(
            'Status do Acesso',
            'Esperando a confirmação do seu usuario pelo administrador',
            'info'
          );
          await handleLogout();
          return;
        }

        const mappedUser: User = {
          ...data,
          memberId: data.member_id,
          avatar: data.avatar_url,
          validUntil: data.valid_until,
          birthDate: data.birth_date,
          companyName: data.company_name,
          simRegistry: data.sim_registry,
          loginCount: data.login_count,
          createdAt: data.created_at,
          city: data.city || '',
          dependents: data.dependents || []
        };
        setUser(mappedUser);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    } finally {
      isFetchingProfileRef.current = false;
    }
  };

  const fetchFullProfileOnDemand = async (userId: string) => {
    try {
      console.log('Carregando dados detalhados para:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, gallery, offers, dependents')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Atualizar estados globais com os dados extras
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, gallery: data.gallery, offers: data.offers, dependents: data.dependents } : u));
        setPartners(prev => prev.map(p => p.id === userId ? { ...p, gallery: data.gallery, offers: data.offers, dependents: data.dependents } : p));
        return data;
      }
    } catch (err) {
      console.error('Erro ao carregar dados sob demanda:', err);
    }
    return null;
  };

  const onRegisterNotificationView = async (userId: string) => {
    if (!systemNotification?.id) return;

    try {
      const viewedBy = systemNotification.viewedBy || [];
      if (!viewedBy.includes(userId)) {
        const newViewedBy = [...viewedBy, userId];
        const { error } = await supabase
          .from('system_notifications')
          .update({ viewed_by: newViewedBy })
          .eq('id', systemNotification.id);

        if (error) throw error;

        // Atualizar estado local para refletir a nova visualização imediatamente no dashboard se o admin estiver vendo
        setSystemNotification(prev => prev ? { ...prev, viewedBy: newViewedBy } : null);
      }
    } catch (err) {
      console.error('Erro ao registrar visualização da notificação:', err);
    }
  };

  const onRegisterNewsView = async (newsId: string, userId: string) => {
    try {
      const currentNews = news.find(n => n.id === newsId);
      if (!currentNews) return;

      const viewedBy = currentNews.viewedBy || [];
      if (!viewedBy.includes(userId)) {
        const newViewedBy = [...viewedBy, userId];
        const { error } = await supabase
          .from('news')
          .update({ viewed_by: newViewedBy })
          .eq('id', newsId);

        if (error) throw error;

        // Atualizar estado local
        setNews(prev => prev.map(n => n.id === newsId ? { ...n, viewedBy: newViewedBy } : n));
      }
    } catch (err) {
      console.error('Erro ao registrar visualização da notícia:', err);
    }
  };

  // --- Efeitos ---

  useEffect(() => {
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPrivateData();

      // Incrementar contador de logins APENAS uma vez por "sessão" local
      // Usamos uma variável de controle para evitar o loop com o Realtime
      const hasIncremented = sessionStorage.getItem(`login_inc_${user.id}`);
      if (!hasIncremented) {
        sessionStorage.setItem(`login_inc_${user.id}`, 'true');

        // Verificação de Primeiro Acesso (login_count anterior era 0 ou nulo)
        if (!user.loginCount || user.loginCount === 0) {
          showAlert(
            'Bem-vindo ao Clube!',
            'Por favor, acesse a opção "Meu Perfil" e complete suas informações para aproveitar ao máximo todos os benefícios do sistema.',
            'info'
          );
        }

        supabase
          .from('profiles')
          .update({ login_count: (user.loginCount || 0) + 1 })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) console.error('Erro ao incrementar login_count:', error);
          });
      }
    }
  }, [user?.id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') setView('resetPassword');
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- Realtime Subscriptions ---
  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase.channel('private-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        // Se a mudança for no perfil do próprio usuário, re-busca o perfil
        if (payload.new && (payload.new as any).id === user.id) fetchProfile(user.id);
        fetchPrivateData();
      }).on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        fetchPrivateData();
      }).on('postgres_changes', { event: '*', schema: 'public', table: 'benefit_usage' }, () => {
        fetchPrivateData();
      }),
      supabase.channel('public-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
        fetchPublicData();
      }).on('postgres_changes', { event: '*', schema: 'public', table: 'system_notifications' }, () => {
        fetchPublicData();
      })
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user?.id]);

  // --- Handlers de Ação ---
  const translateAuthError = (message: string): string => {
    const msg = message.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.';
    if (msg.includes('email not confirmed')) return 'E-mail ainda não confirmado no Supabase. Verifique o Dashboard.';
    if (msg.includes('user not found')) return 'Usuário não encontrado em nossa base elite.';
    if (msg.includes('invalid email')) return 'O e-mail informado não é válido.';
    if (msg.includes('password is too short')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('user already registered') || msg.includes('already exists')) return 'Este e-mail já está cadastrado no sistema.';
    if (msg.includes('too many requests')) return 'Muitas tentativas seguidas. Por favor, aguarde alguns minutos.';
    return message;
  };

  const handleLogin = async (email: string, password?: string) => {
    console.log('Iniciando processo de login para:', email);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (error) {
        console.error('Erro de autenticação Supabase:', error.message);
        throw new Error(translateAuthError(error.message));
      }

      if (authData.user) {
        console.log('Autenticação bem-sucedida! IDs:', { authId: authData.user.id });

        // Timeout de 15 segundos para carregar o perfil e evitar travamento eterno na LoginPage
        const fetchProfilePromise = fetchProfile(authData.user.id);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo limite excedido ao carregar seu perfil. Verifique sua conexão.')), 15000)
        );

        await Promise.race([fetchProfilePromise, timeoutPromise]);

        console.log('Login concluído com sucesso!');
        setActiveTab('dash');
      } else {
        throw new Error('Usuário autenticado mas sem dados retornados pelo Supabase.');
      }
    } catch (error: any) {
      console.error('Falha crítica no login:', error);
      throw error;
    }
  };

  const handleRegister = async (data: { name: string; email: string; city?: string; whatsapp?: string; cnpj?: string; password?: string; role: 'MEMBER' | 'PARTNER' }) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || '',
        options: {
          data: {
            name: data.name,
            city: data.city || null,
            whatsapp: data.whatsapp || null,
            cnpj: data.cnpj || null,
            company_name: data.role === 'PARTNER' ? data.name : null,
            role: data.role,
            status: 'PENDING'
          }
        }
      });

      if (error) {
        throw new Error(translateAuthError(error.message));
      }

      if (authData.user) {
        showAlert(
          'Cadastro Realizado',
          'Sua solicitação foi enviada com sucesso! O administrador irá revisar seus dados e seu acesso será liberado em breve.',
          'success'
        );
        setView('login');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  // handleLogout removido daqui por estar declarado acima

  const handleUpdateSystemSettings = async (settings: Partial<SystemSettings>) => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          ...settings,
          id: 'global',
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSystemSettings(data);
        if (settings.primary_color) {
          document.documentElement.style.setProperty('--neon-orange', settings.primary_color);
          document.documentElement.style.setProperty('--neon-orange-glow', `${settings.primary_color}66`);
        }
      }
    } catch (err: any) {
      console.error('Erro ao atualizar configurações:', err);
      const msg = err.message || 'Erro desconhecido';

      // Provide actionable error messages
      if (msg.includes('relation "public.system_settings" does not exist')) {
        showAlert('Erro de Banco', 'A tabela de configurações não foi encontrada no banco de dados.', 'error');
      } else if (msg.includes('row-level security policy')) {
        showAlert('Erro de Permissão', 'Você não tem permissão para alterar as configurações do sistema.', 'error');
      } else {
        showAlert('Erro ao Salvar', `Não foi possível salvar as configurações: ${msg}`, 'error');
      }
      throw err;
    }
  };


  const handleUpdateUser = async (updatedUser: User) => {
    console.log('App: Iniciando atualização do usuário:', updatedUser.id, 'Status pretendido:', updatedUser.status);
    // 0. Atualização Otimista da UI
    if (user && updatedUser.id === user.id) setUser(updatedUser);
    setAllUsers(prev => prev.map(m => m.id === updatedUser.id ? updatedUser : m));

    try {
      // 1. Atualizar Perfil no Banco
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          surname: updatedUser.surname,
          avatar_url: updatedUser.avatar,
          whatsapp: updatedUser.whatsapp,
          cpf: updatedUser.cpf,
          rg: updatedUser.rg,
          address: updatedUser.address,
          city: updatedUser.city || null,
          state: updatedUser.state || null,
          birth_date: updatedUser.birthDate || null,
          sim_registry: updatedUser.simRegistry || null,
          instagram: updatedUser.instagram || null,
          facebook: updatedUser.facebook || null,
          linkedin: updatedUser.linkedin || null,
          website: updatedUser.website || null,
          member_id: updatedUser.memberId || null,
          role: updatedUser.role,
          status: updatedUser.status,
          company_name: updatedUser.companyName || null,
          valid_until: updatedUser.validUntil || null,
          dependents: updatedUser.dependents || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      // 2. Sincronizar com Supabase Auth via Edge Function
      // Sempre chamamos para garantir que status, role e nome estejam sincronizados no Auth Metadata
      const { error: edgeError } = await supabase.functions.invoke('admin-update-user', {
        body: {
          action: 'update',
          userId: updatedUser.id,
          password: updatedUser.password || undefined,
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status
        }
      });
      if (edgeError) console.error('Erro ao sincronizar com Auth via Edge Function:', edgeError);

      // 3. Sincronizar dados locais de forma otimizada (sem refetch global)
      setAllUsers(prev => prev.map(m => m.id === updatedUser.id ? { ...m, ...updatedUser } : m));
      setPartners(prev => prev.map(p => p.id === updatedUser.id ? { ...p, ...updatedUser } as unknown as Partner : p));

      showAlert('Sucesso', 'Sócio atualizado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      // Re-buscar apenas em caso de erro crítico para garantir consistência
      fetchPrivateData();
      if (user) fetchProfile(user.id);
      showAlert('Erro ao Salvar', error.message || 'Erro desconhecido', 'error');
    }
  };

  const handleToggleMemberStatus = async (id: string) => {
    console.log('App: handleToggleMemberStatus disparado para ID:', id);
    const target = allUsers.find(u => u.id === id);
    if (!target) {
      console.warn('App: Usuário não encontrado em allUsers para toggle:', id);
      return;
    }
    const newStatus = target.status === MemberStatus.ACTIVE ? MemberStatus.INACTIVE : MemberStatus.ACTIVE;
    console.log(`App: Alternando status de ${target.status} para ${newStatus}`);
    await handleUpdateUser({ ...target, status: newStatus });
  };

  const handleAddMember = async (newMember: User) => {
    try {
      // 0. Verificar se o e-mail ou CPF já existem na tabela de perfis para evitar erro de RLS/Unicidade
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email, cpf')
        .or(`email.eq.${newMember.email.toLowerCase().trim()},cpf.eq.${newMember.cpf}`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingProfile) {
        if (existingProfile.email.toLowerCase() === newMember.email.toLowerCase().trim()) {
          showAlert('E-mail já Cadastrado', `O e-mail "${newMember.email}" já está cadastrado no sistema.`, 'warning');
        } else if (existingProfile.cpf === newMember.cpf) {
          showAlert('CPF já Cadastrado', `O CPF "${newMember.cpf}" já está cadastrado no sistema.`, 'warning');
        }
        return;
      }

      // 1. Criar Usuário via Edge Function (Auth Admin API)
      const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('admin-update-user', {
        body: {
          action: 'create',
          email: newMember.email.toLowerCase().trim(),
          password: newMember.password || 'Amabe123*',
          name: newMember.name,
          role: newMember.role || 'MEMBER',
          status: newMember.status || 'ACTIVE'
        }
      });

      if (edgeError || (edgeResponse && edgeResponse.error)) {
        console.error('Erro na Edge Function:', edgeError || edgeResponse.error);
        const errorDetail = edgeError?.message || edgeResponse?.error || 'Erro desconhecido';
        throw new Error(`Erro na Função: ${errorDetail}`);
      }

      const userId = edgeResponse.data?.user?.id;

      if (userId) {
        // 2. Usar UPSERT para garantir que o perfil existirá
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: newMember.email.toLowerCase().trim(),
            name: newMember.name,
            surname: newMember.surname || null,
            whatsapp: newMember.whatsapp || null,
            cpf: newMember.cpf || null,
            rg: newMember.rg || null,
            address: newMember.address || null,
            city: newMember.city || null,
            state: newMember.state || null,
            birth_date: newMember.birthDate || null,
            member_id: newMember.memberId || null,
            role: newMember.role || 'MEMBER',
            status: newMember.status || 'ACTIVE',
            avatar_url: newMember.avatar || null,
            sim_registry: newMember.simRegistry || null,
            instagram: newMember.instagram || null,
            facebook: newMember.facebook || null,
            website: newMember.website || null,
            valid_until: newMember.validUntil || null,
            dependents: newMember.dependents || [],
            updated_at: new Date().toISOString()
          });

        if (upsertError) throw upsertError;

        // 3. Gerar Pagamentos Automáticos (Janeiro a Dezembro)
        await handleGenerateYearlyPayments(userId, newMember.name, new Date().getFullYear(), user?.name || 'Admin');

        // 4. Atualização local para economizar I/O
        setAllUsers(prev => [{ ...newMember, id: userId, role: newMember.role || UserRole.MEMBER, status: newMember.status || MemberStatus.ACTIVE } as User, ...prev]);

        showAlert('Sucesso', 'Membro adicionado com sucesso!', 'success');
      } else {
        showAlert('Erro de Cadastro', 'Falha ao obter ID do novo usuário. Tente novamente.', 'error');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar membro:', error);
      showAlert('Erro ao Adicionar', error.message || 'Erro desconhecido', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    showConfirm(
      'Excluir Cadastro',
      'Tem certeza que deseja excluir este cadastro? Esta ação é irreversível e removerá o acesso ao sistema.',
      async () => {
        try {
          // 1. Deletar no Banco de Dados (profiles)
          const { error: dbError } = await supabase.from('profiles').delete().eq('id', userId);
          if (dbError) throw dbError;

          // 2. Deletar no Supabase Auth via Edge Function
          const { error: edgeError } = await supabase.functions.invoke('admin-update-user', {
            body: { action: 'delete', userId }
          });
          if (edgeError) console.error('Erro ao deletar no Auth:', edgeError);

          // Atualização local para economizar I/O
          setAllUsers(prev => prev.filter(u => u.id !== userId));
          setPartners(prev => prev.filter(p => p.id !== userId));
          setPayments(prev => prev.filter(pm => pm.memberId !== userId));

          showAlert('Sucesso', 'Cadastro excluído com sucesso.', 'success');
        } catch (err: any) {
          console.error('Erro ao excluir usuário:', err);
          showAlert('Erro ao Excluir', err.message, 'error');
        }
      }
    );
  };

  const addUsage = async (usage: BenefitUsage) => {
    try {
      // Tentar inserir com todos os campos (novas colunas)
      const { error } = await supabase.from('benefit_usage').upsert({
        id: usage.id,
        member_id: usage.memberId,
        member_name: usage.memberName,
        beneficiary_name: usage.beneficiaryName,
        beneficiary_id: usage.beneficiaryId,
        partner_id: usage.partnerId || user?.id,
        partner_name: usage.partnerName,
        offer_title: usage.offerTitle,
        offer_discount: usage.offerDiscount,
        status: usage.status || 'VALIDADO',
        date: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) {
        console.warn('Erro ao registrar uso (tentando fallback):', error);
        // Fallback: Inserir apenas campos básicos se as novas colunas não existirem
        const { error: fallbackError } = await supabase.from('benefit_usage').insert({
          member_id: usage.memberId,
          member_name: usage.memberName,
          beneficiary_name: usage.beneficiaryName,
          beneficiary_id: usage.beneficiaryId,
          partner_id: usage.partnerId || user?.id,
          partner_name: usage.partnerName,
          date: new Date().toISOString()
        });
        if (fallbackError) throw fallbackError;
      }

      // Atualização local do histórico para economizar I/O
      setHistory(prev => [{
        ...usage,
        id: usage.id || `VCH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: 'VALIDADO',
        date: new Date().toISOString()
      }, ...prev].slice(0, 100)); // Mantém cache limitado

      showAlert('Sucesso', 'Benefício validado!', 'success');
    } catch (err: any) {
      console.error('Erro crítico ao registrar uso:', err);
      const isTimeout = err.message?.toLowerCase().includes('timeout') || err.message?.toLowerCase().includes('connection');
      const detail = err.details || err.message || '';
      const message = isTimeout
        ? 'A conexão com o banco de dados expirou. Verifique se a luz de "Project Status" no Supabase está verde e tente novamente.'
        : `Ocorreu um problema ao registrar o uso: ${detail}`;
      showAlert('Erro ao Gerar', message, 'error');
    }
  };

  const handleAddNews = async (newItem: NewsItem) => {
    try {
      const { error } = await supabase.from('news').insert({
        title: newItem.title,
        content: newItem.content || '',
        excerpt: newItem.excerpt || '',
        category: newItem.category,
        image_url: newItem.image,
        is_featured: newItem.isFeatured || false,
        show_in_banner: newItem.showInBanner || false,
        author: user?.name || 'Admin',
        date: newItem.date || new Date().toISOString(),
        viewed_by: []
      });
      if (error) throw error;
      fetchPublicData();
    } catch (error: any) {
      showAlert('Erro ao Adicionar', error.message, 'error');
    }
  };

  const handleUpdateNews = async (updatedItem: NewsItem) => {
    try {
      const { error } = await supabase.from('news').update({
        title: updatedItem.title,
        content: updatedItem.content || '',
        excerpt: updatedItem.excerpt || '',
        category: updatedItem.category,
        image_url: updatedItem.image,
        is_featured: updatedItem.isFeatured || false,
        show_in_banner: updatedItem.showInBanner || false,
        viewed_by: updatedItem.viewedBy || []
      }).eq('id', updatedItem.id);
      if (error) throw error;
      fetchPublicData();
    } catch (error: any) {
      showAlert('Erro ao Atualizar', error.message, 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      fetchPublicData();
    } catch (err) {
      console.error('Erro ao deletar notícia:', err);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId: string, status: PaymentStatus, adminName: string) => {
    const previousPayments = [...payments];
    const now = new Date().toISOString();

    setPayments(prev => prev.map(p =>
      p.id === paymentId
        ? { ...p, status, updatedBy: adminName, updatedAt: now }
        : p
    ));

    try {
      const { error } = await supabase.from('payments').update({
        status,
        updated_by: adminName,
        updated_at: now
      }).eq('id', paymentId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao atualizar pagamento:', err);
      setPayments(previousPayments);
      showAlert('Erro', `Não foi possível atualizar o status do pagamento: ${err.message || 'Erro desconhecido'}`, 'error');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    const previousPayments = [...payments];

    setPayments(prev => prev.filter(p => p.id !== paymentId));

    try {
      const { error } = await supabase.from('payments').delete().eq('id', paymentId);
      if (error) throw error;

      showAlert('Sucesso', 'Parcela excluída com sucesso.', 'success');
    } catch (err: any) {
      console.error('Erro ao excluir parcela:', err);
      setPayments(previousPayments);
      showAlert('Erro', 'Não foi possível excluir a parcela.', 'error');
    }
  };

  const handleGenerateYearlyPayments = async (memberId: string, memberName: string, year: number, adminName: string = 'Admin') => {
    try {
      // 0. Verificar se já existem pagamentos para este ano
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('member_id', memberId)
        .gte('due_date', startDate)
        .lte('due_date', endDate)
        .limit(1);

      if (existing && existing.length > 0) {
        throw new Error('Já existem mensalidades geradas para este associado neste ano.');
      }

      const yearlyPayments = [];
      const amount = 89.90;
      const now = new Date().toISOString();

      for (let month = 0; month < 12; month++) {
        // Vencimento no dia 10 de cada mês
        const dueDate = new Date(year, month, 10);

        yearlyPayments.push({
          member_id: memberId,
          member_name: memberName,
          amount,
          due_date: dueDate.toISOString().split('T')[0],
          status: PaymentStatus.PENDING,
          type: 'Mensalidade',
          updated_by: adminName,
          updated_at: now
        });
      }

      const { error } = await supabase.from('payments').insert(yearlyPayments);
      if (error) throw error;

      // Atualização local para evitar Refetch e economizar I/O
      const mappedNewPayments: Payment[] = yearlyPayments.map(p => ({
        id: `MIG-${Math.random().toString(36).substring(2, 9)}`, // ID temporário até próximo refresh natural
        memberId: p.member_id,
        memberName: p.member_name,
        amount: p.amount,
        dueDate: p.due_date,
        status: p.status as PaymentStatus,
        type: p.type,
        updatedBy: p.updated_by,
        updatedAt: p.updated_at
      }));
      setPayments(prev => [...mappedNewPayments, ...prev].slice(0, 100));

      showAlert('Sucesso', `Geradas 12 mensalidades para ${year}.`, 'success');
    } catch (err: any) {
      console.error('Erro ao gerar mensalidades:', err);
      showAlert('Erro ao Gerar', err.message, 'error');
    }
  };

  const handleResetPassword = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId) || partners.find(p => p.id === userId);
    if (!targetUser) return;

    setPasswordResetUser({ id: userId, name: targetUser.name });
    setCustomPassword('Amabe' + Math.floor(Math.random() * 900 + 100) + '*');
  };

  const executePasswordReset = async (userId: string, newPass: string) => {
    setIsResetting(true);
    try {
      const { data, error: edgeError } = await supabase.functions.invoke('admin-update-user', {
        body: {
          action: 'update',
          userId,
          password: newPass
        }
      });

      if (edgeError || (data && data.error)) throw new Error(data?.error || 'Erro ao resetar senha via Edge Function');

      showAlert('Sucesso', `Senha de "${passwordResetUser?.name}" alterada com sucesso para: ${newPass}`, 'success');
      setPasswordResetUser(null);
    } catch (err: any) {
      console.error('Erro ao resetar senha:', err);
      showAlert('Erro', 'Não foi possível resetar a senha: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendResetEmail = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  };

  const handleUpdatePassword = async (password: string) => {
    await supabase.auth.updateUser({ password });
    setView('login');
  };

  const addPartner = async (newPartner: Partner) => {
    console.log('Iniciando criação de novo parceiro:', newPartner.email);
    try {
      // 0. Verificar se o e-mail já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', newPartner.email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingProfile) {
        showAlert('E-mail já Cadastrado', `O e-mail "${newPartner.email}" já está cadastrado no sistema (ID: ${existingProfile.id}).`, 'warning');
        return;
      }

      // 1. Usar Edge Function para criar parceiro com e-mail confirmado
      console.log('Criando usuário via Edge Function...');
      const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('admin-update-user', {
        body: {
          action: 'create',
          email: newPartner.email,
          password: newPartner.password || 'Amabe123*',
          name: newPartner.name,
          role: 'PARTNER',
          status: 'ACTIVE'
        }
      });

      if (edgeError || (edgeResponse && edgeResponse.error)) {
        console.error('Erro na Edge Function de criação:', edgeError || edgeResponse?.error);
        throw new Error(edgeResponse?.error || 'Erro ao criar parceiro via admin');
      }

      const authUser = edgeResponse.data?.user;

      if (authUser) {
        console.log('Usuário criado com sucesso. Atualizando perfil...', authUser.id);

        const payload = {
          name: newPartner.name,
          company_name: newPartner.name,
          whatsapp: newPartner.whatsapp || '',
          address: newPartner.address || '',
          role: 'PARTNER',
          status: 'ACTIVE',
          category: newPartner.category || 'Outros',
          discount: newPartner.discount || '',
          city: newPartner.city || '',
          description: newPartner.description || '',
          avatar_url: newPartner.logo,
          gallery: Array.isArray(newPartner.gallery) ? newPartner.gallery : [],
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', authUser.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil recém-criado:', profileError);
          throw profileError;
        }

        // Atualização local para evitar Refetch global
        const partnerToAdd: Partner = {
          ...newPartner,
          id: authUser.id,
          status: 'ACTIVE'
        };
        setPartners(prev => [partnerToAdd, ...prev]);
        setAllUsers(prev => [{ ...partnerToAdd, role: UserRole.PARTNER } as unknown as User, ...prev]);

        showAlert('Sucesso', 'Parceiro adicionado com sucesso!', 'success');
      }
    } catch (error: any) {
      console.error('Falha crítica na criação de parceiro:', error);
      showAlert('Erro ao Adicionar', 'Falha ao adicionar parceiro: ' + (error.message || 'Erro desconhecido'), 'error');
    }
  };

  const updatePartnerData = async (updatedPartner: Partner) => {
    console.log('Iniciando atualização de parceiro:', updatedPartner.id);
    try {
      // Higienização básica para campos JSONB e arrays
      const payload = {
        name: updatedPartner.name,
        company_name: updatedPartner.companyName || updatedPartner.name,
        whatsapp: updatedPartner.whatsapp || '',
        address: updatedPartner.address || '',
        description: updatedPartner.description || '',
        rules: updatedPartner.rules || '',
        category: updatedPartner.category || 'Outros',
        discount: updatedPartner.discount || '',
        website: updatedPartner.website || '',
        instagram: updatedPartner.instagram || '',
        facebook: updatedPartner.facebook || '',
        city: updatedPartner.city || '',
        offers: Array.isArray(updatedPartner.offers) ? updatedPartner.offers : [],
        avatar_url: updatedPartner.logo,
        gallery: Array.isArray(updatedPartner.gallery) ? updatedPartner.gallery : [],
        updated_at: new Date().toISOString()
      };

      console.log('Payload de atualização:', {
        id: updatedPartner.id,
        logoSize: payload.avatar_url?.length || 0,
        galleryCount: payload.gallery.length
      });

      // 1. Atualizar Perfil no Banco
      const { error, data } = await supabase.from('profiles').update(payload).eq('id', updatedPartner.id).select();

      if (error) {
        console.error('Erro direct do Supabase:', error);
        throw error;
      }

      console.log('Update result:', data);

      // 2. Se houver senha, atualizar via Edge Function
      if (updatedPartner.password && updatedPartner.password.trim().length > 0) {
        console.log('Atualizando senha via Edge Function...');
        const { error: edgeError } = await supabase.functions.invoke('admin-update-user', {
          body: {
            action: 'update',
            userId: updatedPartner.id,
            password: updatedPartner.password,
            name: updatedPartner.name,
            role: 'PARTNER',
            status: 'ACTIVE'
          }
        });
        if (edgeError) {
          console.error('Erro na Edge Function:', edgeError);
          throw edgeError;
        }
      }

      // 3. Sincronização local otimizada
      setPartners(prev => prev.map(p => p.id === updatedPartner.id ? { ...p, ...updatedPartner } : p));
      setAllUsers(prev => prev.map(u => u.id === updatedPartner.id ? { ...u, ...updatedPartner } as unknown as User : u));

      showAlert('Sucesso', 'Configurações atualizadas com sucesso!', 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Falha crítica na atualização:', err);
      const errorMsg = err.message || err.error_description || 'Erro desconhecido';
      showAlert('Erro ao Salvar', `Não foi possível salvar as alterações: ${errorMsg}`, 'error');
      throw err;
    }
  };

  // --- Renderização ---

  const renderLoginViews = () => {
    if (view === 'register') return <RegisterPage onRegister={handleRegister} onBackToLogin={() => setView('login')} systemSettings={systemSettings} />;
    if (view === 'forgotPassword') return <ForgotPassword onSendResetEmail={handleSendResetEmail} onBack={() => setView('login')} />;
    if (view === 'resetPassword') return <ResetPassword onUpdatePassword={handleUpdatePassword} />;
    return <LoginPage onLogin={handleLogin} onToggleRegister={() => setView('register')} onToggleForgotPassword={() => setView('forgotPassword')} systemSettings={systemSettings} />;
  };

  const renderContent = () => {
    if (!user) return null;
    const userRoleStr = String(user.role).toUpperCase();
    if (userRoleStr === 'ADMIN') {
      return (
        <AdminDashboard
          activeTab={activeTab} setActiveTab={setActiveTab}
          partners={partners} members={allUsers}
          history={history} payments={payments} currentUser={user}
          onApprovePartner={(id) => {
            const p = partners.find(p => p.id === id) || allUsers.find(u => u.id === id);
            if (p) handleUpdateUser({ ...p, status: 'ACTIVE' } as unknown as User);
          }}
          onApproveMember={(id) => {
            const m = allUsers.find(u => u.id === id) || partners.find(p => p.id === id);
            if (m) handleUpdateUser({ ...m, status: MemberStatus.ACTIVE } as User);
          }}
          onUpdatePartner={updatePartnerData} onAddPartner={addPartner}
          onToggleMemberStatus={handleToggleMemberStatus} onUpdateMember={handleUpdateUser}
          onAddMember={handleAddMember} news={news} onUpdateNews={handleUpdateNews}
          onAddNews={handleAddNews} onDeleteNews={handleDeleteNews}
          systemNotification={systemNotification}
          onUpdateSystemNotification={async (notif) => {
            try {
              if (notif) {
                const payload = {
                  title: notif.title,
                  message: notif.message,
                  image_url: notif.image || notif.image_url,
                  is_active: notif.isActive ?? notif.is_active,
                  viewed_by: notif.viewedBy || notif.viewed_by || [],
                  created_by: user?.name || 'Admin'
                };
                const isExistingId = notif.id && notif.id.length > 15; // UUIDs are long
                if (isExistingId) {
                  await supabase.from('system_notifications').update(payload).eq('id', notif.id);
                } else {
                  await supabase.from('system_notifications').insert(payload);
                }
              } else if (systemNotification?.id) {
                // Se o usuário passar null, desativamos a notificação
                await supabase.from('system_notifications').update({ is_active: false }).eq('id', systemNotification.id);
              }
              fetchPublicData();
            } catch (err) {
              console.error('Erro ao gerenciar notificação:', err);
            }
          }}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onGenerateYearlyPayments={handleGenerateYearlyPayments}
          onDeletePayment={handleDeletePayment}
          onDeleteUser={handleDeleteUser}
          onResetPassword={handleResetPassword}
          showAlert={showAlert}
          showConfirm={showConfirm}
          onLoadFullProfile={fetchFullProfileOnDemand}
          systemSettings={systemSettings}
          onUpdateSystemSettings={handleUpdateSystemSettings}
        />
      );
    }
    if (userRoleStr === 'MEMBER') {
      const liveUser = allUsers.find(m => m.id === user.id) || user;
      return (
        <MemberDashboard
          activeTab={activeTab} setActiveTab={setActiveTab} user={liveUser}
          onUpdateUser={handleUpdateUser} partners={partners.filter(p => p.status === 'ACTIVE')}
          history={history.filter(h => h.memberId === user.id)}
          payments={payments.filter(p => p.memberId === user.id)}
          onRedeemBenefit={addUsage} onLogout={handleLogout} news={news}
          systemNotification={systemNotification} onRegisterNotificationView={onRegisterNotificationView}
          onRegisterNewsView={onRegisterNewsView}
          showAlert={showAlert} showConfirm={showConfirm}
          onLoadFullProfile={fetchFullProfileOnDemand}
        />
      );
    }
    if (user.role === UserRole.PARTNER) {
      const livePartner = partners.find(p => p.id === user.id) || { ...user, companyName: user.companyName || user.name } as Partner;
      return (
        <PartnerDashboard
          activeTab={activeTab} user={user} history={history.filter(h => h.partnerId === user.id || h.partnerName === (user.companyName || user.name))}
          onValidate={addUsage} members={allUsers.filter(u => u.role === UserRole.MEMBER)}
          partners={partners} onUpdatePartner={updatePartnerData}
          showAlert={showAlert} showConfirm={showConfirm}
          onLogout={handleLogout}
          onLoadFullProfile={fetchFullProfileOnDemand}
          setActiveTab={setActiveTab}
        />
      );
    }
    return null;
  };

  return (
    <div key={user ? 'auth-view' : view} className="page-transition">
      {!user ? (
        <>
          {renderLoginViews()}
          {systemNotification && systemNotification.isActive && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 relative">
                <button
                  onClick={() => setSystemNotification(prev => prev ? { ...prev, isActive: false } : null)}
                  className="absolute top-8 right-8 w-12 h-12 bg-slate-100 hover:bg-[#0A101E] text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all z-10 shadow-sm"
                >
                  <X size={20} />
                </button>

                {(systemNotification.image || systemNotification.image_url) && (
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img src={systemNotification.image || systemNotification.image_url} className="w-full h-full object-cover" alt="alerta" />
                  </div>
                )}

                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-[28px] flex items-center justify-center text-white shadow-xl mx-auto mb-6 -mt-18 border-4 border-white relative z-10">
                    <Bell size={28} className="animate-bounce" />
                  </div>

                  <h2 className="text-3xl font-black text-[#0A101E] italic uppercase tracking-tighter leading-tight mb-4">
                    {systemNotification.title}
                  </h2>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-[#0A101E]/70 font-bold text-sm leading-relaxed whitespace-pre-line">
                      {systemNotification.message}
                    </p>
                  </div>

                  <button
                    onClick={() => setSystemNotification(prev => prev ? { ...prev, isActive: false } : null)}
                    className="w-full py-6 mt-10 bg-[#0A101E] text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/20"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Layout
          user={user}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          systemSettings={systemSettings}
        >
          {renderContent()}
        </Layout>
      )}

      <SystemNotificationComponent
        isOpen={appNotification.isOpen}
        type={appNotification.type}
        title={appNotification.title}
        message={appNotification.message}
        onClose={() => setAppNotification(prev => ({ ...prev, isOpen: false }))}
        onConfirm={appNotification.onConfirm}
      />

      {/* Modal de Reset de Senha */}
      {passwordResetUser && (
        <div className="fixed inset-0 bg-[#0A101E]/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-12 relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[64px] -mr-8 -mt-8 opacity-50"></div>

            <div className="relative z-10 text-center space-y-8">
              <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl mx-auto mb-2">
                <Key size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                  Resetar Senha
                </h3>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">{passwordResetUser.name}</p>
              </div>

              <div className="space-y-4">
                <div className="text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic mb-2 block">Definir Nova Senha</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-bold text-slate-900 transition-all text-center"
                      value={customPassword}
                      onChange={e => setCustomPassword(e.target.value)}
                      placeholder="Digite a nova senha..."
                    />
                    <button
                      onClick={() => setCustomPassword('Amabe' + Math.floor(Math.random() * 900 + 100) + '*')}
                      className="mt-4 w-full py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-all italic underline underline-offset-8"
                    >
                      Gerar outra senha automática
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setPasswordResetUser(null)}
                  disabled={isResetting}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => executePasswordReset(passwordResetUser.id, customPassword)}
                  disabled={isResetting || !customPassword}
                  className="flex-1 py-5 bg-[#0F172A] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                >
                  {isResetting ? 'Sincronizando...' : 'confirmar Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
