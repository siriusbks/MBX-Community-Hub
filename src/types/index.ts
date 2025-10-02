/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface Profession {
    id: string;
    name: string;
    level: number;
    currentXP: number;
    maxXP: number;
    priority: boolean;
    enabled: boolean;
}

export interface ProfileState {
    username: string;
    uuid: string;
    level: number;
    playtime: number;
    daily: number;
    weekly: number;
    museum: number;
    background: string;
    relics: string[]
    professions: Profession[];
    setUsername: (username: string) => void;
    setUUID: (uuid: string) => void;
    setLevel: (value: number | ((prevLevel: number) => number)) => void;
    setPlaytime: (value: number | ((prevPlaytime: number) => number)) => void;
    setDaily: (value: number | ((prevDaily: number) => number)) => void;
    setWeekly: (value: number | ((prevWeekly: number) => number)) => void;
    setMuseum: (value: number | ((prevMuseum: number) => number)) => void;
    setRelics: (value: string[] | ((prevRelics: string[]) => string[])) => void;
    setBackground: (url: string) => void;
    updateProfession: (id: string, updates: Partial<Profession>) => void;

    showRelics: boolean;
    showStatistics: boolean;
    showJoinTime: boolean;
}
