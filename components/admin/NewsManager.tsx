import React, { memo } from 'react';
import { Bell, Image as ImageIcon, Pencil, Trash2, X, Camera, Upload, PartyPopper, Zap, Users, User as UserIcon } from 'lucide-react';
import { NewsItem, SystemNotification } from '../../types';

interface NewsManagerProps {
    news: NewsItem[];
    systemNotification: SystemNotification | null;
    showAddNews: boolean;
    setShowAddNews: (val: boolean) => void;
    editingNews: NewsItem | null;
    setEditingNews: (item: NewsItem | null) => void;
    newsForm: Partial<NewsItem>;
    setNewsForm: React.Dispatch<React.SetStateAction<Partial<NewsItem>>>;
    notificationForm: Partial<SystemNotification>;
    setNotificationForm: React.Dispatch<React.SetStateAction<Partial<SystemNotification>>>;
    showNotificationManager: boolean;
    setShowNotificationManager: (val: boolean) => void;
    onSaveNews: () => void;
    onDeleteNews: (id: string) => void;
    onUpdateSystemNotification: (notif: SystemNotification | null) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'news' | 'notification') => void;
    setShowSuccess: (val: boolean) => void;
    setSuccessMsg: (msg: string) => void;
    members: any[];
}

const NewsManager: React.FC<NewsManagerProps> = ({
    news,
    systemNotification,
    showAddNews,
    setShowAddNews,
    editingNews,
    setEditingNews,
    newsForm,
    setNewsForm,
    notificationForm,
    setNotificationForm,
    showNotificationManager,
    setShowNotificationManager,
    onSaveNews,
    onDeleteNews,
    onUpdateSystemNotification,
    handleImageUpload,
    setShowSuccess,
    setSuccessMsg,
    members
}) => {
    const [showAudience, setShowAudience] = React.useState<{ title: string; views: string[] } | null>(null);

    const getViewersNames = (userIds: string[]) => {
        return userIds.map(id => {
            const member = members.find(m => m.id === id);
            return member ? member.name : 'Usuário Desconhecido';
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Data não informada';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm gap-8 transition-all">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-black text-slate-900 italic uppercase leading-tight">Gerenciar Marketing</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Marketing do Clube AMABE</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <button
                        onClick={() => setShowNotificationManager(true)}
                        className={`flex-1 justify-center lg:flex-none px-8 py-4 ${systemNotification?.isActive ? 'bg-emerald-600' : 'bg-slate-800'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-lg`}
                    >
                        <Bell size={16} className={systemNotification?.isActive ? 'animate-bounce' : ''} />
                        Alerta Global
                        {systemNotification?.viewedBy && systemNotification.viewedBy.length > 0 && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAudience({ title: 'Visualizações do Alerta Global', views: systemNotification.viewedBy || [] });
                                }}
                                className="bg-white/20 hover:bg-white/40 cursor-pointer backdrop-blur-md text-white px-3 py-1 rounded-lg ml-1 font-bold transition-colors"
                                title="Ver quem visualizou"
                            >
                                {systemNotification.viewedBy.length}
                            </div>
                        )}
                    </button>
                    <button
                        onClick={() => { setShowAddNews(true); setEditingNews(null); setNewsForm({ title: '', category: 'Geral', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', excerpt: '', content: '', isFeatured: false, showInBanner: false }); }}
                        className="flex-1 justify-center lg:flex-none px-8 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center gap-3 shadow-lg"
                    >
                        <ImageIcon size={16} /> Nova Matéria
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {news.map((item) => (
                    <div key={item.id} className="bg-white p-6 lg:p-8 rounded-[40px] border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between hover:shadow-xl transition-all group gap-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                            <div className="w-full lg:w-24 h-48 lg:h-24 rounded-3xl overflow-hidden shadow-lg shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{item.category}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(item.date)}</span>
                                    {item.author && (
                                        <span className="text-[8px] font-black text-orange-500/60 uppercase tracking-widest italic flex items-center gap-1">
                                            <UserIcon size={10} /> {item.author}
                                        </span>
                                    )}
                                    {item.isFeatured && (
                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-orange-600 animate-pulse"></div> Lateral
                                        </span>
                                    )}
                                    {item.showInBanner && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Zap size={8} /> Banner
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight group-hover:text-orange-600 transition-colors">{item.title}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3 lg:mt-2">
                                    <p className="text-slate-500 text-xs font-medium line-clamp-2 lg:line-clamp-1 max-w-2xl">{item.excerpt}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAudience({ title: `Audiência: ${item.title}`, views: item.viewedBy || [] });
                                        }}
                                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 lg:py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 shrink-0 shadow-sm"
                                    >
                                        <Users size={10} /> {item.viewedBy?.length || 0} Visualizações
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
                            <button
                                onClick={() => { setEditingNews(item); setNewsForm(item); setShowAddNews(true); }}
                                className="flex-1 lg:flex-none flex items-center justify-center p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-sm group/btn"
                            >
                                <Pencil size={18} className="group-hover/btn:rotate-12 transition-transform" />
                            </button>
                            <button
                                onClick={() => onDeleteNews(item.id)}
                                className="flex-1 lg:flex-none flex items-center justify-center p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddNews && (
                <div className="fixed inset-0 bg-[#0A101E]/80 backdrop-blur-xl z-[60] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl md:rounded-[56px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500 h-full md:h-auto max-h-none md:max-h-[95vh]">
                        <div className="w-full md:w-[320px] bg-[#0A101E] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-1.5 bg-orange-600 rounded-full mb-6"></div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-[0.9] whitespace-pre-line">
                                    {editingNews ? 'Editar\nMatéria' : 'Nova\nMatéria'}
                                </h2>
                                <p className="text-white/40 font-bold text-[9px] uppercase tracking-[0.4em] italic mt-4">Gestão de Marketing AMABE</p>
                            </div>
                        </div>

                        <div className="flex-1 p-8 md:p-14 overflow-y-auto no-scrollbar bg-white relative">
                            <button
                                onClick={() => setShowAddNews(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 hover:bg-[#0A101E] text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all z-10 shadow-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Conteúdo da Matéria</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Preencha os detalhes abaixo</p>
                                </div>
                                <div
                                    className="group relative cursor-pointer"
                                    onClick={() => document.getElementById('news-upload')?.click()}
                                >
                                    <div className="w-48 aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm relative bg-slate-50 transition-transform group-hover:scale-[1.02]">
                                        {newsForm.image ? (
                                            <img src={newsForm.image} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                <Camera size={24} />
                                                <span className="text-[7px] mt-2 font-black uppercase tracking-widest text-center px-4 leading-tight">Adicionar Foto</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload size={16} className="text-white" />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        id="news-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => handleImageUpload(e, 'news')}
                                    />
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-2 italic text-center">Alterar Capa</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Título da Matéria</label>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-sm placeholder:text-slate-300"
                                            value={newsForm.title || ''}
                                            onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                                            placeholder="Ex: Novo Convênio Médico..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Categoria</label>
                                        </div>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-black text-slate-900 transition-all uppercase italic text-sm appearance-none cursor-pointer"
                                            value={newsForm.category || 'Geral'}
                                            onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}
                                        >
                                            {['Geral', 'Saúde', 'Educação', 'Lazer', 'Evento', 'Avisos'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-4">
                                        <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Resumo da Chamada</label>
                                    </div>
                                    <textarea
                                        rows={2}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-orange-50 font-medium text-slate-700 transition-all no-scrollbar text-sm"
                                        value={newsForm.excerpt || ''}
                                        onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                                        placeholder="Um resumo curto que aparece nos cards..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-4">
                                        <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Conteúdo Completo</label>
                                    </div>
                                    <textarea
                                        rows={8}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[40px] px-8 py-7 outline-none focus:ring-4 focus:ring-orange-50 font-medium text-slate-700 transition-all no-scrollbar leading-relaxed"
                                        value={newsForm.content || ''}
                                        onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
                                        placeholder="Escreva a matéria na íntegra aqui com todos os detalhes importantes..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                    <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[32px]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${newsForm.isFeatured ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}`}><PartyPopper size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">Destaque Lateral</p>
                                                <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Coluna de Destaques</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={newsForm.isFeatured} onChange={e => setNewsForm({ ...newsForm, isFeatured: e.target.checked })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[32px]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${newsForm.showInBanner ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}`}><Zap size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">Acionar Banner</p>
                                                <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Carrossel do Topo</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={newsForm.showInBanner} onChange={e => setNewsForm({ ...newsForm, showInBanner: e.target.checked })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={onSaveNews}
                                    className="w-full py-6 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs hover:bg-[#0A101E] transition-all transform hover:-translate-y-1 shadow-2xl"
                                >
                                    Salvar Matéria
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showNotificationManager && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-orange-600 rounded-[22px] flex items-center justify-center text-white shadow-lg">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 italic uppercase">Alerta Global</h3>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Aparece no login</p>
                                </div>
                            </div>
                            <button onClick={() => setShowNotificationManager(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-100 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase italic text-sm">Status do Alerta</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Ative para mostrar no login do usuário</p>
                                    {systemNotification?.createdBy && (
                                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-2 italic">Criado por: {systemNotification.createdBy}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setNotificationForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`w-16 h-8 rounded-full transition-all duration-300 relative ${notificationForm.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${notificationForm.isActive ? 'left-9' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Título do Alerta</label>
                                <input
                                    type="text"
                                    value={notificationForm.title || ''}
                                    onChange={e => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 font-bold text-sm"
                                    placeholder="Ex: Novo Benefício Disponível!"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mensagem Detalhada</label>
                                <textarea
                                    value={notificationForm.message || ''}
                                    onChange={e => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 font-bold text-sm min-h-[120px]"
                                    placeholder="Descreva o que o usuário deve saber..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Foto em Destaque</label>
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('notif-img')?.click()}>
                                    <div className="aspect-video w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-orange-300 transition-all">
                                        {notificationForm.image ? (
                                            <img src={notificationForm.image} className="w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <>
                                                <Camera size={32} className="text-slate-300 mb-4 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clique para subir foto</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="notif-img"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => handleImageUpload(e, 'notification')}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    onUpdateSystemNotification({
                                        ...notificationForm,
                                        id: systemNotification?.id,
                                        date: new Date().toISOString(),
                                        isActive: notificationForm.isActive || false,
                                        viewedBy: systemNotification?.viewedBy || []
                                    } as SystemNotification);
                                    setShowNotificationManager(false);
                                    setSuccessMsg('Alerta Global Atualizado!');
                                    setShowSuccess(true);
                                }}
                                className="w-full py-5 bg-orange-600 text-white rounded-[22px] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
                            >
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAudience && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-orange-600 rounded-[22px] flex items-center justify-center text-white shadow-lg">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 italic uppercase">Audiência</h3>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">{showAudience.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAudience(null)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-100 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 max-h-[60vh] overflow-y-auto no-scrollbar">
                            <div className="space-y-3">
                                {showAudience.views.length > 0 ? (
                                    getViewersNames(showAudience.views).map((name, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 border border-slate-100">
                                                <UserIcon size={18} />
                                            </div>
                                            <p className="font-black text-slate-900 uppercase italic text-xs">{name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed italic">Nenhuma visualização <br /> registrada ainda.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Total de {showAudience.views.length} visualizações únicas</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(NewsManager);
