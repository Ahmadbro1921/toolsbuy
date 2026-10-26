import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSession } from "@/lib/supabase/store";
import { getAIProvider } from "@/lib/ai/factory";

export async function POST(request: NextRequest) {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { provider: providerName, apiKey, model } = body;

    const provider = getAIProvider(providerName, apiKey, model);
    const result = await provider.testConnection();

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Test failed.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
