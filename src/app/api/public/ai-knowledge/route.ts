import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ data: [] });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data, error } = await admin
    .from("ai_knowledge")
    .select("topic, content, category");

  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}
