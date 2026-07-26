import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
  X,
  ChevronRight,
  ChevronDown,
  List,
  ClipboardCopy,
  Check,
  Loader2,
  Square,
  SquareAsterisk,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useCraftItem } from "./useCraftItem"
import type { CraftIngredient } from "./craftPlannerTypes"
import {
  gatherResources,
  gatherCraftsOnly,
  scaleQuantityMap,
} from "./craftResourceUtils"
import { copyResourcesAsCSV } from "./copyResourcesAsCSV"
import { ResourceList } from "./CraftPlannerContent"
import { FindItemRarity, ItemImage } from "@const/elements"
import { Card } from "@components/ui/card"
import { RarityBadge } from "@const/rarities"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"

type RecipeTreeModalProps = {
  open: boolean
  onClose: () => void
  itemId: string | null
  locale?: "en" | "fr" | "pl"
}

const TreeNode: React.FC<{
  ingredient: CraftIngredient
  multiplier: number
  depth: number
}> = ({ ingredient, multiplier, depth }) => {
  const [expanded, setExpanded] = useState(false)

  const childIngredients = ingredient.item?.recipe?.ingredients
  const hasChildren = !!childIngredients?.length
  const displayedAmount = (ingredient.amount ?? 1) * multiplier
  const name = ingredient.item?.name ?? ingredient.id

  return (
    <div>
      <div
        className="group flex items-center gap-2 py-1 pr-1"
        style={{ paddingLeft: depth * 22 }}
        onClick={() => setExpanded((v) => !v)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-gray-700"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="h-5 w-5 shrink-0" />
        )}

        <ItemImage
          itemId={ingredient.id}
          className="h-6 w-6 shrink-0 transition-transform [image-rendering:pixelated] group-hover:scale-110"
        />
        <span className="flex-1 truncate text-sm">{name}</span>

        <Badge className="min-w-12">x{displayedAmount.toLocaleString()}</Badge>
      </div>

      {hasChildren && expanded && (
        <div>
          {childIngredients!.map((child, index) => (
            <TreeNode
              key={`${child.id}-${index}`}
              ingredient={child}
              multiplier={displayedAmount}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const RecipeTreeModal: React.FC<RecipeTreeModalProps> = ({
  open,
  onClose,
  itemId,
  locale = "en",
}) => {
  const { t } = useTranslation("craftPlanner")
  const { data, loading, error } = useCraftItem(open ? itemId : null, locale)

  const [multiplier, setMultiplier] = useState(1)
  const [showBasic, setShowBasic] = useState(true)
  const [showCrafts, setShowCrafts] = useState(false)
  const [copied, setCopied] = useState(false)

  // Reset the quantity/toggles whenever a different item is opened.
  useEffect(() => {
    if (open) {
      setMultiplier(1)
      setShowBasic(true)
      setShowCrafts(false)
    }
  }, [open, itemId])

  const basicResources = useMemo(
    () => scaleQuantityMap(gatherResources(data?.recipe), multiplier),
    [data, multiplier]
  )
  const craftsOnly = useMemo(
    () => scaleQuantityMap(gatherCraftsOnly(data?.recipe), multiplier),
    [data, multiplier]
  )

  if (!open) return null

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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Card className="relative flex h-[calc(100vh-2rem)] w-full max-w-[1200px] flex-col overflow-hidden rounded-lg py-0 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b-2 bg-secondary/40 px-4 py-3">
          <h2 className="text-lg">{t("craftPlanner.recipeTree.title")}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700"
            aria-label="Close Recipe Tree"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 scroll-fade overflow-y-auto p-4 py-0">
          {loading && (
            <div className="flex items-center gap-2 py-8 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("craftPlanner.resolving")}
            </div>
          )}

          {error && <p className="text-sm text-red-300">{error}</p>}

          {!loading && !error && data && (
            <div className="flex flex-col gap-4">
              {/* Root item + quantity */}
              <div className="flex items-center gap-3 rounded-lg border-[3px] border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-4">
                <ItemImage
                  itemId={data.id}
                  className="h-10 w-10 shrink-0 rounded [image-rendering:pixelated]"
                />
                <span className="flex flex-1 flex-col gap-0">
                  <span className="truncate text-base">{data.name}</span>
                  {/* TODO: FIX RARITY */}
                  <RarityBadge rarity={FindItemRarity({ itemId: data.id })} />
                </span>
                <label className="flex shrink-0 items-center gap-2 text-sm">
                  {t("craftPlanner.recipeTree.quantity")}
                  <input
                    type="number"
                    min={1}
                    max={1280}
                    value={multiplier}
                    onChange={(e) =>
                      setMultiplier(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-20 rounded bg-secondary px-2 py-1 text-center text-white"
                  />
                </label>
              </div>

              {/* Tree */}
              <div className="rounded-lg border-[3px] border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-4">
                {data.recipe?.ingredients?.length ? (
                  data.recipe.ingredients.map((ingredient, index) => (
                    <TreeNode
                      key={`${ingredient.id}-${index}`}
                      ingredient={ingredient}
                      multiplier={multiplier}
                      depth={0}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    {t("craftPlanner.noItems")}
                  </p>
                )}
              </div>

              {/* Required resources recap (reused from the Craft Planner) */}
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
                        <EyeOffIcon className="size-4"  strokeWidth={3}/>
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
                        <ClipboardCopy className="size-4"  strokeWidth={3}/>
                      )}
                      {t("craftPlanner.copyCSV.button")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {showCrafts && (
                    <div>
                      <div className="mb-2 text-sm font-semibold">
                        {t("craftPlanner.craftedResources.title")}
                      </div>
                      <ResourceList
                        resources={craftsOnly}
                        locale={locale}
                        classImages={{}}
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
                        classImages={{}}
                      />
                    </div>
                  )}

                  {!showBasic && !showCrafts && (
                    <p className="py-4 text-center text-sm opacity-50">
                      {t("craftPlanner.requiredResources.noSelected")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>,
    document.body
  )
}

export default RecipeTreeModal
