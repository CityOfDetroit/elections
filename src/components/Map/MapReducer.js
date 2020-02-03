const initialState = {
  map: null,
  points: null
};

function MapReducer(state, action) {
  switch (action.type) {
    case 'createMap':
      return {
        ...state,
        map: action.value
      };
    case 'loadPonts':
      return {
        ...state,
        points: action.value
      };
    default:
      throw new Error();
  }
}

export { MapReducer, initialState };