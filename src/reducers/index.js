import { combineReducers } from "redux";
import StreamsReducer from "./StreamsReducer";
import PageReducer from "./PageReducer";
import MyStreamsReducer from "./MyStreamsReducer";
import PopupReducer from "./PopupReducer";
import TagsReducer from "./TagsReducer";
import EditedStreamReducer from "./EditedStreamReducer";
import CalendarReducer from "./CalendarReducer";

export default combineReducers({
  streams: StreamsReducer,
  myStreams: MyStreamsReducer,
  page: PageReducer,
  editedStream: EditedStreamReducer,
  popupShown: PopupReducer,
  tags: TagsReducer,
  calendar : CalendarReducer
});
