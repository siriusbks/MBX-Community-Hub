"use client"

import { Badge } from "@components/ui/badge"
import { FindItemRarity, ItemImage, FindItemName } from "@const/elements"
import { RarityBorder } from "@const/rarities"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'

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

const getCategoryMap = (t: any) => ({
  categories: [
    {
      category: t("market.bazaar.categorie.farming"),
      items: [
        "material-bamboo",
        "mbi-transformed_material-bamboo",
        "mbi-bag_material-bamboo",
        "mbi-crate_material-bamboo",
        "mbi-barrel_material-bamboo",
        "mbi-enchanted_material-bamboo",
        
        "material-carrot",
        "mbi-transformed_material-carrot",
        "mbi-bag_material-carrot",
        "mbi-crate_material-carrot",
        "mbi-barrel_material-carrot",
        "mbi-enchanted_material-carrot",
        
        "material-beetroot",
        "mbi-transformed_material-beetroot",
        "mbi-bag_material-beetroot",
        "mbi-crate_material-beetroot",
        "mbi-barrel_material-beetroot",
        "mbi-enchanted_material-beetroot",
        
        "material-cactus",
        "mbi-transformed_material-cactus",
        "mbi-bag_material-cactus",
        "mbi-crate_material-cactus",
        "mbi-barrel_material-cactus",
        "mbi-enchanted_material-cactus",
        
        "material-cocoa_beans",
        "mbi-transformed_material-cocoa_beans",
        "mbi-bag_material-cocoa_beans",
        "mbi-crate_material-cocoa_beans",
        "mbi-barrel_material-cocoa_beans",
        "mbi-enchanted_material-cocoa_beans",
        
        "material-kelp",
        "mbi-transformed_material-kelp",
        "mbi-bag_material-kelp",
        "mbi-crate_material-kelp",
        "mbi-barrel_material-kelp",
        "mbi-enchanted_material-kelp",
        
        "material-melon_slice",
        "mbi-transformed_material-melon_slice",
        "mbi-bag_material-melon_slice",
        "mbi-crate_material-melon_slice",
        "mbi-barrel_material-melon_slice",
        "mbi-enchanted_material-melon_slice",
        
        "material-nether_wart",
        "mbi-transformed_material-nether_wart",
        "mbi-bag_material-nether_wart",
        "mbi-crate_material-nether_wart",
        "mbi-barrel_material-nether_wart",
        "mbi-enchanted_material-nether_wart",
        
        "material-potato",
        "mbi-transformed_material-potato",
        "mbi-bag_material-potato",
        "mbi-crate_material-potato",
        "mbi-barrel_material-potato",
        "mbi-enchanted_material-potato",
        
        "material-pumpkin",
        "mbi-transformed_material-pumpkin",
        "mbi-bag_material-pumpkin",
        "mbi-crate_material-pumpkin",
        "mbi-barrel_material-pumpkin",
        "mbi-enchanted_material-pumpkin",
        
        "material-sugar_cane",
        "mbi-transformed_material-sugar_cane",
        "mbi-bag_material-sugar_cane",
        "mbi-crate_material-sugar_cane",
        "mbi-barrel_material-sugar_cane",
        "mbi-enchanted_material-sugar_cane",
        
        "material-sweet_berries",
        "mbi-transformed_material-sweet_berries",
        "mbi-bag_material-sweet_berries",
        "mbi-crate_material-sweet_berries",
        "mbi-barrel_material-sweet_berries",
        "mbi-enchanted_material-sweet_berries",
        
        "material-wheat",
        "mbi-transformed_material-wheat",
        "mbi-bag_material-wheat",
        "mbi-crate_material-wheat",
        "mbi-barrel_material-wheat",
        "mbi-enchanted_material-wheat",
        
        "material-honeycomb",
      ],
    },
    {
      category: t("market.bazaar.categorie.harvestables"),
      items: [
        "mbi-crop_barley",
        "mbi-seed_barley",
        "mbi-seed_corn",
        "mbi-seed_quinoa",
        "mbi-seed_rice",
        "mbi-seed_rye",
        "mbi-crop_quinoa_green",
        "mbi-crop_corn",
        "mbi-crop_quinoa_yellow",
        "mbi-crop_rice",
        "mbi-crop_quinoa_orange",
        "mbi-crop_quinoa_purple",
        "mbi-crop_rye",
        "mbi-crop_quinoa_red",

        "mbi-coconut",
        "mbi-banana",
        "mbi-avocado",
        "mbi-lemon",
        "mbi-chestnut",
        "mbi-hazelnut",
        "mbi-olive",
        "mbi-walnut",
        "mbi-pineapple",
        "mbi-dark_coconut",
        "mbi-mystic_hornbeam_leaf",
        "mbi-mango",
        "mbi-sacred_coconut",

        "material-jungle_log",
        "material-oak_log",
        "material-spruce_log",
        "material-birch_log",
        "material-acacia_log",
        "material-dark_oak_log",
        "material-mangrove_log",
        "material-cherry_log",
        "material-pale_oak_log",
        "mbi-log_coconut",
        "mbi-log_banana",
        "mbi-log_chestnut",
        "mbi-log_mahogany",
        "mbi-log_hazel",
        "mbi-log_olive_tree",
        "mbi-log_walnut",
        "mbi-log_dark_coconut",
        "mbi-log_maple",
        "mbi-log_eucalyptus",
        "mbi-log_yew",
        "mbi-log_elm",
        "mbi-log_laughing_tree",
        "mbi-log_mystic_hornbeam",
        "mbi-log_sacred_coconut",
      ],
    },
  ],
})

