export type StatKey =
    | "AGILITY"
    | "HEALTH"
    | "LUCK"
    | "WISDOM"
    | "STRENGTH"
    | "FORTUNE"
    | "DEFENSE"
    | "INTELLIGENCE"
    // New Stats SEASON 1
    | "ATTACK_SPEED"
    | "ENDURANCE"
    | "CHARISMA"
    | "MOVEMENT_SPEED"
    | "DEXTERITY"
    | "VITALITY"
    | "FARMING_FORTUNE"
    | "WOODCUTTING_FORTUNE"
    | "MINING_FORTUNE"
    | "FISHING_FORTUNE"
    | "GATHERING_FORTUNE"
    | "LOOTING_FORTUNE";

export type StatMap = Partial<Record<StatKey, number>>;

export type Skull = {
    id: string;
    name: string;
    icon?: string;
    stats: StatMap;
};


export const SKULLS: Skull[] = [
    {
        id: "basic",
        name: "Basic skull",
        icon: "/media/skulls/basic.png",
        stats: { WISDOM: 25, HEALTH: 25 },
    },
    {
        id: "pineapple",
        name: "Pineapple skull",
        icon: "/media/skulls/pineapple.png",
        stats: { LUCK: 50, HEALTH: 25 },
    },
    {
        id: "chad",
        name: "Chad skull",
        icon: "/media/skulls/chad.png",
        stats: { STRENGTH: 250 },
    },
    {
        id: "thunder",
        name: "Thunder skull",
        icon: "/media/skulls/thunder.png",
        stats: { LUCK: 100, INTELLIGENCE: 100 },
    },
    {
        id: "opal",
        name: "Opal skull",
        icon: "/media/skulls/opal.png",
        stats: { LUCK: 200, INTELLIGENCE: 200, AGILITY: 200, STRENGTH: 200 },
    },
    {
        id: "grumpy",
        name: "Grumpy skull",
        icon: "/media/skulls/grumpy.png",
        stats: { INTELLIGENCE: 100, STRENGTH: 100 },
    },
    {
        id: "crimson",
        name: "Crimson skull",
        icon: "/media/skulls/crimson.png",
        stats: { INTELLIGENCE: 250, AGILITY: 250, DEFENSE: 100 },
    },
    {
        id: "jackpot",
        name: "Jackpot skull",
        icon: "/media/skulls/jackpot.png",
        stats: { FORTUNE: 250 },
    },
    {
        id: "sage",
        name: "Sage skull",
        icon: "/media/skulls/sage.png",
        stats: { WISDOM: 80 },
    },
    {
        id: "abyss",
        name: "Abyss skull",
        icon: "/media/skulls/abyss.png",
        stats: { WISDOM: 250, LUCK: 250 },
    },
];

export function sumSkullStats(ids: string[]): StatMap {
    const out: StatMap = {};
    for (const id of ids) {
        const s = SKULLS.find((k) => k.id === id);
        if (!s) continue;
        for (const [stat, val] of Object.entries(s.stats) as Array<[StatKey, number]>) {
            out[stat] = (out[stat] ?? 0) + (val ?? 0);
        }
    }
    return out;
}
