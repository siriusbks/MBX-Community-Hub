import React from "react";
import InteractiveMap from "../components/InteractiveMap";

const MapPage: React.FC = () => {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <InteractiveMap />
        </div>
    );
};

export default MapPage;
