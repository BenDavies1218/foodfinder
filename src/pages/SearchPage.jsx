import { useEffect, useState } from "react";
import fetchMapData from "../functions/fetchMapData";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/SearchPage.css";
import FoodVenueItem from "../components/FoodVenueItem";
import sortFilterResponseData from "../functions/sortFilterResponseData";
import { Link } from "react-router-dom";

export default function SearchPage() {
  // STATE FOR Loading Div over the Map Element
  const [loading, setLoading] = useState(true);

  // Food Venues State
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [fastfoods, setFastFoods] = useState([]);
  const [bars, setBars] = useState([]);
  const [desserts, setDesserts] = useState([]);

  // FILTER MENU STATE
  const [filterMenu, setFilterMenu] = useState({
    cafesState: true,
    restaurantsState: true,
    BarsState: true,
    fastFoodState: true,
    dessertsState: true,
  });

  // RADIUS SLIDER STATE
  const [radius, setRadius] = useState(2);

  // USER LOCATION
  const [storedLocation, setStoredLocation] = useState(null);

  // UPDATE THE RADIUS STATE
  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  useEffect(() => {
    // FETCH DATA USERLOCATION FROM LOCAL STORAGE
    const storedLocationData = JSON.parse(
      localStorage.getItem("currentSearch")
    );
    // SET USER LOCATION TO STATE I DID THIS SO THAT IN THE FUTURE IS WE WANT TO ALLOW TO SEARCHES IN DIFFERENT LOCATIONS IT'S POSSIBLE
    setStoredLocation(storedLocationData);
  }, []);

  useEffect(() => {
    // FIRST CHECK IF THE USERLOCATION EXISTS IN STATE
    if (storedLocation) {
      // DECLARE API KEY
      const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

      // DECLARE THE LAT AND LONG OF THE USER
      const { latitude, longitude } = storedLocation;

      // DECLARE THE FILTER OPTIONS
      let searchFilters = {
        cafe: "catering.cafe",
        restaurants: "catering.restaurant",
        bars: "catering.bar,catering.pub",
        fastfoods: "catering.fast_food",
        desserts: "catering.ice_cream",
      };

      // CREATE A STRING BASIS ON WETHER THE STATE IS TRUE OR NOT
      let strings = [
        `${filterMenu.cafesState ? searchFilters.cafe : ""}`,
        `${filterMenu.restaurantsState ? searchFilters.restaurants : ""}`,
        `${filterMenu.BarsState ? searchFilters.bars : ""}`,
        `${filterMenu.fastFoodState ? searchFilters.fastfoods : ""}`,
        `${filterMenu.dessertsState ? searchFilters.desserts : ""}`,
      ];

      // JOIN THE STRING WITH A COMMA AND FILTER OUT WORDS THAT DONT EXIST
      let searchString = strings.filter((str) => str !== "").join(",");

      // SEND REQUEST TO API
      const placesUrl = `https://api.geoapify.com/v2/places?categories=${searchString}&filter=circle:${longitude},${latitude},${
        radius * 1000
      }&bias=proximity:${longitude},${latitude}&limit=50&apiKey=${myAPIKey}`;

      // FETCHING.....
      fetch(placesUrl)
        // CONVERT RESPONSE TO JSON
        .then((response) => response.json())

        // DO STUFF WITH JSON
        .then((places) => {
          // CREATE THE MAP INSTANCE
          fetchMapData(places, storedLocation);

          // SET THE LOADING SCREEN TO FALSE
          setLoading(false);

          // SORT THE DATA SO THAT FOOD VENUES WITHOUT THE PROPER INFO CANNOT BE DISPLAYED
          const { cafes, restaurants, bars, fastFoods, desserts } =
            sortFilterResponseData(places);

          // SET THE DATA IN STATE
          setCafes(cafes);
          setRestaurants(restaurants);
          setBars(bars);
          setFastFoods(fastFoods);
          setDesserts(desserts);
        })
        // HANDLE ALL THE ERRORS :(
        .catch((error) => {
          console.error("An error occurred while fetching places:", error);
        });
    }
    // DEPENDANCY ARRAY
  }, [storedLocation, radius, filterMenu]);

  /**
   * FUNCTION TO HANDLE THE FILTER OPTIONS
   * @author Benjamin Davies
   *
   * @param {*} filter
   */
  function handleFilterChange(filter) {
    // SIMPLE SWITCH CASE, SET THE STATE TO THE OPPOSITE
    switch (filter) {
      case "cafes":
        setFilterMenu({ ...filterMenu, cafesState: !filterMenu.cafesState });
        break;
      case "restaurants":
        setFilterMenu({
          ...filterMenu,
          restaurantsState: !filterMenu.restaurantsState,
        });
        break;
      case "bars":
        setFilterMenu({ ...filterMenu, BarsState: !filterMenu.BarsState });
        break;
      case "fastFood":
        setFilterMenu({
          ...filterMenu,
          fastFoodState: !filterMenu.fastFoodState,
        });
        console.log("fastFood filter changed");
        break;
      case "desserts":
        setFilterMenu({
          ...filterMenu,
          dessertsState: !filterMenu.dessertsState,
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div id="map">
        {loading && (
          <div className="loadingContainer">
            <p className="loading-text">Loading...</p>
          </div>
        )}
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
            <Link to={"/favourites"} className="favouriteLink">
              Favourites
            </Link>
          </div>
        </div>

        <div className="filterSearch">
          <input
            type="checkbox"
            name="all"
            id="cafeBox"
            className="checkbox"
            onClick={() => handleFilterChange("cafes")}
            defaultChecked
          />
          Cafe
          <input
            type="checkbox"
            name="all"
            id="restaurantBox"
            className="checkbox"
            onClick={() => handleFilterChange("restaurants")}
            defaultChecked
          />
          Restaurant
          <input
            type="checkbox"
            name="all"
            id="fastBox"
            className="checkbox"
            onClick={() => handleFilterChange("fastFood")}
            defaultChecked
          />
          Fast Food
          <input
            type="checkbox"
            name="all"
            id="barBox"
            className="checkbox"
            onClick={() => handleFilterChange("bars")}
            defaultChecked
          />
          Bars & Pubs
          <input
            type="checkbox"
            name="all"
            id="dessertBox"
            className="checkbox"
            onClick={() => handleFilterChange("desserts")}
            defaultChecked
          />
          Dessert
        </div>
      </div>

      <section id="displayResults">
        {/* CAFE COMPONENTS */}
        {cafes.length > 0 && filterMenu.cafesState && (
          <>
            <h2 className="display-title">Cafes</h2>
            <div className="foodVenueContainer">
              {cafes.length > 0 &&
                cafes.map((cafe, index) => (
                  <FoodVenueItem key={index} props={cafe} />
                ))}
            </div>
          </>
        )}

        {/* RESTAURANT COMPONENTS */}
        {restaurants.length > 0 && filterMenu.restaurantsState && (
          <>
            <h2 className="display-title">Restaurants</h2>
            <div className="foodVenueContainer">
              {restaurants.length > 0 &&
                restaurants.map((restaurant, index) => (
                  <FoodVenueItem key={index} props={restaurant} />
                ))}
            </div>
          </>
        )}

        {/* BARS COMPONENTS */}
        {bars.length > 0 && filterMenu.BarsState && (
          <>
            <h2 className="display-title">Bars & Pubs</h2>
            <div className="barsontainer">
              {bars.length > 0 &&
                bars.map((bar, index) => (
                  <FoodVenueItem key={index} props={bar} />
                ))}
            </div>
          </>
        )}

        {/* FAST FOOD COMPONENTS */}
        {fastfoods.length > 0 && filterMenu.fastFoodState && (
          <>
            <h2 className="display-title">Fast Food</h2>
            <div className="foodVenueContainer">
              {fastfoods.length > 0 &&
                fastfoods.map((fastfood, index) => (
                  <FoodVenueItem key={index} props={fastfood} />
                ))}
            </div>
          </>
        )}

        {/* DESSERT COMPONENTS */}
        {desserts.length > 0 && filterMenu.dessertsState && (
          <>
            <h2 className="display-title">Desserts</h2>
            <div className="foodVenueContainer">
              {desserts.length > 0 &&
                desserts.map((dessert, index) => (
                  <FoodVenueItem key={index} props={dessert} />
                ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
