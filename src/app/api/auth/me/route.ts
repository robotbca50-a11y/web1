import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const session = verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: session.id, username: session.username },
  });
}
