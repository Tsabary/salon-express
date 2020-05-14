import {
  FETCH_NEW_BLOG_POSTS,
  FETCH_MORE_BLOG_POSTS,
  NEW_POST,
  DELETE_POST,
  EDIT_POST,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_BLOG_POSTS:
      return action.payload;

    case FETCH_MORE_BLOG_POSTS:
      return [...state, ...action.payload];

    case NEW_POST:
      return [action.payload, ...state];

    case DELETE_POST:
      return state.filter((room) => room.id !== action.payload);

    case EDIT_POST:
      return state.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );

    default:
      return state;
  }
};
