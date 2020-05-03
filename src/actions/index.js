import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { v1 as uuidv1 } from "uuid";

import {
  // GLOBAL //
  TOGGLE_POPUP,
  FETCH_TAGS,
  SET_EDITED_ROOM,
  FETCH_QUESTIONS,

  // ROOMS //
  NEW_ROOM,
  DELETE_ROOM,
  EDIT_ROOM,

  // EXPLORE //
  FETCH_NEW_EXPLORE,
  FETCH_MORE_EXPLORE,

  // FAVORITES //
  FETCH_NEW_FAVORITES,
  FETCH_MORE_FAVORITES,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,

  // MY ROOMS //
  FETCH_NEW_MY_ROOMS,
  FETCH_MORE_MY_ROOMS,

  // SEARCHED LIVE //
  FETCH_NEW_SEARCHED,
  FETCH_MORE_SEARCHED,

  // STRANGER PROFILE //
  FETCH_STRANGER_PROFILE,

  // CAREERS //
  FETCH_POSITIONS,
  FETCH_SINGLE_POSITION,
  FETCH_UPDATES,
  ADD_NOTIFICATION,
  RESET_NOTIFICATIONS,
  ADD_CHANNEL,
  SET_CHANNELS,
  REMOVE_CHANNEL,
  FETCH_EVENTS,
  REMOVE_EVENT,
  ADD_EVENT,
  SET_FLOORS,
  ADD_FLOOR,
  SET_FLOOR_PLANS,
  SET_CURRENT_FLOOR,
} from "./types";

