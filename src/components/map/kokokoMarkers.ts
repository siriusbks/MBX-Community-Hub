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

const kokokoMarkers: Record<string, MarkerConfig> = {
    lily: {
        displayName: "Lily",
        iconUrl: "src/assets/media/flower/lily.png",
        geoJsonFile: "src/assets/geo/lily.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    clover: {
        displayName: "Clover",
        iconUrl: "src/assets/media/flower/clover.png",
        geoJsonFile: "src/assets/geo/clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
};

export default kokokoMarkers;
