import { Code2, FilePlus2, GitBranch } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const contributionSteps: Array<{
  Icon: LucideIcon;
  title: string;
  text: string;
}> = [
  {
    Icon: FilePlus2,
    title: "Add a file",
    text: "Create `content/combos/sky-striker/new-line.md`.",
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
