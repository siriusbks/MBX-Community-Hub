import ActionsPage from "@pages/Actions/Actions";
import { BazaarPage } from "@pages/Actions/Bazaar";
import { GemExchangePage } from "@pages/Actions/GemExchange";
import ContributePage from "@pages/Contribute";
import { EventTemplate } from "@pages/Events/template";
import MapPreview from "@pages/MapPreview";
import ProfilePage from "@pages/Profile";
import { ShopsPage } from "@pages/UnnamedPage";
import VillagePreview from "@pages/VillagePreview";
import { VotePage } from "@pages/Votes";
import { lazy, type FC } from "react";
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("@pages/MainPage"));
const ItemsCodex = lazy(() => import("@pages/Codex/ItemsCodex"));
const BestiaryCodexPage = lazy(() => import( "@pages/Codex/BestiaryCodex"));
const ClassCodexPage = lazy(() => import( "@pages/Codex/ClassCodex"));
const ShipCodexPage  = lazy(() => import( "@pages/Codex/ShipCodex"));
const CollectionsPage = lazy(() => import("@pages/Collections"));
const CommunityPage = lazy(() => import("@pages/Community"));
const Error404 = lazy(() => import("@pages/Error404"));
const MapsPage = lazy(() => import("@pages/Maps"));
const ChangelogPage = lazy(() => import("@pages/Changelog"));

export const AppRoutes: FC = () => {
    return (
        <Routes>
            {/* Main Page */}
            <Route path="/" element={<MainPage />} />

            {/* Maps */}
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/maps/island_village" element={<VillagePreview />} />
            <Route path="/maps/*" element={<MapPreview />} />

            {/* Tools Tab */}
            <Route path="/tools/collections" element={<CollectionsPage />} />

            {/* Codex */}
            <Route path="/items" element={<ItemsCodex />} />
            <Route path="/ships" element={<ShipCodexPage />} />
            <Route path="/classes" element={<ClassCodexPage />} />
            <Route path="/bestiary" element={<BestiaryCodexPage />} />

            {/* Market Tab */}
            <Route path="/market" element={<ActionsPage />} />
            <Route path="/market/action-house" element={<ActionsPage />} />
            <Route path="/market/bazaar" element={<BazaarPage />} />
            <Route path="/market/gem-exchange" element={<GemExchangePage />} />

            {/* Community */}
            <Route path="/community" element={<CommunityPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Votes */}
            <Route path="/votes" element={<VotePage />} />

            {/* Shops */}
            <Route path="/shops" element={<ShopsPage />} /> 

            {/* Others */}
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/changelog" element={<ChangelogPage />} />

            {/* Events */}
            <Route path="/events" element={<EventTemplate />} />

            {/* Errors */}
            <Route path="*" element={<Error404 />} />

        </Routes>
    );
};
