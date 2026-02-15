
import { UserRole, MemberStatus, User, Partner, BenefitUsage, Payment, PaymentStatus, NewsItem } from './types';

export const CATEGORIES = [
  'Alimentação',
  'Saúde',
  'Educação',
  'Lazer',
  'Serviços',
  'Bem-estar',
  'Moda',
  'Tecnologia',
  'Automotivo'
];

export const DEFAULT_COMPANY_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtYnVpbGRpbmctMiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiB4PSI0IiB5PSIyIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNOSAyMnYtNGg2djQiLz48cGF0aCBkPSJNOCA2aC4wMSIvPjxwYXRoIGQ9Ik0xNiA2aC4wMSIvPjxwYXRoIGQ9Ik04IDEwaC4wMSIvPjxwYXRoIGQ9Ik0xNiAxMGguMDEiLz48cGF0aCBkPSJNOCAxNGguMDEiLz48cGF0aCBkPSJNMTYgMTRoLjAxIvjxwYXRoIGQ9Ik04IDE4aC4wMSIvPjxwYXRoIGQ9Ik0xNiAxOGguMDEiLz48L3N2Zz4=';

export const PARA_CITIES = [
  { name: 'Belém', x: 740, y: 120 },
  { name: 'Ananindeua', x: 760, y: 130 },
  { name: 'Santarém', x: 380, y: 280 },
  { name: 'Marabá', x: 720, y: 550 },
  { name: 'Castanhal', x: 800, y: 140 },
  { name: 'Parauapebas', x: 680, y: 620 },
  { name: 'Abaetetuba', x: 700, y: 180 },
  { name: 'Altamira', x: 450, y: 450 },
  { name: 'Tucuruí', x: 650, y: 420 },
  { name: 'Itaituba', x: 280, y: 480 },
  { name: 'Paragominas', x: 820, y: 320 },
  { name: 'Barcarena', x: 710, y: 150 },
  { name: 'Capanema', x: 860, y: 120 },
  { name: 'Bragança', x: 880, y: 100 },
  { name: 'Marituba', x: 770, y: 135 },
  { name: 'Redenção', x: 700, y: 780 }
];

