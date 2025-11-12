/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { FC, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bone, Eye, Package, Star } from "lucide-react";
import MuseumItemImage from "@components/museum/MuseumItemImage";

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

const BestiaryPage: FC = () => {
    const { t } = useTranslation(["bestiary", "map", "items", "halloween"]);
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

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                // Fetch the canonical items.json from CDN (contains most items + rarities),
                // then merge local files for items missing from the CDN and any overrides.
                const [itemsRes, noInMbRes, missingRes] = await Promise.all([
                    fetch("https://cdn2.minebox.co/data/items.json")
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
                    regions as any
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
        name: string
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
                    (m: any) => m && m.name === mobName
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
                            island
                        )}`}
                        className="mx-auto inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm max-w-full break-words"
                    >
                        <Eye />{" "}
                        {t("bestiary.openInteractiveMap", {
                            ns: "bestiary",
                            defaultValue: "Open Interactive Map",
                        })}
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

    const formatChance = (value) => {
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

            {/* Iterate islands */}
            {Object.entries(bestiaryData).map(([islandKey, regions]) => {
                // skip empty
                const regionKeys = Object.keys(regions || {});
                if (regionKeys.length === 0) return null;

                return (
                    <section key={islandKey} className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            {t(mapNameTranslationKeys[islandKey] ?? islandKey, {
                                ns: "map",
                                defaultValue: islandKey,
                            })}
                        </h2>

                        {/* Combined grid for all regions in this island */}
                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {Object.entries(regions)
                                    .flatMap(([regionKey, mobs]) =>
                                        mobs.map((mob) => ({
                                            mob,
                                            regionKey,
                                            islandKey,
                                        }))
                                    )
                                    .map(
                                        (
                                            { mob, regionKey, islandKey },
                                            idx
                                        ) => (
                                            <div
                                                key={`${regionKey}-${idx}`}
                                                className="relative group bg-gray-800 hover:bg-gray-700 rounded-lg p-4 pt-2 shadow-md cursor-pointer"
                                                onClick={() =>
                                                    setSelectedMob({
                                                        mob,
                                                        regionKey,
                                                        islandKey,
                                                    })
                                                }
                                            >
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 text-shadow-xl top-2 left-2 flex items-center gap-1 text-gray-300 text-[10px] font-semibold">
                                                    <Eye className="h-4 w-4 rounded" />
                                                    {t("bestiary.clickToView")}
                                                </div>

                                                <div className=" flex flex-col items-start gap-3">
                                                    <div className="mx-auto w-32 h-32 flex-shrink-0 rounded overflow-hidden flex items-center justify-center p-2">
                                                        {mob.image ? (
                                                            <img
                                                                src={mob.image}
                                                                alt={mob.name}
                                                                className="drop-shadow-[0_8px_8px_rgba(0,0,0,0.4)] w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                ?
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-start gap-1 flex-row justify-between align-center items-center">
                                                            <span
                                                                className={`${LevelBG_Gradient(
                                                                    mob.minlevel
                                                                )} ${LevelTextColor(
                                                                    mob.minlevel
                                                                )} px-2 py-0 rounded-sm text-[11px] font-semibold mr-2`}
                                                            >
                                                                Lvl{" "}
                                                                {mob.minlevel}-
                                                                {mob.maxlevel}
                                                            </span>
                                                            <div className=" text-xs text-gray-300 flex gap-2">
                                                                {mob.halloween2025 && (
                                                                    <span className="uppercase px-2 py-0 rounded text-[10px] bg-orange-600 bg-opacity-50 border font-bold border-orange-600 w-fit">
                                                                        Halloween
                                                                    </span>
                                                                )}
                                                                {mob.boss && (
                                                                    <span className="uppercase px-2 py-0 rounded text-[10px] bg-yellow-600 bg-opacity-50 border font-bold border-yellow-600 w-fit">
                                                                        {t(
                                                                            "boss",
                                                                            {
                                                                                ns: "bestiary",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-0.5 flex items-start gap-1 flex-row justify-between align-center items-center">
                                                            <div className="flex-1 leading-none">
                                                                <div className="font-semibold text-white text-sm leading-none">
                                                                    {t(
                                                                        mob.name
                                                                    )}
                                                                </div>
                                                                <div className="hidden text-xs text-gray-400 leading-none">
                                                                    {t(
                                                                        mapNameRegions[
                                                                            regionKey
                                                                        ] ??
                                                                            regionKey,
                                                                        {
                                                                            ns: "map",
                                                                            defaultValue:
                                                                                regionKey,
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-1">
                                                            <div className="text-xs bg-red-700/60 border-red-700/80 border rounded text-center py-1 text-white font-medium">
                                                                {mob.minhealth?.toLocaleString?.() ??
                                                                    0}{" "}
                                                                -{" "}
                                                                {mob.maxhealth?.toLocaleString?.() ??
                                                                    0}
                                                            </div>
                                                            {renderResists(mob)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Modal popup for selected mob */}
            {selectedMob && (
                <div
                    className="modal backdrop-blur-sm fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedMob(null);
                    }}
                >
                    <div className="modal-content flex flex-col bg-gray-900 text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative p-4 overflow-hidden">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => setSelectedMob(null)}
                        >
                            &times;
                        </span>

                        <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
                            {/* Left column: image, name, region, health, stats, family, drops */}
                            <div className="w-full md:w-1/2 flex flex-col gap-4 pr-2">
                                <div className="flex items-start gap-4">
                                    <div className="w-48 h-48 flex-shrink-0 rounded overflow-hidden bg-gray-900 p-3 flex items-center justify-center">
                                        {selectedMob.mob.image ? (
                                            <img
                                                src={selectedMob.mob.image}
                                                alt={selectedMob.mob.name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-gray-400">
                                                ?
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 my-auto">
                                        <span className="flex flex-row justify-between align-center items-center">
                                            <h3 className="text-2xl font-bold text-white">
                                                {t(selectedMob.mob.name)}
                                            </h3>
                                            {selectedMob.islandKey ? (
                                                <h3 className="text-2xl font-semibold text-white">
                                                    {t(
                                                        mapNameTranslationKeys[
                                                            selectedMob
                                                                .islandKey
                                                        ] ??
                                                            selectedMob.islandKey,
                                                        {
                                                            ns: "map",
                                                            defaultValue:
                                                                selectedMob.islandKey,
                                                        }
                                                    )}
                                                </h3>
                                            ) : null}
                                        </span>

                                        <div className="flex items-center gap-3 justify-between align-center items-center">
                                            <span className="flex flex-row gap-1">
                                                <span
                                                    className={`${LevelBG_Gradient(
                                                        selectedMob.mob.minlevel
                                                    )} ${LevelTextColor(
                                                        selectedMob.mob.minlevel
                                                    )} px-2 py-0 rounded-sm text-[11px] font-semibold`}
                                                >
                                                    Lvl{" "}
                                                    {selectedMob.mob.minlevel}-
                                                    {selectedMob.mob.maxlevel}
                                                </span>
                                                {selectedMob.mob
                                                    .halloween2025 && (
                                                    <span className="uppercase px-2 py-0 rounded text-[10px] bg-orange-600 bg-opacity-50 border font-bold border-orange-600 w-fit">
                                                        Halloween
                                                    </span>
                                                )}
                                                {selectedMob.mob.boss && (
                                                    <span className="uppercase px-2 py-0 rounded text-[10px] bg-yellow-600 bg-opacity-50 border font-bold border-yellow-600 w-fit">
                                                        {t("boss", {
                                                            ns: "bestiary",
                                                        })}
                                                    </span>
                                                )}
                                            </span>

                                            {selectedMob.regionKey && (
                                                <div className="text-sm text-gray-300 mt-1">
                                                    {t(
                                                        mapNameRegions[
                                                            selectedMob
                                                                .regionKey
                                                        ] ??
                                                            selectedMob.regionKey,
                                                        {
                                                            ns: "map",
                                                            defaultValue:
                                                                selectedMob.regionKey,
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 w-full">
                                            <div className="w-full text-xs bg-red-700/60 border-red-700/80 border rounded text-center py-1 text-white font-medium">
                                                {selectedMob.mob.minhealth?.toLocaleString?.() ??
                                                    0}{" "}
                                                -{" "}
                                                {selectedMob.mob.maxhealth?.toLocaleString?.() ??
                                                    0}
                                            </div>
                                            <div className="mt-2 text-[12px] text-gray-300">
                                                {renderResists(selectedMob.mob)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Family */}
                                <div>
                                    <div className="text-sm text-gray-200 font-semibold mb-2">
                                        {t("bestiary.family", {
                                            ns: "bestiary",
                                            defaultValue: "Family",
                                        })}
                                    </div>
                                    {selectedMob.mob.family &&
                                    selectedMob.mob.family.length > 0 ? (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-3">
                                            {selectedMob.mob.family.map(
                                                (f, i) => {
                                                    const icon =
                                                        getFamilyIconUrl(f);
                                                    const familyInfo =
                                                        findMobByName(f);
                                                    const levelText = familyInfo
                                                        ? `Lvl ${familyInfo.mob.minlevel}-${familyInfo.mob.maxlevel}`
                                                        : null;
                                                    const levelClass =
                                                        familyInfo
                                                            ? `${LevelBG_Gradient(
                                                                  familyInfo.mob
                                                                      .minlevel
                                                              )} ${LevelTextColor(
                                                                  familyInfo.mob
                                                                      .minlevel
                                                              )} text-[10px] px-2 py-0 rounded-sm font-semibold mb-1`
                                                            : "";

                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                const found =
                                                                    findMobByName(
                                                                        f
                                                                    );
                                                                if (found)
                                                                    setSelectedMob(
                                                                        found
                                                                    );
                                                            }}
                                                            className="flex flex-col items-center text-center bg-gray-800 bg-opacity-30 border border-gray-700 rounded p-2 hover:bg-gray-700/60 focus:outline-none"
                                                            title={t(f)}
                                                        >
                                                            <img
                                                                src={icon}
                                                                alt={f}
                                                                className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] h-20 w-20 object-contain rounded-md p-1 mb-1"
                                                            />
                                                            {levelText && (
                                                                <div className="w-full flex justify-center">
                                                                    <span
                                                                        className={
                                                                            levelClass
                                                                        }
                                                                    >
                                                                        {
                                                                            levelText
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-gray-200 truncate">
                                                                {t(f)}
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 italic">
                                            {t("bestiary.noFamily", {
                                                ns: "bestiary",
                                                defaultValue: "No family",
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Drops */}
                                <div>
                                    <div className="text-sm text-gray-200 font-semibold mb-2">
                                        {t("bestiary.drop", {
                                            ns: "bestiary",
                                            defaultValue: "Drops",
                                        })}
                                    </div>
                                    {selectedMob.mob.drop &&
                                    selectedMob.mob.drop.length > 0 ? (
                                        <div className="max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                {selectedMob.mob.drop
                                                    .slice()
                                                    .sort(
                                                        (a, b) =>
                                                            (b.dropChance ??
                                                                0) -
                                                            (a.dropChance ?? 0)
                                                    )
                                                    .map((d, i) => {
                                                        const chance =
                                                            formatChance(
                                                                d.dropChance ??
                                                                    0
                                                            );
                                                        const rarity =
                                                            itemsRarity?.[
                                                                d.itemId
                                                            ] ?? undefined;
                                                        const rarityLabel =
                                                            rarity
                                                                ? t(
                                                                      `museum.rarity.${rarity}`,
                                                                      {
                                                                          ns: "museum",
                                                                          defaultValue:
                                                                              rarity,
                                                                      }
                                                                  )
                                                                : null;
                                                        const rarityBg = rarity
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
                                                                className="bg-gray-800 bg-opacity-30 border border-gray-700 rounded p-2 flex flex-col items-center text-center"
                                                            >
{(() => {
                                                            const id = (d.itemId || "").toString().toLowerCase();
                                                            return (
                                                                <MuseumItemImage
                                                                    detailsIndex={null}
                                                                    itemId={d.itemId}
                                                                    alt={d.itemId}
                                                                    className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]  h-16 w-16 object-contain my-1 mb-2"
                                                                    style={{ imageRendering: "pixelated" }}
                                                                />
                                                            );
                                                        })()}
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
                                                                    {(() => {
                                                                        const id = d.itemId;
                                                                        const fromItems = t(id, { ns: "items", defaultValue: id });
                                                                        if (fromItems !== id) return fromItems;
                                                                        const fromBestiary = t(`halloween.${id}`, { ns: "halloween", defaultValue: id });
                                                                        return fromBestiary !== id ? fromBestiary : id;
                                                                    })()}
                                                                </div>
                                                                <div className="text-[11px] text-gray-300 mt-auto">
                                                                    {( (d.dropChance ?? 0) === 0 ? "???" : `${chance}%` )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 italic">
                                            {t("bestiary.noDrop", {
                                                ns: "bestiary",
                                                defaultValue: "No drops",
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column: map preview */}
                            <div className="w-full md:w-1/2">
                                <div className="mt-0 md:mt-0">
                                    <div className="text-sm text-gray-200 font-semibold text-center mb-2">
                                        {t("bestiary.mapPreview", {
                                            ns: "bestiary",
                                            defaultValue: "Map preview",
                                        })}
                                    </div>
                                    <MapPreview
                                        island={selectedMob.islandKey ?? ""}
                                        mobName={selectedMob.mob.name}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BestiaryPage;
