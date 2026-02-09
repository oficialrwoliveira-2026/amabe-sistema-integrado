
import React from 'react';
import { X, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface SystemNotificationProps {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
    isOpen,
    type,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) => {
    if (!isOpen) return null;

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={48} />,
        error: <AlertCircle className="text-rose-500" size={48} />,
        warning: <AlertCircle className="text-amber-500" size={48} />,
        info: <Info className="text-blue-500" size={48} />,
        confirm: <HelpCircle className="text-orange-500" size={48} />
    };

    const colors = {
        success: 'border-emerald-100 bg-emerald-50/30',
        error: 'border-rose-100 bg-rose-50/30',
        warning: 'border-amber-100 bg-amber-50/30',
        info: 'border-blue-100 bg-blue-50/30',
        confirm: 'border-orange-100 bg-orange-50/30'
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-[#0A101E]/40 backdrop-blur-md"
                onClick={type !== 'confirm' ? onClose : undefined}
            ></div>

            <div className={`relative w-full max-w-md bg-white rounded-[48px] shadow-2xl border ${colors[type]} p-10 overflow-hidden animate-in zoom-in-95 duration-500`}>
                {/* Background elements for elegance */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[64px] -mr-8 -mt-8 opacity-50"></div>
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-rose-400' : 'bg-orange-400'}`}></div>

                {/* Tech lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-white rounded-3xl shadow-lg border border-slate-50">
                        {icons[type]}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-4 leading-tight">
                        {title}
                    </h3>

                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10">
                        {message}
                    </p>

                    <div className="flex gap-4 w-full">
                        {type === 'confirm' ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm?.();
                                        onClose();
                                    }}
                                    className="flex-1 py-5 bg-[#0F172A] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10"
                                >
                                    {confirmText}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-[#0F172A] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10"
                            >
                                Entendido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemNotification;
