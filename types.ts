
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  PARTNER = 'PARTNER'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: 'Pix' | 'Cartão' | 'Boleto';
  type: string;
  month?: number; // 1-12
  year?: number;
  updatedBy?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  createdAt?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  memberId?: string;
  status?: MemberStatus;
  validUntil?: string;
  companyName?: string;
  whatsapp?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  address?: string;
  cpf?: string;
  rg?: string;
  surname?: string;
  birthDate?: string;
  simRegistry?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
  relationship?: 'Filho' | 'Filha' | 'Master';
  dependents?: User[];
  loginCount?: number;
  password?: string;
  mustChangePassword?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  description: string;
  rules: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  category: string;
  discount: string;
  description: string;
  rules: string;
  logo: string;
  status: 'PENDING' | 'ACTIVE';
  address: string;
  city?: string;
  phone?: string;
  whatsapp: string;
  cnpj?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  gallery?: string[];
  offers?: Offer[];
  companyName?: string;
  password?: string;
  mustChangePassword?: boolean;
}

export interface BenefitUsage {
  id: string;
  memberId: string;
  memberName: string;
  beneficiaryName: string;
  beneficiaryId: string;
  partnerId?: string;
  partnerName: string;
  date: string;
  value?: number;
  offerTitle?: string;
  offerDiscount?: string;
  code?: string;
  status: 'GERADO' | 'VALIDADO';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  image: string;
  image_url?: string; // Para compatibilidade com Supabase
  is_active?: boolean;
  isFeatured: boolean;
  showInBanner: boolean;
  link?: string;
  author?: string;
  viewedBy?: string[];
  viewed_by?: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  image?: string;
  image_url?: string;
  isActive: boolean;
  is_active?: boolean;
  date: string;
  viewedBy?: string[];
  viewed_by?: string[];
  createdBy?: string;
  created_by?: string;
}

export interface SystemSettings {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  updated_at?: string;
}

export type DashboardTab = 'dash' | 'members' | 'partners' | 'history' | 'card' | 'club' | 'validate' | 'offers' | 'profile' | 'payments' | 'news' | 'settings';
