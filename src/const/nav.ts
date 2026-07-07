import {
  BookOpen,
  Map,
  Box,
  type LucideIcon,
  Sailboat,
  PawPrintIcon,
  SwordsIcon,
  ShapesIcon,
  VoteIcon,
  Wrench,
  Anvil,
  Archive,
  Store,
  Gavel,
  Tent,
  Gem,
  User,
} from "lucide-react"

export type NavDropdownItem = {
  id: string
  to: string
  icon: LucideIcon
  label: string
  desc: string
  badge?: string
}

export type NavDropdown = {
  id: string
  dropdown: true
  icon: LucideIcon
  label: string
  items: NavDropdownItem[]
}
export type NavLink = {
  id: string
  dropdown?: false
  to: string
  icon: LucideIcon
  label: string
  desc: string
  matchPrefix?: string
}

export type NavItem = NavLink | NavDropdown

export const NAV_LINKS: NavItem[] = [
  {
    id: "maps",
    to: "/maps",
    icon: Map,
    label: "Maps",
    desc: "Explore the world of Minebox",
    matchPrefix: "/maps",
  },
  {
    id: "codex",
    dropdown: true,
    icon: BookOpen,
    label: "Codex",
    items: [
      {
        id: "items",
        to: "/items",
        icon: ShapesIcon,
        label: "Items",
        desc: "Browse all items in the game",
      },
      {
        id: "bestiary",
        to: "/bestiary",
        icon: PawPrintIcon,
        label: "Bestiary",
        desc: "Discover all creatures and monsters",
      },
      {
        id: "ships",
        to: "/ships",
        icon: Sailboat,
        label: "Ships",
        desc: "Explore the seas and discover new ships",
      },
      {
        id: "classes",
        to: "/classes",
        icon: SwordsIcon,
        label: "Classes",
        desc: "Learn about different character classes",
      },
    ],
  },
  {
    id: "tools",
    dropdown: true,
    icon: Wrench,
    label: "Tools",
    items: [
      {
        id: "equipment",
        to: "/tools/equipment-builder",
        icon: Anvil,
        label: "Equipment Builder",
        desc: "Build and customize your equipment",
        badge: "Soon",
      },
      {
        id: "collections",
        to: "/tools/collections",
        icon: Archive,
        label: "Collections",
        desc: "Manage your item collections",
      },
    ],
  },
  {
    id: "market",
    dropdown: true,
    icon: Store,
    label: "Market",
    items: [
      {
        id: "action-house",
        to: "/market/action-house",
        icon: Gavel,
        label: "Action House",
        desc: "Buy and sell items in the action house",
      },
      {
        id: "bazaar",
        to: "/market/bazaar",
        icon: Tent,
        label: "Bazaar",
        desc: "Trade items with other players",
      },
      {
        id: "gem-exchange",
        to: "/market/gem-exchange",
        icon: Gem,
        label: "Gem Exchange",
        desc: "Exchange gems for various items",
      },
    ],
  },
  {
    id: "community",
    to: "/community",
    icon: Box,
    label: "Community",
    desc: "Connect with the Minebox community",
  },
  {
    id: "profile",
    to: "/profile",
    icon: User,
    label: "Profile",
    desc: "View and edit your profile",
    matchPrefix: "/profile",
  },
  {
    id: "votes",
    to: "/votes",
    icon: VoteIcon,
    label: "Votes",
    desc: "Vote for your favorite features and content",
    
  },
]
