import { Link } from "react-router-dom";
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
        },
        (error) => {
          console.error("Error getting location:", error);
          // Handle error or use fallback method (e.g., API call)
          fetchLocationFromAPI();
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
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
        <Link to="/search">
          {/* Button to trigger the search */}
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
