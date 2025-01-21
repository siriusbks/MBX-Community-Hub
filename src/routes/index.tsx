/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Layout } from "@components/Layout";
import { FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/homePage"));

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
        </Routes>
    </Suspense>
);
