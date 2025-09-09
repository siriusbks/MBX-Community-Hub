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

let xpData: XpJson | null = null;
let xpDataLoading: Promise<XpJson> | null = null;

async function loadXpData(): Promise<XpJson> {
  if (xpData) return xpData;
  if (!xpDataLoading) {
    xpDataLoading = fetch(DATA_URL, { cache: "force-cache" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
        return (await res.json()) as XpJson;
      })
      .then((json) => (xpData = json));
  }
  return xpDataLoading;
}

// per-level costs; drop leading 0 if present
async function perLevel(job: StoreProfessionId): Promise<number[]> {
  const data = await loadXpData();
  const key = STORE_TO_DATA_KEY[job];
  const arr = data[key]?.experience_per_level ?? [];
  if (!arr.length) return [];
  return arr[0] === 0 ? arr.slice(1) : arr.slice();
}

// cumulative[L] = total XP to reach level L (sum of 1..L); cumulative[0] = 0
async function cumulative(job: StoreProfessionId): Promise<number[]> {
  const per = await perLevel(job);
  const cum = [0];
  for (let i = 0; i < per.length; i++) cum.push(cum[i] + per[i]);
  return cum;
}

// total XP required to reach <level> (should be [lvl1 + … + lvlN] as per evlad)
export async function totalXpForLevel(job: StoreProfessionId, level: number): Promise<number> {
  const cum = await cumulative(job);
  if (level <= 0) return 0;
  if (level >= cum.length) return cum[cum.length - 1];
  return cum[level];
}

// from the job XP (returned by mbx api) return the curr job lvl, curr lvl xp and xp required for next lvl
export async function levelFromTotalXp(
  job: StoreProfessionId,
  totalXp: number
): Promise<{ level: number; xpIntoLevel: number; xpForNextLevel: number | null; }> {
  const per = await perLevel(job);
  const cum = await cumulative(job);
  if (per.length === 0) return { level: 0, xpIntoLevel: 0, xpForNextLevel: null };

  let level = 0;
  for (let L = 0; L < cum.length; L++) {
    if (cum[L] <= totalXp) level = L; else break;
  }

  const atCap = level >= per.length;
  const xpIntoLevel = atCap ? 0 : totalXp - cum[level];
  const xpForNextLevel = atCap ? null : per[level];

  return { level, xpIntoLevel, xpForNextLevel };
}

// per level !!
export async function progressForJob(
  job: StoreProfessionId,
  totalXp: number
): Promise<{ level: number; currentXP: number; maxXP: number | null; }> {
  const { level, xpIntoLevel, xpForNextLevel } = await levelFromTotalXp(job, totalXp);
  return { level, currentXP: Math.max(0, xpIntoLevel), maxXP: xpForNextLevel };
}

// load
export async function initXpCurve(url = DATA_URL): Promise<void> {
  if (xpData) return;
  if (url !== DATA_URL) {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    xpData = (await res.json()) as XpJson;
  } else {
    await loadXpData();
  }
}
