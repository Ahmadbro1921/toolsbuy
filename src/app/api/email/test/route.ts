import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSession } from "@/lib/supabase/store";
import { getEmailProvider } from "@/lib/email/factory";

export async function POST(request: NextRequest) {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { provider: providerName, apiKey, fromAddress, to } = body;

    const emailService = getEmailProvider(providerName, apiKey, fromAddress);

    if (to) {
      // Send actual test ping
      const delivery = await emailService.sendEmail({
        to,
        subject: "[AI Hub] Test Email Verification",
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: white; border-radius: 8px;">
            <h2>AI Hub Email Provider Connected</h2>
            <p>This is a test notification confirming your transactional email settings are functional.</p>
            <p style="color: #94a3b8; font-size: 13px;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        `,
      });
      return NextResponse.json(delivery);
    }

    const testConn = await emailService.testConnection();
    return NextResponse.json(testConn);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Test failed.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