import { titleToKey } from "../utils/strings";

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();
const RTDB = firebase.database();

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
  setLastVisible(data.docs[data.docs.length - 1]);
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
  setLastVisible(data.docs[data.docs.length - 1]);
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
  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
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
  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
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
  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
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
  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_my_rooms");

  dispatch({
    type: FETCH_MORE_MY_ROOMS,
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
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch searc", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch sear", e));
  setLastVisible(data.docs[data.docs.length - 1]);
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
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error feth mo sear", e))
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(15)
          .get()
          .catch((e) => console.error("promise Error fetch ore ser", e));
  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_searched");

  dispatch({
    type: FETCH_MORE_SEARCHED,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// ROOM //

export const logGuestEntry = (room, currentUserProfile) => () => {
  const roomRef = db.collection("rooms").doc(room.id);
  roomRef
    .set(
      {
        last_visit: new Date(),
        visitors_count: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true }
    )
    .catch((e) => console.error("promise Error log gues", e));

  analytics.logEvent("room_entered");

  if (!room.favorites) return;

  currentUserProfile && currentUserProfile.uid
    ? room.favorites.forEach((userID) => {
        if (userID !== currentUserProfile.uid) {
          RTDB.ref("updates/" + userID)
            .push()
            .set({
              user_ID: currentUserProfile.uid,
              user_name: currentUserProfile.name,
              user_username: currentUserProfile.username,
              room_ID: room.id,
              room_name: room.title,
              created_on: Date.now(),
            })
            .catch((e) => console.error("promise Error log guest", e));
        }
      })
    : room.favorites.forEach((userID) => {
        RTDB.ref("updates/" + userID)
          .push()
          .set({
            room_ID: room.id,
            room_name: room.title,
            created_on: Date.now(),
          })
          .catch((e) => console.error("promise Error log guest", e));
      });
};

// FAVORITES LIST //

export const addToFavorites = (currentUserProfile, room, cb) => async (
  dispatch
) => {
  console.error("mine", "Addind to favorites");
  db.collection("rooms")
    .doc(room.id)
    .set(
      {
        favorites: firebase.firestore.FieldValue.arrayUnion(
          currentUserProfile.uid
        ),
        favorites_count: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true }
    )
    .then(() => {
      analytics.logEvent("favorites_added");
      if (cb) cb();
      dispatch({
        type: ADD_TO_FAVORITES,
        payload: {
          ...room,
          favorites: room.favorites
            ? [...room.favorites, currentUserProfile.uid]
            : [currentUserProfile.uid],
        },
      });
    })
    .catch((e) => console.error("promise Error add to fav", e));
};

export const removeFromFavorites = (currentUserProfile, room, cb) => async (
  dispatch
) => {
  db.collection("rooms")
    .doc(room.id)
    .set(
      {
        favorites: firebase.firestore.FieldValue.arrayRemove(
          currentUserProfile.uid
        ),
        favorites_count: firebase.firestore.FieldValue.increment(-1),
      },
      { merge: true }
    )
    .then(() => {
      analytics.logEvent("favorites_removed");
      if (cb) cb();

      dispatch({
        type: REMOVE_FROM_FAVORITES,
        payload: {
          ...room,
          favorites: room.favorites.filter(
            (r) => r.id !== currentUserProfile.id
          ),
        },
      });
    })
    .catch((e) => console.error("promise Error remove form fav", e));
};

// STRANGER //

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

// SINGLE ROOM //

const compare = (a, b) => {
  return a.members.length < b.members.length
    ? 1
    : a.members.length === b.members.length
    ? a.members.length < b.members.length
      ? 1
      : -1
    : -1;
};

let multiverseListener;
let channelListener;

export const fetchSingleRoom = (
  room_ID,
  setRoom,
  setGlobalRoom,
  setCurrentAudioChannel,
  setGlobalCurrentAudioChannel
) => async (dispatch) => {
  const docRoom = await db
    .collection("rooms")
    .doc(room_ID)
    .get()
    .catch((e) => console.error("promise Error fetch sing room", e));
  analytics.logEvent("room_direct_navigation");
  if (docRoom.data()) {
    setRoom(docRoom.data());
    setGlobalRoom(docRoom.data());

    dispatch({
      type: SET_CHANNELS,
      payload: docRoom.data().audio_channels
        ? docRoom.data().audio_channels
        : [],
    });
  }

  channelListener = db
    .collection("active_channels")
    .doc(room_ID)
    .onSnapshot((docChannel) => {
      setCurrentAudioChannel(docChannel.data() ? docChannel.data() : null);
      setGlobalCurrentAudioChannel(
        docChannel.data() ? docChannel.data() : null
      );
    });
};

export const listenToMultiverse = (
  entityID,
  setMultiverse,
  setMultiverseArray,
  newPortal
) => () => {
  multiverseListener = db
    .collection("multiverses")
    .doc(entityID)
    .onSnapshot((docMultiverse) => {
      if (docMultiverse.data()) {
        setMultiverse(docMultiverse.data());

        const arrayVerse = Object.values(docMultiverse.data());

        setMultiverseArray(arrayVerse.sort(compare));
      } else {
        if (newPortal) newPortal();
      }
    });
};

// Deteching the listener for the multiverse
export const detachListener = () => () => {
  if (multiverseListener) multiverseListener();
  if (channelListener) channelListener();
};

// Setting the active audio channel
export const setActiveChannel = (channel, roomID, cb) => () => {
  db.collection("active_channels")
    .doc(roomID)
    .set({
      link: channel ? channel.link : null,
      source: channel ? channel.source : null,
    })
    .then(() => {
      if (cb) cb();
    });
};

// Setting the active audio channel
export const setActiveChannelFloorRoom = (
  channel,
  roomIndex,
  floor,
  cb
) => () => {
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: {
        ...floor.rooms[roomIndex],
        active_channel: {
          link: channel ? channel.link : null,
          source: channel ? channel.source : null,
        },
      },
    },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      if (cb) cb();
      analytics.logEvent("floor_room_active_channel_changed");
    })
    .catch((e) => console.error("promise Error update room", e));
};

// Enter a portal
export const enterPortal = (entityID, portal, uid) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(entityID);
  const key = titleToKey(portal.title);

  batch.set(
    portalDoc,
    {
      [key]: {
        title: portal.title,
        created_on: portal.created_on,
        members: firebase.firestore.FieldValue.arrayUnion(uid),
      },
    },
    { merge: true }
  );

  batch.commit();
};

