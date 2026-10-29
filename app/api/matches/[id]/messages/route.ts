import { NextResponse } from "next/server";
import { newId, readDb, writeDb, type Message } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: SECURITY HOLE. Anyone can read any match's private messages by guessing the match id.
// There is no check that the caller is one of the two people in the match. Add sign-in, then
// check the signed-in user belongs to this match before returning anything.
// ZOMBIE: this also returns messages of an UNMATCHED chat. Unmatch only hides the chat in the page.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const match = db.matches.find((m) => m.id === id);
  if (!match) return NextResponse.json({ error: "No such match." }, { status: 404 });
  const messages = db.messages.filter((m) => m.matchId === id);
  return NextResponse.json({ match, messages });
}

// Send a message. Body: { from, text }
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "Message is empty." }, { status: 400 });

  const db = await readDb();
  const match = db.matches.find((m) => m.id === id);
  if (!match) return NextResponse.json({ error: "No such match." }, { status: 404 });

  // ZOMBIE: "from" comes from the request body, so anyone can send as anyone.
  // ZOMBIE: no block or report, no spam or abuse filter on messages.
  const message: Message = {
    id: newId(),
    matchId: id,
    from: String(body.from ?? ""),
    text: text.slice(0, 1000),
    at: new Date().toISOString(),
  };
  db.messages.push(message);
  await writeDb(db);
  return NextResponse.json(message, { status: 201 });
}
