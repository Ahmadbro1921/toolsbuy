export type AccountStatus = 'active' | 'pending' | 'suspended';
export type UserRole = 'admin' | 'user';
export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial' | 'Open Source';
export type IntegrationMode = 'external_link' | 'oauth' | 'api';
export type ActivationRequestStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface UserRoleRecord {
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
  tool_count?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  official_url: string;
  category_id: string;
  pricing_type: PricingType;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  integration_mode: IntegrationMode;
  external_account_required: boolean;
  features: string[];
  use_cases?: string[];
  useCases?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  favorite_count?: number;
  click_count?: number;
  is_favorited?: boolean;
}

export interface Favorite {
  user_id: string;
  tool_id: string;
  created_at: string;
  tool?: Tool;
}

export interface ToolUsageEvent {
  id: string;
  tool_id: string;
  user_id?: string | null;
  event_type: 'click' | 'outbound' | 'favorite';
  created_at: string;
  tool?: Tool;
}

export interface ActivationRequest {
  id: string;
  user_id: string;
  status: ActivationRequestStatus;
  note?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  user_email?: string;
  display_name?: string;
}

export interface SiteSettings {
  branding: {
    name: string;
    tagline: string;
    description: string;
    logo_url?: string;
  };
  features: {
    allowRegistration: boolean;
    requireManualApproval: boolean;
    enableReviews: boolean;
    showAffiliateDisclosures: boolean;
    maintenanceMode: boolean;
  };
  contact: {
    email: string;
    adminNotificationEmail: string;
    twitter?: string;
    github?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage?: string;
  };
}

export interface IntegrationStatus {
  provider: string;
  status: 'configured' | 'unconfigured' | 'error';
  last_checked_at?: string;
  error_summary?: string | null;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string | null;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, unknown>;
  created_at: string;
  actor_email?: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  account_status: AccountStatus;
  display_name: string;
}
