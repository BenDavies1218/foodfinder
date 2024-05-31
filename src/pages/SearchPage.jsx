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

  // STATE FOR USER LOCATION
  const [userLocation, setUserLocation] = useState(null);

  setUserLocation(JSON.parse(localStorage.getItem("currentSearch")));

  // UPDATE THE RADIUS STATE
  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  useEffect(() => {
    // Check if userLocation is available
    if (userLocation) {
      // API KEY IMPORT
      const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

      // API URL REQUEST TO GEOAPIFY
      const placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=circle:${
        userLocation.longitude
      },${userLocation.latitude},${radius * 1000}&bias=proximity:${
        userLocation.longitude + 0.1
      },${userLocation.latitude}&limit=200&apiKey=${myAPIKey}`;

      // FETCHING PLACES
      fetch(placesUrl)
        // Convert response to JSON
        .then((response) => response.json())

        // Call functions With JSON Data
        .then((places) => {
          fetchMapData(places, userLocation);
          // Remove Loading screen
          setLoading(false);

          // I PUT THE SORTING IN ANOTHER MODULE BECAUSE IT WAS TAKING UP TOO MUCH SPACE
          let { cafes, restaurants, bars, fastFoods, desserts } =
            sortFilterResponseData(places);

          // SET THE STATE TO THE SORTED DATA
          setCafes(cafes);
          setRestaurants(restaurants);
          setBars(bars);
          setFastFoods(fastFoods);
          setDesserts(desserts);
        })
        // HANDLE ANY ERRORS THAT COME OUR WAY
        .catch((error) => {
          console.error("An error occurred while fetching places:", error);
        });

      console.log("radius changed");
    }
  }, [userLocation, radius]);

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
