import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSession, toggleFavorite } from "@/lib/supabase/store";

export async function POST(request: NextRequest) {
  const session = await getCurrentUserSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required to favorite tools." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json({ error: "Missing toolId." }, { status: 400 });
    }

    const result = await toggleFavorite(session.id, toolId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
