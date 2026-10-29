import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// Unmatch. The match disappears from the Matches page and the chat page hides the thread.
// ZOMBIE: BUG. Unmatch only sets a flag. The messages are NOT deleted, and
// GET /api/matches/[id]/messages still returns them to anyone. Also nobody checks WHO is
// unmatching. Fix: delete or lock the messages, and check the signed-in user is in the match.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const match = db.matches.find((m) => m.id === id);
  if (!match) return NextResponse.json({ error: "No such match." }, { status: 404 });
  match.unmatched = true;
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
