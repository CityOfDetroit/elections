import React, { useState }from 'react';
import './Panel.scss';

function Panel(props) {

  const buildItem = (item) => {
    console.log(item);
    let markup;
    switch (item.properties.boundary_t) {
      case 'Wayne County Community College Commissioner':
        markup = 
        <article key={item.id + 'wccc'} className="wccc item">
          <div>
            <strong>WAYNE COUNTY COMMUNITY COLLEGE COMMISSIONER</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;
      case 'Congressional':
        markup = 
        <article key={item.id + 'congress'} className="congress item">
          <div>
            <strong>CONGRESSIONAL</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;

      case 'State Senate':
        markup = 
        <article key={item.id + 'senate'} className="state-senate item">
          <div>
            <strong>STATE SENATE</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;

      case 'City Council':
        markup = 
        <article key={item.id + 'council'} className="council item">
          <div>
            <strong>CITY COUNCIL</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;

      case 'Police Commissioner':
        markup = 
        <article key={item.id + 'police'} className="police item">
          <div>
            <strong>POLICE COMMISSIONER</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;

      case 'Wayne County Commissioner':
        markup = 
        <article key={item.id + 'wcc'} className="wcc item">
          <div>
            <strong>WAYNE COUNTY COMMISSIONER</strong><br/>
            {item.properties.representa}<br/>
            <em>{item.properties.district_l}</em>
          </div>
        </article>;
        break;

      case 'Election Precincts':
        markup = 
        <article key={item.id + 'precinct'} className="poll item">
          <div><strong>VOTING POLL</strong><br/>
          {item.properties.precinct_location}<br/>
          <em>{item.properties.precinct_name}</em>
          </div>
        </article>;
        break;
      default:

        break;
    }
    return markup;
  }

  const buildPanel = () => {
    const markup = props.data.features.map((item) =>  buildItem(item));
    return markup;
  }

  return (
    <div className="Panel">
      {(props.data != undefined) ? buildPanel() : ''}
    </div>
  );
}

export default Panel;