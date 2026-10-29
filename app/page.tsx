"use client";
// Discover: one card at a time. Like, Pass or Super like.
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { useMe } from "@/lib/useMe";
import type { Profile } from "@/lib/db";

export default function Discover() {
  const me = useMe();
  const [feed, setFeed] = useState<Profile[]>([]);
  const [note, setNote] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!me) return;
    const res = await fetch(`/api/feed?me=${me}`);
    setFeed(await res.json());
    setLoaded(true);
  }, [me]);

  useEffect(() => { load(); }, [load]);

  async function swipe(action: "like" | "pass" | "super") {
    const card = feed[0];
    if (!card || !me) return;
    const res = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ me, target: card.id, action }),
    });
    const data = await res.json();
    if (!res.ok) { setNote(data.error); return; } // e.g. Super like: not built yet
    setNote(data.matched && action === "like" ? `It's a match with ${card.name}! See Matches.` : "");
    setFeed(feed.slice(1));
  }

  const card = feed[0];
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Discover</h1>
          <p className="sub">Like or pass. A mutual like makes a match.</p>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><span className="stat-num">{loaded ? feed.length : "-"}</span><span className="stat-label">People to see</span></div>
      </div>
      {!loaded && <p className="muted">Loading...</p>}
      {loaded && !card && (
        <div className="card empty">
          <strong>No one left to show</strong>
          <span className="muted">Try pretending to be someone else, using the dropdown at the top.</span>
        </div>
      )}
      {card && (
        <ProfileCard profile={card}>
          <button className="ghost" onClick={() => swipe("pass")}>Pass</button>
          {/* ZOMBIE: Super like is the paid feature. It is not built and not locked to a plan. */}
          <button className="ghost" onClick={() => swipe("super")}>Super like</button>
          <button onClick={() => swipe("like")}>Like</button>
        </ProfileCard>
      )}
      {note && <p className="note">{note}</p>}
      {/* ZOMBIE: not built yet: distance and age filters. */}
      <p className="muted">Filters (distance, age): not built yet, see ZOMBIE.md</p>
    </>
  );
}
