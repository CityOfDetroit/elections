import React, { Component } from 'react';
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import home from '../../img/home.png';
import poll from '../../img/elections.png';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const detroitBBox = [-83.3437,42.2102,-82.8754,42.5197];

class Map extends Component {
  constructor(props){
    super(props);
    this.map = null;
    this.geocoder = null;
    this.lat = null;
    this.lng = null;
  }

  geocoderAnimation(){
    console.log('start animation');
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. '; }, 5000);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4'; }, 5500);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 40'; }, 6000);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 400'; }, 6500);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000'; }, 7000);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 v'; }, 7500);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 ve'; }, 8000);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 ver'; }, 8500);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 vern'; }, 9000);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 verno'; }, 9500);
    setTimeout(()=>{ document.querySelector('#geocoder input').placeholder = 'Ex. 4000 vernor'; }, 10000);
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
      placeholder: "Find your election info"
    });

    this.geocoder.on('result', (e) => {
      this.getUserResults(e, this.map, this)
    });

    let map = this.map;
    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));

    try{
      this.geocoderAnimation();
    }catch(e){
      console.log('Error:' + {e});
    }

    this.map.on("load", () => {
      this.map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });

      console.log(home);

      this.map.loadImage(home, function(error, image) {
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

      this.map.addSource('poll-place', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
      });


      this.map.loadImage(poll, function(error, image) {
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
  }

  stripPhoneNumber(number){
    let newNumber = '';
    console.log(number.split('('));
    newNumber = number.split('(')[1];
    console.log(newNumber);
    console.log(newNumber.split(')'));
    newNumber = newNumber.split(')')[0] + newNumber.split(')')[1];
    console.log(newNumber);
    console.log(newNumber.split('-'));
    newNumber = newNumber.split('-')[0] + newNumber.split('-')[1];
    console.log(newNumber);
    return newNumber;
  }

  checkIfPhoneValid(){
    let phoneNumber = document.getElementById('phone').value;
    let a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phoneNumber);
    
    console.log(document.querySelector('#geocoder input').value);
    if(a){
      phoneNumber = this.stripPhoneNumber(phoneNumber);
      let routeIDs = '1';
      let servicesSignup = 'trash';
        let data = {
          'phone_number'  : phoneNumber,
          'waste_area_ids': routeIDs,
          'service_type'  : servicesSignup,
          'address' : document.querySelector('#geocoder input').value,
          'latitude' :  this.lat,
          'longitude' : this.lng
        };
        console.log(data);
        const url = 'https://apis.detroitmi.gov/elections/subscribe/';
        // Create our request constructor with all the parameters we need
        let request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
              'Content-type': 'application/json'
            }),
            mode: 'cors',
            cache: 'default'
        });
        fetch(request)
          .then((resp) => {
            // console.log(resp);
            // console.log(resp.status);
          if(resp.status === 201){
            console.log('item submitted');
            document.querySelector('.phone-valid-alert').className = 'phone-valid-alert active';
          }else{
            document.querySelector('.invalid-phone-error-message').innerHTML = 'Error sending: Please try again.';
            document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
          }
        });
    }else{
      document.querySelector('.invalid-phone-error-message').innerHTML = 'Invalid number. Please enter re-enter you number.';
      document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
    }
  }

  getUserResults(ev, map, parent){
    console.log(ev);
    console.log(map);
    parent.lat = ev.result.center[0];
    parent.lng = ev.result.center[1];
    let items = document.querySelectorAll('.item');
    items.forEach((item)=>{
      item.innerHTML = '';
      item.className = `${item.className.split(' ')[0]} ${item.className.split(' ')[1]}`;
    });
    map.getSource('single-point').setData(ev.result.geometry);
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Election_Boundaries_2018/FeatureServer/0//query?where=&objectIds=&time=&geometry=${ev.result.center[0]}%2C${ev.result.center[1]}+&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(data);
      document.querySelector('.important-dates').className = 'important-dates';
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
            document.querySelector('.wccc').className = 'wccc item active';
            break;
          case 'Congressional':
            document.querySelector('.congress').innerHTML = `
            <div>
              <strong>CONGRESSIONAL</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            document.querySelector('.congress').className = 'congress item active';
            break;

          case 'State Senate':
            document.querySelector('.state-senate').innerHTML = `
            <div>
              <strong>STATE SENATE</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            document.querySelector('.state-senate').className = 'state-senate item active';
            break;

          case 'City Council':
            document.querySelector('.council').innerHTML = `
            <div>
              <strong>CITY COUNCIL</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            document.querySelector('.council').className = 'council item active';
            break;

          case 'Police Commissioner':
            document.querySelector('.police').innerHTML = `
            <div>
              <strong>POLICE COMMISSIONER</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            document.querySelector('.police').className = 'police item active';
            break;

          case 'Wayne County Commissioner':
            document.querySelector('.wcc').innerHTML = `
            <div>
              <strong>WAYNE COUNTY COMMISSIONER</strong><br>
              ${data.features[i].properties.representa}<br>
              <em>${data.features[i].properties.district_l}</em>
            </div>
            `;
            document.querySelector('.wcc').className = 'wcc item active';
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
            document.querySelector('.poll').className = 'poll item active';
            break;
          default:

            break;
        }
      }
      document.querySelector('.sign-up').innerHTML = `
      <div class="box">
      <strong>GET TEXT REMINDERS</strong><br/>
      <label for="phone">
        Phone
        <input id="phone" value="" placeholder="(313)333-3333" />
      </label>
      <div class="phone-valid-alert">Check your phone for a confirmation message. <span class="close-phone-validation-alert">&times;</span></div>
      <div class="phone-invalid-alert"><span class="invalid-phone-error-message"></span> <span class="close-phone-validation-alert">&times;</span></div>      
      <button>SIGN UP</button>
      </div>
      `;
      document.querySelector('#phone').addEventListener('keyup', (ev)=>{
        parent.phoneFormater(ev);
      })
      document.querySelector('.sign-up button').addEventListener('click', (ev)=>{
        parent.checkIfPhoneValid();
      });
      document.querySelector('.sign-up button').addEventListener('click', (ev)=>{
        parent.closePhoneValidationAlert(ev);
      });
      let phoneValidationAlert = document.querySelectorAll('.close-phone-validation-alert');
      for (var i = 0; i < phoneValidationAlert.length; i++) {
        phoneValidationAlert[i].addEventListener('click', function(b){
          parent.closePhoneValidationAlert(b);
        });
      }
      document.querySelector('.sign-up').className = 'sign-up item active';
      let tempStr = data.features[pollingPlaceId].properties.pollxy.split(',');
      let point = [];
      tempStr.forEach(element => {
        point.push(parseFloat(element));
      });

      point = turf.point(point);
  
      map.getSource('poll-place').setData(point.geometry);
      let pointSet = turf.featureCollection([point, ev.result]);
      let center = turf.center(pointSet);
      map.flyTo({
        center: center.geometry.coordinates,
        zoom: 12
      });
    });
  }

  phoneFormater(obj){
    console.log(obj);
    var numbers = obj.target.value.replace(/\D/g, ''),
    char = {0:'(',3:')',6:'-'};
    obj.target.value = '';
    for (var i = 0; i < numbers.length; i++) {
        obj.target.value += (char[i]||'') + numbers[i];
    }
  }

  closePhoneValidationAlert(alertBox){
    alertBox.target.parentNode.className = alertBox.target.parentNode.className.split(' ')[0];
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
