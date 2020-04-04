import {
  FETCH_NEW_CALENDAR_PAST,
  FETCH_MORE_CALENDAR_PAST,
  REMOVE_FROM_CALENDAR,
  EDIT_STREAM,
  DELETE_STREAM
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_CALENDAR_PAST:
      return action.payload;

    case FETCH_MORE_CALENDAR_PAST:
      return [...state, ...action.payload];

    case EDIT_STREAM:
      return state.map(stream =>
        stream.id === action.payload.id ? action.payload : stream
      );
    
    case REMOVE_FROM_CALENDAR:
      return state.filter(stream => stream.id !== action.payload);

    case DELETE_STREAM:
      return state.filter(stream => stream.id !== action.payload);

    default:
      return state;
  }
};
