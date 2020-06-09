import { combineReducers } from "redux";

import PopupReducer from "./global/PopupReducer";
import TagsReducer from "./global/TagsReducer";
import SkillsReducer from "./global/SkillsReducer";
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
import PublicFloorsReducer from "./floors/PublicFloorsReducer";
import BackstageReducer from "./user/BackstageReducer";
import BlogReducer from "./blog/BlogReducer";
import PrivateReducer from "./private/PrivateReducer";
import PublicReducer from "./public/PublicReducer";
import ExploreFloorsReducer from "./floors/ExploreFloorsReducer";
import ContentSuggestionsReducer from "./global/ContentSuggestionsReducer";
import PrivateFloorsReducer from "./floors/PrivateFloorsReducer";

export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  tags: TagsReducer,
  skills: SkillsReducer,
  questions: QuestionsReducer,
  editedRoom: EditedRoomReducer,

  // EXPLORE //
  explore: ExploreReducer,

  // MY FAVORITES //
  favorites: FavoritesReducer,

  // PRIVATE //
  privateRooms: PrivateReducer,

  // PUBLIC //
  publicRooms: PublicReducer,

  // MY ROOMS //
  myRooms: MyRoomsReducer,

  // MY PUBLIC FLOORS //
  publicFloors: PublicFloorsReducer,

  // MY PRIVATE FLOORS //
  privateFloors: PrivateFloorsReducer,

  // ALL FLOORS //
  exploreFloors: ExploreFloorsReducer,

  // SEARCH //
  searched: SearchReducer,

  // STRANGER //
  strangerProfile: StrangerProfileReducer,

  // USER //
  updates: UpdatesReducer,
  backstage: BackstageReducer,
  notifications: NotificationReducer,

  // ROOM //
  audioChannels: ChannelsReducer,
  events: EventsReducer,
  myFloors: MyFloorsReducer,
  floorPlans: FloorPlansReducer,
  // currentFloor : CurrentFloorReducer, // We don't really need this because we're using contest for all that

  // CAREERS //
  positions: PositionsReducer,

  blogPosts: BlogReducer,

  contentSuggestions: ContentSuggestionsReducer,
});
