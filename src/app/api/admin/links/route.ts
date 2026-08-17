import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("links")
    .select("*")
    .order("order_index");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();

  const { data: existing } = await auth.supabase
    .from("links")
    .select("id")
    .eq("title", body.title)
    .eq("url", body.url)
    .gte("created_at", new Date(Date.now() - 60000).toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ data: existing[0], dedup: true });
  }

  const { data, error } = await auth.supabase
    .from("links")
    .insert({ title: body.title, url: body.url, description: body.description || "", category: body.category || "general", icon: body.icon || "", is_active: body.is_active !== false, order_index: body.order_index || 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { data, error } = await auth.supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body: { id?: string } = await request.json();
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await auth.supabase.from("links").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
