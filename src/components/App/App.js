import React, { useState, useReducer }from 'react';
import './App.scss';
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import Geocoder from '../Geocoder/Geocoder';
import Message from '../Message/Message';
import { MapContext } from "../Map/MapContext";
import { MapReducer, initialState } from '../Map/MapReducer';

function App() {
  const [address, setAddress]     = useState();
  const [elections, setElections] = useState();
  const [msg, setMsg]             = useState({status: 'msg active', title: 'Welcome to the Election tool', body: 'You can use this tool to find your election information. Just type your address at the top to start.'});
  const [state, dispatch]         = useReducer(MapReducer, initialState);
  const [loader, setLoader]       = useState('');

  const getAppStatus = () => {
    return (elections != undefined) ? 'App active' : 'App';
  }

  return (
    <div className={getAppStatus()}>
      <section id="loader-overlay" className={loader}>
          <article>
          <div>
              <div className="loader">
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__ball"></div>
              </div>
              <p>LOADING</p>
          </div>
          </article>
      </section>
      <Message state={{ msg: [msg, setMsg]}}></Message>
      <Geocoder state={{ address: [address, setAddress]}} loader={{ loader: [loader, setLoader]}} map={{ state: [state, dispatch]}} elections={{ elections: [elections, setElections]}}></Geocoder>
      <MapContext.Provider value={{ state, dispatch }}>
        <Map elections={{ elections: [elections, setElections]}}></Map>
      </MapContext.Provider>
      <Panel address={address} data={elections} state={{ loader: [loader, setLoader] }}></Panel>
    </div>
  );
}

export default App;
