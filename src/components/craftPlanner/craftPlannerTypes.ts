export interface CraftIngredient {
    type: "custom" | "vanilla" | string;
    id: string;
    amount: number;
    item?: CraftItem;
}

export interface CraftRecipe {
    id: string;
    job?: string;
    amount?: number;
    ingredients?: CraftIngredient[];
}

export interface CraftItem {
    id: string;
    type?: string;
    rarity?: string;
    image?: string; // base64, no "data:image/..." prefix
    level?: number;
    name: string;
    lore?: string;
    description?: string;
    recipe?: CraftRecipe | null;
}

export interface CraftGroup {
    category: string;
    items: string[];
}
