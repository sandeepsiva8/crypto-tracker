const initialState = {
  data: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
