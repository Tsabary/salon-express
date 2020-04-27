import { FETCH_EVENTS, ADD_EVENT, REMOVE_EVENT } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return action.payload;

    case ADD_EVENT:
      return [...state, action.payload];

    case REMOVE_EVENT:
      return state.filter((event) => event.id !== action.payload.id);

    default:
      return state;
  }
};
