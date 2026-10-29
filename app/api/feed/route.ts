import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// The discover feed for ?me=<profile id>.
export async function GET(req: Request) {
  const me = new URL(req.url).searchParams.get("me");
  if (!me) return NextResponse.json({ error: "Missing ?me=" }, { status: 400 });

  const db = await readDb();
  const liked = new Set(db.likes.filter((l) => l.from === me).map((l) => l.to));
  const matched = new Set(db.matches.flatMap((m) => (m.a === me ? [m.b] : m.b === me ? [m.a] : [])));

  // ZOMBIE: BUG. People you already passed come back in the feed. We skip likes and
  // matches but forget to skip db.passes. Fix: also filter out everyone in db.passes where from === me.
  // ZOMBIE: not built yet: distance and age filters. Every profile shows, no matter where or how old.
  const feed = db.profiles.filter((p) => p.id !== me && !liked.has(p.id) && !matched.has(p.id));
  return NextResponse.json(feed);
}
