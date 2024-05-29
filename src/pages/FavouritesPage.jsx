import React, { useEffect, useState } from "react";
import FoodFavouritesItems from "../components/FoodFavouriteItems";

export default function FavouritePage() {
  const [localStorageItems, setLocalStorageItems] = useState([]);

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      items.push({ key, value });
    }

    setLocalStorageItems(items);
  }, []);

  const childData = localStorageItems;
  return (
    <>
      <FoodFavouritesItems props={childData} />
    </>
  );
}
