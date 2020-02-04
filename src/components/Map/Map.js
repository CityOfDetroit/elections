import React, { useState, useEffect, useContext }from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.scss';
import Connector from '../Connector/Connector';
import { MapContext } from './MapContext';
import * as turf from '@turf/turf';
const poll = require('../../img/elections.png');

function Map(props) {
  const { state, dispatch } = useContext(MapContext);
  const {
    elections: [elections, setElections],
  } = {
    elections: useState(0),
    ...(props.elections || {})
  };

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
            "circle-radius": 8,
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
            "circle-radius": 8,
            "circle-color": "#cb4d4f"
        }
      });
    });
  }, []);

  useEffect(() => {
    if (points) {
      Connector.start('get', `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Elections_2019/FeatureServer/0/query?where=&objectIds=&time=&geometry=${points.x}%2C${points.y}+&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`, null, loadPoints, failLoad);
    }else{
      (map) ? map.resize() : 0;
    }
  }, [map,points]);

  const loadPoints = (resp) => {
    if(resp.status >= 200 && resp.status < 300){
      resp.json().then(data => {
        setElections(data);
        let tempStr = data.features[0].properties.pollxy.split(',');
        let point = [];
        tempStr.forEach(element => {
          point.push(parseFloat(element));
        });
        map.resize();
        map.getSource("single-point").setData(turf.point([points.x, points.y]));
        map.getSource("poll-place").setData(turf.point(point));
        map.flyTo({
          center: [points.x, points.y],
          zoom: 12
        });
      });
    }else{
      console.log('partial error');
    }
  } 

  const failLoad = (error) => {
    console.log(error);

  }

  return (
    <article id="Map">
    </article>
  );
}

export default Map;

