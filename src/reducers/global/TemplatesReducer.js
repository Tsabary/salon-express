import { FETCH_TEMPLATES,NEW_TEMPLATE, DELETE_TEMPLATE } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_TEMPLATES:
      return action.payload;

    case NEW_TEMPLATE:
      return [...state, action.payload];

    case DELETE_TEMPLATE:
      return state.filter(t => t.id !== action.payload);

    default:
      return state;
  }
};
