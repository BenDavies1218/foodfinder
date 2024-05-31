export default function sortFilterResponseData(places) {
  // FILTER CAFE DATA
  const cafes = places.features
    .filter(
      (place) =>
        place.properties.categories.includes("catering.cafe") &&
        place.properties?.name !== undefined
    )
    //   MAP DATA TO NEW OBJECT
    .map((place) => ({
      name: place.properties.name,
      address: place.properties.address_line2,
      distance: place.properties.distance || "Distance not available",
      categories: place.properties.categories || "No data",
    }));

  // FILTER RESTAURANT DATA
  const restaurants = places.features
    .filter(
      (place) =>
        place.properties.categories.includes("catering.restaurant") &&
        place.properties?.name !== undefined
    )
    .map((place) => ({
      name: place.properties.name,
      address: place.properties.address_line2,
      distance: place.properties.distance || "Distance not available",
      categories: place.properties.categories || "No data",
    }));

  // FILTER BAR DATA
  const bars = places.features
    .filter(
      (place) =>
        place.properties.categories.includes("catering.bar") &&
        place.properties?.name !== undefined
    )
    .map((place) => ({
      name: place.properties.name,
      address: place.properties.address_line2,
      distance: place.properties.distance || "Distance not available",
      categories: place.properties.categories || "No data",
    }));

  // FILTER FAST FOOD DATA
  const fastFoods = places.features
    .filter(
      (place) =>
        place.properties.categories.includes("catering.fast_food") &&
        place.properties?.name !== undefined
    )
    .map((place) => ({
      name: place.properties.name,
      address: place.properties.address_line2,
      distance: place.properties.distance || "Distance not available",
      categories: place.properties.categories || "No data",
    }));

  // FILTER DESSERT DATA
  const desserts = places.features
    .filter(
      (place) =>
        place.properties.categories.includes("catering.ice_cream") &&
        place.properties?.name !== undefined
    )
    .map((place) => ({
      name: place.properties.name || "No data",
      address: place.properties.address_line2 || "No data",
      distance: place.properties.distance || "Distance not available",
      categories: place.properties.categories || "No data",
    }));

  return { cafes, restaurants, bars, fastFoods, desserts };
}
