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
  Album,
} from "lucide-react"
import { useTranslation } from 'react-i18next';

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

export const useNavLinks = (): NavItem[] => {
  const { t } = useTranslation("mainpage");

  return [
    {
      id: "maps",
      to: "/maps",
      icon: Map,
      label: t("mainpage.features.maps.title"),
      desc: t("mainpage.features.maps.description"),
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
          label: t("mainpage.features.items.title"),
          desc: t("mainpage.features.items.description"),
        },
        {
          id: "bestiary",
          to: "/bestiary",
          icon: PawPrintIcon,
          label: t("mainpage.features.bestiary.title"),
          desc: t("mainpage.features.bestiary.description"),
        },
        {
          id: "ships",
          to: "/ships",
          icon: Sailboat,
          label: t("mainpage.features.ships.title"),
          desc: t("mainpage.features.ships.description"),
        },
        {
          id: "classes",
          to: "/classes",
          icon: SwordsIcon,
          label: t("mainpage.features.classes.title"),
          desc: t("mainpage.features.classes.description"),
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
          label: t("mainpage.features.equipment.title"),
          desc: t("mainpage.features.equipment.description"),
          badge: "Soon",
        },
        {
          id: "museum",
          to: "/tools/museum",
          icon:Album,
          label: t("mainpage.features.museum.title"),
          desc: t("mainpage.features.museum.description"),
          badge: "Soon",
        },
        {
          id: "collections",
          to: "/tools/collections",
          icon: Archive,
          label: t("mainpage.features.collections.title"),
          desc: t("mainpage.features.collections.description"),
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
          label: t("mainpage.features.action-house.title"),
          desc: t("mainpage.features.action-house.description"),
        },
        {
          id: "bazaar",
          to: "/market/bazaar",
          icon: Tent,
          label: t("mainpage.features.bazaar.title"),
          desc: t("mainpage.features.bazaar.description"),
        },
        {
          id: "gem-exchange",
          to: "/market/gem-exchange",
          icon: Gem,
          label: t("mainpage.features.gem-exchange.title"),
          desc: t("mainpage.features.gem-exchange.description"),
        },
      ],
    },
    {
      id: "community",
      to: "/community",
      icon: Box,
      label: t("mainpage.features.community.title"),
      desc: t("mainpage.features.community.description"),
    },
    {
      id: "profile",
      to: "/profile",
      icon: User,
      label: t("mainpage.features.profile.title"),
      desc: t("mainpage.features.profile.description"),
      matchPrefix: "/profile",
    },
    {
      id: "votes",
      to: "/votes",
      icon: VoteIcon,
      label: t("mainpage.features.votes.title"),
      desc: t("mainpage.features.votes.description"),
    },
  ];
};
