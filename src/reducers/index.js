import { combineReducers } from "redux";
import StreamsReducer from "./StreamsReducer";
import PageReducer from "./PageReducer";
import PopupReducer from "./PopupReducer";
import TagsReducer from "./TagsReducer";
import EditedStreamReducer from "./EditedStreamReducer";
import CalendarUpcomingReducer from "./CalendarUpcomingReducer";
import CalendarPastReducer from "./CalendarPastReducer";
import MyStreamsUpcomingReducer from "./MyStreamsUpcomingReducer";
import MyStreamsPastReducer from "./MyStreamsPastReducer";
import SubscriptionsReducer from "./SubscriptionsReducer";
import SearchReducer from "./SearchReducer";
import TemplatesReducer from './TemplatesReducer';

export default combineReducers({
  // GLOBAL //
  popupShown: PopupReducer,
  page: PageReducer,
  tags: TagsReducer,
  editedStream: EditedStreamReducer,

  // EXPLORE
  streams: StreamsReducer,

  // MY STREAMS
  myStreamsUpcoming: MyStreamsUpcomingReducer,
  myStreamsPast: MyStreamsPastReducer,

  // CALENDAR
  calendarUpcoming: CalendarUpcomingReducer,
  calendarPast: CalendarPastReducer,

  // SUBSCRIPTIONS
  subscriptions: SubscriptionsReducer,

  // SEARCH
  searchedStreams: SearchReducer,

  // TEMPLATES
  templates: TemplatesReducer
});
