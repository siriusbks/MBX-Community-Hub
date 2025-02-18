/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import spawnMarkers from "./spawnMarkers";
import homeIslandMarkers from "./homeIslandMarkers";
import netherIslandMarkers from "./netherIslandMarkers";
import kokokoMarkers from "./kokokoMarkers";
import quadraMarkers from "./quadraMarkers";
import bambooMarkers from "./bambooMarkers";
import frostbiteMarkers from "./frostbiteMarkers";
import sandwhisperMarkers from "./sandwhisperMarkers";

const allMarkers: Record<string, Record<string, any>> = {
    spawn: spawnMarkers,
    home_island: homeIslandMarkers,
    nether_island: netherIslandMarkers,
    kokoko: kokokoMarkers,
    quadra_plains: quadraMarkers,
    bamboo_peak: bambooMarkers,
    frostbite_fortress: frostbiteMarkers,
    sandwhisper_dunes: sandwhisperMarkers,
};

export default allMarkers;
