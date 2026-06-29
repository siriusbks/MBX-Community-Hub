import React from "react";
import { Button } from "@ui/button";
import { BookOpen, GlobeIcon, Map, Box, type LucideIcon, InfoIcon } from "lucide-react";
import { LevelBadge } from "@const/levels";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@ui/navigation-menu"
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Input } from "./ui/input";

export const Navbar = () => {

  const [hoverOpen, setHoverOpen] = React.useState<string | null>(null);
  const [nick, setNick] = React.useState<string>("");
  const [storedNick, setStoredNick] = React.useState<string | null>(null);
  const [playerId, setPlayerId] = React.useState<string | null>(null);
  const [playerLevel, setPlayerLevel] = React.useState<number | null>(null);
  const [loadingNick, setLoadingNick] = React.useState<boolean>(false);
  const [nickError, setNickError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const s = localStorage.getItem("minebox_nick");
      if (s) {
        setStoredNick(s);
      }
      const id = localStorage.getItem("minebox_id");
      if (id) setPlayerId(id);
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch latest player level (and id if available) whenever storedNick changes
  React.useEffect(() => {
    if (!storedNick) return;
    let mounted = true;
    void (async () => {
      try {
        const res = await fetch(`https://api.minebox.co/data/${encodeURIComponent(storedNick)}`);
        if (res.ok) {
          const j = await res.json().catch(() => ({} as any));
          const id = j.id || j.uuid || j.player?.id || j.data?.id;
          const lvl = j.level || j.player?.level || j.data?.level;
          if (!mounted) return;
          if (id && typeof id === "string") {
            setPlayerId(id);
            try { localStorage.setItem("minebox_id", id); } catch (e) { /* ignore */ }
          }
          if (typeof lvl !== "undefined" && lvl !== null) {
            setPlayerLevel(Number(lvl));
          }
        }
      } catch (e) {
        // ignore errors silently
      }
    })();
    return () => { mounted = false; };
  }, [storedNick]);

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
      id: "market",
      dropdown: true,
      icon: BookOpen,
      label: "Market",
      items: [
        { id: "action-house", to: "/market/action-house", icon: Map, label: "Action House" },
        { id: "bazaar", to: "/market/bazaar", icon: Map, label: "Bazaar" },
        { id: "gem-exchange", to: "/market/gem-exchange", icon: Map, label: "Gem Exchange" },
      ],
    },
    {
      id: "community",
      to: "/community",
      icon: Box,
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
          <Link to={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">{children}</div>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <nav className="z-10 minebox-shadow w-full border-b bg-linear-to-b from-secondary-lighter to-secondary backdrop-blur-sm">
      <div className=" mx-auto flex items-center  py-1 px-4">
        <Link to="/" className="text-lg font-bold text-primary"><img src="/media/logo.png" className="size-12" /></Link>


        <span className="text-xs mr-auto flex flex-row gap-8 ml-4">
          <NavigationMenu className="z-10" viewport={false}>
            <NavigationMenuList>
              {NAV_LINKS.map((link) => {
                if (isDropdown(link)) {
                  return (
                    <NavigationMenuItem key={link.id}>
                      <NavigationMenuTrigger><link.icon size={16} className="mr-2" /> {link.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="max-w-64 w-48 flex flex-col">
                          {link.items.map((sub) => {
                            return (
                              <ListItem key={sub.id} href={sub.to} className="w-full flex flex-row">
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
                    <NavigationMenuItem key={link.id}>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to={link.to}>
                          <link.icon /> {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                }
              })}

            </NavigationMenuList>
          </NavigationMenu>
        </span>

        <span className="flex items-center gap-2">



          <Popover>
            <PopoverTrigger asChild>
              <span className="flex flex-row items-center justify-center gap-2">

                {/* if not selected */}


                {/* IF Nickname Selected */}
                <span className="items-end justify-end flex flex-col leading-none gap-0.5">
                  <p className="font-medium">{storedNick ? storedNick : "Player Name"}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{playerLevel !== null ? `LEVEL ${String(playerLevel).padStart(3, "0")}` : "LEVEL 000"}</p>
                </span>

                {/* Player Head Links */}
                <img src={playerId ? `https://api.mineatar.io/face/${playerId}` : "https://api.mineatar.io/face/1ffb3a0d-4c5d-4708-9bf6-26cbe70023eb"} className="h-8 rounded-sm" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="gap-2">
              <PopoverHeader>
                <PopoverTitle>Minebox Player</PopoverTitle>
              </PopoverHeader>

              {nickError ? (
                <Alert variant="destructive" className="flex items-center justify-center">
                  <span className="items-center justify-center">
                    <InfoIcon className="size-4 mr-1" /></span>
                  <span className="flex flex-row gap-4 w-full">
                    <AlertDescription className="flex items-center justify-center mr-auto leading-tight">
                      {nickError}
                    </AlertDescription>
                  </span>
                </Alert>
              ) : (
                <Alert variant="default" className="flex items-center justify-center">
                  <span className="items-center justify-center">
                    <InfoIcon className="size-4 mr-1" /></span>
                  <span className="flex flex-row gap-4 w-full">
                    <AlertDescription className="flex items-center justify-center mr-auto leading-tight">
                      Check if you have enabled API
                    </AlertDescription>
                  </span>
                </Alert>
              )}

              <Input
                value={nick}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNick(e.target.value)}
                placeholder={storedNick ? storedNick : "Enter your Minebox nickname"}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    void (async () => {
                      const value = nick.trim();
                      if (!value) return;
                      setLoadingNick(true);
                      setNickError(null);
                      try {
                        const res = await fetch(`https://api.minebox.co/data/${encodeURIComponent(value)}`);
                            if (res.ok) {
                              const j = await res.json().catch(() => ({}));
                              const id = j.id || j.uuid || j.player?.id || j.data?.id;
                              const lvl = j.level || j.player?.level || j.data?.level;
                              if (id && typeof id === "string") {
                                try { localStorage.setItem("minebox_id", id); } catch (e) { /* ignore */ }
                                setPlayerId(id);
                              }
                              if (typeof lvl !== "undefined" && lvl !== null) setPlayerLevel(Number(lvl));
                              localStorage.setItem("minebox_nick", value);
                              setStoredNick(value);
                              setNickError(null);
                            } else if (res.status === 401) {
                          const j = await res.json().catch(() => ({}));
                          setNickError(j.error || "Player has disabled API access");
                        } else if (res.status === 404) {
                          const j = await res.json().catch(() => ({}));
                          setNickError(j.error || "User not found");
                        } else {
                          const j = await res.json().catch(() => ({}));
                          setNickError(j.error || `Error: ${res.status}`);
                        }
                      } catch (err) {
                        setNickError("Network error");
                      } finally {
                        setLoadingNick(false);
                      }
                    })();
                  }
                }}
              />

              <Button disabled={loadingNick} onClick={async () => {
                const value = nick.trim();
                if (!value) return;
                setLoadingNick(true);
                setNickError(null);
                try {
                  const res = await fetch(`https://api.minebox.co/data/${encodeURIComponent(value)}`);
                  if (res.ok) {
                    const j = await res.json().catch(() => ({}));
                    const id = j.id || j.uuid || j.player?.id || j.data?.id;
                    const lvl = j.level || j.player?.level || j.data?.level;
                    if (id && typeof id === "string") {
                      try { localStorage.setItem("minebox_id", id); } catch (e) { /* ignore */ }
                      setPlayerId(id);
                    }
                    if (typeof lvl !== "undefined" && lvl !== null) setPlayerLevel(Number(lvl));
                    localStorage.setItem("minebox_nick", value);
                    setStoredNick(value);
                    setNickError(null);
                  } else if (res.status === 401) {
                    const j = await res.json().catch(() => ({}));
                    setNickError(j.error || "Player has disabled API access");
                  } else if (res.status === 404) {
                    const j = await res.json().catch(() => ({}));
                    setNickError(j.error || "User not found");
                  } else {
                    const j = await res.json().catch(() => ({}));
                    setNickError(j.error || `Error: ${res.status}`);
                  }
                } catch (err) {
                  setNickError("Network error");
                } finally {
                  setLoadingNick(false);
                }
              }}>{loadingNick ? "Loading..." : "Load Data"}</Button>
            </PopoverContent>
          </Popover>


          {/*
          <Button size="lg" className="tracking-wider ml-2"><GlobeIcon className="mt-0.5" />Login with Discord </Button>
*/}
          <LanguageSwitcher />
        </span>
      </div>
    </nav>
  );
}