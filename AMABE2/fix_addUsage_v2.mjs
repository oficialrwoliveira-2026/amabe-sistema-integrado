import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const addUsage = async \(usage: BenefitUsage\) => \{[\s\S]*?showAlert\('Sucesso', 'Benefício validado!', 'success'\);[\s\S]*?\};/;

const newImplementation = `const addUsage = async (usage: BenefitUsage) => {
    console.log('Syncing benefit validation:', usage.id || 'new');
    try {
      const now = new Date().toISOString();
      const status = usage.status || 'VALIDADO';
      
      // 1. Database Persistence via Upsert (handles both new and updates)
      const { error } = await supabase.from('benefit_usage').upsert({
        id: usage.id,
        member_id: usage.memberId,
        member_name: usage.memberName,
        beneficiary_name: usage.beneficiaryName,
        beneficiary_id: usage.beneficiaryId,
        partner_id: usage.partnerId || user?.id,
        partner_name: usage.partnerName,
        offer_title: usage.offerTitle,
        offer_discount: usage.offerDiscount,
        status: status,
        date: now
      }, { onConflict: 'id' });

      if (error) {
        console.warn('Upsert fallback to insert:', error);
        const { error: insError } = await supabase.from('benefit_usage').insert({
          member_id: usage.memberId,
          member_name: usage.memberName,
          beneficiary_name: usage.beneficiaryName,
          beneficiary_id: usage.beneficiaryId,
          partner_id: usage.partnerId || user?.id,
          partner_name: usage.partnerName,
          status: status,
          date: now
        });
        if (insError) throw insError;
      }

      // 2. Atomic UI State Update
      setHistory(prev => {
        const usageId = usage.id;
        // Check if item exists in local state
        const exists = usageId ? prev.some(h => h.id === usageId) : false;
        
        if (exists) {
          // Replace exactly the matching item to update status properly
          console.log('Updating existing local usage item:', usageId);
          return prev.map(h => h.id === usageId ? { ...h, ...usage, status, date: now } : h);
        } else {
          // Add as new at the top
          console.log('Adding new usage item to local state');
          return [{
            ...usage,
            id: usageId || \`VCH-\${Math.random().toString(36).substring(2, 9).toUpperCase()}\`,
            status: status,
            date: now
          }, ...prev].slice(0, 100);
        }
      });

      showAlert('Sucesso', 'Benefício validado!', 'success');
      
      // Auto-refresh profile if the member is viewing their own history
      if (user && user.id === usage.memberId) {
        fetchPrivateData();
      }
    } catch (err: any) {
      console.error('Critical failure in addUsage:', err);
      showAlert('Erro ao Validar', 'Falha ao processar validação. Verifique sua conexão.', 'error');
    }
  };`;

if (regex.test(content)) {
    content = content.replace(regex, newImplementation);
    console.log("addUsage fixed with regex!");
} else {
    console.error("Regex match failed. Investigating contents...");
    // Fallback logic
}

fs.writeFileSync(path, content);
