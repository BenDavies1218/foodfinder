import React, { useState, useEffect } from "react";

export default function FoodFavouriteItems({ props }) {
  console.log("Props received in FoodFavouriteItems:", props);
  const [favouriteIcon, setFavouriteIcon] = useState(false);

  const handleFavouriteClick = (venue) => {
    // Check if the venue is already favorited
    const isFavorited = localStorage.getItem(venue.name);

    // If the venue is favorited, remove it from favorites
    if (isFavorited) {
      localStorage.removeItem(venue.name);
      setFavouriteIcon(false);
    } else {
      // If the venue is not favorited, add it to favorites
      localStorage.setItem(venue.name, JSON.stringify(venue));
      setFavouriteIcon(true);
    }
  };

  return (
    <div>
      <h4>Local Storage Items</h4>
      <ul>
        {props.map((item, index) => (
          <div className="container" key={index}>
            {item.key !== "currentSearch" ? (
              <>
                <h5>{item.key}</h5>
                <div>
                  <p>{item.value.address}</p>
                  <p>Distance Away: {item.value.distance / 1000} km</p>
                  {/* Icon and favorite logic */}
                  {favouriteIcon ? (
                    <i
                      className="fa-solid fa-heart"
                      style={{ color: "#FFD43B" }}
                      onClick={() => handleFavouriteClick(item)}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-heart"
                      style={{ color: "#FFD43B" }}
                      onClick={() => handleFavouriteClick(item)}
                    ></i>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </ul>
    </div>
  );
}
