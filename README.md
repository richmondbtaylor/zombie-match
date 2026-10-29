# Zombie Match

> A half-built copy of **Hinge / Tinder paid tiers**. It runs, it kind of works, and it is not ready for real users.
> Your job tonight: bring it back to life.

**Replaces:** Hinge and Tinder paid plans (paid plans)

**Live demo:** https://zombie-match.vercel.app (a shared demo: data resets whenever the server restarts)
<!-- Price not verified: hinge.co/preferred returned 404 and the Hinge help center returned 403 on 2026-10-29. Dating apps hide or vary prices, so no number is claimed. -->

## Run it (2 minutes)

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3105.

## What works

- A "Pretend to be" dropdown in the top bar picks who you are (there are no real accounts).
- Create a profile or edit the one you are pretending to be: name, age, city, bio, interests, looking for.
- Profile prompts: every profile answers 3 prompts picked from a list ("My ideal Sunday", "I'm weirdly good at", "We'll get along if", and more). Edit them on My profile and see a live preview of your card.
- Discover: a big card with a color "photo" block, name, age, city, prompts and interests. Like, Pass and Super like buttons.
- A mutual like makes a match. Try it: pretend to be Avery Stone and like Jordan Reyes. Jordan already liked Avery.
- Matches page: each match shows the last message and its time, newest first. Unmatch a person with one click.
- Chat per match (messages are saved in `data/db.json`).
- Who liked you: a paid page that shows blurred cards and an "Upgrade to see who liked you" button. The button hits the Stripe stub and gets a 501.
- Pricing page (Stripe is not connected).
- 10 fake adult profiles (ages 25 to 45) in `data/seed.json`. Everyone is made up.

## What's broken

See [ZOMBIE.md](ZOMBIE.md). That's the to-do list for the night. It starts with the safety holes, because they matter most for a dating app.

## How we build tonight

- **Mel** ([openmel.dev](https://openmel.dev)) does the building. Open this folder in Mel and give it tasks from ZOMBIE.md.
- **Prompt Anything** ([promptanything.io](https://www.promptanything.io)) writes the prompts. Use it inside Mel for features, agents, customer success flows, code fixes and reading this repo.
- **MEL.md** in this folder tells Mel's agents what this project is and how to work on it.

## Submit

Fork this repo, push your work, and send your link through the submission form before the deadline.
Many people can pick the same app. The one that actually works wins.

## License

MIT. Use it, ship it, share it.
