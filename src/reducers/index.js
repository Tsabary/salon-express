import { combineReducers } from "redux";

import PopupReducer from "./global/PopupReducer";
import TagsReducer from "./global/TagsReducer";
import EditedStreamReducer from "./global/EditedStreamReducer";

import ExploreLiveReducer from "./explore/ExploreLiveReducer";
import ExploreUpcomingReducer from "./explore/ExploreUpcomingReducer";
import ExplorePastReducer from "./explore/ExplorePastReducer";

import SubscriptionsLiveReducer from "./subscription/SubscriptionsLiveReducer";
import SubscriptionsUpcomingReducer from "./subscription/SubscriptionsUpcomingReducer";
import SubscriptionsPastReducer from "./subscription/SubscriptionsPastReducer";

import CalendarLiveReducer from "./calendar/CalendarLiveReducer";
import CalendarUpcomingReducer from "./calendar/CalendarUpcomingReducer";
import CalendarPastReducer from "./calendar/CalendarPastReducer";

import MineLiveReducer from "./mine/MineLiveReducer";
import MineUpcomingReducer from "./mine/MineUpcomingReducer";
import MinePastReducer from "./mine/MinePastReducer";

import SearchLiveReducer from "./search/SearchLiveReducer";
import SearchUpcomingReducer from "./search/SearchUpcomingReducer";
import SearchPastReducer from "./search/SearchPastReducer";

import StrangerLiveReducer from "./stranger/StrangerLiveReducer";
import StrangerUpcomingReducer from "./stranger/StrangerUpcomingReducer";
import StrangerPastReducer from "./stranger/StrangerPastReducer";
import StrangerProfileReducer from "./stranger/StrangerProfileReducer";

import TemplatesReducer from "./global/TemplatesReducer";

import QuestionsReducer from "./global/QuestionsReducer";

import PositionsReducer from './careers/PositionsReducer';


export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  tags: TagsReducer,
  questions: QuestionsReducer,
  editedStream: EditedStreamReducer,

  // EXPLORE //
  exploreLive: ExploreLiveReducer,
  exploreUpcoming: ExploreUpcomingReducer,
  explorePast: ExplorePastReducer,

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
  subscriptionsPast: SubscriptionsPastReducer,

  // SEARCH
  searchLive: SearchLiveReducer,
  searchUpcoming: SearchUpcomingReducer,
  searchPast: SearchPastReducer,

  // STRANGER //
  strangerLive: StrangerLiveReducer,
  strangerUpcoming: StrangerUpcomingReducer,
  strangerPast: StrangerPastReducer,

  strangerProfile: StrangerProfileReducer,

  // TEMPLATES //
  templates: TemplatesReducer,

  // CAREERS //
  positions : PositionsReducer
});
