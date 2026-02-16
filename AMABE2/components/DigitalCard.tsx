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
      className={`relative w-full mx-auto group perspective-1000 card-container ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    >
      {/* Container Principal da Carteirinha */}
      <div className={`relative aspect-[1.586/1] rounded-[5cqi] p-[7cqi] text-white shadow-[0_8cqi_20cqi_-4cqi_rgba(0,0,0,0.6)] transition-all duration-700 overflow-hidden z-10 border border-white/10 ${isActive
        ? 'bg-gradient-to-br from-[#141B2D] to-[#0A101E]'
        : 'bg-slate-700 grayscale'
        }`}>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
        </div>

        {/* Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]"></div>
        </div>

        {/* Glows */}
        <div className="absolute -top-10 -left-10 w-[40cqi] h-[40cqi] bg-orange-600/10 blur-[10cqi] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[50cqi] h-[50cqi] bg-orange-600/[0.03] blur-[15cqi] rounded-full shadow-[0_0_30cqi_rgba(234,88,12,0.1)]"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0 mb-[1cqi]">
            <div className="flex items-center space-x-[2.5cqi]">
              <div className="w-[9cqi] h-[9cqi] bg-white rounded-[1.8cqi] flex items-center justify-center p-[1cqi] shadow-xl rotate-3">
                <span className="font-black text-[4.5cqi] italic leading-none text-[#0A101E]">A</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[clamp(12px,3.8cqi,18px)] font-black tracking-tight leading-none italic uppercase opacity-95">AMABE</h2>
                <p className="text-[clamp(8px,2.4cqi,12px)] font-black tracking-[0.25em] text-[#FF5C12] uppercase mt-[0.5cqi] italic">Elite</p>
              </div>
            </div>

            <div className={`px-[3cqi] py-[1.2cqi] rounded-full flex items-center space-x-[1.8cqi] border transition-all duration-500 ${isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
              <div className={`w-[1.4cqi] h-[1.4cqi] rounded-full animate-pulse ${isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
              <span className="text-[clamp(8px,2.4cqi,12px)] font-black uppercase tracking-widest leading-none">{isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>

          {/* Middle Body - Centered Vertically */}
          <div className="flex items-center space-x-[3.5cqi] my-auto">
            <div className="relative shrink-0">
              <div className="w-[18cqi] h-[18cqi] rounded-[4cqi] border-[0.6cqi] border-white/20 overflow-hidden shadow-2xl relative">
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ea580c&color=fff`}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div className="absolute -bottom-[1cqi] -right-[1cqi] w-[6cqi] h-[6cqi] bg-orange-600 rounded-[1.8cqi] flex items-center justify-center text-white shadow-lg border-[0.4cqi] border-[#141B2D]">
                <ShieldCheck size="4cqi" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-[clamp(16px,6cqi,26px)] font-black leading-tight truncate tracking-tight uppercase italic text-white drop-shadow-2xl">{member.name}</h3>
              <div className="flex flex-col space-y-[0.8cqi] mt-[1cqi]">
                <div className="flex items-center space-x-[1.8cqi]">
                  <div className="w-[2.2cqi] h-[2.2cqi] bg-white/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 size="1.4cqi" className="text-[#FF5C12]" />
                  </div>
                  <p className="text-[clamp(10px,2.8cqi,14px)] font-black tracking-widest text-white/80 uppercase truncate leading-none">
                    {isDependent ? `${member.relationship} • ` : ''}
                    {member.memberId || 'N/A'}
                  </p>
                </div>
                {(member.cpf || member.rg) && (
                  <p className="text-[clamp(8px,2.2cqi,11px)] font-bold tracking-[0.12em] text-white/50 uppercase leading-none pl-[4cqi] truncate">
                    {member.cpf && `CPF: ${member.cpf}`} {member.rg && ` • RG: ${member.rg}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between shrink-0 mt-[1cqi]">
            <div className="flex items-end gap-[4.5cqi] min-w-0 flex-1">
              {/* Membro Desde */}
              <div className="flex flex-col gap-[0.5cqi] shrink-0">
                <p className="text-[clamp(8px,2.2cqi,10px)] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Membro desde</p>
                <p className="text-[clamp(10px,3.5cqi,15px)] font-black italic text-white leading-none">2024</p>
              </div>

              {/* Nascimento */}
              <div className="flex flex-col gap-[0.8cqi] min-w-0 max-w-[50%]">
                <p className="text-[clamp(8px,2.2cqi,10px)] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Nascimento</p>
                <div className="flex items-center space-x-[1.5cqi] bg-white/5 px-[2.5cqi] py-[1.5cqi] rounded-[2cqi] border border-white/10 backdrop-blur-sm shadow-inner overflow-hidden">
                  <Calendar size="2.8cqi" className="text-[#FF5C12]" />
                  <span className="text-[clamp(10px,2.8cqi,14px)] font-black italic text-white tracking-tight leading-none truncate">{member.birthDate || '--/--/----'}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 ml-[2cqi]">
              <div className="bg-white p-[0.8cqi] rounded-[2cqi] shadow-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${member.memberId || 'INVALID'}&margin=1&bgcolor=ffffff&color=000000`}
                  alt="QR Code"
                  className="w-[12cqi] h-[12cqi] rounded-[1.2cqi]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Shadow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-orange-600/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};

export default DigitalCard;
