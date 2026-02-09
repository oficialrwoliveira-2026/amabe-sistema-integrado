import re
import os

file_path = r'e:\SISTEMAS\AMABE\amabe---sistema-integrado-de-gestão\components\admin\MemberList.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Button (it has w-full md:w-auto px-8 py-5 ... flex items-center justify-center gap-3)
# It seems the previous script missed the button because of the multi-line structure.
# I will target the className string directly.

target_class = 'px-8 py-5 bg-[#0F172A] text-white rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-3'
replacement_class = 'w-full md:w-auto px-8 py-5 bg-[#0F172A] text-white rounded-[28px] font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3'

content = content.replace(target_class, replacement_class)

# Fix Card Internal Padding: p-10 -> p-6 md:p-10 (line 61)
content = content.replace('<div className="p-10 flex-1 relative z-10">', '<div className="p-6 md:p-10 flex-1 relative z-10">')

# Fix Avatar size (line 65)
# Already tried in previous script, let's verify if it worked.
# It was: r'className="w-20 h-20 rounded-\[32px\]'
# In line 67: className="w-20 h-20 rounded-[32px] object-cover border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500"
# Re-applying a more robust one.

content = re.sub(
    r'className="w-20 h-20 rounded-\[32px\] (object-cover border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500)"',
    r'className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] \1"',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied corrected responsive refinements to MemberList.tsx.")
