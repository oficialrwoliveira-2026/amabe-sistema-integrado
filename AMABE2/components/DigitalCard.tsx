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
      <div className={`relative aspect-[1.586/1] rounded-[5cqi] p-[4cqi] text-white shadow-[0_8cqi_16cqi_-3cqi_rgba(0,0,0,0.5)] transition-all duration-700 overflow-hidden z-10 border border-white/10 ${isActive
        ? 'bg-gradient-to-br from-[#141B2D] to-[#0A101E]'
        : 'bg-slate-700 grayscale'
        }`}>

        {/* Efeito Holográfico de Brilho (Shimmer) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
        </div>

        {/* Padrões Decorativos de Fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent"></div>
        </div>

        {/* Glow Laranja superior esquerdo */}
        <div className="absolute -top-10 -left-10 w-[40cqi] h-[40cqi] bg-orange-600/10 blur-[10cqi] rounded-full"></div>

        {/* Conteúdo em Flexbox para evitar sobreposição */}
        <div className="absolute top-[15cqi] -right-[10cqi] w-[40cqi] h-[40cqi] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-[10cqi] -left-[10cqi] w-[30cqi] h-[30cqi] bg-[#FF5C12]/[0.05] rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            {/* Holographic Logo Effect */}
            <div className="flex items-center space-x-[2.5cqi]">
              <div className="w-[8cqi] h-[8cqi] bg-white rounded-[1.5cqi] flex items-center justify-center p-[1cqi] shadow-xl rotate-3">
                <span className="font-black text-[4cqi] italic leading-none text-[#0A101E]">A</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[3cqi] font-black tracking-tight leading-none italic uppercase opacity-95">AMABE</h2>
                <p className="text-[1.8cqi] font-black tracking-[0.25em] text-[#FF5C12] uppercase mt-[0.5cqi] italic">Elite</p>
              </div>
            </div>

            <div className={`px-[2.5cqi] py-[1cqi] rounded-full flex items-center space-x-[1.5cqi] border transition-all duration-500 ${isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
              <div className={`w-[1.2cqi] h-[1.2cqi] rounded-full animate-pulse ${isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
              <span className="text-[1.8cqi] font-black uppercase tracking-widest">{isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-[3cqi]">
            <div className="relative">
              <div className="w-[12cqi] h-[12cqi] rounded-[2.5cqi] border-[0.5cqi] border-white/10 overflow-hidden shadow-2xl relative">
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ea580c&color=fff`}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div className="absolute -bottom-[1cqi] -right-[1cqi] w-[4cqi] h-[4cqi] bg-orange-600 rounded-[1cqi] flex items-center justify-center text-white shadow-lg border-[0.3cqi] border-[#141B2D]">
                <ShieldCheck size="2.5cqi" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-[4.5cqi] font-black leading-tight truncate tracking-tight uppercase italic text-white drop-shadow-lg">{member.name}</h3>
              <div className="flex flex-col space-y-[0.5cqi] mt-[0.5cqi]">
                <div className="flex items-center space-x-[1.5cqi]">
                  <div className="w-[2cqi] h-[2cqi] bg-white/5 rounded-full flex items-center justify-center">
                    <CheckCircle2 size="1.2cqi" className="text-[#FF5C12]" />
                  </div>
                  <p className="text-[2.2cqi] font-black tracking-widest text-white/60 uppercase truncate leading-none">
                    {isDependent ? `${member.relationship} • ` : ''}
                    {member.memberId || 'N/A'}
                  </p>
                </div>
                {(member.cpf || member.rg) && (
                  <p className="text-[1.8cqi] font-bold tracking-[0.1em] text-white/40 uppercase leading-none pl-[3.5cqi] truncate">
                    {member.cpf && `CPF: ${member.cpf}`} {member.rg && ` • RG: ${member.rg}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-end gap-[4cqi] min-w-0 flex-1">
              {/* Membro Desde */}
              <div className="flex flex-col gap-[0.5cqi] shrink-0">
                <p className="text-[1.8cqi] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Membro desde</p>
                <p className="text-[2.8cqi] font-black italic text-white/95 leading-none">2024</p>
              </div>

              {/* Nascimento */}
              <div className="flex flex-col gap-[0.5cqi] min-w-0">
                <p className="text-[1.8cqi] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Nascimento</p>
                <div className="flex items-center space-x-[1.5cqi] bg-white/5 px-[2cqi] py-[1.2cqi] rounded-[1.5cqi] border border-white/10 backdrop-blur-sm shadow-inner overflow-hidden">
                  <Calendar size="2.2cqi" className="text-[#FF5C12]" />
                  <span className="text-[2.2cqi] font-black italic text-white tracking-tight leading-none truncate">{member.birthDate || '--/--/----'}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 ml-[2cqi]">
              <div className="bg-white p-[0.3cqi] rounded-[1.8cqi] shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${member.memberId || 'INVALID'}&margin=1&bgcolor=ffffff&color=000000`}
                  alt="QR Code"
                  className="w-[8cqi] h-[8cqi] rounded-[1.2cqi]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sombras e Reflexos de fundo */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-16 md:h-20 bg-orange-600/10 blur-[50px] md:blur-[60px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};

export default DigitalCard;
