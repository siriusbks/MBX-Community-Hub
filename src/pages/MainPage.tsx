import { useEffect, useState, useMemo } from "react"
import { Button } from "@ui/button"
import { Alert, AlertDescription, AlertTitle } from "@ui/alert"
import { BookOpen, InfoIcon, User } from "lucide-react"
import { Badge } from "@ui/badge"
import { Card } from "@ui/card"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useNavLinks } from "@const/nav"
import { EN_Flag, FR_Flag } from "@const/flags"

interface ServerStatus {
  online: boolean
  players?: {
    now: number
    max: number
  }
}

export function Home() {
  const NAV_LINKS = useNavLinks()
  const { t } = useTranslation()
  const [status, setStatus] = useState<ServerStatus | null>(null)

  // Spłaszcza NAV_LINKS: zwykłe linki + wszystkie items z dropdownów
  const FEATURE_ITEMS = useMemo(
    () =>
      NAV_LINKS.flatMap((item) =>
        "dropdown" in item && item.dropdown
          ? item.items.map((sub) => ({
              id: sub.id,
              to: sub.to,
              icon: sub.icon,
              label: sub.label,
              desc: sub.desc,
              badge: sub.badge,
            }))
          : [
              {
                id: item.id,
                to: item.to,
                icon: item.icon,
                label: item.label,
                desc: item.desc,
                badge: undefined,
              },
            ]
      ),
    [NAV_LINKS]
  )

  useEffect(() => {
    let cancelled = false

    async function loadStatus() {
      try {
        const res = await fetch(
          "https://mcapi.us/server/status?ip=play.minebox.co"
        )
        if (!res.ok) throw new Error("Failed to fetch server status")
        const data: ServerStatus = await res.json()
        if (!cancelled) setStatus(data)
      } catch {
        if (!cancelled) setStatus(null)
      }
    }

    loadStatus()
    const interval = setInterval(loadStatus, 60_000) // odświeżaj co minutę
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const playersLabel =
    status?.online && status.players
      ? `${status.players.now} ${t("mainpage.players_online")}`
      : status && !status.online
        ? t("mainpage.server_offline")
        : `??? ${t("mainpage.players_online")}`

  return (
    <div className="relative page-container flex flex-col pb-24">
      <div className="absolute top-0 -z-1 aspect-21/9 w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />

      {/* Contribution Alert */}
      <Alert
        variant="default"
        className="flex flex-col items-center justify-center gap-0 sm:flex-row sm:gap-4"
      >
        <span className="flex w-full flex-row sm:w-fit">
          <span className="items-center justify-center">
            <InfoIcon className="mr-1 size-4" />
          </span>
          <p className="px-2flex break-none w-fit items-center justify-center">
            We need your help!
          </p>
        </span>
        <span className="flex w-full flex-row justify-between gap-4 sm:flex-1">
          <AlertDescription className="mr-auto flex items-center justify-center">
            Help translate MBX Community on Crowdin!
          </AlertDescription>
          <Link to="/contribute">
            <Button className="ml-auto">Contribute Now!</Button>
          </Link>
        </span>
      </Alert>

      

      <Card className="flex flex-row gap-2 p-2">
        <span className="flex flex-col gap-2">
          <p className="inline-block bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-xl font-bold tracking-wider text-transparent uppercase drop-shadow-[0_2px_0_#5d3a00]">
            Minebox Community is currently in Beta!
          </p>
          <p className="text-xs text-muted-foreground">
            The website has been completely rewritten and is currently in the
            testing phase. Please report any bugs on Discord.
            <br />
            The remaining features from the previous version, as well as other
            new features, will be introduced in future updates.
          </p>
        </span>
        <span className="my-auto ml-auto flex h-full flex-col items-center justify-center gap-2">
          <Link to="/contribute">
            <Button><EN_Flag/>  English Forum</Button>
          </Link>
          <Link to="/contribute">
            <Button><FR_Flag/>  French Forum</Button>
          </Link>
        </span>
      </Card>

      {/* Welcome Hero */}
      <div className="flex flex-col items-center justify-center py-24">
        <Badge variant="secondary" className="font-light tracking-wide">
          {playersLabel}
        </Badge>
        <h2 className="text-4xl drop-shadow-[0_3px_0_#00000040]">
          {t("mainpage.title")}
        </h2>
        <h1 className="inline-block bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-4xl font-bold tracking-wider text-transparent drop-shadow-[0_4px_0_#5d3a00] sm:text-5xl md:text-6xl">
          MBX COMMUNITY
        </h1>
        <p className="mt-2 max-w-xl text-center text-sm font-light">
          {t("mainpage.description")}
        </p>
        <span className="mt-4 flex gap-2">
          <Link to="/items">
            <Button size="lg" className="tracking-wider">
              <BookOpen className="mt-0.5" />
              {t("mainpage.features.codex.title")}
            </Button>
          </Link>
          <Link to="/profile">
            <Button size="lg" className="tracking-wider" variant="secondary">
              <User className="mt-0.5" /> {t("mainpage.features.profile.title")}
            </Button>
          </Link>
        </span>
      </div>

      {/* Website Features */}
      <div className="gap mx-auto flex w-full flex-col">
        <span className="text-lg text-primary">
          {t("mainpage.features.web.title")}
        </span>
        <span className="mb-4 text-xs leading-none">
          {t("mainpage.features.web.description")}
        </span>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {FEATURE_ITEMS.map(({ id, to, icon: Icon, label, desc, badge }) => (
            <Link key={id} to={to}>
              <Card className="group h-full gap-2 px-4">
                <span className="flex flex-row items-center gap-4">
                  <Icon className="size-12 rounded bg-linear-to-b from-primary to-primary-dark p-2 text-primary-foreground minebox-shadow-light transition-transform duration-200 group-hover:scale-110" />
                  <span className="mb-1 flex flex-col items-start justify-center space-y-0.5">
                    <p className="bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-lg leading-none font-bold tracking-wider text-transparent uppercase drop-shadow-[0_3px_0_var(--primary-foreground)]">
                      {label}
                    </p>
                    {badge && (
                      <p className="text-[0.7rem] leading-none text-muted-foreground">
                        {badge}
                      </p>
                    )}
                  </span>
                </span>
                <p className="text-[0.7rem] leading-none text-muted-foreground">
                  {desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
