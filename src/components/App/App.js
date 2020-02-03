import React, { useState, useReducer }from 'react';
import './App.scss';
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import Geocoder from '../Geocoder/Geocoder';
import { MapContext } from "../Map/MapContext";
import { MapReducer, initialState } from '../Map/MapReducer';

function App() {
  const [address, setAddress]     = useState();
  const [elections, setElections] = useState();
  const [state, dispatch]         = useReducer(MapReducer, initialState);

  const getAppStatus = () => {
    return (elections != undefined) ? 'App active' : 'App';
  }

  return (
    <div className={getAppStatus()}>
      <Geocoder state={{ address: [address, setAddress]}} map={{ state: [state, dispatch]}}></Geocoder>
      <MapContext.Provider value={{ state, dispatch }}>
        <Map elections={{ elections: [elections, setElections]}}></Map>
      </MapContext.Provider>
      <Panel data={elections}></Panel>
    </div>
  );
}

export default App;
