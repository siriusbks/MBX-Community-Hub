import { useEffect, useRef } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import { isDev } from "@utils/helper";

const GA_MEASUREMENT_ID = "G-1E5DGV7ZFK";

export function GA4Tracking() {
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
