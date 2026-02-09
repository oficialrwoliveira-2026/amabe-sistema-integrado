-- ==========================================
-- SCRIPT DE CRIAÇÃO DO BANCO AMABE
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 0. Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Perfis de Usuário (Importante: Referencia auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  whatsapp TEXT,
  cpf TEXT UNIQUE,
  rg TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  birth_date DATE,
  sim_registry TEXT,
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  website TEXT,
  member_id TEXT,
  role TEXT DEFAULT 'MEMBER', -- 'ADMIN', 'MEMBER', 'PARTNER'
  status TEXT DEFAULT 'PENDING', -- 'ACTIVE', 'INACTIVE', 'PENDING'
  company_name TEXT,
  valid_until DATE,
  dependents JSONB DEFAULT '[]',
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT,
  discount TEXT,
  rules TEXT,
  description TEXT,
  gallery TEXT[] DEFAULT '{}',
  offers JSONB DEFAULT '[]'
);

-- 2. Notícias
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  image_url TEXT,
  date TEXT, -- Compatível com ISO String do front-end
  is_featured BOOLEAN DEFAULT FALSE,
  show_in_banner BOOLEAN DEFAULT FALSE,
  viewed_by JSONB DEFAULT '[]',
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notificações do Sistema (Alertas Globais)
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  viewed_by JSONB DEFAULT '[]',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  member_id UUID NOT NULL,
  member_name TEXT,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'PENDING',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  type TEXT DEFAULT 'Mensalidade',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Histórico de Uso
CREATE TABLE IF NOT EXISTS public.benefit_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  member_id UUID,
  member_name TEXT,
  beneficiary_name TEXT,
  beneficiary_id TEXT,
  partner_id UUID,
  partner_name TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ==========================================
-- FUNÇÕES AUXILIARES
-- ==========================================

-- Função para verificar se o usuário é administrador sem causar recursão
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_usage ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para Perfis
CREATE POLICY "Leitura de perfis por usuários autenticados" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Administradores têm controle total sobre perfis" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_admin());

-- 2. Políticas para Outras Tabelas
CREATE POLICY "Leitura pública de notícias" ON public.news FOR SELECT USING (true);
CREATE POLICY "Gestão de notícias por admins" ON public.news FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Leitura pública de alertas" ON public.system_notifications FOR SELECT USING (true);
CREATE POLICY "Gestão de alertas por admins" ON public.system_notifications FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Acesso aos pagamentos" ON public.payments FOR ALL TO authenticated 
    USING (auth.uid() = member_id OR public.is_admin());

-- 3. Políticas para Histórico de Uso (Vouchers)
CREATE POLICY "Usuários podem ver seu próprio histórico de uso" ON public.benefit_usage
    FOR SELECT TO authenticated
    USING (auth.uid() = member_id OR auth.uid() = partner_id OR public.is_admin());

CREATE POLICY "Usuários podem registrar seu próprio uso" ON public.benefit_usage
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = member_id OR public.is_admin());

-- ==========================================
-- COMO ADICIONAR O ADMINISTRADOR
-- ==========================================
-- 1. Vá na aba 'Authentication' do Dashboard e crie um usuário (e-mail/senha).
-- 2. Copie o 'User ID' (UUID) desse usuário.
-- 3. Rode o comando abaixo no SQL Editor substituindo 'SEU_UUID' e 'SEU_EMAIL':

/*
INSERT INTO public.profiles (id, name, email, role, status)
VALUES ('SEU_UUID', 'Administrador', 'SEU_EMAIL', 'ADMIN', 'ACTIVE');
*/