export default function BazaarGrid() {
  const { t } = useTranslation("market")
  const categoryMap = getCategoryMap(t)
  const [items, setItems] = useState<BazaarItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllPages = async () => {
      const limit = 100

      const firstPage = (await fetch(
        `https://api.minebox.co/market/bazaar?limit=${limit}&offset=0`
      ).then((r) => r.json())) as BazaarResponse

      const allItems = [...firstPage.items]
      const totalPages = Math.ceil(firstPage.total / limit)

      const requests = []
      for (let page = 2; page <= totalPages; page++) {
        requests.push(
          fetch(
            `https://api.minebox.co/market/bazaar?limit=${limit}&offset=${(page - 1) * limit}`
          ).then((r) => r.json())
        )
      }

      const results = await Promise.all(requests)
      results.forEach((result: BazaarResponse) => {
        allItems.push(...result.items)
      })

      setItems(allItems)
      setLoading(false)
    }

    loadAllPages()
  }, [])

  if (loading) {
    return <div className="py-10 text-center">Loading...</div>
  }

  const itemsById = new Map(items.map((item) => [item.item_id, item]))
  const usedIds = new Set<string>()

  const groupedItems: Record<string, BazaarItem[]> = {}

  categoryMap.categories.forEach((category) => {
    groupedItems[category.category] = category.items.map((itemId) => {
      usedIds.add(itemId)
      const found = itemsById.get(itemId)
      if (found) return found

      return {
        item_id: itemId,
        sell_price: 0,
        buy_price: 0,
        stock: 0,
        unavailable: true,
      } satisfies BazaarItem
    })
  })

  const otherItems = items.filter((item) => !usedIds.has(item.item_id))
  const otherCategoryName = t("market.bazaar.categorie.others")
  if (otherItems.length > 0) {
    groupedItems[otherCategoryName] = otherItems
  }

  const orderedCategories = [
    ...categoryMap.categories.map((c) => c.category),
    ...(groupedItems[otherCategoryName] ? [otherCategoryName] : []),
  ]

  return (
    <div className="space-y-8">
      {orderedCategories.map((category) => (
        <div key={category}>
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
            {category}
            <Badge variant="secondary" className="text-sm">
              {groupedItems[category].length} items
            </Badge>
          </h2>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {groupedItems[category].map((item) => (
              <RarityBorder
                key={item.item_id}
                rarity={FindItemRarity({ itemId: item.item_id })}
                className={`flex flex-row items-center gap-0 ${
                  item.unavailable ? "opacity-50 grayscale" : ""
                }`}
              >
                <span className="flex w-full flex-row items-center justify-center gap-0">
                  <ItemImage
                    itemId={item.item_id}
                    className="w-12 aspect-square object-fill drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                  />

                  {/* Name and Stock */}
                  <span className="flex h-8 flex-col  justify-center gap-2 pl-2  text-sm leading-none">
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
                        <p className="text-[0.65rem] text-muted-foreground uppercase">{t("market.bazaar.sell")}</p>
                        <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                          {item.sell_price.toLocaleString()}
                          <img
                            src="/media/currency/GOLD.png"
                            className="!size-4"
                            alt="Gold"
                          />
                        </p>
                      </span>

                      <span className="flex flex-row justify-between gap-2 px-2 text-xs items-center">
                        <p className="text-[0.65rem] text-muted-foreground uppercase">{t("market.bazaar.buy")}</p>
                        <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                          {item.buy_price.toLocaleString()}
                          <img
                            src="/media/currency/GOLD.png"
                            className="!size-4"
                            alt="Gold"
                          />
                        </p>
                      </span>
                    </>
                  )}
                </span>
              </RarityBorder>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
