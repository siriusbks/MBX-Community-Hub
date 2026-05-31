/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { FC, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bone, Eye, LoaderCircleIcon, Package, Star, AlertTriangleIcon } from "lucide-react";
import ItemImage from "@components/ItemImage";
import { getRarityColor, getRarityBadge } from "@utils/equipmentSlots";

import { bestiaryData, BestiaryInfo } from "@components/map/bestiaryData";
import {
    mapNameTranslationKeys,
    mapNameRegions,
    bestiaryRegionsData,
} from "@components/map/mapRegions";
import { mapData } from "@components/map/mapData";
import L from "leaflet";
import { MapContainer, ImageOverlay, Polygon, useMap } from "react-leaflet";
import {
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";
import { getRarityStyle } from "@components/stats";

const BestiaryPage: FC = () => {
    const { t } = useTranslation([
        "bestiary",
        "map",
        "items",
        "halloween",
        "common",
    ]);
    const location = useLocation();
    const navigate = useNavigate();

    // Selected mob for modal popup: includes optional regionKey and islandKey for map
    const [selectedMob, setSelectedMob] = useState<{
        mob: BestiaryInfo;
        regionKey?: string;
        islandKey?: string;
    } | null>(null);

    // Item rarity map (id -> RARITY string). We'll fetch item data once and merge missing-rarity overrides.
    const [itemsRarity, setItemsRarity] = useState<Record<
        string,
        string
    > | null>(null);

    // API bestiary (v3) pagination
    type ApiCreature = {
        id: string;
        name: string;
        family?: string | string[];
        type?: string;
        level?: number;
        level_max?: number;
        health?: [number, number];
        image?: string;
    };

    const [apiCreatures, setApiCreatures] = useState<ApiCreature[]>([]);
    const [apiPage, setApiPage] = useState(1);
    const apiPageSize = 50;
    const [apiTotal, setApiTotal] = useState<number | null>(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // API creature details modal
    type ApiCreatureDetails = {
        id: string;
        name: string;
        family?: string | string[];
        type?: string;
        level?: number;
        level_max?: number;
        health?: [number, number];
        image?: string;
        drops?: Array<{
            item_id: string;
            amount?: [number, number];
            chance?: number;
        }>;
        stats?: Record<string, [number, number]>;
        resistances?: Record<string, [number, number]>;
        zones?: string[];
    };

    const [apiSelectedId, setApiSelectedId] = useState<string | null>(null);
    const [apiSelectedDetails, setApiSelectedDetails] =
        useState<ApiCreatureDetails | null>(null);
    const [apiDetailsLoading, setApiDetailsLoading] = useState(false);
    const [apiDetailsError, setApiDetailsError] = useState<string | null>(null);
    // family list fetched from API
    const [apiFamilyCreatures, setApiFamilyCreatures] = useState<
        ApiCreature[] | null
    >(null);
    const [apiFamilyLoading, setApiFamilyLoading] = useState(false);
    const [apiFamilyError, setApiFamilyError] = useState<string | null>(null);

    useEffect(() => {
        if (!apiSelectedId) {
            setApiSelectedDetails(null);
            setApiDetailsError(null);
            setApiDetailsLoading(false);
            return;
        }

        let mounted = true;
        const load = async () => {
            setApiDetailsLoading(true);
            setApiDetailsError(null);
            try {
                const res = await fetch(
                    `https://api.minebox.co/bestiary/${encodeURIComponent(apiSelectedId)}`,
                );
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const json = await res.json();
                if (!mounted) return;
                setApiSelectedDetails(json as ApiCreatureDetails);
            } catch (e: any) {
                if (!mounted) return;
                setApiDetailsError(
                    e?.message ?? "Failed to load creature details",
                );
            } finally {
                if (mounted) setApiDetailsLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [apiSelectedId]);

    // fetch family creatures when selected details has a family
    useEffect(() => {
        const family = apiSelectedDetails?.family;
        const familyKey = Array.isArray(family) ? family[0] : family;
        if (!familyKey) {
            setApiFamilyCreatures(null);
            setApiFamilyError(null);
            setApiFamilyLoading(false);
            return;
        }

        let mounted = true;
        const loadFamily = async () => {
            setApiFamilyLoading(true);
            setApiFamilyError(null);
            try {
                const res = await fetch(
                    `https://api.minebox.co/bestiary?family=${encodeURIComponent(String(familyKey))}`,
                );
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const json = await res.json();
                const creatures = Array.isArray(json.creatures)
                    ? (json.creatures as ApiCreature[])
                    : [];
                if (!mounted) return;
                setApiFamilyCreatures(creatures);
            } catch (e: any) {
                if (!mounted) return;
                setApiFamilyError(e?.message ?? "Failed to load family");
                setApiFamilyCreatures(null);
            } finally {
                if (mounted) setApiFamilyLoading(false);
            }
        };
        loadFamily();
        return () => {
            mounted = false;
        };
    }, [apiSelectedDetails]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setApiLoading(true);
            setApiError(null);
            try {
                const res = await fetch(
                        `https://api.minebox.co/bestiary/?page=${apiPage}&pageSize=${apiPageSize}`,
                    );
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const json = await res.json();
                const creatures = Array.isArray(json.creatures)
                    ? (json.creatures as ApiCreature[])
                    : [];
                if (!mounted) return;
                setApiCreatures((prev) =>
                    apiPage === 1 ? creatures : [...prev, ...creatures],
                );
                    const total = typeof json.total === "number" ? json.total : null;
                    setApiTotal(total);

                    // Automatically fetch the next page sequentially if more creatures remain.
                    // We compute how many items have been fetched including this page and
                    // request the next page only when needed. This keeps requests sequential
                    // instead of firing all pages in parallel.
                    if (total !== null) {
                        const fetchedSoFar = (apiPage - 1) * apiPageSize + creatures.length;
                        if (fetchedSoFar < total) {
                            setApiPage(apiPage + 1);
                        }
                    }
            } catch (e: any) {
                if (!mounted) return;
                setApiError(e?.message ?? "Failed to load API bestiary");
            } finally {
                if (mounted) setApiLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiPage]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                // Fetch the canonical items.json from CDN (contains most items + rarities),
                // then merge local files for items missing from the CDN and any overrides.
                const [itemsRes, noInMbRes, missingRes] = await Promise.all([
                    //fetch("https://cdn2.minebox.co/data/items.json")
                    fetch("/assets/data/items.json")
                        .then((r) => r.json())
                        .catch(() => []),
                    fetch("/assets/data/items-no-in-MBapi.json")
                        .then((r) => r.json())
                        .catch(() => []),
                    fetch("/assets/data/items-missing-rarity.json")
                        .then((r) => r.json())
                        .catch(() => ({})),
                ]);

                const map: Record<string, string> = {};

                // items.json -> seed the map (preferred source)
                if (Array.isArray(itemsRes)) {
                    for (const it of itemsRes) {
                        if (
                            it &&
                            typeof it.id === "string" &&
                            typeof it.rarity === "string"
                        ) {
                            map[it.id] = it.rarity;
                        }
                    }
                }

                // items-no-in-MBapi.json -> supplement items not present in CDN
                if (Array.isArray(noInMbRes)) {
                    for (const it of noInMbRes) {
                        if (it && typeof it.id === "string" && it.rarity)
                            map[it.id] = it.rarity;
                    }
                }

                // missing overrides -> final override layer
                if (missingRes && typeof missingRes === "object") {
                    for (const [k, v] of Object.entries(missingRes)) {
                        if (typeof v === "string") map[k] = v;
                    }
                }

                if (mounted) setItemsRarity(map);
            } catch (e) {
                // swallow errors but leave itemsRarity null if we couldn't build it
                console.error("Failed to load item rarities:", e);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    // If the page is opened with ?mob=<mobName>, auto-open that mob's modal
    useEffect(() => {
        const tryFind = (param: string | null) => {
            if (!param) return null;
            // exact
            let found = findMobByName(param);
            if (found) return found;

            // try with bestiary. prefix
            const pref = param.startsWith("bestiary.")
                ? param
                : `bestiary.${param}`;
            found = findMobByName(pref);
            if (found) return found;

            // normalized (underscores, decoded)
            const normalized = param.replace(/\s+/g, "_");
            found =
                findMobByName(normalized) ||
                findMobByName(`bestiary.${normalized}`);
            if (found) return found;

            // fallback: search by last segment or substring
            const needle = param.toLowerCase();
            for (const [islandKey, regions] of Object.entries(bestiaryData)) {
                for (const [regionKey, mobs] of Object.entries(
                    regions as any,
                )) {
                    for (const mob of mobs as BestiaryInfo[]) {
                        const last = mob.name.split(".").pop() || mob.name;
                        if (last.toLowerCase() === needle)
                            return { mob, regionKey, islandKey };
                        if (mob.name.toLowerCase().includes(needle))
                            return { mob, regionKey, islandKey };
                    }
                }
            }
            return null;
        };

        try {
            const params = new URLSearchParams(location.search);
            const mobParam = params.get("mob");
            let found = tryFind(mobParam);
            if (!found && mobParam) {
                try {
                    const decoded = decodeURIComponent(mobParam);
                    found = tryFind(decoded);
                } catch (e) {
                    // ignore
                }
            }
            if (found) setSelectedMob(found);
        } catch (e) {
            // ignore
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    // Reflect selected mob in the URL (?mob=...), remove when modal closed
    useEffect(() => {
        try {
            const params = new URLSearchParams(location.search);
            const current = params.get("mob");
            if (selectedMob) {
                const want = selectedMob.mob.name;
                if (current !== want) {
                    params.set("mob", want);
                    const search = params.toString();
                    navigate(`${location.pathname}?${search}`, {
                        replace: true,
                    });
                }
            } else {
                if (current) {
                    params.delete("mob");
                    const search = params.toString();
                    const suffix = search ? `?${search}` : "";
                    navigate(`${location.pathname}${suffix}`, {
                        replace: true,
                    });
                }
            }
        } catch (e) {
            // ignore
        }
    }, [selectedMob, location.pathname, location.search, navigate]);

    // (No per-region view or interaction helpers — preview shows the whole map)

    // Try to resolve a family key to an icon URL by searching bestiaryData for a mob with that name.
    const getFamilyIconUrl = (familyKey: string) => {
        for (const island of Object.values(bestiaryData)) {
            for (const regionArr of Object.values(island)) {
                for (const mob of regionArr) {
                    if (mob.name === familyKey && mob.image)
                        return mob.image.startsWith("/")
                            ? mob.image
                            : `/${mob.image}`;
                }
            }
        }
        // fallback generic icon
        return "/assets/media/skulls/basic.png";
    };

    // Find a mob by its name across the bestiary dataset (returns mob + region + island)
    const findMobByName = (
        name: string,
    ): { mob: BestiaryInfo; regionKey?: string; islandKey?: string } | null => {
        for (const [islandKey, regions] of Object.entries(bestiaryData)) {
            for (const [regionKey, mobs] of Object.entries(regions as any)) {
                for (const mob of mobs as BestiaryInfo[]) {
                    if (mob.name === name) return { mob, regionKey, islandKey };
                }
            }
        }
        return null;
    };

    const SetCRS = ({ mapConfig }: { mapConfig: any }) => {
        const map = useMap();
        const padding = 64;
        React.useEffect(() => {
            const bounds: L.LatLngBoundsExpression = [
                [-padding, -padding],
                [mapConfig.height + padding, mapConfig.width + padding],
            ];
            map.fitBounds(bounds);
            map.setMaxBounds(bounds as any);
        }, [map, mapConfig]);
        return null;
    };

    const MapCreated: React.FC<{ onMap: (m: L.Map) => void }> = ({ onMap }) => {
        const map = useMap();
        React.useEffect(() => {
            onMap(map);
        }, [map, onMap]);
        return null;
    };

    const MapPreview: React.FC<{ island: string; mobName: string }> = ({
        island,
        mobName,
    }) => {
        const mapConfig = mapData[island];
        if (!mapConfig)
            return <div className="text-gray-400">No map available</div>;

        const test = React.useMemo(() => L.svg({ padding: 2 }), []);

        const matchingZones: { coords: [number, number][]; color: string }[] =
            [];
        const regionGroups = (bestiaryRegionsData as any)[island] || {};
        Object.values(regionGroups).forEach((group: any) => {
            (group.zones || []).forEach((zone: any) => {
                const has = (zone.mobs || []).some(
                    (m: any) => m && m.name === mobName,
                );
                if (has)
                    matchingZones.push({
                        coords: zone.coords,
                        color: zone.color,
                    });
            });
        });

        const [previewMap, setPreviewMap] = React.useState<L.Map | null>(null);

        React.useEffect(() => {
            if (!previewMap) return;
            const bounds: L.LatLngBoundsExpression = [
                [0, 0],
                [mapConfig.height, mapConfig.width],
            ];
            try {
                previewMap.fitBounds(bounds as any);
            } catch (e) {}
        }, [mobName, previewMap, mapConfig.height, mapConfig.width]);

        const bounds: L.LatLngBoundsExpression = [
            [0, 0],
            [mapConfig.height, mapConfig.width],
        ];

        return (
            <>
                <div
                    className="rounded-xl overflow-hidden w-[90%] mx-auto relative bg-gray-400 max-h-none"
                    style={{ aspectRatio: "1 / 1", maxHeight: "none" }}
                >
                    <MapContainer
                        crs={L.CRS.Simple}
                        center={[mapConfig.height / 2, mapConfig.width / 2]}
                        zoom={1}
                        attributionControl={false}
                        renderer={test}
                        dragging={true}
                        zoomControl={false}
                        scrollWheelZoom={true}
                        style={{
                            height: "100%",
                            width: "100%",
                            backgroundColor: "rgb(31 41 55)",
                            imageRendering: "pixelated",
                        }}
                    >
                        <SetCRS mapConfig={mapConfig} />
                        <MapCreated onMap={setPreviewMap} />
                        <ImageOverlay
                            url={
                                mapConfig.imageUrl?.startsWith("/")
                                    ? mapConfig.imageUrl
                                    : `/${mapConfig.imageUrl}`
                            }
                            bounds={bounds}
                            interactive={false}
                            pane="overlayPane"
                            className="bestiary-image-overlay bg-gray-700"
                        />

                        {matchingZones.map((zone, idx) => (
                            <Polygon
                                key={idx}
                                positions={zone.coords}
                                pathOptions={{
                                    color: zone.color,
                                    weight: 1,
                                    fillColor: zone.color,
                                    fillOpacity: 0.45,
                                }}
                            />
                        ))}
                    </MapContainer>

                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 bg-black bg-opacity-40 rounded p-1">
                        <button
                            onClick={() => previewMap && previewMap.zoomIn()}
                            className="text-white bg-transparent hover:bg-white/10 rounded px-2 py-1 text-sm"
                            title="Zoom in"
                        >
                            +
                        </button>
                        <button
                            onClick={() => previewMap && previewMap.zoomOut()}
                            className="text-white bg-transparent hover:bg-white/10 rounded px-2 py-1 text-sm"
                            title="Zoom out"
                        >
                            -
                        </button>
                        <button
                            onClick={() =>
                                previewMap &&
                                previewMap.fitBounds(bounds as any)
                            }
                            className="text-white bg-transparent hover:bg-white/10 rounded px-2 py-1 text-sm"
                            title="Reset view"
                        >
                            ⭮
                        </button>
                    </div>
                </div>

                <div className="mx-auto mt-2 flex justify-end">
                    <Link
                        to={`/mappage?selectedMap=${encodeURIComponent(
                            island,
                        )}`}
                        className="mx-auto inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm max-w-full break-words"
                    >
                        <Eye /> {t("common:actions.openInteractiveMap")}
                    </Link>
                </div>
            </>
        );
    };

    const renderResists = (mob: BestiaryInfo) => {
        return (
            <div className="text-[11px] text-gray-300 flex justify-between mt-1">
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/intelligence.png"
                        className="h-4 w-4 inline"
                    />
                    {mob.fireResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/luck.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.waterResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/agility.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.airResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/strength.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.earthResistant ?? 0}%
                </span>
            </div>
        );
    };

    const apiResistIconMap: Record<string, string> = {
        fire: "assets/media/elemental/intelligence.png",
        water: "assets/media/elemental/luck.png",
        air: "assets/media/elemental/agility.png",
        earth: "assets/media/elemental/strength.png",
    };
    const apiResistNameMap: Record<string, string> = {
        fire: "Fire",
        water: "Water",
        air: "Air",
        earth: "Earth",
    };

    const renderApiResists = (
        res: Record<string, [number, number]> | undefined,
    ) => {
        if (!res) return null;
        const entries = Object.entries(res);
        if (entries.length === 0) return null;
        return (
            <div className="text-[11px] text-gray-300 flex flex-col flex-wrap gap-3 mt-2">
                {entries.map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1">
                        <img
                            src={
                                apiResistIconMap[k] ??
                                "assets/media/elemental/intelligence.png"
                            }
                            className="h-4 w-4 inline"
                        />
                        <p className="font-bold">{apiResistNameMap[k]}</p>
                        <span className="ml-auto text-xs">
                            {v?.[0] ?? 0}% to {v?.[1] ?? 0}%
                        </span>
                    </span>
                ))}
            </div>
        );
    };

    const formatChance = (value: number) => {
        if (typeof value !== "number") return value;
        const str = value.toString();
        if (!str.includes(".")) return str + ".00";
        const [int, dec] = str.split(".");
        return dec.length >= 2 ? str : int + "." + dec.padEnd(2, "0");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <Bone className="mx-auto mb-2 h-16 w-16 text-green-500 bg-opacity-20 bg-green-500 p-3 rounded-lg" />
                <h1 className="text-4xl font-bold text-white mb-1">
                    {t("bestiary.title", { ns: "bestiary" })}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("bestiary.subtitle", { ns: "bestiary" })}
                </p>
                <div className="mt-4 h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
            </div>

                        <section
                            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4"
                            role="alert"
                            aria-live="assertive"
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangleIcon
                                    className="text-yellow-500 flex-shrink-0 mt-0.5"
                                    size={20}
                                    aria-hidden="true"
                                />
                                <div className="text-sm text-yellow-200/90">
                                    <p className="font-medium mb-1">
                                        Bestiary Update: API Migration in Progress
                                    </p>
                                    <p className="text-yellow-200/70">
                                        We're in the process of migrating our bestiary data to a new API.
                                    </p>
                                </div>
                            </div>
                        </section>

            {/* API Bestiary: fetched from https://api.minebox.co/bestiary/ */}
            <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {apiCreatures.map((c) => (
                        <div
                            key={c.id}
                            className={`relative group bg-gray-800 hover:bg-gray-700 rounded-lg p-4 pt-2 shadow-md cursor-pointer border border-gray-700 transition-colors`}
                            onClick={() => setApiSelectedId(c.id)}
                        >
                            <div className="mt-2">
                                <span className="flex items-start flex-row justify-center ">
                                    <div
                                        className={`${LevelBG_Gradient(
                                            c.level ?? 0,
                                        )} ${LevelTextColor(
                                            c.level ?? 0,
                                        )} px-2 py-0 rounded-sm text-[11px] font-semibold mr-2`}
                                    >
                                        {c.level ?? 0} - {c.level_max ?? 0}
                                    </div>
                                    <div className="font-semibold text-white text-sm">
                                        {c.name}
                                    </div>
                                </span>

                                <div className="text-xs bg-red-700/60 border-red-700/80 border rounded text-center py-1 text-white font-medium mt-2">
                                    {Array.isArray(c.health)
                                        ? `${c.health[0]} - ${c.health[1]}`
                                        : "0 - 0"}
                                </div>
                            </div>

                            <div className="mx-auto w-32 h-32 flex-shrink-0 rounded overflow-hidden flex items-center justify-center p-2">
                                {c.image ? (
                                    <img
                                        src={c.image}
                                        alt={c.name}
                                        className="drop-shadow-[0_8px_8px_rgba(0,0,0,0.4)] w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-400">?</div>
                                )}
                            </div>

                            {c.type == "BOSS" && (
                                <div className="absolute bottom-2 left-2 right-2 text-center text-xs bg-yellow-600 bg-opacity-50 border border-yellow-600 rounded text-white w-fit px-2">
                                    {c.type}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4 gap-3">
                    {apiError && <div className="text-red-400">{apiError}</div>}
                    {apiLoading && (
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded flex flex-row gap-2"
                            disabled
                        >
                            <LoaderCircleIcon className="animate-spin" />
                            Loading...
                        </button>
                    )}
                    {!apiLoading &&
                        apiTotal !== null &&
                        apiCreatures.length < apiTotal && (
                            <button
                                onClick={() => setApiPage((p) => p + 1)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                                Load more
                            </button>
                        )}
                </div>
            </div>


            {/* Modal popup for selected mob */}
            {/* API creature details modal */}
            {apiSelectedId && (
                <div
                    className="modal backdrop-blur-sm fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setApiSelectedId(null);
                    }}
                >
                    <div className="modal-content flex flex-col bg-gray-900 text-white rounded-lg max-w-[90%] h-[91vh] mx-auto shadow-2xl relative p-4 overflow-hidden">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => setApiSelectedId(null)}
                        >
                            &times;
                        </span>

                        <div className="grid grid-cols-1 w-full h-full">
                            {apiDetailsLoading ? (
                                <div className="text-center text-gray-300">
                                    Loading...
                                </div>
                            ) : apiDetailsError ? (
                                <div className="text-center text-red-400">
                                    {apiDetailsError}
                                </div>
                            ) : apiSelectedDetails ? (
                                <div className="flex flex-row gap-4 max-h-full overflow-auto">
                                    <div className="w-1/4 bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center flex-col gap-4">
                                            <div className="w-full my-auto">
                                                <div className="flex justify-center gap-2 items-center">
                                                    <div className="text-sm text-gray-300 bg-blue-700/60 border-blue-700/80 border rounded px-2 py-0 text-[11px] font-semibold">
                                                        Lvl{" "}
                                                        {apiSelectedDetails.level ??
                                                            0}
                                                        -
                                                        {apiSelectedDetails.level_max ??
                                                            0}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white">
                                                        {
                                                            apiSelectedDetails.name
                                                        }
                                                    </h3>
                                                </div>
                                                <div className="mt-2 w-full">
                                                    <div className="w-full text-xs bg-red-700/60 border-red-700/80 border rounded text-center py-1 text-white font-medium">
                                                        {Array.isArray(
                                                            apiSelectedDetails.health,
                                                        )
                                                            ? `${apiSelectedDetails.health[0].toLocaleString?.() ?? apiSelectedDetails.health[0]} - ${apiSelectedDetails.health[1].toLocaleString?.() ?? apiSelectedDetails.health[1]}`
                                                            : "0 - 0"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="size-2/3 flex-shrink-0 rounded overflow-hidden flex items-center justify-center">
                                                {apiSelectedDetails.image ? (
                                                    <img
                                                        src={
                                                            apiSelectedDetails.image
                                                        }
                                                        alt={
                                                            apiSelectedDetails.name
                                                        }
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-gray-400">
                                                        ?
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Stats, Resistances and Zones placed below in single column */}
                                        {apiSelectedDetails && (
                                            <div className="gap-4 flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-200 font-semibold mb-2">
                                                        Mob Stats
                                                    </div>
                                                </div>

                                                {apiSelectedDetails.stats ? (
                                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                                        {Object.entries(
                                                            apiSelectedDetails.stats,
                                                        ).map(([k, v]) => (
                                                            <div
                                                                key={k}
                                                                className="flex justify-between"
                                                            >
                                                                <span className="capitalize">
                                                                    {k}
                                                                </span>
                                                                <span>
                                                                    {v[0]} -{" "}
                                                                    {v[1]}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-400 italic">
                                                        No stats
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="font-semibold text-white mb-1">
                                                        Resistances
                                                    </div>
                                                    {renderApiResists(
                                                        apiSelectedDetails.resistances,
                                                    ) ?? (
                                                        <div className="text-xs text-gray-400 italic">
                                                            No resistances
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4">
                                                    <div className="font-semibold text-white mb-1">
                                                        Zones
                                                    </div>
                                                    {apiSelectedDetails.zones &&
                                                    apiSelectedDetails.zones
                                                        .length > 0 ? (
                                                        <div className="text-xs text-gray-300">
                                                            {apiSelectedDetails.zones.join(
                                                                ", ",
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-400 italic">
                                                            No zones
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-2/4 overflow-y-auto custom-scrollbar">
                                        {/* Family (from API) */}
                                        <div className="mt-4">
                                            <div className="text-sm text-gray-200 font-semibold mb-2">
                                                Family
                                            </div>
                                            {apiFamilyLoading ? (
                                                <div className="text-xs text-gray-300">
                                                    Loading family...
                                                </div>
                                            ) : apiFamilyError ? (
                                                <div className="text-xs text-red-400">
                                                    {apiFamilyError}
                                                </div>
                                            ) : apiFamilyCreatures &&
                                              apiFamilyCreatures.length > 0 ? (
                                                <div className="grid grid-cols-6 gap-3">
                                                    {apiFamilyCreatures.map(
                                                        (fc) => (
                                                            <button
                                                                key={fc.id}
                                                                onClick={() =>
                                                                    setApiSelectedId(
                                                                        fc.id,
                                                                    )
                                                                }
                                                                className={`flex flex-col items-center text-center bg-opacity-30 border rounded p-2 ${getRarityStyle("UNKNOWN")}`}
                                                                title={fc.name}
                                                            >
                                                                <img
                                                                    src={
                                                                        fc.image ??
                                                                        "/assets/media/skulls/basic.png"
                                                                    }
                                                                    alt={
                                                                        fc.name
                                                                    }
                                                                    className="h-20 w-20 object-contain mb-1"
                                                                />
                                                                <div className="text-xs text-gray-200 font-bold">
                                                                    {fc.name}
                                                                </div>
                                                                <div className="text-[11px] text-gray-400">
                                                                    Lvl{" "}
                                                                    {fc.level ??
                                                                        0}
                                                                    -
                                                                    {fc.level_max ??
                                                                        0}
                                                                </div>
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            ) : apiSelectedDetails?.family ? (
                                                <div className="text-xs text-gray-300">
                                                    {Array.isArray(
                                                        apiSelectedDetails.family,
                                                    )
                                                        ? apiSelectedDetails.family.join(
                                                              ", ",
                                                          )
                                                        : apiSelectedDetails.family}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic">
                                                    No family
                                                </div>
                                            )}
                                        </div>

                                        {/* Drops */}
                                        <div>
                                            <div className="pt-4 text-sm text-gray-200 font-semibold mb-2">
                                                Drops
                                            </div>
                                            {apiSelectedDetails.drops &&
                                            apiSelectedDetails.drops.length >
                                                0 ? (
                                                <div className="grid grid-cols-7 gap-3">
                                                    {apiSelectedDetails.drops
                                                        .slice()
                                                        .map((d, i) => {
                                                            const chance =
                                                                formatChance(
                                                                    (d.chance ??
                                                                        0) *
                                                                        100,
                                                                );
                                                            const rarity =
                                                                itemsRarity?.[
                                                                    d.item_id
                                                                ];
                                                            const rarityLabel =
                                                                rarity
                                                                    ? t(
                                                                          `museum.rarity.${rarity}`,
                                                                          {
                                                                              ns: "museum",
                                                                              defaultValue:
                                                                                  rarity,
                                                                          },
                                                                      )
                                                                    : null;
                                                            const rarityBg =
                                                                rarity
                                                                    ? rarity ===
                                                                      "COMMON"
                                                                        ? "bg-COMMON"
                                                                        : rarity ===
                                                                            "UNCOMMON"
                                                                          ? "bg-UNCOMMON"
                                                                          : rarity ===
                                                                              "RARE"
                                                                            ? "bg-RARE"
                                                                            : rarity ===
                                                                                "EPIC"
                                                                              ? "bg-EPIC"
                                                                              : rarity ===
                                                                                  "LEGENDARY"
                                                                                ? "bg-LEGENDARY"
                                                                                : rarity ===
                                                                                    "MYTHIC"
                                                                                  ? "bg-MYTHIC"
                                                                                  : "bg-UNKNOWN"
                                                                    : "bg-UNKNOWN";
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`relative aspect-square bg-opacity-30 border rounded p-2 flex flex-col items-center justify-center text-center ${getRarityStyle(d.item.rarity ?? "UNKNOWN")}`}
                                                                    title={`${t(
                                                                        d.item_id,
                                                                    )}`}>
                                                                    {/*<ItemImage
                                                                        detailsIndex={
                                                                            null
                                                                        }
                                                                        itemId={
                                                                            d.item_id
                                                                        }
                                                                        alt={
                                                                            d.item_id
                                                                        }
                                                                        className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] h-16 w-16 object-contain"
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
                                                                    />*/}
                                                                    <img
                                                                        src={
                                                                            `data:image/png;base64,${d.image}`
                                                                        }
                                                                        alt={
                                                                            d.item_id
                                                                        }
                                                                        className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] h-16 w-16 object-fill"
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
                                                                    />
                                                                    {/*
                                                                    {rarityLabel && (
                                                                        <div
                                                                            className={`text-[10px] px-2 py-0.5 rounded ${rarityBg} text-white mb-1`}
                                                                        >
                                                                            {
                                                                                rarityLabel
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs text-gray-200 leading-none font-bold w-full mb-1">
                                                                        {t(
                                                                            d.item_id,
                                                                            {
                                                                                ns: "items",
                                                                                defaultValue:
                                                                                    d.item_id,
                                                                            },
                                                                        )}
                                                                    </div>*/}
                                                                    <div className="absolute top-1 left-1 text-xs mt-auto">
                                                                        {(d.chance ??
                                                                            0) ===
                                                                        0
                                                                            ? "??.?? %"
                                                                            : `${chance}%`}
                                                                    </div>
                                                                    <div className="absolute bottom-1 right-2 text-xl font-extrabold mt-auto">
                                                                        {(d.amount[0] === d.amount[1]
                                                                            ? d.amount[0]
                                                                            : `${d.amount[0]}-${d.amount[1]}`) ?? "0"}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic">
                                                    No drops
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-1/4 bg-gray-800 rounded-lg p-4 gap-2 flex flex-col">
                                        <div className="text-sm text-gray-200 font-semibold mb-2">
                                            Collection
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {Array.from({ length: 28 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className=" p-1.5 border border-gray-600 bg-gray-700/50 text-xs rounded items-center justify-between flex flex-col"
                                                    >
                                                        <p>Level X</p>
                                                        <p>0000</p>
                                                        <p className="font-bold text-sm">5000 <span className="bg-white px-1  rounded-sm text-black text-xs">XP</span></p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-200 font-semibold mb-2 mt-auto">
                                            Map
                                        </div>
                                        {/* Map Placeholder */}
                                        <div className="aspect-video  bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BestiaryPage;
