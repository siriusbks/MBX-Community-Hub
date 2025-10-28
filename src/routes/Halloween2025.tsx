/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Leaf, Ticket, Calendar } from "lucide-react";
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
        name: "halloween.example",
        rarity: "COMMON",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "UNCOMMON",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "RARE",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "EPIC",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "LEGENDARY",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "MYTHIC",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "UNKNOWN",
        change: 12.34,
    },
    {
        image: "/assets/media/museum/not-found.png",
        name: "halloween.example",
        rarity: "UNKNOWN",
        change: 12.34,
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus lectus risus, sodales sit amet pharetra a, lacinia non
                elit. Etiam sagittis, ex ultrices bibendum commodo, mi libero
                laoreet massa, quis accumsan purus elit a sapien. Sed blandit
                velit quis sapien euismod lacinia. Donec ac justo purus. Nullam
                porttitor tellus sed arcu blandit hendrerit. Praesent pulvinar
                velit congue dapibus euismod. Ut augue est, varius sed mi nec,
                consequat sagittis sapien.
                <br />
                <br />
                Integer sodales a mi eget tincidunt. Sed pharetra nisi ut turpis
                ultricies molestie. Morbi ullamcorper pulvinar euismod.
                Pellentesque sed rutrum augue, quis semper ante. Ut sodales, dui
                ut tempus convallis, orci ipsum condimentum neque, vel accumsan
                tellus metus vel lacus. Aliquam fringilla lorem nec nunc
                elementum posuere. Vivamus arcu orci, luctus pretium ornare
                porttitor, eleifend quis augue. Suspendisse sed finibus neque,
                eget pretium nulla. Curabitur ornare dui eget justo pellentesque
                interdum. Maecenas quis enim vel erat tempor tristique quis
                scelerisque est. Etiam at justo eu ipsum viverra efficitur nec
                quis nunc. Pellentesque interdum, justo at rhoncus maximus, ex
                sem auctor nulla, a fringilla quam odio eget felis. Quisque sed
                dictum ipsum. Maecenas dignissim odio in turpis placerat, non
                posuere felis commodo. Sed in quam non arcu tincidunt eleifend
                in convallis felis.
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 1</h3>
                            <p className="text-xs text-orange-500">
                                "NAME_TEMPLATE"
                            </p>
                        </span>
                    </span>
                    <p className="text-xs mt-2">XX.XX.XXXX - XX.XX.XXXX</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 2</h3>
                            <p className="text-xs text-orange-500">
                                "NAME_TEMPLATE"
                            </p>
                        </span>
                    </span>
                    <p className="text-xs mt-2">XX.XX.XXXX - XX.XX.XXXX</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 3</h3>
                            <p className="text-xs text-orange-500">
                                "NAME_TEMPLATE"
                            </p>
                        </span>
                    </span>
                    <p className="text-xs mt-2">XX.XX.XXXX - XX.XX.XXXX</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <span className="flex flex-col xl:flex-row items-center gap-3">
                        <Calendar className="h-10 w-10 text-orange-500 mb-0 xl:mb-0 xl:mr-0 bg-orange-500 bg-opacity-20 p-2 rounded-lg" />
                        <span className="text-center xl:text-left">
                            <h3 className="text-2xl font-bold">Week 4</h3>
                            <p className="text-xs text-orange-500">
                                "NAME_TEMPLATE"
                            </p>
                        </span>
                    </span>
                    <p className="text-xs mt-2">XX.XX.XXXX - XX.XX.XXXX</p>
                </div>
            </div>

            {/* Battle Pass Section */}
            <div className="mb-3 mt-9 flex items-center justify-between gap-3  py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Ticket className="w-10 h-8 text-orange-400" />
                    <h1 className="text-2xl font-semibold text-gray-100">
                        Halloween Treasure
                    </h1>
                </div>
            </div>

            <p className="text-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus lectus risus, sodales sit amet pharetra a, lacinia non
                elit. Etiam sagittis, ex ultrices bibendum commodo, mi libero
                laoreet massa, quis accumsan purus elit a sapien. Sed blandit
                velit quis sapien euismod lacinia. Donec ac justo purus. Nullam
                porttitor tellus sed arcu blandit hendrerit. Praesent pulvinar
                velit congue dapibus euismod. Ut augue est, varius sed mi nec,
                consequat sagittis sapien.
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
                            <span className="flex flex-col items-center leading-tight">
                                <span
                                    className={`text-xs bg-${item.rarity} px-2 rounded`}
                                >
                                    {item.rarity}
                                </span>
                                <span className={`font-bold text-sm`}>
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
                    <Ticket className="w-10 h-8 text-orange-400" />
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
                    <Ticket className="w-10 h-8 text-orange-400" />
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
