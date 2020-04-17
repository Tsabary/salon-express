import { ADD_NOTIFICATION, RESET_NOTIFICATIONS } from "../../actions/types";

export default (state = 0, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return state + 1;

    case RESET_NOTIFICATIONS:
      return 0;

    default:
      return state;
  }
};
