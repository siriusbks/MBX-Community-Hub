export const stats = [
  {
    id: "HEALTH",
    name: "HEALTH",
    color: "#e02044",
    icon: "",
  },
  {
    id: "AGILITY",
    name: "AGILITY",
    color: "#85c062",
    icon: "",
  },
  {
    id: "STRENGTH",
    name: "STRENGTH",
    color: "#58350b",
    icon: "",
  },
  {
    id: "INTELLIGENCE",
    name: "INTELLIGENCE",
    color: "#df3f29",
    icon: "",
  },
  {
    id: "WISDOM",
    name: "WISDOM",
    color: "#846cf0",
    icon: "",
  },
  {
    id: "LUCK",
    name: "LUCK",
    color: "#7ccbf9",
    icon: "",
  },
  {
    id: "FORTUNE",
    name: "FORTUNE",
    color: "#f1903e",
    icon: "",
  },
  {
    id: "DEFENSE",
    name: "DEFENSE",
    color: "#0045cd",
    icon: "",
  },
  {
    id: "ATTACK_SPEED",
    name: "ATTACK_SPEED",
    color: "#f59e0b",
    icon: "",
  },
  {
    id: "ENDURANCE",
    name: "ENDURANCE",
    color: "#10b981",
    icon: "",
  },
  {
    id: "CHARISMA",
    name: "CHARISMA",
    color: "#ec4899",
    icon: "",
  },
  {
    id: "MOVEMENT_SPEED",
    name: "MOVEMENT_SPEED",
    color: "#3b82f6",
    icon: "",
  },
  {
    id: "DEXTERITY",
    name: "DEXTERITY",
    color: "#8b5cf6",
    icon: "",
  },
  {
    id: "VITALITY",
    name: "VITALITY",
    color: "#ef4444",
    icon: "",
  },
  {
    id: "FARMING_FORTUNE",
    name: "FARMING_FORTUNE",
    color: "#22c55e",
    icon: "",
  },
  {
    id: "WOODCUTTING_FORTUNE",
    name: "WOODCUTTING_FORTUNE",
    color: "#a855f7",
    icon: "",
  },
  {
    id: "MINING_FORTUNE",
    name: "MINING_FORTUNE",
    color: "#3b82f6",
    icon: "",
  },
  {
    id: "FISHING_FORTUNE",
    name: "FISHING_FORTUNE",
    color: "#ec4899",
    icon: "",
  },
  {
    id: "GATHERING_FORTUNE",
    name: "GATHERING_FORTUNE",
    color: "#f59e0b",
    icon: "",
  },
  {
    id: "LOOTING_FORTUNE",
    name: "LOOTING_FORTUNE",
    color: "#10b981",
    icon: "",
  },
]
export const damages = [
  {
    id: "AIR",
    name: "AIR",
    color: "#85c062",
    icon: "",
  },
  {
    id: "EARTH",
    name: "EARTH",
    color: "#58350b",
    icon: "",
  },
  {
    id: "FIRE",
    name: "FIRE",
    color: "#df3f29",
    icon: "",
  },
  {
    id: "WATER",
    name: "WATER",
    color: "#7ccbf9",
    icon: "",
  },
]

export function StatItem({
  stat,
  from,
  to,
}: {
  stat: string
  from: number
  to: number
}) {
  let statData = stats.find((r) => r.id === stat)
  if (!statData) statData = stats[0]

  return (
    <span className="flex flex-row gap-1 text-xs">
      <img
        src={`/media/attributes/${statData.id.toLowerCase()}.png`}
        className="size-4 shadow-sm"
      />
      <p className="mr-auto">{statData.name}</p>
      {from === to ? (
        <p>{to}</p>
      ) : (
        <p>
          {from} to {to}
        </p>
      )}
    </span>
  )
}

export function SmallStatItem({
  stat,
  value,
  className,
}: {
  stat: string
  value: string | number
  className?: string
}) {
  let statData = stats.find((r) => r.id === stat)
  if (!statData) statData = stats[0]

  return (
    <span className={`flex flex-col -space-y-0.5 text-xs items-center justify-center ${className || ''}`}>
      <img
        src={`/media/attributes/${statData.id.toLowerCase()}.png`}
        className="size-4 shadow-sm"
      />

      <p>{value}</p>
    </span>
  )
}

export function DamageItem({
  type,
  from,
  to,
}: {
  type: string
  from: number
  to: number
}) {
  let damageData = damages.find((r) => r.id === type)
  if (!damageData) damageData = damages[0]

  return (
    <span className="flex flex-row gap-1 text-xs">
      <p className="mr-auto">{damageData.name}</p>
      {from === to ? (
        <p>{to}</p>
      ) : (
        <p>
          {from} to {to}
        </p>
      )}
    </span>
  )
}
