export interface MapProperties {
    minZoom: number;
    maxZoom: number;
}

export interface MapDataConfig {
    imageUrl: string;
    width: number;
    height: number;
    mapProperties: MapProperties;
    referencePoint: { x: number; y: number };
    markerRefs: string[];
}

export const mapData: Record<string, MapDataConfig> = {
    kokoko: {
        imageUrl: "src/assets/maps/kokoko.png",
        width: 528,
        height: 528,
        mapProperties: {
            minZoom: 0.75,
            maxZoom: 2,
        },
        referencePoint: { x: 0, y: 0 },
        markerRefs: ["lily", "clover"], // add other markers here
    },
    quadra_plains: {
        imageUrl: "src/assets/maps/quadra_plains.png",
        width: 608,
        height: 608,
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 80.5, y: 51 },
        markerRefs: ["log_chestnut"],
    },
};
