/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Leaf, Ticket, Calendar, Box, Rat, LayoutList } from "lucide-react";
import { bestiaryData } from "@components/map/bestiaryData";
import {
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";

type HalloweenItem = {
    image: string;
    name: string;
    rarity:
        | "COMMON"
        | "RARE"
        | "EPIC"
        | "LEGENDARY"
        | "MYTHIC"
        | "UNCOMMON"
        | string;
};
type HalloweenItemChange = {
    image: string;
    name: string;
    rarity:
        | "COMMON"
        | "RARE"
        | "EPIC"
        | "LEGENDARY"
        | "MYTHIC"
        | "UNCOMMON"
        | "UNKNOWN";
    change: number;
};

const HalloweenContent: HalloweenItem[] = [
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.pet_mummy",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.pet_candy",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_corn",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_gumdrop",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_licorice",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_peppermint",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_pop",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_twist",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.pesticide",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.parasite",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.dirty_sheet",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.crow_feather",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_bag",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_sack",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.halloween_crate",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.vacuum",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_pumpkin_backpack",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_pumpkin_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.crow_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.demon_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.demon_wings",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.demon_scythe",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghost_cloak",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghost_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.jackolantern",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.kitty_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.kitty_tail",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.kitty_wand",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.old_witch_cloak",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.old_witch_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.old_witch_staff",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_wings",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_staff",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.witch_broom",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.witch_cauldron",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.witch_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_backpack",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_hat",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_chestplate",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_leggings",
        rarity: "UNKNOWN",
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_boots",
        rarity: "UNKNOWN",
    },
];

const HalloweenContentChange: HalloweenItemChange[] = [
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_lit",
        rarity: "EPIC",
        change: 4.5,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin",
        rarity: "EPIC",
        change: 4.5,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_stool",
        rarity: "EPIC",
        change: 4.5,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_table_lamp",
        rarity: "EPIC",
        change: 4.5,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_carpet",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_chandelier",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_couch",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_lamp",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_table",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/JELLY/jelly_legendary.png",
        name: "halloween.legendary_jelly",
        rarity: "LEGENDARY",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.candy_sack",
        rarity: "EPIC",
        change: 3.85,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_lit_big",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.mm-halloween_pumpkin_big",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_backpack",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_belt",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_boots",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_chestplate",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_hat",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.ghostbuster_leggings",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_hat",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_chestplate",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_leggings",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_boots",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_wings",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_staff",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.spooky_pumpkin_ring",
        rarity: "LEGENDARY",
        change: 3.53,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.pet_mummy",
        rarity: "LEGENDARY",
        change: 1.28,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.witch_broom",
        rarity: "MYTHIC",
        change: 0.64,
    },
];

