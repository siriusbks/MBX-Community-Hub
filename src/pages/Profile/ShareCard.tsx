import { Badge } from "@components/ui/badge"
import { Card } from "@components/ui/card"
import { LevelBadge } from "@const/levels"
import {
  CalendarCheck,
  CalendarCheck2,
  Clock10Icon,
  MedalIcon,
  ScrollText,
  SwordsIcon,
} from "lucide-react"
import type { PlayerData } from "types/profile"
import { useEffect, useState } from "react"
import { progressForJob, type StoreProfessionId } from "@utils/xpCurve"
import type { PvpStats } from "@pages/Profile"

const DATA_TO_STORE_KEY: Record<string, StoreProfessionId> = {
  alchemist: "alchemy",
  blacksmith: "blacksmithing",
  cook: "cooking",
  farmer: "farming",
  fisherman: "fishing",
  hunter: "hunting",
  jeweler: "jeweling",
  lumberjack: "lumberjack",
  miner: "mining",
  shoemaker: "shoemaking",
  tailor: "tailoring",
  tinkerer: "tinkering",
  runeforger: "runeforging",
}

interface SkillInfo {
  totalXp: number
  level: number
  currentXp: number
  nextLevelXp: number | null
  progressPercent: number
}

function useSkillsInfo(data: PlayerData) {
  const [skillsInfo, setSkillsInfo] = useState<Record<string, SkillInfo>>({})

  useEffect(() => {
    let mounted = true
    const fetchLevels = async () => {
      const rawData = data.data?.SKILLS?.data || {}
      const newInfo: Record<string, SkillInfo> = {}

      for (const jobKey of Object.values(DATA_TO_STORE_KEY)) {
        let totalXp = 0
        for (const [key, xp] of Object.entries(rawData)) {
          if (DATA_TO_STORE_KEY[key.toLowerCase()] === jobKey) {
            totalXp = xp as number
            break
          }
        }

        try {
          const { level, currentXP, maxXP } = await progressForJob(
            jobKey,
            totalXp
          )
          newInfo[jobKey] = {
            totalXp,
            level,
            currentXp: currentXP,
            nextLevelXp: maxXP,
            progressPercent: maxXP
              ? Math.min(100, Math.max(0, (currentXP / maxXP) * 100))
              : 100,
          }
        } catch (e) {
          console.error("Failed to load xp for", jobKey, e)
        }
      }

      if (mounted) setSkillsInfo(newInfo)
    }
    fetchLevels()

    return () => {
      mounted = false
    }
  }, [data.data?.SKILLS?.data])

  return skillsInfo
}

function ImageWithBlur({ url }: { url: string }) {
  return (
    <div className="overflow-hidden2 relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary/80 to-secondary/20 shadow-inner">
      <img
        src={url}
        className="relative z-10 size-9 object-contain drop-shadow-md"
        style={{ imageRendering: "pixelated" }}
      />
      <img
        src={url}
        alt=""
        className="absolute inset-0 h-full w-full scale-150 object-cover opacity-10 blur-[2px] grayscale-70"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
    </div>
  )
}

