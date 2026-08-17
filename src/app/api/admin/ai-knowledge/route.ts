import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("ai_knowledge")
    .select("*")
    .order("category");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const { data, error } = await auth.supabase
    .from("ai_knowledge")
    .insert(body)
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
    .from("ai_knowledge")
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

  const { error } = await auth.supabase.from("ai_knowledge").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
