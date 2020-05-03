import { SET_CURRENT_FLOOR } from "../../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_FLOOR:
      return action.payload;

    default:
      return state;
  }
};
