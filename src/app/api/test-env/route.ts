import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks: Record<string, unknown> = {
    url: url ? `${url.substring(0, 30)}...` : "MISSING",
    serviceKey: serviceKey ? `${serviceKey.substring(0, 15)}...` : "MISSING",
    anonKey: anonKey ? `${anonKey.substring(0, 15)}...` : "MISSING",
  };

  if (!url || !serviceKey) {
    return NextResponse.json({ status: "FAIL", reason: "Env vars missing", checks });
  }

  // Test service role
  const admin = createClient(url, serviceKey);
  const { data: profiles, error: pErr } = await admin.from("profiles").select("id, username").eq("username", "oktagram").single();
  checks.profiles = profiles || pErr?.message;

  // Test auth.admin
  if (profiles?.id) {
    const { data: user, error: uErr } = await admin.auth.admin.getUserById(profiles.id);
    checks.authUser = user?.user?.email || uErr?.message;
  }

  return NextResponse.json({ status: "OK", checks });
}
