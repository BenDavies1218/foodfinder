import React, { useState } from "react";

export default function FoodFavouriteItems({ props }) {
  // STATE FOR THE FAVOURITE ICON
  const [favouriteIcon, setFavouriteIcon] = useState(false);

  // DESRUCTURE THE PROPS INTO AN OBJECT
  const { key, value } = props;

  // HANDLE CLICK EVENT
  const handleFavouriteClick = () => {
    // CHECK IF THE ITEM IS ALREADY IN LOCAL STORAGE
    const isFavorited = localStorage.getItem(key);

    // IF IT'S IN STORAGE THEN WE REMOVE AND SET FAVOURITE ICON TO FALSE
    if (isFavorited) {
      localStorage.removeItem(key);
      setFavouriteIcon(false);

      // WE WILL SET TO LOCAL STORAGE AND SET FAVOURITE ICON TO TRUE
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      setFavouriteIcon(true);
    }
  };

  return (
    <div>
      <div className="container">
        {/* BECAUSE WE GRAB ALL OF THE LOCAL STORAGE WE NEED TO NOT RENDER THE CURRENTSEARCH CONTENT */}
        {key !== "currentSearch" ? (
          <>
            <h5>{key}</h5>
            <div>
              <p>{value.address}</p>
              <p>Distance Away: {value.distance / 1000} km</p>
              {favouriteIcon ? (
                <i
                  className="fa-solid fa-heart"
                  style={{ color: "#FFD43B" }}
                  onClick={handleFavouriteClick}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-heart"
                  style={{ color: "#FFD43B" }}
                  onClick={handleFavouriteClick}
                ></i>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}