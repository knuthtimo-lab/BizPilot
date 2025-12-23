
export enum View {
  DASHBOARD = 'dashboard',
  FINANCES = 'finances',
  OPTIMIZATION = 'optimization',
  HIRING = 'hiring',
  SETTINGS = 'settings'
}

export type Currency = 'EUR' | 'USD';

export interface Invoice {
  id: string;
  vendorName: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  status: 'pending' | 'approved';
  imageUrl?: string;
}

export interface Subscription {
  id: string;
  vendorName: string;
  monthlyCost: number;
  renewalDate: string;
  isFlagged: boolean;
  reason?: string;
  status?: 'active' | 'optimizing' | 'completed';
}

export interface OptimizationTask {
  id: string;
  vendorName: string;
  reason: string;
  estimatedSaving: number;
  action: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: string;
}

export interface JobPosting {
  id: string;
  title: string;
  seniority: string;
  skills: string[];
  content: string;
  interviewQuestions: string[];
  createdAt: string;
}

export interface UserProfile {
  companyName: string;
  industry: string;
  currency: string;
  userName: string;
}
