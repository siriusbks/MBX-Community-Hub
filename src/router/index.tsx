/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { RootLayout } from "@layouts/RootLayout";
import NotFound from "@pages/NotFound";
import HalloweenPage from "@pages/Halloween2025";
import BestiaryPage from "@pages/BestiaryPage";
import ChristmasPage from "@pages/Christmas2025";
import ComingSoon from "@pages/ComingSoon";
import ClassesAndSpellsPage from "@pages/ClassesAndSpells";

const EquipPage = lazy(() => import("@pages/EquipPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));
const InfoMapPage = lazy(() => import("@pages/InfoMapPage"));
const MapPage = lazy(() => import("@pages/MapPage"));
const HomePage = lazy(() => import("@pages/HomePage"));
const CommunityPage = lazy(() => import("@pages/CommunityPage"));
const MuseumPage = lazy(() => import("@pages/MuseumPage"));
const ItemsNRecipesPage = lazy(() => import("@pages/ItemsNRecipesPage"));
const CraftPlannerPage = lazy(() => import("@pages/CraftPlannerPage"));

export const AppRoutes: FC = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />
                
                {/* Maps */}
                <Route path="/map" element={<InfoMapPage />} />
                <Route path="/mappage" element={<MapPage />} />

                {/* Codex */}
                <Route path="/bestiary" element={<BestiaryPage />} />
                <Route path="/classAndSpells" element={<ClassesAndSpellsPage />} />
                <Route path="/expeditions" element={<ComingSoon />} />
                <Route path="/itemsNrecipes" element={<ItemsNRecipesPage />} />

                {/* Tools */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/equipment" element={<EquipPage />} />
                <Route path="/craftPlanner" element={<CraftPlannerPage />}/>
                <Route path="/museum" element={<MuseumPage />} />

                {/* Community */}
                <Route path="/community" element={<CommunityPage />} />

                {/* Archives */}
                <Route path="archives/christmas" element={<ChristmasPage />} />
                <Route path="archives/halloween" element={<HalloweenPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};