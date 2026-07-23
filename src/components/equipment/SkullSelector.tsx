import { useMemo, useState } from "react"
import { X, Check, Search, SearchIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SKULLS } from "@const/skulls"
import { SmallStatItem } from "@const/statsAndDamage"
import { Card } from "@components/ui/card"
import { Button } from "@components/ui/button"

import { Input } from "@components/ui/input"

interface Props {
  open: boolean
  selected: string[]
  onChange: (ids: string[]) => void
  onClose: () => void
}

export const SkullSelector: React.FC<Props> = ({
  open,
  selected,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation("equipment")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return SKULLS
    return SKULLS.filter((k) => k.name.toLowerCase().includes(s))
  }, [q])

  if (!open) return null

  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id))
    else onChange([...selected, id])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-2xl overflow-hidden rounded-lg border border-gray-700 bg-gray-900 py-0 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-card-dark bg-secondary/20 p-4">
          <h3 className="font-semibold">{t("equip.selector.skulls")}</h3>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-700 px-4 py-0">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("equip.search.skulls")}
            className="h-10"
          />
        </div>

        {/* List */}
        <div className="custom-scrollbar max-h-[60vh] scroll-fade space-y-2 overflow-y-auto p-3">
          {filtered.map((sk) => {
            const active = selected.includes(sk.id)

            return (
              <Card
                key={sk.id}
                onClick={() => toggle(sk.id)}
                className={`group  hover:from-background-dark/20 flex w-full flex-row items-center items-start justify-between gap-2 rounded p-2 py-2 text-left transition hover:to-background/80 ${
                  active ? "ring-1 ring-green-500/60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={sk.icon}
                    alt={sk.name}
                    className="h-12 w-12 rounded object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span>
                    <div className="text-xl">{sk.name}</div>
                    <div className="mb-0.5 flex flex-wrap gap-3 text-xs text-gray-300">
                      {Object.entries(sk.stats).map(([stat, val]) => (
                        <SmallStatItem
                          key={stat}
                          stat={stat}
                          value={`+${val}`}
                          className="!flex-row items-center gap-1"
                        />
                      ))}
                    </div>
                  </span>
                </div>
                {active && (
                  <Check
                    strokeWidth={3}
                    className="my-auto size-8 shrink-0 text-primary"
                  />
                )}
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-700 px-4 py-3">
          <span className="text-xs text-gray-400">
            {t("equip.skulls.selected", { count: selected.length })}
          </span>
          <Button onClick={onClose} size="lg">
            {t("common:actions.close", { defaultValue: "Close" })}
          </Button>
        </div>
      </Card>
    </div>
  )
}
