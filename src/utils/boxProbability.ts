/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const getNotDroppedProbability = (
    dropRate: number,
    openings: number
): number => {
    if (openings <= 0) return 1;
    if (dropRate <= 0) return 1;
    if (dropRate >= 1) return 0;

    return Math.pow(1 - dropRate, openings);
};

export const getDroppedAtLeastOnceProbability = (
    dropRate: number,
    openings: number
): number => {
    return 1 - getNotDroppedProbability(dropRate, openings);
};

export const formatPercent = (
    value: number,
    decimals = 2
): string => {
    return `${(value * 100).toFixed(decimals)}%`;
};

export const formatDropRate = (
    dropRate: number,
    decimals = 2
): string => {
    return `${(dropRate * 100).toFixed(decimals)}%`;
};
