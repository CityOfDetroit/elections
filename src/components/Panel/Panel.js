import React, { useState }from 'react';
import './Panel.scss';
import Connector from '../Connector/Connector';

function Panel(props) {
  const [notification, setNotification] = useState();
  const [phone, setPhone]               = useState();
  const {
    loader: [loader, setLoader]
  } = {
    loader: useState(0),
    ...(props.state || {})
  };

  const buildItem = (item) => {
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
        let ballot = `https://detroitmi.gov/sites/detroitmi.localhost/files/election_info/precincts/${item.properties.precinct}/sample_ballot.pdf`;
        markup = 
        <article key={item.id + 'precinct'} className="poll item">
          <div>
            <strong>VOTING POLL</strong><br/>
            {item.properties.precinct_location}<br/>
            <em>{item.properties.precinct_name}</em><br/><br/>
            <a href={ballot} target="_blank">Download sample ballot</a>
          </div>
        </article>;
        break;
      default:

        break;
    }
    return markup;
  }

  const handleChange = (ev) => {
    switch (ev.target.id) {
      case 'phone':
        phoneFormater(ev);
        setPhone(ev.target.value);
        break;

      case 'notification':
        setNotification(undefined);
        break;

      case 'sign-up-btn':
        setLoader('active');
        let param = {
          "phone_number": phone,
          "address": props.address,
          "lang": 'en'
        };
        if(phone != undefined){
          Connector.start('post',`https://apis.detroitmi.gov/messenger/clients/1/subscribe/`, param, (e)=>{(e.status >= 200 && e.status < 300) ? successPost(e) : errorPost(e)}, (e)=>{errorPost(e)});
        }else{
          setNotification({type: 'err', msg: 'Please provide a valid number.'});
          setLoader('');
        }
        break;
    
      default:
  
        break;
    }
  }

  const successPost = (id) => {
    setLoader('');
    setNotification({type: 'succ', msg: 'The number has been subscribed to the list.'});
  }

  const errorPost = (e) => {
    setLoader('');
    console.log(e);
  }

  const buildNotification = () => {
    return (notification != undefined) ? <p id="notification" className={notification.type} onClick={handleChange} aria-describedby="Notification of request status. Please click to close.">{notification.msg}</p> : '';
  }

  const buildPanel = () => {
    const markup = props.data.features.map((item) =>  buildItem(item));
    setLoader('');
    return markup;
  }

  const phoneFormater = (obj) => {
    var numbers = obj.target.value.replace(/\D/g, ''),
    char = {0:'(',3:')',6:'-'};
    obj.target.value = '';
    for (var i = 0; i < numbers.length; i++) {
        obj.target.value += (char[i]||'') + numbers[i];
    }
  }

  return (
    <div className="Panel">
      {(props.data != undefined) ? buildPanel() : ''}
      {(props.data != undefined) ? <article key={props.data.features[0].id + 'singup'} className="sign-up item">
      <div className="box">
      <strong>GET TEXT REMINDERS</strong><br/>
      <label htmlFor="phone" className="required-field">Phone</label>
      <input type="tel" id="phone" name="phone" pattern="\([0-9]{3}\)[0-9]{3}-[0-9]{4}" placeholder="Ex. (313)333-3333" aria-describedby="Number of subscriber." aria-required="true" required onChange={handleChange}></input>   
      <button id="sign-up-btn" onClick={handleChange}>SIGN UP</button>
      {buildNotification()}  
      </div>
    </article> : ''}
    </div>
  );
}

export default Panel;