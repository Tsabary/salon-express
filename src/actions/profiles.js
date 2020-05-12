import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { FETCH_STRANGER_PROFILE } from "./types";

const db = firebase.firestore();
const analytics = firebase.analytics();

export const fetchStrangerProfile = (strangerUsername, setProfile) => async (
  dispatch
) => {
  const data = await db
    .collection("users")
    .where("username", "==", strangerUsername)
    .get()
    .catch((e) => console.error("promise Error fetch starg prog]f", e));
  const profile = data.docs.map((doc) => doc.data())[0];
  setProfile(profile ? profile : null);
  analytics.logEvent("stranger_profile_visitor");

  dispatch({
    type: FETCH_STRANGER_PROFILE,
    payload: profile ? profile : null,
  });
};


export const follow = (
  userProfile,
  hostID,
  setCurrentUserProfile,
  cb
) => async () => {
  const batch = db.batch();

  const userRef = db.collection("users").doc(userProfile.uid);
  batch.set(
    userRef,
    { following: firebase.firestore.FieldValue.arrayUnion(hostID) },
    { merge: true }
  );

  batch
    .commit()
    .then(() => {
      setCurrentUserProfile({
        ...userProfile,
        following: [...userProfile.following, hostID],
      });

      analytics.logEvent("follow");

      cb();
    })
    .catch((e) => console.error("promise Error foolow", e));
};

export const unfollow = (
  userProfile,
  hostID,
  setCurrentUserProfile,
  cb
) => async () => {
  const batch = db.batch();

  const userRef = db.collection("users").doc(userProfile.uid);
  batch.set(
    userRef,
    { following: firebase.firestore.FieldValue.arrayRemove(hostID) },
    { merge: true }
  );

  batch
    .commit()
    .then(() => {
      setCurrentUserProfile({
        ...userProfile,
        following: userProfile.following.filter((id) => id !== hostID),
      });

      analytics.logEvent("unfollow");

      cb();
    })
    .catch((e) => console.error("promise Error", e));
};
