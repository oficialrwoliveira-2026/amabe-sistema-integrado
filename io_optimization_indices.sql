-- ===============================================
-- OTIMIZAÇÃO DE I/O DE DISCO (ÍNDICES DE BUSCA)
-- ===============================================

-- 1. Índices para buscas rápidas por nome (Melhora busca de perfis)
CREATE INDEX IF NOT EXISTS idx_profiles_name_surname ON public.profiles (name, surname);

-- 2. Índices de ordenação (Evita scans de disco para ordenar tabelas)
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments (due_date DESC);
CREATE INDEX IF NOT EXISTS idx_benefit_usage_date ON public.benefit_usage (date DESC);

-- 3. Índices por Status (Acelera filtros de Dashboards)
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);

-- Manutenção do Banco: Analisar tabelas para recalcular planos de execução
ANALYZE public.profiles;
ANALYZE public.payments;
ANALYZE public.benefit_usage;
ANALYZE public.news;

-- NOTA: Estes índices reduzem drasticamente o custo de I/O pois o banco
-- encontra os dados usando as "páginas de índice" em vez de ler todas
-- as linhas da tabela no disco.
