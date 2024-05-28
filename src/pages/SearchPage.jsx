import { useEffect } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";

export default function SearchPage() {
  useEffect(() => {
    fetchMapData();
    console.log("fetched data");
  }, []);
  return (
    <>
      <h1>Hello from the Search page</h1>
      <div id="map"></div>
    </>
  );
}