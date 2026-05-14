import type { CardPreview } from "@/lib/types";

const image = (id: number) => `https://images.ygoprodeck.com/images/cards/${id}.jpg`;

export const skyStrikerCards: Record<string, CardPreview> = {
  "Sky Striker Ace - Raye": {
    name: "Sky Striker Ace - Raye",
    type: "Warrior / Effect",
    imageUrl: image(26077387),
    description:
      "Quick Effect tribute into a Sky Striker Ace Link Monster, then returns from the GY when an Ace leaves by battle or opponent effect.",
  },
  "Sky Striker Ace - Roze": {
    name: "Sky Striker Ace - Roze",
    type: "Warrior / Effect",
    imageUrl: image(37351133),
    description:
      "Special Summons itself when a Sky Striker Ace is summoned, and can negate a face-up monster after an opponent's Extra Monster Zone monster leaves.",
  },
  "Sky Striker Ace - Kagari": {
    name: "Sky Striker Ace - Kagari",
    type: "Machine / Link / Effect",
    imageUrl: image(63288573),
    description: "Adds a Sky Striker Spell from the GY to hand on Link Summon and gains ATK for spells in the GY.",
  },
  "Sky Striker Ace - Shizuku": {
    name: "Sky Striker Ace - Shizuku",
    type: "Machine / Link / Effect",
    imageUrl: image(90673288),
    description: "Searches a different Sky Striker card during the End Phase and reduces opposing monsters' ATK/DEF.",
  },
  "Sky Striker Ace - Hayate": {
    name: "Sky Striker Ace - Hayate",
    type: "Machine / Link / Effect",
    imageUrl: image(8491308),
    description: "Can attack directly and sends a Sky Striker card from Deck to GY after battle damage.",
  },
  "Sky Striker Ace - Kaina": {
    name: "Sky Striker Ace - Kaina",
    type: "Machine / Link / Effect",
    imageUrl: image(12421694),
    description: "Prevents a monster from attacking and gives small LP gain when Sky Striker Spells are activated.",
  },
  "Sky Striker Ace - Zeke": {
    name: "Sky Striker Ace - Zeke",
    type: "Machine / Link / Effect",
    imageUrl: image(75147529),
    description: "Temporarily banishes an opponent's monster and can convert your board into extra pressure.",
  },
  "Sky Striker Ace - Zero": {
    name: "Sky Striker Ace - Zero",
    type: "Machine / Link / Effect",
    description: "Newer Sky Striker support used here as an extension point for modern sequencing notes.",
  },
  "Sky Striker Ace - Amatsu": {
    name: "Sky Striker Ace - Amatsu",
    type: "Machine / Link / Effect",
    description: "Newer Sky Striker support referenced for editable community route notes.",
  },
  "Sky Striker Mobilize - Engage!": {
    name: "Sky Striker Mobilize - Engage!",
    type: "Normal Spell",
    imageUrl: image(63166095),
    description:
      "Adds a Sky Striker card from Deck to hand, then draws 1 if you have 3 or more Spells in your GY.",
  },
  "Sky Striker Mecha - Hornet Drones": {
    name: "Sky Striker Mecha - Hornet Drones",
    type: "Quick-Play Spell",
    imageUrl: image(52340444),
    description: "Summons a Sky Striker Ace Token, usually converting any spell access into Kagari and Shizuku lines.",
  },
  "Sky Striker Maneuver - Linkage!": {
    name: "Sky Striker Maneuver - Linkage!",
    type: "Quick-Play Spell",
    imageUrl: image(46271408),
    description: "Sends a card you control to summon a Sky Striker Ace from the Extra Deck and can boost ATK.",
  },
  "Sky Striker Mobilize - Lemnisgate!": {
    name: "Sky Striker Mobilize - Lemnisgate!",
    type: "Normal Spell",
    description: "Newer support entry for open-source route documentation and format-specific updates.",
  },
  "Sky Striker Airspace - Area Zero": {
    name: "Sky Striker Airspace - Area Zero",
    type: "Field Spell",
    imageUrl: image(50005218),
    description:
      "Excavates for Sky Striker cards by targeting another card you control, and summons Raye from Deck if sent to the GY by card effect.",
  },
  "Sky Striker Mecha - Widow Anchor": {
    name: "Sky Striker Mecha - Widow Anchor",
    type: "Quick-Play Spell",
    imageUrl: image(98338152),
    description: "Negates a face-up monster, then can take control with 3 or more Spells in the GY.",
  },
  "Sky Striker Mecha - Shark Cannon": {
    name: "Sky Striker Mecha - Shark Cannon",
    type: "Quick-Play Spell",
    imageUrl: image(51227866),
    description: "Banishes a monster from the opponent's GY, or summons it to your field with 3 or more Spells in GY.",
  },
  "Sky Striker Mecha Modules - Multirole": {
    name: "Sky Striker Mecha Modules - Multirole",
    type: "Continuous Spell",
    imageUrl: image(24010609),
    description: "Protects your spell activations and resets Sky Striker Spells during the End Phase.",
  },
};

export const skyStrikerCardNames = Object.keys(skyStrikerCards);
