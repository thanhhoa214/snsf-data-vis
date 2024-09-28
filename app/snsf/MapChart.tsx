"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const MapChart = () => {
  return (
    <ComposableMap>
      <Geographies geography="/features.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#00000010"
              stroke="#000000"
              className="focus-within:outline-none focus-within:fill-red-400"
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
