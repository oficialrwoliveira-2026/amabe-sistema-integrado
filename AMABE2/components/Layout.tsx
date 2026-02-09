
import React, { useState } from 'react';
import { User, UserRole, DashboardTab, SystemSettings } from '../types';
import {
  LayoutDashboard,
  Users,
  Handshake,
  CreditCard,
  History,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Settings,
  TicketPlus,
  User as UserIcon,
  UserPlus,
  Home,
  BarChart3,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  systemSettings: SystemSettings | null;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab, systemSettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMember = user.role === UserRole.MEMBER;
  const isPartner = user.role === UserRole.PARTNER;
  const useMobileNav = isMember || isPartner;

  const getMenuItems = () => {
    const common = [{
      icon: LayoutDashboard,
      label: user.role === UserRole.ADMIN ? 'Dashboard' : 'Novidades',
      id: 'dash' as DashboardTab
    }];

    if (user.role === UserRole.ADMIN) {
      return [
        ...common,
        { icon: Users, label: 'Associados', id: 'members' as DashboardTab },
        { icon: UserIcon, label: 'Meu Perfil', id: 'profile' as DashboardTab },
        { icon: Settings, label: 'Configurações', id: 'settings' as DashboardTab },
        { icon: Handshake, label: 'Parceiros', id: 'partners' as DashboardTab },
        { icon: DollarSign, label: 'Financeiro', id: 'payments' as DashboardTab },
        { icon: ShieldCheck, label: 'Validações', id: 'history' as DashboardTab },
        { icon: ImageIcon, label: 'Marketing', id: 'news' as DashboardTab },
      ];
    }

    if (user.role === UserRole.MEMBER) {
      return [
        ...common,
        { icon: UserIcon, label: 'Meu Perfil', id: 'profile' as DashboardTab },
        { icon: CreditCard, label: 'Minha Carteira', id: 'card' as DashboardTab },
        { icon: DollarSign, label: 'Financeiro', id: 'payments' as DashboardTab },
        { icon: Building2, label: 'Clube AMABE', id: 'club' as DashboardTab },
      ];
    }

    if (user.role === UserRole.PARTNER) {
      return [
        ...common,
        { icon: ShieldCheck, label: 'Validar QR', id: 'validate' as DashboardTab },
        { icon: TicketPlus, label: 'Minhas Ofertas', id: 'offers' as DashboardTab },
        { icon: History, label: 'Relatórios', id: 'history' as DashboardTab },
        { icon: Settings, label: 'Perfil', id: 'partners' as DashboardTab },
      ];
    }

    return common;
  };

  const menuItems = getMenuItems();

  const handleTabClick = (id: DashboardTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] overflow-x-hidden">
      {!useMobileNav && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        flex flex-col w-[280px] bg-[#030712] text-white fixed h-full shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)] z-50 transition-transform duration-500 ease-in-out border-r border-white/5
        ${useMobileNav ? 'hidden lg:flex' : 'flex'}
        ${!useMobileNav ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0') : ''}
      `}>
        <div className="p-10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-orange-600/5 to-transparent"></div>
          <div className="flex items-center space-x-4 relative z-10">
            {systemSettings?.logo_url ? (
              <img src={systemSettings.logo_url} alt="Logo" className="w-11 h-11 object-contain rounded-2xl shadow-lg border border-white/10" />
            ) : (
              <div className="w-11 h-11 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.3)] transition-all hover:scale-105 neon-orange-border">
                <span className="text-white font-bold text-2xl italic">{systemSettings?.name?.[0] || 'A'}</span>
              </div>
            )}
            <div>
              <span className="font-bold text-xl tracking-tighter block leading-none uppercase italic text-white/90">
                {systemSettings?.name || 'AMABE'}
              </span>
              <span className="text-[9px] text-orange-400 font-bold uppercase tracking-[0.4em] mt-1.5 opacity-80">Oficial</span>
            </div>
          </div>
          {!useMobileNav && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors relative z-10">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-8 space-y-3 mt-8 overflow-y-auto no-scrollbar relative z-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center space-x-4 w-full p-3.5 rounded-[22px] transition-all duration-500 group relative overflow-hidden ${activeTab === item.id
                ? 'bg-orange-600 text-white shadow-[0_15px_40px_rgba(234,88,12,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {activeTab === item.id && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
              )}
              <item.icon size={20} className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'} transition-all group-hover:scale-110`} />
              <span className="font-bold text-sm tracking-tight whitespace-nowrap italic">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-3 relative z-10">
          <div className="glass-card p-4 rounded-[28px] transition-all hover:bg-white/10 border-white/5 group shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="relative shrink-0">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ea580c&color=fff`}
                  className="w-10 h-10 rounded-[14px] border border-orange-500/30 shadow-md object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="avatar"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030712] shadow-sm"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white/90 leading-none mb-1.5 uppercase italic tracking-tight">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest">{user.role === 'MEMBER' ? 'Usuário' : user.role}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center space-x-3 w-full p-4 rounded-[22px] bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-500 group border border-red-500/10"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[9px] uppercase tracking-[0.3em]">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 min-h-screen max-w-full overflow-x-hidden relative ${useMobileNav ? '' : 'lg:ml-[280px]'}`}>
        <header className="lg:hidden flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            {!useMobileNav && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100 shadow-sm active:scale-90 mr-2"
              >
                <Menu size={20} />
              </button>
            )}
            {systemSettings?.logo_url ? (
              <img src={systemSettings.logo_url} alt="Logo" className="w-9 h-9 object-contain rounded-xl shadow-lg border border-slate-100" />
            ) : (
              <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-lg italic shadow-lg shadow-orange-600/10">
                {systemSettings?.name?.[0] || 'A'}
              </div>
            )}
            <span className="font-extrabold text-xl text-[#0F172A] tracking-tighter uppercase italic">
              {systemSettings?.name || 'AMABE'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {useMobileNav && (
              <button
                onClick={onLogout}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100 shadow-sm transition-all active:scale-90"
              >
                <LogOut size={20} />
              </button>
            )}
            {!useMobileNav && (
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-orange-500">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ea580c&color=fff`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            )}
          </div>
        </header>

        <div className={`responsive-container animate-in fade-in duration-700 ${useMobileNav ? 'pb-28' : 'pb-10'}`}>
          {children}
        </div>

        {useMobileNav && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {isMember ? (
              <>
                <button
                  onClick={() => handleTabClick('dash')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'dash' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <Home size={activeTab === 'dash' ? 24 : 22} strokeWidth={activeTab === 'dash' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'dash' ? 'opacity-100' : 'opacity-0'}`}>Início</span>
                </button>

                <button
                  onClick={() => handleTabClick('club')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'club' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <Building2 size={activeTab === 'club' ? 24 : 22} strokeWidth={activeTab === 'club' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'club' ? 'opacity-100' : 'opacity-0'}`}>Clube</span>
                </button>

                <button
                  onClick={() => handleTabClick('card')}
                  className="relative -mt-10 flex items-center justify-center"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${activeTab === 'card'
                    ? 'bg-[#0F172A] scale-110 shadow-orange-600/20'
                    : 'bg-orange-600 scale-100 shadow-orange-600/40'
                    }`}>
                    <CreditCard size={28} className="text-white" strokeWidth={3} />
                  </div>
                </button>

                <button
                  onClick={() => handleTabClick('payments')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'payments' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <DollarSign size={activeTab === 'payments' ? 24 : 22} strokeWidth={activeTab === 'payments' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'payments' ? 'opacity-100' : 'opacity-0'}`}>Financeiro</span>
                </button>

                <button
                  onClick={() => handleTabClick('profile')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'profile' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <UserIcon size={activeTab === 'profile' ? 24 : 22} strokeWidth={activeTab === 'profile' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleTabClick('dash')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'dash' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <Home size={activeTab === 'dash' ? 24 : 22} strokeWidth={activeTab === 'dash' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'dash' ? 'opacity-100' : 'opacity-0'}`}>Início</span>
                </button>

                <button
                  onClick={() => handleTabClick('offers')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'offers' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <TicketPlus size={activeTab === 'offers' ? 24 : 22} strokeWidth={activeTab === 'offers' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'offers' ? 'opacity-100' : 'opacity-0'}`}>Ofertas</span>
                </button>

                <button
                  onClick={() => handleTabClick('validate')}
                  className="relative -mt-10 flex items-center justify-center"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${activeTab === 'validate'
                    ? 'bg-[#0F172A] scale-110 shadow-orange-600/20'
                    : 'bg-orange-600 scale-100 shadow-orange-600/40'
                    }`}>
                    <ShieldCheck size={28} className="text-white" strokeWidth={3} />
                  </div>
                </button>

                <button
                  onClick={() => handleTabClick('history')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'history' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <History size={activeTab === 'history' ? 24 : 22} strokeWidth={activeTab === 'history' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'history' ? 'opacity-100' : 'opacity-0'}`}>Relatórios</span>
                </button>

                <button
                  onClick={() => handleTabClick('partners')}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'partners' ? 'text-orange-600' : 'text-slate-300'}`}
                >
                  <Settings size={activeTab === 'partners' ? 24 : 22} strokeWidth={activeTab === 'partners' ? 3 : 2} />
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeTab === 'partners' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
                </button>
              </>
            )}
          </nav>
        )}
      </main>
    </div>
  );
};

export default Layout;
