
import type { Equipment, EquippedItems, PlayerStats } from "types/equipment";
import { computePetBoostedStats } from "./petStats";

export const calculateTotalStats = (equippedItems: {
    [key: string]: Equipment | null;
}): PlayerStats => {
    const total: PlayerStats = {};
    Object.values(equippedItems).forEach((item) => {
        if (!item?.stats) return;
        for (const [name, range] of Object.entries(item.stats)) {
            total[name] ??= [0, 0];
            total[name][0] += range[0] || 0;
            total[name][1] += range[1] ?? range[0] ?? 0;
        }
    });
    return total;
};

export const formatStatRange = (range: number[]): string =>
    range[0] === range[1] ? `${range[0]}` : `${range[0]} - ${range[1]}`;


export function mergeAllEquipmentStats(
  equippedItems: EquippedItems,
  petGeneration: number,
  petTrait: string,
  petEnchanted: boolean
): PlayerStats {
  const merged: PlayerStats = {};

  for (const equip of Object.values(equippedItems)) {
    if (!equip?.stats) continue;

    let statsToAdd = equip.stats;

    // if pet, use the boost, else do nothing
    if (equip.category?.toUpperCase() === "PET") {
      statsToAdd = computePetBoostedStats(equip, {
        generation: petGeneration,
        trait: petTrait,
        enchanted: petEnchanted,
      });
    }

    // Merge each stat [min, max]
    for (const [stat, arr] of Object.entries(statsToAdd)) {
      if (!merged[stat]) merged[stat] = [0, 0];
      merged[stat][0] += arr[0];
      merged[stat][1] += arr[1];
    }
  }

  return merged;
}
