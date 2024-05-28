import { useEffect, useState } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    // API KEY IMPORT
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    // FETCHING THE DINING VENUES FROM API
    const type = "catering"; // this is all hospitality venues

    // POSITION OF THE MAP'S CORNERS USING LONGITUDE AND LATITUDE
    const bounds = {
      lat1: -27.570125,
      lon1: 153.021072,
      lat2: -27.370125,
      lon2: 153.321072,
    };

    // API URL REQUEST TO GEOAPIFY
    const placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=rect:${bounds.lon1},${bounds.lat1},${bounds.lon2},${bounds.lat2}&limit=10&apiKey=${myAPIKey}`;

    // FETCHING PLACES
    fetch(placesUrl)
      .then((response) => response.json())
      .then((places) => {
        // Build Map Now
        fetchMapData(places, bounds, myAPIKey);
        // remove Loading screen
        setLoading(false);
        const cafe = places.features.map((place) => ({
          name: place.properties.name,
          address: place.properties.address_line2,
          distance: place.properties.distance || "Distance not available",
        }));
        console.log(cafe);
        setCafes(cafe);
      })
      .catch((error) => {
        console.error("An error occurred while fetching places:", error);
      });
  }, []);

  return (
    <>
      <h1>Hello from the Search page</h1>
      <div id="map">
        {/* Conditional render Loading element */}
        {loading && <div className="loadingContainer">Loading...</div>}
      </div>
      <section id="displayResults">
        {cafes.map((cafe, index) => (
          <div key={index}>
            <h3>{cafe.name}</h3>
            <div>
              <p>{cafe.address}</p>
              <p>{cafe.distance}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
