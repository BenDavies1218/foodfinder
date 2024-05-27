import {
  Map,
  NavigationControl,
  Popup,
} from "https://cdn.skypack.dev/maplibre-gl";

export default function fetchMapData() {
  let myAPIKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  console.log(myAPIKey);

  let bounds = {
    // Paris
    lat1: 48.88002146841028,
    lon1: 2.3410839716279455,
    lat2: 48.86395628860821,
    lon2: 2.368348737185606,
  };

  let map = new maplibregl.Map({
    center: [(bounds.lon1 + bounds.lon2) / 2, (bounds.lat1 + bounds.lat2) / 2],
    zoom: 15,
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
  });
  map.addControl(new maplibregl.NavigationControl());

  map.on("load", () => {
    // getting an icon from Geoapify Icons API
    // Explicitly set scaleFactor=2 in the call
    // and {pixelRatio: scale} to get better
    // Marker Icon quality with MapLibre GL
    let scale = 2;
    map.loadImage(
      `https://api.geoapify.com/v1/icon/?type=material&color=red&icon=cloud&iconType=awesome&apiKey=b5af20f3a98f4f1d8ce5eec60ff98ce3
      `,
      function (error, image) {
        if (error) throw error;
        map.addImage("utensils", image, {
          pixelRatio: scale,
        }); //38x55px, shadow adds 5px
      }
    );

    let type = "catering.cafe";

    // getting cafes for the given boundary (number of results limited by 100)
    let placesUrl = `https://api.geoapify.com/v2/places?categories=catering.cafe&filter=circle:${
      (bounds.lon1 + bounds.lon2) / 2
    },${(bounds.lat1 + bounds.lat2) / 2},10000&limit=100&apiKey=${myAPIKey}`;

    fetch(placesUrl)
      .then((response) => response.json())
      .then((places) => {
        showGeoJSONPoints(places, type);
      });
  });

  function showGeoJSONPoints(geojson, id) {
    let layerId = `${id}-layer`;

    if (map.getSource(id)) {
      // romove first the old one
      map.removeLayer(layerId);
      map.removeSource(id);
    }

    map.addSource(id, {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: layerId,
      type: "symbol",
      source: id,
      layout: {
        "icon-image": "utensils",
        "icon-anchor": "bottom",
        "icon-offset": [0, 5],
        "icon-allow-overlap": true,
      },
    });

    map.on("styleimagemissing", function (e) {
      const id = e.id;
      const url = `https://api.geoapify.com/v1/icon/?type=material&color=red&icon=${id}&iconType=awesome&apiKey=${myAPIKey}`;

      map.loadImage(url, function (error, image) {
        if (error) throw error;
        map.addImage(id, image, { pixelRatio: 2 });
      });
    });

    map.on("click", layerId, function (e) {
      let coordinates = e.features[0].geometry.coordinates.slice();
      let name = e.features[0].properties.name;
      let distance = e.features[0].properties.distance;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup({
        anchor: "bottom",
        offset: [0, -50],
      })
        .setLngLat(coordinates)
        .setText(name)
        .setText(distance)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", layerId, function () {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", layerId, function () {
      map.getCanvas().style.cursor = "";
    });
  }
}
