import { useEffect, useState } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";
import FoodVenueItem from "../components/FoodVenueItem";

export default function SearchPage() {
  // Loading Div over the Map Element State
  const [loading, setLoading] = useState(true);

  // Food Venues State
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [fastfood, setFastFood] = useState([]);
  const [bar, setBar] = useState([]);
  const [iceCream, setIceCream] = useState([]);

  useEffect(() => {
    // API KEY IMPORT
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    // API URL REQUEST TO GEOAPIFY
    const placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=circle:153.1531665115317,-27.468924750815013,5000&bias=proximity:153.1531665115317,-27.468924750815013&limit=20&apiKey=${myAPIKey}`;

    // FETCHING PLACES
    fetch(placesUrl)
      // Convert response to JSON
      .then((response) => response.json())

      // Call functions With JSON Data
      .then((places) => {
        fetchMapData(places);

        // Remove Loading screen
        setLoading(false);

        console.log(places);

        // Filter cafes and restaurants
        const cafes = places.features
          .filter(
            (place) =>
              place.properties.categories.includes("catering.cafe") &&
              place.properties?.name !== undefined
          )
          .map((place) => ({
            name: place.properties.name,
            address: place.properties.address_line2,
            distance: place.properties.distance || "Distance not available",
          }));

        const restaurants = places.features
          .filter(
            (place) =>
              place.properties.categories.includes("catering.restaurant") &&
              place.properties?.name !== undefined
          )
          .map((place) => ({
            name: place.properties.name,
            address: place.properties.address_line2,
            distance: place.properties.distance || "Distance not available",
          }));
        setCafes(cafes);
        setRestaurants(restaurants);
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
        {cafes && <h2>Cafes</h2>}
        <div className="cafeContainer">
          {cafes.length > 0 &&
            cafes.map((cafe, index) => (
              <FoodVenueItem key={index} props={cafe} />
            ))}
        </div>

        {restaurants && <h2>Restaurants</h2>}
        <div className="restaurantContainer">
          {restaurants.length > 0 &&
            restaurants.map((restaurant, index) => (
              <FoodVenueItem key={index} props={restaurant} />
            ))}
        </div>
      </section>
    </>
  );
}
