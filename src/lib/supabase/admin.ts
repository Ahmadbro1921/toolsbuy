import { createClient } from "@supabase/supabase-js";

/**
 * Service-role admin client for trusted server actions and migrations.
 * Never exposed to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const isLive = Boolean(
    supabaseUrl &&
    !supabaseUrl.includes("placeholder") &&
    serviceRoleKey &&
    !serviceRoleKey.includes("placeholder")
  );

  if (!isLive) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
