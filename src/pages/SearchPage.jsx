import { useEffect, useState } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";
import FoodVenueItem from "../components/FoodVenueItem";
import sortFilterResponseData from "../functions/sortFilterResponseData";

export default function SearchPage() {
  // STATE FOR Loading Div over the Map Element
  const [loading, setLoading] = useState(true);

  // Food Venues State
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [fastfoods, setFastFoods] = useState([]);
  const [bars, setBars] = useState([]);
  const [desserts, setDesserts] = useState([]);

  // Radius Slider State
  const [radius, setRadius] = useState(5);

  // USER LOCATION
  const [storedLocation, setStoredLocation] = useState(null);

  // UPDATE THE RADIUS STATE
  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  useEffect(() => {
    // Fetch stored location from localStorage
    const storedLocationData = JSON.parse(
      localStorage.getItem("currentSearch")
    );
    setStoredLocation(storedLocationData);
  }, []);

  useEffect(() => {
    if (storedLocation) {
      const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const { latitude, longitude } = storedLocation;

      const placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=circle:${longitude},${latitude},${
        radius * 1000
      }&bias=proximity:${
        longitude + 0.1
      },${latitude}&limit=50&apiKey=${myAPIKey}`;

      fetch(placesUrl)
        .then((response) => response.json())
        .then((places) => {
          fetchMapData(places, storedLocation);
          setLoading(false);

          const { cafes, restaurants, bars, fastFoods, desserts } =
            sortFilterResponseData(places);

          setCafes(cafes);
          setRestaurants(restaurants);
          setBars(bars);
          setFastFoods(fastFoods);
          setDesserts(desserts);
        })
        .catch((error) => {
          console.error("An error occurred while fetching places:", error);
        });
    }
  }, [storedLocation, radius]);

  return (
    <>
      <div id="map">
        {loading && <div className="loadingContainer">Loading...</div>}
      </div>

      <div className="searchMenu">
        <div className="searchinputs">
          <div className="radiusElement">
            <h3>Radius</h3>
            <input
              type="range"
              name="slider"
              id="slider"
              min={2}
              max={15}
              value={radius}
              onChange={handleRadiusChange}
            />
            <h4>{radius} km</h4>
          </div>
        </div>

        <div className="filterSearch">
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          All
          <input type="checkbox" name="all" id="cafeBox" className="checkbox" />
          Cafe
          <input
            type="checkbox"
            name="all"
            id="restaurantBox"
            className="checkbox"
          />
          Restaurant
          <input type="checkbox" name="all" id="fastBox" className="checkbox" />
          Fast Food
          <input type="checkbox" name="all" id="barBox" className="checkbox" />
          Bars & Pubs
          <input
            type="checkbox"
            name="all"
            id="dessertBox"
            className="checkbox"
          />
          Dessert
        </div>
      </div>

      <section id="displayResults">
        {/* CAFE COMPONENTS */}
        {cafes.length > 0 && <h2>Cafes</h2>}
        <div className="foodVenueContainer">
          {cafes.length > 0 &&
            cafes.map((cafe, index) => (
              <FoodVenueItem key={index} props={cafe} />
            ))}
        </div>

        {/* RESTAURANT COMPONENTS */}
        {restaurants.length > 0 && <h2>Restaurants</h2>}
        <div className="foodVenueContainer">
          {restaurants.length > 0 &&
            restaurants.map((restaurant, index) => (
              <FoodVenueItem key={index} props={restaurant} />
            ))}
        </div>

        {/* BARS COMPONENTS */}
        {bars.length > 0 && <h2>Bars & Pubs</h2>}
        <div className="barsontainer">
          {bars.length > 0 &&
            bars.map((bar, index) => <FoodVenueItem key={index} props={bar} />)}
        </div>

        {/* FAST FOOD COMPONENTS */}
        {fastfoods.length > 0 && <h2>Fast Food</h2>}
        <div className="foodVenueContainer">
          {fastfoods.length > 0 &&
            fastfoods.map((fastfood, index) => (
              <FoodVenueItem key={index} props={fastfood} />
            ))}
        </div>

        {/* DESSERT COMPONENTS */}
        {desserts.length > 0 && <h2>Desserts</h2>}
        <div className="foodVenueContainer">
          {desserts.length > 0 &&
            desserts.map((dessert, index) => (
              <FoodVenueItem key={index} props={dessert} />
            ))}
        </div>
      </section>
    </>
  );
}
