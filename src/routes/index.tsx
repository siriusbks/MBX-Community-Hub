/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar } from "@components/Navbar";
import { Footer } from "@components/Footer";

const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const InfoMapPage = lazy(() => import("@routes/InfoMapPage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/HomePage"));
const CommunityPage = lazy(() => import("@routes/CommunityPage"));

export const AppRoutes: FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
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
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/map" element={<InfoMapPage />} />
                    <Route path="/mappage" element={<MapPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                </Routes>
            </Suspense>
        </main>

        {/* Footer */}
        <Footer />
    </div>
);
