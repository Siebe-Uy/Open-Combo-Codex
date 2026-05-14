import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Combo } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content", "combos");

type ComboFrontmatter = Omit<Combo, "sourcePath">;

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeCombo(data: Record<string, unknown>, sourcePath: string): Combo {
  const combo = data as Partial<ComboFrontmatter>;

  return {
    id: String(combo.id),
    engineId: String(combo.engineId),
    contributor: String(combo.contributor ?? "Unknown"),
    title: String(combo.title),
    category: combo.category ?? "Beginner Combos",
    difficulty: combo.difficulty ?? "Beginner",
    starterCards: asStringArray(combo.starterCards),
    cardNames: asStringArray(combo.cardNames),
    cardCount: Number(combo.cardCount ?? 1),
    turnPreference: combo.turnPreference ?? "Either",
    tags: asStringArray(combo.tags),
    otkPotential: Boolean(combo.otkPotential),
    prerequisites: asStringArray(combo.prerequisites),
    steps: asStringArray(combo.steps),
    notes: asStringArray(combo.notes),
    endBoard: String(combo.endBoard ?? ""),
    variants: asStringArray(combo.variants),
    videoPlaceholder: combo.videoPlaceholder ? String(combo.videoPlaceholder) : undefined,
    masterDuelNote: combo.masterDuelNote ? String(combo.masterDuelNote) : undefined,
    sourcePath,
  };
}

export function getCombosFromMarkdown(): Combo[] {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  const engineDirs = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return engineDirs
    .flatMap((engineDir) => {
      const comboDir = path.join(contentRoot, engineDir);

      return fs
        .readdirSync(comboDir)
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
          const fullPath = path.join(comboDir, fileName);
          const file = fs.readFileSync(fullPath, "utf8");
          const parsed = matter(file);
          const sourcePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");

          return normalizeCombo(parsed.data, sourcePath);
        });
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
}
