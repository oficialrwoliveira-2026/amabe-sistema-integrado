-- ===============================================
-- CORREÇÃO DEFINITIVA DE PERMISSÕES (NEWS/ALERTS)
-- ===============================================

-- 1. Garantir que a tabela NEWS permita inserções para Admins
DROP POLICY IF EXISTS "Gestão de notícias por admins" ON public.news;

CREATE POLICY "Gestão de notícias por admins" ON public.news 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND UPPER(profiles.role) = 'ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND UPPER(profiles.role) = 'ADMIN'
        )
    );

-- 2. Aplicar a mesma lógica para NOTIFICAÇÕES (Alertas)
DROP POLICY IF EXISTS "Gestão de alertas por admins" ON public.system_notifications;

CREATE POLICY "Gestão de alertas por admins" ON public.system_notifications 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND UPPER(profiles.role) = 'ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND UPPER(profiles.role) = 'ADMIN'
        )
    );

-- 3. Resetar a função is_admin() para ser ultra-segura
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND UPPER(role) = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Rodar um "Grant" básico para garantir acesso à tabela
GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.system_notifications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- NOTA: Se o erro persistir, verifique se seu e-mail no Supabase está 
-- realmente com a coluna 'role' como 'ADMIN' (em maiúsculo).
