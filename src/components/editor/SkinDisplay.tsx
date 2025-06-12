/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState } from "react";
import { AlertCircle, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useProfileStore } from "@store/profileStore";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function SkinDisplay() {
    const { t } = useTranslation("profile");
    const { username, setUsername, setUUID } = useProfileStore();
    const [error, setError] = useState<string | null>(null);

    const debouncedUsername = useDebounce(username, 500);

    useEffect(() => {
        if (!debouncedUsername) {
            setUUID("");
            setError(null);
            return;
        }

        if (debouncedUsername.length < 3 || debouncedUsername.length > 16) {
            setError("Username must be between 3 and 16 characters");
            setUUID("");
            return;
        }

        const validPattern = /^[A-Za-z0-9_]+$/;
        if (!validPattern.test(debouncedUsername)) {
            setError(
                "Username can only contain letters, numbers, and underscores"
            );
            setUUID("");
            return;
        }

        setError(null);

        async function fetchUUID() {
            try {
                const response = await fetch(
                    `https://skin.mineboxcommunity.com/api/minecraft/${debouncedUsername}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setUUID(data.id);
                } else if (response.status === 404) {
                    setError("Player not found");
                    setUUID("");
                } else {
                    const errorData = await response.json();
                    setError(
                        errorData.message || `API error: ${response.status}`
                    );
                    setUUID("");
                }
            } catch (err) {
                console.error("Network error:", err);
                setError("Network error. Please try again.");
                setUUID("");
            }
        }

        fetchUUID();
    }, [debouncedUsername, setUUID]);

    return (
        <div className="space-y-4">
            <label
                htmlFor="minecraft-username"
                className="block text-sm font-medium text-gray-200"
            >
                {t("profile.minecraftUsername")}
            </label>
            <div className="relative">
                <input
                    id="minecraft-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("profile.minecraftUsername")}
                    minLength={3}
                    maxLength={16}
                    className={`w-full bg-gray-700 rounded-lg px-4 py-2 pl-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        error
                            ? "focus:ring-red-500 border border-red-500/50"
                            : "focus:ring-green-500"
                    }`}
                />
                <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                    aria-hidden="true"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
