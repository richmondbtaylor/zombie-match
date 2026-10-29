import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// Everyone who liked ?me=<profile id> and is not a match yet. This is the paid "Who liked you" feature.
// ZOMBIE: BUG. The page blurs the cards, but this response has the real names, ages, cities and
// prompts in plain JSON. Open the Network tab and read them for free. Also nothing checks that
// the caller paid. Fix: only send the real data after a paid plan is confirmed (send a count or
// blank cards to free users), and check the signed-in user server side.
export async function GET(req: Request) {
  const me = new URL(req.url).searchParams.get("me");
  if (!me) return NextResponse.json({ error: "Missing ?me=" }, { status: 400 });

  const db = await readDb();
  const matched = new Set(db.matches.flatMap((m) => (m.a === me ? [m.b] : m.b === me ? [m.a] : [])));
  const fans = db.likes
    .filter((l) => l.to === me && !matched.has(l.from))
    .map((l) => db.profiles.find((p) => p.id === l.from))
    .filter(Boolean);
  return NextResponse.json(fans);
}
