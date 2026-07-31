import { Button } from "@components/ui/button"
import { Globe, PawPrintIcon, Sailboat, ShapesIcon, SwordsIcon } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export function CodexNav() {
  const { t } = useTranslation("codex")
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    {
      icon: <ShapesIcon strokeWidth={3} />,
      label: t("codex.tab.items"),
      path: "/items",
    },
    {
      icon: <PawPrintIcon strokeWidth={3} />,
      label: t("codex.tab.bestiary"),
      path: "/bestiary",
    },
    {
      icon: <Sailboat strokeWidth={3} />,
      label: t("codex.tab.ships"),
      path: "/ships",
    },
    {
      icon: <SwordsIcon strokeWidth={3} />,
      label: t("codex.tab.classes"),
      path: "/classes",
    },
  ]

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <span className="flex gap-1 rounded-lg bg-linear-to-t from-secondary to-secondary-lighter p-1 pt-2 minebox-shadow">
        {navItems.map((item) => (
          <Link key={item.label} to={item.path}>
            <Button 
              variant={currentPath === item.path ? "default" : "ghost"}
              size="lg"
              className="w-32"
            >
              {item.icon} {item.label}
            </Button>
          </Link>
        ))}
      </span>
    </div>
  )
}
