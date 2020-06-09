import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { FETCH_STRANGER_PROFILE, SET_CHANNELS } from "./types";

const db = firebase.firestore();
const analytics = firebase.analytics();

// let channelListener;

export const fetchStrangerProfile = (
  strangerUsername,
  // setCurrentAudioChannel,
  cb
) => async (dispatch) => {
  const data = await db
    .collection("users")
    .where("username", "==", strangerUsername)
    .get()
    .catch((e) => console.error("promise Error fetch starg prog]f", e));

  const profile = data.docs.map((doc) => doc.data())[0];
  if (!profile) return;

  cb(profile);
  analytics.logEvent("stranger_profile_visitor");

  dispatch({
    type: FETCH_STRANGER_PROFILE,
    payload: profile ? profile : null,
  });

  dispatch({
    type: SET_CHANNELS,
    payload: profile.audio_channels ? profile.audio_channels : [],
  });

  // channelListener = db
  //   .collection("active_channels")
  //   .doc(`user-${profile.uid}`)
  //   .onSnapshot((docChannel) => {
  //     console.log("audio channel action 2", docChannel.data());

  //     setCurrentAudioChannel(docChannel.data() ? docChannel.data() : null);
  //     // setGlobalCurrentAudioChannel(
  //     //   docChannel.data() ? docChannel.data() : null
  //     // );
  //   });
};

export const fetchProfileByUid = (uid, cb) => async () => {
  console.log("authoor", "fetchingg");

  const data = await db
    .collection("users")
    .where("uid", "==", uid)
    .get()
    .catch((e) => console.error("promise Error fetch starg prog]f", e));

  const profile = data.docs.map((doc) => doc.data())[0];
  if (profile) cb(profile);
};

export const follow = (userProfile, hostID, cb) => async () => {
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
      analytics.logEvent("follow");

      cb();
    })
    .catch((e) => console.error("promise Error foolow", e));
};

export const unfollow = (userProfile, hostID, cb) => async () => {
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
      analytics.logEvent("unfollow");

      cb();
    })
    .catch((e) => console.error("promise Error", e));
};

export const changeProfilePrivacy = (uid, isPrivate) => () => {
  db.collection("users").doc(uid).set({ private: isPrivate }, { merge: true });
};
