export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONSULTANT = 'consultant',
  CLIENT = 'client',
  CONTRACTOR = 'contractor'
}

export interface ContractorProfile {
  useCases?: string[];
  clientTestimonials?: ClientTestimonial[];
  recentWork?: RecentWork[];
  portfolio?: PortfolioItem[];
}

export interface ClientTestimonial {
  id: string;
  clientName: string;
  clientCompany?: string;
  testimonial: string;
  rating: number;
  date?: Date;
}

export interface RecentWork {
  id: string;
  title: string;
  description: string;
  clientName?: string;
  completedDate?: Date;
  category?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  category?: string;
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  contractorProfile?: ContractorProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

