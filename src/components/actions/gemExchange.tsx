import { useEffect, useMemo, useState } from "react"
import { Badge } from "@ui/badge"
import { Card } from "@ui/card"
import { ArrowRight } from "lucide-react"
import { PlayerFooter } from "@components/minebox/smth"
import { useTranslation } from 'react-i18next'
import { Slider } from "@components/ui/slider"

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

type ExchangeDirection = "GOLD_TO_GEM" | "GEM_TO_GOLD"

type ExchangeCalculation = {
  cost: number // How much of the other currency you'll spend/receive
  filled: boolean
  ordersUsed: number
  averageRate: number
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  }).format(value)

async function fetchOrders(type: "buy" | "sell") {
  const response = await fetch(
    `https://api.minebox.co/market/gem-exchange?type=${type}`
  )

  if (!response.ok) {
    throw new Error(`Failed to load ${type} orders`)
  }

  const data = (await response.json()) as GemExchangeResponse
  return data.orders ?? []
}

// For a given amount of GEM (targetGem), calculates the best possible cost/revenue,
// iterating through offers from the most favorable price upwards.
function calculateForTargetGem(
  targetGem: number,
  direction: ExchangeDirection,
  buyOrders: GemExchangeOrder[],
  sellOrders: GemExchangeOrder[]
): ExchangeCalculation {
  if (!targetGem || targetGem <= 0) {
    return { cost: 0, filled: true, ordersUsed: 0, averageRate: 0 }
  }

  let remainingGem = targetGem
  let cost = 0 // GOLD_TO_GEM: how much GOLD you'll spend | GEM_TO_GOLD: how much GOLD you'll receive
  let ordersUsed = 0

  if (direction === "GOLD_TO_GEM") {
    // Buying GEM from sellers -> cheapest price first
    const sorted = [...sellOrders]
      .filter((o) => o.order_type === "SELL")
      .sort((a, b) => a.price_per_unit - b.price_per_unit)

    for (const order of sorted) {
      if (remainingGem <= 0) break
      const take = Math.min(order.quantity, remainingGem)
      cost += take * order.price_per_unit
      remainingGem -= take
      ordersUsed += 1
    }
  } else {
    // Selling GEM to buyers -> highest price first
    const sorted = [...buyOrders]
      .filter((o) => o.order_type === "BUY")
      .sort((a, b) => b.price_per_unit - a.price_per_unit)

    for (const order of sorted) {
      if (remainingGem <= 0) break
      const take = Math.min(order.quantity, remainingGem)
      cost += take * order.price_per_unit
      remainingGem -= take
      ordersUsed += 1
    }
  }

  const filled = remainingGem <= 0.0001
  const gemActuallyTraded = targetGem - Math.max(remainingGem, 0)
  const averageRate = gemActuallyTraded > 0 ? cost / gemActuallyTraded : 0

  return { cost, filled, ordersUsed, averageRate }
}

