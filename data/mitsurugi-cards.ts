import type { CardPreview } from "@/lib/types";

export const mitsurugiCards: Record<string, CardPreview> = {
  "Mitsurugi no Mikoto, Aramasa": {
    name: "Mitsurugi no Mikoto, Aramasa",
    type: "DARK Reptile / Effect",
    description:
      "Adds a Mitsurugi monster when Normal/Special Summoned or Tributed, and can protect another Reptile by tributing itself instead.",
  },
  "Mitsurugi no Mikoto, Saji": {
    name: "Mitsurugi no Mikoto, Saji",
    type: "DARK Reptile / Effect",
    description:
      "Adds a Mitsurugi Spell/Trap when Normal/Special Summoned or Tributed, making it the cleanest route to Ritual, Prayers, or Great Purification.",
  },
  "Mitsurugi no Mikoto, Kusanagi": {
    name: "Mitsurugi no Mikoto, Kusanagi",
    type: "DARK Reptile / Effect",
    description:
      "Recovers a Mitsurugi card from GY or banishment when summoned or Tributed, supporting grind loops.",
  },
  "Ame no Habakiri no Mitsurugi": {
    name: "Ame no Habakiri no Mitsurugi",
    type: "DARK Reptile / Ritual / Effect",
    description:
      "Reveals itself to Special Summon a Mitsurugi from Deck and Tribute a monster; when Tributed, it searches a Mitsurugi card and can Special Summon itself.",
  },
  "Futsu no Mitama no Mitsurugi": {
    name: "Futsu no Mitama no Mitsurugi",
    type: "DARK Reptile / Ritual / Effect",
    description:
      "Punishes opponent Special Summons by reviving Reptiles from GY, and searches plus revives itself when Tributed.",
  },
  "Ame no Murakumo no Mitsurugi": {
    name: "Ame no Murakumo no Mitsurugi",
    type: "DARK Reptile / Ritual / Effect",
    description:
      "Destroys all opponent monsters when Special Summoned and pressures effects with a discard-or-negate Quick Effect.",
  },
  "Mitsurugi Ritual": {
    name: "Mitsurugi Ritual",
    type: "Ritual Spell",
    description:
      "Ritual Summons Reptile Ritual Monsters from Deck or hand by tributing Reptiles from the listed zones.",
  },
  "Mitsurugi Prayers": {
    name: "Mitsurugi Prayers",
    type: "Quick-Play Spell",
    description:
      "Searches a Mitsurugi monster and can take 800 damage to Special Summon a Mitsurugi from hand or GY, with a bonus if you Tributed a Reptile at activation.",
  },
  "Mitsurugi Mirror": {
    name: "Mitsurugi Mirror",
    type: "Ritual Spell",
    description:
      "Ritual Summons Reptile Ritual Monsters from hand or GY, and can recycle itself when a core Mitsurugi Ritual you control is Tributed.",
  },
  "Mitsurugi Great Purification": {
    name: "Mitsurugi Great Purification",
    type: "Trap",
    description:
      "Tributes a Level 5 or higher Reptile to negate and destroy a card/effect, or revives a Reptile from GY by banishing itself.",
  },
};

export const mitsurugiCardNames = Object.keys(mitsurugiCards);
