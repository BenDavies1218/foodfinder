import React, { useEffect, useState } from "react";
import FoodFavouritesItems from "../components/FoodFavouriteItems";

export default function FavouritePage() {
  const [localStorageItems, setLocalStorageItems] = useState([]);

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    // INTERATE THROUGH THE LOCAL STORAGE TO GET ALL FAVOURITES
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      items.push({ key, value });
    }

    setLocalStorageItems(items);
  }, []);

  return (
    <>
      <h1>Hello from the Favourites page</h1>
      <div className="favouriteItemContainer">
        {localStorageItems.length > 1
          ? localStorageItems.map((item, index) => (
              <FoodFavouritesItems key={index} props={item} />
            ))
          : "Nothing in your favourites"}
      </div>
    </>
  );
}
