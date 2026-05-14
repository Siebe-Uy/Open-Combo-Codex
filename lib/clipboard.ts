import type { Combo } from "@/lib/types";

export function formatComboForClipboard(combo: Combo) {
  return [
    `${combo.title}`,
    "",
    `Prerequisites: ${combo.prerequisites.join("; ")}`,
    "",
    ...combo.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `End board: ${combo.endBoard}`,
    combo.notes.length ? `Notes: ${combo.notes.join(" ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function copyText(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}
