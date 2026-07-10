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
import type { Equipment } from "types/equipment";

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

/**
 * Instead of writing full item/skull ids (often 20+ characters, e.g.
 * "basic_intelligence_helmet") in the URL, we write their *index* in the
 * already-loaded `equipment`/`SKULLS` lists, base36-encoded (1-2 chars for
 * item indexes, 1 char for skull indexes). This assumes the equipment
 * catalog's ordering is stable between sharing and opening a link, which
 * holds as long as the item list itself hasn't changed (useEquipment always
 * sorts the same way).
 */
export function encodeBuildToUrlValue(build: SharedBuild, equipment: Equipment[]): string {
    const indexById = new Map(equipment.map((item, index) => [item.id, index]));

    const itemsPart = SLOT_ORDER.map((slotId) => {
        const id = build.items[slotId];
        if (!id) return "";
        const index = indexById.get(id);
        return index !== undefined ? toBase36(index) : "";
    }).join(",");

    const skullsPart = build.skulls
        .map((id) => {
            const index = SKULLS.findIndex((s) => s.id === id);
            return index >= 0 ? toBase36(index) : "";
        })
        .join("");

    const traitCode = TRAIT_CODES[build.pet.trait] ?? "-";
    const petPart = `${build.pet.generation}${traitCode}${build.pet.enchanted ? 1 : 0}`;
    const flags = `${build.pass ? 1 : 0}${build.tab === "craft" ? "c" : "s"}`;

    return [itemsPart, skullsPart, petPart, flags].join("|");
}

export function decodeBuildFromUrlValue(value: string, equipment: Equipment[]): SharedBuild | null {
    try {
        const [itemsPart, skullsPart = "", petPart = "", flags = ""] = value.split("|");
        if (itemsPart === undefined) return null;

        const itemCodes = itemsPart.split(",");
        const items: Record<string, string | null> = {};
        SLOT_ORDER.forEach((slotId, slotIndex) => {
            const code = itemCodes[slotIndex];
            items[slotId] = code ? equipment[fromBase36(code)]?.id ?? null : null;
        });

        const skulls = skullsPart
            .split("")
            .map((code) => SKULLS[fromBase36(code)]?.id)
            .filter((id): id is string => !!id);

        const genChar = petPart[0] ?? "1";
        const traitChar = petPart[1] ?? "-";
        const enchChar = petPart[2] ?? "0";

        return {
            v: 1,
            items,
            skulls,
            pass: flags[0] === "1",
            pet: {
                generation: Number(genChar) || 1,
                trait: traitChar === "-" ? "" : TRAIT_CODES_REVERSE[traitChar] ?? "",
                enchanted: enchChar === "1",
            },
            tab: flags[1] === "c" ? "craft" : "stats",
        };
    } catch {
        return null;
    }
}