/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";

/*
Example of use
    <ItemTranslation
        mbxId={item.id}
        category={item.category}
        type="name"
    />
*/

interface ItemTranslationProps {
    mbxId: string | "null"; // items, skills, stats, traits, creature
    category: string | null; // bestiary, museum, ballon, emote...
    type: "name" | "description&lore";
}

const ItemTranslation: React.FC<ItemTranslationProps> = ({ mbxId, category, type }) => {
    const { t } = useTranslation("mbx");
    const { t:mob } = useTranslation("bestiary");
    const { t:inr } = useTranslation("itemsNrecipes")
    const { t:museum } = useTranslation("museum");
    
    let translation: string = "";
    let translationLore: string ="";
    let translationDescription: string ="";
    const lowerCategory = category ? category.toLowerCase() : "";

    /* Type Description and Lore */
    if (type === "description&lore") {
        // Determine the path based on the category
        switch (lowerCategory) {
            case "bestiary":
                // For "bestiary", use key "mbx.bestiary.{mbxId}"
                translationLore = t(`mbx.${lowerCategory}.${mbxId}.lore`, { defaultValue: "" });
                translationDescription = t(`mbx.${lowerCategory}.${mbxId}.description`, { defaultValue: "" });
                break;
            case "title":
            case "tag":
            case "profile_plate":
            case "nameplate":
            case "emote":
            case "balloon":
                // For these categories, use key "mbx.attributes.{category}.{mbxId}"
                translationLore = t(`mbx.attributes.${lowerCategory}.${mbxId}.lore`, { defaultValue: "" });
                translationDescription = t(`mbx.attributes.${lowerCategory}.${mbxId}.description`, { defaultValue: "" });
                break;
            case "utility_block":
                // For "utility_block", check the beginning of mbxId
                if (mbxId.startsWith("block_compactor")) {
                    const parts = mbxId.split("_");
                    const typePart = parts[parts.length - 1];
                    let typeRecipe: string = "";
                    switch (typePart) {
                        case "transformed":
                            typeRecipe = "raw";
                            break;
                        case "bag":
                            typeRecipe = "transformed";
                            break;
                        case "crate":
                            typeRecipe = "bag";
                            break;
                        case "barrel":
                            typeRecipe = "crate";
                            break;
                        case "enchanted":
                            typeRecipe = "barrel";
                            break;
                    }
                    const resourceTranslation = t(`mbx.item_category.resource`, { defaultValue: "" });
                    const typeRecipeTranslation = t(`mbx.items.container.${typeRecipe}`, { 
                        key0: resourceTranslation,
                        defaultValue: ""
                    });
                    const typePartTranslation = t(`mbx.items.container.${typePart}`, { 
                        key0: resourceTranslation,
                        defaultValue: ""
                    });
                    translationLore = t(`mbx.items.block_compactor.timePerCompact`, {
                        key0: "2s",
                        defaultValue: ""
                    });
                    translationDescription = t(`mbx.items.block_compactor.description`, {
                        key1: 16,
                        key2: typeRecipeTranslation,
                        key3: typePartTranslation,
                        defaultValue: ""
                    });
                } else if (mbxId.startsWith("block_teleporter")) {
                    translationLore = t(`mbx.items.block_teleporter.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.block_teleporter.description`, { defaultValue: "" });
                } else if (mbxId.startsWith("mm-workshop_")) {
                    translationLore = t(`mbx.items.workshop.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.workshop.description`, { defaultValue: "" });
                } else {
                    translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                }
                break;
            case "edible":
                // For edible items, if mbxId starts with "owner_remover", use a specific key with dynamic parameter
                if (mbxId.startsWith("owner_remover")) {
                    const parts = mbxId.split("_");
                    const rarityPart = parts[parts.length - 1];
                    // Convert it to uppercase to match translation keys like UNCOMMON, RARE, etc.
                    const rarityKey = rarityPart.toUpperCase();
                    const rarityTranslation = inr(`itemsNrecipes.rarity.${rarityKey}`, { defaultValue: rarityKey });
                    translationLore = t("mbx.items.owner_remover.lore", {
                        key0: rarityTranslation,
                        defaultValue: ""
                    });
                    translationDescription = t("mbx.items.owner_remover.name", {
                        key0: rarityTranslation,
                        defaultValue: ""
                    });
                } else {
                    translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                }
                break;
            case "farming_resource": {
                const parts = mbxId.split("_");
                const typePart = parts[0];
                const resourcePart = parts[parts.length - 1];
                let farmingResourceTranslation: string= "";
                switch (resourcePart) {
                    case "wart":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.nether_wart`, { defaultValue: "" });
                        break;
                    case "cane":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sugar_cane`, { defaultValue: "" });
                        break;
                    case "berries":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sweet_berries`, { defaultValue: "" });
                        break;
                    case "beans":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.cocoa_beans`, { defaultValue: "" });
                        break;
                    case "slice":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.melon_slice`, { defaultValue: "" });
                        break;
                    default:
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.${resourcePart}`, { defaultValue: "" });
                        break;
                }
                translation = t(`mbx.items.container.${typePart}`, { 
                    key0: farmingResourceTranslation,
                    defaultValue: ""
                });
                break;
            }
            case "harvester": {
                const item = mbxId.replace(/^harvester_/, "");
                const parts = item.split("_");
                const typePart = parts[parts.length - 1];
                const resourcePart = parts[0];
                let farmingResourceTranslation: string= "";
                switch (resourcePart) {
                    case "nether":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.nether_wart`, { defaultValue: "" });
                        break;
                    case "sugar":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sugar_cane`, { defaultValue: "" });
                        break;
                    case "sweet":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sweet_berries`, { defaultValue: "" });
                        break;
                    case "cacao":
                    case "melon":
                    case "wheat":
                    case "beetroot":
                    case "potato":
                    case "carrot":
                    case "cactus":
                    case "pumpkin":
                    case "cocoa":
                    case "bamboo":
                    case "kelp":
                        farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.${resourcePart}`, { defaultValue: "" });
                        break;
                    default:
                        break;
                }
                switch (typePart) {
                    case "reaper":
                        translationLore = t(`mbx.items.reaper.lore`, { 
                            key0: farmingResourceTranslation,
                            defaultValue: "" });
                        translationDescription = t(`mbx.items.reaper.description`, { 
                            key: farmingResourceTranslation,
                            defaultValue: "" });
                        break;
                    case "chopper":
                        translationLore = t(`mbx.items.chopper.lore`, { 
                            key0: farmingResourceTranslation,
                            defaultValue: "" });
                        translationDescription = t(`mbx.items.chopper.description`, { 
                            key: farmingResourceTranslation,
                            defaultValue: "" });
                        break;
                    case "wart":
                    case "cane":
                    case "berries":
                    case "cacao":
                    case "melon":
                    case "wheat":
                    case "beetroot":
                    case "potato":
                    case "carrot":
                    case "cactus":
                    case "pumpkin":
                    case "cocoa":
                    case "bamboo":
                    case "kelp":
                        translationLore = t(`mbx.items.harvester.lore`, { 
                            key0: farmingResourceTranslation,
                            defaultValue: "" });
                        translationDescription = t(`mbx.items.harvester.description`, { 
                            key: farmingResourceTranslation,
                            defaultValue: "" });
                        break;
                    default:
                        translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                        translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                        break;
                }
                break;
            }
            case "infinite_bag": {
                const parts = mbxId.split("_");
                const typePart = parts[1];
                const resourcePart = parts[parts.length - 1];
                let farmingResourceCapacity: number;
                switch (resourcePart) {
                    case "kelp":
                    case "bamboo":
                        farmingResourceCapacity = 130000;
                        break;
                    case "slice":
                        farmingResourceCapacity = 50000;
                        break;
                    case "shard":
                        farmingResourceCapacity = 40000;
                        break;
                    case "carrot":
                    case "patato":
                        farmingResourceCapacity = 35000;
                        break;
                    case "wart":
                    case "beans":
                    case "honeycomb":
                        farmingResourceCapacity = 30000;
                        break;
                    case "berries":
                        farmingResourceCapacity = 25000;
                        break;
                    case "cane":
                    case "cactus":
                        farmingResourceCapacity = 20000;
                        break;
                    default: // wheat, beetroot, pumpkin, red/brown mushroom
                        farmingResourceCapacity = 10000;
                        break;
                }
                switch (typePart) {
                    case "small":
                        translationLore = t(`mbx.items.infinite_bag.amount_inside`, { 
                            key0: farmingResourceCapacity,
                            defaultValue: ""
                        });
                        translationDescription = t(`mbx.items.infinite_bag.description`, { defaultValue: "" });
                        break;
                    default:
                        translationLore = t(`mbx.items.infinite_bag.amount_inside`, { 
                            key0: farmingResourceCapacity * 10,
                            defaultValue: ""
                        });
                        translationDescription = t(`mbx.items.infinite_bag.description`, { defaultValue: "" });
                        break;
                }
                break;
            }
            case "scroll": {
                const parts = mbxId.split("_");
                const typePart = parts[parts.length - 2];
                const statPart = parts[parts.length - 1];
                const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                translationLore = t(`mbx.items.scroll_point`, {
                    key0: statTranslation,
                    defaultValue: ""
                });
                translationDescription = t(`mbx.items.${lowerCategory}s_${typePart}.description`, {
                    key0: statTranslation,
                    defaultValue: ""
                });
                break;
            }
            case "candy":
                if (mbxId.startsWith("xmas") || mbxId.startsWith("halloween")) {
                    translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                } else {
                    const parts = mbxId.split("_");
                    const typePart = parts[parts.length - 2];
                    const statPart = parts[parts.length - 1];
                    if (statPart === "fly" || statPart === "speed") {
                        translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                        translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                    } else {
                        if (typePart === "candy") {
                            const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                            translationLore = t(`mbx.items.candies_big.lore`, {
                                key0: statTranslation,
                                defaultValue: ""
                            });
                            translationDescription = t(`mbx.items.candies_big.description`, {
                                key0: statTranslation,
                                defaultValue: ""
                            });
                        } else { // typePart = enchanted
                            const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                            translationLore = t(`mbx.items.candies_${typePart}.lore`, {
                                key0: statTranslation,
                                defaultValue: ""
                            });
                            translationDescription = t(`mbx.items.candies_${typePart}.description`, {
                                key0: statTranslation,
                                defaultValue: ""
                            });
                        }
                    }
                }
                break;
            case "rune":
                    if (mbxId.startsWith("rune_farmtrak")) {
                        translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                        translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                    } else {
                        const parts = mbxId.split("_");
                        const typePart = parts[parts.length - 2];
                        const statPart = parts[parts.length - 1];
                        const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                        translationLore = t(`mbx.items.${lowerCategory}s_${typePart}.lore`, {
                            key0: statTranslation,
                            defaultValue: ""
                        });
                        translationDescription = t(`mbx.items.${lowerCategory}s_${typePart}.description`, {
                            key0: statTranslation,
                            defaultValue: ""
                        });
                    }
                    break;
            case "soul":
            case "spawner":
                const creature = mbxId.replace(/^spawner_/, "").replace(/^soul_/, "");
                const bestiaryTranslation = mob(`bestiary.vanilla.${creature}`, { defaultValue: "" });
                translationLore = t(`mbx.items.${lowerCategory}.lore`, {
                    key0: bestiaryTranslation,
                    defaultValue: ""
                });
                translationDescription = t(`mbx.items.${lowerCategory}.description`, {
                    key0: bestiaryTranslation,
                    defaultValue: ""
                });
                break;
            case "treasure":
                // For treasure, check for "lny_envelope" prefix
                if (mbxId.startsWith("lny_envelope")) {
                    translationLore = t(`mbx.items.lny_envelope.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.lny_envelope.description`, { defaultValue: "" });
                } else if (mbxId.startsWith("xmas_present_")) {
                    const parts = mbxId.split("_");
                    const typePart = parts[parts.length - 2];
                    let colorPart = parts[parts.length - 1];
                    const colorTranslation = inr(`itemsNrecipes.color.${colorPart}`, { defaultValue: "" });
                    translationLore = t(`mbx.items.xmas_present_${typePart}.lore`, {
                        key0: colorTranslation,
                        defaultValue: ""
                    });
                    translationDescription = t(`mbx.items.xmas_present_${typePart}.description`, {
                        key0: colorTranslation,
                        defaultValue: ""
                    });
                } else {
                    translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                }
                break;
            case "skull":
                // For skulls, build the key as "mbx.items.skull_{mbxId}"
                if (mbxId.startsWith("basic")) {
                    translationLore = t(`mbx.items.skull_base.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.skull_base.description`, { defaultValue: "" });
                } else {
                    const cleanedMbxId = mbxId.replace(/_skull$/, "");
                    translationLore = t(`mbx.items.skull_${cleanedMbxId}.lore`, { defaultValue: "" });
                    translationDescription = t(`mbx.items.skull_${cleanedMbxId}.description`, { defaultValue: "" });
                }
                break;
            default:
                // Default fallback key
                translationLore = t(`mbx.items.${mbxId}.lore`, { defaultValue: "" });
                translationDescription = t(`mbx.items.${mbxId}.description`, { defaultValue: "" });
                break;
        }

        return (
            <span>
                {(translationLore || translationDescription) ? (
                    <div className="text-sm whitespace-pre-line">
                        {[
                        translationLore, 
                        translationDescription]
                        .filter(Boolean)
                        .join("\n\n")}
                    </div>
                    ) : (
                    // If nothing is available, show fallback message
                    <div className="text-xs font-bold">No Lore / Description</div>
                )}
            </span>
        );
    } 

    /* Type Name */
    else {
        if (mbxId === "null") {
            // 1. If no item is provided, build the key for category
            switch (lowerCategory) {
                case "bestiary":
                    // For "bestiary", use key "bestiary.title""
                    translation = mob(`bestiary.title`, { defaultValue: "" });
                    break;
                case "title":
                case "tag":
                case "profile_plate":
                case "nameplate":
                case "emote":
                case "balloon":
                    translation = t(`mbx.attributes.${lowerCategory}.name`, { defaultValue: "" });
                    break;
                case "furniture":
                case "skull":
                    translation = inr(`itemsNrecipes.category.${category}`, { defaultValue: "" });
                    break;
                default: 
                    // Default fallback key
                    translation = museum(`museum.category.${category}`, { defaultValue: "" });
                    break;
            }
        } else {
            // 2. If mbxId is not "null", determine the path based on the category
            switch (lowerCategory) {
                case "stats":
                    const lowerMbxId = mbxId ? mbxId.toLowerCase() : "";
                    translation = t(`mbx.stats.${lowerMbxId}`, { defaultValue: "" });
                    break;
                case "skill":
                    translation = t(`mbx.skills.${mbxId.toLowerCase()}.name`, { defaultValue: "" });
                    break;
                case "bestiary":
                    // For "bestiary", use key "mbx.bestiary.{mbxId}"
                    translation = t(`mbx.${lowerCategory}.${mbxId}`, { defaultValue: "" });
                    break;
                case "title":
                case "tag":
                case "profile_plate":
                case "nameplate":
                case "emote":
                case "balloon":
                    // For these categories, use key "mbx.attributes.{category}.{mbxId}"
                    translation = t(`mbx.attributes.${lowerCategory}.${mbxId}.title`, { defaultValue: "" });
                    break;
                case "utility_block":
                    // For "utility_block", check the beginning of mbxId
                    if (mbxId.startsWith("block_compactor")) {
                        const parts = mbxId.split("_");
                        const typePart = parts[parts.length - 1];
                        const resourceTranslation = t(`mbx.item_category.resource`, { defaultValue: "" });
                        const typePartTranslation = t(`mbx.items.container.${typePart}`, { 
                            key0: resourceTranslation,
                            defaultValue: ""
                        });
                        translation = t(`mbx.items.block_compactor.name`, {
                            key0: typePartTranslation,
                            defaultValue: ""
                        });
                    } else if (mbxId.startsWith("block_teleporter")) {
                        const parts = mbxId.split("_");
                        let colorPart = parts[parts.length - 1];
                        const colorTranslation = inr(`itemsNrecipes.color.${colorPart}`, { defaultValue: "" });
                        translation = t("mbx.items.block_teleporter.name", { 
                            key0: colorTranslation,
                            defaultValue: ""
                        });
                    } else if (mbxId.startsWith("mm-workshop_")) {
                        const parts = mbxId.split("_");
                        let jobPart = parts[parts.length - 2];
                        jobPart = jobPart.charAt(0).toUpperCase() + jobPart.slice(1);
                        const smallTranslation = inr("itemsNrecipes.small", { defaultValue: "" });
                        translation = t(`mbx.items.workshop.name`, {
                            key0: smallTranslation,
                            key1: jobPart,
                            defaultValue: ""
                        });
                    } else {
                        translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    }
                    break;
                case "edible":
                    // For edible items, if mbxId starts with "owner_remover", use that specific key
                    if (mbxId.startsWith("owner_remover")) {
                        const parts = mbxId.split("_");
                        const rarityPart = parts[parts.length - 1];
                        const rarityKey = rarityPart.toUpperCase();
                        const rarityTranslation = inr(`itemsNrecipes.rarity.${rarityKey}`, { defaultValue: rarityKey });
                        translation = t("mbx.items.owner_remover.name", {
                            key0: rarityTranslation,
                            defaultValue: ""
                        });
                    } else {
                        translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    }
                    break;
                case "farming_resource": {
                    const parts = mbxId.split("_");
                    const typePart = parts[0];
                    const resourcePart = parts[parts.length - 1];
                    let farmingResourceTranslation: string= "";
                    switch (resourcePart) {
                        case "wart":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.nether_wart`, { defaultValue: "" });
                            break;
                        case "cane":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sugar_cane`, { defaultValue: "" });
                            break;
                        case "berries":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sweet_berries`, { defaultValue: "" });
                            break;
                        case "beans":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.cocoa_beans`, { defaultValue: "" });
                            break;
                        case "slice":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.melon_slice`, { defaultValue: "" });
                            break;
                        default:
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.${resourcePart}`, { defaultValue: "" });
                            break;
                    }
                    translation = t(`mbx.items.container.${typePart}`, { 
                        key0: farmingResourceTranslation,
                        defaultValue: ""
                    });
                    break;
                }
                case "harvester": {
                    const item = mbxId.replace(/^harvester_/, "");
                    const parts = item.split("_");
                    const typePart = parts[parts.length - 1];
                    const resourcePart = parts[0];
                    let farmingResourceTranslation: string= "";
                    switch (resourcePart) {
                        case "nether":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.nether_wart`, { defaultValue: "" });
                            break;
                        case "sugar":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sugar_cane`, { defaultValue: "" });
                            break;
                        case "sweet":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sweet_berries`, { defaultValue: "" });
                            break;
                        case "cacao":
                        case "melon":
                        case "wheat":
                        case "beetroot":
                        case "potato":
                        case "carrot":
                        case "cactus":
                        case "pumpkin":
                        case "cocoa":
                        case "bamboo":
                        case "kelp":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.${resourcePart}`, { defaultValue: "" });
                            break;
                        default:
                            break;
                    }
                    switch (typePart) {
                        case "reaper":
                            translation = t(`mbx.items.reaper.name`, { 
                                key0: farmingResourceTranslation,
                                defaultValue: "" });
                            break;
                        case "chopper":
                            translation = t(`mbx.items.chopper.name`, { 
                                key0: farmingResourceTranslation,
                                defaultValue: "" });
                            break;
                        case "wart":
                        case "cane":
                        case "berries":
                        case "cacao":
                        case "melon":
                        case "wheat":
                        case "beetroot":
                        case "potato":
                        case "carrot":
                        case "cactus":
                        case "pumpkin":
                        case "cocoa":
                        case "bamboo":
                        case "kelp":
                            translation = t(`mbx.items.harvester.name`, { 
                                key0: farmingResourceTranslation,
                                defaultValue: "" });
                            break;
                        default:
                            translation = t(`mbx.items.${mbxId}.name`, { defaultValue: "" });
                            break;
                    }
                    break;
                }
                case "infinite_bag": {
                    const parts = mbxId.split("_");
                    const typePart = parts[1];
                    const resourcePart = parts[parts.length - 1];
                    let farmingResourceTranslation: string= "";
                    switch (resourcePart) {
                        case "wart":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.nether_wart`, { defaultValue: "" });
                            break;
                        case "cane":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sugar_cane`, { defaultValue: "" });
                            break;
                        case "berries":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.sweet_berries`, { defaultValue: "" });
                            break;
                        case "beans":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.cocoa_beans`, { defaultValue: "" });
                            break;
                        case "slice":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.melon_slice`, { defaultValue: "" });
                            break;
                        case "shard":
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.amethyst_shard`, { defaultValue: "" });
                            break;
                        case "mushroom":
                            if (parts[parts.length - 2] === "red") {
                                farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.red_mushroom`, { defaultValue: "" });
                            } else {
                                farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.brown_mushroom`, { defaultValue: "" });
                            }
                            break;
                        default:
                            farmingResourceTranslation = inr(`itemsNrecipes.farming_resource.${resourcePart}`, { defaultValue: "" });
                            break;
                    }
                    switch (typePart) {
                        case "small":
                            translation = t(`mbx.items.haversack_small.name`, { 
                                key0: farmingResourceTranslation,
                                defaultValue: ""
                            });
                            break;
                        default:
                            translation = t(`mbx.items.haversack.name`, { 
                                key0: farmingResourceTranslation,
                                defaultValue: ""
                            });
                            break;
                    }
                    break;
                }
                case "scroll": {
                    const parts = mbxId.split("_");
                    const typePart = parts[parts.length - 2];
                    const statPart = parts[parts.length - 1];
                    const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                    translation = t(`mbx.items.${lowerCategory}s_${typePart}.name`, {
                        key0: statTranslation,
                        defaultValue: ""
                    });
                    break;
                }
                case "candy":
                    if (mbxId.startsWith("xmas") || mbxId.startsWith("halloween")) {
                        translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    } else {
                        const parts = mbxId.split("_");
                        const typePart = parts[parts.length - 2];
                        const statPart = parts[parts.length - 1];
                        if (statPart === "fly" || statPart === "speed") {
                            translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                        } else {
                            if (typePart === "candy") {
                                const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                                translation = t(`mbx.items.candies_big.name`, {
                                    key0: statTranslation,
                                    defaultValue: ""
                                });
                            } else { // typePart = enchanted
                                const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                                translation = t(`mbx.items.candies_${typePart}.name`, {
                                    key0: statTranslation,
                                    defaultValue: ""
                                });
                            }
                        }
                    }
                    break;
                case "rune":
                    if (mbxId.startsWith("rune_farmtrak")) {
                        translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    } else {
                        const parts = mbxId.split("_");
                        const typePart = parts[parts.length - 2];
                        const statPart = parts[parts.length - 1];
                        const statTranslation = t(`mbx.stats.${statPart}`, { defaultValue: "" });
                        translation = t(`mbx.items.${lowerCategory}s_${typePart}.name`, {
                            key0: statTranslation,
                            defaultValue: ""
                        });
                    }
                    break;
                case "soul":
                case "spawner":
                    const creature = mbxId.replace(/^spawner_/, "").replace(/^soul_/, "");
                    const bestiaryTranslation = mob(`bestiary.vanilla.${creature}`, { defaultValue: "" });
                    translation = t(`mbx.items.${lowerCategory}.name`, {
                        key0: bestiaryTranslation,
                        defaultValue: ""
                    });
                    break;
                case "treasure":
                    // For treasure, check for "lny_envelope" prefix
                    if (mbxId.startsWith("lny_envelope")) {
                        const parts = mbxId.split("_");
                        let colorPart = parts[parts.length - 1];
                        const colorTranslation = inr(`itemsNrecipes.color.${colorPart}`, { defaultValue: "" });
                        translation = t("mbx.items.lny_envelope.name", {
                            key0: colorTranslation,
                            defaultValue: ""
                        });
                    } else if (mbxId.startsWith("xmas_present_")) {
                        const parts = mbxId.split("_");
                        const typePart = parts[parts.length - 2];
                        let colorPart = parts[parts.length - 1];
                        const colorTranslation = inr(`itemsNrecipes.color.${colorPart}`, { defaultValue: "" });
                        translation = t(`mbx.items.xmas_present_${typePart}.name`, {
                            key0: colorTranslation,
                            defaultValue: ""
                        });
                    } else {
                        translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    }
                    break;
                case "skull":
                    // For skulls, build the key as "mbx.items.skull_{mbxId}"
                    if (mbxId.startsWith("basic")) {
                        translation = t(`mbx.items.skull_base.${type}`, { defaultValue: "" });
                    } else {
                        const cleanedMbxId = mbxId.replace(/_skull$/, "");
                        translation = t(`mbx.items.skull_${cleanedMbxId}.${type}`, { defaultValue: "" });
                    }
                    break;
                default:
                    // Default fallback key
                    translation = t(`mbx.items.${mbxId}.${type}`, { defaultValue: "" });
                    break;
            }
        }
    }
    
    if (translation !== "") {
        return <span>{translation}</span>;
    } else {
        let cancelled=false;
        let backupTranslation: string = "";
        let lastBackupTranslation = 
            mbxId
                .replace(/[-_]/g, " ")
                .split(" ")
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ");
        let paramLoading = false;
        let paramError = null;
        (async () => {
            // Retrieve the locale from i18next, then navigator, or default to "en"
            let locale = "en";
            try {
                const i18nModule = await import("i18next");
                locale =
                    i18nModule?.default?.language ||
                    navigator.language?.split("-")[0] ||
                    "en";
            } catch {
                locale = navigator.language?.split("-")[0] || "en";
            }

            fetch(
                `https://api.minebox.co/item/${encodeURIComponent(
                    mbxId
                )}?locale=${encodeURIComponent(locale)}`
            )
                .then((res) => {
                    if (!res.ok) throw new Error(`API ${res.status}`);
                    return res.json();
                })
                .then((data) => {
                    if (cancelled) return;
                    backupTranslation=(data?.type ?? null);
                })
                .catch((err) => {
                    if (cancelled) return;
                    backupTranslation = "";
                    paramError=(err instanceof Error ? err.message : String(err));
                })
                .finally(() => {
                    if (!cancelled) {
                        paramLoading = false;
                    }
                });
            }
        )();
        cancelled = true;
        return (
            <span>
                {paramLoading ? (
                    // Display a single loading message if either is loading
                    <div className="text-gray-400">Loading...</div>
                ) : backupTranslation ? (
                    <div className="text-sm whitespace-pre-line">{backupTranslation}</div>
                ) : paramError ? (
                    <div className="text-sm text-gray-400">{paramError}</div>
                ) : (
                    // If nothing is available, show fallback message
                    <div className="text-xs font-bold">{lastBackupTranslation}</div>
                )}
            </span>
        );
    }
}

export default ItemTranslation;