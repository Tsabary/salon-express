import {
  FETCH_NEW_SUBSCRIPTIONS,
  FETCH_MORE_SUBSCRIPTIONS,
  EDIT_STREAM,
  DELETE_STREAM
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_SUBSCRIPTIONS:
      return action.payload;

    case FETCH_MORE_SUBSCRIPTIONS:
      return [...state, ...action.payload];

    case EDIT_STREAM:
      return state.map(stream =>
        stream.id === action.payload.id ? action.payload : stream
      );

    case DELETE_STREAM:
      return state.filter(post => post.id !== action.payload);

    default:
      return state;
  }
};