import { Card } from "@ui/card"
import { LevelBadge } from "@const/levels"
import React, { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
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

const mapsConfig: Record<
  string,
  {
    image: string
    width: number
    height: number
    referencePoint: { x: number; y: number }
    iconScale: { min: number; max: number }
    zoneKey: string
    mapZoom: { min: number; max: number }
    scaleIconMultiplier: number
  }
> = {
  spawn: {
    image: "/media/maps/spawn_map.png",
    width: 791,
    height: 839,
    referencePoint: { x: 220, y: 388 },
    iconScale: { min: 1, max: 2.5 },
    zoneKey: "overworld",
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  island_home: {
    image: "/media/maps/home_island_map.png",
    width: 320,
    height: 320,
    referencePoint: { x: 34, y: 284 },
    iconScale: { min: 1.25, max: 2 },
    zoneKey: "",
    mapZoom: { min: 1.4, max: 3 },
    scaleIconMultiplier: 1,
  },
  island_nether: {
    image: "/media/maps/island_nether_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    iconScale: { min: 1.2, max: 2.5 },
    zoneKey: "",
    mapZoom: { min: 2, max: 3 },
    scaleIconMultiplier: 1,
  },
  island_end: {
    image: "/media/maps/island_end_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    iconScale: { min: 1.25, max: 2.5 },
    zoneKey: "",
    mapZoom: { min: 1.5, max: 3 },
    scaleIconMultiplier: 1,
  },
  island_tropical: {
    image: "/media/maps/island_tropical_map.png",
    width: 528,
    height: 528,
    referencePoint: { x: 0, y: 0 },
    iconScale: { min: 1, max: 2.5 },
    zoneKey: "island_tropical",
    mapZoom: { min: 0.2, max: 3 },
    scaleIconMultiplier: 0.5,
  },
  island_plain: {
    image: "/media/maps/island_plain_map.png",
    width: 608,
    height: 560,
    referencePoint: { x: 81, y: 16 },
    iconScale: { min: 1, max: 2 },
    zoneKey: "island_plain",
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },
  island_bamboo: {
    image: "/media/maps/island_bamboo_map.png",
    width: 1256,
    height: 608,
    referencePoint: { x: 633, y: 611 },
    iconScale: { min: 1.2, max: 2.5 },
    zoneKey: "island_bamboo",
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },
  island_snow: {
    image: "/media/maps/island_snow_map.png",
    width: 720,
    height: 720,
    referencePoint: { x: 129, y: 64 },
    iconScale: { min: 1.2, max: 2 },
    zoneKey: "island_snow",
    mapZoom: { min: 0, max: 2.5 },
    scaleIconMultiplier: 0.7,
  },
  island_desert: {
    image: "/media/maps/island_desert_map.png",
    width: 752,
    height: 752,
    referencePoint: { x: 128, y: 720 },
    iconScale: { min: 1, max: 2 },
    zoneKey: "island_desert",
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },
}

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

// Shared CSS to strip Leaflet's default tooltip chrome (background, border,
// forced nowrap sizing) so our own styled tooltip content controls layout.
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
      <Tooltip sticky direction="center">
        <div
          className="rounded-md border-l-4 bg-linear-to-b from-card to-card-dark px-3 py-1.5 minebox-shadow"
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
      <Tooltip sticky direction="center">
        <div
          className="max-w-[240px] min-w-[160px] rounded-md border-l-6 bg-linear-to-b from-card to-card-dark px-3 py-2 minebox-shadow"
          style={{ borderLeftColor: color }}
        >
          <p className="text-xs font-bold text-muted-foreground">{t("maps.region")}</p>
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

function SafeItemImage({ itemId, className, style }: { itemId: string; className?: string; style?: React.CSSProperties }) {
  try {
    return <ItemImage itemId={itemId} className={className} style={style} />
  } catch {
    return <img src="/media/missing.png" className={className} style={style} alt="?" />
  }
}

class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center text-red-400">
          {this.props.children && typeof this.props.children === 'object' ? 'Map error' : 'Map error'}
        </div>
      );
    }
    return this.props.children;
  }
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

  const params = useParams()
  const mapId = params["*"] ?? ""

  // --- MAP CONFIG (looked up early so hooks below can safely reference it) ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig]

  const { t } = useTranslation(["maps", "items_maps", "insects"])
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

  const navigate = useNavigate()
  const handleValueChange = (value: string) => {
    navigate(`/maps/${value}`)
  }

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center">
        {t("maps.mapNotFound")}
      </div>
    )
  }
  const { image, width, height, referencePoint, zoneKey, mapZoom } = config

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
  }, [mapId, t])

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

  const insectsForZone = (insectsData ?? []).filter((insect) =>
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

  const [resourceMarkers, setResourceMarkers] = useState<any[]>([])
  const [mapsJsonMarkers, setMapsJsonMarkers] = useState<any[]>([])
  const [markerIconUrls, setMarkerIconUrls] = useState<Record<string, string>>(
    {}
  )

  // Stabilne ikony tworzone tylko gdy zmieni się skala lub url
  const markerIcons = useMemo(() => {
    const icons: Record<string, L.Icon> = {}
    Object.entries(markerIconUrls).forEach(([cat, url]) => {
      icons[cat] = L.icon({
        iconUrl: url ?? "/media/missing.png",
        iconSize: [24 * markerScale, 24 * markerScale],
        iconAnchor: [12 * markerScale, 12 * markerScale],
        popupAnchor: [0, -16 * markerScale],
        className: `filter drop-shadow-[0_0_4px_#00000099]`,
      })
    })
    return icons
  }, [markerIconUrls, markerScale])

  useEffect(() => {
    if (!harvestablesData) return
    const serverData = harvestablesData?.locations?.servers?.[mapId]
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
      ;(arr as string[]).forEach((s) => {
        const parts = s.split(";")
        if (parts.length >= 4) {
          const x = Number(parts[1])
          const y = Number(parts[2])
          const z = Number(parts[3])
          if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
            points.push({ cat, item: parts[0], x, y, z })
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
  }, [harvestablesData, mapId, referencePoint])

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

  useEffect(() => {
    let canceled = false
    const uniqueCategories = Array.from(
      new Set(allMarkers.map((m) => m.cat as string))
    )

    if (uniqueCategories.length === 0) {
      setMarkerIconUrls({})
      return
    }

    ;(async () => {
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

  // All item ids currently placed on the map (across every category/group),
  // used by the global select-all / deselect-all controls.
  const allItemIds = useMemo(
    () => Array.from(new Set(allMarkers.map((m) => m.cat as string))),
    [allMarkers]
  )

  const allItemsHidden = isFullyHidden(allItemIds)

  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <LeafletTooltipStyleOverrides />
      <div className="flex h-[80vh] w-full flex-row gap-4">
        {/* Map */}
        <span className="h-full w-3/4 rounded-xl">
          {!harvestablesData ? (
            <div className="flex h-full items-center justify-center">
              {t("maps.loadingMap")}
            </div>
          ) : (
            <MapErrorBoundary>
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
                      icon={markerIcons[m.cat] ?? L.icon({
                        iconUrl: "/media/missing.png",
                        iconSize: [24 * markerScale, 24 * markerScale],
                        iconAnchor: [12 * markerScale, 12 * markerScale],
                        popupAnchor: [0, -16 * markerScale],
                        className: `filter drop-shadow-[0_0_4px_#00000099]`,
                      })}
                    >
                      <Tooltip
                        direction="top"
                        offset={[0, -8 * markerScale]}
                        opacity={1}
                      >
                        <div className="flex !w-max min-w-32 flex-row items-center gap-1 rounded-md bg-linear-to-b from-card to-card-dark px-2 py-1.5 text-xs minebox-shadow">
                          <SafeItemImage
                            itemId={m.cat}
                            className="aspect-square size-10"
                          />
                          <span className="flex flex-col items-start justify-center gap-0">
                            <p className="font-bold text-primary">
                              {t([`items_items.${getCleanItemId(m.cat)}`], {
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
            </MapErrorBoundary>
          )}
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
              <SelectGroup>
                {Object.entries(mapsConfig).map(([key, item]) => (
                  <SelectItem key={key} value={key}>
                    {t(`maps.island.${key}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
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
            {harvestablesData?.locations?.servers?.[mapId] ? (
              (() => {
                const serverKeys = Object.keys(
                  harvestablesData.locations.servers[mapId]
                )
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
                              className={`relative flex cursor-pointer flex-col items-center justify-start gap-2 rounded transition-colors ${isHidden
                                ? "bg-red-500/40"
                                : "bg-transparent hover:bg-accent/40"
                                }`}
                            >
                              <SafeItemImage
                                itemId={id}
                                className={`aspect-square size-4/5 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                              />

                              <p className="-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none">
                                {t(
                                  [
                                    `items.${getCleanItemId(id)}`,
                                    `items_items.${getCleanItemId(id)}`,
                                  ],
                                  { defaultValue: FindItemName({ itemId: id }) }
                                )}
                              </p>

                              <LevelBadge
                                level={levelNum}
                                className="-mt-1 scale-90 uppercase"
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
                            <SafeItemImage
                              itemId={id}
                              className={`aspect-square size-4/5 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                            />
                            <p className="-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none">
                              {t(
                                [
                                  `items.${getCleanItemId(id)}`,
                                  `items_items.${getCleanItemId(id)}`,
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
          </div>

          {/* Settings */}
          <Card className="from-secondary-dark w-full gap-2 to-secondary p-2 py-3 pb-8">
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
          </Card>
        </Card>
      </div>

      {/* Fish Drops */}
      {(() => {
        const fishCat = harvestablesData?.harvestables?.fish ?? {}
        const serverKeys = harvestablesData?.locations?.servers?.[mapId]
          ? Object.keys(harvestablesData.locations.servers[mapId])
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
              `items_items.${getCleanItemId(id)}`,
            ],
            { defaultValue: FindItemName({ itemId: id }) }
          )

          return (
            <div key={id} className="mt-8 w-full gap-2">
              <p className="mb-2 text-center text-xl font-bold text-primary uppercase">
                {fishTitle}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
                {drops.map((drop: any, dropIndex: number) => (
                  <RarityBorder
                    rarity={FindItemRarity({ itemId: drop.item })}
                    key={`${drop.item}-${dropIndex}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <SafeItemImage
                      itemId={drop.item}
                      className="mx-auto mb-auto aspect-square w-4/5  group-hover:scale-105 transition-transform"
                      style={{
                        filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: drop.item }))}40)`,
                      }}
                    />
                    <p className="text-center text-xs leading-none">
                      {t(
                        [
                          `items.${getCleanItemId(drop.item)}`,
                          `items_items.${getCleanItemId(drop.item)}`,
                        ],
                        { defaultValue: FindItemName({ itemId: drop.item }) }
                      )}
                    </p>
                    <span className="flex flex-col gap-0 -space-y-1 -mt-1">
                      <span className="flex flex-row justify-between items-center">
                        <p className="text-[0.60rem] text-muted-foreground leading-none">{t("maps.chance")}</p>
                        <p className="text-[0.70rem] ">{Number(drop.chance).toFixed(2)}%</p>
                      </span>
                    </span>
                  </RarityBorder>
                ))}
              </div>
            </div>
          )
        })
      })()}

      {/* Insects */}
      <div className="w-full gap-2">
        <p className="mb-2 text-center text-xl font-bold text-primary uppercase">
          {t("maps.insects")}
        </p>

        {isInsectsLoading ? (
          <p className="text-xs text-muted-foreground">{t("maps.loadingInsects")}</p>
        ) : insectsError ? (
          <p className="text-xs text-red-400">{insectsError}</p>
        ) : insectsForZone.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("maps.noInsects")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {insectsForZone.map((insect) => {
              const subareas = insect.locations
                .filter((loc) => loc.zone === zoneFullKey)
                .map((loc) => formatSubarea(loc.subarea))

              return (
                    <RarityBorder
                      rarity={FindItemRarity({ itemId: insect.id })}
                      key={insect.id}
                      className="group flex flex-col items-center gap-2 h-full "
                      innerClassName=""
                    >
                      <ItemImage
                        itemId={insect.id}
                        className="mx-auto mb-auto aspect-square w-4/5 transition-transform group-hover:scale-105"
                        style={{
                          filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: insect.id }))}40)`,
                        }}
                      />
                      <p className="text-center text-xs">
                        {t(`insects.${getCleanItemId(insect.id)}`, {
                          defaultValue: FindItemName({ itemId: insect.id }),
                        })}
                      </p>

<span>
                    <span className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-[0.60rem] text-muted-foreground">
                        {t("maps.spawnTime")}
                      </p>
                      <p className="text-[0.60rem]">
                        {insect.time_ranges
                          .map((range) => formatTimeRange(range))
                          .join(", ")}
                      </p>
                    </span>

                    <span className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-[0.6rem] text-muted-foreground">
                        {t("maps.weather")}
                      </p>
                      <p className="text-[0.6rem]">{insect.weather}</p>
                    </span>

                    
                    {insect.requires_moon && (
                      <span className="flex w-full flex-row items-center justify-between gap-2">
                        <p className="text-[0.6rem] text-muted-foreground">
                          {t("maps.extraConditions")}
                        </p>
                        <p className="text-[0.6rem]">{t("maps.fullMoon")}</p>
                      </span>
                    )}


                    <span className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-[0.60rem] text-muted-foreground">
                        {t("maps.spawnArea")}
                      </p>
                      <span className="flex flex-col -space-y-1">
                        {subareas.map((area, index) => (
                          <p key={index} className="text-right text-[0.6rem]">
                            {area}
                          </p>
                        ))}
                      </span>
                    </span>
                    </span>
                    </RarityBorder>
              )
            })}
          </div>
        )}
      </div>

      {/* Bestiary */}
      <div className="mt-8 w-full gap-2">
        <p className="mb-2 text-center text-xl font-bold text-primary uppercase">
          {t("maps.bestiary")}
        </p>

        {isBestiaryLoading ? (
          <p className="text-xs text-muted-foreground">{t("maps.loadingCreatures")}</p>
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