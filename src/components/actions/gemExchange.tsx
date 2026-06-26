import { useEffect, useState } from "react"
import { Badge } from "@ui/badge"
import { Card } from "@ui/card"
import { ArrowRight } from "lucide-react"

type GemExchangeOrder = {
    id: number
    username: string
    order_type: string
    quantity: number
    price_per_unit: number
    created_at: string
    expires_at: string
}

type GemExchangeResponse = {
    orders: GemExchangeOrder[]
    total: number
}

const formatNumber = (value: number) =>
    new Intl.NumberFormat("pl-PL", {
        maximumFractionDigits: 0,
    }).format(value)

async function fetchOrders(type: "buy" | "sell") {
    const response = await fetch(`https://api.minebox.co/market/gem-exchange?type=${type}`)

    if (!response.ok) {
        throw new Error(`Failed to load ${type} orders`)
    }

    const data = (await response.json()) as GemExchangeResponse
    return data.orders ?? []
}

export function GemExchange() {
    const [buyOrders, setBuyOrders] = useState<GemExchangeOrder[]>([])
    const [sellOrders, setSellOrders] = useState<GemExchangeOrder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            try {
                const [buy, sell] = await Promise.all([
                    fetchOrders("buy"),
                    fetchOrders("sell"),
                ])

                if (isMounted) {
                    setBuyOrders(buy)
                    setSellOrders(sell)
                }
            } catch {
                if (isMounted) {
                    setBuyOrders([])
                    setSellOrders([])
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [])

    const renderOrders = (orders: GemExchangeOrder[], label: string) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{label}</h3>
                <Badge variant="outline">{orders.length} ofert</Badge>
            </div>
            {loading ? (
                <div className="text-sm text-muted-foreground">Ładowanie...</div>
            ) : orders.length === 0 ? (
                <div className="text-sm text-muted-foreground">Brak danych w tej chwili.</div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-4">
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex flex-col items-center justify-center  -space-y-1">
                                    <Badge className="z-5">GIVE</Badge>
                                    <img src={`/media/currency/${order.order_type === "SELL" ? "GOLD" : "GEM"}.png`} className="h-20 w-20" />
                                    <Badge className="z-5">{formatNumber(order.quantity * (order.order_type === "BUY" ? 1 : order.price_per_unit))}</Badge>
                                </div>
                                <div>
                                    <ArrowRight />
                                </div>
                                <div className="flex flex-col items-center justify-center -space-y-1">
                                    <Badge className="z-5">TAKE</Badge>
                                    <img src={`/media/currency/${order.order_type === "BUY" ? "GOLD" : "GEM"}.png`} className="h-20 w-20" />
                                    <Badge className="z-5">{formatNumber(order.quantity * (order.order_type === "SELL" ? 1 : order.price_per_unit))}</Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                {order.order_type === "BUY" ? (
                                    <span className="flex flex-row items-center justify-center gap-2">
                                        <p className="gap-1 flex flex-row items-center justify-center text-md text-[#44d560]">1<img src={`/media/currency/GEM.png`} className="!size-6" /></p>
                                        =
                                        <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">{formatNumber(order.price_per_unit)}<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                    </span>
                                ) : (
                                    <span className="flex flex-row items-center justify-center gap-2">
                                        <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">{formatNumber(order.price_per_unit)}<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                        =
                                        <p className="gap-1 flex flex-row items-center justify-center text-md text-[#44d560]">1<img src={`/media/currency/GEM.png`} className="!size-6" /></p>
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 space-y-0 text-sm  flex flex-row items-center gap-2">
                                <img src={`https://minotar.net/avatar/${order.username  }`} className="size-8"/>
                                <p>{order.username}</p>    
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            {renderOrders(sellOrders, "GOLD > GEMS")}
            {renderOrders(buyOrders, "GEMS > GOLD")}
        </div>
    )
}

export default GemExchange
