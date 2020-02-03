import React, { useState, useEffect, useContext }from 'react';
import mapboxgl from "mapbox-gl";
import './Map.scss';
import { MapContext } from "./MapContext";
import * as turf from '@turf/turf';
const poll = require('../../img/elections.png');

function Map(props) {
  const { state, dispatch } = useContext(MapContext);

  const {
    map,
    points
  } = state;
  
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
      dispatch({ type: "createMap", value: MapGL });
      MapGL.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });

      MapGL.addLayer({
        "id": "home",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 6,
            "circle-color": "#194ed7"
        }
      });

      MapGL.addSource('poll-place', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });


      MapGL.addLayer({
        "id": "poll",
        "source": "poll-place",
        "type": "circle",
        "paint": {
            "circle-radius": 6,
            "circle-color": "#194ed7"
        }
      });
    });
  }, []);

  useEffect(() => {
    if (points) {
      map.getSource("single-point").setData(turf.point([points.x, points.y]));
      map.flyTo({
        center: [points.x, points.y],
        zoom: 12
      });
    }
  }, [map,points]);

  return (
    <article id="Map">
    </article>
  );
}

export default Map;

