import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/session";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface AdminUser {
  id: string;
  username: string;
}

export async function requireAdmin(): Promise<
  { admin: AdminUser; supabase: SupabaseClient } | { error: NextResponse }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return { error: NextResponse.json({ error: "Not logged in" }, { status: 401 }) };
  }

  const session = verifySession(token);
  if (!session) {
    return { error: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { error: NextResponse.json({ error: "Env vars missing" }, { status: 500 }) };
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Verify user is still admin in DB
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, is_admin")
    .eq("id", session.id)
    .single();

  if (!profile?.is_admin) {
    return { error: NextResponse.json({ error: "Not admin" }, { status: 403 }) };
  }

  return { admin: { id: profile.id, username: profile.username }, supabase };
}
