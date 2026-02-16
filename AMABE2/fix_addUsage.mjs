import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldAddUsage = `  const addUsage = async (usage: BenefitUsage) => {
    try {
      // Tentar inserir com todos os campos (novas colunas)
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
        status: usage.status || 'VALIDADO',
        date: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) {
        console.warn('Erro ao registrar uso (tentando fallback):', error);
        // Fallback: Inserir apenas campos básicos se as novas colunas não existirem
        const { error: fallbackError } = await supabase.from('benefit_usage').insert({
          member_id: usage.memberId,
          member_name: usage.memberName,
          beneficiary_name: usage.beneficiaryName,
          beneficiary_id: usage.beneficiaryId,
          partner_id: usage.partnerId || user?.id,
          partner_name: usage.partnerName,
          date: new Date().toISOString()
        });
        if (fallbackError) throw fallbackError;
      }

      // Atualização local do histórico para economizar I/O
      setHistory(prev => [{
        ...usage,
        id: usage.id || \`VCH-\${Math.random().toString(36).substring(2, 9).toUpperCase()}\`,
        status: 'VALIDADO',
        date: new Date().toISOString()
      }, ...prev].slice(0, 100)); // Mantém cache limitado

      showAlert('Sucesso', 'Benefício validado!', 'success');
    } catch (err: any) {
      console.error('Erro ao adicionar uso:', err);
      showAlert('Erro ao Validar', 'Não foi possível registrar o uso.', 'error');
    }
  };`;

const newAddUsage = `  const addUsage = async (usage: BenefitUsage) => {
    console.log('Validando benefício:', usage.id || 'novo');
    try {
      const now = new Date().toISOString();
      const status = usage.status || 'VALIDADO';
      
      // 1. Tentar persistência no Supabase
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
        console.warn('Erro no upsert (tentando insert simples):', error);
        const { error: insertError } = await supabase.from('benefit_usage').insert({
          member_id: usage.memberId,
          member_name: usage.memberName,
          beneficiary_name: usage.beneficiaryName,
          beneficiary_id: usage.beneficiaryId,
          partner_id: usage.partnerId || user?.id,
          partner_name: usage.partnerName,
          status: status,
          date: now
        });
        if (insertError) throw insertError;
      }

      // 2. Atualização Atômica do Estado Local (Sync Instantâneo)
      setHistory(prev => {
        const usageId = usage.id;
        const index = prev.findIndex(h => h.id === usageId);
        
        if (index !== -1 && usageId) {
          // Substituir entrada existente para refletir a mudança de status (ex: GERADO -> VALIDADO)
          const updatedHistory = [...prev];
          updatedHistory[index] = {
            ...updatedHistory[index],
            ...usage,
            status: status,
            date: now
          };
          console.log('Histórico local atualizado (ID existente)');
          return updatedHistory;
        } else {
          // Prepend novo se não existir
          console.log('Histórico local: Adicionando novo registro');
          return [{
            ...usage,
            id: usageId || \`VCH-\${Math.random().toString(36).substring(2, 9).toUpperCase()}\`,
            status: status,
            date: now
          }, ...prev].slice(0, 100);
        }
      });

      showAlert('Sucesso', 'Benefício validado com sucesso!', 'success');
      
      // 3. Forçar atualização do perfil se for o próprio usuário (opcional, para garantir cache)
      if (user && user.id === usage.memberId) {
        fetchPrivateData();
      }
      
    } catch (err: any) {
      console.error('Erro crítico ao validar uso:', err);
      showAlert('Erro ao Validar', err.message || 'Não foi possível registrar o uso.', 'error');
    }
  };`;

if (content.includes(oldAddUsage.trim())) {
    content = content.replace(oldAddUsage.trim(), newAddUsage.trim());
    console.log("addUsage function updated successfully!");
} else {
    console.error("Could not find the exact addUsage function block.");
    // Try a more flexible replacement if exact match fails
}

fs.writeFileSync(path, content);
