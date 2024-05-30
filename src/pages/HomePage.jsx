import { Link } from "react-router-dom"
import parallax from "../functions/parallaxEffect"
import "../styles/HomePage.css"

parallax();

export default function HomePage() {
    return <>
        <div className="image-background">
            <div className="image-background-overlay">
            </div>
        </div>
        <div className="row">
            <h1 className="main-title">FoodFinder</h1>
            <Link to="/search">
                <button className="main-search-button">Search</button>
            </Link>
        </div>
    </>
}