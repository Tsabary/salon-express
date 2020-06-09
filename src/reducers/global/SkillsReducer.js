import { FETCH_SKILLS } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_SKILLS:
      return action.payload;

    default:
      return state;
  }
};