function SkillCard({
  skill,
  image,
  orientation,
  level = 1,
  progressPercent = 0,
}: {
  skill: string
  image: string
  orientation?: "horizontal" | "vertical"
  level?: number
  progressPercent?: number
}) {
  return (
    <Card
      className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} items-center justify-center gap-2 p-2`}
    >
      <ImageWithBlur url={image} />
      <span className="w-full -space-y-1">
        <p
          className={`text-[0.6rem] font-bold ${orientation === "vertical" ? "text-center" : "text-left"}`}
        >
          {skill}
        </p>
        <span className="mt-1 flex flex-row items-center justify-between">
          <LevelBadge level={level} className="h-4 p-1 pt-0.5 text-[0.5rem]">
            Lvl {level}
          </LevelBadge>
          <p className="text-[0.6rem]">{progressPercent.toFixed(1)}%</p>
        </span>
        <div
          className={`mt-2 h-2 w-full overflow-hidden rounded-sm border border-border/40 bg-background/50 shadow-inner`}
        >
          <div
            className="relative h-full rounded-sm bg-gradient-to-r from-primary-dark to-primary shadow-[0_0_10px_var(--color-primary)] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </span>
    </Card>
  )
}

export function ShareCard({
  data,
  pvp,
  nick,
}: {
  data: PlayerData
  pvp: PvpStats
  nick: string | null
}) {
  const skillsInfo = useSkillsInfo(data)

  return (
    <div className="relative h-full w-full bg-linear-to-b from-card to-card-dark">
      {/* BACKGROUND */}
      <div className="absolute top-10 z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-90% mask-radial-to-100% bg-center opacity-40" />

      {/* PROFILE ICON */}
      <img
        src={`https://vzge.me/bust/1024/${data.id || nick}`}
        alt={data.username}
        className="absolute bottom-0 -left-5 z-2 aspect-square h-auto w-5/11 drop-shadow-[0px_35px_64px_rgba(255,208,0,0.25)]"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Player Info (TOP) */}
      <span className="absolute top-0 left-0 z-2 mt-[1.0rem] flex h-full w-5/11 flex-col items-center">
        <span className="flex flex-row items-center">
          <LevelBadge level={data.level} className="scale-150">
            Lvl {data.level}
          </LevelBadge>
          <p className="ml-[1rem] text-[1.5rem]">{data.username || nick}</p>
        </span>

        <span className="py-2 pt-1">
          <Badge>{data.guild?.name}</Badge>
        </span>
      </span>

      {/* Player Stats (BOTTOM) */}
      <span className="absolute bottom-0 left-0 z-3 mb-[1rem] flex h-full w-5/11 flex-col items-center justify-end px-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <img
            src="/media/skulls/basic.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("basic") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/pineapple.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("pineapple") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/chad.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("chad") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/thunder.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("thunder") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/opal.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("opal") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/grumpy.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("grumpy") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/crimson.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("crimson") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/jackpot.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("jackpot") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/sage.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("sage") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/media/skulls/abyss.png"
            className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("abyss") ? "" : "opacity-50 grayscale-70"}`}
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Stats */}
        <span className="grid w-full grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded border border-foreground/20 bg-background/40 p-2 pb-1 backdrop-blur-xs">
            <Clock10Icon className="w-2/3" strokeWidth={2.5} />
            <p className="text-[0.6rem] uppercase">Playtime</p>
            <p className="text-[0.9rem]">
              {Math.floor(data?.playtime / 3600) || "0"} H
            </p>
          </div>
          <div className="flex flex-col items-center rounded border border-foreground/20 bg-background/40 p-2 pb-1 backdrop-blur-xs">
            <CalendarCheck className="w-2/3" strokeWidth={2.5} />
            <p className="text-[0.6rem] uppercase">Daily</p>
            <p className="text-[0.9rem]">
              {data?.data?.OBJECTIVES?.completed_quests.DAILY || "0"}
            </p>
          </div>
          <div className="flex flex-col items-center rounded border border-foreground/20 bg-background/40 p-2 pb-1 backdrop-blur-xs">
            <CalendarCheck2 className="w-2/3" strokeWidth={2.5} />
            <p className="text-[0.6rem] uppercase">Weekly</p>
            <p className="text-[0.9rem]">
              {data?.data?.OBJECTIVES?.completed_quests.WEEKLY || "0"}
            </p>
          </div>
          <div className="flex flex-col items-center rounded border border-foreground/20 bg-background/40 p-2 pb-1 backdrop-blur-xs">
            <ScrollText className="w-2/3" strokeWidth={2.5} />
            <p className="text-[0.6rem] uppercase">Museum</p>
            <p className="text-[0.9rem]">
              {data?.data?.OBJECTIVES?.museum.length || "0"}
            </p>
          </div>
        </span>
      </span>

      <span className="absolute top-0 right-0 z-3 flex h-full w-6/11 flex-col p-4 pl-1">
        <p>PVP Stats</p>
        <span className="grid h-full grid-cols-3 gap-2">
          <Card
            className={`flex flex-row items-center justify-center gap-2 p-2`}
          >
            <div className="overflow-hidden2 relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary/80 to-secondary/20 shadow-inner">
              <img
                src="/media/ranks/BRONZE.png"
                className="relative z-10 size-9 object-contain drop-shadow-md"
                style={{ imageRendering: "pixelated" }}
              />
              <img
                src="/media/ranks/BRONZE.png"
                alt=""
                className="absolute inset-0 h-full w-full scale-150 object-cover opacity-10 blur-[2px] grayscale-70"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
            <span className="w-full -space-y-1">
              <p className={`text-[0.6rem] text-muted-foreground`}>Rank</p>
              <p className={`text-xs font-bold`}>{pvp?.rank_tier || "N/A"}</p>
            </span>
          </Card>
          <Card
            className={`flex flex-row items-center justify-center gap-2 p-2`}
          >
            <div className="overflow-hidden2 relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary/80 to-secondary/20 shadow-inner">
              <MedalIcon className="relative z-10 size-9 object-contain drop-shadow-md" />
              <MedalIcon className="absolute inset-0 h-full w-full scale-125 object-cover opacity-7 blur-[3px] grayscale-70" />
            </div>
            <span className="w-full -space-y-1">
              <p className={`text-[0.6rem] text-muted-foreground`}>Winrate</p>
              <p className={`text-xs font-bold`}>
                {(pvp?.wins / (pvp?.wins + pvp?.losses + pvp?.draws)) * 100 ||
                  "---"}
              </p>
            </span>
          </Card>
          <Card
            className={`flex flex-row items-center justify-center gap-2 p-2`}
          >
            <div className="overflow-hidden2 relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary/80 to-secondary/20 shadow-inner">
              <SwordsIcon className="relative z-10 size-9 object-contain drop-shadow-md" />
              <SwordsIcon className="absolute inset-0 h-full w-full scale-125 object-cover opacity-7 blur-[3px] grayscale-70" />
            </div>
            <span className="w-full -space-y-1">
              <p className={`text-[0.6rem] text-muted-foreground`}>K/D</p>
              <p className={`text-xs font-bold`}>
                {pvp?.total_kills / (pvp?.total_deaths || 1) || "---"}
              </p>
            </span>
          </Card>
        </span>
        <p className="mt-[1rem]">Jobs Professions</p>
        <span className="grid h-full grid-cols-4 gap-2">
          <SkillCard
            orientation="vertical"
            skill="ALCHEMIST"
            image="/media/jobs/alchemy.png"
            level={skillsInfo["alchemy"]?.level}
            progressPercent={skillsInfo["alchemy"]?.progressPercent}
          />
          <SkillCard
            orientation="vertical"
            skill="FISHERMAN"
            image="/media/jobs/fishing.png"
            level={skillsInfo["fishing"]?.level}
            progressPercent={skillsInfo["fishing"]?.progressPercent}
          />
          <SkillCard
            orientation="vertical"
            skill="LUMBERJACK"
            image="/media/jobs/lumberjack.png"
            level={skillsInfo["lumberjack"]?.level}
            progressPercent={skillsInfo["lumberjack"]?.progressPercent}
          />
          <SkillCard
            orientation="vertical"
            skill="MINER"
            image="/media/jobs/mining.png"
            level={skillsInfo["mining"]?.level}
            progressPercent={skillsInfo["mining"]?.progressPercent}
          />
        </span>
        <span className="mt-2 grid h-full grid-cols-3 gap-2">
          <SkillCard
            skill="BLACKSMITH"
            image="/media/jobs/blacksmithing.png"
            level={skillsInfo["blacksmithing"]?.level}
            progressPercent={skillsInfo["blacksmithing"]?.progressPercent}
          />
          <SkillCard
            skill="COOK"
            image="/media/jobs/cooking.png"
            level={skillsInfo["cooking"]?.level}
            progressPercent={skillsInfo["cooking"]?.progressPercent}
          />
          <SkillCard
            skill="FARMER"
            image="/media/jobs/farming.png"
            level={skillsInfo["farming"]?.level}
            progressPercent={skillsInfo["farming"]?.progressPercent}
          />
        </span>
        <span className="mt-2 grid h-full grid-cols-3 gap-2">
          <SkillCard
            skill="HUNTER"
            image="/media/jobs/hunting.png"
            level={skillsInfo["hunting"]?.level}
            progressPercent={skillsInfo["hunting"]?.progressPercent}
          />
          <SkillCard
            skill="JEWELER"
            image="/media/jobs/jeweling.png"
            level={skillsInfo["jeweling"]?.level}
            progressPercent={skillsInfo["jeweling"]?.progressPercent}
          />
          <SkillCard
            skill="SHOEMAKER"
            image="/media/jobs/shoemaking.png"
            level={skillsInfo["shoemaking"]?.level}
            progressPercent={skillsInfo["shoemaking"]?.progressPercent}
          />
        </span>
        <span className="mt-2 grid h-full grid-cols-3 gap-2">
          <SkillCard
            skill="TAILOR"
            image="/media/jobs/tailoring.png"
            level={skillsInfo["tailoring"]?.level}
            progressPercent={skillsInfo["tailoring"]?.progressPercent}
          />
          <SkillCard
            skill="TINKERER"
            image="/media/jobs/tinkering.png"
            level={skillsInfo["tinkering"]?.level}
            progressPercent={skillsInfo["tinkering"]?.progressPercent}
          />
          <SkillCard
            skill="RUNEFORGER"
            image="/media/jobs/runeforging.png"
            level={skillsInfo["runeforging"]?.level}
            progressPercent={skillsInfo["runeforging"]?.progressPercent}
          />
        </span>
      </span>

      {/* WATERMARK */}
      <p className="absolute bottom-0 left-0 z-3 w-full text-center text-[0.5rem] text-muted-foreground opacity-30">
        Profile generated by Minebox Community
      </p>
    </div>
  )
}
