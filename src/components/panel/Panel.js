import React, { Component } from 'react';
import './Panel.css';
import logo from './logo.svg';

class Panel extends Component {
  render() {
    let display = null;
    if (this.props.results != null){
      display = 'not empty';
    }
    return (
      <div className="Panel">
        <div className="top">
         <div className="logo"><img src={logo} alt="logo"></img></div>
         <h1 className="title">Elections App</h1>
        </div>
        <div id="geocoder"></div>
        <div className="info">
          {display}
        </div>
      </div>
    );
  }
}

export default Panel;
