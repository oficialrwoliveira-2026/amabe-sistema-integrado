-- ==========================================
-- SCRIPT DE OTIMIZAÇÃO DE PERFORMANCE AMABE
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Índices para busca de perfis (RLS e Listagens)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON public.profiles(name);

-- 2. Índices para Histórico de Uso (Vouchers)
-- Acelera o carregamento do histórico para membros e parceiros
CREATE INDEX IF NOT EXISTS idx_benefit_usage_member_id ON public.benefit_usage(member_id);
CREATE INDEX IF NOT EXISTS idx_benefit_usage_partner_id ON public.benefit_usage(partner_id);
CREATE INDEX IF NOT EXISTS idx_benefit_usage_date ON public.benefit_usage(date DESC);

-- 3. Índices para Pagamentos e Mensalidades
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON public.payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments(due_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 4. Otimização da Função de Admin (Cache de Sessão se possível)
-- A função EXISTS já é eficiente, mas o índice idx_profiles_role acima a tornará instantânea.
-- Verificando se há índices duplicados ou desnecessários
ANALYZE public.profiles;
ANALYZE public.benefit_usage;
ANALYZE public.payments;
