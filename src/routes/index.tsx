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
const ItemsNRecipesPage = lazy(() => import("@routes/ItemsNRecipesPage"));

export const AppRoutes: FC = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-8">
                {/* LOOK WEIRD BUT MAYBE CAN HELP WITH CHROME ERRORS */}
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <ProfilePage />
                        </Suspense>
                        } />
                    <Route path="/map" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <InfoMapPage />
                        </Suspense>
                        } />
                    <Route path="/mappage" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <MapPage />
                        </Suspense>
                        } />
                    <Route path="/equipment" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <EquipPage />
                        </Suspense>
                        } />
                    <Route path="/community" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <CommunityPage />
                        </Suspense>
                        } />
                    <Route path="/museum" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <MuseumPage />
                        </Suspense>
                        } />
                    <Route path="/itemsNrecipes" element={
                        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                        <ItemsNRecipesPage />
                        </Suspense>
                        } />
                </Routes>
        </main>

        {/* Footer */}
        <Footer />
    </div>
);