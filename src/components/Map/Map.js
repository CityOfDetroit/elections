import React, { useState, useEffect }from 'react';
import mapboxgl from "mapbox-gl";
import './Map.scss';
const poll = require('../../img/elections.png');

function Map(props) {
  const {
    map: [map, setMap]
  } = {
    map: useState(0),
    ...(props.state || {})
  };

  useEffect(() => {
    const MapGL = new mapboxgl.Map({
      container: "Map",
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 13,
      center: [-83.1, 42.36],
      accessToken:
        'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjampvand2YmEycm9xM3Z0Nzc4NmVibncwIn0.e7CrlI24LCdlF7h4_MaqOQ'
    });

    MapGL.on("load", () => {

    MapGL.addSource('single-point', {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": []
      }
    });

    MapGL.loadImage(poll, function(error, image) {
      if (error) throw error;
      map.addImage('cat', image);
      map.addLayer({
          "id": "point",
          "type": "symbol",
          "source": "single-point",
          "layout": {
              "icon-image": "cat",
              "icon-size": 0.75
          }
      });
    });

    MapGL.addSource('poll-place', {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": []
      }
    });


    MapGL.loadImage(poll, function(error, image) {
      if (error) throw error;
      map.addImage('poll', image);
      map.addLayer({
          "id": "poll-place",
          "type": "symbol",
          "source": "poll-place",
          "layout": {
              "icon-image": "poll",
              "icon-size": 0.75
          }
      });
    });
  });
  });

  return (
    <article id="Map">
    </article>
  );
}

export default Map;

