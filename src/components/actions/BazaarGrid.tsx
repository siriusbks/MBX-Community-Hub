"use client"

import { Badge } from "@components/ui/badge"
import { FindItemRarity, ItemImage, FindItemName } from "@const/elements"
import { GetRarityColor, RarityBorder } from "@const/rarities"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

type BazaarItem = {
  item_id: string
  sell_price: number
  buy_price: number
  stock: number
  unavailable?: boolean
}

type BazaarResponse = {
  items: BazaarItem[]
  total: number
}

type CatalogSubcategory = {
  id: string
  market_type: string
  items: string[]
}

type CatalogCategory = {
  id: string
  subcategories: CatalogSubcategory[]
}

type CatalogResponse = {
  bazaar: {
    categories: CatalogCategory[]
    items: { id: string; category: string; subcategory: string; market_type: string }[]
  }
}

const PROXY_URL = "https://mineboxadditions.bartier.me/proxy"

// Wraps a target URL so it goes through the proxy, e.g.
// proxied("https://api.minebox.co/market/bazaar?limit=100&offset=0")
function proxied(targetUrl: string) {
  const params = new URLSearchParams({ url: targetUrl })
  return `${PROXY_URL}?${params.toString()}`
}

// Runs a list of fetches in batches of `maxPerSecond`, waiting out the
// remainder of each second before firing the next batch, so we never
// exceed the proxy's rate limit (10 req/s).
async function fetchJsonRateLimited<T>(
  urls: string[],
  maxPerSecond = 10
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < urls.length; i += maxPerSecond) {
    const batch = urls.slice(i, i + maxPerSecond)
    const batchStart = Date.now()

    const batchResults = await Promise.all(
      batch.map((url) => fetch(url).then((r) => r.json() as Promise<T>))
    )
    results.push(...batchResults)

    const elapsed = Date.now() - batchStart
    const hasMore = i + maxPerSecond < urls.length
    if (hasMore && elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed))
    }
  }

  return results
}

// Mounts children only once the wrapper scrolls near the viewport, so we
// don't build/measure DOM for hundreds of off-screen items up front.
// Once it becomes visible it stays mounted.
function useInView<T extends HTMLElement>(rootMargin = "600px") {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}

