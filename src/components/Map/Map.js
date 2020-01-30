import React, { useState }from 'react';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
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

  return (
    <article id="Map">
      <MapGL 
      style="mapbox://styles/mapbox/streets-v9"
      zoom={[13]}
      center={[-83.1, 42.36]}
      >
        <Marker
          id="home"
          coordinates={[-83.1, 42.36]}>
          <img  src="https://via.placeholder.com/30"/>
        </Marker>
        <Marker
          id="poll"
          coordinates={[-83.1, 42.37]}>
          <img  src="https://via.placeholder.com/30"/>
        </Marker>
      </MapGL>
    </article>
  );
}

export default Map;
