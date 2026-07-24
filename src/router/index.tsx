import { lazy, type FC } from "react";
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("@pages/MainPage"));
const ItemsCodex = lazy(() => import("@pages/Codex/ItemsCodex"));
const BestiaryCodexPage = lazy(() => import( "@pages/Codex/BestiaryCodex"));
const ClassCodexPage = lazy(() => import( "@pages/Codex/ClassCodex"));
const ShipCodexPage  = lazy(() => import( "@pages/Codex/ShipCodex"));
const ActionsPage = lazy(() => import("@pages/Actions/Actions"));
const BazaarPage = lazy(() => import("@pages/Actions/Bazaar"));
const GemExchangePage = lazy(() => import("@pages/Actions/GemExchange"));
const ContributePage = lazy(() => import("@pages/Contribute"));
const EventTemplate = lazy(() => import("@pages/Events/template"));
const MapPreview = lazy(() => import("@pages/MapPreview"));
const ProfilePage = lazy(() => import("@pages/Profile"));
const ShopsPage = lazy(() => import("@pages/Shops"));
const VillagePreview = lazy(() => import("@pages/VillagePreview"));
const VotePage = lazy(() => import("@pages/Votes"));
const EquipmentPage = lazy(() => import( "@pages/Tools/Equipment"));
const CollectionsPage = lazy(() => import("@pages/Collections"));
const CommunityPage = lazy(() => import("@pages/Community"));
const Error404 = lazy(() => import("@pages/Error404"));
const MapsPage = lazy(() => import("@pages/Maps"));
const ChangelogPage = lazy(() => import("@pages/Changelog"));
const MuseumPage = lazy(() => import("@pages/Tools/Museum"));

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
            <Route path="/tools/equipment-builder" element={<EquipmentPage />} />
            <Route path="/tools/museum" element={<MuseumPage />} />
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

            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/votes" element={<VotePage />} />
            <Route path="/shops" element={<ShopsPage />} /> 

            {/* Others */}
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/events" element={<EventTemplate />} />

            {/* Errors */}
            <Route path="*" element={<Error404 />} />

        </Routes>
    );
};
