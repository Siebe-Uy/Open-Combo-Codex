import { z } from "zod";

export const difficultySchema = z.enum(["Beginner", "Intermediate", "Advanced"]);
export const turnPreferenceSchema = z.enum(["Going First", "Going Second", "Either"]);
export const categorySchema = z.enum([
  "Beginner Combos",
  "Main Deck Starters",
  "OTK Lines",
  "Going First",
  "Going Second",
  "Tricks & Tech",
  "Grind Game",
]);

const stringList = z.array(z.string().trim().min(1));

export const comboInputSchema = z.object({
  id: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  engineId: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contributor: z.string().trim().min(2).max(40),
  title: z.string().trim().min(4).max(140),
  category: categorySchema,
  difficulty: difficultySchema,
  starterCards: stringList.min(1),
  cardNames: stringList.min(1),
  cardCount: z.coerce.number().int().min(1).max(10),
  turnPreference: turnPreferenceSchema,
  tags: stringList,
  otkPotential: z.boolean().default(false),
  prerequisites: stringList.min(1),
  steps: stringList.min(1),
  notes: stringList,
  endBoard: z.string().trim().min(4).max(500),
  variants: stringList,
  videoPlaceholder: z.string().trim().max(300).optional().or(z.literal("")),
  masterDuelNote: z.string().trim().max(300).optional().or(z.literal("")),
});

export type ComboInput = z.infer<typeof comboInputSchema>;

export function normalizeComboInput(input: unknown) {
  const combo = comboInputSchema.parse(input);

  return {
    ...combo,
    tags: combo.tags.map((tag) => tag.toLowerCase()),
    videoPlaceholder: combo.videoPlaceholder || undefined,
    masterDuelNote: combo.masterDuelNote || undefined,
  };
}

export function comboInputToMarkdown(combo: ComboInput) {
  const line = (key: string, value: string | number | boolean) => `${key}: ${JSON.stringify(value)}`;
  const list = (key: string, values: string[]) => [
    `${key}:`,
    ...values.map((value) => `  - ${JSON.stringify(value)}`),
  ].join("\n");

  const frontmatter = [
    "---",
    line("id", combo.id),
    line("engineId", combo.engineId),
    line("contributor", combo.contributor),
    line("title", combo.title),
    line("category", combo.category),
    line("difficulty", combo.difficulty),
    list("starterCards", combo.starterCards),
    list("cardNames", combo.cardNames),
    line("cardCount", combo.cardCount),
    line("turnPreference", combo.turnPreference),
    list("tags", combo.tags),
    line("otkPotential", combo.otkPotential),
    list("prerequisites", combo.prerequisites),
    list("steps", combo.steps),
    list("notes", combo.notes),
    line("endBoard", combo.endBoard),
    list("variants", combo.variants),
    combo.videoPlaceholder ? line("videoPlaceholder", combo.videoPlaceholder) : undefined,
    combo.masterDuelNote ? line("masterDuelNote", combo.masterDuelNote) : undefined,
    "---",
    "",
    "Contributor note: created with the Open Combo Codex visual editor.",
  ].filter(Boolean);

  return frontmatter.join("\n");
}
