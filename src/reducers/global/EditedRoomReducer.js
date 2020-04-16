import { SET_EDITED_ROOM } from "../../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_EDITED_ROOM:
      return action.payload;

    default:
      return state;
  }
};
