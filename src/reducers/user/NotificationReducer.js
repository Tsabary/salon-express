import {
  ADD_UPDATES_NOTIFICATION,
  RESET_UPDATES_NOTIFICATIONS,
  ADD_BACKSTAGE_NOTIFICATION,
  RESET_BACKSTAGE_NOTIFICATIONS,
  RESET_NOTIFICATIONS,
} from "../../actions/types";

export default (state = { updates: 0, backstage: 0 }, action) => {
  switch (action.type) {
    case ADD_UPDATES_NOTIFICATION:
      return { ...state, updates: state.updates + 1 };

    case RESET_UPDATES_NOTIFICATIONS:
      return { ...state, updates: 0 };

    case ADD_BACKSTAGE_NOTIFICATION:
      return { ...state, backstage: state.backstage + 1 };

    case RESET_BACKSTAGE_NOTIFICATIONS:
      return { ...state, backstage: 0 };

    case RESET_NOTIFICATIONS:
      return { updates: 0, backstage: 0 };

    default:
      return state;
  }
};
