import { Layout } from "@components/Layout";
import { FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const ProfilePage = lazy(() => import("@routes/ProfilePage"));
const InfoMapPage = lazy(() => import("@routes/InfoMapPage"));
const MapPage = lazy(() => import("@routes/MapPage"));
const HomePage = lazy(() => import("@routes/HomePage"));
const CommunityPage = lazy(() => import("@routes/CommunityPage"));

export const AppRoutes: FC = () => (
    <Suspense
        fallback={<div className="text-center text-white">Loading...</div>}
    >
        <Routes>
            <Route
                path="/"
                element={
                    <Layout>
                        <HomePage />
                    </Layout>
                }
            />
            <Route
                path="/profile"
                element={
                    <Layout>
                        <ProfilePage />
                    </Layout>
                }
            />
            <Route
                path="/map"
                element={
                    <Layout>
                        <InfoMapPage />
                    </Layout>
                }
            />
            <Route
                path="/mappage"
                element={
                    <Layout>
                        <MapPage />
                    </Layout>
                }
            />
            <Route
                path="/community"
                element={
                    <Layout>
                        <CommunityPage />
                    </Layout>
                }
            />
        </Routes>
    </Suspense>
);
