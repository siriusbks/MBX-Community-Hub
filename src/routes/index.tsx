/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Layout } from "@components/Layout";
import { FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { EquipPage } from "./EquipPage";

const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/HomePage"));

export const AppRoutes: FC = () => (
    <Suspense
        fallback={<div className="text-center text-white">Loading...</div>}
    >
        <Routes>
            <Route
                path="/"
                element={
                    <Layout>
                        <HomePage />
                    </Layout>
                }
            />
            <Route
                path="/profile"
                element={
                    <Layout>
                        <ProfilePage />
                    </Layout>
                }
            />
            <Route
                path="/map"
                element={
                    <Layout>
                        <MapPage />
                    </Layout>
                }
            />
            <Route
                path="/equipment"
                element={
                    <Layout>
                        <EquipPage />
                    </Layout>
                }
            />
        </Routes>
    </Suspense>
);
