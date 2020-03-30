import { SET_EDITED_STREAM } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_EDITED_STREAM:
      return action.payload;

    default:
      return state;
  }
};
