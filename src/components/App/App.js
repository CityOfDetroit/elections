import React, { useState, useReducer }from 'react';
import './App.scss';
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import Geocoder from '../Geocoder/Geocoder';
import { MapContext } from "../Map/MapContext";
import { MapReducer, initialState } from '../Map/MapReducer';

function App() {
  const [address, setAddress] = useState();
  const [state, dispatch] = useReducer(MapReducer, initialState);

  return (
    <div className="App">
      <Geocoder state={{ address: [address, setAddress]}} map={{ state: [state, dispatch]}}></Geocoder>
      <MapContext.Provider value={{ state, dispatch }}>
        <Map location={address}></Map>
      </MapContext.Provider>
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
