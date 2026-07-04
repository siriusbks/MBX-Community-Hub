import { Button } from "@components/ui/button"
import { Globe, PawPrintIcon, Sailboat, ShapesIcon, SwordsIcon } from "lucide-react"
import { useLocation } from "react-router-dom"

export function CodexNav() {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    {
      icon: <ShapesIcon strokeWidth={3} />,
      label: "Items",
      path: "/items",
    },
    {
      icon: <PawPrintIcon strokeWidth={3} />,
      label: "Bestiary",
      path: "/bestiary",
    },
    {
      icon: <Sailboat strokeWidth={3} />,
      label: "Ships",
      path: "/ships",
    },
    {
      icon: <SwordsIcon strokeWidth={3} />,
      label: "Classes",
      path: "/classes",
    },
  ]

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <span className="flex gap-1 rounded-lg bg-linear-to-t from-secondary to-secondary-lighter p-1 pt-2 minebox-shadow">
        {navItems.map((item) => (
          <a key={item.label} href={item.path}>
            <Button 
              variant={currentPath === item.path ? "default" : "ghost"}
              size="lg"
              className="w-32"
            >
              {item.icon} {item.label}
            </Button>
          </a>
        ))}
      </span>
    </div>
  )
}
