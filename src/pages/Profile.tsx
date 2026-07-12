import { useEffect, useState, useRef } from "react"
import { Badge } from "@ui/badge"
import { PageTitle } from "@components/layout/title"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card"
import { Skeleton } from "@ui/skeleton"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog"
import { Button } from "@ui/button"
import { toPng } from "html-to-image"
import { type PlayerData } from "../types/profile"
import { StatsTab } from "@pages/Profile/StatsTab"
import { SkillsTab } from "@pages/Profile/SkillsTab"
import { CompanionsTab } from "@pages/Profile/CompanionsTab"
import { ObjectivesTab } from "@pages/Profile/ObjectivesTab"
import { ShipsTab } from "@pages/Profile/ShipsTab"
import {
  Download,
  Activity,
  Target,
  Ship,
  Eye,
  PawPrint,
  TimerIcon,
  SwordsIcon,
  Skull,
  Network,
} from "lucide-react"
import { LevelBadge } from "@const/levels"
import { GuildDialog } from "@pages/Profile/GuildDialog"
import { SkullsTab } from "@pages/Profile/SkullsTab"

export function ProfilePage() {
  const [nick, setNick] = useState<string | null>(null)
  const [data, setData] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { t } = useTranslation('profile');

  // Initial load: get nick from URL (?player=name) or localStorage
  useEffect(() => {
    const playerFromUrl = new URLSearchParams(window.location.search).get(
      "player"
    )

    if (playerFromUrl) {
      setNick(playerFromUrl)
    } else {
      const storedNick = localStorage.getItem("minebox_nick")
      if (storedNick) {
        setNick(storedNick)
      } else {
        setLoading(false)
        setError(
          "No nickname found. Please enter your nickname in the top navigation bar."
        )
      }
    }

    // Listen for storage changes in case they update the nick from the navbar
    const handleStorageChange = () => {
      if (playerFromUrl) return

      const newNick = localStorage.getItem("minebox_nick")
      if (newNick && newNick !== nick) {
        setNick(newNick)
      }
    }

    const intervalId = setInterval(handleStorageChange, 1000)
    return () => clearInterval(intervalId)
  }, [nick])

  // Fetch data when nick changes
  useEffect(() => {
    if (!nick) return

    let mounted = true
    setLoading(true)

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://api.minebox.co/data/${encodeURIComponent(nick)}`
        )
        if (!mounted) return

        if (res.ok) {
          const j = await res.json()
          setData(j)
          setError(null)
        } else if (res.status === 401) {
          setError(
            "Player has disabled API access. You must enable it in-game."
          )
        } else if (res.status === 404) {
          setError("Player not found.")
        } else {
          setError("Failed to fetch profile data.")
        }
      } catch (err) {
        if (mounted) setError("Network error while fetching profile.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void fetchProfile()

    return () => {
      mounted = false
    }
  }, [nick])

  const formatPlaytime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    if (m > 0 || parts.length === 0) parts.push(`${m}m`)
    return parts.join(" ")
  }

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return
    try {
      setIsGenerating(true)
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        style: { fontFamily: "Inter, sans-serif" },
      })
      const link = document.createElement("a")
      link.download = `${data?.username || "minebox"}-profile.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image", err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!nick && !loading && error) {
    return (
      <div className="relative page-container flex min-h-[50vh] flex-col items-center justify-center">
        <PageTitle title="Profile" description="View your Minebox statistics" />
        <Card className="mt-4 w-full max-w-md bg-card/50 text-center">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Welcome to your Profile</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative page-container flex flex-col gap-4 pb-12">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle
        title={t('profile.title')}
        description={t('profile.description')}
      />

      {/* Hidden Share Card used for html-to-image */}
      {data && (
        <div className="absolute top-0 -left-[9999px]">
          <div
            ref={shareCardRef}
            className="relative flex h-[480px] w-[850px] overflow-hidden rounded-2xl shadow-2xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          ></div>
        </div>
      )}

      {loading ? (
        <div className="mt-2 animate-pulse space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full md:col-span-2" />
          </div>
        </div>
      ) : error ? (
        <Card className="mt-2 border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-center text-sm font-medium text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      ) : data ? (
        <div className="mt-2 space-y-4">
          {/* Header Profile Card */}
          <Card className="relative mt-2 overflow-hidden border-white/10 bg-card/40 pb-0 shadow-xl backdrop-blur-xl">
            <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-90% mask-radial-to-100% bg-center opacity-40" />
            <CardContent className="relative z-20 h-80 min-h-80 px-4 pt-10 pb-4">
              {/* Dates at Top Right (Hidden on very small screens to avoid overlap) */}

              <img
                src={`https://vzge.me/bust/256/${data.id || nick}`}
                alt={data.username}
                className="absolute bottom-0 left-0 size-72 drop-shadow-[0px_35px_64px_rgba(255,208,0,0.25)]"
                style={{ imageRendering: "pixelated" }}
              />

              <div className="absolute top-0 right-4 z-20 hidden sm:block">
                <div className="min-w-[150px] space-y-0 rounded-lg border border-white/5 bg-background/30 p-3 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.pvp_rank')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      ...
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.pvp_winrate')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      ...
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.pvp_streak')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      ...
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 bottom-4 z-20 hidden sm:block">
                <div className="min-w-[150px] space-y-0 rounded-lg border border-white/5 bg-background/30 p-3 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.first_joined')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      {new Date(data.first_connection).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-px w-full bg-border/20"></div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.last_seen')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      {new Date(data.last_connection).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-67 flex h-full flex-col justify-end gap-4">
                <div>
                  <h1 className="mt-2 flex items-center gap-2 text-xl font-bold text-foreground md:mt-0">
                    <LevelBadge
                      level={data.level}
                      className="py-3 pb-4 text-lg"
                    >
                      Lvl {data.level}
                    </LevelBadge>
                    <p className="tracking-wider">{data.username}</p>
                    {data.online ? (
                      <>
                        <Badge
                          variant="default"
                          className="border-green-500/30 bg-green-500/20 px-1.5 py-0 text-[10px] tracking-wider text-green-500 uppercase shadow-sm hover:bg-green-500/30"
                        >
                          {t('profile.online')}
                        </Badge>
                        {data.server_instance && (
                          <Badge
                            variant="default"
                            className="px-1.5 py-0 text-[10px] tracking-wider uppercase"
                          >
                            {data.server_instance}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="size-2 animate-ping rounded-full bg-red-500" />
                    )}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <img
                      src="/media/skulls/basic.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("basic") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/pineapple.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("pineapple") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/chad.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("chad") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/thunder.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("thunder") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/opal.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("opal") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/grumpy.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("grumpy") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/crimson.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("crimson") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/jackpot.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("jackpot") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/sage.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("sage") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <img
                      src="/media/skulls/abyss.png"
                      className={`size-8 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("abyss") ? "" : "opacity-50 grayscale-70"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {data.guild && (
                      <GuildDialog
                        guildId={data.guild.id}
                        guildName={data.guild.name}
                      />
                    )}
                    <Badge
                      variant="default"
                      className="py-2.5 pb-3 text-[0.75rem]"
                    >
                      <TimerIcon strokeWidth={4} className="size-3" />{" "}
                      {formatPlaytime(data.playtime)}
                    </Badge>
                  </div>
                </div>

                {/* Mobile Dates Box (shows on small screens only) */}
                <div className="mt-2 w-full space-y-2 rounded-lg border border-white/5 bg-background/30 p-3 text-xs text-muted-foreground shadow-sm backdrop-blur-md sm:hidden">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.first_joined')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      {new Date(data.first_connection).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-px w-full bg-border/20"></div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-muted-foreground">
                      {t('profile.last_seen')}
                    </span>
                    <span className="rounded bg-secondary/40 px-1.5 py-0.5 font-semibold text-foreground">
                      {new Date(data.last_connection).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Profile Card Button at Bottom Left */}
                {/*}
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="sm" className="gap-2 bg-background/40 backdrop-blur-md hover:bg-secondary/80 border border-white/5 shadow-sm transition-all">
                                                <Eye className="w-4 h-4" /> <span>Preview Profile Card</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xl border-primary/20 bg-background/95 backdrop-blur-xl z-[100]">
                                            <DialogHeader>
                                                <DialogTitle>Share your Player Card</DialogTitle>
                                                <DialogDescription>
                                                    Download this beautiful card to share your stats on Discord!
                                                </DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="flex justify-center items-center py-8 bg-secondary/20 rounded-xl border border-border/50 overflow-hidden my-2">
                                                <div className="relative group transition-transform duration-500 hover:scale-105">
                                                    <div className="w-[850px] h-[480px] scale-[0.35] sm:scale-[0.55] origin-center pointer-events-none rounded-2xl overflow-hidden relative shadow-2xl ring-4 ring-primary/20">
                                                    </div>
                                                </div>
                                            </div>

                                            <Button onClick={handleDownloadImage} disabled={isGenerating} className="w-full gap-2">
                                                {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Download Image</>}
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>*/}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="hide-scrollbar mb-2 !min-h-12 w-full flex-nowrap justify-start gap-1.5 overflow-x-auto border border-border/50 bg-secondary/20 p-1.5 shadow-sm backdrop-blur-md">
              <TabsTrigger
                value="stats"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <Activity className="h-4 w-4" />
                {t('profile.tabs.attributes')}
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <Network className="h-4 w-4" />
                {t('profile.tabs.skills')}
              </TabsTrigger>
              {data.data?.COMPANIONS && (
                <TabsTrigger
                  value="companions"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <PawPrint className="h-4 w-4" />
                  {t('profile.tabs.pets_mounts')}
                </TabsTrigger>
              )}
              {data.data?.SHIPS && (
                <TabsTrigger
                  value="ships"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <Ship className="h-4 w-4" />
                  {t('profile.tabs.ships')}
                </TabsTrigger>
              )}
              {data.data?.OBJECTIVES && (
                <TabsTrigger
                  value="pvp"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <SwordsIcon className="h-4 w-4" />
                  {t('profile.tabs.pvp')}
                </TabsTrigger>
              )}
              {data.data?.OBJECTIVES && (
                <TabsTrigger
                  value="skulls"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <Skull className="h-4 w-4" />
                  {t('profile.tabs.skulls')}
                </TabsTrigger>
              )}
              {data.data?.OBJECTIVES && (
                <TabsTrigger
                  value="objectives"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-secondary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <Target className="h-4 w-4" />
                  {t('profile.tabs.objectives')}
                </TabsTrigger>
              )}
            </TabsList>

            {/* STATS TAB */}
            <TabsContent
              value="stats"
              className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
            >
              <StatsTab data={data} />
            </TabsContent>

            {/* SKILLS TAB */}
            <TabsContent
              value="skills"
              className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
            >
              <SkillsTab data={data} />
            </TabsContent>

            {/* COMPANIONS TAB */}
            {data.data?.COMPANIONS && (
              <TabsContent
                value="companions"
                className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
              >
                <CompanionsTab data={data} />
              </TabsContent>
            )}

            {/* SKULLS TAB */}
            {data.data?.OBJECTIVES && (
              <TabsContent
                value="skulls"
                className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
              >
                <SkullsTab data={data} />
              </TabsContent>
            )}

            {/* OBJECTIVES TAB */}
            {data.data?.OBJECTIVES && (
              <TabsContent
                value="objectives"
                className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
              >
                <ObjectivesTab data={data} />
              </TabsContent>
            )}

            {/* SHIPS TAB */}
            {data.data?.SHIPS && (
              <TabsContent
                value="ships"
                className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
              >
                <ShipsTab data={data} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      ) : null}
    </div>
  )
}

export default ProfilePage
