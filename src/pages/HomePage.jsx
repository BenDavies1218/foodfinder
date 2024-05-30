import { Link } from "react-router-dom"
import parallax from "../functions/parallaxEffect"
import "../styles/HomePage.css"

// Calling the parallax function to initialize the parallax effect
parallax();

export default function HomePage() {
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