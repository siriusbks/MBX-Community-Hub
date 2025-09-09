// Minebox API "connector"
// TODO :
// - Edit URL to NOT use cors proxy on PROD env
// - Better err handling, on 401 : user disabled third party api
// - on 404 : user not found

import { useCallback, useState } from "react";
import { useProfileStore } from "@store/profileStore";
import { progressForJob, StoreProfessionId } from "../utils/xpCurve";

// mbx api job ids and our store differs, this map acts as a helper
// maybe consider unifying everything ?
const API_TO_STORE_ID: Record<string, StoreProfessionId | undefined> = {
  ALCHEMIST: "alchemy",
  COOK: "cooking",
  FARMER: "farming",
  FISHERMAN: "fishing",
  HUNTER: "hunting",
  LUMBERJACK: "lumberjack",
  MINER: "mining",
  SHOEMAKER: "shoemaking",
  TINKERER: "tinkering",
  BLACKSMITH: "blacksmithing",
  JEWELER: "jeweling",
  TAILOR: "tailoring",
};

type MineboxResponse = {
  level?: number;
  data?: { SKILLS?: { data?: Record<string, number>; }; };
};

export function useMineboxImport() {
  const { updateProfession, setLevel } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importByUsername = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://corsproxy.io/?url=https://api.minebox.co/data/${username}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const json = (await res.json()) as MineboxResponse;

      if (typeof json.level === "number") setLevel(json.level);

      const skills = json?.data?.SKILLS?.data ?? {};
      for (const [apiKey, totalXpRaw] of Object.entries(skills)) {
        const storeId = API_TO_STORE_ID[apiKey];
        if (!storeId) continue;

        const totalXp = Number(totalXpRaw) || 0;

        const { level, currentXP, maxXP } = await progressForJob(storeId, totalXp);
        updateProfession(storeId, {
          level,
          currentXP,
          maxXP: maxXP ?? 0,
        });
      }
    } catch (e: any) {
      setError(e?.message ?? "something went absolutely wrong :(");
    } finally {
      setLoading(false);
    }
  }, [setLevel, updateProfession]);

  return { importByUsername, loading, error };
}
