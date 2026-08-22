import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET: Poll room state — returns all players + room info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const supabase = getSupabase();

  // Cleanup stale players
  try { await supabase.rpc("cleanup_stale_players"); } catch { /* ignore */ }

  const { data: room } = await supabase
    .from("typing_rooms")
    .select("room_code, status, difficulty, text_content, time_limit, language, host_nickname")
    .eq("room_code", code.toUpperCase())
    .single();

  const { data: players } = await supabase
    .from("race_players")
    .select("*")
    .eq("room_code", code.toUpperCase())
    .order("is_host", { ascending: false })
    .order("created_at", { ascending: true });

  return NextResponse.json({ room: room || null, players: players || [] });
}

// POST: Join / Leave / Update / Start
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, code, id, name, color, wpm, progress, finished, is_host, difficulty, time_limit, language } = body;
  if (!action || !code) return NextResponse.json({ error: "Missing action/code" }, { status: 400 });

  const supabase = getSupabase();
  const roomCode = code.toUpperCase();

  switch (action) {
    case "join": {
      const { error: roomErr } = await supabase
        .from("typing_rooms")
        .upsert({
          room_code: roomCode,
          host_nickname: name || "Host",
          host_id: id || null,
          status: "waiting",
          difficulty: difficulty || "medium",
          time_limit: time_limit || 60,
          language: language || "en",
        }, { onConflict: "room_code", ignoreDuplicates: false });
      if (roomErr) console.error("Room upsert error:", roomErr);

      // Don't overwrite is_host if player already has it in DB
      if (is_host) {
        const { error } = await supabase
          .from("race_players")
          .upsert({
            id, room_code: roomCode, name: name || "Anonymous",
            color: color || "#ef4444", wpm: 0, progress: 0,
            finished: false, is_host: true, last_seen: new Date().toISOString(),
          }, { onConflict: "id" });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        // Check if already host in DB
        const { data: existing } = await supabase
          .from("race_players")
          .select("is_host")
          .eq("id", id)
          .eq("room_code", roomCode)
          .single();
        const wasHost = existing?.is_host;
        const { error } = await supabase
          .from("race_players")
          .upsert({
            id, room_code: roomCode, name: name || "Anonymous",
            color: color || "#ef4444", wpm: 0, progress: 0,
            finished: false, is_host: !!wasHost, last_seen: new Date().toISOString(),
          }, { onConflict: "id" });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    case "heartbeat": {
      const { error } = await supabase
        .from("race_players")
        .update({ wpm: wpm || 0, progress: progress || 0, finished: !!finished, last_seen: new Date().toISOString() })
        .eq("id", id)
        .eq("room_code", roomCode);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    case "leave": {
      await supabase.from("race_players").delete().eq("id", id).eq("room_code", roomCode);
      return NextResponse.json({ success: true });
    }

    case "start": {
      const newText = generateText(difficulty || "medium", language || "en");
      const { error } = await supabase
        .from("typing_rooms")
        .update({ status: "countdown", text_content: newText })
        .eq("room_code", roomCode);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, text: newText });
    }

    case "setstatus": {
      const { status: newStatus } = body;
      await supabase.from("typing_rooms").update({ status: newStatus }).eq("room_code", roomCode);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

// DELETE: Remove player from room
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const code = searchParams.get("code");
  if (!id || !code) return NextResponse.json({ error: "Missing id/code" }, { status: 400 });

  const supabase = getSupabase();
  await supabase.from("race_players").delete().eq("id", id).eq("room_code", code.toUpperCase());
  return NextResponse.json({ success: true });
}

function generateText(difficulty: string, language: string): string {
  const easyEn = ["the","cat","dog","run","jump","big","red","sun","fun","hat","box","pen","cup","map","toy","bus","jam","ice","fly","sad","hot","cry","mix","zip","nod"];
  const medEn = ["apple","brain","crane","drive","earth","flame","globe","heart","island","juice","knot","lemon","mango","ocean","queen","river","stone","tiger","ultra","voice","world","youth","zebra","blank","chain","dance","eager","frost","grape","honey"];
  const hardEn = ["ability","absence","balance","captain","decimal","develop","economy","fashion","gallery","harvest","imagine","journey","kingdom","leather","machine","negative","opinion","process","quarter","replace","silence","trouble","uniform","village","weather","ability","absorbed","abstract","academy","actions","admiral","afford","against","algebra","amazing","ancient","another","anxiety","anybody","applied","arrange","article","athletic","average"];
  const easyId = ["saya","kamu","dia","kita","mereka","ini","itu","dan","atau","tapi","baik","buruk","besar","kecil","panjang","pendek","atas","bawah","kiri","kanan","depan","belakang","hari","malam","pagi"];
  const medId = ["manusia","negara","bahasa","indonesia","adalah","dengan","untuk","dalam","oleh","akan","sangat","lebih","karena","setiap","selalu","bersama","berarti","kehidupan","perjalanan","pembelajaran","kebahagiaan","pertemanan","keluarga","makanan","minuman"];
  const hardId = ["keberanian","kemandirian","pengembangan","pertumbuhan","kesehatan","pendidikan","teknologi","komunikasi","transportasi","lingkungan","ekonomi","sosial","politik","budaya","sejarah","matematika","fisika","kimia","biologi","geografi","astronomi","filosofi","psikologi","arkeologi","sosiologi"];

  let pool: string[];
  if (language === "id") {
    pool = difficulty === "easy" ? easyId : difficulty === "hard" ? hardId : medId;
  } else {
    pool = difficulty === "easy" ? easyEn : difficulty === "hard" ? hardEn : medEn;
  }

  const count = difficulty === "easy" ? 25 : difficulty === "hard" ? 40 : 30;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return words.join(" ");
}
