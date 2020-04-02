import { combineReducers } from "redux";

import TemplatesReducer from './global/TemplatesReducer';
import PageReducer from "./global/PageReducer";
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

export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  page: PageReducer,
  tags: TagsReducer,
  editedStream: EditedStreamReducer,

  // EXPLORE //
  exploreLive : ExploreLiveReducer,
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

  // TEMPLATES
  templates: TemplatesReducer
});