// Leave a portal
export const leavePortal = (entityID, portal, uids) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(entityID);
  const key = titleToKey(portal.title);

  uids.forEach((uid) => {
    batch.set(
      portalDoc,
      {
        [key]: {
          title: portal.title,
          created_on: portal.created_on,
          members: firebase.firestore.FieldValue.arrayRemove(uid),
        },
      },
      { merge: true }
    );
  });

  batch.commit();
};

//Replacing between UUID and UID in the portal logs
export const replaceTimestampWithUid = (
  room,
  portal,
  previousID,
  newID
) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(room.id);
  const key = titleToKey(portal.title);

  batch.set(
    portalDoc,
    {
      [key]: {
        title: portal.title,
        created_on: portal.created_on,
        members: firebase.firestore.FieldValue.arrayRemove(previousID),
      },
    },

    { merge: true }
  );

  batch.set(
    portalDoc,
    {
      [key]: {
        title: portal.title,
        created_on: portal.created_on,
        members: firebase.firestore.FieldValue.arrayUnion(newID),
      },
    },

    { merge: true }
  );

  batch.commit();
};

// Opening a new portal
export const newPortal = (newPortal, oldPortal, entityID, uid, cb) => () => {
  const portalObj = {
    title: newPortal,
    members: [uid],
    created_on: new Date(),
  };

  const batch = db.batch();
  const verseDoc = db.collection("multiverses").doc(entityID);

  let newPortalKey = titleToKey(newPortal);
  let oldPortalKey = oldPortal ? titleToKey(oldPortal.title) : null;

  batch.set(
    verseDoc,
    {
      [newPortalKey]: portalObj,
    },
    { merge: true }
  );

  if (oldPortal) {
    batch.set(
      verseDoc,
      {
        [oldPortalKey]: {
          members: firebase.firestore.FieldValue.arrayRemove(uid),
        },
      },
      { merge: true }
    );
  }

  batch.commit().then(() => {
    cb(portalObj);
  });
};

// AUDIO CHANNELS //

export const addChannel = (channel, room, cb) => async (dispatch) => {
  const channelObj = {
    ...channel,
    source: channel.source.toLowerCase(),
    id: uuidv1(),
  };

  db.collection("rooms")
    .doc(room.id)
    .set(
      {
        audio_channels: firebase.firestore.FieldValue.arrayUnion(channelObj),
      },
      { merge: true }
    )
    .then(() => {
      cb();

      dispatch({
        type: ADD_CHANNEL,
        payload: channelObj,
      });
    })
    .catch((e) => console.error("promise Error add chanen", e));
};

export const addChannelFloorRoom = (
  channel,
  roomIndex,
  floor,
  cb
) => async () => {
  const channelObj = {
    ...channel,
    source: channel.source.toLowerCase(),
    id: uuidv1(),
  };

  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: {
        ...floor.rooms[roomIndex],
        audio_channels: floor.rooms[roomIndex].audio_channels
          ? [...floor.rooms[roomIndex].audio_channels, channelObj]
          : [channelObj],
      },
    },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      cb();
      analytics.logEvent("floor_room_event_added");
    })
    .catch((e) => console.error("promise Error update room", e));
};

export const deleteChannel = (channel, room, cb) => async (dispatch) => {
  db.collection("rooms")
    .doc(room.id)
    .set(
      { audio_channels: firebase.firestore.FieldValue.arrayRemove(channel) },
      { merge: true }
    )
    .then(() => {
      cb();
      dispatch({
        type: REMOVE_CHANNEL,
        payload: channel,
      });
    })
    .catch((e) => console.error("promise Error delete channel", e));
};

export const deleteChannelFloorRoom = (
  channel,
  roomIndex,
  floor,
  cb
) => async () => {
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: {
        ...floor.rooms[roomIndex],
        audio_channels: floor.rooms[roomIndex].audio_channels.filter(
          (cha) => cha.id !== channel.id
        ),
      },
    },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      cb();
      analytics.logEvent("floor_room_event_added");
    })
    .catch((e) => console.error("promise Error update room", e));
};

