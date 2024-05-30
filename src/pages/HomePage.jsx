import { Link } from "react-router-dom";
import parallax from "../functions/parallaxEffect";
import "../styles/HomePage.css";

import { useEffect } from "react";
import { useCurrentSearchGlobalDispatch } from "../contexts/currentSearchData";

// Calling the parallax function to initialize the parallax effect
parallax();

export default function HomePage() {
  // Fetch user Location and save to Context
  const setCurrentSearch = useCurrentSearchGlobalDispatch();

  useEffect(() => {
    const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const startLocation = `https://api.geoapify.com/v1/ipinfo?apiKey=${myAPIKey}`;

    fetch(startLocation)
      .then((response) => response.json())
      .then((data) => {
        setCurrentSearch(data); // Update the currentSearch state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setCurrentSearch]);
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
          <button className="main-search-button">Search</button>
        </Link>
      </div>
    </>
  );
}
