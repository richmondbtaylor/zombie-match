"use client";
// Create a new profile, or edit the one you are pretending to be.
import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { PROMPTS } from "@/lib/prompts";
import { setMe, useMe } from "@/lib/useMe";
import type { Prompt } from "@/lib/db";

const EMPTY = { name: "", age: "", city: "", bio: "", interests: "", lookingFor: "" };
// Three prompt slots. Each starts on a different question.
const EMPTY_PROMPTS: Prompt[] = [0, 1, 2].map((i) => ({ question: PROMPTS[i], answer: "" }));

export default function ProfilePage() {
  const me = useMe();
  const [form, setForm] = useState(EMPTY);
  const [prompts, setPrompts] = useState<Prompt[]>(EMPTY_PROMPTS);
  const [color, setColor] = useState("#4b36d9");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!me) return;
    fetch(`/api/profiles/${me}`).then((r) => r.json()).then((p) => {
      setForm({ ...p, age: String(p.age), interests: (p.interests ?? []).join(", ") });
      setColor(p.color ?? "#4b36d9");
      const saved: Prompt[] = p.prompts ?? [];
      setPrompts([0, 1, 2].map((i) => saved[i] ?? EMPTY_PROMPTS[i]));
    });
  }, [me]);

  function set(key: keyof typeof EMPTY, value: string) {
    setForm({ ...form, [key]: value });
  }

  function setPrompt(i: number, change: Partial<Prompt>) {
    setPrompts(prompts.map((p, n) => (n === i ? { ...p, ...change } : p)));
  }

  function payload() {
    return {
      ...form,
      age: Number(form.age),
      interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
      prompts,
    };
  }

  async function save() {
    setMsg("");
    const res = await fetch(`/api/profiles/${me}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload()),
    });
    setMsg(res.ok ? "Saved." : "Could not save.");
  }

  async function createNew() {
    setMsg("");
    const res = await fetch("/api/profiles", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload()),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error);
    setMe(data.id); // switch to the new profile
    setMsg("Created. You are now this person.");
    setTimeout(() => window.location.reload(), 600); // refresh the dropdown list
  }

  const preview = {
    id: "preview", color, name: form.name || "Your name", age: Number(form.age) || 0, city: form.city,
    bio: form.bio, lookingFor: form.lookingFor, prompts: prompts.filter((p) => p.answer.trim()),
    interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My profile</h1>
          <p className="sub">Edit the profile you are pretending to be, or fill the form and create a new one.</p>
        </div>
      </div>
      <div className="two-col">
        <div className="card stack">
          <label>Name<input value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
          <label>Age<input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} /></label>
          <label>City<input value={form.city} onChange={(e) => set("city", e.target.value)} /></label>
          <label>Bio<textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} /></label>
          <label>Interests (comma separated)<input value={form.interests} onChange={(e) => set("interests", e.target.value)} /></label>
          <label>Looking for<input value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} /></label>
          <h2 style={{ margin: "10px 0 0" }}>Prompts</h2>
          <p className="muted" style={{ margin: 0 }}>Pick 3 and answer them. These show on your card.</p>
          {prompts.map((p, i) => (
            <div key={i} className="stack">
              <select value={p.question} onChange={(e) => setPrompt(i, { question: e.target.value })}>
                {PROMPTS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
              <textarea rows={2} value={p.answer} placeholder="Your answer"
                onChange={(e) => setPrompt(i, { answer: e.target.value })} />
            </div>
          ))}
          {/* ZOMBIE: no 18+ check here. The age box accepts any number and nobody verifies it. */}
          <div className="row">
            <button onClick={save}>Save changes</button>
            <button className="ghost" onClick={createNew}>Create as new profile</button>
          </div>
          {msg && <p className="note">{msg}</p>}
        </div>
        <div className="stack" style={{ alignContent: "start" }}>
          <strong>How your card looks</strong>
          <ProfileCard profile={preview} />
        </div>
      </div>
    </>
  );
}
