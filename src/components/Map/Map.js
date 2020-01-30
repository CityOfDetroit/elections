import React, { useState }from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import './Map.scss';
const MapGL = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjampvand2YmEycm9xM3Z0Nzc4NmVibncwIn0.e7CrlI24LCdlF7h4_MaqOQ'
});

function Map(props) {
  const {
    map: [map, setMap]
  } = {
    map: useState(0),
    ...(props.state || {})
  };

  const geocoderAnimation = () => {
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

  return (
    <article id="Map">
      <MapGL 
      style="mapbox://styles/mapbox/streets-v9"
      zoom={[13]}
      center={[-83.1, 42.36]}
      ></MapGL>
    </article>
  );
}

export default Map;
