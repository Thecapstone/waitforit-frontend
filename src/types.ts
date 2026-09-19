export type Theme = 'light' | 'dark';

export interface AuthUser {
  id?: string;
  email: string;
  role?: 'user' | 'admin' | 'tester' | string;
  is_verified?: boolean;
  is_premium?: boolean;
}

export interface Subscription {
  plan_code: string;
  amount: number;
  currency: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired' | string;
  trial_ends_at?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  has_access: boolean;
}

export interface CapsuleSummary {
  id: string;
  title: string;
  description?: string;
  maturity_date: string;
  private: boolean;
  created_at: string;
  updated_at: string;
}

export type RoleType = 
  | 'Backend Engineer' 
  | 'Full Stack' 
  | 'Frontend' 
  | 'DevOps' 
  | 'Platform' 
  | 'Student' 
  | 'Other';

export interface WaitlistSubmission {
  id: string;
  name: string;
  email: string;
  is_developer: boolean;
  role?: RoleType | string;
  created_at: string;
  status: 'new' | 'contacted' | 'converted' | 'unsubscribed' | 'pending' | 'welcomed' | 'beta_invited' | 'archived';
  welcome_email_sent: boolean;
  welcome_email_sent_at?: string;
  source?: string;
}

export interface WaitlistApiResponse {
  success: boolean;
  message: string;
  duplicate?: boolean;
  data?: WaitlistSubmission;
}

export interface EmailDeliveryLog {
  id: string;
  subscriber_id: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body_rendered: string;
  status: 'queued' | 'rendering' | 'sent' | 'failed';
  sent_at: string;
  trigger_source: 'auto_pipeline' | 'manual_resend' | 'admin_batch';
}

export interface EmailTemplateConfig {
  subject: string;
  bodyTemplate: string;
  senderName: string;
  senderEmail: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name: 'waitlist_signup' | 'cta_click' | 'demo_play' | 'guide_visit' | 'page_view' | 'email_opened' | 'blog_read';
  page: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  total_visitors: number;
  total_signups: number;
  conversion_rate: number;
  developer_ratio: number;
  emails_sent: number;
  email_open_rate: number;
  top_role: string;
  cta_clicks: number;
  role_breakdown: Record<string, number>;
  daily_metrics: { date: string; visitors: number; signups: number; cta_clicks: number }[];
}

export type PageView = 
  | 'home' 
  | 'why-waitforit' 
  | 'how-it-works' 
  | 'features' 
  | 'developers' 
  | 'roadmap' 
  | 'blog' 
  | 'about' 
  | 'contact' 
  | 'login' 
  | 'integration-guide' 
  | 'terminal-authorize'
  | 'dashboard';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}
