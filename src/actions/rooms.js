import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { v1 as uuidv1 } from "uuid";

import {
  // ROOMS //
  NEW_ROOM,
  DELETE_ROOM,
  EDIT_ROOM,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  ADD_CHANNEL,
  SET_CHANNELS,
  REMOVE_CHANNEL,
  FETCH_EVENTS,
  REMOVE_EVENT,
  ADD_EVENT,
} from "./types";

const db = firebase.firestore();
const analytics = firebase.analytics();
const RTDB = firebase.database();
const storage = firebase.storage();

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

  console.log("audio channel action 1", room_ID);

  channelListener = db
    .collection("active_channels")
    .doc(room_ID)
    .onSnapshot((docChannel) => {
      console.log("audio channel action 2", docChannel.data());

      setCurrentAudioChannel(docChannel.data() ? docChannel.data() : null);
      setGlobalCurrentAudioChannel(
        docChannel.data() ? docChannel.data() : null
      );
    });
};

// Deteching the listener for the multiverse
export const detachChannelListener = () => () => {
  if (channelListener) channelListener();
};

export const saveArrayOrder = (collection, key, array, parent, reset) => () => {
  db.collection(collection)
    .doc(parent.id)
    .set({ [key]: array }, { merge: true })
    .then(() => {
      reset();
    });
};

// LOG //
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

  console.log("roommmm", room);

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
              room_name: room.name,
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
            room_name: room.name,
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

// Setting the active audio channel
export const setActiveChannel = (channel, roomID, cb) => () => {
  channel
    ? db
        .collection("active_channels")
        .doc(roomID)
        .set(channel)
        .then(() => {
          if (cb) cb();
        })
    : db
        .collection("active_channels")
        .doc(roomID)
        .delete()
        .then(() => {
          if (cb) cb();
        });

  // .set({
  //   link: channel ? channel.link : null,
  //   source: channel ? channel.source : null,
  // })
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

export const addAdmin = (room, admin, cb) => () => {
  const newRoom = {
    admins: [...room.admins, admin],
    admins_ID: [...room.admins_ID, admin.uid],
  };
  db.collection("rooms")
    .doc(room.id)
    .set(newRoom, { merge: true })
    .then(() => {
      cb(newRoom);
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

export const updateRoom = (updatedRoom, parameter, reset) => async (
  dispatch
) => {
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

export const addImageToRoom = (room, image, reset) => async () => {
  const batch = db.batch();
  const docRef = db.collection("rooms").doc(room.id);

  if (!image) return;

  const ref = storage.ref(`/images/rooms/${room.id}/`);

  const upload = await ref.put(image);
  if (!upload) return;

  const downloadUrl = await ref.getDownloadURL();
  if (!downloadUrl) return;

  batch.set(docRef, { image: downloadUrl }, { merge: true });

  batch
    .commit()
    .then(() => {
      reset({ ...room, image: downloadUrl });
      analytics.logEvent("room_image_updated");
    })
    .catch((e) => console.error("promise Error update room image", e));
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
let commentsListener;

export const fetchRoomComments = (roomID, cb) => async () => {
  commentsListener = db
    .collection("comments")
    .where("room_ID", "==", roomID)
    .orderBy("created_on", "desc")
    .onSnapshot((querySnapshot) => {
      console.log("querySnapshot", querySnapshot);
      if (!querySnapshot) return;
      var comments = querySnapshot.docs.map((doc) => doc.data());
      cb(comments);
    });
};

export const detachCommentsListener = () => ()=> {
 if(commentsListener) commentsListener();
};

export const newComment = (values, cb) => async () => {
  const commentDoc = await db.collection("comments").doc();
  const comment = { ...values, created_on: new Date(), id: commentDoc.id };

  commentDoc
    .set(comment)
    .then(() => {
      analytics.logEvent("comment_new");
      cb(commentDoc.id);
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

export const deleteEvent = (event) => async (dispatch) => {
  console.log("event", event);
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

export const navigateToFirstRoom = (uid, cb) => async () => {
  console.log("aaaa");
  const data = await db.collection("rooms").where("user_ID", "==", uid).get();

  if (!data || (data && !data.docs)) return;

  const docs = data.docs.map((doc) => doc.data());

  cb(docs[0]);
};

// export const uidToAdmin = () => async () => {
//   const query = await db
//     .collection("rooms")
//     .get();

//   if (!query.docs) return;

//   const rooms = query.docs.map((doc) => doc.data());

//   rooms.forEach(async (doc) => {
//     const adminID = doc.user_ID;

//     const adminDoc = await db.collection("users").doc(adminID).get();

//     if (!adminDoc.data()) return;

//     await db
//       .collection("rooms")
//       .doc(doc.id)
//       .set(
//         {
//           admins: [
//             {
//               avatar: adminDoc.data().avatar,
//               email: adminDoc.data().email,
//               name: adminDoc.data().name,
//               uid: adminDoc.data().uid,
//               username: adminDoc.data().username,
//             },
//           ],
//           admins_ID: [adminID],
//         },
//         { merge: true }
//       );
//   });
// };
