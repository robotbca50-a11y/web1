import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { signSession } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Env vars missing" }, { status: 500 });
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib" },
        { status: 400 }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // 1. Fetch profile with password_hash + is_admin
    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("id, username, password_hash, is_admin")
      .eq("username", username)
      .single();

    if (pErr || !profile) {
      return NextResponse.json(
        { error: "Username tidak ditemukan" },
        { status: 401 }
      );
    }

    if (!profile.is_admin) {
      return NextResponse.json(
        { error: "Bukan admin" },
        { status: 403 }
      );
    }

    if (!profile.password_hash) {
      return NextResponse.json(
        { error: "Password belum di-set. Jalankan SQL migration 002." },
        { status: 500 }
      );
    }

    // 2. Verify password via RPC
    const { data: valid, error: vErr } = await admin.rpc("check_password", {
      p_password: password,
      p_hash: profile.password_hash,
    });

    if (vErr) {
      return NextResponse.json(
        { error: `RPC error: ${vErr.message}` },
        { status: 500 }
      );
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // 3. Sign and set session cookie
    const token = signSession({
      id: profile.id,
      username: profile.username,
      ts: Date.now(),
    });

    const cookieStore = await cookies();
    cookieStore.set("master_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: profile.id, username: profile.username },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