export const saveArrayOrder = (collection, key, array, parent, reset) => () => {
  db.collection(collection)
    .doc(parent.id)
    .set({ [key]: array }, { merge: true })
    .then(() => reset());
};

// EVENTS //

export const fetchEvents = (room) => async (dispatch) => {
  const data = await db
    .collection("events")
    .where("room_ID", "==", room.id)
    .where("start", ">", new Date())
    .orderBy("start", "desc")
    .limit(10)
    .get();

  dispatch({
    type: FETCH_EVENTS,
    payload: data && data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const addEvent = (event, room, cb) => async (dispatch) => {
  const eventDoc = db.collection("events").doc();
  const eventObj = { ...event, room_ID: room.id, id: eventDoc.id };

  eventDoc
    .set(eventObj)
    .then(() => {
      cb();

      dispatch({
        type: ADD_EVENT,
        payload: eventObj,
      });
    })
    .catch((e) => console.error("promise Error add event", e));
};

export const addEventFloor = (event, roomIndex, floor, cb) => async () => {
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: {
        ...floor.rooms[roomIndex],
        events: floor.rooms[roomIndex].events
          ? [...floor.rooms[roomIndex].events, event]
          : [event],
      },
    },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      cb();
      analytics.logEvent("floor_room_event_added");
    })
    .catch((e) => console.error("promise Error update room", e));
};

export const deleteEvent = (event) => async (dispatch) => {
  db.collection("events")
    .doc(event.id)
    .delete()
    .then(() => {
      dispatch({
        type: REMOVE_EVENT,
        payload: event,
      });
    })
    .catch((e) => console.error("promise Error delete event", e));
};

export const associateWithRoom = (room, associate) => async (dispatch) => {
  const newRoom = { ...room, associate };

  db.collection("rooms")
    .doc(room.id)
    .set({ associate }, { merge: true })
    .then(() => {
      dispatch({
        type: EDIT_ROOM,
        payload: newRoom,
      });
    })
    .catch((e) => console.error("promise Error associate with r", e));
};

export const keepRoomListed = (room, listed) => async (dispatch) => {
  const newRoom = { ...room, listed };

  db.collection("rooms")
    .doc(room.id)
    .set({ listed }, { merge: true })
    .then(() => {
      dispatch({
        type: EDIT_ROOM,
        payload: newRoom,
      });
    })
    .catch((e) => console.error("promise Error keep listed", e));
};

// ROOM //

export const newRoom = (values, reset) => async (dispatch) => {
  window.scrollTo(0, 0);

  const batch = db.batch();
  const newDoc = await db.collection("rooms").doc();

  const room = {
    ...values,
    last_visit: new Date(),
    id: newDoc.id,
  };

  batch.set(newDoc, room);

  batch
    .commit()
    .then((d) => {
      analytics.logEvent("room_opened", {
        language: values.language,
        tags: values.tags,
      });

      reset();

      dispatch({
        type: NEW_ROOM,
        payload: room,
      });
    })
    .catch((e) => console.error("promise Error new room", e));
};

export const updateRoom = (updatedRoom, parameter, reset) => (dispatch) => {
  const batch = db.batch();
  const docRef = db.collection("rooms").doc(updatedRoom.id);

  batch.set(docRef, updatedRoom, { merge: true });

  batch
    .commit()
    .then(() => {
      reset();
      window.location.hash = "";
      analytics.logEvent("room_updated", { parameter });

      dispatch({
        type: EDIT_ROOM,
        payload: updatedRoom,
      });
    })
    .catch((e) => console.error("promise Error update room", e));
};

export const updateFloorRoom = (
  updatedRoom,
  roomIndex,
  floor,
  parameter,
  reset
) => (dispatch) => {
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: { ...floor.rooms, [roomIndex]: updatedRoom },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      reset();
      window.location.hash = "";
      analytics.logEvent("floor_room_updated", { parameter });

      // listens to changes anyway
      // dispatch({
      //   type: EDIT_ROOM,
      //   payload: updatedRoom,
      // });
    })
    .catch((e) => console.error("promise Error update room", e));
};

