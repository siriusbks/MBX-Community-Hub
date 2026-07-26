import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  List,
  X,
  ClipboardCopy,
  Check,
  Loader2,
  Square,
  SquareAsterisk,
  EyeOffIcon,
  EyeIcon,
} from "lucide-react"
import { useCraftResources } from "./useCraftResources"
import { copyResourcesAsCSV } from "./copyResourcesAsCSV"
import { getLocalItemName } from "./localCraftItems"
import { FindItemRarity, ItemImage } from "@const/elements"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { RarityBorder } from "@const/rarities"

type CraftPlannerContentProps = {
  itemIds: string[]
  onRemoveItem: (id: string) => void
  locale?: "en" | "fr" | "pl"
  classImages?: Record<string, string>
}

export const ResourceList: React.FC<{
  resources: Record<string, number>
  locale: string
  classImages: Record<string, string>
}> = ({ resources, locale, classImages }) => {
  const { t } = useTranslation("craftPlanner")
  const entries = Object.entries(resources).sort(([, a], [, b]) => b - a)

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        {t("craftPlanner.noResourceRquired")}
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {entries.map(([id, qty]) => (
        <li
          key={id}
          className="group flex items-center gap-2 rounded-lg border-[3px] border-card/60 bg-gray-700/60 bg-linear-to-b from-secondary-lighter/80 to-secondary/80 p-2 text-sm"
        >
          {id in classImages ? (
            <img
              src={classImages[id] || "/media/missingClass.png"}
              alt=""
              className="h-6 w-6 shrink-0 rounded [image-rendering:pixelated]"
            />
          ) : (
            <ItemImage
              itemId={id}
              className="size-6 shrink-0 rounded transition-transform group-hover:scale-125"
            />
          )}
          <span className="flex-1 truncate">
            {getLocalItemName(id, locale)}
          </span>
          <Badge className="min-w-12">{qty.toLocaleString()}</Badge>
        </li>
      ))}
    </ul>
  )
}

const CraftPlannerContent: React.FC<CraftPlannerContentProps> = ({
  itemIds,
  onRemoveItem,
  locale = "en",
  classImages = {},
}) => {
  const { t } = useTranslation("craftPlanner")
  const { basicResources, craftsOnly, loading, error } = useCraftResources(
    itemIds,
    locale
  )

  const [showBasic, setShowBasic] = useState(true)
  const [showCrafts, setShowCrafts] = useState(false)
  const [copied, setCopied] = useState(false)

  const sortedItemIds = useMemo(
    () =>
      [...itemIds].sort((a, b) =>
        getLocalItemName(a, locale).localeCompare(getLocalItemName(b, locale))
      ),
    [itemIds, locale]
  )

  const onCopyCSV = async () => {
    const ok = await copyResourcesAsCSV(
      basicResources,
      craftsOnly,
      showBasic,
      showCrafts,
      locale
    )
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selected items */}
      <div className="rounded-lg border-[3px] border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-4">
        <div className="mb-3 text-lg ">
          {itemIds.length} {t("craftPlanner.selectedItems.sentence")}
        </div>

        {sortedItemIds.length === 0 ? (
          <p className="text-sm text-gray-400">{t("craftPlanner.noItems")}</p>
        ) : (
          <ul className="grid grid-cols-12 gap-2">
            {sortedItemIds.map((id) => (
              <RarityBorder
                rarity={FindItemRarity({
                  itemId: id in classImages ? `class_${id}` : id,
                })}
                key={id}
                className="group relative flex flex-col items-center gap-2 text-sm"
                innerClassName="flex flex-col items-center justify-between text-center"
              >
                {id in classImages ? (
                  <img
                    src={classImages[id] || "/media/missingClass.png"}
                    className="h-16 w-16 rounded transition-transform [image-rendering:pixelated] group-hover:scale-110"
                  />
                ) : (
                  <ItemImage
                    itemId={id}
                    className="h-16 w-16 rounded transition-transform [image-rendering:pixelated] group-hover:scale-110"
                  />
                )}
                <span className="text-xs leading-none">
                  {getLocalItemName(id, locale)}
                </span>
                <button
                  onClick={() => onRemoveItem(id)}
                  className="absolute top-2 right-2"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </RarityBorder>
            ))}
          </ul>
        )}
      </div>

      {/* Required resources */}
      <div className="rounded-lg border-[3px] border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <List
            className="h-8 w-8 shrink-0 rounded bg-linear-to-b from-primary to-primary p-1.5 text-primary-foreground minebox-shadow"
            strokeWidth={3}
          />
          <span className="flex flex-col -space-y-1.5 font-normal">
            <span className="text-lg">
              {t("craftPlanner.requiredResources.title")}
            </span>
            <span className="text-[0.7rem] opacity-60">
              {t("craftPlanner.requiredResources.description")}
            </span>
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              size="lg"
              className="font-normal hover:!-translate-y-0.75"
              onClick={() => setShowCrafts((v) => !v)}
            >
              {showCrafts ? (
                <EyeIcon className="size-4" strokeWidth={3} />
              ) : (
                <EyeOffIcon className="size-4" strokeWidth={3} />
              )}
              {t("craftPlanner.craftedResources.title")}
            </Button>

            <Button
              size="lg"
              className="font-normal hover:!-translate-y-0.75"
              onClick={() => setShowBasic((v) => !v)}
            >
              {showBasic ? (
                <EyeIcon className="size-4" strokeWidth={3} />
              ) : (
                <EyeOffIcon className="size-4" strokeWidth={3} />
              )}
              {t("craftPlanner.basicResources.title")}
            </Button>

            <Button
              size="lg"
              className="font-normal hover:!-translate-y-0.75"
              onClick={onCopyCSV}
              disabled={!showBasic && !showCrafts}
            >
              {copied ? (
                <Check className="size-4" strokeWidth={3} />
              ) : (
                <ClipboardCopy className="size-4" strokeWidth={3} />
              )}
              {t("craftPlanner.copyCSV.button")}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("craftPlanner.resolving")}
          </div>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {showCrafts && (
              <div>
                <div className="mb-2 text-sm font-semibold">
                  {t("craftPlanner.craftedResources.title")}
                </div>
                <ResourceList
                  resources={craftsOnly}
                  locale={locale}
                  classImages={classImages}
                />
              </div>
            )}

            {showBasic && (
              <div>
                <div className="mb-2 text-sm font-semibold">
                  {t("craftPlanner.basicResources.title")}
                </div>
                <ResourceList
                  resources={basicResources}
                  locale={locale}
                  classImages={classImages}
                />
              </div>
            )}

            {!showBasic && !showCrafts && (
              <p className="py-4 text-center text-sm opacity-50">
                {t("craftPlanner.requiredResources.noSelected")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CraftPlannerContent
