export type AccountStatus = 'active' | 'pending' | 'suspended';
export type UserRole = 'admin' | 'user';
export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial' | 'Open Source';
export type IntegrationMode = 'external_link' | 'oauth' | 'api' | 'extension';
export type OrderStatus = 'pending' | 'verified' | 'rejected' | 'cancelled';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'access_issue' | 'payment_issue' | 'tool_request' | 'general';
export type PaymentMethod = 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'usdt';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  account_status: AccountStatus;
  phone?: string;
  referral_code?: string;
  referred_by?: string;
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
  price_pkr?: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  integration_mode: IntegrationMode;
  external_account_required: boolean;
  features: string[];
  use_cases?: string[];
  useCases?: string[];
  access_instructions?: string;
  access_credentials?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  favorite_count?: number;
  click_count?: number;
  is_favorited?: boolean;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  description: string;
  price_pkr: number;
  price_usd?: number;
  duration_days: number;
  is_active: boolean;
  is_popular?: boolean;
  tools_included: string[]; // Tool names or IDs
  features: string[];
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price_pkr: number;
}

export interface Order {
  id: string;
  order_number: string; // e.g. ORD-9821
  user_id: string;
  user_email: string;
  customer_name: string;
  customer_phone: string;
  type: 'package' | 'custom';
  package_id?: string;
  package_name?: string;
  custom_tools?: OrderItem[];
  total_amount_pkr: number;
  currency: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  payment_proof_note?: string;
  status: OrderStatus;
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  user_email: string;
  order_id?: string;
  package_name: string;
  tools_included: string[]; // Names or IDs of accessible tools
  status: SubscriptionStatus;
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  sender_name: string;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string; // e.g. TCK-4102
  user_id: string;
  user_email: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface ReferralRecord {
  id: string;
  referrer_user_id: string;
  referrer_email: string;
  referred_user_id: string;
  referred_email: string;
  referral_code: string;
  status: 'registered' | 'converted';
  commission_pkr: number;
  created_at: string;
}

export interface PaymentAccountConfig {
  bank_name: string;
  account_title: string;
  account_number: string;
  iban?: string;
  easypaisa_title: string;
  easypaisa_number: string;
  jazzcash_title: string;
  jazzcash_number: string;
  usdt_address?: string;
}

export interface SiteSettings {
  branding: {
    name: string;
    tagline: string;
    description: string;
    logo_url?: string;
    whatsapp_number: string;
    announcement_banner?: string;
  };
  payments: PaymentAccountConfig;
  features: {
    allowRegistration: boolean;
    requireManualApproval: boolean;
    enableReferrals: boolean;
    enableCustomBundles: boolean;
    maintenanceMode: boolean;
    showAffiliateDisclosures?: boolean;
    enableReviews?: boolean;
  };
  contact: {
    email: string;
    adminNotificationEmail: string;
    phone: string;
    whatsapp: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage?: string;
  };
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
  phone?: string;
  referral_code?: string;
}

export interface ActivationRequest {
  id: string;
  user_id: string;
  user_email: string;
  display_name?: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

