import { useState } from "react";

export default function FoodVenueItem({ props }) {
  // Favourite Icon
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
    <>
      <div className="restaurantContainer">
        <h4>{props.name}</h4>
        <div>
          <p>Address: {props.address}</p>
          <p>Distance Away: {props.distance / 1000} km</p>
          {favouriteIcon ? (
            <i
              className="fa-solid fa-heart"
              style={{ color: "#FFD43B" }}
              onClick={() => handleFavouriteClick(props)}
            ></i>
          ) : (
            <i
              className="fa-regular fa-heart"
              style={{ color: "#FFD43B" }}
              onClick={() => handleFavouriteClick(props)}
            ></i>
          )}
        </div>
      </div>
    </>
  );
}
