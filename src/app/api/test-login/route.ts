import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const admin = createClient(url, serviceKey);

  // Check profile
  const { data: profile } = await admin
    .from("profiles")
    .select("id, username, email")
    .eq("username", "oktagram")
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" });
  }

  // Try sign in directly to test password
  const pub = createClient(url, anonKey);
  const { data, error } = await pub.auth.signInWithPassword({
    email: profile.email,
    password: "P@IPet2026",
  });

  return NextResponse.json({
    profile,
    signInWorks: !error,
    signInError: error?.message,
    userId: data?.user?.id,
  });
}
