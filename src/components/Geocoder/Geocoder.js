import React, { useState, useEffect }from 'react';
import './Geocoder.scss';

function Geocoder(props) {
  // Declare a new state variable, which we'll call when changing panel render
  const [sugg, setSugg]     = useState();
  const [type, setType]     = useState();
  const {
    address: [address, setAddress]
  } = {
    naddressav: useState(0),
    ...(props.state || {})
  };

  const geocoderAnimation = () => {
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. '; }, 5000);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4'; }, 5500);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 40'; }, 6000);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 400'; }, 6500);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000'; }, 7000);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 v'; }, 7500);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 ve'; }, 8000);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 ver'; }, 8500);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 vern'; }, 9000);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 verno'; }, 9500);
    setTimeout(()=>{ document.querySelector('#address').placeholder = 'Ex. 4000 vernor'; }, 10000);
  }

  const getAddressSuggestions = (addr) => {
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
          if(type == 'geocode'){
            setAddress(data.candidates[0].location);
          }
        })
        .catch((error) => {
            error(error);
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
      <option key={key} value={item.address} location={item.location}></option>
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
          break;
    }
  }

  useEffect(() => {
    geocoderAnimation();
  });

  return (
    <article className="Geocoder">
      <label htmlFor="address"></label>
      <input list="address-list" id="address" name="address" placeholder="Enter your address." onKeyDown={startGeocode} aria-describedby="Address of subscriber." onChange={handleChange}></input>
      <datalist id="address-list">
          {(sugg) ? buildOptions() : ''}
      </datalist>
    </article>
  );
}

export default Geocoder;
