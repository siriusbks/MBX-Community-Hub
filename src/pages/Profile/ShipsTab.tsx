import { Card, CardHeader, CardTitle, CardContent } from "@ui/card"
import { Badge } from "@ui/badge"
import { Anchor } from "lucide-react"
import { type PlayerData } from "../../types/profile"
import { CorsIfDev } from "@components/utils/helper"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FindItemName, FindItemRarity, ItemImageUrl } from "@const/elements"
import { RarityBadge } from "@const/rarities"

function ShipImage({
  shipId,
  className,
}: {
  shipId: string
  className?: string
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(CorsIfDev(`https://api.minebox.co/item/ship_${shipId}?locale=en`))
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
  }, [shipId])

  if (!imageUrl)
    return (
      <div
        className={`shrink-0 animate-pulse rounded bg-secondary/50 ${className || "h-12 w-12"}`}
      />
    )

  return (
    <img
      src={imageUrl}
      alt={shipId.replace(/_/g, " ")}
      className={`shrink-0 object-contain ${className || "h-12 w-12"}`}
      style={{ imageRendering: "pixelated" }}
    />
  )
}

export function ShipsTab({ data }: { data: PlayerData }) {
  const { t } = useTranslation("profile")
  if (!data.data?.SHIPS) return null

  return (
    <Card className="border-primary/10 bg-card/40">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Anchor className="h-4 w-4" /> {t("profile.ships.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.data.SHIPS.ships.map((ship) => (
            <div
              key={ship.id}
              className={`relative flex flex-col items-center overflow-hidden rounded-xl border p-2 transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.SHIPS?.active === ship.id ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.15)]" : "border-border/40 bg-secondary/20 hover:bg-secondary/40"}`}
            >
              {data.data?.SHIPS?.active === ship.id && (
                <Badge
                  variant="default"
                  className="absolute top-2 right-2 h-4 bg-primary px-1.5 py-0 text-[9px] text-primary-foreground shadow-sm"
                >
                  {t("profile.ships.active")}
                </Badge>
              )}
                <div className="mt-2 mb-3 flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-background/30 shadow-inner">
                  <img
                    src={(() => {
                      const [url, setUrl] = React.useState("")
                      React.useEffect(() => {
                        ItemImageUrl({ itemId: "ship_" + ship.id }).then(
                          setUrl
                        )
                      }, [ship.id])
                      return url
                    })()}
                    className="h-10 w-10"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              <p className="flex flex-row items-center gap-1 text-center text-sm text-foreground/90 capitalize items-center justify-center">
                <RarityBadge
                  rarity={FindItemRarity({ itemId: "ship_" + ship.id })}
                />
                {FindItemName({ itemId: "ship_" + ship.id })}
              </p>
              <div className="mt-3 w-full space-y-1.5 rounded-lg border border-white/5 bg-background/40 p-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-medium text-muted-foreground">XP</span>
                  <span className="font-semibold text-primary">
                    {ship.experience.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
