
import React from 'react';
import { User, MemberStatus, DashboardTab } from '../types';
import { ShieldCheck, Calendar, Info, CheckCircle2 } from 'lucide-react';

interface DigitalCardProps {
  member: User;
  activeTab?: DashboardTab;
  onClick?: () => void;
}

const DigitalCard: React.FC<DigitalCardProps> = ({ member, activeTab, onClick }) => {
  const isActive = member.status === MemberStatus.ACTIVE;
  const isDependent = member.relationship && member.relationship !== 'Master';

  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[460px] mx-auto group perspective-1000 ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    >
      {/* Container Principal da Carteirinha */}
      <div className={`relative aspect-[1.586/1] rounded-[24px] xs:rounded-[32px] md:rounded-[40px] p-5 xs:p-8 md:p-12 text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 overflow-hidden z-10 border border-white/10 ${isActive
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
        <div className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-48 h-48 md:w-64 md:h-64 bg-orange-600/10 blur-[60px] md:blur-[80px] rounded-full"></div>

        {/* Conteúdo em Flexbox para evitar sobreposição */}
        <div className="relative z-20 h-full flex flex-col justify-between">

          {/* Topo: Logo e Status - Puxado mais para o topo para melhor enquadramento */}
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-2.5 md:space-x-4">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-[#FF5C12] to-[#FF8C12] rounded-[8px] md:rounded-[12px] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,92,18,0.4)] shrink-0">
                <span className="font-black text-xs md:text-xl italic leading-none">A</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[12px] md:text-xl font-black tracking-tight leading-none italic uppercase opacity-95">AMABE</h2>
                <p className="text-[7.5px] md:text-[9px] font-black tracking-[0.25em] md:tracking-[0.4em] text-[#FF5C12] uppercase mt-1 italic">Elite</p>
              </div>
            </div>

            <div className={`px-2.5 py-1 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.15em] border backdrop-blur-md flex items-center gap-1.5 md:gap-2.5 ${isActive ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/25' : 'bg-red-500/15 text-red-400 border-red-500/25'
              }`}>
              <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isActive ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-400'}`}></div>
              <span className="hidden xs:inline">{isDependent ? 'DEPENDENTE' : (isActive ? 'USUARIO ATIVO' : 'CADASTRO INATIVO')}</span>
              <span className="xs:hidden">{isDependent ? 'DEP' : (isActive ? 'ATIVO' : 'INATIVO')}</span>
            </div>
          </div>

          {/* Meio: Foto e Informação de Nome */}
          <div className="flex items-center gap-2.5 md:gap-5 min-h-0 py-1 md:py-2">
            <div className="relative shrink-0">
              <div className="w-12 h-12 xs:w-18 xs:h-18 md:w-20 md:h-20 rounded-[14px] md:rounded-[28px] border-[2px] md:border-[4px] border-white/5 overflow-hidden bg-[#0A101E] shadow-2xl relative">
                <img
                  src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`;
                  }}
                />
              </div>
              {/* Selo de Proteção flutuante - Movido para a parte INFERIOR para evitar qualquer conflito com o topo */}
              <div className="absolute -bottom-1 -right-1 md:-bottom-3 md:-right-3 w-5 h-5 md:w-10 md:h-10 bg-gradient-to-tr from-[#92400E] to-[#F59E0B] backdrop-blur-lg border border-white/20 rounded-md md:rounded-xl z-20 flex items-center justify-center shadow-lg rotate-3">
                <ShieldCheck size={10} className="text-white/90 md:hidden" />
                <ShieldCheck size={20} className="text-white/90 hidden md:block" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-[15px] xs:text-xl md:text-[24px] font-black leading-tight truncate tracking-tight uppercase italic text-white drop-shadow-lg">{member.name}</h3>
              <div className="flex flex-col space-y-1 md:space-y-1.5 mt-1 md:mt-2">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-white/5 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={8} className="text-[#FF5C12] md:hidden" />
                    <CheckCircle2 size={12} className="text-[#FF5C12] hidden md:block" />
                  </div>
                  <p className="text-[9px] md:text-[13px] font-black tracking-widest text-white/60 uppercase truncate leading-none">
                    {isDependent ? `${member.relationship} • ` : ''}
                    {member.memberId || 'N/A'}
                  </p>
                </div>
                {(member.cpf || member.rg) && (
                  <p className="text-[7.5px] md:text-[9.5px] font-bold tracking-[0.1em] text-white/40 uppercase leading-none pl-5 md:pl-8 truncate">
                    {member.cpf && `CPF: ${member.cpf}`} {member.rg && ` • RG: ${member.rg}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé: Datas e QR Code */}
          <div className="flex items-end justify-between gap-6 md:gap-10">
            <div className="flex items-end gap-4 md:gap-10 min-w-0 flex-1">
              {/* Membro Desde */}
              <div className="flex flex-col gap-1 md:gap-1.5 shrink-0">
                <p className="text-[7.5px] md:text-[8px] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Membro desde</p>
                <p className="text-[11px] md:text-sm font-black italic text-white/95 leading-none">2024</p>
              </div>

              {/* Nascimento */}
              <div className="flex flex-col gap-1 md:gap-1.5 min-w-0">
                <p className="text-[7.5px] md:text-[8px] uppercase text-[#FF5C12] font-black tracking-[0.2em] italic leading-none opacity-90">Nascimento</p>
                <div className="flex items-center space-x-2 md:space-x-3 bg-white/5 px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-[16px] border border-white/10 backdrop-blur-sm shadow-inner overflow-hidden">
                  <Calendar size={11} className="text-[#FF5C12] md:hidden" />
                  <Calendar size={12} className="text-[#FF5C12] hidden md:block" />
                  <span className="text-[11px] md:text-[12px] font-black italic text-white tracking-tight leading-none truncate">{member.birthDate || '--/--/----'}</span>
                </div>
              </div>
            </div>

            {/* QR Code Bottom Right */}
            <div className="bg-white p-1 md:p-1.5 rounded-[8px] md:rounded-[12px] shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 shrink-0 ml-auto border border-white/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${member.memberId || 'INVALID'}&margin=1&bgcolor=ffffff&color=000000`}
                alt="QR Code"
                className="w-9 h-9 xs:w-11 xs:h-11 md:w-16 md:h-16 rounded-lg"
              />
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
