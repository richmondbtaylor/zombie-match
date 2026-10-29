import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// My matches for ?me=<profile id>. Each has the other person's profile and the last message.
// Sorted by the latest message, newest first. Unmatched people are left out.
export async function GET(req: Request) {
  const me = new URL(req.url).searchParams.get("me");
  if (!me) return NextResponse.json({ error: "Missing ?me=" }, { status: 400 });

  const db = await readDb();
  const mine = db.matches
    .filter((m) => (m.a === me || m.b === me) && !m.unmatched)
    .map((m) => {
      const other = db.profiles.find((p) => p.id === (m.a === me ? m.b : m.a));
      const last = db.messages.filter((x) => x.matchId === m.id).sort((x, y) => y.at.localeCompare(x.at))[0];
      return { id: m.id, other, last: last ? { text: last.text, at: last.at, from: last.from } : null };
    });
  mine.sort((x, y) => (y.last?.at ?? "").localeCompare(x.last?.at ?? ""));
  return NextResponse.json(mine);
}
