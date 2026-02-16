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
      {/* Container Principal da Carteirinha - Formato Vertical */}
      <div className={`relative aspect-[0.63] rounded-[8cqi] text-white shadow-[0_8cqi_32cqi_-4cqi_rgba(0,0,0,0.4)] transition-all duration-700 overflow-hidden z-10 border border-white/10 ${isActive
        ? 'bg-[#141B2D]'
        : 'bg-slate-700 grayscale'
        }`}>

        {/* Top Hero Section (Branding & Avatar) */}
        <div className="relative h-[42%] p-[8cqi] flex flex-col items-center justify-between z-20">
          {/* Header row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-[2cqi]">
              <div className="w-[8cqi] h-[8cqi] bg-white rounded-[1.5cqi] flex items-center justify-center p-[0.8cqi] shadow-lg rotate-3">
                <span className="font-black text-[4cqi] italic leading-none text-[#0A101E]">A</span>
              </div>
              <h2 className="text-[clamp(14px,4.5cqi,20px)] font-black tracking-tight leading-none italic uppercase opacity-95">AMABE</h2>
            </div>
            {/* Status Badge */}
            <div className={`px-[3cqi] py-[1cqi] rounded-full flex items-center space-x-[1.5cqi] border transition-all duration-500 ${isActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/20 border-slate-500/30 text-slate-400'}`}>
              <div className={`w-[1.2cqi] h-[1.2cqi] rounded-full animate-pulse ${isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
              <span className="text-[clamp(8px,2.5cqi,12px)] font-black uppercase tracking-widest leading-none">{isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="relative mt-[2cqi]">
            <div className="w-[32cqi] h-[32cqi] rounded-[6cqi] border-[0.8cqi] border-white/20 overflow-hidden shadow-2xl relative bg-[#0A101E]">
              <img
                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ea580c&color=fff`}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            </div>
            <div className="absolute -bottom-[1.5cqi] -right-[1.5cqi] w-[8cqi] h-[8cqi] bg-orange-600 rounded-[2cqi] flex items-center justify-center text-white shadow-lg border-[0.5cqi] border-[#141B2D]">
              <ShieldCheck size="5cqi" />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center w-full mt-[2cqi]">
            <h3 className="text-[clamp(18px,7cqi,28px)] font-black leading-tight truncate tracking-tight uppercase italic text-white drop-shadow-xl">{member.name}</h3>
            <p className="text-[clamp(10px,3cqi,14px)] font-black tracking-[0.3em] text-[#FF5C12] uppercase mt-[0.5cqi] italic">Elite Club</p>
          </div>
        </div>

        {/* White Info Section (The "Card" body) */}
        <div className="absolute top-[42%] left-0 right-0 bottom-0 bg-white rounded-t-[10cqi] p-[8cqi] pt-[10cqi] flex flex-col z-10 shadow-[0_-4cqi_12cqi_rgba(0,0,0,0.1)]">
          {/* Main ID info */}
          <div className="space-y-[4cqi] flex-1">
            <div className="space-y-[1cqi]">
              <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-slate-400 uppercase tracking-widest pl-[1cqi]">Identificação</p>
              <div className="bg-slate-50 px-[4cqi] py-[3.5cqi] rounded-[4cqi] border border-slate-100 flex items-center justify-between">
                <p className="text-[clamp(14px,4.5cqi,20px)] font-black tracking-widest text-[#0A101E] uppercase leading-none italic">
                  {isDependent ? `${member.relationship} • ` : ''}
                  {member.memberId || 'N/A'}
                </p>
                <div className="w-[2.5cqi] h-[2.5cqi] bg-orange-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size="1.8cqi" className="text-[#FF5C12]" />
                </div>
              </div>
            </div>

            {/* Documents */}
            {(member.cpf || member.rg) && (
              <div className="grid grid-cols-2 gap-[4cqi]">
                {member.cpf && (
                  <div className="space-y-[1cqi]">
                    <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-slate-400 uppercase tracking-widest pl-[1cqi]">CPF</p>
                    <p className="text-[clamp(10px,3cqi,14px)] font-bold text-slate-700 italic">{member.cpf}</p>
                  </div>
                )}
                {member.rg && (
                  <div className="space-y-[1cqi]">
                    <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-slate-400 uppercase tracking-widest pl-[1cqi]">RG</p>
                    <p className="text-[clamp(10px,3cqi,14px)] font-bold text-slate-700 italic">{member.rg}</p>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-[4cqi] pt-[2cqi]">
              <div className="space-y-[1cqi]">
                <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-[#FF5C12] uppercase tracking-widest italic opacity-80">Membro desde</p>
                <p className="text-[clamp(12px,4cqi,18px)] font-black text-slate-900 italic">2024</p>
              </div>
              <div className="space-y-[1cqi]">
                <p className="text-[clamp(8px,2.2cqi,10px)] font-black text-[#FF5C12] uppercase tracking-widest italic opacity-80">Nascimento</p>
                <div className="flex items-center space-x-[1.5cqi]">
                  <Calendar size="2.5cqi" className="text-[#FF5C12]" />
                  <span className="text-[clamp(12px,3.5cqi,16px)] font-black text-slate-900 italic tracking-tighter">{member.birthDate || '--/--/----'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with QR Code */}
          <div className="flex items-end justify-between pt-[4cqi] border-t border-slate-50 mt-[4cqi]">
            <div className="space-y-[1cqi]">
              <p className="text-[clamp(10px,3cqi,14px)] font-black text-slate-900 uppercase italic leading-tight">AMABE<br /><span className="text-orange-600">ELITE</span></p>
              <p className="text-[7px] text-slate-300 font-bold uppercase tracking-widest">Digital ID System</p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-orange-600/5 blur-[4cqi] rounded-full group-hover:bg-orange-600/10 transition-colors"></div>
              <div className="relative bg-white p-[1.5cqi] rounded-[3cqi] shadow-xl border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${member.memberId || 'INVALID'}&margin=1&bgcolor=ffffff&color=000000`}
                  alt="QR Code"
                  className="w-[18cqi] h-[18cqi] rounded-[2cqi]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extra BG Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[50cqi] h-[50cqi] bg-orange-600/10 blur-[15cqi] rounded-full pointer-events-none"></div>
      </div>

      {/* Background Shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/10 blur-[40px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};

export default DigitalCard;
