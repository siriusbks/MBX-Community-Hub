/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { AppRoutes } from "@routes/index";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { BrowserRouter, useLocation } from "react-router-dom";

import ErrorBoundary from "@components/preview/ErrorBoundary";

const GA_MEASUREMENT_ID = "G-1E5DGV7ZFK";

function GA4Tracking() {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location.pathname]);

    return null;
}

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
                <GA4Tracking />
                <div className="max-w-screen w-full overflow-x-hidden">
                    <AppRoutes />
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    );
}
