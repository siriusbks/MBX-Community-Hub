/*
 * MBX, Community Based Project
 * Copyright (c) 2026 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@components/Navbar";
import { Footer } from "@components/Footer";

export const RootLayout: FC = () => {
    const fallback = <div className="text-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-6 py-8">
                <Suspense fallback={fallback}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};