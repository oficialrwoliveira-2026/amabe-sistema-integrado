-- ==========================================
-- SCRIPT DE CONFIGURAÇÕES DO SISTEMA
-- Execute este script no SQL Editor do Supabase
-- ==========================================

CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    name TEXT DEFAULT 'AMABE',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#ff6b00',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Inserir dados iniciais se não existirem
INSERT INTO public.system_settings (id, name, primary_color)
VALUES ('global', 'AMABE', '#ff6b00')
ON CONFLICT (id) DO NOTHING;

-- Garantir que a tabela tenha RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Leitura pública de configurações" ON public.system_settings
    FOR SELECT USING (true);

CREATE POLICY "Apenas administradores podem atualizar configurações" ON public.system_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );
