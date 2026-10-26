export type EmailType =
  | "registration_welcome"
  | "activation_request_admin"
  | "account_approved"
  | "account_suspended"
  | "password_reset";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
  timestamp: string;
}

export interface EmailAdapter {
  name: string;
  sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult>;
  testConnection(): Promise<{ success: boolean; message: string }>;
  isConfigured(): boolean;
}
