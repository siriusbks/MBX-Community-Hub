export interface ClassTier {
    stats?: Record<string, number | string>;
    core_attributes?: string[];
}
 
export interface MineboxClass {
    id: string;
    name: string;
    description?: string;
    lore?: string;
    image?: string; // base64, no "data:image/..." prefix
    rarity: string;
    passive?: string;
    auto_attack?: Record<string, string>;
    spell_unlocks?: Record<string, string[]>;
    types?: string[];
    enabled?: boolean;
    // Keys "1".."5", plus an optional "all" tier that's always active.
    tiers: Record<string, ClassTier>;
}