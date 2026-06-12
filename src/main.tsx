import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import "./index.css"
import { ThemeProvider } from "@components/theme-provider.tsx"
import { TooltipProvider } from "@components/ui/tooltip"
import { Navbar } from "@components/Navbar.tsx"
import { Footer } from "@components/Footer.tsx"
import Home from "@pages/MainPage.tsx";
import Error404 from "@pages/Error404.tsx";
import ItemsCodex from "@pages/Items.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <TooltipProvider>
            <Navbar />
            <main className="flex-1">
              <Routes>

                {/* Main Page */}
                <Route path="/" element={<Home />} />

                {/* Codex */}
                <Route path="/codex/items" element={<ItemsCodex />} />

                {/* Errors */}
                <Route path="*" element={<Error404 />} />

              </Routes>
            </main>
            <Footer />
          </TooltipProvider>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
