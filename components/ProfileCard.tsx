// One profile as a card: a big gradient "photo" block with initials, then the details.
// ZOMBIE: no real photos yet. The gradient block stands in for one.
import type { ReactNode } from "react";
import type { Profile } from "@/lib/db";

type Props = {
  profile: Profile;
  blurred?: boolean; // used on the "Who liked you" page
  compact?: boolean; // photo, name and one prompt only
  children?: ReactNode; // buttons under the card
};

export default function ProfileCard({ profile, blurred = false, compact = false, children }: Props) {
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const prompts = profile.prompts ?? [];
  const shown = compact ? prompts.slice(0, 1) : prompts;

  return (
    <div className={`profile-card${blurred ? " blurred" : ""}${compact ? " compact" : ""}`}>
      <div className="photo" style={{ background: `linear-gradient(145deg, ${profile.color}, #1b1633)` }}>
        <span className="initials">{initials}</span>
      </div>
      <div className="profile-body">
        <div className="blur-me">
          <strong className="big-name">{profile.name}, {profile.age}</strong>
          <div className="muted">{profile.city}</div>
        </div>
        {!compact && <p className="bio blur-me">{profile.bio}</p>}
        {shown.map((p) => (
          <div key={p.question} className="prompt blur-me">
            <div className="prompt-q">{p.question}</div>
            <div className="prompt-a">{p.answer}</div>
          </div>
        ))}
        {!compact && (
          <div className="row blur-me">
            {profile.interests.map((i) => <span key={i} className="pill">{i}</span>)}
          </div>
        )}
        {!compact && profile.lookingFor && <div className="muted blur-me">Looking for: {profile.lookingFor}</div>}
      </div>
      {children && <div className="profile-actions">{children}</div>}
    </div>
  );
}
