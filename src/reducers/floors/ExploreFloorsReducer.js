import {
  DELETE_FLOOR,
  EDIT_FLOOR,
  FETCH_NEW_EXPLORE_FLOORS,
  FETCH_MORE_EXPLORE_FLOORS,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_EXPLORE_FLOORS:
      return action.payload;

    case FETCH_MORE_EXPLORE_FLOORS:
      return [...state, ...action.payload];

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
