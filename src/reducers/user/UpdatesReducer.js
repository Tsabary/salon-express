import { FETCH_UPDATES} from "../../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_UPDATES:
      return action.payload;

    default:
      return state;
  }
};
