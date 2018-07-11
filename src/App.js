import React, { Component } from 'react';
import './App.css';
import Map from './components/map/Map.js';
import logo from './logo.png';

class App extends Component {
  constructor(){
    super();
    this.state = {};
  }

  renderItem

  render() {
    return (
      <div className="App">
        <div className="header">
          <img src={logo} alt="City of Detroit"></img> 
          <div><span>Election Info</span></div>
        </div>
        <div id="geocoder"></div>
        <Map state={this.state}></Map>
        <div className="poll item"></div>
        <div className="sign-up item"></div>
        <div className="council item"></div>
        <div className="wccc item"></div>
        <div className="wcc item"></div>
        <div className="police item"></div>
        <div className="state-senate item"></div>
        <div className="congress item"></div>
        <div className="important-dates active">
          <div>
          <h2>IMPORTANT DATES</h2>
          <h4>Begin Accepting Absentee Voting Request</h4>
          <p>Thursday, May 24th, 2018</p>
          <h4>Begin Mailing Absentee Voting Ballots</h4>
          <p>Saturday, June 23th, 2018</p>
          <h4>Precinct Delegate Write-In deadline</h4>
          <p>Friday, August 3, 2018</p>
          <h4>Notice of Primary Election</h4>
          <p>Tuesday, August 7th, 2018</p> 
          </div>
        </div>
      </div>
    );
  }
}

export default App;