function ItemCard({ item }: { item: BazaarItem }) {
  const { t } = useTranslation("market")

  return (
    <RarityBorder
      rarity={FindItemRarity({ itemId: item.item_id })}
      className={`flex flex-row items-center gap-0 ${
        item.unavailable ? "opacity-50 grayscale" : ""
      }`}
    >
      <span className="flex w-full flex-row items-center justify-center gap-0">
        <ItemImage
          itemId={item.item_id}
          loading="lazy"
          className="aspect-square w-12 object-fill [image-rendering:pixelated]"
          style={{
            filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: item.item_id }))}40)`,
          }}
        />

        {/* Name and Stock */}
        <span className="flex h-8 flex-col justify-center gap-2 pl-2 text-sm leading-none">
          <p className="text-xs leading-none">
            {FindItemName({ itemId: item.item_id })}
          </p>
          <span className="flex w-full flex-row items-center justify-between gap-2 text-xs">
            <p className="text-[0.65rem] text-muted-foreground">
              {t("market.bazaar.stock")}
            </p>
            {item.stock > 0 ? (
              <Badge className="scale-90">{item.stock.toLocaleString()}</Badge>
            ) : (
              <Badge variant="secondary">{t("market.bazaar.no_stock")}</Badge>
            )}
          </span>
        </span>
      </span>

      <span className="mt-1 flex w-full flex-col justify-evenly gap-1 text-xs">
        {item.unavailable ? (
          <span className="flex w-full flex-row justify-center px-2">
            <Badge variant="secondary">{t("market.bazaar.unavailable")}</Badge>
          </span>
        ) : (
          <>
            <span className="flex flex-row justify-between gap-2 px-2">
              <p className="text-[0.65rem] text-muted-foreground uppercase">
                {t("market.bazaar.sell")}
              </p>
              <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                {item.sell_price.toLocaleString()}
                <img
                  src="/media/currency/GOLD.png"
                  className="!size-4"
                  alt="Gold"
                  loading="lazy"
                />
              </p>
            </span>

            <span className="flex flex-row items-center justify-between gap-2 px-2 text-xs">
              <p className="text-[0.65rem] text-muted-foreground uppercase">
                {t("market.bazaar.buy")}
              </p>
              <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                {item.buy_price.toLocaleString()}
                <img
                  src="/media/currency/GOLD.png"
                  className="!size-4"
                  alt="Gold"
                  loading="lazy"
                />
              </p>
            </span>
          </>
        )}
      </span>
    </RarityBorder>
  )
}

function SubcategorySection({
  title,
  items,
}: {
  title: string
  items: BazaarItem[]
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref}>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        {title}
        <Badge variant="secondary" className="text-xs">
          {items.length} items
        </Badge>
      </h3>

      {!inView ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: Math.min(items.length, 6) }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {items.map((item) => (
            <ItemCard key={item.item_id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategorySection({
  title,
  subcategories,
}: {
  title: string
  subcategories: { id: string; items: BazaarItem[] }[]
}) {
  const { t } = useTranslation("market")
  const totalItems = subcategories.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
        {title}
        <Badge variant="secondary" className="text-sm">
          {totalItems} items
        </Badge>
      </h2>

      <div className="space-y-6">
        {subcategories.map((sub) => (
          <SubcategorySection
            key={sub.id}
            title={t(`market.bazaar.subcategorie.${sub.id}`, {
              defaultValue: sub.id,
            })}
            items={sub.items}
          />
        ))}
      </div>
    </div>
  )
}

export default function BazaarGrid() {
  const { t } = useTranslation("market")
  const [items, setItems] = useState<BazaarItem[]>([])
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadCatalog = async () => {
      const [data] = await fetchJsonRateLimited<CatalogResponse>([
        proxied("https://api.minebox.co/market/catalog"),
      ])
      if (!cancelled) setCatalog(data)
    }

    const loadBazaar = async () => {
      const limit = 100

      const [firstPage] = await fetchJsonRateLimited<BazaarResponse>([
        proxied(`https://api.minebox.co/market/bazaar?limit=${limit}&offset=0`),
      ])
      if (cancelled) return

      // Show the first page right away instead of waiting for every page.
      setItems(firstPage.items)
      setLoading(false)

      const totalPages = Math.ceil(firstPage.total / limit)
      const remainingUrls: string[] = []
      for (let page = 2; page <= totalPages; page++) {
        remainingUrls.push(
          proxied(
            `https://api.minebox.co/market/bazaar?limit=${limit}&offset=${(page - 1) * limit}`
          )
        )
      }

      // Fetch the rest in the background, batch by batch, appending as we
      // go so the grid fills in progressively instead of blocking on all
      // remaining pages.
      const batchSize = 10
      for (let i = 0; i < remainingUrls.length; i += batchSize) {
        const batch = remainingUrls.slice(i, i + batchSize)
        const batchStart = Date.now()

        const batchResults = await Promise.all(
          batch.map((url) =>
            fetch(url).then((r) => r.json() as Promise<BazaarResponse>)
          )
        )
        if (cancelled) return

        setItems((prev) => [...prev, ...batchResults.flatMap((r) => r.items)])

        const elapsed = Date.now() - batchStart
        const hasMore = i + batchSize < remainingUrls.length
        if (hasMore && elapsed < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed))
        }
      }
    }

    loadCatalog()
    loadBazaar()

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    if (!catalog) return []

    const itemsById = new Map(items.map((item) => [item.item_id, item]))

    // An item counts as unavailable whenever both prices are 0 — whether
    // that's because it wasn't returned by the bazaar endpoint at all, or
    // because it came back with zeroed-out prices.
    const toBazaarItem = (itemId: string): BazaarItem => {
      const found = itemsById.get(itemId)
      const sell_price = found?.sell_price ?? 0
      const buy_price = found?.buy_price ?? 0
      const stock = found?.stock ?? 0

      return {
        item_id: itemId,
        sell_price,
        buy_price,
        stock,
        unavailable: sell_price === 0 && buy_price === 0,
      }
    }

    const usedIds = new Set<string>()

    const result = catalog.bazaar.categories.map((category) => ({
      id: category.id,
      subcategories: category.subcategories.map((sub) => {
        sub.items.forEach((id) => usedIds.add(id))
        return {
          id: sub.id,
          items: sub.items.map(toBazaarItem),
        }
      }),
    }))

    // Anything present in bazaar results but not covered by any known
    // subcategory falls into a catch-all "others" bucket.
    const otherIds = items
      .map((item) => item.item_id)
      .filter((id) => !usedIds.has(id))
    if (otherIds.length > 0) {
      result.push({
        id: "others",
        subcategories: [
          {
            id: "others",
            items: otherIds.map(toBazaarItem),
          },
        ],
      })
    }

    return result
  }, [catalog, items])

  if (loading || !catalog) {
    return <div className="py-10 text-center">Loading...</div>
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          title={t(`market.bazaar.categorie.${category.id}`, {
            defaultValue: category.id,
          })}
          subcategories={category.subcategories}
        />
      ))}
    </div>
  )
}