import React, { useState }from 'react';
import './Geocoder.scss';

function Geocoder(props) {
  // Declare a new state variable, which we'll call when changing panel render
  const [sugg, setSugg]     = useState();
  const [type, setType]     = useState();
  const {
    address: [address, setAddress],
  } = {
    address: useState(0),
    ...(props.state || {})
  };
  const {
    state: [state, dispatch],
  } = {
    state: useState(0),
    ...(props.map || {})
  };
  const {
    elections: [elections, setElections],
  } = {
    elections: useState(0),
    ...(props.elections || {})
  };
  const {
    loader: [loader, setLoader],
  } = {
    loader: useState(0),
    ...(props.loader || {})
  };

  const getAddressSuggestions = (addr, bypass) => {
    let tempAddr = addr.split(",");
    tempAddr = tempAddr[0];
    tempAddr = tempAddr.split(" ");
    let newTempAddr = '';
    let size = tempAddr.length;
    tempAddr.forEach(function(item, index) {
      newTempAddr += item;
      ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
    });
    let url = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?Street=&City=&ZIP=&SingleLine=${newTempAddr}&category=&outFields=User_fld&maxLocations=4&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json`;
    
    try {
        fetch(url)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
          setSugg(data.candidates);
          if(type == 'geocode' || bypass){
            setLoader('active');
            setAddress(data.candidates[0].address);
            dispatch({ type: "loadPonts", value: data.candidates[0].location });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }catch (error) {
        console.log(error);
    }
  }

  const handleChange = (ev) => {
    getAddressSuggestions(ev.target.value);
  }

  const buildOptions = () => {
    const markup = sugg.map((item, key) =>
      <option key={key} value={item.address} location={item.location} onClick={()=>{alert('test')}}></option>
    );
    return markup;
  }

  const startGeocode = (ev) => {
    switch (ev.key) {
      case 'Enter':
          setType('geocode');
          break;
  
      case 'Unidentified':
          setType('geocode');
          break;

      default:
          setType('suggestion');
          break;
    }
  }

  const handleClear = (ev) => {
    setType(undefined);
    setAddress(undefined);
    setElections(undefined);
    dispatch({ type: "loadPonts", value: null });
    (ev.target.parentElement.tagName == 'ARTICLE') ? ev.target.parentElement.children[1].value = '' : ev.target.parentElement.parentElement.children[1].value = '';
  }

  const handleGeocode = (ev) => {
    setType('geocode');
    if(ev.target.parentElement.tagName == 'DIV'){
      getAddressSuggestions(ev.target.parentElement.parentElement.children[1].value, true);
    }else{
      getAddressSuggestions(ev.target.parentElement.children[1].value, true);
    }
  }

  return (
    <article className="Geocoder">
      <label htmlFor="address"></label>
      <input list="address-list" id="address" name="address" placeholder="Enter your address. Ex. 1301 3rd" onClick={startGeocode} onKeyDown={startGeocode} aria-describedby="Address of subscriber." onChange={handleChange}></input>
      <datalist id="address-list">
          {(sugg) ? buildOptions() : ''}
      </datalist>
      {(type != undefined && address == undefined) ? <div className='find-btn' onClick={handleGeocode}><span>Search <i className="fas fa-search-location"></i></span></div> : ''}
      {(type != undefined && address != undefined) ? <div className='clear' onClick={handleClear}><span>x</span></div> : ''}
    </article>
  );
}

export default Geocoder;
