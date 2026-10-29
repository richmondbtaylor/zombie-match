"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { useMe } from "@/lib/useMe";
import { formatTime } from "@/lib/prompts";
import type { Profile } from "@/lib/db";

type Row = { id: string; other: Profile; last: { text: string; at: string; from: string } | null };

export default function MatchesPage() {
  const me = useMe();
  const [rows, setRows] = useState<Row[] | null>(null);

  const load = useCallback(async () => {
    if (!me) return;
    const res = await fetch(`/api/matches?me=${me}`);
    setRows(await res.json());
  }, [me]);

  useEffect(() => { load(); }, [load]);

  async function unmatch(row: Row) {
    if (!window.confirm(`Unmatch with ${row.other.name}? The chat will be hidden.`)) return;
    await fetch(`/api/matches/${row.id}`, { method: "DELETE" });
    load();
  }

  const chatting = rows?.filter((r) => r.last).length ?? 0;
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Matches</h1>
          <p className="sub">People who liked you back. Newest message first.</p>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><span className="stat-num">{rows ? rows.length : "-"}</span><span className="stat-label">Matches</span></div>
        <div className="stat"><span className="stat-num">{rows ? chatting : "-"}</span><span className="stat-label">Chats started</span></div>
      </div>
      {rows && rows.length === 0 && (
        <div className="card empty">
          <strong>No matches yet</strong>
          <span className="muted">Go to Discover and like some people.</span>
          <Link href="/" className="btn">Go to Discover</Link>
        </div>
      )}
      <div className="list">
        {rows?.map((r) => (
          <div key={r.id} className="card match-row">
            <Link href={`/matches/${r.id}`} className="match-main">
              <Avatar name={r.other.name} color={r.other.color} size={52} />
              <div className="match-text">
                <div className="match-top">
                  <strong>{r.other.name}, {r.other.age}</strong>
                  {r.last && <span className="muted small">{formatTime(r.last.at)}</span>}
                </div>
                <div className="muted preview">
                  {r.last ? `${r.last.from === me ? "You: " : ""}${r.last.text}` : "No messages yet. Say hi."}
                </div>
              </div>
            </Link>
            <button className="ghost small-btn" onClick={() => unmatch(r)}>Unmatch</button>
          </div>
        ))}
      </div>
    </>
  );
}
