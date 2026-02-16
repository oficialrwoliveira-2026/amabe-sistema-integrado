import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const newModalMarkup = `                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                               {selectedPartner.gallery && selectedPartner.gallery.length > 0 ? selectedPartner.gallery.map((img, idx) => (
                                  <div 
                                     key={idx} 
                                     onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                                     className="group/gallery-item relative aspect-square md:aspect-video rounded-[32px] overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                  >
                                     <img src={img} className="w-full h-full object-cover group-hover/gallery-item:scale-110 transition-transform duration-1000" alt="" />
                                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery-item:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-orange-600/80 px-4 py-2 rounded-full backdrop-blur-sm">Ampliar</span>
                                     </div>
                                  </div>
                               )) : (`;

const galleryRegex = /<div className="grid grid-cols-2 gap-4">[\s\S]*?\{selectedPartner\.gallery && selectedPartner\.gallery\.length > 0 \? selectedPartner\.gallery\.map\(\(img, idx\) => \([\s\S]*?<img[\s\S]*?\/>\s*\}\) : \(/;

if (galleryRegex.test(content)) {
    content = content.replace(galleryRegex, newModalMarkup);

    // Also improve the header of the modal to be more premium
    content = content.replace('      <div className="relative h-64 md:h-96 w-full">', '      <div className="relative h-64 md:h-[480px] w-full">');

    fs.writeFileSync(path, content);
    console.log("Successfully refined modal gallery!");
} else {
    console.error("Could not find the modal gallery block.");
}
