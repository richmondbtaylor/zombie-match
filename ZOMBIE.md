# 🧟 ZOMBIE.md: what's broken

This app is a zombie on purpose. Pick items off this list. Every box you tick gets it closer to a product we can all use and stop paying for Hinge and Tinder paid plans.

Search the code for `ZOMBIE:` to find every planted problem.

## 1. Make it work

- [ ] The discover feed shows people you already passed (`app/api/feed/route.ts`). Filter them out.
- [ ] Distance and age filters are not built yet. Add them to the feed.
- [ ] Chat does not update live. You have to refresh. Add polling every few seconds, or websockets.
- [ ] "Super like" (the paid feature) says "not built yet". Build it, then lock it to a paid plan.
- [ ] Avatars and card photos are colors and initials. Add photo upload (and read section 3 first).
- [ ] Unmatch is half done. It only hides the chat in the page (`app/api/matches/[id]/route.ts`). The messages are never deleted. Delete or lock them.
- [ ] "Who liked you" is the paid feature, but nothing checks a plan. Build the plan check after Stripe works (section 4).
- [ ] Profile prompts are not checked. Any question text is accepted, and the answers are not moderated.
- [ ] No "new match" alert and no unread count on the Matches page.

## 2. Make it secure and safe

- [ ] There is no login. The "Pretend to be" dropdown lets anyone act as anyone. Add accounts (Supabase Auth, Clerk, Auth.js...).
- [ ] No identity check. Nothing proves a profile is a real person. Add email or phone checks at least.
- [ ] No 18+ age check. Anyone can type any age. Add an age gate and verification.
- [ ] No block button and no report button. Add both, and make a blocked person vanish from the feed and chat.
- [ ] Any user can read any match's private messages through `GET /api/matches/[id]/messages`. Check that the signed-in user is in the match.
- [ ] Unmatch leaves the messages readable. `GET /api/matches/[id]/messages` still returns them after an unmatch, and anyone can still post to an unmatched chat.
- [ ] "Who liked you" leaks. The page blurs the cards, but `GET /api/likes?me=...` sends the real names, ages, cities and prompts to anyone. Only send them after a paid plan is confirmed.
- [ ] Anyone can unmatch anyone, because `DELETE /api/matches/[id]` does not check who is calling.
- [ ] Anyone can send a message as anyone, and edit any profile, because the server trusts the id in the request.
- [ ] No photo moderation. When you add photos, scan them for nudity and abuse before they show.
- [ ] No spam or abuse filter on bios and messages.
- [ ] Every API route trusts whatever it's sent. Validate input on the server.
- [ ] Ids are guessable (`lib/db.ts`). Use random ids and check that the record belongs to the signed-in user.
- [ ] Data lives in `data/db.json` on disk. Move it to a real database.

## 3. Make it compliant

Dating data is sensitive. Plan for these rules:

- [ ] **Minors:** block under-18s. Child safety laws in the US (COPPA for under 13, plus state age rules) and the UK Online Safety Act expect real age checks.
- [ ] **GDPR (EU/UK):** who you want to date can reveal sexual orientation, and profiles can reveal religion or health. That is "special category" data. You need clear, explicit consent, a legal basis, and a way to withdraw it.
- [ ] **Privacy laws:** California CCPA/CPRA treats sexual orientation and precise location as sensitive data. Other states (Colorado, Virginia, Texas and more) have similar laws.
- [ ] **App store rules:** Apple and Google require apps with user content to offer report and block, content moderation, and a way to delete your account inside the app.
- [ ] **Dating-safety laws:** some states have dating-app laws (for example, safety notices and rules for how you handle reports of abuse). Check the states you launch in.
- [ ] **Subscriptions:** US auto-renewal laws (for example California) and FTC rules need clear pricing and an easy cancel.
- [ ] **Romance scams and fake profiles:** have a way to find and remove them quickly.
- [ ] No privacy policy or terms page.
- [ ] No way for a user to export or delete their data.

## 4. Connect Stripe

- [ ] `app/api/checkout/route.ts` returns a 501. Create a Stripe Checkout Session (test mode is fine).
- [ ] Add a webhook route that marks the account as paid.
- [ ] Lock the paid features behind the plan.

## 5. Ship it

- [ ] Deploy it (Vercel, Netlify, Railway...). The JSON file database will not survive this, so do section 2 first.
- [ ] Put the live link in your README.

## What "done" looks like

Someone who has never seen it can sign up, pay, use the main feature end to end, and come back tomorrow to find their data still there.
