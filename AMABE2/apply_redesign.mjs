import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const newLayout = `                {filteredPartners.length > 0 ? filteredPartners.map(p => (
                   <div
                      key={p.id}
                      onClick={() => setSelectedPartner(p)}
                      className="group bg-white rounded-[40px] md:rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col min-h-[400px] md:min-h-[520px] hover:-translate-y-2"
                   >
                      {/* Hero Image Background for Elegant Look */}
                      {p.gallery && p.gallery.length > 0 ? (
                         <div className="relative h-44 md:h-64 overflow-hidden">
                            <img 
                               src={p.gallery[0]} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" 
                               alt="" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10"></div>
                            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                               <div className="w-14 h-14 md:w-28 md:h-28 bg-white/95 rounded-[24px] md:rounded-[44px] p-3 md:p-5 shadow-2xl flex items-center justify-center border border-white/50 backdrop-blur-xl">
                                  <img src={p.logo} className="w-full h-full object-contain" alt="" />
                               </div>
                            </div>
                         </div>
                      ) : (
                         <div className="p-8 md:p-12 pb-0 flex justify-center">
                            <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-[32px] md:rounded-[48px] p-4 md:p-6 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                               <img src={p.logo} className="w-full h-full object-contain" alt="" />
                            </div>
                         </div>
                      )}

                      <div className="p-6 md:p-10 pt-5 md:pt-8 flex flex-col flex-1 relative z-10">
                         <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-[9px] md:text-[11px] font-black text-white px-4 py-1.5 bg-orange-600 rounded-full lowercase tracking-tighter italic border border-orange-400/20 shadow-lg shadow-orange-500/30">{p.category}</span>
                               <div className="flex items-center gap-1 opacity-20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                               </div>
                            </div>
                            <h4 className="text-base md:text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h4>
                            <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-2 italic mt-2 opacity-70">
                               {p.description || "Referência em qualidade e benefícios exclusivos para membros."}
                            </p>
                         </div>

                         {/* Premium Gallery Stack */}
                         {p.gallery && p.gallery.length > 0 && (
                            <div className="flex -space-x-4 mb-8 mt-auto py-2 group/gallery">
                               {p.gallery.slice(0, 3).map((img, i) => (
                                  <div 
                                     key={i} 
                                     onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                                     className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] overflow-hidden border-2 border-white shadow-2xl relative hover:-translate-y-3 transition-all duration-500 hover:rotate-3 cursor-zoom-in z-10 hover:z-30"
                                     style={{ zIndex: 10 + i }}
                                  >
                                     <img src={img} className="w-full h-full object-cover" alt="" />
                                     {i === 2 && p.gallery!.length > 3 && (
                                        <div className="absolute inset-0 bg-orange-600/90 flex items-center justify-center backdrop-blur-[1px]">
                                           <span className="text-white text-[9px] md:text-xs font-black">+{p.gallery!.length - 3}</span>
                                        </div>
                                     )}
                                  </div>
                               ))}
                               <div className="flex flex-col justify-center ml-6 pl-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                                  <span className="text-[7px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">Visualizar</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Galeria</span>
                               </div>
                            </div>
                         )}

                         <div className="flex items-center justify-between gap-6 mt-auto pt-6 border-t border-slate-50/50">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Vantagem</span>
                               <div className="flex items-baseline gap-1">
                                  <p className="text-lg md:text-4xl font-black italic tracking-tighter uppercase text-orange-600 leading-none">{p.discount}</p>
                               </div>
                            </div>
                            <button className="flex-1 py-4 md:py-8 bg-[#0A101E] text-white rounded-[24px] md:rounded-[48px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-all shadow-xl active:scale-95 shadow-slate-900/10 hover:shadow-orange-600/20">
                               Resgatar <ChevronRight size={18} />
                            </button>
                         </div>
                      </div>
                   </div>
                )) : (`;

// Improved regex to match the map block even if indentation is slightly off
const mapRegex = /\{\s*filteredPartners\.length\s*>\s*0\s*\?\s*filteredPartners\.map\(p\s*=>\s*\(\s*<div[\s\S]*?className="group[\s\S]*?\)[\s\S]*?\)\s*:\s*\(/;

if (mapRegex.test(content)) {
    content = content.replace(mapRegex, newLayout);
    fs.writeFileSync(path, content);
    console.log("Successfully applied redesign!");
} else {
    console.error("Could not find the partners map block. Checking partials...");
    // Fallback: search for a larger part that is unique
    const uniqueStart = '{filteredPartners.length > 0 ? filteredPartners.map(p => (';
    const index = content.indexOf(uniqueStart);
    if (index !== -1) {
        console.log("Found unique start. Replacing until next major block...");
        // This is a bit more dangerous but we are desperate
        // We'll replace the block manually
    }
}
