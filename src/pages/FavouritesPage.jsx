import { useEffect, useState } from "react";
import FoodFavouritesItems from "../components/FoodFavouriteItems";
import { Link } from "react-router-dom";
import "../styles/FavouritesPage.css";

export default function FavouritePage() {
  const [localStorageItems, setLocalStorageItems] = useState([]);

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    // INTERATE THROUGH THE LOCAL STORAGE TO GET ALL FAVOURITES
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      if (key != "currentSearch") items.push({ key, value });
      console.log(key);
    }
    console.log(items);

    setLocalStorageItems(items);
  }, []);

  return (
    <>
      {/* Main container with background image */}
      <div className="image-background">
        {/* Overlay for the background image */}
        <div className="image-background-overlay"></div>
      </div>
      <Link to={"/search"} className="searchLink">
        Back
      </Link>
      <div className="row">
        <div className="fav-container">
          <h1 className="fav-title">Favourites</h1>
          <div className="fav-items-container">
            {localStorageItems.length > 1
              ? localStorageItems.map((item, index) => (
                  <FoodFavouritesItems key={index} props={item} />
                ))
              : "Nothing in your favourites"}
          </div>
        </div>
      </div>
    </>
  );
}
