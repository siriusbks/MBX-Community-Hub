/*
 * MBX, Community Based Project
 * Copyright (c) 2026 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { TFunction } from "i18next";

export const STATS = [
  { key: "HEALTH", color: "#e32045" },
  { key: "AGILITY", color: "#87c263" },
  { key: "STRENGTH", color: "#59360b" },
  { key: "INTELLIGENCE", color: "#e2402a" },
  { key: "WISDOM", color: "#866df3" },
  { key: "LUCK", color: "#7dcdfc" },
  { key: "FORTUNE", color: "#f4923f" },
  { key: "DEFENSE", color: "#cccccc" },

  // New Stats
  { key: "ATTACK_SPEED", color: "#d7bf71" },
  { key: "ENDURANCE", color: "#28a12c" },
  { key: "CHARISMA", color: "#d15fb4" },
  { key: "MOVEMENT_SPEED", color: "#87ceeb" },
  { key: "DEXTERITY", color: "#e0e0e0" },
  { key: "VITALITY", color: "#4caf50" },
  { key: "ENERGY", color: "#edba21" },

  { key: "FARMING_FORTUNE", color: "#7bc74d" },
  { key: "WOODCUTTING_FORTUNE", color: "#8b6914" },
  { key: "MINING_FORTUNE", color: "#a0826d" },
  { key: "FISHING_FORTUNE", color: "#5b9bd5" },
  { key: "GATHERING_FORTUNE", color: "#e05555" },
  { key: "LOOTING_FORTUNE", color: "#10b981" },
] as const;

export function getStatLabel(stat: string, t: TFunction<"common">): string {
  const statInfo = STATS.find((s) => s.key === stat);
  return statInfo ? t(`common:stats.${statInfo.key}`) : stat;
}

export function getStatColor(stat: string): string {
  const statInfo = STATS.find((s) => s.key === stat);
  return statInfo ? statInfo.color : "#fff";
}

export function getStatIconURL(stat: string): string {
  const statInfo = STATS.find((s) => s.key === stat);
  return statInfo ? `/assets/media/elemental/${statInfo.key.toLowerCase()}.png` : "/assets/media/elemental/defense.png"; 
}

export function getRarityStyle(rarity: string): string {
  if(rarity === "TRASH") return "bg-[#422b1b30] border-x-[#422b1b] border-y-[#7e7867] border-[3px]";
  if(rarity === "COMMON") return "bg-[#20252c50] border-x-[#d2d2d3] border-y-[#9ea59f] border-[3px]";
  if(rarity === "UNCOMMON") return "bg-[#07ff7b20] border-x-[#07ff7b] border-y-[#00dca8] border-[3px]";
  if(rarity === "RARE") return "bg-[#2dd0d915] border-x-[#2dd0d9] border-y-[#2291b9] border-[3px]";
  if(rarity === "EPIC") return "bg-[#c507ff20] border-x-[#c507ff] border-y-[#dc00ce] border-[3px]";
  if(rarity === "LEGENDARY") return "bg-[#ffbf6620] border-x-[#ffbf66] border-y-[#f59b20] border-[4px]";
  if(rarity === "MYTHIC") return "bg-[#c9324b20] border-x-[#c9324b] border-y-[#961f32] border-[5px]";
  if(rarity === "CONTRABAND") return "bg-[#2a212c40] border-x-[#521283] border-y-[#9816fc] border-[5px]";
  return "bg-[#11415f30] border-x-[#457192] border-y-[#55a0ac] border-[3px]";
}