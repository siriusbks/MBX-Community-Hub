/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 *
 * Encodes/decodes an equipment build into a compact URL-friendly string
 * (used by the "Share" button on the Equipment page).
 */

import { EQUIPMENT_SLOTS } from "@const/equipmentSlots";
import { SKULLS } from "@const/skulls";
 
export type RightTab = "stats" | "craft";
 
export type SharedBuild = {
    v: 1;
    items: Record<string, string | null>;
    skulls: string[];
    pass: boolean;
    pet: {
        generation: number;
        trait: string;
        enchanted: boolean;
    };
    classTier: number;
    tab?: RightTab;
};
 
// Fixed slot order used to encode/decode builds positionally instead of
// repeating each slot's name as a JSON key.
const SLOT_ORDER = EQUIPMENT_SLOTS.map((s) => s.id);
 
// Single-letter codes for pet traits (fixed width: always exactly 1 char,
// "-" means "no trait selected").
const TRAIT_CODES: Record<string, string> = {
    mining: "m",
    woodcutting: "w",
    gathering: "g",
    slaining: "s",
    fishing: "f",
    farming: "r",
    crafting: "c",
    eating: "e",
};
const TRAIT_CODES_REVERSE: Record<string, string> = Object.fromEntries(
    Object.entries(TRAIT_CODES).map(([trait, code]) => [code, trait])
);
 
const toBase36 = (n: number) => n.toString(36);
const fromBase36 = (s: string) => parseInt(s, 36);
 
export function encodeBuildToUrlValue(build: SharedBuild): string {
    const itemsPart = SLOT_ORDER.map((slotId) => {
        const id = build.items[slotId];
        if (!id) return "";
 
        if (slotId === "pet") {
            const traitCode = TRAIT_CODES[build.pet.trait] ?? "-";
            return `${id}:${build.pet.generation}${traitCode}${build.pet.enchanted ? 1 : 0}`;
        }
 
        if (slotId === "class") {
            return `${id}:${build.classTier || 1}`;
        }
 
        return id;
    }).join(",");
 
    const skullsPart = build.skulls
        .map((id) => {
            const index = SKULLS.findIndex((s) => s.id === id);
            return index >= 0 ? toBase36(index) : "";
        })
        .join("");
 
    const flags = `${build.pass ? 1 : 0}${build.tab === "craft" ? "c" : "s"}`;
 
    return [itemsPart, skullsPart, flags].join("|");
}
 
export function decodeBuildFromUrlValue(value: string): SharedBuild | null {
    try {
        const [itemsPart, skullsPart = "", flags = ""] = value.split("|");
        if (itemsPart === undefined) return null;
 
        const itemTokens = itemsPart.split(",");
        const items: Record<string, string | null> = {};
 
        let petGeneration = 1;
        let petTrait = "";
        let petEnchanted = false;
        let classTier = 1;
 
        SLOT_ORDER.forEach((slotId, slotIndex) => {
            const token = itemTokens[slotIndex];
            if (!token) {
                items[slotId] = null;
                return;
            }
 
            const [id, extra] = token.split(":");
            items[slotId] = id || null;
 
            if (slotId === "pet" && extra) {
                const genChar = extra[0] ?? "1";
                const traitChar = extra[1] ?? "-";
                const enchChar = extra[2] ?? "0";
                petGeneration = Number(genChar) || 1;
                petTrait = traitChar === "-" ? "" : TRAIT_CODES_REVERSE[traitChar] ?? "";
                petEnchanted = enchChar === "1";
            }
 
            if (slotId === "class" && extra) {
                classTier = Number(extra) || 1;
            }
        });
 
        const skulls = skullsPart
            .split("")
            .map((code) => SKULLS[fromBase36(code)]?.id)
            .filter((id): id is string => !!id);
 
        return {
            v: 1,
            items,
            skulls,
            pass: flags[0] === "1",
            pet: { generation: petGeneration, trait: petTrait, enchanted: petEnchanted },
            classTier,
            tab: flags[1] === "c" ? "craft" : "stats",
        };
    } catch {
        return null;
    }
}