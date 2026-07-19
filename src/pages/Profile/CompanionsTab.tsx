import { Card, CardHeader, CardTitle, CardContent } from "@ui/card"
import { Badge } from "@ui/badge"
import { Cat, Anchor } from "lucide-react"
import { type PlayerData } from "../../types/profile"
import { CorsIfDev } from "@components/utils/helper"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FindItemName, FindItemRarity, ItemImageUrl } from "@const/elements"
import { RarityBadge } from "@const/rarities"

function CompanionImage({
  itemId,
  type,
  className,
}: {
  itemId: string
  type: "pet" | "mount"
  className?: string
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(CorsIfDev(`https://api.minebox.co/item/${type}_${itemId}?locale=en`))
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        if (data.extra_image) {
          setImageUrl(data.extra_image)
        } else if (data.image) {
          setImageUrl(`data:image/png;base64,${data.image}`)
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [itemId, type])

  if (!imageUrl)
    return (
      <div
        className={`shrink-0 animate-pulse rounded bg-secondary/50 ${className || "h-12 w-12"}`}
      />
    )

  return (
    <img
      src={imageUrl}
      alt={itemId.replace("_", " ")}
      className={`shrink-0 object-contain ${className || "h-12 w-12"}`}
      style={{ imageRendering: "pixelated" }}
    />
  )
}

export function CompanionsTab({ data }: { data: PlayerData }) {
  const { t } = useTranslation("profile")

  if (!data.data?.COMPANIONS) return null

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border-primary/10 bg-card/40">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Cat className="h-4 w-4" /> {t("profile.companions.pets")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Object.values(data.data.COMPANIONS.pets || {}).map((pet) => (
              <div
                key={pet.id}
                className={`relative flex flex-col items-center overflow-hidden rounded-xl border p-2 transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.COMPANIONS?.active_pet === pet.id ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.15)]" : "border-border/40 bg-secondary/20 hover:bg-secondary/40"}`}
              >
                {data.data?.COMPANIONS?.active_pet === pet.id && (
                  <Badge
                    variant="default"
                    className="absolute top-2 right-2 h-4 bg-primary px-1.5 py-0 text-[9px] text-primary-foreground shadow-sm"
                  >
                    Active
                  </Badge>
                )}
                <div className="mt-2 mb-3 flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-background/30 shadow-inner">
                  <img
                    src={(() => {
                      const [url, setUrl] = React.useState("")
                      React.useEffect(() => {
                        ItemImageUrl({ itemId: "pet_" + pet.id }).then(setUrl)
                      }, [pet.id])
                      return url
                    })()}
                    className="h-10 w-10"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="flex flex-col items-center gap-1 text-center text-sm text-foreground/90 capitalize">
                  {FindItemName({ itemId: "pet_" + pet.id })}
                  <RarityBadge
                    rarity={FindItemRarity({ itemId: "pet_" + pet.id })}
                  />
                </p>
                <div className="mt-3 w-full space-y-1.5 rounded-lg border border-white/5 bg-background/30 p-2.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-muted-foreground">
                      Trait
                    </span>
                    <span className="font-semibold text-foreground capitalize">
                      {pet.trait}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-muted-foreground">
                      Gen
                    </span>
                    <span className="font-semibold text-foreground">
                      {pet.generation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-muted-foreground">
                      XP
                    </span>
                    <span className="font-semibold text-primary">
                      {pet.experience.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 bg-card/40">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Anchor className="h-4 w-4" /> {t("profile.companions.mounts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Object.values(data.data.COMPANIONS.mounts || {}).map((mount) => (
              <div
                key={mount.id}
                className={`relative flex flex-col items-center overflow-hidden rounded-xl border p-2 transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.COMPANIONS?.active_mount === mount.id ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.15)]" : "border-border/40 bg-secondary/20 hover:bg-secondary/40"}`}
              >
                {data.data?.COMPANIONS?.active_mount === mount.id && (
                  <Badge
                    variant="default"
                    className="absolute top-2 right-2 h-4 bg-primary px-1.5 py-0 text-[9px] text-primary-foreground shadow-sm"
                  >
                    {t("profile.companions.active")}
                  </Badge>
                )}
                {mount.enchanted && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 h-4 border-purple-500/30 bg-purple-500/20 px-1.5 py-0 text-[9px] text-purple-400"
                  >
                    Enchant
                  </Badge>
                )}
                <div className="mt-2 mb-3 flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-background/30 shadow-inner">
                  <img
                    src={(() => {
                      const [url, setUrl] = React.useState("")
                      React.useEffect(() => {
                        ItemImageUrl({ itemId: "mount_" + mount.id }).then(
                          setUrl
                        )
                      }, [mount.id])
                      return url
                    })()}
                    className="h-10 w-10"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="flex flex-col items-center gap-1 text-center text-sm text-foreground/90 capitalize">
                  {FindItemName({ itemId: "mount_" + mount.id })}
                  <RarityBadge
                    rarity={FindItemRarity({ itemId: "mount_" + mount.id })}
                  />
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
