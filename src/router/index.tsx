import { lazy, type FC } from "react";
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("@pages/MainPage"));
const ItemsCodex = lazy(() => import("@pages/Items"));
const Error404 = lazy(() => import("@pages/Error404"));

export const AppRoutes: FC = () => {
    return (
        <Routes>
                {/* Main Page */}
                <Route path="/" element={<MainPage />} />

                {/* Codex */}
                <Route path="/codex/items" element={<ItemsCodex />} />

                {/* Errors */}
                <Route path="*" element={<Error404 />} />

        </Routes>
    );
};
