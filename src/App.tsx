/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { AppRoutes } from "@routes/index";
import { useEffect, useRef } from "react";
import ReactGA from "react-ga4";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./i18n";

import ErrorBoundary from "@components/preview/ErrorBoundary";
import { isDev } from "@utils/helper";
import NewYear2026 from "@components/effects/NewYear2026";

const GA_MEASUREMENT_ID = "G-1E5DGV7ZFK";

function GA4Tracking() {
    const location = useLocation();
    const initialized = useRef(false);

    useEffect(() => {
        if (isDev()) {
            console.log("Dev mode: Google Analytics disabled");
            return;
        }
        if (!initialized.current) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
            initialized.current = true;
        }

        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location.pathname, location.search]);

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
                {/* <NewYear2026 /> */}
                <div className="max-w-screen w-full overflow-x-hidden">
                    <AppRoutes />
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    );
}
