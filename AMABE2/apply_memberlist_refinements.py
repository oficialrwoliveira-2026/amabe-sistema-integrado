import re
import os

file_path = r'e:\SISTEMAS\AMABE\amabe---sistema-integrado-de-gestão\components\admin\MemberList.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Header Container: p-10 -> p-6 md:p-10, rounded-48 -> rounded-32 md:rounded-48, flex-col on mobile
content = re.sub(
    r'<div className="flex items-center justify-between glass-card-light p-10 rounded-\[48px\] (border-white/40 shadow-sm relative overflow-hidden group)">',
    r'<div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[48px] \1">',
    content
)

# 2. Title Typography: text-3xl -> text-2xl md:text-3xl
content = re.sub(
    r'<h2 className="text-3xl font-bold text-slate-800 tracking-tighter uppercase italic">Gestão de Associados</h2>',
    r'<h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Gestão de Associados</h2>',
    content
)

# 3. Search/Action Container: flex-col on mobile, gap space
content = re.sub(
    r'<div className="flex gap-4 relative z-10">',
    r'<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10 mt-6 md:mt-0">',
    content
)

# 4. Search Input: w-80 -> w-full md:w-80
content = re.sub(
    r'<div className="relative group/search w-80">',
    r'<div className="relative group/search w-full md:w-80">',
    content
)

# 5. Novo Membro Button: w-full md:w-auto, justify-center
content = re.sub(
    r'<button\s+onClick=\{([^}]+)\}\s+className="px-8 py-5 bg-\[#0F172A\] text-white rounded-\[28px\] font-bold uppercase text-\[10px\] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-3"',
    r'<button onClick={\1} className="w-full md:w-auto px-8 py-5 bg-[#0F172A] text-white rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"',
    content
)

# 6. Card Internal Padding: p-10 -> p-6 md:p-10
content = re.sub(
    r'<div className="p-10 flex-1 relative z-10">',
    r'<div className="p-6 md:p-10 flex-1 relative z-10">',
    content
)

# 7. Card Image Size: reduced slightly on mobile? 
# w-20 h-20 is 80px. Let's keep it for now but maybe rounded-32 is a bit much if padding is reduced.
# Let's adjust avatar border-radius slightly for smaller screens
content = re.sub(
    r'className="w-20 h-20 rounded-\[32px\]',
    r'className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px]',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied responsive refinements to MemberList.tsx using regex.")
