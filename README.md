# Open Combo Codex

Open Combo Codex is an open-source Yu-Gi-Oh! TCG combo browser built for fast testing, tournament prep, and community-maintained combo documentation.

The app is dark, mobile-first, searchable, and designed around plain Markdown combo files so players can add or fix lines for any engine through normal GitHub pull requests.

Support development: [☕ Ko-fi](https://ko-fi.com/siebeocc)

## Features

- Engine selector with live combo libraries and future placeholders.
- Search across combo titles, starter cards, card names, steps, notes, tags, and source paths.
- Filters for category, starter, difficulty, turn preference, card count, OTK potential, and favorites.
- Expandable combo cards with readable numbered steps.
- Starter-card thumbnails and hover card previews powered by YGOPRODeck image/data lookups.
- Copy-to-clipboard, share links, random combo, and local favorite storage.
- Optional Supabase accounts, persistent up/down votes, and moderated visual combo submissions.
- Automatic PR validation for card-name typos so broken images/tooltips are caught before merge.
- Engine-aware animated backgrounds derived from card art.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Lucide icons
- YGOPRODeck API for card data and images
- Supabase Auth + Postgres for accounts, votes, and editor submissions

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Run verification:

```bash
npm run validate:cards
npm run validate:supabase
npm run lint
npm run build
```

Optional Supabase setup:

1. Copy `.env.example` to `.env.local`.
2. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (from Supabase **Project Settings → API Keys**, publishable key — replaces the legacy anon JWT).
3. Apply `supabase/migrations/001_accounts_votes_submissions.sql` in your Supabase project.
4. Enable auth providers in Supabase (**Authentication → Providers**): GitHub, Discord, and/or **Email** (magic link). Set redirect URLs to include `http://localhost:3000/auth/callback` (and your production URL on Vercel).

## Project Structure

```text
app/                         Next.js routes, layout, global styles, app icon
components/                  UI sections and combo browser components
content/combos/<engine>/     Open-source combo Markdown files
data/                        Engine metadata, card fallbacks, deck/resources
lib/                         Shared types, search, clipboard, utilities
scripts/validate-card-names.mjs
supabase/migrations/          Database schema and RLS policies
.github/workflows/           PR validation workflow
LICENSE                      MIT license for project source and documentation
```

## Accounts, Voting, And Editor

Anonymous browsing remains fully available. When Supabase is configured, signed-in users can vote on any combo and submit combos through `/editor`.

Visual-editor submissions are saved to `combo_submissions` with `pending` status. Moderators and admins can review them at `/admin/submissions`, then approve, request changes, or reject. Approved database submissions are merged into the public combo feed alongside Markdown combos.

Use `profiles.role = 'moderator'` or `profiles.role = 'admin'` to grant review access.

## Add A Combo

Create a new `.md` file in `content/combos/<engine-id>/` with YAML frontmatter matching the existing examples.

Example path:

- `content/combos/<engine-id>/my-line.md`

```md
---
id: my-combo-id
engineId: example-engine
contributor: your-github-username
title: "My Combo"
category: Beginner Combos
difficulty: Beginner
starterCards:
  - "Official Starter Card Name"
cardNames:
  - "Official Starter Card Name"
  - "Official Follow-up Card Name"
cardCount: 1
turnPreference: Either
tags:
  - "setup"
otkPotential: false
prerequisites:
  - "Card or state needed"
steps:
  - "Step one."
notes:
  - "Important ruling or branch."
endBoard: "Final board summary."
variants:
  - "Optional branch."
videoPlaceholder: "Optional replay or video note."
masterDuelNote: "Optional simulator note."
---

Optional contributor notes can live here.
```

## Combo Schema

- `id`: Stable unique slug for links and favorites.
- `engineId`: Folder/engine id, for example `example-engine`.
- `contributor`: Username of the person who added or maintains the combo.
- `title`: Display name for the combo.
- `category`: One of `Beginner Combos`, `Main Deck Starters`, `OTK Lines`, `Going First`, `Going Second`, `Tricks & Tech`, or `Grind Game`.
- `difficulty`: `Beginner`, `Intermediate`, or `Advanced`.
- `starterCards`: Cards needed to start the route.
- `cardNames`: Every card referenced by the combo. Use exact official names.
- `cardCount`: Number of starter cards required.
- `turnPreference`: `Going First`, `Going Second`, or `Either`.
- `tags`: Searchable labels.
- `otkPotential`: `true` or `false`.
- `prerequisites`: Setup or hand requirements.
- `steps`: Numbered combo actions shown in the UI.
- `notes`: Rulings, interaction points, or matchup caveats.
- `endBoard`: Final state summary.
- `variants`: Optional alternate branches.

## Card Name Validation

The `cardNames` list powers card hover previews, starter thumbnails, and engine backgrounds. Every card should use the exact official YGOPRODeck name, including punctuation.

Run:

```bash
npm run validate:cards
```

The validator checks:

- Required frontmatter fields.
- Missing or duplicate `cardNames`.
- Starter cards missing from `cardNames`.
- Exact YGOPRODeck card-name matches.
- YGOPRODeck image URLs.

GitHub Actions runs the same check on pull requests that touch combo content, card fallback data, or the validator.

## Add A New Engine

1. Add engine metadata in `data/engines.ts`.
2. Create `content/combos/<engine-id>/`.
3. Add at least one combo Markdown file with valid `cardNames`.
4. Run `npm run validate:cards`.

No manual theme color is required. The site derives the engine background from the engine id and the first available card image in that engine's combo data.

## Content Guidelines

- Keep steps concise and action-oriented.
- Prefer official card names over shorthand.
- Add notes for banlist-sensitive lines.
- Add variants instead of creating near-duplicate combo files.
- Keep speculative or unverified lines clearly marked in notes.

## License

Open Combo Codex source code and project-authored documentation are released under the MIT License. See `LICENSE`.

Yu-Gi-Oh! card names, card text, card images, and related intellectual property are owned by their respective rights holders and are not covered by this project's MIT License.

## Disclaimer

Open Combo Codex is for educational purposes. Yu-Gi-Oh! card names, text, and images belong to their respective owners. Combo legality and sequencing can vary by banlist, region, simulator, and format.
