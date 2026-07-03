import itemsData from "@const/APIPreload/items.json"

const resolvedImageUrlCache = new Map<string, Promise<string>>()
const itemsDataMap = itemsData as Record<string, any>

function getCleanItemId(itemId: string) {
  let cleanId = itemId?.replace(/^mbi-/, "")
  cleanId = cleanId?.replace(/^material-/, "")
  return cleanId
}

function getPrimaryItemImageUrl(itemId: string, cleanId: string, itemData: any) {
  if (itemId.startsWith("material-") || !itemData?.image) {
    return `/media/vanilla/${cleanId}.png`
  }

  return `data:image/png;base64,${itemData.image}`
}

function getItemImageFallbackChain(itemId: string, cleanId: string, itemData: any) {
  const fallbackById = `/media/missing/${cleanId}.png`
  const fallbackGeneric = "/media/missing.png"
  const primary = getPrimaryItemImageUrl(itemId, cleanId, itemData)
  return [primary, fallbackById, fallbackGeneric]
}

function canLoadImage(url: string): Promise<boolean> {
  if (url.startsWith("data:image/")) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

async function resolveFirstAvailableImageUrl(urls: string[]): Promise<string> {
  for (const url of urls) {
    if (await canLoadImage(url)) {
      return url
    }
  }

  return urls[urls.length - 1]
}

export function ItemImage({
  itemId,
  className,
}: {
  itemId: string
  className?: string
}) {
  const cleanId = getCleanItemId(itemId)

  const fallbackById = `/media/missing/${cleanId}.png`
  const fallbackGeneric = "/media/missing.png"

  const itemData = itemsDataMap[cleanId]
  const imageUrl = getPrimaryItemImageUrl(itemId, cleanId, itemData)

  if (itemId.startsWith("material-") || !itemData?.image) {
    return (
      <img
        src={`/media/vanilla/${cleanId}.png`}
        onError={(e) => {
          const target = e.currentTarget
          if (target.src.endsWith(`/media/vanilla/${cleanId}.png`)) {
            target.src = fallbackById
            return
          }

          target.onerror = null
          target.src = fallbackGeneric
        }}
        className={`[image-rendering:pixelated] ${className}`}
      />
    )
  }

  return (
    <img
      src={imageUrl}
      onError={(e) => {
        const target = e.currentTarget
        if (target.src !== fallbackById) {
          target.src = fallbackById
          return
        }

        target.onerror = null
        target.src = fallbackGeneric
      }}
      className={`[image-rendering:pixelated] ${className}`}
    />
  )
}

export async function ItemImageUrl({ itemId }: { itemId: string }): Promise<string> {
  const cleanId = getCleanItemId(itemId)
  const itemData = itemsDataMap[cleanId]
  const cacheKey = `${itemId}::${cleanId}`

  const cached = resolvedImageUrlCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const resolverPromise = resolveFirstAvailableImageUrl(
    getItemImageFallbackChain(itemId, cleanId, itemData)
  )
  resolvedImageUrlCache.set(cacheKey, resolverPromise)

  return resolverPromise
}

export function FindItemRarity({ itemId }: { itemId: string }) {
  const cleanId = itemId?.replace(/^mbi-/, "")
  if (itemId.startsWith("material-")) {
    return "vanilla"
  }
  const itemData = itemsDataMap[cleanId]
  const rarity = itemData?.rarity?.toLowerCase() || "prototype"
  return rarity
}

export function FindItemName({ itemId }: { itemId: string }) {
  let cleanId = itemId?.replace(/^mbi-/, "")
  cleanId = cleanId?.replace(/^material-/, "")
  const itemData = itemsDataMap[cleanId]
  const name = itemData?.name?.en || cleanId
  return name
}
