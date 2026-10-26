import { EmailAdapter } from "./types";
import { ResendAdapter } from "./resend";
import { MockEmailAdapter } from "./mock";

export function getEmailProvider(overrideProvider?: string, apiKey?: string, fromAddress?: string): EmailAdapter {
  const provider = (overrideProvider || process.env.EMAIL_PROVIDER || "mock").toLowerCase();

  if (provider === "resend") {
    return new ResendAdapter(apiKey, fromAddress);
  }

  return new MockEmailAdapter();
}
