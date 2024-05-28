import maplibregl from "maplibre-gl";

/**
 * Function To Build Map with pins
 * @author Benjamin Davies
 *
 * @export
 */
export default function fetchMapData() {
  // API KEY IMPORT
  const myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // POSITION OF THE MAPS CORNERS USING LONGITUDE AND LATITUDE
  let bounds = {
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
    style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
  });

  // ADD A DEFAULT NAVIGATION BAR
  map.addControl(new maplibregl.NavigationControl());

  // ADDING ICONS TO MAP
  map.on("load", async () => {
    try {
      // URL TO FETCH ICON
      const url = `https://api.geoapify.com/v1/icon/?icon=coffee&scaleFactor=2&color=%23ff9999&size=large&type=awesome&apiKey=${myAPIKey}`;

      // FETCH THE IMAGE FROM API
      const response = await fetch(url);
      const icon = await response.blob();
      const img = await createImageBitmap(icon);

      // CHECKING THE IMAGE LOADED PROPERLY
      if (img) {
        map.addImage("pin", img, { pixelRatio: 2 });
      } else {
        console.error("Image loading failed.");
      }
    } catch (error) {
      console.error("An error occurred while loading the image:", error);
    }

    // FETCHING THE DINING VENUES FROM API

    let type = "catering"; // this is all hospotality venues

    // API URL REQUEST TO GEOAPIFY
    let placesUrl = `https://api.geoapify.com/v2/places?categories=catering&filter=rect:${bounds.lon1},${bounds.lat1},${bounds.lon2},${bounds.lat2}&limit=10&apiKey=${myAPIKey}`;

    // FETCHING PLACES
    fetch(placesUrl)
      .then((response) => response.json())
      .then((places) => {
        showGeoJSONPoints(places, type);
      });
  });

  // ADDING THE POPUP ON THE ICON
  function showGeoJSONPoints(geojson, id) {
    // CLEARING ALL THE LAYERS BEFORE
    if (map.getSource(id)) {
      map.removeLayer(layerId);
      map.removeSource(id);
    }

    // ADDING THE POSITION DATA FOR THE ICONS
    map.addSource(id, {
      type: "geojson",
      data: geojson,
    });

    // DECLARE THE NEW LAYER
    let layerId = `${id}-layer`;
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
      let coordinates = e.features[0].geometry.coordinates.slice();
      let name = e.features[0].properties.name;

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
}
