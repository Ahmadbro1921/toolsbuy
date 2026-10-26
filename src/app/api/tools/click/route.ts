import { NextRequest, NextResponse } from "next/server";
import { getToolById, recordToolClick, getCurrentUserSession } from "@/lib/supabase/store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateSafeUrl } from "@/lib/security/ssrf";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get("id");
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limiting to prevent click abuse (max 40 clicks per minute per IP)
  const rateLimit = checkRateLimit(`click_${ip}`, 40, 60000);
  if (!rateLimit.success) {
    return new NextResponse("Too many requests. Please slow down.", { status: 429 });
  }

  if (!toolId) {
    return NextResponse.redirect(new URL("/tools", request.url));
  }

  const tool = await getToolById(toolId);
  if (!tool) {
    return NextResponse.redirect(new URL("/tools", request.url));
  }

  // Validate destination URL safety
  const safeCheck = validateSafeUrl(tool.official_url);
  if (!safeCheck.isValid) {
    return new NextResponse("Target URL restricted by security policy.", { status: 400 });
  }

  // Record click event server-side
  const session = await getCurrentUserSession();
  await recordToolClick(tool.id, session?.id);

  // Return redirect to official external website
  return NextResponse.redirect(tool.official_url, { status: 302 });
}
