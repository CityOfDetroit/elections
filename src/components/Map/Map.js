import React, { useState, useEffect, useContext }from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.scss';
import Connector from '../Connector/Connector';
import { MapContext } from './MapContext';
import * as turf from '@turf/turf';

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
      MapGL.addSource('home', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });

      MapGL.loadImage(
        "https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/22/home.png",
        (error, image) => {
          if (error) throw error;
          MapGL.addImage("home", image);
          MapGL.addLayer({
            "id": "home",
            "type": "symbol",
            "source": "home",
            "layout": {
                "icon-image": "home",
                "icon-size": 1
            }
          })
        }
      );

      MapGL.addSource('poll-place', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });

      MapGL.loadImage(
        "https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/22/building.png",
        (error, image) => {
          if (error) throw error;
          MapGL.addImage("poll", image);
          MapGL.addLayer({
            "id": "poll-place",
            "type": "symbol",
            "source": "poll-place",
            "layout": {
                "icon-image": "poll",
                "icon-size": 0.75
            }
          })
        }
      );
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
        let tempStr;
        data.features.forEach((item) => {
          (item.properties.boundary_t == 'Election Precincts') ? tempStr = item.properties.pollxy.split(',') : 0;
        });
        let point = [];
        tempStr.forEach(element => {
          point.push(parseFloat(element));
        });
        map.resize();
        map.getSource("home").setData(turf.point([points.x, points.y]));
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

