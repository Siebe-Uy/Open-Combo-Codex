import type { CardPreview } from "@/lib/types";

export const kewlTuneCards: Record<string, CardPreview> = {
  "Kewl Tune Clip": {
    name: "Kewl Tune Clip",
    type: "Tuner / Effect",
    description:
      "Hand-trap style extender during the opponent's Main Phase that can immediately Synchro Summon a Tuner Synchro Monster.",
  },
  "Kewl Tune Cue": {
    name: "Kewl Tune Cue",
    type: "Tuner / Effect",
    description:
      "Normal Summon starter that Special Summons another Tuner from hand, Deck, or GY, then locks you into Tuners.",
  },
  "Kewl Tune Mix": {
    name: "Kewl Tune Mix",
    type: "Tuner / Effect",
    description:
      "Adds a non-Level 2 Kewl Tune monster on summon and can destroy an opponent's monster when used as Synchro Material.",
  },
  "Kewl Tune Reco": {
    name: "Kewl Tune Reco",
    type: "Tuner / Effect",
    description:
      "Adds a non-Level 3 Kewl Tune monster on summon and can destroy an opponent's Spell/Trap when used as Synchro Material.",
  },
  "Kewl Tune Rotary": {
    name: "Kewl Tune Rotary",
    type: "Tuner / Effect",
    description:
      "Reveals itself with another Tuner to Normal Summon a Tuner, then can recover Spell/Trap access or disrupt GY when used as material.",
  },
  "Kewl Tune Crackle": {
    name: "Kewl Tune Crackle",
    type: "Synchro Tuner / Effect",
    description:
      "Clip-based Synchro Tuner that pressures the opponent's Extra Deck and can revive itself after being sent to GY.",
  },
  "Kewl Tune Loudness War": {
    name: "Kewl Tune Loudness War",
    type: "Synchro Tuner / Effect",
    description:
      "Protects other Tuners and can banish Kewl Tune monsters from GY to reuse their Synchro Material trigger effects.",
  },
  "Kewl Tune Remix": {
    name: "Kewl Tune Remix",
    type: "Synchro Tuner / Effect",
    description:
      "Mix-based Synchro Tuner that trades itself on the opponent's turn to recycle and summon non-Synchro Tuners before Synchro Summoning.",
  },
  "Kewl Tune Synchro": {
    name: "Kewl Tune Synchro",
    type: "Normal Spell",
    description:
      "Searches a Kewl Tune card, then can immediately Synchro Summon a Tuner Synchro Monster while locking later summons into Tuners.",
  },
  "Kewl Tune Playlist": {
    name: "Kewl Tune Playlist",
    type: "Normal Trap",
    description:
      "Applies a Kewl Tune monster's Synchro Material trigger from field or GY, then returns that monster to hand.",
  },
  "JJ \"Kewl Tune\"": {
    name: "JJ \"Kewl Tune\"",
    type: "Field Spell",
    description:
      "Grants an extra Normal Summon for Tuners and can Tribute a Tuner to add or Special Summon a Kewl Tune monster from Deck.",
  },
  "Kewl Tune B2B": {
    name: "Kewl Tune B2B",
    type: "Synchro Tuner / Effect",
    description:
      "Level 10 boss that enables second attacks for Tuners and can extend into more Synchro Summons when opponent monster effects activate.",
  },
};

export const kewlTuneCardNames = Object.keys(kewlTuneCards);
