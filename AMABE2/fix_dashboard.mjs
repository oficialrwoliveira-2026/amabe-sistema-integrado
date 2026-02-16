import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the corrupted lines based on view_file output 1069
const badLine1 = '                            <h4 className="text-sm md:text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-tight data-test=" true" group-hover:text-orange-600 transition-colors line-clamp-2 md:line-clamp-1">{p.name}</h4>';
const goodLine1 = '                            <h4 className="text-sm md:text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 md:line-clamp-1">{p.name}</h4>';

if (content.includes(badLine1)) {
    content = content.replace(badLine1, goodLine1);
} else {
    console.log("Could not find badLine1 literally. Trying partial match...");
    content = content.replace(/<h4.*data-test=" true".*<\/h4>/, goodLine1);
}

// Fix corrupted tag closing 1316-1320
content = content.replace(/<\/h4>\s+<\/div>\s+<p className="text-slate-500 text-\[10px\] md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-3 italic">\s+{p\.description \|\| "Descrição em breve\.\.\."}\s+<\/p>\s+<\/div>/,
    '</h4>\n                         </div>\n                         <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-3 italic">\n                            {p.description || "Descrição em breve..."}\n                         </p>\n                      </div>');

// Fix 1344
content = content.replace('< div className = "bg-slate-50', '<div className="bg-slate-50');

fs.writeFileSync(path, content);
console.log("Fixed!");
