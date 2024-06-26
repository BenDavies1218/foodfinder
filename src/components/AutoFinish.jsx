import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { useState } from "react";

const AutoFinish = () => {
  const [position, setPosition] = useState(null);

  function onPlaceSelect(value) {
    try {
      localStorage.setItem(
        "searchBox",
        JSON.stringify(value.geometry.coordinates)
      );
      localStorage.setItem("boxCoor", JSON.stringify(value.bbox));
      setPosition(value.geometry.coordinates);
    } catch {}
  }

  return (
    <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
      <GeoapifyGeocoderAutocomplete
        placeholder="Enter address here"
        biasByLocation={position}
        placeSelect={onPlaceSelect}
      />
    </GeoapifyContext>
  );
};

export default AutoFinish;
