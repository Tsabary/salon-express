import {
  ADD_PUBLIC_FLOOR,
  DELETE_FLOOR,
  EDIT_FLOOR,
  FETCH_MORE_PUBLIC_FLOORS,
  FETCH_NEW_PUBLIC_FLOORS,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_PUBLIC_FLOORS:
      return action.payload;

    case FETCH_MORE_PUBLIC_FLOORS:
      return [...state, ...action.payload];

    case ADD_PUBLIC_FLOOR:
      return [action.payload, ...state];

    case DELETE_FLOOR:
      return state.filter((room) => room.id !== action.payload);

    case EDIT_FLOOR:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    // case ADD_TO_FAVORITES:
    //   return state.map((room) =>
    //     room.id === action.payload.id ? action.payload : room
    //   );

    // case REMOVE_FROM_FAVORITES:
    //   return state.map((room) =>
    //     room.id === action.payload.id ? action.payload : room
    //   );

    default:
      return state;
  }
};
