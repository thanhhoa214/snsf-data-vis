"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const MapChart = () => {
  return (
    <ComposableMap>
      <Geographies geography="/features.json">
        {({ geographies }) => {
          return geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#00000010"
              stroke="#000000"
              xlinkTitle={geo.rsmKey}
              className="focus-within:outline-none focus-within:fill-red-400"
            />
          ));
        }}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
