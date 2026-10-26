import { EmailAdapter, EmailDeliveryResult, SendEmailOptions } from "./types";

export class ResendAdapter implements EmailAdapter {
  name = "resend";
  private apiKey: string;
  private fromAddress: string;

  constructor(apiKey?: string, fromAddress?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY || "";
    this.fromAddress = fromAddress || process.env.EMAIL_FROM_ADDRESS || "AI Hub <onboarding@resend.dev>";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().startsWith("re_"));
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { success: false, message: "Resend API key is not configured or missing 're_' prefix." };
    }

    try {
      const response = await fetch("https://api.resend.com/api-keys", {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        return { success: false, message: `Resend returned HTTP ${response.status}: ${response.statusText}` };
      }

      return { success: true, message: "Connected to Resend email provider successfully." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Resend connection failed: ${msg}` };
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        success: false,
        provider: "resend",
        error: "Resend API key not configured.",
        timestamp,
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: this.fromAddress,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          provider: "resend",
          error: data?.message || `HTTP ${response.status} ${response.statusText}`,
          timestamp,
        };
      }

      return {
        success: true,
        provider: "resend",
        messageId: data?.id,
        timestamp,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: "resend",
        error: msg,
        timestamp,
      };
    }
  }
}
