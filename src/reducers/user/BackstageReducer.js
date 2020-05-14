import { FETCH_BACKSTAGE} from "../../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_BACKSTAGE:
      return action.payload;

    default:
      return state;
  }
};
