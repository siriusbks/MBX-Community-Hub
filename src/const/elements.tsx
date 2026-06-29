import itemsData from "@const/APIPreload/items.json"

export function ItemImage({
  itemId,
  className,
}: {
  itemId: string
  className?: string
}) {
  let cleanId = itemId?.replace(/^mbi-/, "")
  cleanId = cleanId?.replace(/^material-/, "")

  const itemData = itemsData?.[cleanId]
  const imageUrl = itemData?.image
    ? `data:image/png;base64,${itemData.image}`
    : `/media/missing.png`

  if (itemId.startsWith("material-")) {
    return (
      <img
        src={`/media/vanilla/${cleanId}.png`}
        className={`[image-rendering:pixelated] ${className}`}
      />
    )
  }

  return <img src={imageUrl} className={`[image-rendering:pixelated] ${className}`} />
}

export function FindItemRarity({ itemId }: { itemId: string }) {
  const cleanId = itemId?.replace(/^mbi-/, "")
  if (itemId.startsWith("material-")) {
    return "vanilla"
  }
  const itemData = itemsData?.[cleanId]
  const rarity = itemData?.rarity?.toLowerCase() || "prototype"
  return rarity
}

export function FindItemName({ itemId }: { itemId: string }) {
  let cleanId = itemId?.replace(/^mbi-/, "")
  cleanId = cleanId?.replace(/^material-/, "")
  const itemData = itemsData?.[cleanId]
  const name = itemData?.name?.en || cleanId
  return name
}
