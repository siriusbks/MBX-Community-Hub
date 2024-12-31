/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Layout } from "@components/Layout";
import { ProfilePage } from "@routes/ProfilePage";
import { Route, Routes } from "react-router-dom";

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout>
                        <ProfilePage />
                    </Layout>
                }
            />
            {/*<Route path="/map" element={
        <Layout>
          <MapPage />
        </Layout>
      } /> - feature route map */}
        </Routes>
    );
}
