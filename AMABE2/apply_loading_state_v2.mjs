import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add isLoadingPartners to component arguments
if (!content.includes('isLoadingPartners')) {
    // Try different variations of the end of the argument list
    content = content.replace(/onLoadFullProfile\s*\}\)\s*=>\s*\{/s, 'onLoadFullProfile, isLoadingPartners\n}) => {');
}

// 2. Inject the skeleton loader logic
const oldGridStart = '<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-7 stagger-load">';
const skeletonLoader = `
               {isLoadingPartners ? (
                  // Rendering premium skeletons while loading
                  Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="bg-white rounded-[40px] md:rounded-[48px] border border-slate-50 flex flex-col min-h-[380px] md:min-h-[460px] animate-pulse overflow-hidden">
                        <div className="h-44 md:h-52 bg-slate-100 relative">
                           <div className="absolute top-4 left-4 md:top-8 md:left-8 w-14 h-14 md:w-24 md:h-24 bg-white/50 rounded-[24px] md:rounded-[36px]"></div>
                        </div>
                        <div className="p-6 md:p-8 pt-10 flex flex-col flex-1 space-y-4">
                           <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                           <div className="h-8 w-full bg-slate-100 rounded-2xl"></div>
                           <div className="h-3 w-3/4 bg-slate-50 rounded-full"></div>
                           <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col items-center space-y-4">
                              <div className="h-10 w-24 bg-slate-100 rounded-full"></div>
                              <div className="h-14 w-full bg-slate-100 rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : `;

if (content.includes(oldGridStart) && !content.includes('isLoadingPartners ?')) {
    // Use a regex to find the grid start and the following mapping check
    const regex = new RegExp(oldGridStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{\\s*filteredPartners\\.length', 's');
    content = content.replace(regex, oldGridStart + skeletonLoader + 'filteredPartners.length');
}

fs.writeFileSync(path, content);
console.log("MemberDashboard loading state refinement applied!");