export const removeRoom = (room) => (dispatch) => {
  const batch = db.batch();

  const doc = db.collection("rooms").doc(room.id);
  batch.delete(doc);

  batch
    .commit()
    .then(() => {
      analytics.logEvent("room_deleted");

      dispatch({
        type: DELETE_ROOM,
        payload: room.id,
      });
    })
    .catch((e) => console.error("promise Error remove room", e));
};

// COMMENTS //

export const fetchRoomComments = (roomID, setComments) => async () => {
  const data = await db
    .collection("comments")
    .orderBy("created_on", "desc")
    .where("room_ID", "==", roomID)
    .get()
    .catch((e) => console.error("promise Error fetch room comme", e));
  if (data.docs) {
    setComments(data.docs.map((doc) => doc.data()));
  }
};

export const newComment = (values, cb) => async () => {
  const commentDoc = await db.collection("comments").doc();
  const comment = { ...values, created_on: new Date(), id: commentDoc.id };

  commentDoc
    .set(comment)
    .then(() => {
      analytics.logEvent("comment_new");
      cb();
    })
    .catch((e) => console.error("promise Error new comment", e));
};

export const updateComment = (comment, commentID, cb) => async () => {
  const commentDoc = await db.collection("comments").doc(commentID);

  commentDoc.set({ body: comment }, { merge: true }).then(() => {
    analytics.logEvent("comment_update");

    cb();
  });
};

export const deleteComment = (commentID, cb) => async () => {
  const commentDoc = await db.collection("comments").doc(commentID);

  commentDoc.delete().then(() => {
    analytics.logEvent("comment_delete");

    cb();
  });
};

// FLOOR //

export const fetchFloors = (currentUserProfile, cb) => async (dispatch) => {
  const data = await db
    .collection("floors")
    .where("user_ID", "==", currentUserProfile.uid)
    .get();

  const floors = data.docs ? data.docs.map((doc) => doc.data()) : [];

  cb(floors);

  dispatch({
    type: SET_FLOORS,
    payload: floors,
  });
};

let floorListener;

export const fetchFloor = (floor_ID) => async (dispatch) => {
  const docFloor = await db
    .collection("floors")
    .doc(floor_ID)
    .get()
    .catch((e) => console.error("promise Error fetch sing floor", e));

  analytics.logEvent("floor_direct_navigation");

  if (docFloor.data()) {
    dispatch({
      type: ADD_FLOOR,
      payload: docFloor.data(),
    });
  }
};

export const fetchCurrentFloor = (floor_ID) => async (dispatch) => {
  floorListener = db
    .collection("floors")
    .doc(floor_ID)
    .onSnapshot((docFloor) => {
      if (docFloor.data()) {
        dispatch({
          type: SET_CURRENT_FLOOR,
          payload: docFloor.data(),
        });
      }
    });
};

export const fetchFloorRooms = (floor_ID, setFloorRooms) => async (
  dispatch
) => {
  const data = await db
    .collection("floor_rooms")
    .where("floor_ID", "==", floor_ID)
    .get()
    .catch((e) => console.error("promise Error fetch sing floor", e));

  analytics.logEvent("floor_direct_navigation");

  setFloorRooms(data.docs ? data.docs.map((doc) => doc.data()) : []);
};

