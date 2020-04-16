import {
  FETCH_NEW_MY_ROOMS,
  FETCH_MORE_MY_ROOMS,
  NEW_ROOM,
  DELETE_ROOM,
  EDIT_ROOM,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_MY_ROOMS:
      console.log("new rooms is called");
      return [...new Set(action.payload)];

    case FETCH_MORE_MY_ROOMS:
      console.log("more rooms is called");

      return [...new Set([...state, ...action.payload])];

    case NEW_ROOM:
      console.log("new room single is called");

      return [...new Set([action.payload, ...state])];

    case DELETE_ROOM:
      console.log("delete room is called");

      return state.filter((room) => room.id !== action.payload);

    case EDIT_ROOM:
      console.log("edit room is called");

      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    default:
      return state;
  }
};
