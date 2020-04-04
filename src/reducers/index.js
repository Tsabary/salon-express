import { combineReducers } from "redux";

import TemplatesReducer from "./global/TemplatesReducer";
import PopupReducer from "./global/PopupReducer";
import TagsReducer from "./global/TagsReducer";
import EditedStreamReducer from "./global/EditedStreamReducer";

import ExploreLiveReducer from "./explore/ExploreLiveReducer";
import ExploreUpcomingReducer from "./explore/ExploreUpcomingReducer";

import SubscriptionsLiveReducer from "./subscription/SubscriptionsLiveReducer";
import SubscriptionsUpcomingReducer from "./subscription/SubscriptionsUpcomingReducer";

import CalendarLiveReducer from "./calendar/CalendarLiveReducer";
import CalendarUpcomingReducer from "./calendar/CalendarUpcomingReducer";
import CalendarPastReducer from "./calendar/CalendarPastReducer";

import MineLiveReducer from "./mine/MineLiveReducer";
import MineUpcomingReducer from "./mine/MineUpcomingReducer";
import MinePastReducer from "./mine/MinePastReducer";

import SearchLiveReducer from "./search/SearchLiveReducer";
import SearchUpcomingReducer from "./search/SearchUpcomingReducer";

import StrangerLiveReducer from "./stranger/StrangerLiveReducer";
import StrangerUpcomingReducer from "./stranger/StrangerUpcomingReducer";
import StrangerPastReducer from "./stranger/StrangerPastReducer";
import StrangerProfileReducer from "./stranger/StrangerProfileReducer";

export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  tags: TagsReducer,
  editedStream: EditedStreamReducer,

  // EXPLORE //
  exploreLive: ExploreLiveReducer,
  exploreUpcoming: ExploreUpcomingReducer,

  // MY STREAMS
  mineLive: MineLiveReducer,
  mineUpcoming: MineUpcomingReducer,
  minePast: MinePastReducer,

  // CALENDAR
  calendarLive: CalendarLiveReducer,
  calendarUpcoming: CalendarUpcomingReducer,
  calendarPast: CalendarPastReducer,

  // SUBSCRIPTIONS
  subscriptionsLive: SubscriptionsLiveReducer,
  subscriptionsUpcoming: SubscriptionsUpcomingReducer,

  // SEARCH
  searchLive: SearchLiveReducer,
  searchUpcoming: SearchUpcomingReducer,

  // STRANGER //
  strangerLive: StrangerLiveReducer,
  strangerUpcoming: StrangerUpcomingReducer,
  strangerPast: StrangerPastReducer,
  strangerProfile: StrangerProfileReducer,

  // TEMPLATES
  templates: TemplatesReducer
});