function ExchangeCalculator({
  buyOrders,
  sellOrders,
}: {
  buyOrders: GemExchangeOrder[]
  sellOrders: GemExchangeOrder[]
}) {
  const [direction, setDirection] = useState<ExchangeDirection>("GOLD_TO_GEM")
  const [targetGem, setTargetGem] = useState(0)

  const relevantOrders = direction === "GOLD_TO_GEM" ? sellOrders : buyOrders
  const relevantType = direction === "GOLD_TO_GEM" ? "SELL" : "BUY"

  const maxGem = useMemo(
    () =>
      relevantOrders
        .filter((o) => o.order_type === relevantType)
        .reduce((sum, o) => sum + o.quantity, 0),
    [relevantOrders, relevantType]
  )

  // If max changes (e.g. after fetch) and current slider value exceeds it, trim it
  useEffect(() => {
    setTargetGem((prev) => Math.min(prev, maxGem))
  }, [maxGem])

  const result = useMemo(
    () => calculateForTargetGem(targetGem, direction, buyOrders, sellOrders),
    [targetGem, direction, buyOrders, sellOrders]
  )

  const fromCurrency = direction === "GOLD_TO_GEM" ? "GOLD" : "GEM"
  const toCurrency = direction === "GOLD_TO_GEM" ? "GEM" : "GOLD"

  return (
    <Card className="p-0 gap-0">
      <div className="flex items-center justify-between border-b-2 border-card-dark bg-secondary/20 p-4">
        <h3 className="text-lg font-semibold">Exchange Calculator</h3>
        <button
          type="button"
          onClick={() => {
            setDirection((prev) =>
              prev === "GOLD_TO_GEM" ? "GEM_TO_GOLD" : "GOLD_TO_GEM"
            )
            setTargetGem(0)
          }}
          className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-secondary/50"
        >
          <img src={`/media/currency/${fromCurrency}.png`} className="!size-4" />
          {fromCurrency}
          <ArrowRight className="size-4" />
          <img src={`/media/currency/${toCurrency}.png`} className="!size-4" />
          {toCurrency}
        </button>
      </div>

      {maxGem <= 0 ? (
        <p className="text-sm text-muted-foreground">
          No offers available for this exchange direction.
        </p>
      ) : (
        <span>
          <div className="space-y-1 px-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">How many GEM do you want to {direction === "GOLD_TO_GEM" ? "buy" : "sell"}:</span>
              <span className="flex items-center gap-1 font-semibold">
                {formatNumber(targetGem)}
                <img src="/media/currency/GEM.png" className="!size-4" />
              </span>
            </div>
            <Slider
              value={[targetGem]}
              onValueChange={(value) => setTargetGem(value[0])}
              max={maxGem}
              step={1}
              min={0}
              className="mx-auto w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>max. {formatNumber(maxGem)}</span>
            </div>
          </div>

          {targetGem > 0 && (
            <div className="space-y-1 border-t-2 border-secondary-dark bg-secondary/40 p-4 grid grid-cols-3">
              <div className="flex flex-col items-start gap-0 -space-y-1.5 text-lg ">
                <p className="text-muted-foreground text-xs">Used</p>
                <p className="uppercase">{result.ordersUsed}{" "}{result.ordersUsed === 1 ? "offer" : "offers"}</p>
              </div>

              <div className="flex flex-col gap-0 -space-y-1.5 items-center text-lg mx-auto">
                <p className="text-muted-foreground text-xs">{direction === "GOLD_TO_GEM"
                  ? "Minimum cost in GOLD"
                  : "Maximum proceeds in GOLD"}</p>
                <span className="flex flex-row items-center gap-1">
                  <span>{formatNumber(targetGem)}</span>
                  <img src="/media/currency/GEM.png" className="!size-4" />
                  <ArrowRight className="size-4" />
                  <span>{formatNumber(result.cost)}</span>
                  <img src="/media/currency/GOLD.png" className="!size-4" />
                </span>
              </div>
              
              <div className="flex flex-col items-end gap-0 -space-y-1.5 text-lg ">
                <p className="text-muted-foreground text-xs">Average rate</p>
                <p className="uppercase flex flex-row items-center gap-2 mt-1">{formatNumber(result.averageRate)} 
                  <img src="/media/currency/GOLD.png" className="!size-5" /> / 
                  <img src="/media/currency/GEM.png" className="!size-5" /></p>
              </div>

              {!result.filled && (
                <p className="text-xs text-red-500">
                  Note: the selected amount exceeds the available offers — the
                  result reflects the maximum portion that can be fulfilled.
                </p>
              )}
            </div>
          )}
        </span>
      )}
    </Card>
  )
}

export function GemExchange() {
  const { t } = useTranslation("market")
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
        <Badge variant="outline">{orders.length} {t("market.gem_exchange.offers")}</Badge>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No data at this time.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-0 pt-4">

              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col items-center justify-end -space-y-1 flex-1">
                  <img
                    src={`/media/currency/${order.order_type === "BUY" ? "GOLD" : "GEM"}.png`}
                    className="h-20 w-20"
                  />
                  <Badge className="z-5">
                    {formatNumber(
                      order.quantity *
                      (order.order_type === "SELL" ? 1 : order.price_per_unit)
                    )}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                {order.order_type === "BUY" ? (
                  <span className="flex flex-row items-center justify-center gap-2">
                    <p className="text-md flex flex-row items-center justify-center gap-1 text-[#44d560]">
                      1
                      <img src={`/media/currency/GEM.png`} className="!size-4" />
                    </p>
                    =
                    <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                      {formatNumber(order.price_per_unit)}
                      <img src={`/media/currency/GOLD.png`} className="!size-4" />
                    </p>
                  </span>
                ) : (
                  <span className="flex flex-row items-center justify-center gap-2">
                    <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                      {formatNumber(order.price_per_unit)}
                      <img src={`/media/currency/GOLD.png`} className="!size-4" />
                    </p>
                    =
                    <p className="text-md flex flex-row items-center justify-center gap-1 text-[#44d560]">
                      1
                      <img src={`/media/currency/GEM.png`} className="!size-4" />
                    </p>
                  </span>
                )}
              </div>
              <span className="border-t-2 border-secondary-dark bg-secondary/40 p-4 pt-0">
                <PlayerFooter playerName={order.username} />
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      <ExchangeCalculator buyOrders={buyOrders} sellOrders={sellOrders} />
      {renderOrders(sellOrders, "Exchange Gold to Gems")}
      {renderOrders(buyOrders, "Exchange Gems to Gold")}
    </div>
  )
}

export default GemExchange