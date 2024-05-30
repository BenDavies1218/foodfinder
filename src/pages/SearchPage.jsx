import { useEffect, useState } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";
import FoodVenueItem from "../components/FoodVenueItem";
import sortFilterResponseData from "../functions/sortFilterResponseData";

export default function SearchPage() {
  // STATE FOR Loading Div over the Map Element
  const [loading, setLoading] = useState(true);

  // STATE FOR USER LOCATION
  const [userLocation, setUserLocation] = useState({});

  // Food Venues State
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [fastfoods, setFastFoods] = useState([]);
  const [bars, setBars] = useState([]);
  const [desserts, setDesserts] = useState([]);

  // Radius Slider State
  const [radius, setRadius] = useState(2);

  const x = document.getElementById("yourLocation");

  // GET THE USERS EXACT LOCATION AND SET TO STATE
  function handleGetExactLocation() {
    if (navigator.geolocation) {
      console.log("Exact position found");
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  // UPDATE THE RADIUS STATE
  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  useEffect(() => {
    // API KEY IMPORT
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    // API URL REQUEST TO GEOAPIFY
    const placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=circle:153.1531665115317,-27.468924750815013,${
      radius * 1000
    }&bias=proximity:153.1531665115317,-27.468924750815013&limit=100&apiKey=${myAPIKey}`;

    // FETCHING PLACES
    fetch(placesUrl)
      // Convert response to JSON
      .then((response) => response.json())

      // Call functions With JSON Data
      .then((places) => {
        fetchMapData(places);
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
  }, []);

  return (
    <>
      <div id="map">
        {loading && <div className="loadingContainer">Loading...</div>}
      </div>

      <div className="searchMenu">
        <div className="searchinputs">
          <button onClick={handleGetExactLocation}>Use Exact Location</button>
          <div className="radiusElement">
            <div>
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
        </div>

        <div className="filterSearch">
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          All
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          Cafe
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          Restaurant
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          Fast Food
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
          Bars & Pubs
          <input type="checkbox" name="all" id="allBox" className="checkbox" />
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
