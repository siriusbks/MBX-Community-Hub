/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import ErrorBoundary from "@components/preview/ErrorBoundary";
import { AppRoutes } from "@routes/index";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

export default function App() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error("Logging error to external service:", event.error);
        };

        window.addEventListener("error", handleError);
        return () => {
            window.removeEventListener("error", handleError);
        };
    }, []);

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <div className="max-w-screen w-full overflow-x-hidden">
                    <AppRoutes />
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    );
}
