import {
  FETCH_NEW_MY_ROOMS,
  FETCH_MORE_MY_ROOMS,
  NEW_ROOM,
  DELETE_ROOM,
  EDIT_ROOM,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_MY_ROOMS:
      return [...new Set(action.payload)];

    case FETCH_MORE_MY_ROOMS:
      return [...new Set([...state, ...action.payload])];

    case NEW_ROOM:
      return [...new Set([action.payload, ...state])];

    case DELETE_ROOM:
      return state.filter((room) => room.id !== action.payload);

    case EDIT_ROOM:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    case ADD_TO_FAVORITES:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );
    case REMOVE_FROM_FAVORITES:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    default:
      return state;
  }
};
