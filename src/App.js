import React, { Component } from 'react';
import './App.css';
import Panel from './components/panel/Panel';
import Map from './components/map/Map';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Panel>
        </Panel>
        <Map>
        </Map>
      </div>
    );
  }
}

export default App;
