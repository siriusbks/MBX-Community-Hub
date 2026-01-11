/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "@components/Navbar";
import { Footer } from "@components/Footer";
import NotFound from "./NotFound";
import HalloweenPage from "./Halloween2025";
import BestiaryPage from "./BestiaryPage";
import ChristmasPage from "./Christmas2025";

const EquipPage = lazy(() => import("@routes/EquipPage"));
const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const InfoMapPage = lazy(() => import("@routes/InfoMapPage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/HomePage"));
const CommunityPage = lazy(() => import("@routes/CommunityPage"));
const MuseumPage = lazy(() => import("@routes/MuseumPage"));
const ItemsNRecipesPage = lazy(() => import("@routes/ItemsNRecipesPage"));

export const AppRoutes: FC = () => {
    const fallback = <div className="text-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-6 py-8">
                <Suspense fallback={fallback}>
                    <Routes>
                        <Route path="*" element={<NotFound />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/map" element={<InfoMapPage />} />
                        <Route path="/mappage" element={<MapPage />} />
                        <Route path="/equipment" element={<EquipPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/museum" element={<MuseumPage />} />
                        <Route path="/bestiary" element={<BestiaryPage />} />
                        <Route
                            path="/itemsNrecipes"
                            element={<ItemsNRecipesPage />}
                        />



                        <Route path="archives/christmas" element={<ChristmasPage />} />
                        <Route path="archives/halloween" element={<HalloweenPage />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};
