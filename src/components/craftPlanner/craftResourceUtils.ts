import type { CraftRecipe } from "./craftPlannerTypes";

export const NO_DECOMPOSE_PREFIXES = [
    "transformed_",
    "bag_",
    "crate_",
    "barrel_",
    "enchanted_b",
    "enchanted_c",
    "enchanted_k",
    "enchanted_m",
    "enchanted_n",
    "enchanted_p",
    "enchanted_s",
    "enchanted_w",
];

function shouldDecompose(id: string): boolean {
    if (!id) return true;
    return !NO_DECOMPOSE_PREFIXES.some((prefix) => id.startsWith(prefix));
}

/** Recursively groups the basic (non-craftable) resources required for a recipe. */
export function gatherResources(recipe: CraftRecipe | null | undefined): Record<string, number> {
    const total: Record<string, number> = {};
    if (!recipe?.ingredients) return total;

    for (const ing of recipe.ingredients) {
        const amount = ing.amount ?? 1;
        const subRecipe = ing.item?.recipe;

        if (subRecipe?.ingredients?.length && shouldDecompose(ing.id)) {
            const subTotal = gatherResources(subRecipe);
            for (const [subId, subQty] of Object.entries(subTotal)) {
                total[subId] = (total[subId] ?? 0) + subQty * amount;
            }
        } else {
            total[ing.id] = (total[ing.id] ?? 0) + amount;
        }
    }

    return total;
}

/** Recursively groups ONLY the crafted (sub-recipe) items required, excluding NO_DECOMPOSE items. */
export function gatherCraftsOnly(recipe: CraftRecipe | null | undefined): Record<string, number> {
    const total: Record<string, number> = {};
    if (!recipe?.ingredients) return total;

    for (const ing of recipe.ingredients) {
        const amount = ing.amount ?? 1;
        const subRecipe = ing.item?.recipe;

        if (subRecipe?.ingredients?.length && shouldDecompose(ing.id)) {
            total[ing.id] = (total[ing.id] ?? 0) + amount;

            const subCrafts = gatherCraftsOnly(subRecipe);
            for (const [subId, subQty] of Object.entries(subCrafts)) {
                total[subId] = (total[subId] ?? 0) + subQty * amount;
            }
        }
    }

    return total;
}

/** Merges several {id: qty} maps into one, summing quantities. */
export function mergeQuantityMaps(maps: Record<string, number>[]): Record<string, number> {
    const total: Record<string, number> = {};
    for (const map of maps) {
        for (const [id, qty] of Object.entries(map)) {
            total[id] = (total[id] ?? 0) + qty;
        }
    }
    return total;
}
