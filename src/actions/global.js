import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import {
  // GLOBAL //
  FETCH_TAGS,
  SET_EDITED_ROOM,
  FETCH_UPDATES,
  ADD_UPDATES_NOTIFICATION,
  RESET_UPDATES_NOTIFICATIONS,
} from "./types";

const db = firebase.firestore();

export const listenToUpdates = (currentUserProfile, notification) => async (
  dispatch
) => {
  var starCountRef = firebase
    .database()
    .ref("updates/" + currentUserProfile.uid)
    .limitToLast(10);

  starCountRef.on("value", (snapshot) => {
    notification();
    dispatch({
      type: FETCH_UPDATES,
      payload: snapshot.val() ? Object.values(snapshot.val()) : [],
    });

    dispatch({
      type: ADD_UPDATES_NOTIFICATION,
    });
  });
};

export const resetUpdatesNotifications = () => {
  return {
    type: RESET_UPDATES_NOTIFICATIONS,
  };
};

export const setEditedRoom = (room) => {
  return {
    type: SET_EDITED_ROOM,
    payload: room,
  };
};

export const fetchTags = () => async (dispatch) => {
  const data = await db
    .collection("tags_count")
    .get()
    .catch((e) => console.error("promise Error", e));

  const allTags = [];

  data.docs.map((doc) => {
    for (let [key, value] of Object.entries(doc.data())) {
      allTags.push({ [key]: value });
    }
  });

  dispatch({
    type: FETCH_TAGS,
    payload: allTags,
  });
};

export const signupToNewletter = (values, cb) => async () => {
  db.collection("mailinglists")
    .doc("premium-plans")
    .set(
      { list: firebase.firestore.FieldValue.arrayUnion(values) },
      { merge: true }
    )
    .then(() => {
      cb();
    });
};