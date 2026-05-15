import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/001_accounts_votes_submissions.sql", "utf8");
const envExample = readFileSync(".env.example", "utf8");

const requiredMigrationSnippets = [
  "create table if not exists public.profiles",
  "create table if not exists public.combo_votes",
  "create table if not exists public.combo_submissions",
  "create or replace view public.combo_vote_totals",
  "alter table public.profiles enable row level security",
  "alter table public.combo_votes enable row level security",
  "alter table public.combo_submissions enable row level security",
  "create policy \"Users manage their own votes\"",
  "create policy \"Moderators review submissions\"",
];

const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

const missingMigrationSnippets = requiredMigrationSnippets.filter((snippet) => !migration.includes(snippet));
const missingEnvVars = requiredEnvVars.filter((envVar) => !envExample.includes(envVar));

if (missingMigrationSnippets.length || missingEnvVars.length) {
  console.error("Supabase setup validation failed.");

  if (missingMigrationSnippets.length) {
    console.error("Missing migration snippets:");
    missingMigrationSnippets.forEach((snippet) => console.error(`- ${snippet}`));
  }

  if (missingEnvVars.length) {
    console.error("Missing .env.example variables:");
    missingEnvVars.forEach((envVar) => console.error(`- ${envVar}`));
  }

  process.exit(1);
}

console.log("Supabase setup validation passed.");
