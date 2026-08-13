"use client"

import { Badge } from "@components/ui/badge"
import { Skeleton } from "@components/ui/skeleton"
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
    items: {
      id: string
      category: string
      subcategory: string
      market_type: string
    }[]
  }
}

const PROXY_URL = "https://mineboxadditions.bartier.me/proxy"

// Wraps a target URL so it goes through the proxy, e.g.
// proxied("https://api.minebox.co/market/bazaar?limit=100&offset=0")
function proxied(targetUrl: string) {
  const params = new URLSearchParams({ url: targetUrl })
  return `${PROXY_URL}?${params.toString()}`
}

// Global rate limiter to ensure we don't exceed the proxy limit (10 req/s).
const FETCH_QUEUE: (() => Promise<void>)[] = []
let isProcessingQueue = false

async function processFetchQueue() {
  if (isProcessingQueue) return
  isProcessingQueue = true

  while (FETCH_QUEUE.length > 0) {
    const batch = FETCH_QUEUE.splice(0, 5) // Safe limit: 5 per second
    const batchStart = Date.now()

    await Promise.all(batch.map((fn) => fn()))

    const elapsed = Date.now() - batchStart
    if (FETCH_QUEUE.length > 0 && elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed))
    }
  }

  isProcessingQueue = false
}

function fetchRateLimited<T>(url: string, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      if (signal?.aborted) {
        reject(new DOMException("Aborted", "AbortError"))
        return
      }
      try {
        const res = await fetch(url, { signal })
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
        resolve(await res.json())
      } catch (err) {
        reject(err)
      }
    }
    FETCH_QUEUE.push(execute)
    processFetchQueue()
  })
}

function formatCategoryLabel(id: string): string {
  return id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
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
      className={`group flex flex-row items-center gap-0 ${
        item.unavailable ? "opacity-50 grayscale" : ""
      }`}
    >
      <span className="flex w-full flex-col items-center justify-center gap-0">
        <ItemImage
          itemId={item.item_id}
          loading="lazy"
          className={`aspect-square w-16 object-fill [image-rendering:pixelated] ${
            item.unavailable ? "" : "transition-transform duration-200 group-hover:scale-110"
          }`}
          style={{
            filter: `drop-shadow(0 0 12px ${GetRarityColor(FindItemRarity({ itemId: item.item_id }))}50)`,
          }}
        />

        {/* Name and Stock */}
        <span className="flex h-8 w-full flex-col justify-center gap-2 pl-2 text-sm leading-none">
          <p className="text-xs leading-none w-full text-center ">
            {FindItemName({ itemId: item.item_id })}
          </p>
        </span>
      </span>

      <span className="mt-1 flex w-full flex-col justify-evenly gap-1 text-xs">
        <>
          <span className="flex flex-row justify-between gap-2 px-2">
            <p className="text-[0.65rem] text-muted-foreground uppercase">
              {t("market.bazaar.stock")}
            </p>
            <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
              {item.stock}
            </p>
          </span>

          
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
      <h3 className="mb-2 flex w-full items-center justify-between gap-2 text-lg">
        {title}
        <Badge variant="secondary" className="text-xs">
          {items.length} {useTranslation("market").t("market.bazaar.items")}
        </Badge>
      </h3>

      {!inView ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: Math.min(items.length, 6) }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
      <h2 className="mb-4 flex w-full items-center justify-between gap-3 text-2xl font-bold">
        {title}
        <Badge variant="secondary" className="text-sm">
          {totalItems} {t("market.bazaar.items")}
        </Badge>
      </h2>

      <div className="space-y-6">
        {subcategories.map((sub) => (
          <SubcategorySection
            key={sub.id}
            title={t(`market.bazaar.subcategorie.${sub.id}`, {
              defaultValue: formatCategoryLabel(sub.id),
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
    const abortController = new AbortController()
    const { signal } = abortController
    let cancelled = false

    const loadCatalog = async () => {
      try {
        const data = await fetchRateLimited<CatalogResponse>(
          proxied("https://api.minebox.co/market/catalog"),
          signal
        )
        if (!cancelled) setCatalog(data)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load catalog", err)
        }
      }
    }

    const loadBazaar = async () => {
      const limit = 100

      try {
        const firstPage = await fetchRateLimited<BazaarResponse>(
          proxied(`https://api.minebox.co/market/bazaar?limit=${limit}&offset=0`),
          signal
        )
        if (cancelled) return

        // Show the first page right away instead of waiting for every page.
        setItems(firstPage.items)
        setLoading(false)

        const totalPages = Math.ceil(firstPage.total / limit)
        for (let page = 2; page <= totalPages; page++) {
          const url = proxied(
            `https://api.minebox.co/market/bazaar?limit=${limit}&offset=${(page - 1) * limit}`
          )
          
          fetchRateLimited<BazaarResponse>(url, signal)
            .then((res) => {
              if (!cancelled) {
                setItems((prev) => [...prev, ...res.items])
              }
            })
            .catch((err) => {
              if ((err as Error).name !== "AbortError") {
                console.error("Failed to load bazaar page", err)
              }
            })
        }
      } catch (err) {
        if (!cancelled && (err as Error).name !== "AbortError") {
          console.error("Failed to load first page of bazaar", err)
          setLoading(false)
        }
      }
    }

    loadCatalog()
    loadBazaar()

    return () => {
      cancelled = true
      abortController.abort()
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
    return <div className="py-10 text-center">{t("market.bazaar.loading")}</div>
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          title={t(`market.bazaar.categorie.${category.id}`, {
            defaultValue: formatCategoryLabel(category.id),
          })}
          subcategories={category.subcategories}
        />
      ))}
    </div>
  )
}