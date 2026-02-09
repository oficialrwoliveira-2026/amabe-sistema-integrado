import React, { memo } from 'react';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity, Trophy, MapPin } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
    AreaChart, Area, PieChart, Pie, Cell, Legend, Label
} from 'recharts';

const COLORS = ['#ea580c', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4', '#ec4899'];

interface IntelligenceViewProps {
    analytics: any;
    statusColors: Record<string, string>;
}

const IntelligenceView: React.FC<IntelligenceViewProps> = ({
    analytics,
    statusColors
}) => {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20 relative">
            <header className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-slate-100 pb-10 gap-8 relative overflow-hidden">
                <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-[4px] bg-orange-500 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.2)]"></div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tighter leading-none">Análise de Dados</h2>
                    <p className="text-slate-400 font-medium text-[11px] uppercase tracking-[0.4em] mt-3 flex items-center gap-2 opacity-70">
                        Neural System 2.0
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/70 backdrop-blur-xl px-5 py-3 md:px-8 md:py-5 rounded-2xl md:rounded-[24px] flex items-center gap-4 md:gap-6 group hover:shadow-lg transition-all border border-white/20 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-60">Crescimento</span>
                            <span className="text-2xl font-bold text-emerald-600 leading-none">+12.4%</span>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-12 rounded-[32px] md:rounded-[48px] relative overflow-hidden group border border-white/20 shadow-sm hover:shadow-xl transition-all duration-700">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <p className="text-[11px] font-bold text-orange-600/60 uppercase tracking-[0.3em] mb-2 block opacity-70">Fluxo de Engajamento</p>
                            <h3 className="text-lg md:text-2xl font-bold text-slate-800 tracking-tighter leading-none">Atividade Temporal</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                            <BarChart3 size={24} />
                        </div>
                    </div>
                    <div className="h-[250px] md:h-[320px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.trendData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.4)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#1e293b' }}
                                    labelStyle={{ color: '#ea580c', fontWeight: 800, fontSize: '12px', marginBottom: '8px' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-12 rounded-[32px] md:rounded-[48px] relative overflow-hidden group border border-white/20 shadow-sm hover:shadow-xl transition-all duration-700">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <p className="text-[11px] font-bold text-blue-600/60 uppercase tracking-[0.3em] mb-2 block opacity-70">Status da Base</p>
                            <h3 className="text-lg md:text-2xl font-bold text-slate-800 tracking-tighter leading-none">Distribuição Geral</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                            <PieChartIcon size={24} />
                        </div>
                    </div>
                    <div className="h-[250px] md:h-[320px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.usersStatusData}
                                    cx="50%" cy="50%"
                                    innerRadius="65%" outerRadius="85%"
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={1500}
                                >
                                    {analytics.usersStatusData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={statusColors[entry.name] || COLORS[index % COLORS.length]} stroke="rgba(255,255,255,1)" strokeWidth={6} />
                                    ))}
                                    <Label
                                        value={analytics.totalMembers}
                                        position="center"
                                        content={({ viewBox }) => {
                                            const { cx, cy } = viewBox as any;
                                            return (
                                                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={cx} dy="-10" fontSize="10" fontWeight="700" fill="#94a3b8" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-60">Total</tspan>
                                                    <tspan x={cx} dy="35" fontSize="32" md:fontSize="64" fontWeight="800" fill="#1e293b" textAnchor="middle">{analytics.totalMembers}</tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] relative overflow-hidden bg-white/40 border-white/20 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Trophy size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-[0.3em] block opacity-70">Top Performance</p>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tighter">Elite de Parceiros</h3>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {analytics.topPartners.map((p: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/50 border border-white/30 hover:bg-white hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-600 transition-colors">#{i + 1}</span>
                                    <span className="text-sm font-bold text-slate-700 tracking-tight">{p.name}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-bold text-indigo-600 leading-none">{p.value}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">Conexões</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] relative overflow-hidden bg-white/40 border-white/20 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-orange-600/60 uppercase tracking-[0.3em] block opacity-70">Monitoramento</p>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tighter">Engajamento Setorial</h3>
                        </div>
                    </div>
                    <div className="space-y-10 px-2">
                        {analytics.engagedCategories.map((c: any, i: number) => (
                            <div key={i} className="space-y-3.5">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] flex items-center opacity-80">
                                    <span className="text-slate-500">{c.name}</span>
                                    <span className="text-orange-600 font-extrabold">{c.value}</span>
                                </div>
                                <div className="h-[6px] bg-slate-100/50 rounded-full relative overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-2000 ease-out shadow-[0_0_10px_rgba(234,88,12,0.2)]"
                                        style={{ width: `${(c.value / analytics.engagedCategories[0].value) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] relative overflow-hidden bg-white/40 border-white/20 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <MapPin size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-violet-600/60 uppercase tracking-[0.3em] block opacity-70">Geolocalização</p>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tighter">Impacto Regional</h3>
                        </div>
                    </div>
                    <div className="h-[180px] md:h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.cityDistribution}>
                                <defs>
                                    <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(203, 213, 225, 0.2)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} dy={10} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(139, 92, 246, 0.04)', radius: 12 }}
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.98)',
                                        backdropFilter: 'blur(10px)',
                                        border: 'none',
                                        borderRadius: '24px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                        padding: '12px 20px'
                                    }}
                                    itemStyle={{ color: '#7c3aed', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorViolet)"
                                    radius={[12, 12, 4, 4]}
                                    barSize={32}
                                    background={{ fill: 'rgba(139, 92, 246, 0.05)', radius: 12 }}
                                    animationDuration={2000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] relative overflow-hidden bg-white/40 border-white/20 shadow-sm">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-[0.3em] block opacity-70">Parcerias</p>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tighter">Expansão por Cidade</h3>
                        </div>
                    </div>
                    <div className="h-[180px] md:h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.partnerCityDistribution}>
                                <defs>
                                    <linearGradient id="colorBlueMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(203, 213, 225, 0.2)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} dy={10} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.04)', radius: 12 }}
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.98)',
                                        backdropFilter: 'blur(10px)',
                                        border: 'none',
                                        borderRadius: '24px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                        padding: '12px 20px'
                                    }}
                                    itemStyle={{ color: '#2563eb', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorBlueMain)"
                                    radius={[12, 12, 4, 4]}
                                    barSize={32}
                                    background={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 12 }}
                                    animationDuration={3000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(IntelligenceView);
