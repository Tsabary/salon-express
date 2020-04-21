import { combineReducers } from "redux";

import PopupReducer from "./global/PopupReducer";
import TagsReducer from "./global/TagsReducer";
import EditedRoomReducer from "./global/EditedRoomReducer";

import ExploreReducer from "./explore/ExploreReducer";
import FavoritesReducer from "./favorites/FavoritesReducer";
import MyRoomsReducer from "./mine/MyRoomsReducer";
import SearchReducer from "./search/SearchReducer";

import StrangerProfileReducer from "./stranger/StrangerProfileReducer";

import QuestionsReducer from "./global/QuestionsReducer";
import PositionsReducer from "./careers/PositionsReducer";
import UpdatesReducer from "./user/UpdatesReducer";
import NotificationReducer from "./user/NotificationReducer";
import ChannelsReducer from "./room/ChannelsReducer";

export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  tags: TagsReducer,
  questions: QuestionsReducer,
  editedRoom: EditedRoomReducer,

  // EXPLORE //
  explore: ExploreReducer,

  // MY FAVORITES //
  favorites: FavoritesReducer,

  myRooms: MyRoomsReducer,

  // SEARCH //
  searched: SearchReducer,

  // STRANGER //
  strangerProfile: StrangerProfileReducer,

  // USER //
  updates: UpdatesReducer,
  notifications: NotificationReducer,

  // ROOM //
  audioChannels: ChannelsReducer,

  // CAREERS //
  positions: PositionsReducer,
});
