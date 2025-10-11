/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface BestiaryInfo {
    image?: string;
    name: string;
    minlevel: number;
    maxlevel: number;
}

export const mapNameTranslationKeys: Record<string, string> = {
    spawn: "mappage.maps.spawn_island.name",
    kokoko: "mappage.maps.kokoko_island.name",
    quadra_plains: "mappage.maps.quadra_plains.name",
    bamboo_peak: "mappage.maps.bamboo_peak.name",
    frostbite_fortress: "mappage.maps.frostbite_fortress.name",
    sandwhisper_dunes: "mappage.maps.sandwhisper_dunes.name",
};

export const bestiaryRegions: Record<string, string> = {
    universal: "mappage.maps.spawn.universal",
    exploration_island: "mappage.maps.spawn.exploration_island",
    italian_restaurant: "mappage.maps.spawn.italian_restaurant",
    church: "mappage.maps.spawn.church",

    beach: "mappage.maps.kokoko.beach",
    jungle: "mappage.maps.kokoko.jungle",
    dark_jungle: "mappage.maps.kokoko.dark_jungle",
    burned_jungle: "mappage.maps.kokoko.burned_jungle",

    plains: "mappage.maps.quadra_plains.plains",
    swamp: "mappage.maps.quadra_plains.swamp",
    savenna: "mappage.maps.quadra_plains.savenna",
    mystic_forest: "mappage.maps.quadra_plains.mystic_forest",

    bamboo_plains: "mappage.maps.bamboo_peak.bamboo_plains",
    cherry_forest: "mappage.maps.bamboo_peak.cherry_forest",
    bamboo_jungle: "mappage.maps.bamboo_peak.bamboo_jungle",
    divine_mountains_low: "mappage.maps.bamboo_peak.divine_mountains_low",
    divine_mountains_up: "mappage.maps.bamboo_peak.divine_mountains_up",

    snow_plains: "mappage.maps.frostbite_fortress.snow_plains",
    snow_forest: "mappage.maps.frostbite_fortress.snow_forest",
    glacier: "mappage.maps.frostbite_fortress.glacier",
    steampunk_village: "mappage.maps.frostbite_fortress.steampunk_village",

    desert: "mappage.maps.sandwhisper_dunes.desert",
    desert_village: "mappage.maps.sandwhisper_dunes.desert_village",
    pyramid: "mappage.maps.sandwhisper_dunes.pyramid",
    canyon: "mappage.maps.sandwhisper_dunes.canyon",
};

export const bestiaryData: Record<string, Record<string, BestiaryInfo[]>> = {
    spawn: {},
    kokoko: {
        beach: [
            {
                name: "bestiary.blue_starfish",
                image: "assets/media/bestiary/kokoko_island/blue_starfish.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.orange_starfish",
                image: "assets/media/bestiary/kokoko_island/orange_starfish.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.cat_goofish",
                image: "assets/media/bestiary/kokoko_island/cat_goofish.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.clown_goofish",
                image: "assets/media/bestiary/kokoko_island/clown_goofish.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.hammershark_goofish",
                image: "assets/media/bestiary/kokoko_island/hammershark_goofish.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.crabician",
                image: "assets/media/bestiary/kokoko_island/crabician.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.craboxer",
                image: "assets/media/bestiary/kokoko_island/craboxer.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.coconut_warrior",
                image: "assets/media/bestiary/kokoko_island/coconut_warrior.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.coconut_magician",
                image: "assets/media/bestiary/kokoko_island/coconut_magician.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
        jungle: [
            {
                name: "bestiary.monkey",
                image: "assets/media/bestiary/kokoko_island/monkey.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.monkey_banana",
                image: "assets/media/bestiary/kokoko_island/monkey_banana.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.monkey_barrel",
                image: "assets/media/bestiary/kokoko_island/monkey_barrel.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.monkey_mage",
                image: "assets/media/bestiary/kokoko_island/monkey_mage.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.moskitoko",
                image: "assets/media/bestiary/kokoko_island/moskitoko.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.jungle_ogre",
                image: "assets/media/bestiary/boss/jungle_ogre.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
        burned_jungle: [
            {
                name: "bestiary.monkey_ghost",
                image: "assets/media/bestiary/kokoko_island/monkey_ghost.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.scavenger_vulture",
                image: "assets/media/bestiary/kokoko_island/scavenger_vulture.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.spicy_lava_bucket",
                image: "assets/media/bestiary/kokoko_island/spicy_lava_bucket.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.debris_golem",
                image: "assets/media/bestiary/kokoko_island/debris_golem.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
    },
    quadra_plains: {
        plains: [
            {
                name: "bestiary.spidey",
                image: "assets/media/bestiary/quadra_plains/spidey.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.venomous_spidey",
                image: "assets/media/bestiary/quadra_plains/venomous_spidey.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.scarecrow",
                image: "assets/media/bestiary/quadra_plains/scarecrow.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.pirate_farmer",
                image: "assets/media/bestiary/quadra_plains/pirate_farmer.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.old_pirate_farmer",
                image: "assets/media/bestiary/quadra_plains/old_pirate_farmer.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
        swamp: [
            {
                name: "bestiary.boogoo",
                image: "assets/media/bestiary/quadra_plains/boogoo.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.fungoo_dancer",
                image: "assets/media/bestiary/quadra_plains/fungoo_dancer.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.sporelord",
                image: "assets/media/bestiary/quadra_plains/sporelord.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.logzilla",
                image: "assets/media/bestiary/boss/logzilla.png",
                minlevel: 50,
                maxlevel: 60,
            },
        ],
    },
    bamboo_peak: {
        bamboo_plains: [
            {
                name: "bestiary.bloomboo",
                image: "assets/media/bestiary/bamboo_peak/bloomboo.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.bambooboo",
                image: "assets/media/bestiary/bamboo_peak/bambooboo.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.pandaboo_warrior",
                image: "assets/media/bestiary/bamboo_peak/pandaboo_warrior.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.pandaboo_wizard",
                image: "assets/media/bestiary/bamboo_peak/pandaboo_wizard.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
    },
    frostbite_fortress: {
        snow_plains: [
            {
                name: "bestiary.froztail",
                image: "assets/media/bestiary/frostbite_fortress/froztail.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.froztail_magus",
                image: "assets/media/bestiary/frostbite_fortress/froztail_magus.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.frozehound",
                image: "assets/media/bestiary/frostbite_fortress/frozehound.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.chillolith",
                image: "assets/media/bestiary/frostbite_fortress/chillolith.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.snow_ogre",
                image: "assets/media/bestiary/boss/snow_ogre.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
    },
    sandwhisper_dunes: {
        desert: [
            {
                name: "bestiary.sandoodle",
                image: "assets/media/bestiary/sandwhisper_dunes/sandoodle.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.scorchfang",
                image: "assets/media/bestiary/sandwhisper_dunes/scorchfang.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.pokeboo",
                image: "assets/media/bestiary/sandwhisper_dunes/pokeboo.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.dunebeard",
                image: "assets/media/bestiary/sandwhisper_dunes/dunebeard.png",
                minlevel: 1,
                maxlevel: 5,
            },
            {
                name: "bestiary.desert_ogre",
                image: "assets/media/bestiary/boss/desert_ogre.png",
                minlevel: 1,
                maxlevel: 5,
            },
        ],
    },
};
