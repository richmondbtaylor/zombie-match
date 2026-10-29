# MEL.md

This is a hackathon project: a half-built copy of Hinge and Tinder paid plans (a dating app) that we are turning into a real SaaS product the whole group can use.

## The stack

- Next.js (App Router) + TypeScript + React. Plain CSS in `app/globals.css`, no Tailwind.
- Data: `lib/db.ts` reads and writes `data/db.json`. `data/seed.json` is the starting data (profiles, likes, passes, matches, messages). This is temporary.
- Routes: `app/api/profiles`, `feed`, `swipe`, `likes`, `matches`, `matches/[id]` (unmatch) and `matches/[id]/messages`. Pages: Discover (`app/page.tsx`), `profile`, `matches`, `likes` (Who liked you, paid), `pricing`.
- Profile prompts: the list and the clean-up helper are in `lib/prompts.ts`. `components/ProfileCard.tsx` draws a card (Discover, profile preview, blurred cards on Who liked you).
- "Who am I" is a dropdown (`components/PretendPicker.tsx`, `lib/useMe.ts`). There are no real accounts yet.
- Payments: `app/api/checkout/route.ts` is a stub. Stripe is not connected.
- Runs on port 3105.

## The job

Work through `ZOMBIE.md` in order: make it work, make it secure, make it compliant, connect Stripe, ship it.
Every planted problem in the code is marked with a `ZOMBIE:` comment.
This is a dating app, so safety comes first: real login, 18+ checks, block and report, private messages.

## Rules for agents

- Keep it running. Run `npm run build` after each change and fix what breaks.
- Never commit secrets. Keys go in `.env.local` (it is git-ignored).
- Use Stripe test mode keys only.
- Keep all sample data fake and adult. Never add real people's data.
- When you fix a `ZOMBIE:` item, delete its comment and tick its box in `ZOMBIE.md`.
- Small commits with plain messages.
