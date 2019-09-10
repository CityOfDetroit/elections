import React, { Component } from 'react';

class Item extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    console.log("item"+this.props);
    let value = '';
    if(this.props === undefined){
        value = `Content`;
    }
    
    return (
      <h4>SIGNUP FOR ALERTS</h4>
    );
  }
}

export default Item;
