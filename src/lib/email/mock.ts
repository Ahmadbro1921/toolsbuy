import { EmailAdapter, EmailDeliveryResult, SendEmailOptions } from "./types";

export class MockEmailAdapter implements EmailAdapter {
  name = "mock";

  isConfigured(): boolean {
    return true;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: "Mock Email Provider active (Messages logged safely to server console).",
    };
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    const timestamp = new Date().toISOString();
    const fakeId = `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    console.log(`\n================================================================`);
    console.log(`[AI HUB EMAIL LOGGER] Mode: MOCK / DEVELOPMENT`);
    console.log(`Time: ${timestamp}`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`----------------------------------------------------------------`);
    console.log(options.text || options.html.replace(/<[^>]*>?/gm, " ").slice(0, 300) + "...");
    console.log(`================================================================\n`);

    return {
      success: true,
      provider: "mock",
      messageId: fakeId,
      timestamp,
    };
  }
}
