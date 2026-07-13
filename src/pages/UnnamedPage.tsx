import { useEffect, useRef, useState, useCallback } from "react"
import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { ItemSlot, RarityBorder } from "@const/rarities"
import { FindItemName, ItemImage } from "@const/elements"
import { Alert, AlertDescription } from "@components/ui/alert"
import { Link } from "react-router"
import { Button } from "@components/ui/button"
import { InfoIcon } from "lucide-react"
import { Badge } from "@components/ui/badge"

const API_URL = "https://mineboxadditions.bartier.me/shop"

// W grze 24h mija w ciągu 1 realnej godziny (mnożnik x24)
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

    // Punkt odniesienia: minuta gry z API + realny czas jej pobrania
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

            // Progi (otwarcie/zamknięcie), przy których trzeba odświeżyć dane
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
            console.error("Nie udało się pobrać danych sklepów:", err)
        }
    }, [])

    useEffect(() => {
        fetchShops()

        const interval = setInterval(() => {
            const realElapsedMs = Date.now() - baseRealTimeRef.current
            const gameElapsedMinutes = (realElapsedMs / 60000) * TIME_SPEED_MULTIPLIER
            const currentGameMinutes = baseGameMinutesRef.current + gameElapsedMinutes
            const flooredMinute = Math.floor(((currentGameMinutes % 1440) + 1440) % 1440)

            setDisplayTime(minutesToTime(currentGameMinutes))

            if (flooredMinute !== lastCheckedMinuteRef.current) {
                lastCheckedMinuteRef.current = flooredMinute

                if (thresholdsRef.current.includes(flooredMinute)) {
                    fetchShops()
                }
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [fetchShops])

    return (
        <div className="py-auto relative flex flex-col page-container ">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title="Shops" description="Description" />

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
                        <Link to="/contribute">
                            <Button className="ml-auto my-auto">Modrinth</Button>
                        </Link>
                    </span>
                </Alert>
            </span>

            <span className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading && (
                    <Card className="col-span-7 flex flex-col items-center justify-center gap-2 p-4">
                        <p>Ładowanie danych sklepów...</p>
                    </Card>
                )}

                {!loading &&
                    shops.map((shop) => (
                        <Card
                            key={shop.id}
                            className={`relative col-span-1 flex flex-col items-start justify-center gap-2 p-4 ${shop.isOpen ? "border-green-500" : "border-red-500"
                                }`}
                        >
                            <p className="uppercase inline-block text-lg font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider text-center">{shop.id}</p>

                            <span className="flex flex-col gap-0">
                                <p className="text-xs text-muted-foreground">Open Hours:</p>
                                <span className="flex gap-2">
                                    <p>{shop.openFrom}</p>
                                    -
                                    <p>{shop.openUntil}</p>
                                </span>
                            </span>


                            <Badge className={shop.isOpen ? "bg-green-500 text-green-100 uppercase" : "bg-red-500 text-red-100 uppercase"}>
                                {shop.isOpen ? "Open" : "Closed"}
                            </Badge>


                            {shop.offer && (
                                <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0">
                                    <p className="text-xs text-muted-foreground">
                                        Offert:
                                    </p>
                                    <ItemImage itemId={shop.offer.item} className="size-12 object-contain" />
                                    <p className="text-sm max-w-24 leading-none ">
                                        {FindItemName({ itemId: shop.offer.item })}
                                    </p>
                                </div>
                            )}
                            {!shop.offer && shop.isOpen && (
                                <div className="absolute top-1/2 right-5 -translate-y-1/2 text-center items-center justify-center flex flex-col gap-0">
                                    <p className="text-xs text-muted-foreground">
                                        Offert:
                                    </p>
                                    <p className="text-sm max-w-24 leading-none ">
                                        Not Found
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