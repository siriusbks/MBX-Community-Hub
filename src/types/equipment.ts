export interface Equipment {
    id: string;
    name: string;
    category: string;
    rarity: string;
    image: string;
    stats?: { [key: string]: number[] };
    level?: number;
    set?: string;
}

export interface EquipmentSlot {
    image: string;
    id: string;
    name: string;
    category: string;
    position: { top: string; left: string };
    isClassSlot?: boolean;
    isPetSlot?: boolean;
}

export interface PlayerStats {
    [key: string]: number[];
}

export interface EquippedItems {
    [key: string]: Equipment | null;
}