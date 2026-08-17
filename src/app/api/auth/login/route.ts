import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    // Find user by username in profiles table
    const adminSupabase = createClient(supabaseUrl, supabaseKey);

    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 401 });
    }

    // Check if user is admin
    const { data: admin } = await adminSupabase
      .from("admin_users")
      .select("role")
      .eq("id", profile.id)
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Akun ini bukan admin" }, { status: 403 });
    }

    // Get the user's email from auth.users
    const { data: authUser } = await adminSupabase.auth.admin.getUserById(profile.id);

    if (!authUser?.user?.email) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 });
    }

    // Sign in with email+password using the public anon key
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
      email: authUser.user.email,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    return NextResponse.json({
      user: signInData.user,
      session: signInData.session,
    });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
