import { Card } from "@ui/card"
import { LevelBadge } from "@const/levels"
import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Switch } from "@components/ui/switch"
import { Label } from "@components/ui/label"
import { useTranslation } from "react-i18next"

import {
  ImageOverlay,
  MapContainer,
  Marker,
  Tooltip,
  Polygon,
  Popup,
  useMapEvents,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import {
  ItemImage,
  FindItemName,
  ItemImageUrl,
  getCleanItemId,
  FindItemRarity,
} from "@const/elements"
import { BestiaryItem } from "@components/minebox/bestiary"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { EyeClosedIcon, EyeIcon, FishIcon } from "lucide-react"
import { GetRarityColor, RarityBadge, RarityBorder } from "@const/rarities"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { mapsConfig } from "@const/maps"
import { EN_Flag, FR_Flag } from "@const/flags"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel"

const REGION_COLORS = [
  "#4ade80",
  "#60a5fa",
  "#f97316",
  "#a78bfa",
  "#f43f5e",
  "#facc15",
  "#22d3ee",
  "#fb923c",
]

// Icon source for a raid point category (spawnpoint, extraction,
// gate_breakable, puzzle_codes_locations_1, ...). Falls back to
// /media/missing.png via onError on the <img> elements that use this
// (Leaflet's L.icon iconUrl itself has no onError hook, so that one just
// shows a broken image until the real asset is dropped in).
function raidPointIconSrc(cat: string) {
  return `/media/missing/${cat}.png`
}

// Fallback label when no translation exists: "gate_breakable" -> "Gate Breakable"
function formatRaidPointLabel(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// "31;84;-90" -> "31, 84, -90"
function formatCoords(coord: string | undefined | null) {
  if (!coord) return "-"
  return coord.split(";").join(", ")
}

// Shared CSS to strip Leaflet's default tooltip chrome (background, border,
// forced nowrap sizing) so our own styled tooltip content controls layout,
// plus the "outline resources" marker filter used when that preview
// setting is toggled on.
function LeafletTooltipStyleOverrides() {
  return (
    <style>{`
      .leaflet-tooltip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        white-space: normal !important;
        max-width: none !important;
      }
      .leaflet-tooltip:before {
        display: none !important;
      }
      .leaflet-tooltip-pane {
        z-index: 650;
      }

      /* Fakes a solid outline around a (mostly transparent) marker icon by
         stacking a drop-shadow in each direction, since a real border can't
         be applied to an <img>-based Leaflet icon. */
      .marker-icon-outline {
        filter:
          drop-shadow(2px 0 0 var(--primary))
          drop-shadow(-2px 0 0 var(--primary))
          drop-shadow(0 2px 0 var(--primary))
          drop-shadow(0 -2px 0 var(--primary));
      }
    `}</style>
  )
}

function ZoomWatcher({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void
}) {
  const map = useMapEvents({
    zoom: () => onZoomChange(map.getZoom()),
    zoomend: () => onZoomChange(map.getZoom()),
  })

  useEffect(() => {
    onZoomChange(map.getZoom())
  }, [map])

  return null
}

function RegionPolygon({
  positions,
  color,
  label,
}: {
  positions: [number, number][]
  color: string
  label: string
}) {
  const { t } = useTranslation("maps")
  const [hovered, setHovered] = useState(false)
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: hovered ? 0.5 : 0.15,
        weight: hovered ? 3 : 1.5,
        opacity: hovered ? 1 : 0.7,
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip sticky direction="top">
        <div
          className="pointer-events-none rounded-md border-l-4 bg-linear-to-b from-card to-card-dark px-3 py-1.5 minebox-shadow"
          style={{ borderLeftColor: color }}
        >
          <span className="text-sm font-bold tracking-wide text-primary">
            <p className="text-xs text-muted-foreground">{t("maps.region")}</p>
            {label}
          </span>
        </div>
      </Tooltip>
    </Polygon>
  )
}

function BestiaryPolygon({
  positions,
  color,
  zoneName,
  mobs,
}: {
  positions: [number, number][]
  color: string
  zoneName: string
  mobs: { id: string; name: string; image: string }[]
}) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: hovered ? 0.5 : 0.15,
        weight: hovered ? 3 : 1.5,
        opacity: hovered ? 1 : 0.75,
        dashArray: "6 4",
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip sticky direction="top">
        <div
          className="pointer-events-none max-w-[240px] min-w-[160px] rounded-md border-l-6 bg-linear-to-b from-card to-card-dark px-3 py-2 minebox-shadow"
          style={{ borderLeftColor: color }}
        >
          <p className="text-xs font-bold text-muted-foreground">
            {t("maps:maps.region")}
          </p>
          <p className="text-sm font-bold tracking-wide text-primary">
            {zoneName}
          </p>
          <ul className="mt-2 space-y-1.5">
            {mobs.map((mob) => (
              <li
                key={mob.id}
                className="flex items-center gap-1.5 text-xs text-neutral-200"
              >
                <img
                  src={mob.image || "/media/missing.png"}
                  alt={mob.name}
                  loading="lazy"
                  className="size-9 shrink-0 rounded object-cover"
                />
                <span className="flex flex-col gap-0 -space-y-0.5 leading-none">
                  <p>{mob.name}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Tooltip>
    </Polygon>
  )
}

export function MapPreview() {
  type BestiaryCreature = {
    id: string
    name: string
    family: string
    family_name: string
    type: string
    level: number
    level_max: number
    health: number[]
    image: string
    zones: string[]
  }

  type BestiaryFamily = {
    id: string
    name: string
  }

  type BestiaryResponse = {
    creatures: BestiaryCreature[]
    families: BestiaryFamily[]
    page: number
    pageSize: number
    total: number
  }

  type InsectTimeRange = {
    from: number
    to: number
  }

  type InsectLocation = {
    zone: string
    subarea: string
  }

  type Insect = {
    id: string
    time_ranges: InsectTimeRange[]
    weather: string
    requires_moon: boolean
    locations: InsectLocation[]
  }

  type MobInfo = {
    name: string
    image: string
  }

  // A "gate" puzzle entry (raids.json: points.gates.<gateId>): a single
  // toggleable unit made of a physical gate location, a code location, and
  // one or more possible solution locations for the code.
  type RaidGateData = {
    name: string
    gate_location: string
    code_location: string
    solution_location: string[]
  }

  // --- Raid-specific data (raids.json: points + insect/bestiary ids) ---
  // `points` is an open-ended map of category -> array of "x;y;z" strings,
  // covering spawnpoint, extraction, gates, puzzle code locations, tumbstone,
  // boss, and any future category without needing code changes here.
  // The single "gates" key is special-cased: instead of a flat string[], it
  // holds an object keyed by gate id, each describing a whole gate puzzle
  // (gate/code/solution locations) that should be toggled as ONE unit.
  type RaidPointsData = Record<string, string[] | Record<string, RaidGateData> | undefined> & {
    gates?: Record<string, RaidGateData>
  }

  type RaidData = {
    points: RaidPointsData
    insects: string[]
    bestiary: string[]
  }

  const params = useParams()
  const mapId = params["*"] ?? ""

  // --- MAP CONFIG (looked up early so hooks below can safely reference it) ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig]

  const { t } = useTranslation(["maps", "items_maps", "insects", "universal"])
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null)
  const [mapsData, setMapsData] = useState<any | null>(null)
  const [hiddenResources, setHiddenResources] = useState<
    Record<string, boolean>
  >({})
  const [bestiaryData, setBestiaryData] = useState<BestiaryResponse | null>(
    null
  )
  const [isBestiaryLoading, setIsBestiaryLoading] = useState(false)
  const [bestiaryError, setBestiaryError] = useState<string | null>(null)

  const [insectsData, setInsectsData] = useState<Insect[] | null>(null)
  const [isInsectsLoading, setIsInsectsLoading] = useState(false)
  const [insectsError, setInsectsError] = useState<string | null>(null)

  // --- Regions & Bestiary regions ---
  const [regionsData, setRegionsData] = useState<Record<
    string,
    [number, number][]
  > | null>(null)
  const [showRegions, setShowRegions] = useState(false)
  const [bestiaryZonesData, setBestiaryZonesData] = useState<any | null>(null)
  const [showBestiary, setShowBestiary] = useState(false)
  const [mobNamesData, setMobNamesData] = useState<Record<string, MobInfo>>({})

  // Draws a colored outline around every resource marker on the map,
  // shared between the general and the raid-specific preview settings.
  const [outlineResources, setOutlineResources] = useState(false)

  // --- Raid points (raids.json) ---
  const [raidsData, setRaidsData] = useState<Record<string, RaidData> | null>(
    null
  )

  const [zoom, setZoom] = useState<number | null>(null)
  const [baseZoom, setBaseZoom] = useState<number | null>(null)

  const handleZoomChange = (z: number) => {
    setZoom(z)
    setBaseZoom((prev) => (prev === null ? z : prev))
  }

  // Marker scale is clamped to the min/max defined per-map in mapsConfig
  // instead of hardcoded bounds, so each island can tune its own zoom feel.
  const iconScaleMin = config?.iconScale.min ?? 1
  const iconScaleMax = config?.iconScale.max ?? 2.5
  const iconMultiplier = config?.scaleIconMultiplier ?? 1

  const markerScale = useMemo(() => {
    if (zoom === null || baseZoom === null) {
      return Math.min(Math.max(iconMultiplier, iconScaleMin), iconScaleMax)
    }
    const raw = Math.pow(2, zoom - baseZoom) * iconMultiplier
    return Math.min(Math.max(raw, iconScaleMin), iconScaleMax)
  }, [zoom, baseZoom, iconScaleMin, iconScaleMax, iconMultiplier])

  useEffect(() => {
    setZoom(null)
    setBaseZoom(null)
  }, [mapId])

  // Switching maps via the select fully reloads the page (rather than a
  // client-side route change) so the whole map element/state starts fresh.
  const handleValueChange = (value: string) => {
    window.location.href = `/maps/${value}`
  }

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center">
        {t("maps.mapNotFound")}
      </div>
    )
  }
  const { image, width, height, referencePoint, zoneKey, mapZoom } = config
  const isRaid = config.group === "raids"
  // Distinct from `isRaid` (which is based on the map's `group`): this flag
  // specifically controls the raids.json-backed points/insects/bestiary data.
  const isRaidZone = zoneKey === "raids"

  // We calculate the bounds once and for all
  const imageBounds: [number, number][] = [
    [0, 0],
    [height, width],
  ]

  useEffect(() => {
    fetch("/assets/data/harvestables.json")
      .then((r) => r.json())
      .then((harvestablesJson) => setHarvestablesData(harvestablesJson))
      .catch((e) => console.error(t("maps.error.loadHarvestables"), e))
  }, [t])

  useEffect(() => {
    fetch("/assets/data/maps.json")
      .then((r) => r.json())
      .then((mapsJson) => setMapsData(mapsJson))
      .catch((e) => console.error(t("maps.error.loadMaps"), e))
  }, [t])

  useEffect(() => {
    // https://polydraw.v1v2.io/ can help to draw region, offset [+109,+102] on coord of spawn
    fetch("/assets/data/maps_region.json")
      .then((r) => r.json())
      .then((json) => setRegionsData(json[mapId] ?? null))
      .catch((e) => console.error(t("maps.error.loadRegions"), e))
  }, [mapId, t])

  useEffect(() => {
    // https://polydraw.v1v2.io/ can help to draw region, offset [+109,+102] on coord of spawn
    fetch("/assets/data/maps_bestiary_region.json")
      .then((r) => r.json())
      .then((json) => setBestiaryZonesData(json))
      .catch((e) => console.error(t("maps.error.loadBestiaryZones"), e))
  }, [t])

  // Raid points/insects/bestiary ids, only needed on raid zones.
  useEffect(() => {
    if (!isRaidZone) {
      setRaidsData(null)
      return
    }
    fetch("/assets/data/raids.json")
      .then((r) => r.json())
      .then((json) => setRaidsData(json))
      .catch((e) => console.error(t("maps.error.loadRaids"), e))
  }, [isRaidZone, t])

  // Raid point categories start hidden by default (same as any other
  // preview toggle), so they don't clutter the map until explicitly enabled.
  // Each entry in `points.gates` counts as its own toggleable id here (one
  // toggle per gate, covering all of that gate's marker types), while every
  // other `points` key (spawnpoint, extraction, gate_breakable, ...) is
  // toggled individually as before.
  useEffect(() => {
    if (!isRaidZone || !raidsData) return
    const raidPoints = raidsData[mapId]?.points
    if (!raidPoints) return
    const flatCats = Object.keys(raidPoints).filter(
      (k) => k !== "gates" && Array.isArray(raidPoints[k])
    )
    const gateIds = raidPoints.gates ? Object.keys(raidPoints.gates) : []
    const cats = [...flatCats, ...gateIds]
    setHiddenResources((prev) => {
      const next = { ...prev }
      let changed = false
      cats.forEach((cat) => {
        if (!(cat in next)) {
          next[cat] = true
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [isRaidZone, raidsData, mapId])

  useEffect(() => {
    const controller = new AbortController()

    fetch("https://mineboxadditions.bartier.me/bestiary", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Bestiary names API error: ${r.status}`)
        return r.json()
      })
      .then((data: any[]) => {
        const map: Record<string, MobInfo> = {}
        data.forEach((mob) => {
          if (mob?.id) {
            map[mob.id] = {
              name: mob.name ?? mob.id,
              // API returns raw base64 GIF data with no data-URI prefix
              image: mob.image ? `data:image/gif;base64,${mob.image}` : "",
            }
          }
        })
        setMobNamesData(map)
      })
      .catch((e) => {
        if (e?.name === "AbortError") return
        console.error(t("maps.error.loadMobNames"), e)
      })

    return () => controller.abort()
  }, [t])

  useEffect(() => {
    // Raid zones don't have entries in the regular bestiary API (it's keyed
    // by server zone), so skip the fetch entirely and rely on raids.json.
    if (isRaidZone) {
      setBestiaryData(null)
      setBestiaryError(null)
      setIsBestiaryLoading(false)
      return
    }

    const controller = new AbortController()
    setIsBestiaryLoading(true)
    setBestiaryError(null)

    fetch(
      `https://api.minebox.co/bestiary?locale=en&zone=${encodeURIComponent(mapId)}`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Bestiary API error: ${r.status}`)
        }
        return r.json()
      })
      .then((data: BestiaryResponse) => {
        setBestiaryData(data)
      })
      .catch((error) => {
        if (error?.name === "AbortError") return
        setBestiaryData(null)
        setBestiaryError(t("maps.error.bestiaryFailed"))
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsBestiaryLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [mapId, isRaidZone, t])

  useEffect(() => {
    const controller = new AbortController()
    setIsInsectsLoading(true)
    setInsectsError(null)

    fetch("https://mineboxadditions.bartier.me/insects", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Insects API error: ${r.status}`)
        }
        return r.json()
      })
      .then((data: Insect[]) => {
        setInsectsData(data)
      })
      .catch((error) => {
        if (error?.name === "AbortError") return
        setInsectsData(null)
        setInsectsError(t("maps.error.insectsFailed"))
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsInsectsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [t])

  const zoneFullKey = `mineboxadditions.strings.zones.${zoneKey}`

  // Raid zones filter insects by explicit id list from raids.json instead of
  // matching against a translated zone key.
  const raidInsectIds = raidsData?.[mapId]?.insects ?? []

  const insectsForZone = isRaidZone
    ? (insectsData ?? []).filter((insect) => raidInsectIds.includes(insect.id))
    : (insectsData ?? []).filter((insect) =>
      insect.locations.some((loc) => loc.zone === zoneFullKey)
    )

  const formatSubarea = (subarea: string) => {
    const last = subarea.split(".").pop() ?? subarea
    return last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatTimeRange = (range: InsectTimeRange) => {
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(range.from)}:00 - ${pad(range.to)}:00`
  }

  // Merge harvestable locations coming from both "servers" and "raids"
  // sections of harvestables.json for the current map, category by category.
  // This is the single source of truth used everywhere we previously read
  // harvestablesData.locations.servers[mapId] directly.
  const mergedLocationData = useMemo(() => {
    if (!harvestablesData) return null
    const serverData = harvestablesData?.locations?.servers?.[mapId]
    const raidData = harvestablesData?.locations?.raids?.[mapId]
    if (!serverData && !raidData) return null

    const merged: Record<string, string[]> = {}
    const addAll = (src: Record<string, string[]> | undefined) => {
      if (!src) return
      Object.entries(src).forEach(([cat, arr]) => {
        merged[cat] = (merged[cat] ?? []).concat(arr)
      })
    }
    addAll(serverData)
    addAll(raidData)
    return merged
  }, [harvestablesData, mapId])

  const [resourceMarkers, setResourceMarkers] = useState<any[]>([])
  const [mapsJsonMarkers, setMapsJsonMarkers] = useState<any[]>([])
  const [markerIconUrls, setMarkerIconUrls] = useState<Record<string, string>>(
    {}
  )

  useEffect(() => {
    if (!harvestablesData) return
    const serverData = mergedLocationData
    if (!serverData) {
      setResourceMarkers([])
      return
    }
    const points: Array<{
      cat: string
      item: string
      x: number
      y: number
      z: number
    }> = []
    Object.entries(serverData).forEach(([cat, arr]: any) => {
      ; (arr as string[]).forEach((s) => {
        const parts = s.split(";")
        // "servers" entries are prefixed with a map/world name
        // ("island_bamboo;-297;84;237;90.0;0.0"), while "raids" entries
        // have no prefix and can be either "x;y;z;yaw;pitch" or just
        // "x;y;z". Detect the prefix by checking whether the first token
        // parses as a number rather than assuming a fixed offset.
        const hasPrefix = parts.length > 0 && Number.isNaN(Number(parts[0]))
        const offset = hasPrefix ? 1 : 0
        if (parts.length >= offset + 3) {
          const x = Number(parts[offset])
          const y = Number(parts[offset + 1])
          const z = Number(parts[offset + 2])
          if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
            points.push({ cat, item: hasPrefix ? parts[0] : cat, x, y, z })
          }
        }
      })
    })

    // Conversion with centering around referencePoint
    const mapped = points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z, // inversion vertical
    }))

    setResourceMarkers(mapped)
  }, [harvestablesData, mergedLocationData, mapId, referencePoint])

  // --- Additional categories loaded from maps.json (treasure, and any future groups) ---
  useEffect(() => {
    if (!mapsData) return
    const serverData = mapsData?.[mapId]
    if (!serverData) {
      setMapsJsonMarkers([])
      return
    }

    const points: Array<{
      group: string
      cat: string
      x: number
      y: number
      z: number
    }> = []
    Object.entries(serverData).forEach(([group, itemsObj]: any) => {
      Object.entries(itemsObj as Record<string, string[]>).forEach(
        ([itemId, arr]) => {
          arr.forEach((s) => {
            const parts = s.split(";")
            if (parts.length >= 3) {
              const x = Number(parts[0])
              const y = Number(parts[1])
              const z = Number(parts[2])
              if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
                points.push({ group, cat: itemId, x, y, z })
              }
            }
          })
        }
      )
    })

    const mapped = points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z,
    }))

    setMapsJsonMarkers(mapped)
  }, [mapsData, mapId, referencePoint])

  // Combined markers from harvestables.json + maps.json
  const allMarkers = useMemo(
    () => [...resourceMarkers, ...mapsJsonMarkers],
    [resourceMarkers, mapsJsonMarkers]
  )

  // Raid points (spawnpoint, extraction, gate_breakable, gate_channeling,
  // gate_castle, tumbstone, boss, ...), converted to map pixel coordinates
  // the same way as the other marker sets (offset from referencePoint, z
  // inverted vertically). The nested `gates` object is handled separately
  // below (see gateMarkers) since it isn't a flat string[].
  // Rendered/toggled exactly like a resource category: `cat` here is the
  // raids.json points key and doubles as the id used in hiddenResources.
  const raidPointMarkers = useMemo(() => {
    if (!isRaidZone || !raidsData) return []
    const raidPoints = raidsData[mapId]?.points
    if (!raidPoints) return []

    const points: Array<{ cat: string; x: number; y: number; z: number }> = []
    Object.entries(raidPoints).forEach(([cat, arr]) => {
      if (cat === "gates" || !Array.isArray(arr)) return
      ; (arr ?? []).forEach((s) => {
        const [xs, ys, zs] = s.split(";")
        const x = Number(xs)
        const y = Number(ys)
        const z = Number(zs)
        if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
          points.push({ cat, x, y, z })
        }
      })
    })

    return points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z,
    }))
  }, [isRaidZone, raidsData, mapId, referencePoint])

  // Raid point category ids (spawnpoint, extraction, gate_breakable, ...),
  // used to render the sidebar tile grid.
  const raidPointCategoryIds = useMemo(
    () => Array.from(new Set(raidPointMarkers.map((p) => p.cat))),
    [raidPointMarkers]
  )

  // Data for every gate puzzle (raids.json points.gates), keyed by gate id.
  const gatesData = useMemo(() => {
    if (!isRaidZone || !raidsData) return {} as Record<string, RaidGateData>
    const gates = raidsData[mapId]?.points?.gates
    return (gates ?? {}) as Record<string, RaidGateData>
  }, [isRaidZone, raidsData, mapId])

  // One toggle id per gate ("boss_gate", "extra_gate", ...) - this is the
  // "each gate is a single option in the resource toggles" id.
  const gateCategoryIds = useMemo(
    () => Object.keys(gatesData),
    [gatesData]
  )

  // Markers belonging to every gate: its gate location, its code location,
  // and every possible solution location. All markers for a given gate
  // share the same `gateId`, so toggling that one id shows/hides every
  // type of point for that gate at once.
  const gateMarkers = useMemo(() => {
    type GateMarkerType = "gate_location" | "code_location" | "solution_location"
    const points: Array<{
      gateId: string
      gateName: string
      markerType: GateMarkerType
      x: number
      y: number
      z: number
    }> = []

    Object.entries(gatesData).forEach(([gateId, gate]) => {
      const addPoint = (markerType: GateMarkerType, coord?: string) => {
        if (!coord) return
        const [xs, ys, zs] = coord.split(";")
        const x = Number(xs)
        const y = Number(ys)
        const z = Number(zs)
        if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
          points.push({ gateId, gateName: gate.name, markerType, x, y, z })
        }
      }

      addPoint("gate_location", gate.gate_location)
      addPoint("code_location", gate.code_location)
      ; (gate.solution_location ?? []).forEach((coord) =>
        addPoint("solution_location", coord)
      )
    })

    return points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z,
    }))
  }, [gatesData, referencePoint])

  useEffect(() => {
    let canceled = false
    const uniqueCategories = Array.from(
      new Set(allMarkers.map((m) => m.cat as string))
    )

    if (uniqueCategories.length === 0) {
      setMarkerIconUrls({})
      return
    }

    ; (async () => {
      try {
        const resolvedEntries = await Promise.all(
          uniqueCategories.map(async (cat) => {
            const resolvedUrl = await ItemImageUrl({ itemId: cat })
            return [cat, resolvedUrl] as const
          })
        )

        if (!canceled) {
          setMarkerIconUrls(Object.fromEntries(resolvedEntries))
        }
      } catch (e) {
        if (!canceled) {
          setMarkerIconUrls({})
        }
      }
    })()

    return () => {
      canceled = true
    }
  }, [allMarkers])

  const toggleResourceVisibility = (resourceId: string) => {
    setHiddenResources((prev) => {
      const next = { ...prev }
      if (next[resourceId]) {
        delete next[resourceId]
      } else {
        next[resourceId] = true
      }
      return next
    })
  }

  // Bulk-visibility helpers, shared by the "select all / deselect all"
  // controls both per-category and globally.
  const setItemsVisibility = (ids: string[], visible: boolean) => {
    if (ids.length === 0) return
    setHiddenResources((prev) => {
      const next = { ...prev }
      ids.forEach((id) => {
        if (visible) {
          delete next[id]
        } else {
          next[id] = true
        }
      })
      return next
    })
  }

  const isFullyHidden = (ids: string[]) =>
    ids.length > 0 && ids.every((id) => hiddenResources[id])

  // All item ids currently placed on the map (across every category/group,
  // including raid points and gates), used by the global select-all /
  // deselect-all controls.
  const allItemIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...allMarkers.map((m) => m.cat as string),
          ...raidPointCategoryIds,
          ...gateCategoryIds,
        ])
      ),
    [allMarkers, raidPointCategoryIds, gateCategoryIds]
  )

  const allItemsHidden = isFullyHidden(allItemIds)

  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <LeafletTooltipStyleOverrides />

      {isRaid && (
        <div className="flex w-full flex-row items-center gap-2 rounded-xl bg-linear-to-b from-card to-card-dark p-4 py-3 minebox-shadow">
          <span className="flex flex-col gap-0">
            <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
              {t("maps.raid_help_title")}
            </p>
            <p className="text-xs">
              {t("maps.raid_help_description")}
            </p>
          </span>
          <Button size="lg" className="ml-auto">
            <EN_Flag /> {t("maps.forum")}
          </Button>
          <Button size="lg">
            <FR_Flag /> {t("maps.forum")}
          </Button>
        </div>
      )}

      <div className="flex h-[80vh] w-full flex-row gap-4">
        {/* Map */}
        <span className="relative h-full w-3/4">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] opacity-70 blur-3xl transition-opacity duration-500"
          />
          <span className="relative block h-full w-full overflow-hidden rounded-xl bg-linear-to-b from-card to-card-dark minebox-shadow">
            {!harvestablesData ? (
              <div className="flex h-full items-center justify-center">
                {t("maps.loadingMap")}
              </div>
            ) : (
              <MapContainer
                crs={L.CRS.Simple}
                bounds={imageBounds}
                maxBounds={imageBounds}
                minZoom={mapZoom.min}
                maxZoom={mapZoom.max}
                style={{
                  height: "100%",
                  width: "100%",
                  imageRendering: "pixelated",
                  borderRadius: "0.5rem",
                  backgroundColor: "#00000000",
                }}
                attributionControl={false}
              >
                <ZoomWatcher onZoomChange={handleZoomChange} />
                <ImageOverlay url={image} bounds={imageBounds} />
                {allMarkers
                  .filter((m) => !hiddenResources[m.cat])
                  .map((m, i) => (
                    <Marker
                      key={`${m.cat}-${i}`}
                      position={[m.py, m.px]}
                      icon={L.icon({
                        iconUrl: markerIconUrls[m.cat] ?? "/media/missing.png",
                        iconSize: [24 * markerScale, 24 * markerScale],
                        iconAnchor: [12 * markerScale, 12 * markerScale],
                        popupAnchor: [0, -16 * markerScale],
                        className: outlineResources
                          ? "marker-icon-outline"
                          : "filter drop-shadow-[0_0_4px_#00000099]",
                      })}
                    >
                      <Tooltip direction="top" offset={[0, -10]}>
                        <div className="flex !w-max min-w-32 flex-row items-center gap-1 rounded-md bg-linear-to-b from-card to-card-dark px-2 py-1.5 text-xs minebox-shadow">
                          <ItemImage
                            itemId={m.cat}
                            className="aspect-square size-10"
                          />
                          <span className="flex flex-col items-start justify-center gap-0">
                            <p className="font-bold text-primary">
                              {t([`items_maps:items.${getCleanItemId(m.cat)}`], {
                                defaultValue: FindItemName({ itemId: m.cat }),
                              })}
                            </p>
                            <p className="flex flex-row gap-1 text-xs font-bold">
                              <span className="font-normal text-muted-foreground">
                                x:
                              </span>{" "}
                              {m.x}
                              <span className="font-normal text-muted-foreground">
                                y:
                              </span>{" "}
                              {m.y}
                              <span className="font-normal text-muted-foreground">
                                z:
                              </span>{" "}
                              {m.z}
                            </p>
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}

                {/* Raid points (spawnpoint, extraction, gate_breakable,
                    tumbstone, boss, ...) — rendered exactly like resource
                    markers: own icon (looked up by category name), same
                    scaling/outline behavior, visibility driven by the same
                    hiddenResources map used for the sidebar toggle. */}
                {raidPointMarkers
                  .filter((p) => !hiddenResources[p.cat])
                  .map((p, i) => (
                    <Marker
                      key={`raidpoint-${p.cat}-${i}`}
                      position={[p.py, p.px]}
                      icon={L.icon({
                        iconUrl: raidPointIconSrc(p.cat),
                        iconSize: [24 * markerScale, 24 * markerScale],
                        iconAnchor: [12 * markerScale, 12 * markerScale],
                        popupAnchor: [0, -16 * markerScale],
                        className: outlineResources
                          ? "marker-icon-outline"
                          : "filter drop-shadow-[0_0_4px_#00000099]",
                      })}
                    >
                      <Tooltip direction="top" offset={[0, -10]}>
                        <div className="flex !w-max min-w-32 flex-row items-center gap-1 rounded-md bg-linear-to-b from-card to-card-dark px-2 py-1.5 text-xs minebox-shadow">
                          <img
                            src={raidPointIconSrc(p.cat)}
                            onError={(e) => {
                              e.currentTarget.src = "/media/missing.png"
                            }}
                            alt={p.cat}
                            className="aspect-square size-10"
                          />
                          <span className="flex flex-col items-start justify-center gap-0">
                            <p className="font-bold text-primary">
                              {t(`maps.raid_point_types.${p.cat}`, {
                                defaultValue: formatRaidPointLabel(p.cat),
                              })}
                            </p>
                            <p className="flex flex-row gap-1 text-xs font-bold">
                              <span className="font-normal text-muted-foreground">
                                x:
                              </span>{" "}
                              {p.x}
                              <span className="font-normal text-muted-foreground">
                                y:
                              </span>{" "}
                              {p.y}
                              <span className="font-normal text-muted-foreground">
                                z:
                              </span>{" "}
                              {p.z}
                            </p>
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}

                {/* Gate puzzle points (points.gates): each gate is toggled
                    as ONE unit via hiddenResources[gateId], but shows every
                    marker type belonging to that gate (gate location, code
                    location, every possible solution location) once
                    enabled. Icon differs per marker type so the three kinds
                    stay visually distinct even though they share a toggle.
                    The gate's display name is translated the same way as
                    the sidebar tile and the puzzle card below, via
                    maps.gate_names.<gateId>, falling back to the raw name
                    coming from raids.json. */}
                {gateMarkers
                  .filter((p) => !hiddenResources[p.gateId])
                  .map((p, i) => (
                    <Marker
                      key={`gate-${p.gateId}-${p.markerType}-${i}`}
                      position={[p.py, p.px]}
                      icon={L.icon({
                        iconUrl: raidPointIconSrc(p.markerType),
                        iconSize: [24 * markerScale, 24 * markerScale],
                        iconAnchor: [12 * markerScale, 12 * markerScale],
                        popupAnchor: [0, -16 * markerScale],
                        className: outlineResources
                          ? "marker-icon-outline"
                          : "filter drop-shadow-[0_0_4px_#00000099]",
                      })}
                    >
                      <Tooltip direction="top" offset={[0, -10]}>
                        <div className="flex !w-max min-w-32 flex-row items-center gap-1 rounded-md bg-linear-to-b from-card to-card-dark px-2 py-1.5 text-xs minebox-shadow">
                          <img
                            src={raidPointIconSrc(p.markerType)}
                            onError={(e) => {
                              e.currentTarget.src = "/media/missing.png"
                            }}
                            alt={p.markerType}
                            className="aspect-square size-10"
                          />
                          <span className="flex flex-col items-start justify-center gap-0">
                            <p className="font-bold text-primary">
                              {t(`maps.gate_names.${p.gateId}`, {
                                defaultValue: p.gateName,
                              })}
                            </p>
                            <p className="text-[0.65rem] text-muted-foreground">
                              {t(`maps.raid_point_types.${p.markerType}`, {
                                defaultValue: formatRaidPointLabel(
                                  p.markerType
                                ),
                              })}
                            </p>
                            <p className="flex flex-row gap-1 text-xs font-bold">
                              <span className="font-normal text-muted-foreground">
                                x:
                              </span>{" "}
                              {p.x}
                              <span className="font-normal text-muted-foreground">
                                y:
                              </span>{" "}
                              {p.y}
                              <span className="font-normal text-muted-foreground">
                                z:
                              </span>{" "}
                              {p.z}
                            </p>
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}

                {showRegions &&
                  regionsData &&
                  (() => {
                    const baseNames = Object.keys(regionsData).map((name) =>
                      name.replace(/_\d+$/, "")
                    )
                    const uniqueBaseNames = [...new Set(baseNames)]
                    const colorMap: Record<string, string> = {}
                    uniqueBaseNames.forEach((base, i) => {
                      colorMap[base] = REGION_COLORS[i % REGION_COLORS.length]
                    })
                    return Object.entries(regionsData).map(
                      ([regionName, coords]) => {
                        const baseName = regionName.replace(/_\d+$/, "")
                        const color = colorMap[baseName]
                        const positions: [number, number][] = coords.map(
                          ([x, y]) => [y, x]
                        )
                        return (
                          <RegionPolygon
                            key={regionName}
                            positions={positions}
                            color={color}
                            label={t(`maps.${baseName}`, {
                              defaultValue: baseName,
                            })}
                          />
                        )
                      }
                    )
                  })()}
                {showBestiary &&
                  bestiaryZonesData &&
                  (() => {
                    const mapZones = mapId ? bestiaryZonesData[mapId] : null
                    if (!mapZones) return null
                    return Object.entries(mapZones).flatMap(
                      ([zoneName, zoneData]: any) =>
                        (zoneData.zones as any[]).map((zone, idx) => {
                          const positions: [number, number][] = zone.coords.map(
                            ([x, y]: [number, number]) => [y, x]
                          )
                          return (
                            <BestiaryPolygon
                              key={`${zoneName}-${idx}`}
                              positions={positions}
                              color={zone.color}
                              zoneName={zoneName}
                              mobs={(zone.mobs as string[]).map((id) => ({
                                id,
                                name: mobNamesData[id]?.name ?? id,
                                image: mobNamesData[id]?.image ?? "",
                              }))}
                            />
                          )
                        })
                    )
                  })()}
              </MapContainer>
            )}
          </span>
        </span>

        {/* Lists */}
        <Card className="h-[80vh] w-1/4 gap-0 py-0">
          <Select value={params["*"]} onValueChange={handleValueChange}>
            <SelectTrigger className="from-secondary-dark w-full bg-linear-to-b to-secondary !p-2 !py-5 text-primary uppercase minebox-shadow">
              <SelectValue
                className="text-md text-primary uppercase"
                placeholder={t("maps.selectMap")}
              />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                // grupujemy klucze mapConfig po polu `group`, zachowując kolejność pierwszego wystąpienia,
                // trzymając od razu cały wpis configu (a nie tylko klucz), żeby móc pokazać level/command
                const groups: Record<
                  string,
                  Array<[string, (typeof mapsConfig)[string]]>
                > = {}
                Object.entries(mapsConfig).forEach(([key, item]) => {
                  if (!groups[item.group]) groups[item.group] = []
                  groups[item.group].push([key, item])
                })

                return Object.entries(groups).map(([groupName, entries]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel className="mb-0 text-[0.6rem] text-muted-foreground uppercase">
                      {t(`maps.group.${groupName}`, {
                        defaultValue: groupName,
                      })}
                    </SelectLabel>
                    {entries.map(([key, item]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex w-full items-center justify-between gap-2">
                          <LevelBadge
                            level={item.level === 0 ? 1 : item.level}
                            className="hover:none -mx-2 w-16 scale-75"
                          >
                            {item.level === 0 ? (
                              <>{t("maps.levelShort")} 1</>
                            ) : (
                              <>
                                {t("maps.levelShort")} {item.level}
                              </>
                            )}
                          </LevelBadge>
                          <span>{t(`maps.island.${key}`)}</span>
                          <span className="ml-auto flex shrink-0 items-center gap-1.5">
                            {item.command && (
                              <span className="text-[0.6rem] text-muted-foreground">
                                {item.command}
                              </span>
                            )}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              })()}
            </SelectContent>
          </Select>

          {/* Global select all / deselect all across every category */}
          <div className="flex items-center justify-between gap-2 px-2 pt-2 text-[0.7rem]">
            <p
              onClick={() => setItemsVisibility(allItemIds, allItemsHidden)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setItemsVisibility(allItemIds, allItemsHidden)
                }
              }}
              className="cursor-pointer font-bold text-primary uppercase hover:underline"
            >
              {t("maps.resources")}
            </p>
            <button
              type="button"
              onClick={() => setItemsVisibility(allItemIds, allItemsHidden)}
              className="text-[0.6rem] font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              {allItemsHidden ? (
                <span className="flex items-center gap-1">
                  {t("maps.select_all")}
                  <EyeClosedIcon className="size-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {t("maps.deselect_all")}
                  <EyeIcon className="size-4" />
                </span>
              )}
            </button>
          </div>

          {/* Resources */}
          <div className="custom-scrollbar my-2 h-full w-full scroll-fade overflow-x-hidden overflow-y-auto px-2">
            {mergedLocationData ? (
              (() => {
                const serverKeys = Object.keys(mergedLocationData)
                const categories = Object.keys(
                  harvestablesData.harvestables ?? {}
                )
                // build accordion items per category, only if category has items on this server
                return categories.map((catKey) => {
                  const cat = harvestablesData.harvestables?.[catKey] ?? {}
                  const itemsInCat = Object.keys(cat).filter((id) =>
                    serverKeys.includes(id)
                  )
                  if (itemsInCat.length === 0) return null
                  const categoryHidden = isFullyHidden(itemsInCat)

                  return (
                    <span key={catKey} className="w-full px-2">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          onClick={() =>
                            setItemsVisibility(itemsInCat, categoryHidden)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              setItemsVisibility(itemsInCat, categoryHidden)
                            }
                          }}
                          className="cursor-pointer font-bold text-primary uppercase hover:underline"
                        >
                          {catKey}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setItemsVisibility(itemsInCat, categoryHidden)
                          }
                          className="text-[0.6rem] font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                        >
                          {categoryHidden ? (
                            <span className="flex items-center gap-1">
                              {t("maps.select_all")}
                              <EyeClosedIcon className="size-4" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              {t("maps.deselect_all")}
                              <EyeIcon className="size-4" />
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {itemsInCat.map((id) => {
                          const minLevel = cat[id]?.min_level ?? "0"
                          const levelNum = Number(minLevel) || 0
                          const isHidden = Boolean(hiddenResources[id])
                          return (
                            <div
                              key={id}
                              onClick={() => toggleResourceVisibility(id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault()
                                  toggleResourceVisibility(id)
                                }
                              }}
                              className={`group relative flex cursor-pointer flex-col items-center justify-start gap-2 rounded border-[3px] p-0.5 transition-colors ${isHidden
                                ? "border-card-dark/70 bg-card/70"
                                : "border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50"
                                }`}
                            >
                              <ItemImage
                                itemId={id}
                                className={`aspect-square w-4/5 transition-transform group-hover:scale-105 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                              />

                              <p
                                className={`-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none ${isHidden ? "opacity-50 saturate-50" : ""}`}
                              >
                                {t(
                                  [
                                    `items.${getCleanItemId(id)}`,
                                    `items_maps:items.${getCleanItemId(id)}`,
                                  ],
                                  { defaultValue: FindItemName({ itemId: id }) }
                                )}
                              </p>

                              <LevelBadge
                                level={levelNum}
                                className={`-mt-1 scale-90 uppercase ${isHidden ? "opacity-80 saturate-50" : ""}`}
                              >
                                {t("maps.levelShort")} {levelNum}
                              </LevelBadge>
                            </div>
                          )
                        })}
                      </div>
                    </span>
                  )
                })
              })()
            ) : (
              <></>
            )}

            {/* Additional categories loaded from maps.json (treasure, and any future groups) */}
            {mapsData?.[mapId] &&
              Object.entries(mapsData[mapId]).map(([group, itemsObj]: any) => {
                const groupIds = Object.keys(itemsObj)
                const groupHidden = isFullyHidden(groupIds)
                return (
                  <span key={group} className="w-full px-2">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        onClick={() =>
                          setItemsVisibility(groupIds, groupHidden)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setItemsVisibility(groupIds, groupHidden)
                          }
                        }}
                        className="cursor-pointer font-bold text-primary uppercase hover:underline"
                      >
                        {group}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setItemsVisibility(groupIds, groupHidden)
                        }
                        className="text-[0.6rem] font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                      >
                        {groupHidden ? (
                          <span className="flex items-center gap-1">
                            {t("maps.select_all")}
                            <EyeClosedIcon className="size-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            {t("maps.deselect_all")}
                            <EyeIcon className="size-4" />
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {groupIds.map((id) => {
                        const isHidden = Boolean(hiddenResources[id])
                        return (
                          <div
                            key={id}
                            onClick={() => toggleResourceVisibility(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                toggleResourceVisibility(id)
                              }
                            }}
                            className={`flex cursor-pointer flex-col items-center justify-start gap-2 rounded transition-colors ${isHidden
                              ? "bg-red-500/40"
                              : "bg-transparent hover:bg-accent/40"
                              }`}
                          >
                            <ItemImage
                              itemId={id}
                              className={`aspect-square size-4/5 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                            />
                            <p className="-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none">
                              {t(
                                [
                                  `items.${getCleanItemId(id)}`,
                                  `items_maps:items.${getCleanItemId(id)}`,
                                ],
                                { defaultValue: FindItemName({ itemId: id }) }
                              )}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </span>
                )
              })}

            {/* Raid points (raids.json): spawnpoint, extraction,
                gate_breakable, tumbstone, boss, ... — shown as its own
                resource-style category, hidden on the map by default. */}
            {isRaidZone && raidPointCategoryIds.length > 0 && (
              (() => {
                const pointsHidden = isFullyHidden(raidPointCategoryIds)
                return (
                  <span className="w-full px-2">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        onClick={() =>
                          setItemsVisibility(raidPointCategoryIds, pointsHidden)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setItemsVisibility(
                              raidPointCategoryIds,
                              pointsHidden
                            )
                          }
                        }}
                        className="cursor-pointer font-bold text-primary uppercase hover:underline"
                      >
                        {t("maps.raid_points", {
                          defaultValue: "Raid Points",
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setItemsVisibility(raidPointCategoryIds, pointsHidden)
                        }
                        className="text-[0.6rem] font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                      >
                        {pointsHidden ? (
                          <span className="flex items-center gap-1">
                            {t("maps.select_all")}
                            <EyeClosedIcon className="size-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            {t("maps.deselect_all")}
                            <EyeIcon className="size-4" />
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {raidPointCategoryIds.map((cat) => {
                        const isHidden = Boolean(hiddenResources[cat])
                        return (
                          <div
                            key={cat}
                            onClick={() => toggleResourceVisibility(cat)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                toggleResourceVisibility(cat)
                              }
                            }}
                            className={`group relative flex cursor-pointer flex-col items-center justify-start gap-2 rounded border-[3px] p-0.5 transition-colors ${isHidden
                              ? "border-card-dark/70 bg-card/70"
                              : "border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50"
                              }`}
                          >
                            <img
                              src={raidPointIconSrc(cat)}
                              onError={(e) => {
                                e.currentTarget.src = "/media/missing.png"
                              }}
                              alt={cat}
                              loading="lazy"
                              className={`aspect-square w-4/5 transition-transform group-hover:scale-105 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                            />
                            <p
                              className={`-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none ${isHidden ? "opacity-50 saturate-50" : ""}`}
                            >
                              {t(`maps.raid_point_types.${cat}`, {
                                defaultValue: formatRaidPointLabel(cat),
                              })}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </span>
                )
              })()
            )}

            {/* Gate puzzles (points.gates): one toggle tile PER GATE
                (e.g. "Boss Gate", "Extra Gate"), not per marker type.
                Enabling a tile shows that gate's location, code location,
                and every possible solution location together. Each gate's
                display name is translatable via maps.gate_names.<gateId>,
                falling back to the raw name stored in raids.json. */}
            {isRaidZone && gateCategoryIds.length > 0 && (
              (() => {
                const gatesHidden = isFullyHidden(gateCategoryIds)
                return (
                  <span className="w-full px-2">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        onClick={() =>
                          setItemsVisibility(gateCategoryIds, gatesHidden)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setItemsVisibility(gateCategoryIds, gatesHidden)
                          }
                        }}
                        className="cursor-pointer font-bold text-primary uppercase hover:underline"
                      >
                        {t("maps.raid_gates", {
                          defaultValue: "Gates",
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setItemsVisibility(gateCategoryIds, gatesHidden)
                        }
                        className="text-[0.6rem] font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                      >
                        {gatesHidden ? (
                          <span className="flex items-center gap-1">
                            {t("maps.select_all")}
                            <EyeClosedIcon className="size-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            {t("maps.deselect_all")}
                            <EyeIcon className="size-4" />
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {gateCategoryIds.map((gateId) => {
                        const gate = gatesData[gateId]
                        const isHidden = Boolean(hiddenResources[gateId])
                        return (
                          <div
                            key={gateId}
                            onClick={() => toggleResourceVisibility(gateId)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                toggleResourceVisibility(gateId)
                              }
                            }}
                            className={`group relative flex cursor-pointer flex-col items-center justify-start gap-2 rounded border-[3px] p-0.5 transition-colors ${isHidden
                              ? "border-card-dark/70 bg-card/70"
                              : "border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50"
                              }`}
                          >
                            <img
                              src={raidPointIconSrc(gateId)}
                              onError={(e) => {
                                e.currentTarget.src = "/media/missing.png"
                              }}
                              alt={gateId}
                              loading="lazy"
                              className={`aspect-square w-4/5 transition-transform group-hover:scale-105 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                            />
                            <p
                              className={`-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none ${isHidden ? "opacity-50 saturate-50" : ""}`}
                            >
                              {t(`maps.gate_names.${gateId}`, {
                                defaultValue: gate?.name ?? formatRaidPointLabel(gateId),
                              })}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </span>
                )
              })()
            )}
          </div>

          {/* Settings */}
          <span className="m-2 mb-3 flex flex-col gap-1 rounded border-[3px] border-secondary bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-2">
            <p>{t("maps.preview_settings")}</p>
            <div className="flex items-center space-x-2">
              <Switch
                id="regions"
                checked={showRegions}
                onCheckedChange={setShowRegions}
              />
              <Label htmlFor="regions">{t("maps.show_regions")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bestairy"
                checked={showBestiary}
                onCheckedChange={setShowBestiary}
              />
              <Label htmlFor="bestairy">{t("maps.show_bestiary")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="outline-resources"
                checked={outlineResources}
                onCheckedChange={setOutlineResources}
              />
              <Label htmlFor="outline-resources">
                {t("maps.outline_resources", {
                  defaultValue: "Outline resources",
                })}
              </Label>
            </div>
          </span>
        </Card>
      </div>
      {/*}
      {isRaid && (
        <Card className="w-full gap-2 px-4 pt-3">
          <span className="flex flex-row items-center justify-between gap-0">
            <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
              Raid Useful Data
            </p>
            <p className="text-xs text-muted-foreground">Some Info Desc</p>
          </span>

          <p>
            Over time, information will start appearing here about the locations
            of codes, where special rooms and chests may appear, tips on how to
            defeat the boss, and other useful information.
          </p>
        </Card>
      )}*/}

      {/* Fish Drops */}
      {(() => {
        const fishCat = harvestablesData?.harvestables?.fish ?? {}
        const serverKeys = mergedLocationData
          ? Object.keys(mergedLocationData)
          : []
        const fishIds = Object.keys(fishCat).filter((id) =>
          serverKeys.includes(id)
        )

        if (fishIds.length === 0) return null

        return fishIds.map((id) => {
          const fishData = fishCat[id]
          const drops = (fishData?.drops ?? [])
            .slice()
            .sort((a: any, b: any) => Number(b.chance) - Number(a.chance))

          const fishTitle = t(
            [
              `items.${getCleanItemId(id)}`,
              `items_maps:items.${getCleanItemId(id)}`,
            ],
            { defaultValue: FindItemName({ itemId: id }) }
          )

          return (
            <div className="flex w-full flex-col gap-2 pt-3">
              <span className="flex flex-row items-center justify-between gap-0">
                <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
                  {fishTitle}
                </p>
                <p className="text-xs text-muted-foreground">{t("maps.fish_description")}</p>
              </span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
                {drops.map((drop: any, dropIndex: number) => (
                  <RarityBorder
                    rarity={FindItemRarity({ itemId: drop.item })}
                    key={`${drop.item}-${dropIndex}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <ItemImage
                      itemId={drop.item}
                      className="mx-auto mb-auto aspect-square w-4/5 transition-transform group-hover:scale-105"
                      style={{
                        filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: drop.item }))}40)`,
                      }}
                    />
                    <p className="text-center text-xs leading-none">
                      {t(
                        [
                          `items.${getCleanItemId(drop.item)}`,
                          `items_maps:items.${getCleanItemId(drop.item)}`,
                        ],
                        { defaultValue: FindItemName({ itemId: drop.item }) }
                      )}
                    </p>
                    <span className="-mt-1 flex flex-col gap-0 -space-y-1">
                      <span className="flex flex-row items-center justify-between">
                        <p className="text-[0.60rem] leading-none text-muted-foreground">
                          {t("maps.chance")}
                        </p>
                        <p className="text-[0.70rem]">
                          {Number(drop.chance).toFixed(2)}%
                        </p>
                      </span>
                    </span>
                  </RarityBorder>
                ))}
              </div>
            </div>
          )
        })
      })()}




      {/* RAID PUZZLE ELEMENT — one card per gate (points.gates) */}
      {isRaidZone &&
        gateCategoryIds.map((gateId) => {
          const gate = gatesData[gateId]
          if (!gate) return null
          const gateLabel = t(`maps.gate_names.${gateId}`, {
            defaultValue: gate.name,
          })
          const solutions = gate.solution_location ?? []

          return (
            <Card key={gateId} className="w-full gap-2 px-4 pt-3">
              <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
                {gateLabel} — {t("maps.puzzle_gate_solutions")}
              </p>
              <span className="gap-2 grid grid-cols-3 items-center justify-center">
                <span className="relative rounded border-[3px] border-secondary bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-0">
                  <img
                    src={`/media/raid/${mapId}/${gateId}_gate.png`}
                    onError={(e) => {
                      e.currentTarget.src = "/media/missing.png"
                    }}
                    className="aspect-auto w-full rounded"
                  />

                  <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-bottom bg-secondary opacity-70 w-full h-full"></div>
                  <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-top bg-secondary opacity-70 w-full h-full"></div>

                  <p className="text-center absolute top-2 left-0 right-0 text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">{gateLabel}</p>
                  <p className="absolute top-8 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                    {t("maps.gate_location")}
                  </p>
                  <p className="text-center absolute bottom-2 left-0 right-0 text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">{formatCoords(gate.gate_location)}</p>
                  <p className="absolute bottom-7 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                    {t("maps.coordinates")}
                  </p>
                </span>
                <span className="relative rounded border-[3px] border-secondary bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-0">
                  <img
                    src={`/media/raid/${mapId}/${gateId}_solution.png`}
                    onError={(e) => {
                      e.currentTarget.src = "/media/missing.png"
                    }}
                    className="aspect-auto w-full rounded"
                  />

                  <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-bottom bg-secondary opacity-70 w-full h-full"></div>
                  <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-top bg-secondary opacity-70 w-full h-full"></div>

                  <p className="text-center absolute top-2 left-0 right-0 text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">{t("maps.code_location")}</p>
                  <p className="absolute top-8 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                    {gateLabel}
                  </p>
                  <p className="text-center absolute bottom-2 left-0 right-0 text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">{formatCoords(gate.code_location)}</p>
                  <p className="absolute bottom-7 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                    {t("maps.coordinates")}
                  </p>
                </span>
                {solutions.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent className="w-full">
                      {solutions.map((solutionCoord, index) => (
                        <CarouselItem key={index} className="basis-full">
                          <div className="relative w-full rounded border-[3px] border-secondary bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-0">

                            <img
                              src={`/media/raid/${mapId}/${gateId}_${index + 1}.png`}
                              onError={(e) => {
                                e.currentTarget.src = "/media/missing.png"
                              }}
                              className="w-full rounded r"
                            />

                            <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-bottom bg-secondary opacity-70 w-full h-full"></div>
                            <div className="absolute  top-0 left-0 rounded mask-radial-from-0% mask-radial-to-40% mask-radial-at-top bg-secondary opacity-70 w-full h-full"></div>

                            <p className="absolute top-2 left-0 right-0 text-center text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
                              {t("maps.possible_solution_location", {
                                index: index + 1,
                              })}
                            </p>
                            <p className="absolute top-8 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                              {gateLabel}
                            </p>
                            <p className="absolute bottom-2 left-0 right-0 text-center  text-center text-lg font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
                              {formatCoords(solutionCoord)}
                            </p>
                            <p className="absolute bottom-7 left-0 right-0 text-center text-[0.6rem] uppercase text-muted-foreground">
                              {t("maps.coordinates")}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-2 rounded !bg-card" />
                    <CarouselNext className="right-6 rounded !bg-card" />
                  </Carousel>
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded border-[3px] border-secondary bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-4 text-center text-xs text-muted-foreground">
                    {t("maps.no_solution_locations", {
                      defaultValue: "No solution locations known yet",
                    })}
                  </span>
                )}
              </span>
            </Card>
          )
        })}



      {/* Insects */}
      <div className="flex w-full flex-col gap-2 pt-3">
        <span className="flex flex-row items-center justify-between gap-0">
          <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
            {t("maps.insects")}
          </p>
          <p className="text-xs text-muted-foreground">{t("maps.insects_description")}</p>
        </span>

        {isInsectsLoading ? (
          <p className="text-xs text-muted-foreground">
            {t("maps.loadingInsects")}
          </p>
        ) : insectsError ? (
          <p className="text-xs text-red-400">{insectsError}</p>
        ) : insectsForZone.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("maps.noInsects")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
            {insectsForZone.map((insect) => {
              const subareas = isRaidZone
                ? []
                : insect.locations
                  .filter((loc) => loc.zone === zoneFullKey)
                  .map((loc) => formatSubarea(loc.subarea))

              return (
                <Popover key={insect.id}>
                  <PopoverTrigger>
                    <RarityBorder
                      rarity={FindItemRarity({ itemId: insect.id })}
                      className="group flex h-full flex-col items-center gap-2"
                    >
                      <ItemImage
                        itemId={insect.id}
                        className="mx-auto mb-auto aspect-square size-4/5 transition-transform group-hover:scale-105"
                        style={{
                          filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: insect.id }))}40)`,
                        }}
                      />
                      <p className="text-center text-xs">
                        {t(`insects:insects.${getCleanItemId(insect.id)}`, {
                          defaultValue: FindItemName({ itemId: insect.id }),
                        })}
                      </p>
                      {!isRaidZone && (
                        <p className="cursor-pointer text-center text-[0.6rem] text-muted-foreground group-hover:text-primary group-hover:underline">
                          {t("maps.view_conditions")}
                        </p>
                      )}
                    </RarityBorder>
                  </PopoverTrigger>
                  <PopoverContent className="gap-1">
                    <span className="flex flex-row items-center gap-2">
                      <RarityBadge
                        rarity={FindItemRarity({ itemId: insect.id })}
                      />
                      <p>
                        {t(`insects:insects.${getCleanItemId(insect.id)}`, {
                          defaultValue: FindItemName({ itemId: insect.id }),
                        })}
                      </p>
                    </span>

                    <span className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-[0.65rem] text-muted-foreground">
                        {t("insects:insects.spawnTime")}
                      </p>
                      <p className="text-[0.65rem]">
                        {insect.time_ranges
                          .map((range) => formatTimeRange(range))
                          .join(", ")}
                      </p>
                    </span>

                    <span className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-[0.65rem] text-muted-foreground">
                        {t("insects:insects.weather")}
                      </p>
                      <p className="text-[0.65rem]">{insect.weather}</p>
                    </span>

                    {!isRaidZone && (
                      <span className="flex w-full flex-row items-center justify-between gap-2">
                        <p className="text-[0.65rem] text-muted-foreground">
                          {t("insects:insects.spawnArea")}
                        </p>
                        <span>
                          {subareas.map((area, index) => (
                            <p key={index} className="text-right text-[0.65rem]">
                              {area}
                            </p>
                          ))}
                        </span>
                      </span>
                    )}

                    {insect.requires_moon && (
                      <span className="flex w-full flex-row items-center justify-between gap-2">
                        <p className="text-[0.65rem] text-muted-foreground">
                          {t("insects.extraConditions")}
                        </p>
                        <p className="text-[0.65rem]">
                          {t("insects:insects.fullMoon")}
                        </p>
                      </span>
                    )}
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
        )}
      </div>

      {/* Bestiary */}
      <div className="flex w-full flex-col gap-2 pt-3">
        <span className="flex flex-row items-center justify-between gap-0">
          <p className="text-xl font-bold tracking-wider text-primary uppercase drop-shadow-[0_3px_0_#5d3a00]">
            {t("maps.bestiary")}
          </p>
          <p className="text-xs text-muted-foreground">{t("maps.bestiary_description")}</p>
        </span>

        {isRaidZone ? (
          (raidsData?.[mapId]?.bestiary ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {t("maps.noCreatures")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
              {raidsData![mapId].bestiary.map((id) => (
                <BestiaryItem
                  key={id}
                  id={id}
                  name={mobNamesData[id]?.name ?? id}
                  image={mobNamesData[id]?.image ?? ""}
                  minLevel={0}
                  maxLevel={0}
                  minHealth={0}
                  maxHealth={0}
                  type=""
                />
              ))}
            </div>
          )
        ) : isBestiaryLoading ? (
          <p className="text-xs text-muted-foreground">
            {t("maps.loadingCreatures")}
          </p>
        ) : bestiaryError ? (
          <p className="text-xs text-red-400">{bestiaryError}</p>
        ) : (bestiaryData?.creatures?.length ?? 0) === 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("maps.noCreatures")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
            {bestiaryData?.creatures.map((creature) => (
              <BestiaryItem
                key={creature.id}
                id={creature.id}
                name={creature.name}
                image={creature.image}
                minLevel={creature.level}
                maxLevel={creature.level_max}
                minHealth={creature.health[0]}
                maxHealth={creature.health[1]}
                type={creature.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPreview