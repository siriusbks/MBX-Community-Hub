import { useEffect, useRef, useState, useCallback } from "react"
import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { ItemSlot, RarityBorder } from "@const/rarities"
import { FindItemName, ItemImage } from "@const/elements"
import { Alert, AlertDescription } from "@components/ui/alert"
import { Link } from "react-router"
import { Button } from "@components/ui/button"
import { CircleQuestionMarkIcon, InfoIcon } from "lucide-react"
import { Badge } from "@components/ui/badge"
import { useTranslation } from "react-i18next";

const API_URL = "https://mineboxadditions.bartier.me/shop"
const MERMAID_API_URL = "https://mineboxadditions.bartier.me/mermaid"

// In the game, 24h pass in 1 real hour (x24 multiplier)
const TIME_SPEED_MULTIPLIER = 24

interface ShopOffer {
    item: string
    timestamp: number
}

interface Shop {
    id: string
    openFrom: string
    openUntil: string
    isOpen: boolean
    offer: ShopOffer | null
}

interface ShopsResponse {
    currentTime: string
    shops: Shop[]
}

interface MermaidOffer {
    itemId: string
    itemQty: number
}

function timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

function minutesToTime(totalMinutes: number): string {
    const normalized = ((totalMinutes % 1440) + 1440) % 1440
    const h = Math.floor(normalized / 60)
    const m = Math.floor(normalized % 60)
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

export function ShopsPage() {
    const [shops, setShops] = useState<Shop[]>([])
    const [displayTime, setDisplayTime] = useState<string>("00:00")
    const [loading, setLoading] = useState(true)
    const [mermaidOffer, setMermaidOffer] = useState<MermaidOffer | null>(null)

    // States for mermaid reset countdown (real time, 01:00 UTC)
    const [localResetTime, setLocalResetTime] = useState<string>("")
    const [resetCountdown, setResetCountdown] = useState<string>("")

    // Reference point: game minute from API + real time of its fetching
    const baseGameMinutesRef = useRef<number>(0)
    const baseRealTimeRef = useRef<number>(Date.now())
    const lastCheckedMinuteRef = useRef<number>(-1)
    const thresholdsRef = useRef<number[]>([])

    const fetchShops = useCallback(async () => {
        try {
            const res = await fetch(API_URL)
            const data: ShopsResponse = await res.json()

            const gameMinutes = timeToMinutes(data.currentTime)

            baseGameMinutesRef.current = gameMinutes
            baseRealTimeRef.current = Date.now()
            lastCheckedMinuteRef.current = gameMinutes

            // Thresholds (opening/closing times) at which data should be refreshed
            const thresholds = new Set<number>()
            data.shops.forEach((shop) => {
                thresholds.add(timeToMinutes(shop.openFrom))
                thresholds.add(timeToMinutes(shop.openUntil))
            })
            thresholdsRef.current = Array.from(thresholds)

            setShops(data.shops)
            setDisplayTime(data.currentTime)
            setLoading(false)
        } catch (err) {
            console.error("Failed to retrieve shop data:", err)
        }
    }, [])

    const fetchMermaid = useCallback(async () => {
        try {
            const res = await fetch(MERMAID_API_URL)
            const data: MermaidOffer = await res.json()
            setMermaidOffer(data)
        } catch (err) {
            console.error("Unable to retrieve mermaid data:", err)
        }
    }, [])

    useEffect(() => {
        fetchShops()
        fetchMermaid()

        const interval = setInterval(() => {
            // Game time update
            const realElapsedMs = Date.now() - baseRealTimeRef.current
            const gameElapsedMinutes = (realElapsedMs / 60000) * TIME_SPEED_MULTIPLIER
            const currentGameMinutes = baseGameMinutesRef.current + gameElapsedMinutes
            const flooredMinute = Math.floor(((currentGameMinutes % 1440) + 1440) % 1440)

            setDisplayTime(minutesToTime(currentGameMinutes))

            if (flooredMinute !== lastCheckedMinuteRef.current) {
                lastCheckedMinuteRef.current = flooredMinute

                if (thresholdsRef.current.includes(flooredMinute)) {
                    fetchShops()
                    fetchMermaid()
                }
            }

            // Mermaid reset countdown (real time, 01:00 UTC daily)
            const nowUtc = new Date();
            const nextReset = new Date(Date.UTC(
                nowUtc.getUTCFullYear(),
                nowUtc.getUTCMonth(),
                nowUtc.getUTCDate(),
                0, 0, 0
            ));
            if (nowUtc.getTime() >= nextReset.getTime()) {
                nextReset.setUTCDate(nextReset.getUTCDate() + 1);
            }

            const diffMs = nextReset.getTime() - nowUtc.getTime();
            const diffSec = Math.floor(diffMs / 1000);
            const hours = Math.floor(diffSec / 3600);
            const minutes = Math.floor((diffSec % 3600) / 60);
            const seconds = diffSec % 60;
            const countdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            setResetCountdown(countdown);

            // Local time representation of 01:00 UTC
            const localTimeStr = nextReset.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
            });
            setLocalResetTime(localTimeStr);
        }, 1000)

        return () => clearInterval(interval)
    }, [fetchShops, fetchMermaid])

    const { t } = useTranslation("market");

    return (
        <div className="py-auto relative flex flex-col page-container ">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title={t("market.shops.title")} description={t("market.shops.description")} />

            <span className="flex flex-col sm:flex-row gap-2">
                <Card className="w-24 px-4 py-0 items-center justify-center text-lg">{displayTime}  </Card>

                <Alert variant="default" className="flex items-center justify-center gap-0 sm:gap-4 flex-col sm:flex-row py-2">
                    <span className="flex flex-row w-full sm:w-fit">
                        <span className="items-center justify-center">
                            <InfoIcon className="mr-2 size-4" />
                        </span>
                        <p className="w-fit px-2flex items-center justify-center break-none">
                            Third-party data:
                        </p>
                    </span>
                    <span className="flex w-full sm:flex-1 flex-row gap-4 justify-between items-center">
                        <AlertDescription className="mr-auto flex items-center justify-center">
                            This data is fetched from the MineboxAdditions API.
                        </AlertDescription>
                        <Link to="https://mineboxadditions.bartier.me/">
                            <Button className="ml-auto my-auto">MineboxAdditions API</Button>
                        </Link>
                    </span>
                </Alert>
            </span>

            <span className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading && (
                    <Card className="col-span-7 flex flex-col items-center justify-center gap-2 p-4">
                        <p>Loading shop data...</p>
                    </Card>
                )}

                {!loading && (
                    <Card
                        key="mermaid"
                        className="group relative col-span-1 flex flex-col items-start justify-center gap-2 min-h-40 p-4 border-green-500"
                    >
                        <p className="uppercase inline-block text-lg font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider text-center">
                            {t(`market.shops.mermaid`)}
                        </p>

                        <img
                            src={`/media/shops/mermaid.png`}
                            className="absolute right-0 h-full object-contain !rounded-r-lg mask-l-from-0% opacity-50 saturate-50 group-hover:scale-110 group-hover:saturate-100 transition-all"
                        />

                        <span className="flex flex-col gap-0">
                            <p className="text-xs text-muted-foreground">{t("market.shops.mermaidReset")}</p>
                            <span className="flex gap-2">{localResetTime} {t("market.shops.localTime")}</span>
                        </span>

                        <Badge className="bg-green-500 text-green-100 uppercase z-10">
                            {t("market.shops.reset")}: {resetCountdown}
                        </Badge>

                        {mermaidOffer && mermaidOffer.itemId && (
                            <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0 z-10">
                                <p className="text-xs text-muted-foreground drop-shadow-lg">
                                    {t("market.shops.offert")}:
                                </p>
                                <ItemImage
                                    itemId={mermaidOffer.itemId}
                                    className="size-12 object-contain drop-shadow-lg"
                                />
                                <p className="text-sm max-w-24 leading-none drop-shadow-lg">
                                    {FindItemName({ itemId: mermaidOffer.itemId })} x{mermaidOffer.itemQty}
                                </p>
                            </div>
                        )}
                        {(!mermaidOffer || !mermaidOffer.itemId) && (
                            <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0 z-10">
                                <p className="text-xs text-muted-foreground drop-shadow-lg">
                                    {t("market.shops.offert")}:
                                </p>
                                <CircleQuestionMarkIcon className="size-12 p-2 opacity-60" />
                                <p className="text-sm max-w-24 leading-none drop-shadow-lg">
                                    {t("market.shops.not_found")}
                                </p>
                            </div>
                        )}
                    </Card>
                )}

                {!loading &&
                    shops.map((shop) => (
                        <Card
                            key={shop.id}
                            className={`group relative col-span-1 flex flex-col items-start justify-center gap-2 min-h-40 p-4 ${
                                shop.isOpen ? "border-green-500" : "border-red-500"
                            }`}
                        >
                            <p className="uppercase inline-block text-lg font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider text-center">
                                {t(`market.shops.${shop.id}`)}
                            </p>

                            <img
                                src={`/media/shops/${shop.id}.png`}
                                className="absolute right-0 h-full object-contain !rounded-r-lg mask-l-from-0% opacity-50 saturate-50 group-hover:scale-110 group-hover:saturate-100 transition-all"
                            />

                            <span className="flex flex-col gap-0">
                                <p className="text-xs text-muted-foreground">{t("market.shops.open_hours")}</p>
                                <span className="flex gap-2">
                                    <p>{shop.openFrom}</p>
                                    -<p>{shop.openUntil}</p>
                                </span>
                            </span>

                            <Badge
                                className={
                                    shop.isOpen
                                        ? "bg-green-500 text-green-100 uppercase"
                                        : "bg-red-500 text-white uppercase"
                                }
                            >
                                {shop.isOpen ? t("market.shops.open") : t("market.shops.closed")}
                            </Badge>

                            {shop.offer && (
                                <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0 z-10">
                                    <p className="text-xs text-muted-foreground drop-shadow-lg">
                                        {t("market.shops.offert")}:
                                    </p>
                                    <ItemImage
                                        itemId={shop.offer.item}
                                        className="size-12 object-contain drop-shadow-lg"
                                    />
                                    <p className="text-sm max-w-24 leading-none drop-shadow-lg">
                                        {FindItemName({ itemId: shop.offer.item })}
                                    </p>
                                </div>
                            )}
                            {!shop.offer && shop.isOpen && (
                                <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0 z-10">
                                    <p className="text-xs text-muted-foreground drop-shadow-lg">
                                        {t("market.shops.offert")}:
                                    </p>
                                    <CircleQuestionMarkIcon className="size-12 p-2 opacity-60" />
                                    <p className="text-sm max-w-24 leading-none drop-shadow-lg">
                                        {t("market.shops.not_found")}
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))}
            </span>
        </div>
    )
}

export default ShopsPage