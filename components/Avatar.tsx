// ZOMBIE: no photos yet. Avatars are colored circles with initials.
// When you add photo upload, you also need photo moderation (see ZOMBIE.md).
export default function Avatar({ name, color, size = 48 }: { name: string; color: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: color, color: "#fff",
        display: "grid", placeItems: "center", fontWeight: 700, fontSize: size / 2.6, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
