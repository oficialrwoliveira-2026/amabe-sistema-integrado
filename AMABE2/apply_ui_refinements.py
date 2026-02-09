import re
import os

file_path = r'e:\SISTEMAS\AMABE\amabe---sistema-integrado-de-gestão\components\MemberDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Mobile Button to Hero Banner
# We want to insert it after the desktop content container
content = re.sub(
    r'(<div className="hidden md:flex px-6 md:px-12 lg:px-24 pb-16 md:pb-20 w-full flex flex-col items-center md:items-start text-center md:text-left">.*?</div>)',
    r'\1\n                                  {/* Botão Simplificado para Mobile */}\n                                  <div className="md:hidden absolute bottom-8 left-8 right-8 z-20">\n                                     <button\n                                        onClick={() => setSelectedNews(banner)}\n                                        className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"\n                                     >\n                                        Ver Destaque <ChevronRight size={14} />\n                                     </button>\n                                  </div>',
    content,
    flags=re.DOTALL
)

# 2. Align Highlights (Destaques) cards with Standard News Style
# This replaces the entire Highlights grid content
highlights_replacement = '''                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {/* Notícias em Destaque Reais do Admin */}
                            {news.filter(n => n.isFeatured).slice(0, 6).map((item) => (
                               <div key={item.id} className="group bg-white rounded-3xl md:rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                                  <div className="relative h-32 md:h-48 overflow-hidden">
                                     <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                     <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                        <span className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-slate-900/60 border border-white/20 shadow-sm">
                                           {item.category}
                                        </span>
                                     </div>
                                  </div>
                                  <div className="p-4 md:p-8 flex-1 flex flex-col">
                                     <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-600 animate-pulse"></div>
                                        <span className="text-[7px] md:text-[9px] font-black text-orange-600 uppercase tracking-widest italic">Destaque</span>
                                     </div>
                                     <h3 className="text-sm md:text-xl font-black text-slate-900 italic mb-4 leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight line-clamp-2">
                                        {item.title}
                                     </h3>
                                     <button
                                        onClick={() => setSelectedNews(item)}
                                        className="mt-auto w-full py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
                                     >
                                        Ler Matéria <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>'''

content = re.sub(
    r'<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">.*?{/\* Notícias em Destaque Reais do Admin \*/}.*?</div>\s+</div>',
    highlights_replacement + '\n                     </div>',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied advanced UI refinements using regex.")
