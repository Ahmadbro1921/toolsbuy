import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSession } from "@/lib/supabase/store";
import { getAIProvider } from "@/lib/ai/factory";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateSafeUrl } from "@/lib/security/ssrf";

export async function POST(request: NextRequest) {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Administrator access required." }, { status: 403 });
  }

  // Rate limit: max 15 AI requests per minute per admin
  const rateLimit = checkRateLimit(`ai_gen_${session.id}`, 15, 60000);
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Rate limit reached for AI generation. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { toolName, websiteUrl, categoryHint, rawText } = body;

    if (!toolName || !websiteUrl) {
      return NextResponse.json({ error: "toolName and websiteUrl are required." }, { status: 400 });
    }

    // SSRF Check on websiteUrl
    const urlCheck = validateSafeUrl(websiteUrl);
    if (!urlCheck.isValid) {
      return NextResponse.json({ error: `Website URL rejected: ${urlCheck.reason}` }, { status: 400 });
    }

    const provider = getAIProvider();

    // If live API key is not configured and not in mock mode, return honest unconfigured state
    if (!provider.isConfigured() && provider.name !== "mock") {
      return NextResponse.json({
        isConfigured: false,
        message: "AI Provider API key is not configured. Please add an API key in Admin Settings or .env.local.",
      }, { status: 503 });
    }

    const metadata = await provider.generateToolMetadata({
      toolName,
      websiteUrl,
      categoryHint,
      rawText,
    });

    return NextResponse.json({
      success: true,
      provider: provider.name,
      metadata,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI generation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
