import {
  FETCH_NEW_CALENDAR_UPCOMING,
  FETCH_MORE_CALENDAR_UPCOMING,
  ADD_TO_CALENDAR_UPCOMING,
  REMOVE_FROM_CALENDAR,
  EDIT_STREAM
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_CALENDAR_UPCOMING:
      console.log(action.payload);
      return action.payload;

    case FETCH_MORE_CALENDAR_UPCOMING:
      return [...state, ...action.payload];

    case ADD_TO_CALENDAR_UPCOMING:
      return [...state, action.payload];

    case EDIT_STREAM:
      return state.map(stream =>
        stream.id === action.payload.id ? action.payload : stream
      );
    case REMOVE_FROM_CALENDAR:
      return state.filter(stream => stream.id !== action.payload);

    default:
      return state;
  }
};
