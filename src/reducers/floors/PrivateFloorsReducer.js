import {
  ADD_PRIVATE_FLOOR,
  DELETE_FLOOR,
  EDIT_FLOOR,
  FETCH_MORE_PRIVATE_FLOORS,
  FETCH_NEW_PRIVATE_FLOORS,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_PRIVATE_FLOORS:
      return action.payload;

    case FETCH_MORE_PRIVATE_FLOORS:
      return [...state, ...action.payload];

    case ADD_PRIVATE_FLOOR:
      return [action.payload, ...state];

    case DELETE_FLOOR:
      return state.filter((room) => room.id !== action.payload);

    case EDIT_FLOOR:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    default:
      return state;
  }
};
