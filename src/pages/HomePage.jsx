import { Link, redirect } from "react-router-dom";
import parallax from "../functions/parallaxEffect";
import "../styles/HomePage.css";

import { useEffect } from "react";
import { useCurrentSearchGlobalDispatch } from "../contexts/currentSearchData";

export default function HomePage() {
  // Fetch user Location and save to Context
  const setCurrentSearch = useCurrentSearchGlobalDispatch();

  // GET THE USERS EXACT LOCATION AND SET TO STATE
  function handleGetExactLocation() {
    if (navigator.geolocation && window.innerWidth < 600) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentSearch({ latitude, longitude });
          console.log("Exact position found");
          redirect("/search");
        },
        (error) => {
          console.error("Error getting location:", error);
          // IF THERES AN ERROR FALLBACK TO API CALL
          fetchLocationFromAPI();
        }
      );
    } else {
      console.log("Geolocation or you are on a desktop");
      // Handle error or use fallback method (e.g., API call)
      fetchLocationFromAPI();
    }
  }

  // Function to fetch location from API if geolocation is denied or not supported
  function fetchLocationFromAPI() {
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const startLocation = `https://api.geoapify.com/v1/ipinfo?apiKey=${myAPIKey}`;

    fetch(startLocation)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const { latitude, longitude } = data.location;
        setCurrentSearch({ latitude, longitude });
        redirect("/search");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    // Calling the parallax function to initialize the parallax effect
    parallax();
  }, []);

  return (
    <>
      {/* Main container with background image */}
      <div className="image-background">
        {/* Overlay for the background image */}
        <div className="image-background-overlay"></div>
      </div>

      {/* Container for the main content */}
      <div className="row">
        {/* Main title */}
        <h1 className="main-title">FoodFinder</h1>

        {/* Link to navigate to the search page */}
        {/* Button to trigger the search */}
        <Link to={"/search"}>
          <button
            className="main-search-button"
            onClick={handleGetExactLocation}
          >
            Search
          </button>
        </Link>
      </div>
    </>
  );
}
