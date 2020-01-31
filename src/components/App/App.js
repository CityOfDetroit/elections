import React, { useState }from 'react';
import './App.scss';
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import Geocoder from '../Geocoder/Geocoder';

function App() {
  const [map, setMap]         = useState();
  const [address, setAddress] = useState();

  return (
    <div className="App">
      <Geocoder state={{ address: [address, setAddress] }}></Geocoder>
      <Map state={{ map: [map, setMap] }} location={address}></Map>
      <Panel></Panel>
      {/* <div className="poll item"></div>
      <div className="sign-up item"></div> 
      <div className="council item"></div>
      <div className="wccc item"></div>
      <div className="wcc item"></div>
      <div className="police item"></div>
      <div className="state-senate item"></div>
      <div className="congress item"></div> */}
    </div>
  );
}

export default App;
