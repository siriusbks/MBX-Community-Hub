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
        const handleError = (error: Error) => {
            console.error("Logging error to external service:", error);
        };

        window.addEventListener("error", (event) => handleError(event.error));
        return () => {
            window.removeEventListener("error", (event) =>
                handleError(event.error)
            );
        };
    }, []);

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <AppRoutes />
            </ErrorBoundary>
        </BrowserRouter>
    );
}
