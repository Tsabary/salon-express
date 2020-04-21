import { SET_CHANNELS, ADD_CHANNEL, REMOVE_CHANNEL } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case SET_CHANNELS:
      return action.payload;

    case ADD_CHANNEL:
      return [...state, action.payload];

    case REMOVE_CHANNEL:
      return state.filter((channel) => channel.id !== action.payload.id);

    default:
      return state;
  }
};