export const fetchFloorPlans = () => async (dispatch) => {
  const data = await db
    .collection("floor_plans")
    .get()
    .catch((e) => console.error("promise Error fetch floor plans", e));

  dispatch({
    type: SET_FLOOR_PLANS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const newFloor = (values, reset) => async (dispatch) => {
  window.scrollTo(0, 0);

  const batch = db.batch();
  const newDoc = await db.collection("floors").doc();

  const floor = {
    ...values,
    id: newDoc.id,
  };

  batch.set(newDoc, floor);

  batch
    .commit()
    .then((d) => {
      analytics.logEvent("floor_opened", {
        language: values.language,
        tags: values.tags,
      });

      reset();

      dispatch({
        type: ADD_FLOOR,
        payload: floor,
      });
    })
    .catch((e) => console.error("promise Error new floor", e));
};

export const saveFloor = (floor, image, cb) => async () => {
  if (image) {
    const uploadTask = storage
      .ref(`/images/floor_logos/${floor.id}`)
      .put(image);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
      },
      (err) => {
        //catches the errors
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref(`/images/floor_logos`)
          .child(floor.id)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            db.collection("floors")
              .doc(floor.id)
              .set({ ...floor, logo: fireBaseUrl })
              .then(() => {
                cb();
              });
          });
      }
    );
  } else {
    db.collection("floors")
      .doc(floor.id)
      .set(floor)
      .then(() => {
        cb();
      });
  }
};

export const newFloorRoom = (values, reset) => async () => {
  window.scrollTo(0, 0);

  const batch = db.batch();
  const newDoc = await db.collection("floor_rooms").doc();

  const room = {
    ...values,
    id: newDoc.id,
  };

  batch.set(newDoc, room);

  batch
    .commit()
    .then((d) => {
      analytics.logEvent("floor_room_opened");

      reset();

      // dispatch({
      //   type: NEW_ROOM,
      //   payload: room,
      // });
    })
    .catch((e) => console.error("promise Error new floor room", e));
};

export const addFloorPlan = (rooms, image, cb) => async () => {
  const floorPlanDoc = await db.collection("floor_plans").doc();

  const uploadTask = storage
    .ref(`/images/floor_plans/${floorPlanDoc.id}`)
    .put(image);

  uploadTask.on(
    "state_changed",
    (snapShot) => {
      //takes a snap shot of the process as it is happening
    },
    (err) => {
      //catches the errors
    },
    () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage
        .ref(`/images/floor_plans`)
        .child(floorPlanDoc.id)
        .getDownloadURL()
        .then((fireBaseUrl) => {
          const floorPlan = { id: floorPlanDoc.id, rooms, image: fireBaseUrl };
          floorPlanDoc.set(floorPlan).then(() => {
            cb();
          });
        });
    }
  );
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

// FAQ //

export const fetchQuestions = () => async (dispatch) => {
  const data = await db
    .collection("questions")
    .orderBy("placement", "asc")
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_QUESTIONS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const addQuestion = (values, userUID, cb) => () => {
  if (userUID !== "KbhtqAE0B9RDAonhQqgZ1CWsg1o1") return;
  const docRef = db.collection("questions").doc();
  docRef
    .set({ ...values, id: docRef.id })
    .then(() => {
      cb();
    })
    .catch((e) => console.error("promise Error", e));
};

// CAREERS //
export const fetchPositions = () => async (dispatch) => {
  const data = await db
    .collection("positions")
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_POSITIONS,
    payload:
      data && data.docs
        ? data.docs.map((doc) => {
            return doc.data();
          })
        : [],
  });
};

export const fetchSinglePosition = (id) => async (dispatch) => {
  const doc = await db
    .collection("positions")
    .doc(id)
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_SINGLE_POSITION,
    payload: doc.data() ? doc.data() : {},
  });
};

// AUTH //

export const signUp = (
  email,
  password,
  setSubmitting,
  setFormError,
  togglePopup
) => () => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      result.user.sendEmailVerification();
      setSubmitting(2);
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            setSubmitting(3);
            togglePopup(false);

            analytics.logEvent("signup_email");
          })
          .catch((err) => {
            if (err.code === "auth/wrong-password") {
              setSubmitting(0);
              setFormError("Wrong password");
            }
          });
      } else {
        setSubmitting(4);
      }
    });
};

export const logOut = () => async (dispatch) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      analytics.logEvent("logout");
      dispatch({
        type: RESET_NOTIFICATIONS,
      });

      dispatch({
        type: FETCH_UPDATES,
        payload: [],
      });
    })
    .catch((e) => console.error("promise Error", e));
};

