import React, { Component } from 'react';
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const detroitBBox = [-83.3437,42.2102,-82.8754,42.5197];

class Map extends Component {
  constructor(prop){
    super(prop);
    this.map = null;
    this.geocoder = null;
  }
  componentDidMount() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A";

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 13,
      center: [-83.1, 42.36]
    });

    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      bbox: detroitBBox,
      placeholder: "Type Address"
    });

    this.geocoder.on('result', (e) => {
      this.getUserResults(e, this.map)
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));

    this.map.on("load", () => {
      this.map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "typdata.features[i].propertiese": "FeatureCollection",
            "features": []
        }
    });

      this.map.addLayer({
          "id": "point",
          "source": "single-point",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "red"
          }
      });
    });
  }
  
  getUserResults(e, map){
    console.log(e);
    console.log(map);
    
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Election_Boundaries_2018/FeatureServer/0//query?where=&objectIds=&time=&geometry=${e.result.center[0]}%2C${e.result.center[1]}+&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(data);
      let pollingPlaceId = null;
      for (let i = 0; i < data.features.length; i++) {
        if(data.features[i].properties.boundary_t == 'Election Precincts'){
          pollingPlaceId = i;
          break;
        }
      }

      let tempStr = data.features[pollingPlaceId].properties.pollxy.split(',');
      let point = [];
      tempStr.forEach(element => {
        point.push(parseFloat(element));
      });
      point = turf.point(point);
      
      map.getSource('single-point').setData(point.geometry);
      map.flyTo({
        center: data.features[pollingPlaceId].properties.pollxy.split(','),
        zoom: 14
      });
      document.querySelector('.info').innerHTML = `
      <div class="sign-up">
        <span>SIGN UP</span>
        <label for="phone-number">Phone:
          <input type="text" name="phone-number" id="phone-number" placeholder="(313)333-3333" onkeyup="phoneFormater(this)"/>
        </label>
        <div class="phone-valid-alert">Check your phone for a confirmation message. <span class="close-phone-validation-alert">&times;</span></div>
        <div class="phone-invalid-alert">Error: Check your phone number and try again. <span class="close-phone-validation-alert">&times;</span></div>
        <button name="commit" value="Submit" class="form_button">SIGN ME UP FOR REMINDERS</button>
      </div>
      ${data.features.map(feature => `
        <div class="item">
          <span>${feature.properties.boundary_t}</span>
          ${feature.properties.representa != '' ? 
          `<strong>LOCATION:</strong> ${data.features[7].properties.precinct_n}<br>
          <strong>ADDRESS:</strong> ${data.features[7].properties.precinct_l}<br>` : `<strong>LOCATION:</strong> ${data.features[7].properties.precinct_n}<br>
          <strong>ADDRESS:</strong> ${data.features[7].properties.precinct_l}<br>`}
        </div>
        `
      ).join('')}
      `;
    });
  }

  render() {
    return (
      <div className="Map">
       <div ref={el => (this.mapContainer = el)} />
      </div>
    );
  }
}

export default Map;
