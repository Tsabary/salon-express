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
import EventsReducer from "./room/EventsReducer";
import MyFloorsReducer from "./floors/MyFloorsReducer";
import FloorPlansReducer from "./floors/FloorPlansReducer";
import CurrentFloorReducer from "./floors/CurrentFloorReducer";
import FloorsReducer from "./floors/FloorsReducer";

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

  floors: FloorsReducer,

  // SEARCH //
  searched: SearchReducer,

  // STRANGER //
  strangerProfile: StrangerProfileReducer,

  // USER //
  updates: UpdatesReducer,
  notifications: NotificationReducer,

  // ROOM //
  audioChannels: ChannelsReducer,
  events: EventsReducer,
  myFloors: MyFloorsReducer,
  floorPlans: FloorPlansReducer,
  currentFloor : CurrentFloorReducer,

  // CAREERS //
  positions: PositionsReducer,
});
