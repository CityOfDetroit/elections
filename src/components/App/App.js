import React, { useState, useReducer }from 'react';
import './App.scss';
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import Geocoder from '../Geocoder/Geocoder';
import Loader from '../Loader/Loader';
import { MapContext } from "../Map/MapContext";
import { MapReducer, initialState } from '../Map/MapReducer';

function App() {
  const [address, setAddress]     = useState();
  const [elections, setElections] = useState();
  const [state, dispatch]         = useReducer(MapReducer, initialState);
  const [loader, setLoader]       = useState('');

  const getAppStatus = () => {
    return (elections != undefined) ? 'App active' : 'App';
  }

  return (
    <div className={getAppStatus()}>
      <Loader loader={loader}></Loader>
      <Geocoder state={{ address: [address, setAddress]}} map={{ state: [state, dispatch]}} elections={{ elections: [elections, setElections]}}></Geocoder>
      <MapContext.Provider value={{ state, dispatch }}>
        <Map elections={{ elections: [elections, setElections]}}></Map>
      </MapContext.Provider>
      <Panel address={address} data={elections} state={{ loader: [loader, setLoader] }}></Panel>
    </div>
  );
}

export default App;
