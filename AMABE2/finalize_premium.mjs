import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const newGallery = `                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

// Robust regex for the modal gallery block
const modalGalleryRegex = /<div className="grid grid-cols-2 gap-4">\s*\{selectedPartner\.gallery && selectedPartner\.gallery\.length > 0 \? selectedPartner\.gallery\.map\(\(img, idx\) => \(\s*<img key=\{idx\} src=\{img\} className="w-full aspect-video md:aspect-square object-cover rounded-3xl border border-slate-100 shadow-sm hover:scale-\[1\.02\] transition-transform cursor-pointer" alt="" \/>\s*\}\) : \(/;

if (modalGalleryRegex.test(content)) {
    content = content.replace(modalGalleryRegex, newGallery);
    console.log("Found and replaced modal gallery!");
} else {
    console.log("Could not find modal gallery with full regex. Slashing strings...");
    // Try a simpler replace
    const fallbackSearch = '<div className="grid grid-cols-2 gap-4">';
    const index = content.indexOf(fallbackSearch);
    // Be careful here, there might be multiple. But we know renderPartnerModal is after line 514.
    // We'll use the one that follows "Galeria de Fotos"
    const galleryHeading = 'Galeria de Fotos';
    const headingIndex = content.indexOf(galleryHeading);
    if (headingIndex !== -1) {
        const nextGalleryIndex = content.indexOf(fallbackSearch, headingIndex);
        if (nextGalleryIndex !== -1) {
            console.log("Found gallery block after heading. Replacing...");
            const endOfOldGallery = content.indexOf(')) : (', nextGalleryIndex);
            if (endOfOldGallery !== -1) {
                content = content.slice(0, nextGalleryIndex) + newGallery + content.slice(endOfOldGallery + 6);
            }
        }
    }
}

// Cleanup: remove the fix scripts
fs.writeFileSync(path, content);
console.log("Refined!");
