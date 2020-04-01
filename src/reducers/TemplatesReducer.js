import { FETCH_TEMPLATES, DELETE_TEMPLATE } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_TEMPLATES:
      return action.payload;

    case DELETE_TEMPLATE:
      return state.filter(t => t.id !== action.payload);

    default:
      return state;
  }
};