const today = new Date();
const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin AMABE',
    email: 'admin@amabe.org',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200',
    birthDate: '1985-05-20',
    loginCount: 142
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@email.com',
    role: UserRole.MEMBER,
    memberId: 'AMB-2024-001',
    status: MemberStatus.ACTIVE,
    validUntil: '2025-12-31',
    avatar: 'https://picsum.photos/seed/joao/200',
    birthDate: todayFormatted,
    loginCount: 85,
    dependents: [
      {
        id: 'd1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        role: UserRole.MEMBER,
        relationship: 'Filha',
        avatar: 'https://picsum.photos/seed/maria/200',
        birthDate: '2015-10-12',
        loginCount: 12
      }
    ]
  },
  {
    id: '3',
    name: 'Restaurante Sabor Real',
    email: 'contato@saborreal.com',
    role: UserRole.PARTNER,
    companyName: 'Sabor Real Ltda',
    avatar: 'https://picsum.photos/seed/sabor/200',
    loginCount: 210
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', memberId: 'AMB-2024-001', memberName: 'João Silva', amount: 89.90, dueDate: '2024-05-10', paidDate: '2024-05-09', status: PaymentStatus.PAID, method: 'Pix', type: 'Mensalidade' },
  { id: 'pay2', memberId: 'AMB-2024-001', memberName: 'João Silva', amount: 89.90, dueDate: '2024-06-10', status: PaymentStatus.PENDING, type: 'Mensalidade' },
  { id: 'pay3', memberId: 'AMB-2024-002', memberName: 'Ana Oliveira', amount: 89.90, dueDate: '2024-04-10', status: PaymentStatus.OVERDUE, type: 'Mensalidade' }
];

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Academia FitLife',
    category: 'Bem-estar',
    discount: '20% OFF na mensalidade',
    description: 'Academia completa com musculação e aulas coletivas.',
    rules: 'Válido para planos anuais. Necessário apresentar carteirinha ativa.',
    logo: 'https://picsum.photos/seed/gym/100',
    email: 'academia@fitlife.com',
    status: 'ACTIVE',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    phone: '(11) 3222-1234',
    whatsapp: '11999998888',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
    ],
    offers: [
      { id: 'o1', title: 'Avaliação Física Grátis', discount: '100% OFF', description: 'Avaliação completa para novos membros.', rules: 'Válido no primeiro mês.', expiryDate: '2025-12-31', isActive: true },
      { id: 'o2', title: 'Kit Boas-vindas', discount: 'Brinde Especial', description: 'Ganhe uma squeeze exclusiva.', rules: 'Ao fechar plano anual.', expiryDate: '2025-12-31', isActive: true }
    ]
  },
  {
    id: 'p2',
    name: 'Restaurante Sabor Real',
    category: 'Alimentação',
    discount: '15% de desconto',
    description: 'Comida caseira de alta qualidade no centro da cidade.',
    rules: 'Exceto bebidas e sobremesas. Válido de segunda a sexta.',
    logo: 'https://picsum.photos/seed/food/100',
    email: 'contato@saborreal.com',
    status: 'ACTIVE',
    address: 'Rua das Flores, 450 - Centro',
    phone: '(11) 4002-8922',
    whatsapp: '11988887777',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
    ],
    offers: [
      { id: 'o3', title: 'Sobremesa Grátis', discount: 'CORTESIA', description: 'Ganhe um petit gateau após o prato principal.', rules: 'Válido apenas jantar.', expiryDate: '2025-06-30', isActive: true }
    ]
  },
  {
    id: 'p3',
    name: 'Clínica Saúde Total',
    category: 'Saúde',
    discount: '30% em consultas',
    description: 'Atendimento multidisciplinar e exames laboratoriais.',
    rules: 'Agendamento prévio necessário.',
    logo: 'https://picsum.photos/seed/health/100',
    email: 'saude@total.com',
    status: 'ACTIVE',
    address: 'Alameda Santos, 120 - Jardins',
    phone: '(11) 2233-4455',
    whatsapp: '11977776666',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'p4',
    name: 'Escola de Idiomas Global',
    category: 'Educação',
    discount: 'Isenção de Matrícula + 10%',
    description: 'Cursos de Inglês, Espanhol e Francês.',
    rules: 'Válido para novos alunos.',
    logo: 'https://picsum.photos/seed/lang/100',
    email: 'global@idiomas.com',
    status: 'PENDING',
    address: 'Rua Augusta, 2200',
    phone: '(11) 3344-5566',
    whatsapp: '11966665555'
  }
];

export const MOCK_HISTORY: BenefitUsage[] = [
  { id: 'h2', memberId: 'AMB-2024-001', memberName: 'João Silva', beneficiaryName: 'João Silva', beneficiaryId: 'AMB-2024-001', partnerName: 'Academia FitLife', date: '2024-05-12 08:00', status: 'VALIDADO' }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Novo Convênio Odontológico para Membros Elite',
    excerpt: 'A partir de agora, membros da categoria Elite contam com cobertura total em limpezas e consultas preventivas acompanhadas dos melhores profissionais.',
    date: '20 Jan 2024',
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    showInBanner: true
  },
  {
    id: '2',
    title: 'Inauguração da Nova Unidade em São Paulo',
    excerpt: 'Venha conhecer o novo espaço coworking exclusivo para associados AMABE no coração da Av. Paulista, com toda infraestrutura necessária.',
    date: '18 Jan 2024',
    category: 'Evento',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    showInBanner: false
  },
  {
    id: '3',
    title: 'Dicas para Maximizar seus Benefícios de Cashback',
    excerpt: 'Aprenda a utilizar os novos cupons de desconto acumulativos nas redes de farmácias parceiras e economize ainda mais este mês.',
    date: '15 Jan 2024',
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    showInBanner: false
  }
];
