import {
  FETCH_NEW_CALENDAR,
  FETCH_MORE_CALENDAR,
  ADD_TO_CALENDAR,
  REMOVE_FROM_CALENDAR,
  EDIT_CALENDAR
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_CALENDAR:
      console.log(action.payload)
      return action.payload;

    case FETCH_MORE_CALENDAR:
      return [...state, ...action.payload];

      case ADD_TO_CALENDAR:
      return [...state, action.payload];
    
      case EDIT_CALENDAR:
        return [...state, action.payload];

    case REMOVE_FROM_CALENDAR:
      return state.filter(stream => stream.id !== action.payload);

    default:
      return state;
  }
};
