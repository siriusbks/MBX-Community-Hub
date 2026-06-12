import React from "react";
import { Button } from "./ui/button";
import { BookOpen, GlobeIcon, Map, type LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LevelBadge } from "@/const/levels";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";

export const Navbar = () => {

  const [hoverOpen, setHoverOpen] = React.useState<string | null>(null);

  // Typ dla pojedynczego elementu w dropdown
  type NavDropdownItem = {
    id: string;
    to: string;
    icon: LucideIcon;
    label: string;
    badge?: string;
  };


  type NavDropdown = {
    id: string;
    dropdown: true;
    icon: LucideIcon;
    label: string;
    items: NavDropdownItem[];
  };
  type NavLink = {
    id: string;
    to: string;
    icon: LucideIcon;
    label: string;
    matchPrefix?: string;
  };

  function isDropdown(item: NavItem): item is NavDropdown {
    return 'dropdown' in item && item.dropdown === true;
  }

  type NavItem = NavLink | NavDropdown;

  const NAV_LINKS: NavItem[] = [
    {
      id: "maps",
      to: "/maps",
      icon: Map,
      label: "Maps",
      matchPrefix: "/maps"
    },
    {
      id: "codex",
      dropdown: true,
      icon: BookOpen,
      label: "Codex",
      items: [
        { id: "items", to: "/codex/items", icon: Map, label: "Items" },
        { id: "bestiary", to: "/codex/bestiary", icon: Map, label: "Bestiary" },
        { id: "ships", to: "/codex/ships", icon: Map, label: "Ships" },
        { id: "classes", to: "/codex/classes", icon: Map, label: "Classes" },
        { id: "cosmetics", to: "/codex/cosmetics", icon: Map, label: "Cosmetics" },
      ],
    },
    {
      id: "tools",
      dropdown: true,
      icon: BookOpen,
      label: "Tools",
      items: [
        { id: "equipment", to: "/tools/equipment-builder", icon: Map, label: "Equpment Builder" },
        { id: "collections", to: "/tools/collections", icon: Map, label: "Collections" },
      ],
    },
    {
      id: "actions",
      to: "/actions",
      icon: Map,
      label: "Actions",
      matchPrefix: "/Actions"
    },
    {
      id: "community",
      to: "/community",
      icon: Map,
      label: "Community",
    },
    {
      id: "profile",
      to: "/profile",
      icon: Map,
      label: "Profile",
      matchPrefix: "/profile"
    },
  ];

  function ListItem({
    title,
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
      <li {...props}>
        <NavigationMenuLink asChild>
          <a href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">{children}</div>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <nav className="z-10 minebox-shadow w-full border-b bg-linear-to-b from-secondary-lighter to-secondary backdrop-blur-sm">
      <div className=" mx-auto flex items-center  py-1 px-4">
        <a href="/" className="text-lg font-bold text-primary"><img src="/media/logo.png" className="size-12" /></a>


        <span className="text-xs mr-auto flex flex-row gap-8 ml-4">
          <NavigationMenu className="z-10" viewport={false}>
            <NavigationMenuList>
              {NAV_LINKS.map((link) => {
                if (isDropdown(link)) {
                  return (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger><link.icon size={16} className="mr-2" /> {link.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="max-w-64 w-48 flex flex-col">
                          {link.items.map((sub) => {
                            return (
                              <ListItem href={sub.to} className="w-full flex flex-row">
                                <span className="flex flex-row gap-2">
                                  <sub.icon className="size-6" />
                                  <span className="flex flex-col gap-0 leading-none justify-center">
                                    <p className="text-card-foreground flex flex-row items-center">
                                      {sub.label}
                                    </p>
                                    {sub.badge && (
                                      <p className="text-[0.5rem] text-primary">
                                        {sub.label}
                                      </p>)}
                                  </span>
                                </span>
                              </ListItem>
                            )
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                } else {
                  return (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <a href={link.to}>
                          <link.icon /> {link.label}
                        </a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                }
              })}

            </NavigationMenuList>
          </NavigationMenu>
        </span>

        <span className="flex items-center gap-2">

          <span className="items-end justify-end flex flex-col leading-none gap-0.5">

            <p className="font-medium">Player Name</p>
            <p className="text-[0.7rem] text-muted-foreground">LEVEL 000 </p>
          </span>

          {/* Player Head Links */}
          <img src="https://api.mineatar.io/face/1ffb3a0d-4c5d-4708-9bf6-26cbe70023eb" className="h-8 rounded-sm" />

          <Button size="lg" className="tracking-wider"><GlobeIcon className="mt-0.5" />Login with Discord </Button>
        </span>
      </div>
    </nav>
  );
}