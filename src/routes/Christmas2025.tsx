/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Leaf,
    Ticket,
    Calendar,
    Box,
    Rat,
    LayoutList,
    Star,
    Candy,
    Wrench,
    Scroll,
    ScrollIcon,
    ScrollText,
    ShoppingBagIcon,
    ShoppingCart,
    Snowflake,
    Gift,
    CandyCane,
} from "lucide-react";
import { bestiaryData } from "@components/map/bestiaryData";
import {
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";
import { Link } from "react-router-dom";

type TreasureDropChange = {
    image: string;
    name: string;
    rarity:
        | "VANILLA"
        | "COMMON"
        | "RARE"
        | "EPIC"
        | "LEGENDARY"
        | "MYTHIC"
        | "UNCOMMON"
        | "UNKNOWN";
    change: number;
};
type GiftsDropChange = {
    image: string;
    name: string;
    rarity:
        | "VANILLA"
        | "COMMON"
        | "RARE"
        | "EPIC"
        | "LEGENDARY"
        | "MYTHIC"
        | "UNCOMMON"
        | "UNKNOWN";
    count: number;
    change: number;
};

const BigPresentDrops: TreasureDropChange[] = [
    {
        image: "assets/media/museum/EDIBLE/cheese_reset.png",
        name: "mbx.items.cheese_reset.name",
        rarity: "MYTHIC",
        change: 0,
    },
    {
        image: "assets/media/museum/BELT/xmas_hipster_belt.png",
        name: "mbx.items.xmas_hipster_belt.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/BACK/xmas_hipster_backpack.png",
        name: "mbx.items.xmas_hipster_backpack.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/BOOTS/xmas_hipster_boots.png",
        name: "mbx.items.xmas_hipster_boots.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/CHESTPLATE/xmas_hipster_chestplate.png",
        name: "mbx.items.xmas_hipster_chestplate.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/HELMET/xmas_hipster_helmet.png",
        name: "mbx.items.xmas_hipster_helmet.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/LEGGINGS/xmas_hipster_leggings.png",
        name: "mbx.items.xmas_hipster_leggings.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/NECKLACE/xmas_hipster_necklace.png",
        name: "mbx.items.xmas_hipster_necklace.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/RING/xmas_hipster_ring.png",
        name: "mbx.items.xmas_hipster_ring.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/EDIBLE/owner_remover_mythic.png",
        name: "Mythic Forgetfulness Candy",
        rarity: "MYTHIC",
        change: 0,
    },
    {
        image: "assets/media/museum/CHESTPLATE/xmas_ugly_pullover.png",
        name: "mbx.items.xmas_ugly_pullover.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/EDIBLE/star_sub_plus_enchanted.png",
        name: "mbx.items.star_sub_plus_enchanted.name",
        rarity: "MYTHIC",
        change: 0,
    },
    {
        image: "assets/media/museum/HARVESTER/harvester_royal_axe.png",
        name: "mbx.items.harvester_royal_axe.name",
        rarity: "MYTHIC",
        change: 0,
    },
    {
        image: "assets/media/museum/HARVESTER/harvester_royal_hoe.png",
        name: "mbx.items.harvester_royal_hoe.name",
        rarity: "MYTHIC",
        change: 0,
    },
    {
        image: "assets/media/museum/MOUNT/mount_wooden_plane.png",
        name: "mbx.items.mount_wooden_plane.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/PET/pet_snowman.png",
        name: "mbx.items.pet_snowman.name",
        rarity: "EPIC",
        change: 0,
    },
    {
        image: "assets/media/museum/PET/pet_hipster_penguin.png",
        name: "mbx.items.pet_hipster_penguin.name",
        rarity: "LEGENDARY",
        change: 0,
    },
    {
        image: "assets/media/museum/MOUNT/mount_hipster_bike.png",
        name: "mbx.items.mount_hipster_bike.name",
        rarity: "MYTHIC",
        change: 0,
    },
];
const MediumPresentDrops: GiftsDropChange[] = [
    {
        image: "assets/media/museum/TREASURE/key_rare.png",
        name: "mbx.items.key_rare.name",
        rarity: "RARE",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/treasure_rare.png",
        name: "mbx.items.treasure_rare.name",
        rarity: "RARE",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/treasure_uncommon.png",
        name: "mbx.items.treasure_uncommon.name",
        rarity: "UNCOMMON",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/key_uncommon.png",
        name: "mbx.items.key_uncommon.name",
        rarity: "UNCOMMON",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/treasure_common.png",
        name: "mbx.items.treasure_common.name",
        rarity: "COMMON",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/key_common.png",
        name: "mbx.items.key_common.name",
        rarity: "COMMON",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/item/textures/netherite_ingot.png",
        name: "Netherite Ingot",
        rarity: "VANILLA",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/item/textures/netherite_scrap.png",
        name: "Netherite Scrap",
        rarity: "VANILLA",
        count: 2,
        change: 0,
    },
    {
        image: "assets/media/item/textures/diamond.png",
        name: "Diamond",
        rarity: "VANILLA",
        count: 8,
        change: 0,
    },
    {
        image: "assets/media/item/textures/diamond_block.png",
        name: "Diamond Block",
        rarity: "VANILLA",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/item/textures/gold_ingot.png",
        name: "Gold Ingot",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
    {
        image: "assets/media/item/textures/gold_block.png",
        name: "Gold Block",
        rarity: "VANILLA",
        count: 2,
        change: 0,
    },
    {
        image: "assets/media/item/textures/iron_ingot.png",
        name: "Iron Ingot",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
    {
        image: "assets/media/item/textures/iron_block.png",
        name: "Iron Block",
        rarity: "VANILLA",
        count: 2,
        change: 0,
    },
    {
        image: "assets/media/item/textures/amethyst_shard.png",
        name: "Amethyst Shard",
        rarity: "VANILLA",
        count: 64,
        change: 0,
    },
    {
        image: "assets/media/item/textures/amethyst_shard.png",
        name: "Amethyst Shard",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
    {
        image: "assets/media/item/textures/bone.png",
        name: "Bone",
        rarity: "VANILLA",
        count: 32,
        change: 0,
    },
];
const SmallPresentDrops: GiftsDropChange[] = [
    {
        image: "assets/media/museum/FRUIT/banana.png",
        name: "mbx.items.banana.name",
        rarity: "UNCOMMON",
        count: 4,
        change: 0,
    },
    {
        image: "assets/media/museum/PLANT/plant_clover.png",
        name: "mbx.items.plant_clover.name",
        rarity: "UNCOMMON",
        count: 4,
        change: 0,
    },
    {
        image: "assets/media/museum/PLANT/plant_lily.png",
        name: "mbx.items.plant_lily.name",
        rarity: "UNCOMMON",
        count: 8,
        change: 0,
    },
    {
        image: "assets/media/museum/TREASURE/key_common.png",
        name: "mbx.items.key_common.name",
        rarity: "COMMON",
        count: 1,
        change: 0,
    },
    {
        image: "assets/media/museum/FRUIT/coconut.png",
        name: "mbx.items.coconut.name",
        rarity: "COMMON",
        count: 8,
        change: 0,
    },
    {
        image: "assets/media/item/textures/bone.png",
        name: "Bone",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
    {
        image: "assets/media/item/textures/snowball.png",
        name: "Snowball",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
    {
        image: "assets/media/item/textures/egg.png",
        name: "Chicken Egg",
        rarity: "VANILLA",
        count: 16,
        change: 0,
    },
];

const ChristmasPage: FC = () => {
    const { t } = useTranslation(["christmas", "bestiary"]);

    // Flatten bestiaryData and keep only entries marked for halloween2025
    const halloweenMobs = Object.values(bestiaryData)
        .flatMap((areaRecord) => Object.values(areaRecord))
        .flatMap((list) => list)
        .filter((info) => info.christmas2025);

    return (
        <div className="p-10 px-2 museum-page mx-auto rounded-lg ">
            <span className="hidden bg-VANILLA bg-VANILLA-50 border-VANILLA"></span>
            {/* Header */}
            <div className="text-center mb-12">
                <Snowflake className="mx-auto mb-2 h-16 w-16 text-rose-500 bg-opacity-20 bg-rose-500 p-3 rounded-lg" />
                <h1 className="text-4xl font-bold text-white mb-1">
                    {t("christmas.title")}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("christmas.subtitle")}
                </p>
                <div className="mt-4 h-1 w-24 bg-rose-500 mx-auto rounded-full"></div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Ticket className="w-10 h-8 text-rose-600" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {t("christmas.battlepass.title")}
                    </h1>
                </div>
            </div>
            <p className="text-xs">{t("christmas.battlepass.description")}</p>
            <div className="grid grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-2 flex flex-col items-center justify-center w-full">
                        <Star className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1 p-2 bg-rose-500/10 rounded-xl" />
                        {t("christmas.info.stars")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 ">
                        {t("christmas.info.stars.description")}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-auto flex flex-col items-center justify-center w-full">
                        <ShoppingCart className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1 p-2 bg-rose-500/10 rounded-xl" />
                        {t("christmas.info.shop")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 mb-auto">
                        {t("christmas.info.shop.description")}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-auto flex flex-col items-center justify-center w-full">
                        <Wrench className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1 p-2 bg-rose-500/10 rounded-xl" />
                        {t("christmas.info.workshop")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 mb-auto">
                        {t("christmas.info.workshop.description")}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-auto flex flex-col items-center justify-center w-full">
                        <Gift
                            strokeWidth={1}
                            className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1  p-2 bg-rose-500/10 rounded-xl"
                        />
                        {t("christmas.info.small")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 mb-auto">
                        {t("christmas.info.small.description")}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-auto flex flex-col items-center justify-center w-full">
                        <Gift className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1  p-2 bg-rose-500/10 rounded-xl" />
                        {t("christmas.info.medium")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 mb-auto">
                        {t("christmas.info.medium.description")}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5 border-gray-800 border rounded-lg p-4">
                    <h4 className="text-xl text-gray-200 font-bold mb-auto flex flex-col items-center justify-center w-full">
                        <Gift
                            strokeWidth={2.5}
                            className="leading-none  text-rose-500 h-12 w-12 inline-block mb-1  p-2 bg-rose-500/10 rounded-xl"
                        />
                        {t("christmas.info.big")}
                    </h4>
                    <p className="text-xs leading-tight text-gray-300 mb-auto">
                        {t("christmas.info.big.description")}
                    </p>
                </div>
            </div>

            {/* Mission Section */}

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                <span>
                    <div className="relative bg-gray-800 rounded-t-lg p-4 flex flex-row items-center">
                        <Calendar className="h-12 w-12 text-rose-500 mb-0 xl:mb-0 xl:mr-0 bg-rose-500 bg-opacity-15 p-3 rounded-lg" />
                        <span className="text-center xl:text-left ml-4 flex gap-0 flex-col">
                            <h3 className="text-2xl font-bold">
                                {t("christmas.week1")}
                            </h3>
                            <p className="text-xs ">16.12.2025 - 23.12.2025</p>
                        </span>
                        {(() => {
                            const now = new Date();
                            const start = new Date(2025, 11, 16); // months are 0-based: 11 = December
                            const end = new Date(2025, 11, 23, 23, 59, 59, 999); // 11 = December
                            return now >= start && now <= end ? (
                                <span className="font-bold absolute right-0 top-0 z-10 text-xs rounded-tr-lg rounded-bl-lg bg-rose-600 py-1 px-2">
                                    {t("christmas.week.active")}
                                </span>
                            ) : null;
                        })()}
                    </div>
                    <span className="flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/60 border-gray-800 border rounded-b-lg w-full text-xs p-2 flex ">
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>
                                {t("christmas.mission.craft")}{" "}
                                <span className="text-MYTHIC font-bold">{t("mbx.items.xmas_red_present_big.name")}{" "}</span>
                                [2]
                            </span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.kill")}
                                <span className="text-VANILLA font-bold">{t("bestiary.xmas_penguin_green", {ns: "bestiary"})}</span>{" "}[32]</span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.kill")}
                                <span className="text-VANILLA font-bold">{t("bestiary.xmas_penguin_red", {ns: "bestiary"})}</span>{" "}[32]</span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.opengifts")} [32]</span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.play")} [4]</span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.takegifts")} [8]</span>
                            <span className="text-LEGENDARY">
                                7x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className=" w-full justify-between flex">
                            <span className="text-rose-500 font-bold">
                                {t("christmas.mission.reward")}:
                            </span>
                            <span>
                                <span className="text-LEGENDARY">
                                    8x {t("christmas.bpStars")}
                                </span>
                            </span>
                        </div>
                    </span>
                </span>
                <span>
                    <div className="relative bg-gray-800 rounded-t-lg p-4 flex flex-row items-center">
                        <Calendar className="h-12 w-12 text-rose-500 mb-0 xl:mb-0 xl:mr-0 bg-rose-500 bg-opacity-15 p-3 rounded-lg" />
                        <span className="text-center xl:text-left ml-4 flex gap-0 flex-col">
                            <h3 className="text-2xl font-bold">
                                {t("christmas.week2")}
                            </h3>
                            <p className="text-xs ">23.12.2025 - 30.12.2025</p>
                        </span>
                        {(() => {
                            const now = new Date();
                            const start = new Date(2025, 11, 23); // months are 0-based: 11 = December
                            const end = new Date(2025, 11, 30, 23, 59, 59, 999); // 11 = December
                            return now >= start && now <= end ? (
                                <span className="font-bold absolute right-0 top-0 z-10 text-xs rounded-tr-lg rounded-bl-lg bg-rose-500 py-1 px-2">
                                    {t("christmas.week.active")}
                                </span>
                            ) : null;
                        })()}
                    </div>
                    <span className="flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/60 border-gray-800 border rounded-b-lg w-full text-xs p-2 flex ">
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className=" w-full justify-between flex">
                            <span className="text-rose-500 font-bold">
                                {t("christmas.mission.reward")}:
                            </span>
                            <span>
                                <span className="text-LEGENDARY">
                                    ?x {t("christmas.bpStars")}
                                </span>
                            </span>
                        </div>
                    </span>
                </span>
                <span>
                    <div className="relative bg-gray-800 rounded-t-lg p-4 flex flex-row items-center">
                        <Calendar className="h-12 w-12 text-rose-500 mb-0 xl:mb-0 xl:mr-0 bg-rose-500 bg-opacity-15 p-3 rounded-lg" />
                        <span className="text-center xl:text-left ml-4 flex gap-0 flex-col">
                            <h3 className="text-2xl font-bold">
                                {t("christmas.week3")}
                            </h3>
                            <p className="text-xs ">30.12.2025 - 06.01.2026</p>
                        </span>
                        {(() => {
                            const now = new Date();
                            const start = new Date(2025, 11, 30); // months are 0-based: 11 = December
                            const end = new Date(2026, 0, 6, 23, 59, 59, 999); // 0 = January
                            return now >= start && now <= end ? (
                                <span className="font-bold absolute right-0 top-0 z-10 text-xs rounded-tr-lg rounded-bl-lg bg-rose-500 py-1 px-2">
                                    {t("christmas.week.active")}
                                </span>
                            ) : null;
                        })()}
                    </div>
                    <span className="flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/60 border-gray-800 border rounded-b-lg w-full text-xs p-2 flex ">
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className="border-b border-gray-800 mb-1 pb-0.5 w-full justify-between flex">
                            <span>{t("christmas.mission.missing")} [??]</span>
                            <span className="text-LEGENDARY">
                                ?x {t("christmas.bpStars")}
                            </span>
                        </div>
                        <div className=" w-full justify-between flex">
                            <span className="text-rose-500 font-bold">
                                {t("christmas.mission.reward")}:
                            </span>
                            <span>
                                <span className="text-LEGENDARY">
                                    ?x {t("christmas.bpStars")}
                                </span>
                            </span>
                        </div>
                    </span>
                </span>
            </div>

            {/* Event Treasure Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Box className="w-10 h-8 text-rose-600" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {t("christmas.treasure.title")}
                    </h1>
                </div>
            </div>

            <p className="text-xs">{t("christmas.treasure.description1")}</p>
            <p className="text-xs">{t("christmas.treasure.description2")}</p>
            <p className="text-xs text-rose-500 font-bold">
                {t("christmas.treasure.description3")}
            </p>
            {(() => {
                const PresentCard: FC<{
                    item: TreasureDropChange;
                    index?: number;
                }> = ({ item, index }) => (
                    <a
                        key={(item.name || "present") + (index ?? 0)}
                        className={`block w-full bg-${item.rarity}-50 text-white p-3 rounded transition-colors whitespace-nowrap text-center border border-${item.rarity}`}
                    >
                        <span className="flex flex-col items-center gap-2">
                            <img
                                src={item.image}
                                className="h-16 w-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={item.name}
                            />
                            <span className="w-full flex flex-col items-center leading-tight">
                                <span
                                    className={`text-xs bg-${item.rarity} px-2 font-semibold text-[9px] rounded`}
                                >
                                    {item.rarity}
                                </span>

                                <span
                                    className={`font-bold text-sm w-full text-wrap leading-none h-12 self-center flex items-center justify-center text-center`}
                                >
                                    {t(item.name, {
                                        ns: "mbx",
                                        defaultValue:
                                            item.name || "Unknown Item",
                                    })}
                                </span>
                                <span className="text-xs">{item.change}%</span>
                            </span>
                        </span>
                    </a>
                );

                const PresentNoDropsRateCard: FC<{
                    item: GiftsDropChange;
                    index?: number;
                }> = ({ item, index }) => (
                    <a
                        key={(item.name || "present") + (index ?? 0)}
                        className={`block w-full bg-${item.rarity}-50 text-white p-3 rounded transition-colors whitespace-nowrap text-center border border-${item.rarity}`}
                    >
                        <span className="flex flex-col items-center gap-2">
                            <img
                                src={item.image}
                                className="h-16 w-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                style={{
                                    imageRendering: "pixelated",
                                }}
                                alt={item.name}
                            />
                            <span className="w-full flex flex-col items-center leading-tight">
                                <span
                                    className={`text-xs bg-${item.rarity} px-2 font-semibold text-[9px] rounded`}
                                >
                                    {item.rarity}
                                </span>

                                <span
                                    className={`font-bold text-sm w-full text-wrap leading-none h-8 self-center flex items-center justify-center text-center`}
                                >
                                    {item.count}x&nbsp;
                                    {t(item.name, {
                                        ns: "mbx",
                                        defaultValue:
                                            item.name || "Unknown Item",
                                    })}
                                </span>
                            </span>
                        </span>
                    </a>
                );

                const PresentGrid: FC<{ drops: TreasureDropChange[] }> = ({
                    drops,
                }) => (
                    <div className="grid grid-cols-3 xl:grid-cols-9 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 gap-2 gap-2 mt-4">
                        {drops.map((item, index) => (
                            <PresentCard
                                key={item.name + index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                );
                const PresentNoDropChangeGrid: FC<{
                    drops: GiftsDropChange[];
                }> = ({ drops }) => (
                    <div className="grid grid-cols-3 xl:grid-cols-9 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 gap-2 gap-2 mt-4">
                        {drops.map((item, index) => (
                            <PresentNoDropsRateCard
                                key={item.name + index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                );

                return (
                    <>
                        <div className="flex items-center gap-2 mb-2 mt-4">
                            <Gift className="w-6 h-6 text-rose-600" />
                            <h1 className="text-xl font-semibold text-gray-100">
                                {t("christmas.treasure.big")}
                            </h1>
                        </div>
                        <PresentGrid drops={BigPresentDrops} />
                        <div className="flex items-center gap-2 mb-2 mt-4">
                            <Gift className="w-6 h-6 text-rose-600" />
                            <h1 className="text-xl font-semibold text-gray-100">
                                {t("christmas.treasure.medium")}
                            </h1>
                        </div>
                        <PresentNoDropChangeGrid drops={MediumPresentDrops} />
                        <div className="flex items-center gap-2 mb-2 mt-4">
                            <Gift className="w-6 h-6 text-rose-600" />
                            <h1 className="text-xl font-semibold text-gray-100">
                                {t("christmas.treasure.small")}
                            </h1>
                        </div>
                        <PresentNoDropChangeGrid drops={SmallPresentDrops} />
                    </>
                );
            })()}

            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <CandyCane className="w-10 h-8 text-rose-600" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {t("christmas.mobs.title")}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-3 gap-2 gap-2 mt-4">
                {halloweenMobs.map((mob, index) => (
                    <Link
                        to={`/bestiary?mob=${encodeURIComponent(mob.name)}`}
                        className=""
                        title={t("bestiary.share", {
                            ns: "mbx",
                            defaultValue: "Open Bestiary",
                        })}
                    >
                        <a
                            key={(mob.name || "mob") + index}
                            className={`block w-full text-white p-3 whitespace-nowrap text-center bg-gradient-to-br from-gray-800/50 to-rose-900/5  hover:to-rose-500/10 rounded-lg transition-colors transition-all duration-300 border border-gray-800`}
                        >
                            <span className="flex flex-col items-center gap-2">
                                <img
                                    src={
                                        mob.image ??
                                        "/assets/media/museum/not-found.png"
                                    }
                                    alt={mob.name}
                                    className="h-32 w-32 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                    style={{
                                        imageRendering: "pixelated",
                                    }}
                                />
                                <span className="w-full ml-4 mr-2 flex flex-col items-center leading-tight">
                                    <span className="flex gap-1 items-center ">
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
                                    <span className="text-[11px] text-gray-300 flex justify-between w-full ">
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
                    </Link>
                ))}
            </div>

            {/* Battle Pass Section */}
            {/*}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <LayoutList className="w-10 h-8 text-rose-400" />
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

export default ChristmasPage;
