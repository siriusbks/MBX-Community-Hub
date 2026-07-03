import { AppRoutes } from "./router/index";
import { useEffect, Suspense } from "react";
import { BrowserRouter, matchPath, useLocation } from "react-router-dom";
import { GA4Tracking } from "@components/utils/GA4Tracking";
import { ThemeProvider } from "@components/theme-provider";
import { Navbar } from "@components/Navbar";
import { Footer } from "@components/Footer";
import "./i18n";
import { Ripple } from "@components/ripple";
import { TooltipProvider } from "@components/ui/tooltip";

const FULLSCREEN_LAYOUT_PATHS = ["/codex/items", "/codex/ships", "/codex/classes"];

function shouldUseFullscreenLayout(pathname: string) {
    return FULLSCREEN_LAYOUT_PATHS.some((path) =>
        Boolean(matchPath({ path, end: true }, pathname))
    );
}

function AppShell() {
    const { pathname } = useLocation();
    const useFullscreenLayout = shouldUseFullscreenLayout(pathname);

    return (
        <>
            <GA4Tracking />
            <div
                className={useFullscreenLayout
                    ? "flex h-dvh w-full flex-col overflow-hidden"
                    : "flex min-h-screen w-full flex-col"}
            >
                <Navbar />
                <main
                    className={useFullscreenLayout
                        ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden"
                        : "flex w-full flex-1 flex-col"}
                >
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
        </>
    );
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
                <AppShell />
            </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    );
}

