import React, { Component } from 'react';

class Item extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    let value = '';
    if(this.props === undefined){
        value = `Content`;
    }
    
    return (
        <div>{value}</div>
    );
  }
}

export default Item;
