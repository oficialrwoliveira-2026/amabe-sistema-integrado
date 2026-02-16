import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix Resgatar button stretching: Remove flex-1 and add consistent padding/rounded-full
// Also adjust typography for better hierarchy
content = content.replace('flex-1 py-4 md:py-6 bg-[#0A101E] text-white rounded-[24px] md:rounded-[36px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-all shadow-xl active:scale-95 shadow-slate-900/10 hover:shadow-orange-600/20',
    'px-10 py-4 md:px-14 md:py-5 bg-[#0A101E] text-white rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-all shadow-xl active:scale-95 shadow-slate-900/10 hover:shadow-orange-600/20');

// 2. Refine Gallery Stack for better desktop presence
// Increase thumbnail size slightly and adjust offset
content = content.replace('md:w-16 md:h-16 rounded-2xl md:rounded-[24px]', 'md:w-20 md:h-20 rounded-2xl md:rounded-[28px]');
content = content.replace('flex -space-x-4 mb-8 mt-auto py-2 group/gallery', 'flex -space-x-4 md:-space-x-6 mb-8 mt-auto py-2 group/gallery');

// 3. Improve "Ver Mídias" text positioning/scaling on desktop
content = content.replace('text-[7px] font-black text-orange-600', 'text-[7px] md:text-[9px] font-black text-orange-600');
content = content.replace('text-[10px] font-black text-slate-400', 'text-[10px] md:text-xs font-black text-slate-400');
content = content.replace('ml-6 pl-2', 'ml-8 pl-4');

// 4. Adjust spacing between Advantage and Button
content = content.replace('gap-6 mt-auto pt-6 border-t', 'gap-4 mt-auto pt-6 border-t');

fs.writeFileSync(path, content);
console.log("Button and gallery refinements applied successfully!");
