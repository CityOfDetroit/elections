import React, { Component } from 'react';
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const detroitBBox = [-83.3437,42.2102,-82.8754,42.5197];

class Map extends Component {
  constructor(props){
    super(props);
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
            "type": "FeatureCollection",
            "features": []
        }
      });

      this.map.addLayer({
          "id": "point",
          "source": "single-point",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
          }
      });

      this.map.addSource('poll-place', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });

      this.map.addLayer({
          "id": "poll-place",
          "source": "poll-place",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#f44e42"
          }
      });
    });
  }
  
  getUserResults(ev, map){
    console.log(ev);
    console.log(map);
    
    map.getSource('single-point').setData(ev.result.geometry);
    map.flyTo({
      center: ev.result.geometry.coordinates,
      zoom: 12
    });
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Election_Boundaries_2018/FeatureServer/0//query?where=&objectIds=&time=&geometry=${ev.result.center[0]}%2C${ev.result.center[1]}+&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(data);
      let pollingPlaceId = null;
      for (let i = 0; i < data.features.length; i++) {
        if(data.features[i].properties.boundary_t === 'Election Precincts'){
          pollingPlaceId = i;
        }
        switch (data.features[i].properties.boundary_t) {
          case 'Wayne County Community College Commissioner':
            document.querySelector('.wccc').innerHTML = `
            <div>
              <strong>WAYNE COUNTY COMMUNITY COLLEGE COMMISSIONER</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;
          case 'Congressional':
            document.querySelector('.congress').innerHTML = `
            <div>
              <strong>CONGRESSIONAL</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;

          case 'State Senate':
            document.querySelector('.state-senate').innerHTML = `
            <div>
              <strong>STATE SENATE</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;

          case 'City Council':
            document.querySelector('.council').innerHTML = `
            <div>
              <strong>CITY COUNCIL</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;

          case 'Police Commissioner':
            document.querySelector('.police').innerHTML = `
            <div>
              <strong>POLICE COMMISSIONER</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;

          case 'Wayne County Commissioner':
            document.querySelector('.wcc').innerHTML = `
            <div>
              <strong>WAYNE COUNTY COMMISSIONER</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            break;

          case 'Election Precincts':
            pollingPlaceId = i;
            document.querySelector('.poll').innerHTML = `
            <div>
              <strong>VOTING POLL</strong><br>
              ${data.features[i].properties.precinct_n}<br>
              <em>${data.features[i].properties.precinct_l}</em>
            </div>
            `;
            break;
          default:

            break;
        }
      }
      document.querySelector('.sign-up').innerHTML = `
      <div>
      <strong>STAY INFORM</strong><br/>
      <label for="phone">
        Phones
        <input id="phone" value="" placeholder="(313)333-3333"/>
      </label>
      <button>Sign Up</button>
      </div>
      `;
      let tempStr = data.features[pollingPlaceId].properties.pollxy.split(',');
      let point = [];
      tempStr.forEach(element => {
        point.push(parseFloat(element));
      });

      point = turf.point(point);
  
      map.getSource('poll-place').setData(point.geometry);
    });
  }

  render() {
    return (
      <div className="Map">
       <div ref={el => (this.mapContainer = el)}/>
      </div>
    );
  }
}

export default Map;
