import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Env vars missing" }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const [linksRes, broadcastsRes] = await Promise.all([
    admin.from("links").select("*").eq("is_active", true).order("order_index"),
    admin.from("broadcasts").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
  ]);

  return NextResponse.json({
    links: linksRes.data ?? [],
    broadcasts: broadcastsRes.data ?? [],
  });
}
