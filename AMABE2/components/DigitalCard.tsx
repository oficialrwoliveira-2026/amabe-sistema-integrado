import React from 'react';
import { User, MemberStatus } from '../types';
import { ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';

interface DigitalCardProps {
  member: User;
  isDependent?: boolean;
  onClick?: () => void;
}

const DigitalCard: React.FC<DigitalCardProps> = ({ member, isDependent = false, onClick }) => {
  const isActive = member.status === MemberStatus.ACTIVE;

  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[340px] mx-auto group perspective-1000 card-container ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    >
      {/* Container Principal da Carteirinha - Formato Vertical Futurista */}
      <div className={`relative aspect-[0.63] rounded-[8cqi] text-white shadow-[0_12cqi_40cqi_-10cqi_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden z-10 border border-white/10 ${isActive
        ? 'bg-[#0A101E]'
        : 'bg-slate-900 grayscale'
        }`}>

        {/* Mesh Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

        {/* Top Hero Section (Branding & Avatar) */}
        <div className="relative h-[40%] p-[8cqi] flex flex-col items-center justify-between z-20">
          {/* Header row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-[2cqi]">
              <div className="w-[8cqi] h-[8cqi] bg-gradient-to-tr from-orange-600 to-orange-400 rounded-[1.5cqi] flex items-center justify-center p-[0.8cqi] shadow-[0_0_15px_rgba(234,88,12,0.4)] rotate-3">
                <span className="font-black text-[4cqi] italic leading-none text-white">A</span>
              </div>
              <h2 className="text-[clamp(14px,4.5cqi,20px)] font-black tracking-tighter leading-none italic uppercase text-white/90">AMABE <span className="text-orange-600">ELITE</span></h2>
            </div>
            {/* Status Badge */}
            <div className={`px-[3cqi] py-[1cqi] rounded-full flex items-center space-x-[1.5cqi] border transition-all duration-500 backdrop-blur-md ${isActive ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
              <div className={`w-[1.2cqi] h-[1.2cqi] rounded-full animate-pulse ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-500'}`}></div>
              <span className="text-[clamp(8px,2.5cqi,12px)] font-black uppercase tracking-widest leading-none">{isActive ? 'Verificado' : 'Suspenso'}</span>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="relative mt-[2cqi]">
            <div className="w-[30cqi] h-[30cqi] rounded-full border-[0.8cqi] border-orange-600/30 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] relative bg-[#020617] group-hover:border-orange-600 transition-colors duration-500">
              <img
                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ea580c&color=fff`}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                alt="avatar"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A101E]/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-[0.5cqi] right-[1cqi] w-[8cqi] h-[8cqi] bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(234,88,12,0.6)] border-[0.5cqi] border-[#0A101E] z-30">
              <ShieldCheck size="5cqi" />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center w-full mt-[2cqi]">
            <h3 className="text-[clamp(18px,7cqi,28px)] font-black leading-tight truncate tracking-tight uppercase italic text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{member.name}</h3>
            <div className="flex items-center justify-center space-x-2 mt-[0.5cqi]">
              <div className="h-[1px] w-[4cqi] bg-orange-600/50"></div>
              <p className="text-[clamp(8px,2.2cqi,11px)] font-black tracking-[0.4em] text-orange-500 uppercase italic">MEMBRO ACESSO DIGITAL</p>
              <div className="h-[1px] w-[4cqi] bg-orange-600/50"></div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Section (The "Card" body) */}
        <div className="absolute top-[40%] left-0 right-0 bottom-0 bg-slate-900/40 backdrop-blur-xl rounded-t-[10cqi] p-[8cqi] pt-[10cqi] flex flex-col z-20 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
          {/* Main ID info */}
          <div className="space-y-[4.5cqi] flex-1">
            <div className="space-y-[1.5cqi]">
              <div className="flex items-center justify-between px-[1cqi]">
                <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-white/30 uppercase tracking-[0.2em]">MATRÍCULA ID</p>
                <div className="h-[2px] flex-1 mx-[3cqi] bg-white/5"></div>
              </div>
              <div className="bg-white/[0.03] px-[4cqi] py-[3.5cqi] rounded-[3cqi] border border-white/5 flex items-center justify-between group-hover:bg-white/[0.05] transition-colors">
                <p className="text-[clamp(14px,4.5cqi,20px)] font-black tracking-widest text-white uppercase leading-none italic drop-shadow-md">
                  {isDependent ? `${member.relationship} • ` : ''}
                  <span className="text-orange-500">{member.memberId || 'N/A'}</span>
                </p>
                <CheckCircle2 size="4cqi" className="text-orange-500/50" />
              </div>
            </div>

            {/* Documents */}
            {(member.cpf || member.rg) && (
              <div className="grid grid-cols-2 gap-[4cqi]">
                <div className="space-y-[1.5cqi]">
                  <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-white/30 uppercase tracking-[0.1em] pl-[1cqi]">REGISTRO CPF</p>
                  <p className="text-[clamp(10px,3.2cqi,15px)] font-bold text-white/90 italic tracking-widest bg-white/[0.02] p-2 rounded-lg border border-white/5 text-center truncate">{member.cpf || '---.---.---'}</p>
                </div>
                <div className="space-y-[1.5cqi]">
                  <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-white/30 uppercase tracking-[0.1em] pl-[1cqi]">REGISTRO RG</p>
                  <p className="text-[clamp(10px,3.2cqi,15px)] font-bold text-white/90 italic tracking-widest bg-white/[0.02] p-2 rounded-lg border border-white/5 text-center truncate">{member.rg || '-------'}</p>
                </div>
              </div>
            )}

            {/* Dates Row */}
            <div className="flex items-center justify-between gap-[4cqi] pt-[2cqi]">
              <div className="flex-1 space-y-[1.5cqi]">
                <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-orange-500 uppercase tracking-widest italic opacity-60">DATA DE VERIFICAÇÃO</p>
                <div className="flex items-center space-x-2">
                  <Calendar size="3cqi" className="text-white/20" />
                  <p className="text-[clamp(12px,4cqi,18px)] font-black text-white italic tracking-tighter">OUT 2024</p>
                </div>
              </div>
              <div className="flex-1 space-y-[1.5cqi]">
                <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-orange-500 uppercase tracking-widest italic opacity-60">PROTOCOLO NASCIMENTO</p>
                <div className="flex items-center space-x-2">
                  <div className="w-[1.5cqi] h-[1.5cqi] rounded-full bg-orange-600 shadow-[0_0_5px_rgba(234,88,12,0.8)] animate-pulse"></div>
                  <span className="text-[clamp(12px,3.5cqi,16px)] font-black text-white italic tracking-widest">{member.birthDate || '--/--/----'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with QR Code */}
          <div className="flex items-center justify-between pt-[4cqi] border-t border-white/5 mt-auto">
            <div className="space-y-[1cqi]">
              <p className="text-[clamp(12px,3.5cqi,16px)] font-black text-white uppercase italic leading-tight">SISTEMA<br /><span className="text-orange-600 tracking-[0.2em]">ELITE-X</span></p>
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 bg-orange-600/20 rounded-full"></div>)}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-[1cqi] bg-orange-600/20 blur-[3cqi] rounded-full animate-pulse"></div>
              <div className="relative bg-white/[0.05] p-[1.5cqi] rounded-[3cqi] border border-white/10 backdrop-blur-sm group-hover:border-orange-600/30 transition-colors">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${member.memberId || 'INVALID'}&margin=1&bgcolor=ffffff&color=234,88,12&format=svg`}
                  alt="QR Code"
                  className="w-[18cqi] h-[18cqi] rounded-[1.5cqi] invert opacity-90 brightness-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Light Rays */}
        <div className="absolute -top-[20%] -right-[10%] w-[60cqi] h-[60cqi] bg-orange-600/[0.07] blur-[20cqi] rounded-full rotate-45 pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50cqi] h-[50cqi] bg-blue-600/[0.05] blur-[25cqi] rounded-full pointer-events-none"></div>
      </div>

      {/* Outer Glow */}
      <div className={`absolute inset-0 rounded-[8cqi] blur-[30px] opacity-20 -z-10 transition-colors duration-1000 ${isActive ? 'bg-orange-600/50' : 'bg-slate-600/50'}`}></div>
    </div>
  );
};

export default DigitalCard;
