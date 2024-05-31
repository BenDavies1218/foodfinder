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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentSearch({ latitude, longitude });
          redirect("/search");
        },
        (error) => {
          console.error("Error getting location:", error);
          // IF THERES AN ERROR FALLBACK TO API CALL
          fetchLocationFromAPI();
        }
      );
    } else {
      fetchLocationFromAPI();
    }
  }

  // FALLBACK FUNCTION TO FETCH USER LOCATION FROM API IF BROWSER GEOLOCATION ISN'T AVAILABLE
  function fetchLocationFromAPI() {
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const startLocation = `https://api.geoapify.com/v1/ipinfo?apiKey=${myAPIKey}`;

    fetch(startLocation)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const { latitude, longitude } = data.location;
        setCurrentSearch({ latitude, longitude });
        // REDIRECT AFTER SETTING THE STATE
        redirect("/search");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // EFFECT FOR BACKGOUND
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

        <Link to="/search">
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