export const resendVerification = () => () => {
  firebase.auth().currentUser.sendEmailVerification();
};

export const providerSignIn = (provider, cb) => () => {
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  switch (provider) {
    case "google":
      firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(() => {
          analytics.logEvent("signup_google");
          cb();
        })
        .catch((e) => console.error("promise Error", e));
      break;

    case "facebook":
      firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then(() => {
          analytics.logEvent("signup_facebook");
          cb();
        });
      break;

    default:
      console.error("Provider", "No proper provider was provided");
  }
};

// USER //
let profileListener;
export const listenToProfile = (user, setProfile) => () => {
  profileListener = db
    .collection("users")
    .doc(user.uid)
    .onSnapshot((docProfile) => {
      setProfile(docProfile.data() ? docProfile.data() : null);
    });
};

export const stopListeningToProfile = () => () => {
  if (!profileListener) return;
  profileListener();
};

export const updateProfile = (
  values,
  user,
  profile,
  image,
  updateLocaly
) => () => {
  if (image) {
    const curTS = Date.now();
    const uploadTask = storage
      .ref(`/images/avatars/${user.uid}/${curTS + image.name}`)
      .put(image);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
      },
      (err) => {
        //catches the errors
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref(`/images/avatars/${user.uid}`)
          .child(curTS + image.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            if (profile && profile.avatar_file_name) {
              storage
                .ref()
                .child(`images/avatars/${user.uid}/${profile.avatar_file_name}`)
                .delete();
            }

            db.collection("users")
              .doc(user.uid)
              .set(
                {
                  ...values,
                  avatar: fireBaseUrl,
                  avatar_file_name: curTS + image.name,
                },
                { merge: true }
              )
              .then(() => {
                updateLocaly();
                window.location.hash = "";
                analytics.logEvent("profile_update");
              })
              .catch((e) => console.error("promise Error", e));
          });
      }
    );
  } else {
    db.collection("users")
      .doc(user.uid)
      .set(values, { merge: true })
      .then(() => {
        updateLocaly();
        window.location.hash = "";
        analytics.logEvent("profile_update");
      })
      .catch((e) => console.error("promise Error", e));
  }
};

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
      type: ADD_NOTIFICATION,
    });
  });
};

export const resetNotifications = () => {
  return {
    type: RESET_NOTIFICATIONS,
  };
};

// GLOBAL //

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

export const togglePopup = (value) => {
  return {
    type: TOGGLE_POPUP,
    payload: value,
  };
};

// DANGAROUS ROOMS //

// export const deleteTags = () => async () => {
//   const tags = await db.collection("tags").get();

//   tags.docs.forEach((tag) => {
//     console.log(tag);
//     db.collection("tags").doc(tag.id).delete();
//   });

//   const tagsCount = await db.collection("tags_count").get();

//   tagsCount.docs.forEach((tag) => {
//     console.log(tag);
//     db.collection("tags_count").doc(tag.id).delete();
//   });
// };

// export const addNameToRooms = () => async () => {
//   const data = await db.collection("rooms").get();
//   if (!data.docs) return;

//   data.docs.forEach(async (d) => {
//     const doc = d.data();

//     const user = await db.collection("users").doc(doc.user_ID).get();
//     console.log(user);

//     await db.collection("rooms").doc(d.id).set(
//       {
//         user_avatar: user.data().avatar,
//         user_username: user.data().username,
//         user_name: user.data().name,
//         associate: false,
//       },
//       {
//         merge: true,
//       }
//     );
//   });
// };

// export const addFieldsToRooms = () => async () => {
//   const data = await db.collection("rooms").get();
//   if (!data.docs) return;

//   data.docs.forEach(async (d) => {
//     const doc = d.data();

//     await db.collection("rooms").doc(d.id).set(
//       {
//         listed: true,
//         associate: false,
//       },
//       {
//         merge: true,
//       }
//     );
//   });
// };
