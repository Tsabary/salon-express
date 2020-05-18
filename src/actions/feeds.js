import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { v1 as uuidv1 } from "uuid";

import {
  // EXPLORE //
  FETCH_NEW_EXPLORE,
  FETCH_MORE_EXPLORE,

  // FAVORITES //
  FETCH_NEW_FAVORITES,
  FETCH_MORE_FAVORITES,

  // MY ROOMS //
  FETCH_NEW_MY_ROOMS,
  FETCH_MORE_MY_ROOMS,

  // SEARCHED LIVE //
  FETCH_NEW_SEARCHED,
  FETCH_MORE_SEARCHED,
  FETCH_NEW_FLOORS,
  FETCH_MORE_FLOORS,
} from "./types";

const db = firebase.firestore();
const analytics = firebase.analytics();

// EXPLORE //

export const fetchFirstExplore = (
  setLastVisible,
  setReachedLast,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          // .where("language", "in", [...languages, "lir"])
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch ex", e))
      : await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch ex", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_EXPLORE,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreExplore = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  currentUserProfile,
  tag,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          // .where("language", "in", [...languages, "lir"])
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch mo ex", e))
      : await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch mo ex", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_explore");

  dispatch({
    type: FETCH_MORE_EXPLORE,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// FAVORITES //

export const fetchFirstFavorites = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("favorites", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch fav", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_FAVORITES,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreFavorites = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("favorites", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch mo fav", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_favorites");

  dispatch({
    type: FETCH_MORE_FAVORITES,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// MINE //

export const fetchFirstMyRooms = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("user_ID", "==", userID)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch my", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_MY_ROOMS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreMyRooms = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("user_ID", "==", userID)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch m my", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_my_rooms");

  dispatch({
    type: FETCH_MORE_MY_ROOMS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// FLOORS //

export const fetchFirstFloors = (
  setLastVisible,
  setReachedLast,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("floors")
          .where("listed", "==", true)
          // .where("language", "in", [...languages, "lir"])
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch ex", e))
      : await db
          .collection("floors")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch floors", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreFloors = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  currentUserProfile,
  tag,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("floors")
          .where("listed", "==", true)
          // .where("language", "in", [...languages, "lir"])
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch more floors", e))
      : await db
          .collection("floors")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch more floors", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_floors");

  dispatch({
    type: FETCH_MORE_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// SEARCHED //

export const fetchFirstSearched = (
  setLastVisible,
  setReachedLast,
  tag,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("rooms")
          // .where("language", "in", [...languages, "lir"])
          .where("tags", "array-contains", tag)
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch searc", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch sear", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  analytics.logEvent("search", { term: tag });

  dispatch({
    type: FETCH_NEW_SEARCHED,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreSearched = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  userID,
  tag,
  languages
) => async (dispatch) => {
  const data =
    languages && languages.length
      ? await db
          .collection("rooms")
          // .where("language", "in", [...languages, "lir"])
          .where("tags", "array-contains", tag)
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error feth mo sear", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(15)
          .get()
          .catch((e) => console.error("promise Error fetch ore ser", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_searched");

  dispatch({
    type: FETCH_MORE_SEARCHED,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};
