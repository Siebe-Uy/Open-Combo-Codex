import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const root = process.cwd();
const combosRoot = path.join(root, "content", "combos");
const dataRoot = path.join(root, "data");
const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

const requiredComboFields = [
  "id",
  "engineId",
  "contributor",
  "title",
  "starterCards",
  "cardNames",
  "steps",
  "endBoard",
];
const cardCache = new Map();

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

function getLocalFallbackCardNames() {
  if (!fs.existsSync(dataRoot)) {
    return new Set();
  }

  const cardFiles = fs
    .readdirSync(dataRoot)
    .filter((fileName) => fileName.endsWith("-cards.ts"))
    .map((fileName) => path.join(dataRoot, fileName));

  const names = cardFiles.flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    return [...source.matchAll(/^\s{2}"([^"]+)":\s\{/gm)].map((match) => match[1]);
  });

  return new Set(names);
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function reportError(filePath, message) {
  const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
  console.error(`::error file=${relativePath},title=Card name validation::${message}`);
  console.error(`${relativePath}: ${message}`);
}

async function checkYgoProDeck(name) {
  if (cardCache.has(name)) {
    return cardCache.get(name);
  }

  const url = `${apiUrl}?name=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url);
    const result = { ok: false, hasImage: false };

    if (response.ok) {
      const payload = await response.json();
      const exactCard = payload.data?.find((card) => card.name === name);
      result.ok = Boolean(exactCard);
      result.hasImage = Boolean(exactCard?.card_images?.[0]?.image_url);
    }

    cardCache.set(name, result);
    return result;
  } catch (error) {
    const result = { ok: false, hasImage: false, error };
    cardCache.set(name, result);
    return result;
  }
}

async function validate() {
  const files = walkMarkdownFiles(combosRoot);
  const localFallbackNames = getLocalFallbackCardNames();
  let failed = false;

  for (const filePath of files) {
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    const data = parsed.data;

    for (const field of requiredComboFields) {
      if (data[field] === undefined) {
        reportError(filePath, `Missing required frontmatter field "${field}".`);
        failed = true;
      }
    }

    const starterCards = asStringArray(data.starterCards);
    const cardNames = asStringArray(data.cardNames);

    if (!cardNames.length) {
      reportError(filePath, 'Add every referenced card to the "cardNames" frontmatter list.');
      failed = true;
      continue;
    }

    for (const starterCard of starterCards) {
      if (!cardNames.includes(starterCard)) {
        reportError(filePath, `"${starterCard}" is in starterCards but missing from cardNames.`);
        failed = true;
      }
    }

    const duplicateNames = cardNames.filter((name, index) => cardNames.indexOf(name) !== index);
    for (const duplicateName of new Set(duplicateNames)) {
      reportError(filePath, `"${duplicateName}" appears more than once in cardNames.`);
      failed = true;
    }

    for (const cardName of cardNames) {
      const result = await checkYgoProDeck(cardName);
      const hasLocalFallback = localFallbackNames.has(cardName);

      if (!result.ok && !hasLocalFallback) {
        reportError(
          filePath,
          `"${cardName}" was not found as an exact YGOPRODeck card name. Check spelling, punctuation, and capitalization.`,
        );
        failed = true;
        continue;
      }

      if (result.ok && !result.hasImage) {
        reportError(filePath, `"${cardName}" exists in YGOPRODeck but has no image URL.`);
        failed = true;
      }

      if (!result.ok && hasLocalFallback) {
        console.warn(`Local fallback used for "${cardName}". Add/update YGOPRODeck data when available.`);
      }
    }
  }

  if (failed) {
    process.exitCode = 1;
    return;
  }

  console.log(`Validated card names for ${files.length} combo files.`);
}

await validate();
