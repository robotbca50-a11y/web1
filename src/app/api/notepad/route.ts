import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/session";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function getUserFromSession(): Promise<{ id: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const session = verifySession(token);
    if (!session) return null;
    return { id: session.id };
  } catch {
    return null;
  }
}

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET: List user's notepads
export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notepads")
    .select("*")
    .eq("user_id", user.id)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST: Create new notepad
export async function POST(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notepads")
    .insert({ user_id: user.id, title: "Catatan Baru", content: "" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PUT: Update notepad
export async function PUT(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await req.json();
  const { id, title, content, is_pinned } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getSupabase();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) update.title = title;
  if (content !== undefined) update.content = content;
  if (is_pinned !== undefined) update.is_pinned = is_pinned;

  const { error } = await supabase
    .from("notepads")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE: Delete notepad
export async function DELETE(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from("notepads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
