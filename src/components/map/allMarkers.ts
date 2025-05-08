/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import spawnMarkers from "./markers/spawnMarkers";
import homeIslandMarkers from "./markers/homeIslandMarkers";
import netherIslandMarkers from "./markers/netherIslandMarkers";
import endIslandMarkers from "./markers/endIslandMarkers";
import kokokoMarkers from "./markers/kokokoMarkers";
import quadraMarkers from "./markers/quadraMarkers";
import bambooMarkers from "./markers/bambooMarkers";
import frostbiteMarkers from "./markers/frostbiteMarkers";
import sandwhisperMarkers from "./markers/sandwhisperMarkers";

const allMarkers: Record<string, Record<string, any>> = {
    spawn: spawnMarkers,
    home_island: homeIslandMarkers,
    nether_island: netherIslandMarkers,
    end_island: endIslandMarkers,
    kokoko: kokokoMarkers,
    quadra_plains: quadraMarkers,
    bamboo_peak: bambooMarkers,
    frostbite_fortress: frostbiteMarkers,
    sandwhisper_dunes: sandwhisperMarkers,
};

export default allMarkers;
