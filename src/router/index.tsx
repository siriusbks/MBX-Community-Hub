import ActionsPage from "@pages/Actions/Actions";
import { BazaarPage } from "@pages/Actions/Bazaar";
import { GemExchangePage } from "@pages/Actions/GemExchange";
import { ClassCodexPage } from "@pages/Codex/ClassCodex";
import { ShipCodexPage } from "@pages/Codex/ShipCodex";
import ContributePage from "@pages/COntribute";
import MapPreview from "@pages/MapPreview";
import ProfilePage from "@pages/Profile";
import VillagePreview from "@pages/VillagePreview";
import { lazy, type FC } from "react";
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("@pages/MainPage"));
const ItemsCodex = lazy(() => import("@pages/Items"));
const CollectionsPage = lazy(() => import("@pages/Collections"));
const CommunityPage = lazy(() => import("@pages/Community"));
const Error404 = lazy(() => import("@pages/Error404"));
const MapsPage = lazy(() => import("@pages/Maps"));

export const AppRoutes: FC = () => {
    return (
        <Routes>
            {/* Main Page */}
            <Route path="/" element={<MainPage />} />

            {/* Maps */}
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/map/island_village" element={<VillagePreview />} />
            <Route path="/map/*" element={<MapPreview />} />

            {/* Tools Tab */}
            <Route path="/tools/collections" element={<CollectionsPage />} />

            {/* Codex */}
            <Route path="/codex/items" element={<ItemsCodex />} />
            <Route path="/codex/ships" element={<ShipCodexPage />} />
            <Route path="/codex/classes" element={<ClassCodexPage />} />

            {/* Market Tqab */}
            <Route path="/market" element={<ActionsPage />} />
            <Route path="/market/action-house" element={<ActionsPage />} />
            <Route path="/market/bazaar" element={<BazaarPage />} />
            <Route path="/market/gem-exchange" element={<GemExchangePage />} />

            {/* Community */}
            <Route path="/community" element={<CommunityPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Others */}
            <Route path="/contribute" element={<ContributePage />} />


            {/* Errors */}
            <Route path="*" element={<Error404 />} />

        </Routes>
    );
};
