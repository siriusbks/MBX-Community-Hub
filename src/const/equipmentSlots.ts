import type { EquipmentSlot } from "types/equipment";

/**
 * Layout: 3 columns × 4 rows (approx) in a container 350×520px
 *
 *  Col L (20%)   Col C (50%)   Col R (80%)
 *  ─────────────────────────────────────────
 *  necklace      helmet        ring1         row 1  top ~8%
 *  backpack      chestplate    ring2         row 2  top ~28%
 *  belt          leggings      gloves        row 3  top ~48%
 *  pet           boots         class         row 4  top ~68%
 *
 * NOTE: rarity color helpers (getRarityColor / getRarityBadge) used to live
 * here. They have been removed in favor of the rework-native rarity system
 * in `@const/rarities` (RarityBorder, RarityBadge, RarityTooltip).
 */
export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
    // Row 1
    { id: "necklace", name: "Necklace", category: "NECKLACE", image: "", position: { top: "8%", left: "20%" } },
    { id: "helmet", name: "Helmet", category: "HELMET", image: "", position: { top: "8%", left: "50%" } },
    { id: "ring1", name: "Ring 1", category: "RING", image: "", position: { top: "8%", left: "80%" } },

    // Row 2
    { id: "backpack", name: "Backpack", category: "BACK", image: "", position: { top: "28%", left: "20%" } },
    { id: "chestplate", name: "Chestplate", category: "CHESTPLATE", image: "", position: { top: "28%", left: "50%" } },
    { id: "ring2", name: "Ring 2", category: "RING", image: "", position: { top: "28%", left: "80%" } },

    // Row 3
    { id: "belt", name: "Belt", category: "BELT", image: "", position: { top: "48%", left: "20%" } },
    { id: "leggings", name: "Leggings", category: "LEGGINGS", image: "", position: { top: "48%", left: "50%" } },
    { id: "gloves", name: "Gloves", category: "GLOVES", image: "", position: { top: "48%", left: "80%" } },

    // Row 4
    { id: "pet", name: "Pet", category: "PET", image: "", position: { top: "68%", left: "20%" } },
    { id: "boots", name: "Boots", category: "BOOTS", image: "", position: { top: "68%", left: "50%" } },
    { id: "class", name: "Class", category: "CLASS", image: "", position: { top: "68%", left: "80%" } },
];
