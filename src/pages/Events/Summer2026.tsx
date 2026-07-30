import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { Separator } from "@components/ui/separator"
import { FindItemName, FindItemRarity, ItemImage } from "@const/elements"
import { GetRarityColor, RarityBadge, RarityBorder } from "@const/rarities"
import {
  CalendarDays,
  StarIcon,
  ShellIcon,
  TreePalmIcon,
  FishIcon,
  ToolboxIcon,
  LandmarkIcon,
  BookOpenIcon,
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

function EventMissionElement({
  stars,
  children,
}: {
  stars: number
  children: React.ReactNode
}) {
  return (
    <span className="my-1 mt-1 flex flex-row items-center justify-between border-b-muted-foreground/20 px-2 py-0.5 pt-1 text-xs">
      <p className="flex flex-row items-center gap-1 text-[0.7rem] leading-none font-thin text-foreground/80">
        {children}
      </p>
      <p className="flex items-center gap-1 text-primary drop-shadow-[0_1px_0_#5d3a00]">
        {stars}{" "}
        <img
          src="/media/other/summer2026_shell.png"
          alt="Shell"
          className="inline-block size-4 [image-rendering:pixelated]"
        />
      </p>
    </span>
  )
}

function EventTitleElement({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <span className="mt-8 flex flex-col gap-2">
      <p className="flex items-center gap-1 text-2xl leading-none text-primary drop-shadow-[0_2px_0_#5d3a00]">
        <Icon className="size-6" /> {title}
      </p>
      <p className="w-1/2 text-xs leading-tight text-muted-foreground">
        {description}
      </p>
    </span>
  )
}

const FEATURE_ITEMS = [
  {
    title: "Spawn Island Raid",
    description:
      "fight through districts of rising difficulty, solve the puzzles to crack open the locked zones, then extract before time runs out. It's the biggest expedition map so far!",
    icon: TreePalmIcon,
  },
  {
    title: "SHELLS & BATTLEPASS",
    description:
      "Everything summer pays out in shells, the seasonal currency. Clear weekly missions (fish the warm sea, craft ice cream, hunt crabs and more) to stack shells and lottery tickets and climb the Summer Battlepass.",
    icon: ShellIcon,
  },
  {
    title: "SUMMER STORYLINE AND MISSIONS",
    description:
      "Four beach locals send you all over the island: Captain Barnacle, Kai the artisan, Nalu and Zen. Their questlines are packed with exclusive summer gear and rewards.",
    icon: BookOpenIcon,
  },
  {
    title: "NEW CATCHES & SHOALS",
    description:
      "30 new fish to reel in from fresh coastal shoals: jellyfish, seahorses, starfish, crabs and more.",
    icon: FishIcon,
  },
  {
    title: "BEACH WORKSHOPS & CRAFTS",
    description:
      "New beach workshops: cook seafood dishes (seahorse salad, jellyfish smoothie, starfish skewer), churn ice cream, and craft a whole new line of summer items and armor sets",
    icon: ToolboxIcon,
  },
  {
    title: "SUMMER MUSEUM",
    description:
      "A hidden seasonal collection: donate the 45+ summer items to complete it and claim 2 mythic + 2 legendary keys",
    icon: LandmarkIcon,
  },
]

const newItems = [
  "paint_awake",
  "paint_coastal_path",
  "paint_guiding_glow",
  "paint_hidden_enderman",
  "paint_pineapple_house",
  "paint_red_tower",
  "paint_sea_wave",
  "paint_sunset",
  "crab_seashell",
  "octopus_backpack",
  "jungles_heart_bow",
  "summer_candy",
  "jungles_heart_chestplate",
  "crab_ceviche",
  "fruit_smoothie",
  "jellyfish_smoothie",
  "lemonade",
  "seahorse_salad",
  "starfish_skewer",
  "strawberry_lemonade",
  "crab_claw",
  "harvester_jungles_heart",
  "crab_hat",
  "jungles_heart_helmet",
  "octopus_hat",
  "delesseria",
  "lotus_leaf",
  "pearl_black",
  "pearl_large",
  "rusty_hook",
  "sunken_coin_copper",
  "sunken_coin_gold",
  "sunken_coin_silver",
  "wet_rope",
  "mount_buggy_blue",
  "mount_buggy_green",
  "mount_buggy_orange",
  "mount_buggy_red",
  "mount_buggy_yellow",
  "pet_ghastling",
  "octopus_staff",
  "fish_amber_bell_jellyfish",
  "fish_azure_frog",
  "fish_azure_seahorse",
  "fish_azure_starfish",
  "fish_blue_jellyfish",
  "fish_bluefin_tuna",
  "fish_coastal_snail",
  "fish_copper_seahorse",
  "fish_copper_starfish",
  "fish_coral_starfish",
  "fish_golden_seahorse",
  "fish_goldfin_jellyfish",
  "fish_humpback_perch",
  "fish_ink_seahorse",
  "fish_lilac_starfish",
  "fish_pink_jellyfish",
  "fish_pink_seahorse",
  "fish_pool_frog",
  "fish_reed_snail",
  "fish_roach",
  "fish_rose_starfish",
  "fish_ruby_veil_jellyfish",
  "fish_sand_goby",
  "fish_sandy_starfish",
  "fish_scarlet_seahorse",
  "fish_sockeye_salmon",
  "fish_spotted_cod",
  "fish_thief_crab",
  "fish_violet_drifter_jellyfish",
  "jungles_heart_boots",
  "jungles_heart_leggings",
  "jungles_heart_sword",
  "summer_lottery_ticket",
  "water_gun_1",
  "water_gun_2",
  "water_gun_3",
]

const shopItems = {
  summer_candy: 35,
  disc_beach_fight: 25,
  balloon_crab: 30,
  gloves_octopus_grip: 100,
  water_gun_1: 30,
  emote_crossed_arms: 25,
  disc_beach: 25,
  mount_buggy_blue: 140,
  emote_guitar: 50,
  popsicle_hat: 20,
  gloves_crab_claws: 40,
  crab_hat: 35,
}

const lotteryDrops = {
  summer_candy: 5.25,
  pirate_barrel: 3.75,
  pirate_barrel_battered: 3.75,
  pirate_coin_pile: 3.75,
  pirate_balance: 3.75,
  pirate_banner: 3.75,
  pirate_emblem: 3.75,
  pirate_gold_pile_small: 3.75,
  lemonade_crate: 3.75,
  trampoline_turquoise: 3,
  trampoline_pink: 3,
  trampoline_red: 3,
  trampoline_orange: 3,
  pirate_gem_pile: 2.25,
  pirate_hourglass: 2.25,
  pirate_shark_plaque: 2.25,
  pirate_gold_pile_large: 2.25,
  pirate_helm_wall: 2.25,
  pirate_helm_floor: 2.25,
  pirate_treasure_map: 2.25,
  lemonade_dispenser: 2.25,
  lemonade_balloon_post: 2.25,
  paint_coastal_path: 2.25,
  paint_sunset: 2.25,
  paint_sea_wave: 1.87,
  paint_awake: 1.87,
  paint_red_tower: 1.87,
  crab_hat: 1.87,
  crab_seashell: 1.87,
  crab_claw: 1.87,
  paint_pineapple_house: 1.31,
  lemonade_stand: 1.12,
  mount_buggy_blue: 1.1,
  pirate_buddelschiff: 0.75,
  pirate_treasure_chest_decor: 0.75,
  paint_guiding_glow: 0.75,
  jungles_heart_helmet: 0.75,
  jungles_heart_chestplate: 0.75,
  jungles_heart_leggings: 0.75,
  jungles_heart_boots: 0.75,
  jungles_heart_sword: 0.75,
  jungles_heart_bow: 0.75,
  harvester_jungles_heart: 0.75,
  octopus_hat: 0.75,
  octopus_backpack: 0.75,
  octopus_staff: 0.75,
  water_gun_2: 0.75,
  mount_buggy_green: 0.75,
  paint_hidden_enderman: 0.37,
  water_gun_3:0.37,
  mount_buggy_yellow: 0.37,
  pet_ghastling: 0.37,
  mount_buggy_orange: 0.18,
  mount_buggy_red: 0.09,
}

export function Summer2026EventPage() {
  return (
    <div className="py-auto relative page-container flex flex-col pb-16">
      <div className="absolute top-0 -z-1 aspect-21/9 w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />

      <PageTitle
        title="Summer Event"
        description="Join us for the Summer event!"
      />

      {/* Event Cards Section */}
      <span className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {FEATURE_ITEMS.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="flex flex-col justify-center gap-2 p-0">
            <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/40 px-2 py-3 text-xs">
              <Icon className="size-8 rounded-md bg-primary p-1.5 text-primary-foreground minebox-shadow" />
              <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                {title}
              </p>
            </span>
            <span className="flex h-full flex-col items-center justify-center px-2 pb-2">
              <p className="leading-tight">{description}</p>
            </span>
          </Card>
        ))}
      </span>

      {/* Event Missions Section */}
      <EventTitleElement
        title="Event Missions"
        description="Complete the following missions to earn rewards during the Summer 2026 event."
        icon={CalendarDays}
      />
      <span className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <span className="flex flex-col rounded-md bg-gradient-to-b from-card to-card-dark minebox-shadow min-h-48">
          {/* Quests - Title */}
          <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/50 px-3 py-2 pt-3 text-xs">
            <span className="flex flex-row items-center gap-2 px-0">
              <CalendarDays className="size-10 rounded-md bg-primary p-1.5 text-primary-foreground shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d]" />
              <span className="mb-1 flex flex-col -space-y-1">
                <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                  Week 1
                </p>
                <p className="text-xs">25.07 - 31.07</p>
              </span>
            </span>
          </span>
          <EventMissionElement stars={2}>
            Break washed-up bottles on the beach [50]
          </EventMissionElement>
          <EventMissionElement stars={3}>
            Seahorse collection [64]
          </EventMissionElement>
          <EventMissionElement stars={2}>
            Eat{" "}
            <Link to="/items?id=lemonade" className="text-[#ed15f1]">
              LEMONADE
            </Link>[4]
          </EventMissionElement>
          <EventMissionElement stars={2}>
            Fish the wanm sea shoals [4]
          </EventMissionElement>
          <EventMissionElement stars={2}>
            Craft ice creams at the galeto workshop [16]
          </EventMissionElement>
          <EventMissionElement stars={2}>
            Slain{" "}
            <Link to="/bestiary?id=craboxer" className="text-primary">
              Craboxer
            </Link>
            [16]
          </EventMissionElement>
          <span className="flex h-12 flex-row items-center justify-between border-t-2 bg-secondary/20 px-2 py-3 text-xs">
            <p>Weekly Rewards:</p>
            <span>
              <p className="flex items-center gap-0.5 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                <Link to="/items?id=coconut_hat">
                  <ItemImage itemId="coconut_hat" className="size-6" />
                </Link>
                <Separator
                  orientation="vertical"
                  className="mx-1 h-4 bg-card"
                />
                5{" "}
                <img
                  src="/media/other/summer2026_shell.png"
                  alt="Shell"
                  className="inline-block size-5 [image-rendering:pixelated]"
                />
              </p>
            </span>
          </span>
        </span>

        <span className="flex flex-col rounded-md bg-gradient-to-b from-card to-card-dark minebox-shadow min-h-48">
          {/* Quests - Title */}
          <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/50 px-3 py-2 pt-3 text-xs">
            <span className="flex flex-row items-center gap-2 px-0">
              <CalendarDays className="size-10 rounded-md bg-primary p-1.5 text-primary-foreground shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d]" />
              <span className="mb-1 flex flex-col -space-y-1">
                <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                  Week 2
                </p>
                <p className="text-xs">01.08 - 07.08</p>
              </span>
            </span>
          </span>
          <p className="my-auto p-2 text-center text-xs text-muted-foreground">
            Wait for details...
          </p>
          <span className="flex h-12 flex-row items-center justify-between border-t-2 bg-secondary/20 px-2 py-3 text-xs">
            <p>Weekly Rewards:</p>
            <span>
              <p className="flex items-center gap-0.5 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                ???
              </p>
            </span>
          </span>
        </span>

        <span className="flex flex-col rounded-md bg-gradient-to-b from-card to-card-dark minebox-shadow min-h-48">
          {/* Quests - Title */}
          <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/50 px-3 py-2 pt-3 text-xs">
            <span className="flex flex-row items-center gap-2 px-0">
              <CalendarDays className="size-10 rounded-md bg-primary p-1.5 text-primary-foreground shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d]" />
              <span className="mb-1 flex flex-col -space-y-1">
                <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                  Week 3
                </p>
                <p className="text-xs">08.08 - 14.08</p>
              </span>
            </span>
          </span>
          <p className="my-auto p-2 text-center text-xs text-muted-foreground">
            Wait for details...
          </p>
          <span className="flex h-12 flex-row items-center justify-between border-t-2 bg-secondary/20 px-2 py-3 text-xs">
            <p>Weekly Rewards:</p>
            <span>
              <p className="flex items-center gap-0.5 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                ???
              </p>
            </span>
          </span>
        </span>

        <span className="flex flex-col rounded-md bg-gradient-to-b from-card to-card-dark minebox-shadow min-h-48">
          {/* Quests - Title */}
          <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/50 px-3 py-2 pt-3 text-xs">
            <span className="flex flex-row items-center gap-2 px-0">
              <CalendarDays className="size-10 rounded-md bg-primary p-1.5 text-primary-foreground shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d]" />
              <span className="mb-1 flex flex-col -space-y-1">
                <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                  Week 4
                </p>
                <p className="text-xs">15.08 - 21.08</p>
              </span>
            </span>
          </span>
          <p className="my-auto p-2 text-center text-xs text-muted-foreground">
            Wait for details...
          </p>
          <span className="flex h-12 flex-row items-center justify-between border-t-2 bg-secondary/20 px-2 py-3 text-xs">
            <p>Weekly Rewards:</p>
            <span>
              <p className="flex items-center gap-0.5 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                ???
              </p>
            </span>
          </span>
        </span>

        <span className="flex flex-col rounded-md bg-gradient-to-b from-card to-card-dark minebox-shadow min-h-48">
          {/* Quests - Title */}
          <span className="flex flex-row items-center gap-2 border-b-2 bg-secondary/50 px-3 py-2 pt-3 text-xs">
            <span className="flex flex-row items-center gap-2 px-0">
              <CalendarDays className="size-10 rounded-md bg-primary p-1.5 text-primary-foreground shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d]" />
              <span className="mb-1 flex flex-col -space-y-1">
                <p className="text-lg text-primary drop-shadow-[0_2px_0_#5d3a00]">
                  Final Week
                </p>
                <p className="text-xs">22.08 - 28.08</p>
              </span>
            </span>
          </span>
          <p className="my-auto p-2 text-center text-xs text-muted-foreground">
            Wait for details...
          </p>
          <span className="flex h-12 flex-row items-center justify-between border-t-2 bg-secondary/20 px-2 py-3 text-xs">
            <p>Weekly Rewards:</p>
            <span>
              <p className="flex items-center gap-0.5 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                ???
              </p>
            </span>
          </span>
        </span>
      </span>

      {/* Event Battle Pass Section */}
      <EventTitleElement
        title="Event Battle Pass"
        description="Everything summer pays out in shells, the seasonal currency. Clear weekly missions (fish the warm sea, craft ice cream, hunt crabs and more) to stack shells and lottery tickets and climb the Summer Battlepass."
        icon={StarIcon}
      />
      <span className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {Object.entries(shopItems).map(([itemId, price]) => (
          <RarityBorder
            rarity={FindItemRarity({ itemId })}
            key={itemId}
            className="group"
            innerClassName="pt-4 items-center"
          >
            <ItemImage
              itemId={itemId}
              className="mx-auto aspect-square w-1/2 transition-transform duration-200 group-hover:scale-110"

              style={{
                filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId }))}40)`,
              }}
            />
            <RarityBadge rarity={FindItemRarity({ itemId })} className="mt-1" />
            <p className="mt-auto text-center text-xs leading-none">
              {FindItemName({ itemId })}
            </p>
            <p className="flex flex-row items-center gap-1 leading-none">
              {price}{" "}
              <img
                src="/media/other/summer2026_shell.png"
                alt="Shell"
                className="mt-1 inline-block size-6 [image-rendering:pixelated]"
              />
            </p>
          </RarityBorder>
        ))}
      </span>

      {/* Event Lottery Section */}
      <EventTitleElement
        title="Lottery Drops"
        description="Win tickets from the quests and weekly missions, then gamble them for exclusive summer loot: cosmetics, gear and keys."
        icon={StarIcon}
      />
      <span className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
        {Object.entries(lotteryDrops).map(([itemId, chance]) => (
          <RarityBorder
            rarity={FindItemRarity({ itemId })}
            key={itemId}
            className="group"
            innerClassName="pt-4 items-center gap-0"
          >
            <ItemImage
              itemId={itemId}
              className="mx-auto aspect-square w-1/2 transition-transform duration-200 group-hover:scale-110"
              style={{
                filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId }))}40)`,
              }}
            />
            <p className="mt-auto text-center text-xs leading-none">
              {FindItemName({ itemId })}
            </p>
            <span className="flex w-full flex-row items-center justify-between text-xs">
              <p className="mt-0.5 text-[0.65rem] text-muted-foreground uppercase">
                Chance
              </p>
              <p className="text-[0.75rem]">{chance}%</p>
            </span>
            <Link
              to={`/items?id=${itemId}`}
              className="text-center text-[0.6rem] text-muted-foreground uppercase hover:text-primary"
            >
              View item in Codex
            </Link>
          </RarityBorder>
        ))}
      </span>

      {/* Event New Items Section */}
      <EventTitleElement
        title="New Items"
        description="The following items will be added to the game during the Summer 2026 event."
        icon={CalendarDays}
      />
      <span className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {newItems.map((item) => (
          <RarityBorder
            rarity={FindItemRarity({ itemId: item })}
            key={item}
            className="group"
          >
            <ItemImage
              itemId={item}
              className="mx-auto aspect-square w-1/2 transition-transform duration-200 group-hover:scale-110"
              style={{
                filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: item }))}40)`,
              }}
            />
            <p className="mt-auto text-center text-xs leading-none">
              {FindItemName({ itemId: item })}
            </p>
            <Link
              to={`/items?id=${item}`}
              className="text-center text-[0.6rem] text-muted-foreground uppercase hover:text-primary"
            >
              View item in Codex
            </Link>
          </RarityBorder>
        ))}
      </span>
    </div>
  )
}

export default Summer2026EventPage
