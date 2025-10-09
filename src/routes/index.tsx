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

const EquipPage = lazy(() => import("@routes/EquipPage"));
const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const InfoMapPage = lazy(() => import("@routes/InfoMapPage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/HomePage"));
const CommunityPage = lazy(() => import("@routes/CommunityPage"));
const MuseumPage = lazy(() => import("@routes/MuseumPage"));

export const AppRoutes: FC = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-8">
            <Suspense
                fallback={
                    <div className="text-center text-white">Loading...</div>
                }
            >
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/map" element={<InfoMapPage />} />
                    <Route path="/mappage" element={<MapPage />} />
                    <Route path="/equipment" element={<EquipPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    {/*<Route path="/museum" element={<MuseumPage />} />*/}
                </Routes>
            </Suspense>
        </main>

        {/* Footer */}
        <Footer />
    </div>
);
