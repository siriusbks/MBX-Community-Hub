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
    icon: string;
    priority: boolean;
    enabled: boolean;
}

export interface ProfileState {
    username: string;
    uuid: string;
    level: number;
    background: string;
    professions: Profession[];
    setUsername: (username: string) => void;
    setUUID: (uuid: string) => void;
    setLevel: (value: number | ((prevLevel: number) => number)) => void;
    setBackground: (url: string) => void;
    updateProfession: (id: string, updates: Partial<Profession>) => void;
}
