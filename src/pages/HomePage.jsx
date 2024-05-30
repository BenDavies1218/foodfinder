import { Link } from "react-router-dom"
import "../styles/HomePage.css"

export default function HomePage() {
    return <>
        <div className="row">
            <h1 className="main-title">FoodFinder</h1>
        </div>
        <div className="row">
            <Link to="/search">
                <button className="main-search-button">Search</button>
            </Link>
        </div>
    </>
}