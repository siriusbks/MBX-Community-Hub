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
                        {t("halloween.battle_pass.title")}
                    </h1>
                </div>
            </div>

            <p className="text-xs">
                {t("halloween.battle_pass.description1")}
            </p>
            <p className="text-xs">
                {t("halloween.battle_pass.description2")}
            </p>
            <div className="grid grid-cols-5 gap-4 mt-4">
                <div className="flex flex-col items-center justify-center text-center bg-gray-700 rounded p-2">
                    <h4 className="text-xl text-orange-500 font-bold mb-2">
                        {t("halloween.stars.title")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300">
                        {t("halloween.stars.description")}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-gray-700 rounded p-2">
                    <h4 className="text-xl text-orange-500 font-bold mb-2">
                        {t("halloween.shop.title")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300">
                        {t("halloween.shop.description")}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-gray-700 rounded p-2">
                    <h4 className="text-xl text-orange-500 font-bold mb-2 leading-none">
                        {t("halloween.missions.title")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300">
                        {t("halloween.missions.description")}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-gray-700 rounded p-2">
                    <h4 className="text-xl text-orange-500 font-bold mb-2">
                        {t("halloween.quest.title")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300">
                        {t("halloween.quest.description")}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-gray-700 rounded p-2">
                    <h4 className="text-xl text-orange-500 font-bold mb-2">
                        {t("halloween.workshop.title")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300">
                        {t("halloween.workshop.description")}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">{t("halloween.week1")}</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">29.10.2025 - 05.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">{t("halloween.week2")}</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">06.11.2025 - 12.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">{t("halloween.week3")}</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">13.11.2025 - 19.11.2025</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">{t("halloween.week4")}</h3>
                        </span>
                    </span>
                    <p className="text-xs mt-2">20.11.2025 - 26.11.2025</p>
                </div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Calendar className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {t("halloween.quests.title")}
                    </h1>
                </div>
            </div>

            <div className="flex-row flex gap-2 mt-4">
                {/** Webina Quest Section **/}
                <div className="w-1/4 bg-gray-700 rounded-lg  flex flex-col items-center">
                    <h2 className="w-full text-center bg-gray-600 rounded-lg p-3 font-bold">
                        {t("halloween.quests.llowee.title")}
                    </h2>

                    <span className="w-full p-1 px-2 text-xs">
                        1. {t("halloween.quests.llowee.talk")}
                    </span>
                    <span className="w-full pt-1 px-2 text-xs">
                        2. {t("halloween.quests.llowee.findnest")}
                    </span>
                    <span className="w-full pb-1 px-2 text-xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;{t("halloween.quests.universal.location")}:{" "}
                        <span className="text-orange-400">146 85 -95</span>
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        3. {t("halloween.quests.llowee.talk")}
                    </span>
                    <span className="w-full pt-1 px-2 text-xs">
                        4. {t("halloween.quests.llowee.killrats")}
                    </span>
                    <span className="w-full pb-1 px-2 text-xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;{t("halloween.quests.universal.location")}:{" "}
                        <span className="text-orange-400">473 75 -51</span>
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        5. {t("halloween.quests.llowee.talk")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        6. {t("halloween.quests.llowee.findnest")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        7. {t("halloween.quests.llowee.killalbino")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        8. {t("halloween.quests.llowee.talk")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs font-bold text-orange-500">
                        {t("halloween.quests.universal.reward")}:{" "}
                        <span className="text-LEGENDARY">1 {t("halloween.quests.universal.bp_star")}</span>,{" "}
                        <span className="text-RARE">{t("halloween.candy_bag")}</span>,{" "}
                        <span className="text-RARE">2x {t("halloween.candy_sack")}</span>
                    </span>
                </div>
                {/** Webina Quest Section **/}
                <div className="w-1/2 bg-gray-700 gap-1 rounded-lg flex flex-col items-center">
                    <h2 className="w-full text-center bg-gray-600 rounded-lg p-3 font-bold">
                        {t("halloween.quests.webina.title")}
                    </h2>
                    <span className="w-full text-center text-xs">
                        1. {t("halloween.quests.webina.talk")}
                    </span>
                    <span className="w-full text-center text-xs">
                        2. {t("halloween.quests.webina.collectspiders")}
                    </span>
                    <span className="flex flex-row px-4">
                        <img
                            src="assets/media/halloween/Locations.png"
                            alt="Quest Locations"
                            className="h-96 rounded"
                        />
                        <table className="text-xs bg-gray-600 ml-4 rounded-lg table-auto overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        X
                                    </th>
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        Y
                                    </th>
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        Z
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr>
                                    <td className="px-2 py-1">199</td>
                                    <td className="px-2 py-1">82</td>
                                    <td className="px-2 py-1">-184</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">204</td>
                                    <td className="px-2 py-1">82</td>
                                    <td className="px-2 py-1">-155</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">185</td>
                                    <td className="px-2 py-1">82</td>
                                    <td className="px-2 py-1">-160</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">169</td>
                                    <td className="px-2 py-1">82</td>
                                    <td className="px-2 py-1">-149</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">176</td>
                                    <td className="px-2 py-1">75</td>
                                    <td className="px-2 py-1">-184</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">135</td>
                                    <td className="px-2 py-1">84</td>
                                    <td className="px-2 py-1">-187</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">128</td>
                                    <td className="px-2 py-1">78</td>
                                    <td className="px-2 py-1">-179</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">143</td>
                                    <td className="px-2 py-1">81</td>
                                    <td className="px-2 py-1">-144</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">145</td>
                                    <td className="px-2 py-1">80</td>
                                    <td className="px-2 py-1">-138</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">151</td>
                                    <td className="px-2 py-1">79</td>
                                    <td className="px-2 py-1">-130</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">133</td>
                                    <td className="px-2 py-1">87</td>
                                    <td className="px-2 py-1">-128</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">132</td>
                                    <td className="px-2 py-1">78</td>
                                    <td className="px-2 py-1">-109</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="text-xs bg-gray-600 ml-4 rounded-lg table-auto overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        X
                                    </th>
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        Y
                                    </th>
                                    <th className="px-2 py-1 text-center bg-orange-500/20 text-orange-500 font-semibold text-left">
                                        Z
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr>
                                    <td className="px-2 py-1">129</td>
                                    <td className="px-2 py-1">81</td>
                                    <td className="px-2 py-1">-67</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">155</td>
                                    <td className="px-2 py-1">80</td>
                                    <td className="px-2 py-1">-73</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">135</td>
                                    <td className="px-2 py-1">87</td>
                                    <td className="px-2 py-1">-85</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">163</td>
                                    <td className="px-2 py-1">78</td>
                                    <td className="px-2 py-1">-94</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">160</td>
                                    <td className="px-2 py-1">86</td>
                                    <td className="px-2 py-1">-101</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">180</td>
                                    <td className="px-2 py-1">79</td>
                                    <td className="px-2 py-1">-121</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">200</td>
                                    <td className="px-2 py-1">79</td>
                                    <td className="px-2 py-1">-126</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">217</td>
                                    <td className="px-2 py-1">83</td>
                                    <td className="px-2 py-1">-133</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">213</td>
                                    <td className="px-2 py-1">77</td>
                                    <td className="px-2 py-1">-108</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">200</td>
                                    <td className="px-2 py-1">83</td>
                                    <td className="px-2 py-1">-94</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-1">208</td>
                                    <td className="px-2 py-1">89</td>
                                    <td className="px-2 py-1">-70</td>
                                </tr>
                            </tbody>
                        </table>
                    </span>
                    <span className="w-full text-center text-xs">
                        3. {t("halloween.quests.webina.talk")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs font-bold text-orange-500 text-center mb-1">
                        {t("halloween.quests.universal.reward")}:{" "}
                        <span className="text-LEGENDARY ">4 {t("halloween.quests.universal.bp_star")}</span>,{" "}
                        <span className="text-RARE">4x {t("halloween.candy_sack")}</span>
                    </span>
                </div>
                {/** Webina Quest Section **/}
                <div className="w-1/4 bg-gray-700 rounded-lg flex flex-col items-center">
                    <h2 className="w-full text-center bg-gray-600 rounded-lg p-3 font-bold">
                        {t("halloween.quests.mcbones.title")}
                    </h2>
                    <span className="w-full p-1 px-2 text-xs">
                        1. {t("halloween.quests.mcbones.talk")}
                    </span>
                    <span className="w-full pt-1 px-2 text-xs">
                        2. {t("halloween.quests.mcbones.killghosts")}
                    </span>
                    <span className="w-full p-0 px-2 text-xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;{t("halloween.quests.universal.time")}:{" "}
                        <span className="text-orange-500">19:00 - 06:00</span>
                    </span>
                    <span className="w-full pb-1 px-2 text-xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;{t("halloween.quests.universal.location")}:{" "}
                        <span className="text-orange-400">108 110 127</span>
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        3. {t("halloween.quests.mcbones.talk")}
                    </span>
                    <span className="w-full pt-1 px-2 text-xs">
                        4. {t("halloween.quests.universal.loot")}: {" "}
                        <span className="text-RARE">64x Dirty Sheets</span>
                    </span>
                    <span className="w-full pb-1 px-2 text-xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;{t("halloween.quests.universal.craft")}:{" "}
                        <span className="text-LEGENDARY">Ghost Vaccum</span>
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        5. {t("halloween.quests.mcbones.bring")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        6. {t("halloween.quests.mcbones.slurp")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs">
                        7. {t("halloween.quests.mcbones.talk")}
                    </span>
                    <span className="w-full p-1 px-2 text-xs font-bold text-orange-500">
                        {t("halloween.quests.universal.reward")}:{" "}
                        <span className="text-LEGENDARY">10 {t("halloween.quests.universal.bp_star")}</span>,{" "}
                        <span className="text-RARE">6x {t("halloween.candy_sack")}</span>
                    </span>
                </div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Box className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {t("halloween.treasure.title")}
                    </h1>
                </div>
            </div>

            <p className="text-xs">
                {t("halloween.treasure.description1")}
            </p>
            <p className="text-xs">
                {t("halloween.treasure.description2")}
            </p>
            <p className="text-xs text-orange-500 font-bold">
                
                {t("halloween.treasure.description3")}
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
                        {t("halloween.new_mobs.title")}
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
            {/*}
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
            </div>*/}
        </div>
    );
};

export default HalloweenPage;
