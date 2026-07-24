import itemsData from "@const/APIPreload/items.json"
import i18next from "i18next"

const resolvedImageUrlCache = new Map<string, Promise<string>>()
const itemsDataMap = itemsData as Record<string, any>

export function getCleanItemId(itemId: string) {
  let cleanId = itemId?.replace(/^mbi-/, "")
  cleanId = cleanId?.replace(/^material-/, "")
  cleanId = cleanId?.replace(/^transformed_material-/, "transformed_")
  cleanId = cleanId?.replace(/^bag_material-/, "bag_")
  cleanId = cleanId?.replace(/^crate_material-/, "crate_")
  cleanId = cleanId?.replace(/^barrel_material-/, "barrel_")
  cleanId = cleanId?.replace(/^enchanted_material-/, "enchanted_")
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
  return [fallbackById, primary, fallbackGeneric]
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
  style,
}: {
  itemId: string
  className?: string
  style?: React.CSSProperties
}) {
  const cleanId = getCleanItemId(itemId)

  const fallbackById = `/media/missing/${cleanId}.png`
  const fallbackGeneric = "/media/missing.png"

  const itemData = itemsDataMap[cleanId]
  const imageUrl = getPrimaryItemImageUrl(itemId, cleanId, itemData)

  if (itemId.startsWith("material-") || !itemData?.image) {
    const vanillaUrl = `/media/vanilla/${cleanId}.png`

    return (
      <img
        src={fallbackById}
        onError={(e) => {
          const target = e.currentTarget
          if (target.src.endsWith(fallbackById)) {
            target.src = vanillaUrl
            return
          }

          target.onerror = null
          target.src = fallbackGeneric
        }}
        className={`[image-rendering:pixelated] ${className}`}
        style={style}
      />
    )
  }

  return (
    <img
      src={fallbackById}
      onError={(e) => {
        const target = e.currentTarget
        if (target.src.endsWith(fallbackById)) {
          target.src = imageUrl
          return
        }

        target.onerror = null
        target.src = fallbackGeneric
      }}
      className={`[image-rendering:pixelated] ${className}`}
        style={style}
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

  {/* VANILLA ITEMS */}
  if (itemId.startsWith("material-")) {
    return "vanilla"
  }


  {/* CROPS ITEMS */}
  if (itemId.startsWith("mbi-transformed_")) {
    return "common"
  }
  if (itemId.startsWith("mbi-bag_")) {
    return "uncommon"
  }
  if (itemId.startsWith("mbi-crate_")) {
    return "rare"
  }
  if (itemId.startsWith("mbi-barrel_")) {
    return "epic"
  }
  if (itemId.startsWith("mbi-enchanted_")) {
    return "legendary"
  }

  {/* SCROLLS ITEMS */}
  if (itemId.startsWith("scroll_small_")) { return "uncommon" }
  if (itemId.startsWith("scroll_big_")) { return "rare" }
  if (itemId.startsWith("scroll_enchanted_")) { return "epic" }

  {/* RUNES ITEMS */}
  if (itemId.startsWith("rune_small_")) { return "common" }
  if (itemId.startsWith("rune_big_")) { return "rare" }
  if (itemId.startsWith("rune_enchanted_")) { return "epic" }

  {/* CANDY ITEMS */}
  if (itemId.startsWith("candy_enchanted_")) { return "epic" }
  if (itemId.startsWith("candy_")) { return "rare" }



  const itemData = itemsDataMap[cleanId]
  const rarity = itemData?.rarity?.toLowerCase() || "prototype"
  return rarity
}

export function FindItemName({ itemId }: { itemId: string }) {
  let cleanId = getCleanItemId(itemId)
  const itemData = itemsDataMap[cleanId]

  const currentLang = i18next.language
  const name =
    itemData?.name?.[currentLang] ||
    itemData?.name?.en ||
    cleanId

  return name
}