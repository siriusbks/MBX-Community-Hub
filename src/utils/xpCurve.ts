// File used to do weird minebox job maths
// Have fun exploring this file ! (you won't have any fun)

export type XpJson = Record<string, { id: string; experience_per_level: number[]; }>;

export type StoreProfessionId =
  | "alchemy" | "blacksmithing" | "cooking" | "farming" | "fishing" | "hunting"
  | "jeweling" | "lumberjack" | "mining" | "shoemaking" | "tailoring" | "tinkering";

const STORE_TO_DATA_KEY: Record<StoreProfessionId, string> = {
  alchemy: "alchemist",
  blacksmithing: "blacksmith",
  cooking: "cook",
  farming: "farmer",
  fishing: "fisherman",
  hunting: "hunter",
  jeweling: "jeweler",
  lumberjack: "lumberjack",
  mining: "miner",
  shoemaking: "shoemaker",
  tailoring: "tailor",
  tinkering: "tinkerer",
};

const DATA_URL = "/assets/data/skillXp.json";

// cache JSON once
let xpData: XpJson | null = null;
async function loadXpData(): Promise<XpJson> {
  if (xpData) return xpData;
  const res = await fetch(DATA_URL, {
    // use "no-cache" in dev to avoid stale JSON; switch to "force-cache" for prod + versioned URL
    cache: "no-cache",
  });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
  xpData = (await res.json()) as XpJson;
  return xpData;
}

// arr[0] is level 1, and so on
function normalizePerLevel(arr: number[]): number[] {
  if (!arr.length) return [];
  return arr[0] === 0 ? arr.slice() : [0, ...arr];
}

async function perLevel(job: StoreProfessionId): Promise<number[]> {
  const data = await loadXpData();
  const key = STORE_TO_DATA_KEY[job];
  return normalizePerLevel(data[key]?.experience_per_level ?? []);
}

// cumulative[L] = total XP to reach level L (sum of lvl1..L). cumulative[0] = 0.
async function cumulative(job: StoreProfessionId): Promise<number[]> {
  const per = await perLevel(job);
  const cum = [0];
  for (let i = 0; i < per.length; i++) cum.push(cum[i] + per[i]);
  return cum;
}

// Total XP required to reach `level` (lvl1 + … + lvlN)
export async function totalXpForLevel(job: StoreProfessionId, level: number): Promise<number> {
  const cum = await cumulative(job);
  if (level <= 0) return 0;
  if (level >= cum.length) return cum[cum.length - 1];
  return cum[level];
}

// Given total XP, return per-level progress (for the bar)
export async function levelFromTotalXp(
  job: StoreProfessionId,
  totalXp: number
): Promise<{ level: number; xpIntoLevel: number; xpForNextLevel: number | null; }> {
  const per = await perLevel(job);
  const cum = await cumulative(job);
  if (!per.length) return { level: 0, xpIntoLevel: 0, xpForNextLevel: null };

  // largest L with cum[L] <= totalXp
  let level = 0;
  for (let L = 0; L < cum.length; L++) {
    if (cum[L] <= totalXp) level = L; else break;
  }

  const atCap = level >= per.length;
  const xpIntoLevel = atCap ? 0 : totalXp - cum[level];
  const xpForNextLevel = atCap ? null : per[level];

  return { level, xpIntoLevel, xpForNextLevel };
}

// per-level (bar)
export async function progressForJob(
  job: StoreProfessionId,
  totalXp: number
): Promise<{ level: number; currentXP: number; maxXP: number | null; }> {
  const { level, xpIntoLevel, xpForNextLevel } = await levelFromTotalXp(job, totalXp);
  return { level, currentXP: Math.max(0, xpIntoLevel), maxXP: xpForNextLevel };
}

// optional preload
export async function initXpCurve(url = DATA_URL): Promise<void> {
  if (url === DATA_URL) await loadXpData();
  else {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    xpData = (await res.json()) as XpJson;
  }
}
