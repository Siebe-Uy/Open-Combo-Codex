"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Check, Clipboard, Plus, Send, Trash2 } from "lucide-react";
import type { Engine } from "@/lib/types";
import { comboInputToMarkdown, type ComboInput } from "@/lib/schemas/combo";
import { Button } from "@/components/ui/button";

type ComboEditorProps = {
  engines: Engine[];
  contributor: string;
  canSubmit: boolean;
};

const repositoryUrl = "https://github.com/Siebe-Uy/Open-Combo-Codex";

const defaultCombo: ComboInput = {
  id: "new-combo-line",
  engineId: "sky-striker",
  contributor: "anonymous",
  title: "New combo line",
  category: "Main Deck Starters",
  difficulty: "Beginner",
  starterCards: ["Starter card"],
  cardNames: ["Starter card"],
  cardCount: 1,
  turnPreference: "Either",
  tags: ["starter"],
  otkPotential: false,
  prerequisites: ["Open the starter card."],
  steps: ["Resolve your starter and build toward the end board."],
  notes: ["Add sequencing notes and choke points."],
  endBoard: "Describe the end board.",
  variants: [],
};

export function ComboEditor({ engines, contributor, canSubmit }: ComboEditorProps) {
  const [combo, setCombo] = useState<ComboInput>({ ...defaultCombo, contributor, engineId: engines[0]?.id ?? "sky-striker" });
  const [cardQuery, setCardQuery] = useState("");
  const [cardResults, setCardResults] = useState<Array<{ name: string; type: string }>>([]);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const markdown = useMemo(() => comboInputToMarkdown(combo), [combo]);

  function update<K extends keyof ComboInput>(key: K, value: ComboInput[K]) {
    setCombo((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setStatus(null);
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(combo),
    });

    const data = (await response.json().catch(() => null)) as { id?: string; error?: string } | null;
    setStatus(response.ok ? `Submitted for review: ${data?.id}` : data?.error ?? "Submission failed.");
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function searchCards() {
    if (cardQuery.trim().length < 2) {
      setCardResults([]);
      return;
    }

    const response = await fetch(`/api/card-search?q=${encodeURIComponent(cardQuery.trim())}`);
    const data = (await response.json().catch(() => null)) as { cards?: Array<{ name: string; type: string }> } | null;
    setCardResults(data?.cards ?? []);
  }

  function addCardName(cardName: string) {
    setCombo((current) => ({
      ...current,
      cardNames: current.cardNames.includes(cardName) ? current.cardNames : [...current.cardNames, cardName],
    }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <form className="glass-panel space-y-5 rounded-[2rem] p-5" onSubmit={(event) => event.preventDefault()}>
        <div
          role="status"
          className="flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-4 text-sm leading-relaxed text-amber-50"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
          <div>
            <p className="font-bold text-amber-100">Engines are added via GitHub only</p>
            <p className="mt-1 text-amber-100/90">
              New engines cannot be created in this editor. Add engine metadata and a combo folder by opening a pull request on the repository.
            </p>
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold text-striker-cyan underline-offset-2 hover:underline"
            >
              Repository — contribute with a PR
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug">
            <input className={inputClass} value={combo.id} onChange={(event) => update("id", slugify(event.target.value))} />
          </Field>
          <Field label="Engine">
            <select className={inputClass} value={combo.engineId} onChange={(event) => update("engineId", event.target.value)}>
              {engines.map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <input className={inputClass} value={combo.title} onChange={(event) => update("title", event.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={combo.category} onChange={(event) => update("category", event.target.value as ComboInput["category"])}>
              {["Beginner Combos", "Main Deck Starters", "OTK Lines", "Going First", "Going Second", "Tricks & Tech", "Grind Game"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Difficulty">
            <select className={inputClass} value={combo.difficulty} onChange={(event) => update("difficulty", event.target.value as ComboInput["difficulty"])}>
              {["Beginner", "Intermediate", "Advanced"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Turn">
            <select className={inputClass} value={combo.turnPreference} onChange={(event) => update("turnPreference", event.target.value as ComboInput["turnPreference"])}>
              {["Going First", "Going Second", "Either"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Card count">
            <input className={inputClass} type="number" min={1} max={10} value={combo.cardCount} onChange={(event) => update("cardCount", Number(event.target.value))} />
          </Field>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200">
            <input type="checkbox" checked={combo.otkPotential} onChange={(event) => update("otkPotential", event.target.checked)} />
            OTK potential
          </label>
        </div>

        <ArrayEditor label="Starter cards" values={combo.starterCards} onChange={(values) => update("starterCards", values)} />
        <ArrayEditor label="Card names" values={combo.cardNames} onChange={(values) => update("cardNames", values)} />
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClass}
              placeholder="Search official card names"
              value={cardQuery}
              onChange={(event) => setCardQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  searchCards();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={searchCards}>
              Search cards
            </Button>
          </div>
          {cardResults.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {cardResults.map((card) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => addCardName(card.name)}
                  className="focus-ring rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1 text-xs text-cyan-100 transition hover:bg-cyan-300/[0.12]"
                >
                  {card.name}
                </button>
              ))}
            </div>
          ) : null}
        </section>
        <ArrayEditor label="Prerequisites" values={combo.prerequisites} onChange={(values) => update("prerequisites", values)} />
        <ArrayEditor label="Steps" values={combo.steps} multiline onChange={(values) => update("steps", values)} />
        <ArrayEditor label="Notes" values={combo.notes} multiline onChange={(values) => update("notes", values)} />
        <ArrayEditor label="Variants" values={combo.variants} multiline onChange={(values) => update("variants", values)} />

        <Field label="End board">
          <textarea className={inputClass} rows={3} value={combo.endBoard} onChange={(event) => update("endBoard", event.target.value)} />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={submit} disabled={!canSubmit}>
            <Send className="h-4 w-4" />
            Submit for review
          </Button>
          <Button type="button" variant="secondary" onClick={copyMarkdown}>
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
        </div>
        {status ? <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200">{status}</p> : null}
        {!canSubmit ? (
          <p className="text-sm text-amber-200">
            Database submissions need Supabase env vars on this deployment. Markdown export still works; paste into GitHub if needed.
          </p>
        ) : null}
      </form>

      <aside className="space-y-4">
        <section className="glass-panel rounded-[2rem] p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-striker-cyan">Live Preview</p>
          <h2 className="mt-3 text-2xl font-bold text-white">{combo.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{combo.prerequisites.join(" • ")}</p>
          <ol className="mt-4 space-y-2 text-sm text-slate-200">
            {combo.steps.map((step: string, index: number) => (
              <li key={`${step}-${index}`} className="rounded-2xl bg-white/[0.04] p-3">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-slate-300">
            <span className="font-semibold text-white">End board:</span> {combo.endBoard}
          </p>
        </section>
        <section className="glass-panel rounded-[2rem] p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">Markdown Export</p>
          <pre className="mt-4 max-h-[32rem] overflow-auto rounded-2xl bg-slate-950/80 p-4 text-xs leading-5 text-slate-200">{markdown}</pre>
        </section>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-200">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ArrayEditor({
  label,
  values,
  multiline,
  onChange,
}: {
  label: string;
  values: string[];
  multiline?: boolean;
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...values, ""])}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            {multiline ? (
              <textarea
                className={inputClass}
                rows={2}
                value={value}
                onChange={(event) => onChange(replaceAt(values, index, event.target.value))}
              />
            ) : (
              <input className={inputClass} value={value} onChange={(event) => onChange(replaceAt(values, index, event.target.value))} />
            )}
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60";

function replaceAt(values: string[], index: number, value: string) {
  return values.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
