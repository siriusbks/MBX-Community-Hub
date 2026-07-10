import type { Equipment } from "types/equipment";


export const TRAIT_STAT_MAP: Record<string, { stat: string; trait: string }> = {
  mining:       { stat: "STRENGTH", trait: "strong" },
  woodcutting:  { stat: "DEFENSE", trait: "loud" },
  gathering:    { stat: "LUCK", trait: "sensitive" },
  slaining:     { stat: "AGILITY", trait: "naughty" },
  fishing:      { stat: "WISDOM", trait: "calm" },
  farming:      { stat: "FORTUNE", trait: "persistent" },
  crafting:     { stat: "INTELLIGENCE", trait: "genius" },
  eating:       { stat: "HEALTH", trait: "glutton" }
};

export function jobFromTrait(trait: string | null): string | null {
  if (!trait) return null;
  return (
    Object.entries(TRAIT_STAT_MAP)
      .find(([, value]) => value.trait === trait)?.[0] ?? null
  );
}

export function computePetBoostedStats(
  pet: Equipment | null,
  options: {
    generation: number;
    trait: string;
    enchanted: boolean;
  }
): { [key: string]: [number, number] } {
  if (!pet?.stats) return {};

  const { generation, trait, enchanted } = options;
  const petJob = jobFromTrait(trait);
  const out: { [key: string]: [number, number] } = {};

  Object.entries(pet.stats).forEach(([statKey, [min, max]]) => {
    let coef = 1;
    if (generation > 1) coef += generation * 0.1; // 1 => 0%, 2 => 20%...
    if (enchanted) {
      coef += 0.2;  // Enchanted : +20% all stats
    } else if (
      trait &&
      petJob &&
      TRAIT_STAT_MAP[petJob]?.trait === trait &&
      TRAIT_STAT_MAP[petJob]?.stat === statKey
    ) {
      coef += 0.2; // Trait bonus : +20% this stat (if it's a stat affected by the job's trait)
    }
    out[statKey] = [Math.round(min * coef), Math.round(max * coef)];
  });

  return out;
}
