import React from "react"
import { Button } from "@ui/button"
import {
  GlobeIcon,
  InfoIcon,
  MenuIcon,
  SquarePen,
} from "lucide-react"
import { LevelBadge } from "@const/levels"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@ui/navigation-menu"
import { Link, useLocation } from "react-router-dom"
import { LanguageSwitcher } from "./LanguageSwitcher"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Input } from "./ui/input"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet"

import { NAV_LINKS, type NavItem, type NavDropdown } from "@const/nav"

export const Navbar = () => {
  const [nick, setNick] = React.useState<string>("")
  const [storedNick, setStoredNick] = React.useState<string | null>(null)
  const [playerId, setPlayerId] = React.useState<string | null>(null)
  const [playerLevel, setPlayerLevel] = React.useState<number | null>(null)
  const [loadingNick, setLoadingNick] = React.useState<boolean>(false)
  const [nickError, setNickError] = React.useState<string | null>(null)
  const location = useLocation()
  const pathname = location.pathname

  React.useEffect(() => {
    try {
      const s = localStorage.getItem("minebox_nick")
      if (s) {
        setStoredNick(s)
      }
      const id = localStorage.getItem("minebox_id")
      if (id) setPlayerId(id)
    } catch (e) {
      // ignore
    }
  }, [])

  // Fetch latest player level (and id if available) whenever storedNick changes
  React.useEffect(() => {
    if (!storedNick) return
    let mounted = true
    void (async () => {
      try {
        const res = await fetch(
          `https://api.minebox.co/data/${encodeURIComponent(storedNick)}`
        )
        if (res.ok) {
          const j = await res.json().catch(() => ({}) as any)
          const id = j.id || j.uuid || j.player?.id || j.data?.id
          const lvl = j.level || j.player?.level || j.data?.level
          if (!mounted) return
          if (id && typeof id === "string") {
            setPlayerId(id)
            try {
              localStorage.setItem("minebox_id", id)
            } catch (e) {
              /* ignore */
            }
          }
          if (typeof lvl !== "undefined" && lvl !== null) {
            setPlayerLevel(Number(lvl))
          }
        }
      } catch (e) {
        // ignore errors silently
      }
    })()
    return () => {
      mounted = false
    }
  }, [storedNick])

  // Typ dla pojedynczego elementu w dropdown

  function isDropdown(item: NavItem): item is NavDropdown {
    return "dropdown" in item && item.dropdown === true
  }

  function isActive(link: NavItem): boolean {
    if (isDropdown(link)) {
      return link.items.some(
        (sub) => pathname === sub.to || pathname.startsWith(sub.to + "/")
      )
    }
    const prefix = link.matchPrefix ?? link.to
    return pathname === link.to || pathname.startsWith(prefix + "/")
  }

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
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <nav className="z-9997 w-full border-b bg-linear-to-b from-secondary-lighter to-secondary minebox-shadow backdrop-blur-sm">
      <div className="mx-auto flex items-center px-4 py-1">
        <Link to="/" className="text-lg font-bold text-primary">
          <img src="/media/logo.png" className="w-24 h-12" />
        </Link>

        <span className="mr-4 lg:mr-auto ml-auto lg:ml-4 flex flex-row gap-8 text-xs">
          <span className="hidden lg:flex">
            <NavigationMenu className="z-[9999]" viewport={false}>
              <NavigationMenuList>
                {NAV_LINKS.map((link) => {
                  if (isDropdown(link)) {
                    return (
                      <NavigationMenuItem key={link.id}>
                        <NavigationMenuTrigger active={isActive(link)}>
                          <link.icon size={16} className="mr-2" /> {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="flex w-48 max-w-64 flex-col">
                            {link.items.map((sub) => {
                              return (
                                <ListItem
                                  key={sub.id}
                                  href={sub.to}
                                  className="flex w-full flex-row"
                                >
                                  <span className="flex flex-row gap-2">
                                    <sub.icon className="size-6" />
                                    <span className="flex flex-col justify-center gap-0 leading-none">
                                      <p className="flex flex-row items-center text-card-foreground">
                                        {sub.label}
                                      </p>
                                      {sub.badge && (
                                        <p className="text-[0.5rem] text-primary">
                                          {sub.badge}
                                        </p>
                                      )}
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
                        <NavigationMenuLink
                          asChild
                          active={isActive(link)}
                          className={navigationMenuTriggerStyle()}
                        >
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
        </span>

        <span className=" items-center gap-2 flex">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-row items-center justify-center gap-2 rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer outline-none">
                {/* if not selected */}

                {/* IF Nickname Selected */}
                <span className="flex flex-col items-end justify-end gap-0.5 leading-none">
                  <p className="font-medium">
                    {storedNick ? storedNick : "Player Name"}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    {playerLevel !== null
                      ? `LEVEL ${String(playerLevel).padStart(3, "0")}`
                      : "LEVEL 000"}
                  </p>
                </span>

                {/* Player Head Links */}
                <img
                  src={
                    playerId
                      ? `https://api.mineatar.io/face/${playerId}`
                      : "https://api.mineatar.io/face/1ffb3a0d-4c5d-4708-9bf6-26cbe70023eb"
                  }
                  className="h-8 rounded-sm"
                />
                <SquarePen className="size-4 text-muted-foreground opacity-70" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="gap-2">
              <PopoverHeader>
                <PopoverTitle>Minebox Player</PopoverTitle>
              </PopoverHeader>

              {nickError ? (
                <Alert
                  variant="destructive"
                  className="flex items-center justify-center"
                >
                  <span className="items-center justify-center">
                    <InfoIcon className="mr-1 size-4" />
                  </span>
                  <span className="flex w-full flex-row gap-4">
                    <AlertDescription className="mr-auto flex items-center justify-center leading-tight">
                      {nickError}
                    </AlertDescription>
                  </span>
                </Alert>
              ) : (
                <Alert
                  variant="default"
                  className="flex items-center justify-center"
                >
                  <span className="items-center justify-center">
                    <InfoIcon className="mr-1 size-4" />
                  </span>
                  <span className="flex w-full flex-row gap-4">
                    <AlertDescription className="mr-auto flex items-center justify-center leading-tight">
                      Check if you have enabled API
                    </AlertDescription>
                  </span>
                </Alert>
              )}

              <Input
                value={nick}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNick(e.target.value)
                }
                placeholder={
                  storedNick ? storedNick : "Enter your Minebox nickname"
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    void (async () => {
                      const value = nick.trim()
                      if (!value) return
                      setLoadingNick(true)
                      setNickError(null)
                      try {
                        const res = await fetch(
                          `https://api.minebox.co/data/${encodeURIComponent(value)}`
                        )
                        if (res.ok) {
                          const j = await res.json().catch(() => ({}))
                          const id =
                            j.id || j.uuid || j.player?.id || j.data?.id
                          const lvl =
                            j.level || j.player?.level || j.data?.level
                          if (id && typeof id === "string") {
                            try {
                              localStorage.setItem("minebox_id", id)
                            } catch (e) {
                              /* ignore */
                            }
                            setPlayerId(id)
                          }
                          if (typeof lvl !== "undefined" && lvl !== null)
                            setPlayerLevel(Number(lvl))
                          localStorage.setItem("minebox_nick", value)
                          setStoredNick(value)
                          setNickError(null)
                        } else if (res.status === 401) {
                          const j = await res.json().catch(() => ({}))
                          setNickError(
                            j.error || "Player has disabled API access"
                          )
                        } else if (res.status === 404) {
                          const j = await res.json().catch(() => ({}))
                          setNickError(j.error || "User not found")
                        } else {
                          const j = await res.json().catch(() => ({}))
                          setNickError(j.error || `Error: ${res.status}`)
                        }
                      } catch (err) {
                        setNickError("Network error")
                      } finally {
                        setLoadingNick(false)
                      }
                    })()
                  }
                }}
              />

              <Button
                disabled={loadingNick}
                onClick={async () => {
                  const value = nick.trim()
                  if (!value) return
                  setLoadingNick(true)
                  setNickError(null)
                  try {
                    const res = await fetch(
                      `https://api.minebox.co/data/${encodeURIComponent(value)}`
                    )
                    if (res.ok) {
                      const j = await res.json().catch(() => ({}))
                      const id = j.id || j.uuid || j.player?.id || j.data?.id
                      const lvl = j.level || j.player?.level || j.data?.level
                      if (id && typeof id === "string") {
                        try {
                          localStorage.setItem("minebox_id", id)
                        } catch (e) {
                          /* ignore */
                        }
                        setPlayerId(id)
                      }
                      if (typeof lvl !== "undefined" && lvl !== null)
                        setPlayerLevel(Number(lvl))
                      localStorage.setItem("minebox_nick", value)
                      setStoredNick(value)
                      setNickError(null)
                    } else if (res.status === 401) {
                      const j = await res.json().catch(() => ({}))
                      setNickError(j.error || "Player has disabled API access")
                    } else if (res.status === 404) {
                      const j = await res.json().catch(() => ({}))
                      setNickError(j.error || "User not found")
                    } else {
                      const j = await res.json().catch(() => ({}))
                      setNickError(j.error || `Error: ${res.status}`)
                    }
                  } catch (err) {
                    setNickError("Network error")
                  } finally {
                    setLoadingNick(false)
                  }
                }}
              >
                {loadingNick ? "Loading..." : "Load Data"}
              </Button>
            </PopoverContent>
          </Popover>

          {/*
          <Button size="lg" className="tracking-wider ml-2"><GlobeIcon className="mt-0.5" />Login with Discord </Button>
*/}
          <LanguageSwitcher />

          
          <span className="flex lg:hidden ">
            <Sheet>
              <SheetTrigger><MenuIcon className="size-6" strokeWidth={3} /></SheetTrigger>
              <SheetContent className="z-9999 from-secondary-lighter to-secondary pb-4" side="right">
                <SheetHeader className="pt-2">
                  <Link to="/" className="text-lg font-bold text-primary">
                    <img src="/media/logo.png" className="w-1/2 mx-auto" />
                  </Link>
                </SheetHeader>
                <span className="scroll-fade overflow-y-auto custom-scrollbar gap-2 flex flex-col px-4 pr-2 mr-2">

                    {NAV_LINKS.map((link) => {
                      if (isDropdown(link)) {
                        return (
                          <>
                            {link.items.map((sub) => {
                              return (
                                <Link to={sub.to} className="group gap-2 flex w-full flex-row items-center justify-start bg-card rounded p-2 py-2">
                                  <sub.icon strokeWidth={2.5} className="size-8" />
                                  <p className="text-primary text-[0.9rem] uppercase leading-none text-center">{sub.label}</p>
                                </Link>
                              )
                            })}

                          </>
                        )
                      } else {
                        return (
                          <Link to={link.to} className="group gap-2 flex w-full flex-row items-center justify-start bg-card rounded p-2 py-2">
                            <link.icon strokeWidth={2.5} className="size-8" />
                            <p className="text-primary text-[0.9rem] uppercase leading-none text-center">{link.label}</p>
                          </Link>
                        )
                      }
                    })}
                </span>
              </SheetContent>
            </Sheet>
          </span>
        </span>
      </div>
    </nav>
  )
}
