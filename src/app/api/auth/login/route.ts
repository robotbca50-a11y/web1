import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey || !anonKey) {
    return NextResponse.json({ 
      error: "Env vars belum lengkap",
      debug: { url: !!supabaseUrl, service: !!serviceKey, anon: !!anonKey }
    }, { status: 500 });
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib" }, { status: 400 });
    }

    // Client with service role (bypass RLS)
    const admin = createClient(supabaseUrl, serviceKey);

    // 1. Cari profile berdasarkan username
    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .single();

    if (pErr || !profile) {
      return NextResponse.json({ 
        error: "Username tidak ditemukan",
        debug: pErr?.message 
      }, { status: 401 });
    }

    // 2. Cek apakah admin
    const { data: adm } = await admin
      .from("admin_users")
      .select("role")
      .eq("id", profile.id)
      .single();

    if (!adm) {
      return NextResponse.json({ error: "Bukan admin" }, { status: 403 });
    }

    // 3. Ambil email dari auth.users
    const { data: authUser, error: aErr } = await admin.auth.admin.getUserById(profile.id);

    if (aErr || !authUser?.user?.email) {
      return NextResponse.json({ 
        error: "Auth user tidak ditemukan",
        debug: aErr?.message 
      }, { status: 401 });
    }

    // 4. Login pakai anon key
    const pub = createClient(supabaseUrl, anonKey);
    const { data: signIn, error: sErr } = await pub.auth.signInWithPassword({
      email: authUser.user.email,
      password: password,
    });

    if (sErr) {
      return NextResponse.json({ 
        error: "Password salah",
        debug: sErr.message 
      }, { status: 401 });
    }

    return NextResponse.json({
      user: signIn.user,
      session: signIn.session,
    });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
