import {
  FETCH_NEW_SEARCHED,
  FETCH_MORE_SEARCHED,
  DELETE_ROOM,
  EDIT_ROOM
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_SEARCHED:
      return action.payload;

    case FETCH_MORE_SEARCHED:
      return [...state, ...action.payload];

    case DELETE_ROOM:
      return state.filter(room => room.id !== action.payload);

    case EDIT_ROOM:
      return state.map(room =>
        room.id === action.payload.id ? action.payload : room
      );

    default:
      return state;
  }
};
