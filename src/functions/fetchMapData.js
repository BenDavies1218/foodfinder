import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Function to build a map with pins
 * @param {Object} places - GeoJSON data for the places
 * @param {Object} bounds - Coordinates for the map bounds
 * @param {string} apiKey - API key for Geoapify
 */
export default function fetchMapData(places) {
  // API KEY IMPORT
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // POSITION OF THE MAP'S CORNERS USING LONGITUDE AND LATITUDE
  const bounds = {
    lat1: -27.570125,
    lon1: 153.021072,
    lat2: -27.370125,
    lon2: 153.321072,
  };

  // CREATING A NEW MAP INSTANCE
  const map = new maplibregl.Map({
    center: [(bounds.lon1 + bounds.lon2) / 2, (bounds.lat1 + bounds.lat2) / 2],
    zoom: 11,
    container: "map",
    style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apiKey}`,
  });

  // ADD A DEFAULT NAVIGATION BAR
  map.addControl(new maplibregl.NavigationControl());

  // ADDING ICONS TO MAP
  map.on("load", async () => {
    try {
      // URL TO FETCH ICON
      const url = `https://api.geoapify.com/v1/icon/?type=awesome&color=red&scaleFactor=2&icon=utensils&apiKey=${apiKey}`;

      // FETCH THE IMAGE FROM API
      const response = await fetch(url);
      const icon = await response.blob();
      const img = await createImageBitmap(icon);

      // CHECKING THE IMAGE LOADED PROPERLY
      if (img) {
        map.addImage("pin", img, { pixelRatio: 2 });
        showGeoJSONPoints(map, places, "catering");
      } else {
        console.error("Image loading failed.");
      }
    } catch (error) {
      console.error("An error occurred while loading the image:", error);
    }
  });
}

/**
 * Function to show GeoJSON points on the map
 * @param {Object} map - Map instance
 * @param {Object} geojson - GeoJSON data
 * @param {string} id - Source and layer ID
 */
function showGeoJSONPoints(map, geojson, id) {
  // CLEARING ALL THE LAYERS BEFORE
  if (map.getSource(id)) {
    map.removeLayer(`${id}-layer`);
    map.removeSource(id);
  }

  // ADDING THE POSITION DATA FOR THE ICONS
  map.addSource(id, {
    type: "geojson",
    data: geojson,
  });

  // DECLARE THE NEW LAYER
  const layerId = `${id}-layer`;
  map.addLayer({
    id: layerId,
    type: "symbol",
    source: id,
    layout: {
      "icon-image": "pin",
      "icon-anchor": "bottom",
      "icon-offset": [0, 5],
      "icon-allow-overlap": true,
    },
  });

  // CLICK EVENT TO OPEN POPUP
  map.on("click", layerId, function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    // CALCULATING POPUP POSITION
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // CREATE A NEW POPUP INSTANCE
    new maplibregl.Popup({
      anchor: "bottom",
      offset: [0, -50],
    })
      .setLngLat(coordinates)
      .setText(name)
      .addTo(map);
  });

  // EVENT LISTENERS FOR MOUSE HOVER ON ICONS
  map.on("mouseenter", layerId, function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // EVENT LISTENER FOR LEAVING ICONS
  map.on("mouseleave", layerId, function () {
    map.getCanvas().style.cursor = "";
  });
}
