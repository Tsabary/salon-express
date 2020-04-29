import { SET_FLOORS, ADD_FLOOR, REMOVE_FLOOR } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case SET_FLOORS:
      return action.payload;

    case ADD_FLOOR:
      return [...state, action.payload];

    case REMOVE_FLOOR:
      return state.filter((floor) => floor.id !== action.payload.id);

    default:
      return state;
  }
};
