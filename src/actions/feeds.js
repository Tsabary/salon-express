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
  FETCH_NEW_PUBLIC_FLOORS,
  FETCH_MORE_PUBLIC_FLOORS,
  FETCH_NEW_PRIVATE_FLOORS,
  FETCH_MORE_PRIVATE_FLOORS,
  FETCH_MORE_PRIVATE,
  FETCH_NEW_PUBLIC,
  FETCH_MORE_PUBLIC,
  FETCH_NEW_PRIVATE,
  FETCH_NEW_EXPLORE_FLOORS,
  FETCH_MORE_EXPLORE_FLOORS,
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
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          // .where("language", "in", [...languages, "lir"])
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch ex", e))
      : await db
          .collection("rooms")
          .where("private", "==", false)
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
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          // .where("language", "in", [...languages, "lir"])
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch mo ex", e))
      : await db
          .collection("rooms")
          .where("private", "==", false)
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

export const fetchFirstExploreFloors = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("floors")
    .where("private", "==", false)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_EXPLORE_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMoreExploreFloors = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  currentUserProfile,
  tag,
  languages,
  userID
) => async (dispatch) => {
  const data = db
    .collection("floors")
    .where("private", "==", false)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch more floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_floors");

  dispatch({
    type: FETCH_MORE_EXPLORE_FLOORS,
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
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch searc", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .where("private", "==", false)
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
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error feth mo sear", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .where("private", "==", false)
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

/// NEW FEEDS ///

export const fetchFirstPrivate = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("members", "array-contains", userID)
    .where("private", "==", true)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch fav", e));

  console.log("daaaaaaa private", data);

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_PRIVATE,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMorePrivate = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("members", "array-contains", userID)
    .where("private", "==", true)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch mo fav", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_private");

  dispatch({
    type: FETCH_MORE_PRIVATE,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchFirstPublic = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("members", "array-contains", userID)
    .where("private", "==", false)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch fav", e));

  console.log("daaaaaaa public", data);

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_PUBLIC,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMorePublic = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("rooms")
    .where("members", "array-contains", userID)
    .where("private", "==", false)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch mo fav", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_public");

  dispatch({
    type: FETCH_MORE_PUBLIC,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// MY PUBLIC FLOORS //

export const fetchFirstPublicFloors = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("floors")
    .where("private", "==", false)
    .where("members", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_PUBLIC_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMorePublicFloors = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  currentUserProfile,
  tag,
  languages,
  userID
) => async (dispatch) => {
  const data = db
    .collection("floors")
    .where("private", "==", false)
    .where("members", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch more floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_public_floors");

  dispatch({
    type: FETCH_MORE_PUBLIC_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// MY PRIVATE FLOORS //

export const fetchFirstPrivateFloors = (
  setLastVisible,
  setReachedLast,
  userID
) => async (dispatch) => {
  const data = await db
    .collection("floors")
    .where("private", "==", true)
    .where("members", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 90) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_PRIVATE_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchMorePrivateFloors = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  currentUserProfile,
  tag,
  languages,
  userID
) => async (dispatch) => {
  const data = db
    .collection("floors")
    .where("private", "==", true)
    .where("members", "array-contains", userID)
    .orderBy("last_visit", "desc")
    .startAfter(lastVisible)
    .limit(90)
    .get()
    .catch((e) => console.error("promise Error fetch more floors", e));

  if (!data || !data.docs) return;

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_private_floors");

  dispatch({
    type: FETCH_MORE_PRIVATE_FLOORS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// CLEAR FEEDS ON LOGOUT //

export const clearFeeds = () => (dispatch) => {
  dispatch({
    type: FETCH_NEW_PRIVATE,
    payload: [],
  });

  dispatch({
    type: FETCH_NEW_PUBLIC,
    payload: [],
  });

  dispatch({
    type: FETCH_NEW_PRIVATE_FLOORS,
    payload: [],
  });

  dispatch({
    type: FETCH_NEW_PUBLIC_FLOORS,
    payload: [],
  });
};
