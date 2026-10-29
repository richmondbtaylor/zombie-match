import { NextResponse } from "next/server";
import { cleanPrompts } from "@/lib/prompts";
import { newId, readDb, writeDb, type Profile } from "@/lib/db";

const COLORS = ["#4b36d9", "#d9634b", "#3f8f3a", "#c28a1c", "#2a7fb8", "#b8326f"];

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.profiles);
}

// Create a profile.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const age = Number(body.age);
  if (!name || !age) {
    return NextResponse.json({ error: "Name and age are required." }, { status: 400 });
  }
  // ZOMBIE: no 18+ check. Any age is accepted and nobody verifies it. Dating apps must
  // block under-18s (age gate plus ID or age estimation). See ZOMBIE.md section 3.
  const db = await readDb();
  const profile: Profile = {
    id: newId(),
    name,
    age,
    city: String(body.city ?? ""),
    bio: String(body.bio ?? ""),
    interests: Array.isArray(body.interests) ? body.interests.map(String) : [],
    lookingFor: String(body.lookingFor ?? ""),
    color: COLORS[db.profiles.length % COLORS.length],
    prompts: cleanPrompts(body.prompts),
  };
  db.profiles.push(profile);
  await writeDb(db);
  return NextResponse.json(profile, { status: 201 });
}