const HalloweenPage: FC = () => {
    const { t } = useTranslation(["halloween", "bestiary"]);

    // Flatten bestiaryData and keep only entries marked for halloween2025
    const halloweenMobs = Object.values(bestiaryData)
        .flatMap((areaRecord) => Object.values(areaRecord))
        .flatMap((list) => list)
        .filter((info) => info.halloween2025);

    return (
        <div className="p-10 px-2 museum-page mx-auto rounded-lg ">
            {/* Header */}
            <div className="text-center mb-12">
                <Leaf className="mx-auto mb-2 h-16 w-16 text-orange-500 bg-opacity-20 bg-orange-500 p-3 rounded-lg" />
                <h1 className="text-4xl font-bold text-white mb-1">
                    {t("halloween.title")}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("halloween.subtitle")}
                </p>
                <div className="mt-4 h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Ticket className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        Battle Pass
                    </h1>
                </div>
            </div>

            <p className="text-xs">
                (Technically just an event but everyone is used to the term "battlepass")<br></br>
This event comes with a freshly developed and reimagined BattlePass system. We are super excited for you to try this new feature and give us your feedback and how we could improve for the next event!
            </p>
            <h4 className="text-sm text-orange-500 text-bold">⭐ Stars</h4>
            <p className="text-xs">Stars or Pass Stars are the BattlePass' currency used to buy items from the Shop.
You can earn free stars by completing missions and quests, there are more than 100 obtainable stars.
They can also be bought with Vote Points or Gems</p>
            <h4 className="text-sm text-orange-500 text-bold">🛒 Shop</h4>
            <p className="text-xs">Spend your Stars at the Shop, there you can buy the Halloween Crate or directly buy some exclusive items.</p>
            <h4 className="text-sm text-orange-500 text-bold">📜 Complete weekly missions</h4>
            <p className="text-xs">Every week, you get to unlock and complete 6 different missions for Stars.
Completing all missions grants you extra rewards.</p>
            <h4 className="text-sm text-orange-500 text-bold">📖 Quests</h4>
            <p className="text-xs">Complete questlines during the event for Stars and Candy sacks.</p>
            <h4 className="text-sm text-orange-500 text-bold">⚒️ Workshop</h4>
            <p className="text-xs">The BattlePass has it's own workshop where you can craft unique items such as the Candy Pet or the Candy Pumpkin armor set.
You can also craft the Halloween Crate with your candies.</p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 1</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">29.10.2025 - 05.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 2</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">06.11.2025 - 12.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 3</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">13.11.2025 - 19.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Final Week</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">20.11.2025 - 26.11.2025</p>
                </div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Box className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        Halloween Treasure
                    </h1>
                </div>
            </div>

            <p className="text-xs">
                Like every events on Minebox, this treasure is obtainable for
                FREE by crafting it with candies or by exchanging Vote Points
                for Pass Stars
            </p>
            <p className="text-xs">
                Exclusive Ghostbuster armor set, Exclusive Spooky Pumpkin armor
                set, Spooky Pumpkin Staff, Legendary pet: Bummy, Mythic flyable
                mount: Turbo Broom, Halloween-themed furniture & decorations for
                your island!
            </p>
            <p className="text-xs text-orange-500 font-bold">
                1 Halloween Treasure = 15 Battle Pass Stars
            </p>

            <div className="grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-2 gap-2 mt-4">
                {HalloweenContentChange.map((item, index) => (
                    <a
                        key={item.name + index}
                        className={`block w-full bg-gray-700 text-white p-3 rounded transition-colors hover:bg-gray-600 whitespace-nowrap text-center border-l-4 border-${item.rarity}`}
                    >
                        <span className="flex flex-col items-center gap-2">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                style={{
                                    imageRendering: "pixelated",
                                }}
                            />
                            <span className="w-full flex flex-col items-center leading-tight">
                                <span
                                    className={`text-xs bg-${item.rarity} px-2 rounded`}
                                >
                                    {item.rarity}
                                </span>
                                <span className={`font-bold text-sm w-full`}>
                                    {t(item.name)}
                                </span>
                                <span className={`text-xs`}>
                                    {item.change}%
                                </span>
                            </span>
                        </span>
                    </a>
                ))}
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Rat className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        New Mobs
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 gap-2 gap-2 mt-4">
                {halloweenMobs.map((mob, index) => (
                    <a
                        key={(mob.name || "mob") + index}
                        className={`block w-full bg-gray-700 text-white p-3 rounded transition-colors hover:bg-gray-600 whitespace-nowrap text-center border-l-4 border-UNKNOWN`}
                    >
                        <span className="flex flex-col items-center gap-2">
                            <img
                                src={
                                    mob.image ??
                                    "/assets/media/museum/not-found.png"
                                }
                                alt={mob.name}
                                className="h-16 w-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                style={{
                                    imageRendering: "pixelated",
                                }}
                            />
                            <span className="flex flex-col items-center leading-tight">
                                <span className="flex gap-1 items-center justify-center">
                                    <span
                                        className={`text-xs px-2 rounded ${LevelBG_Gradient(
                                            mob.minlevel
                                        )} ${LevelTextColor(mob.minlevel)}`}
                                    >{`LVL ${mob.minlevel}-${mob.maxlevel}`}</span>
                                    <span className={`font-bold text-sm`}>
                                        {t(mob.name, { ns: "bestiary" })}
                                    </span>
                                </span>

                                <span className="w-full mt-1 mb-0.5 bg-red-700/60 border-red-700/80 border text-[10px] rounded items-center align-middle flex">
                                    <span className="mx-auto">
                                        {mob.minhealth.toLocaleString()} -{" "}
                                        {mob.maxhealth.toLocaleString()}
                                    </span>
                                </span>
                                <span className="text-[11px] text-gray-300 flex justify-between">
                                    <span className="flex items-center min-w-10">
                                        {mob.fireResistant ?? 0}
                                        %
                                        <img
                                            src="assets/media/elemental/intelligence.png"
                                            className="h-3 w-3 inline ml-0.5"
                                        />
                                    </span>
                                    <span className="flex items-center min-w-10">
                                        {mob.waterResistant ?? 0}
                                        %
                                        <img
                                            src="assets/media/elemental/luck.png"
                                            className="h-3 w-3 inline ml-0.5"
                                        />
                                    </span>
                                    <span className="flex items-center min-w-10">
                                        {mob.airResistant ?? 0}
                                        %
                                        <img
                                            src="assets/media/elemental/agility.png"
                                            className="h-3 w-3 inline ml-0.5"
                                        />
                                    </span>
                                    <span className="flex items-center min-w-10">
                                        {mob.earthResistant ?? 0}
                                        %
                                        <img
                                            src="assets/media/elemental/strength.png"
                                            className="h-3 w-3 inline ml-0.5"
                                        />
                                    </span>
                                </span>
                            </span>
                        </span>
                    </a>
                ))}
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <LayoutList className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        New Content
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-2 gap-2 mt-4">
                {HalloweenContent.map((item, index) => (
                    <a
                        key={item.name + index}
                        className={`block w-full bg-gray-700 text-white p-3 rounded transition-colors hover:bg-gray-600 whitespace-nowrap text-center border-l-4 border-${item.rarity}`}
                    >
                        <span className="flex flex-col items-center gap-2">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                style={{
                                    imageRendering: "pixelated",
                                }}
                            />
                            <span className="flex flex-col items-center leading-tight">
                                <span
                                    className={`text-xs bg-${item.rarity} px-2 rounded`}
                                >
                                    {item.rarity}
                                </span>
                                <span className={`font-bold text-sm`}>
                                    {t(item.name)}
                                </span>
                            </span>
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default HalloweenPage;
