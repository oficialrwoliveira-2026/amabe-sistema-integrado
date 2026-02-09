import React, { memo } from 'react';
import { Users, ShieldAlert, DollarSign, Laptop, Building2 } from 'lucide-react';

interface StatsOverviewProps {
    analytics: {
        activeMembers: number;
        overdueMembersCount: number;
        totalRevenue: number;
        totalAccesses: number;
        partnersCount: number;
    };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ analytics }) => {
    // Garantir que os valores existam antes de renderizar
    const activeMembers = analytics?.activeMembers || 0;
    const overdueMembersCount = analytics?.overdueMembersCount || 0;
    const totalRevenue = analytics?.totalRevenue || 0;
    const totalAccesses = analytics?.totalAccesses || 0;
    const partnersCount = analytics?.partnersCount || 0;

    const stats = [
        { label: 'Membros Ativos', value: activeMembers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pagamentos Pendentes', value: overdueMembersCount, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Receita Total', value: `R$ ${totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Acessos', value: totalAccesses, icon: Laptop, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Parcerias', value: partnersCount, icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-xl p-5 md:p-8 rounded-[32px] md:rounded-[40px] group transition-all duration-500 relative overflow-hidden border border-white/20 shadow-xl shadow-black/5 hover:shadow-2xl hover:bg-white/90">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-600/10 transition-colors"></div>

                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 bg-white/50 ${stat.color} shadow-sm backdrop-blur-md group-hover:scale-110 transition-all duration-500 border border-white/20`}>
                        <stat.icon size={20} className="md:size-6" />
                    </div>

                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3 pl-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {stat.label}
                    </p>

                    <h4 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter pl-1 leading-none group-hover:text-orange-600 transition-colors">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
                    </h4>

                    {/* Subtle decorative line */}
                    <div className="absolute bottom-6 left-8 right-8 h-[1px] bg-slate-200/20 hidden md:block">
                        <div className="h-full bg-orange-500/50 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default memo(StatsOverview);
