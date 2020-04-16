import {
  FETCH_NEW_FAVORITES,
  FETCH_MORE_FAVORITES,
  EDIT_ROOM,
  DELETE_ROOM,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_FAVORITES:
      return action.payload;

    case FETCH_MORE_FAVORITES:
      return [...state, ...action.payload];

    case ADD_TO_FAVORITES:
      return [...state, action.payload];

    case REMOVE_FROM_FAVORITES:
      return state.filter((room) => room.id !== action.payload.id);

    case EDIT_ROOM:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    case DELETE_ROOM:
      return state.filter((room) => room.id !== action.payload);

    default:
      return state;
  }
};
