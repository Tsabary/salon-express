import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import {
  // GLOBAL //
  FETCH_TAGS,
  FETCH_SKILLS,
  SET_EDITED_ROOM,
  FETCH_UPDATES,
  ADD_UPDATES_NOTIFICATION,
  RESET_UPDATES_NOTIFICATIONS,
  FETCH_SUGGESTIONS,
} from "./types";

const db = firebase.firestore();
const storage = firebase.storage();

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

export const fetchSkills = () => async (dispatch) => {
  const data = await db
    .collection("skills_count")
    .get()
    .catch((e) => console.error("promise Error", e));

  if (!data.docs) return;

  const allSkills = [];

  data.docs.map((doc) => {
    for (let [key, value] of Object.entries(doc.data())) {
      allSkills.push({ [key]: value });
    }
  });

  dispatch({
    type: FETCH_SKILLS,
    payload: allSkills,
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

export const addSuggestion = (values, image, cb) => async () => {
  if (!image) return;

  const docRef = db.collection("suggestions").doc();

  const storageRef = storage.ref(`/images/content_suggestions/${docRef.id}/`);

  const upload = await storageRef.put(image);
  if (!upload) return;

  const downloadUrl = await storageRef.getDownloadURL();
  if (!downloadUrl) return;

  docRef.set({ ...values, id: docRef.id, image: downloadUrl }).then(() => {
    cb();
  });
};

export const fetchSuggestions = () => async (dispatch) => {
  const data = await db
    .collection("suggestions")
    .get()
    .catch((e) => console.error("promise Error fetch fav", e));

  dispatch({
    type: FETCH_SUGGESTIONS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const addUserSuggestion = (values, cb) => async () => {
  const docRef = db.collection("user_suggestions").doc();

  docRef.set({ ...values, id: docRef.id }).then(() => {
    cb();
  });
};
