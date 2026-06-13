import { AppRoutes } from "./router/index";
import { useEffect, useRef, Suspense } from "react";
import ReactGA from "react-ga4";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "@components/theme-provider";
import { Navbar } from "@components/Navbar";
import { Footer } from "@components/Footer";
import "./i18n";
import { isDev } from "@utils/helper";
import { Ripple } from "@components/ripple";
import { TooltipProvider } from "@components/ui/tooltip";

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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
             <TooltipProvider>
            <BrowserRouter>
                <GA4Tracking />
                <div className="flex flex-col min-h-screen w-full">
                    <Navbar />
                    <main className="flex-1 w-full flex flex-col">
                        <Suspense fallback={
                            <div className="w-full h-[80vh] flex flex-col items-center justify-center">
                                <Ripple className="size-16 text-primary" />
                                <h1 className="inline-block text-2xl font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_4px_0_#5d3a00] tracking-wider text-center">
                                    MBX COMMUNITY
                                </h1>
                                <p className="text-xs text-muted-foreground">is Loading...</p>
                            </div>
                        }>
                            <AppRoutes />
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
}

