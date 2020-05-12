import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { v1 as uuidv1 } from "uuid";

import { SET_FLOORS, ADD_FLOOR, SET_FLOOR_PLANS, SET_CHANNELS } from "./types";

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();
const RTDB = firebase.database();

export const fetchMyFloors = (currentUserProfile, cb) => async (dispatch) => {
  const data = await db
    .collection("floors")
    .where("admins_ID", "array-contains", currentUserProfile.uid)
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

export const fetchCurrentFloor = (floor_ID, cb) => async (dispatch) => {
  const query = await db
    .collection("floors")
    .where("url", "==", floor_ID)
    .get();

  if (query.docs.length) {
    floorListener = db
      .collection("floors")
      .doc(query.docs[0].data().id)
      .onSnapshot((docFloor) => {
        if (docFloor.data()) {
          console.log("flooor", "gettingg");
          cb(docFloor.data());
        }
      });
  }
};

// Deteching the listener for the floor
export const detachFloorListener = () => async (dispatch) => {
  if (floorListener) {
    floorListener();
    console.log("flooor", "deteching");
  }
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
    last_visit: new Date(),
    url: newDoc.id,
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

export const saveFloor = (floor, logoFile, tracks, cb, ecb) => async () => {
  const newFloor = { ...floor };

  if (logoFile) {
    const ref = storage.ref(`/images/floor_logos/${floor.id}`);

    const upload = await ref.put(logoFile);
    if (!upload) return;

    const downloadUrl = await ref.getDownloadURL();
    if (!downloadUrl) return;

    newFloor.logo = downloadUrl;
  }

  if (tracks) {
    for (const trackKey of Object.keys(tracks)) {
      const track = tracks[trackKey];

      const ref = storage.ref(
        `/audio/floor_tracks/${floor.id}/${trackKey}/${track.name}`
      );

      const upload = await ref.put(track);
      if (!upload) return;

      const downloadUrl = await ref.getDownloadURL();
      if (!downloadUrl) return;

      newFloor.rooms[trackKey].track = { name: track.name, file: downloadUrl };
    }
  }
  db.collection("floors")
    .doc(floor.id)
    .set(newFloor)
    .then(() => {
      cb();
    })
    .catch((e) => {
      ecb(e);
    });
};

export const newBackstageMessage = (room, currentUserProfile) => () => {
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

export const checkUrlAvailability = (url, errorCB, approvedCB) => async () => {
  const urlData = await db.collection("floors").where("url", "==", url).get();

  const idData = await db.collection("floors").where("id", "==", url).get();

  if (
    urlData.docs &&
    !urlData.docs.length &&
    idData.docs &&
    !idData.docs.length
  ) {
    approvedCB();
  } else {
    console.log("urlData", urlData);
    console.log("idData", idData);
    errorCB();
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

//Replacing between UUID and UID in the portal logs
export const replaceFloorUids = (floor, previousID, newID, cb) => () => {
  const batch = db.batch();
  const floorDoc = db.collection("visitors").doc(floor.id);

  batch.set(
    floorDoc,
    {
      visitors: firebase.firestore.FieldValue.arrayUnion(newID),
    },

    { merge: true }
  );

  if (previousID) {
    batch.set(
      floorDoc,
      {
        visitors: firebase.firestore.FieldValue.arrayRemove(previousID),
      },

      { merge: true }
    );
  }

  batch.commit().then(() => {
    cb();
  });
};

// resetting the audio settings so they won't interfere
export const resetPublicAudioSettings = () => {
  return {
    type: SET_CHANNELS,
    payload: [],
  };
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
          title: channel ? channel.title : null,
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

// AUDIO CHANNELS //

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

export const saveFloorRoomArrayOrder = (
  floor,
  floorRoom,
  floorRoomIndex,
  array,
  reset
) => () => {
  const newFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [floorRoomIndex]: { ...floorRoom, audio_channels: array },
    },
  };

  db.collection("floors")
    .doc(floor.id)
    .set(newFloor)
    .then(() => {
      console.log("savee", "success");
      reset();
    });
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

export const deleteEventFloor = (event, roomIndex, floor, cb) => async () => {
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);
  const updatedFloor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: {
        ...floor.rooms[roomIndex],
        events: floor.rooms[roomIndex].events.filter(
          (ev) => ev.id !== event.id
        ),
      },
    },
  };

  batch.set(docRef, updatedFloor, { merge: true });

  batch
    .commit()
    .then(() => {
      cb();
      analytics.logEvent("floor_room_event_deleted");
    })
    .catch((e) => console.error("promise Error update room", e));
};
