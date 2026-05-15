import Link from "next/link";
import { Code2, ExternalLink, FilePlus2, GitBranch, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const repositoryUrl = "https://github.com/Siebe-Uy/Open-Combo-Codex";

const contributionSteps: Array<{
  Icon: LucideIcon;
  title: string;
  text: string;
}> = [
  {
    Icon: FilePlus2,
    title: "Add a file",
    text: "Create `content/combos/<engine-id>/new-line.md`.",
  },
  {
    Icon: Code2,
    title: "Use frontmatter",
    text: "Fill title, starters, steps, notes, and end board.",
  },
  {
    Icon: GitBranch,
    title: "Open a PR",
    text: "Reviewers can audit one combo at a time.",
  },
];

export function ContributionPanel() {
  return (
    <section id="contribute" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-panel overflow-hidden rounded-[2.5rem] p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-striker-cyan">Open-source by design</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Combos are Markdown, not locked content</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Open Combo Codex is built so players can correct lines, add variants, and publish new engines by
              editing plain `.md` files in a GitHub repo. The app turns those files into searchable combo cards.
            </p>
            <div className="mt-5 flex gap-3 rounded-2xl border border-striker-cyan/20 bg-cyan-300/[0.06] p-4 text-sm leading-6 text-slate-200">
              <PenLine className="mt-0.5 h-5 w-5 shrink-0 text-striker-cyan" aria-hidden />
              <div>
                <p className="font-semibold text-white">Visual editor</p>
                <p className="mt-1 text-slate-300">
                  <strong className="text-slate-100">Sign in</strong> with the button in the top-right header, then use the{" "}
                  <Link href="/editor" className="font-semibold text-striker-cyan underline-offset-2 hover:underline">
                    visual editor
                  </Link>{" "}
                  to fill out a combo and submit it for review—no GitHub CLI or Markdown workflow needed for new lines on existing engines.
                </p>
              </div>
            </div>
            <Button asChild className="mt-6" variant="secondary">
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                <GitBranch className="h-4 w-4" />
                Contribute on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {contributionSteps.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <Icon className="h-6 w-6 text-striker-magenta" />
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
