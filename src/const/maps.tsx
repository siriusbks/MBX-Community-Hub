export const mapsConfig: Record<
  string,
  {
    translatePrefix: string
    subdomain: string

    level: number
    command?: string
    players?: { min: number; max: number }
    duration?: number

    zoneKey: string
    group: string

    image: string
    width: number
    height: number
    referencePoint: { x: number; y: number }
    iconScale: { min: number; max: number }
    mapZoom: { min: number; max: number }
    scaleIconMultiplier: number,
  }
> = {
  island_home: {
    level: 0,
    command: "/is",

    zoneKey: "",
    group: "player_islands",

    image: "/media/maps/home_island_map.png",
    width: 320,
    height: 320,
    referencePoint: { x: 34, y: 284 },
    iconScale: { min: 1.25, max: 2 },
    mapZoom: { min: 1.4, max: 3 },
    scaleIconMultiplier: 1,
  },
  island_nether: {
    level: 20,
    command: "/isn",

    zoneKey: "",
    group: "player_islands",

    image: "/media/maps/island_nether_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    iconScale: { min: 1.2, max: 2.5 },
    mapZoom: { min: 2, max: 3 },
    scaleIconMultiplier: 1,
  },
  island_end: {
    level: 40,
    command: "/ise",

    zoneKey: "",
    group: "player_islands",

    image: "/media/maps/island_end_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    iconScale: { min: 1.25, max: 2.5 },
    mapZoom: { min: 1.5, max: 3 },
    scaleIconMultiplier: 1,
  },
  village: {
    level: 0,
    command: "/v",

    zoneKey: "",
    group: "player_islands",

    image: "/media/maps/island_end_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    iconScale: { min: 1.25, max: 2.5 },
    mapZoom: { min: 1.5, max: 3 },
    scaleIconMultiplier: 1,
  },


  spawn: {
    level: 0,
    command: "/spawn",

    zoneKey: "overworld",
    group: "exploration",

    image: "/media/maps/spawn_map.png",
    width: 791,
    height: 839,
    referencePoint: { x: 220, y: 388 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  island_tropical: {
    level: 0,
    command: "/is island_tropical",

    zoneKey: "island_tropical",
    group: "exploration",

    image: "/media/maps/island_tropical_map.png",
    width: 528,
    height: 528,
    referencePoint: { x: 0, y: 0 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0.2, max: 3 },
    scaleIconMultiplier: 0.5,
  },
  island_plain: {
    level: 10,
    command: "/is island_plain",
    zoneKey: "island_plain",
    group: "exploration",

    image: "/media/maps/island_plain_map.png",
    width: 608,
    height: 560,
    referencePoint: { x: 81, y: 16 },
    iconScale: { min: 1, max: 2 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },
  island_bamboo: {
    level: 20,
    command: "/is island_bamboo",

    zoneKey: "island_bamboo",
    group: "exploration",

    image: "/media/maps/island_bamboo_map.png",
    width: 1256,
    height: 608,
    referencePoint: { x: 633, y: 611 },
    iconScale: { min: 1.2, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },
  island_snow: {
    level: 30,
    command: "/is island_snow",

    zoneKey: "island_snow",
    group: "exploration",

    image: "/media/maps/island_snow_map.png",
    width: 720,
    height: 720,
    referencePoint: { x: 129, y: 64 },
    iconScale: { min: 1.2, max: 2 },
    mapZoom: { min: 0, max: 2.5 },
    scaleIconMultiplier: 0.7,
  },
  island_desert: {
    level: 40,
    command: "/is island_desert",

    zoneKey: "island_desert",
    group: "exploration",

    image: "/media/maps/island_desert_map.png",
    width: 752,
    height: 752,
    referencePoint: { x: 128, y: 720 },
    iconScale: { min: 1, max: 2 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.7,
  },


  maya_temple: {
    level: 15,
    players: { min: 1, max: 5 },
    duration: 10,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_maya_temple_map.png",
    width: 128,
    height: 128,
    referencePoint: { x: 64, y: -12 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  shaft: {
    level: 18,
    players: { min: 1, max: 5 },
    duration: 25,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_shaft_map.png",
    width: 180,
    height: 180,
    referencePoint: { x: -129, y: 341 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  pirate_temple: {
    level: 20,
    players: { min: 1, max: 5 },
    duration: 10,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_pirate_temple_map.png",
    width: 192,
    height: 192,
    referencePoint: { x: 0, y: 0 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  goblin: {
    level: 25,
    players: { min: 1, max: 5 },
    duration: 20,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_goblin_map.png",
    width: 630,
    height: 270,
    referencePoint: { x: 208, y: 250 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  field_island: {
    level: 25,
    players: { min: 1, max: 5 },
    duration: 20,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_field_island_map.png",
    width: 500,
    height: 500,
    referencePoint: { x: 250, y: 253 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  nether: {
    level: 30,
    players: { min: 1, max: 5 },
    duration: 20,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_nether_map.png",
    width: 480,
    height: 302,
    referencePoint: { x: 178, y: 498 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  canyon: {
    level: 30,
    players: { min: 1, max: 5 },
    duration: 25,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_canyon_map.png",
    width: 500,
    height: 500,
    referencePoint: { x: 250, y: 253 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  summer: {
    level: 30,
    players: { min: 1, max: 5 },
    duration: 30,

    zoneKey: "overworld",
    group: "raids",

    image: "/media/maps/spawn_map.png",
    width: 791,
    height: 839,
    referencePoint: { x: 220, y: 388 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  orc: {
    level: 35,
    players: { min: 1, max: 5 },
    duration: 20,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_orc_map.png",
    width: 720,
    height: 430,
    referencePoint: { x: 229, y: 452 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  pyramid: {
    level: 35,
    players: { min: 1, max: 5 },
    duration: 20,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_pyramid_map.png",
    width: 340,
    height: 350,
    referencePoint: { x: -90, y: 540 },
    iconScale: { min: 0, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  volcan: {
    level: 35,
    players: { min: 1, max: 5 },
    duration: 15,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_volcan_map.png",
    width: 256,
    height: 256,
    referencePoint: { x: 128, y: 128 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 1.2, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  mushroom: {
    level: 45,
    players: { min: 1, max: 5 },
    duration: 25,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_mushroom_map.png",
    width: 425,
    height: 450,
    referencePoint: { x: 194, y: 234 },
    iconScale: { min: 0, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
  north: {
    level: 55,
    players: { min: 1, max: 5 },
    duration: 25,

    zoneKey: "raids",
    group: "raids",

    image: "/media/maps/raid_north_map.png",
    width: 600,
    height: 760,
    referencePoint: { x: 176, y: 806 },
    iconScale: { min: 1, max: 2.5 },
    mapZoom: { min: 0, max: 3 },
    scaleIconMultiplier: 0.4,
  },
}