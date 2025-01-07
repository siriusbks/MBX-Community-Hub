export interface MarkerProperties {
    level?: string;
    showCount?: boolean;
    [key: string]: any;
}

export interface MarkerConfig {
    displayName: string;
    iconUrl: string;
    geoJsonFile: string;
    category: string;
    defaultChecked: boolean;
    properties: MarkerProperties;
}

const quadraMarkers: Record<string, MarkerConfig> = {
    log_chestnut: {
        displayName: "Log Chestnut",
        iconUrl: "src/assets/media/tree/log_chestnut.png",
        geoJsonFile: "src/assets/geo/log_chestnut.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
};

export default quadraMarkers;
