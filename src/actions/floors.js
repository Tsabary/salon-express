import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { v1 as uuidv1 } from "uuid";

import {
  SET_FLOORS,
  ADD_PRIVATE_FLOOR,
  ADD_PUBLIC_FLOOR,
  SET_FLOOR_PLANS,
  SET_CHANNELS,
  RESET_BACKSTAGE_NOTIFICATIONS,
  ADD_BACKSTAGE_NOTIFICATION,
  FETCH_BACKSTAGE,
  EDIT_FLOOR,
  DELETE_FLOOR,
} from "./types";

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

  // if (docFloor.data()) {
  //   dispatch({
  //     type: ADD_FLOOR,
  //     payload: docFloor.data(),
  //   });
  // }
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

export const fetchFloorPlans = (uid) => async (dispatch) => {
  const data = await db
    .collection("floor_plans")
    .where("user_ID", "in", [uid, "KbhtqAE0B9RDAonhQqgZ1CWsg1o1"])
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

      if (!values.private) {
        dispatch({
          type: ADD_PUBLIC_FLOOR,
          payload: floor,
        });
      } else {
        dispatch({
          type: ADD_PRIVATE_FLOOR,
          payload: floor,
        });
      }
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

export const addImageToFloorRoom = (
  room,
  roomIndex,
  floor,
  image,
  reset
) => async () => {
  
  const batch = db.batch();
  const docRef = db.collection("floors").doc(floor.id);

  if (!image) return;

  const ref = storage.ref(`/images/floor-rooms/${floor.id}/${roomIndex}`);

  const upload = await ref.put(image);
  if (!upload) return;

  const downloadUrl = await ref.getDownloadURL();
  if (!downloadUrl) return;

  console.log("imguplp", "uploaded");

  const newFoor = {
    ...floor,
    rooms: {
      ...floor.rooms,
      [roomIndex]: { ...floor.rooms[roomIndex], image: downloadUrl },
    },
  };

  batch.set(docRef, newFoor, { merge: true });

  batch
    .commit()
    .then(() => {
      reset();
      analytics.logEvent("floor_room_image_updated");
    })
    .catch((e) => console.error("promise Error update room image", e));
};

export const newBackstageMessage = (
  message,
  floor,
  currentUserProfile,
  cb
) => () => {
  const msgObj = {
    body: message,
    user_ID: currentUserProfile.uid,
    user_avatar: currentUserProfile.avatar,
    user_name: currentUserProfile.name,
    created_on: Date.now(),
  };

  if (currentUserProfile.username !== currentUserProfile.uid) {
    msgObj.user_username = currentUserProfile.username;
  }

  RTDB.ref("backstage/" + floor.id)
    .push()
    .set(msgObj)
    .then(() => cb())
    .catch((e) => console.error("promise Error log guest", e));
};

export const listenToBackstage = (floor) => async (dispatch) => {
  firebase
    .database()
    .ref("backstage/" + floor.id)
    .limitToLast(10)
    .on("value", (snapshot) => {
      dispatch({
        type: FETCH_BACKSTAGE,
        payload: snapshot.val() ? Object.values(snapshot.val()) : [],
      });

      dispatch({
        type: ADD_BACKSTAGE_NOTIFICATION,
      });
    });
};

export const resetBackstageNotifications = () => {
  return {
    type: RESET_BACKSTAGE_NOTIFICATIONS,
  };
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

export const addFloorPlan = (values, image, cb) => async () => {
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
          const floorPlan = {
            ...values,
            id: floorPlanDoc.id,
            image: fireBaseUrl,
          };
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
    if (cb) cb();
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
          link: channel ? channel.link : "",
          source: channel ? channel.source : "",
          title: channel ? channel.title : "",
        },
      },
    },
  };

  console.log("floorObjecttt", updatedFloor);

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
  console.log("claendarfoor", roomIndex);
  console.log("claendarfoor", floor);
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

export const fixNYC = () => async () => {
  const nycDoc = await db
    .collection("floors")
    .doc("xm8GG5djV4g71CDwEj6D")
    .get();

  if (!nycDoc.data()) return;
  const nyc = nycDoc.data();

  const nycRoomKeys = Object.keys(nyc.rooms);
  const nycRoomValues = Object.values(nyc.rooms);
  const newRooms = {};
  for (let i = 0; i < nycRoomKeys.length; i++) {
    newRooms[27 - i] = nycRoomValues[i];

    // if (i < 17) {
    //   newRooms[i] = nycRoomValues[i];
    // } else {
    //   newRooms[i - 1] = nycRoomValues[i];
    // }
  }

  const newFloorDoc = db.collection("floors").doc();
  const newFloor = { ...nyc, rooms: newRooms, id: newFloorDoc.id };

  newFloorDoc.set(newFloor);
};

// MEMBERS LIST //
export const addToFloorMembers = (currentUserProfile, floor, cb) => async (
  dispatch
) => {
  db.collection("floors")
    .doc(floor.id)
    .set(
      {
        members: firebase.firestore.FieldValue.arrayUnion(
          currentUserProfile.uid
        ),
        members_count: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true }
    )
    .then(() => {
      analytics.logEvent("floor_member_added");
      if (cb) cb();
      dispatch({
        type: EDIT_FLOOR,
        payload: {
          ...floor,
          members: floor.members
            ? [...floor.members, currentUserProfile.uid]
            : [currentUserProfile.uid],
        },
      });

      if (!floor.private) {
        dispatch({
          type: ADD_PUBLIC_FLOOR,
          payload: {
            ...floor,
            members: floor.members
              ? [...floor.members, currentUserProfile.uid]
              : [currentUserProfile.uid],
          },
        });
      } else {
        dispatch({
          type: ADD_PRIVATE_FLOOR,
          payload: {
            ...floor,
            members: floor.members
              ? [...floor.members, currentUserProfile.uid]
              : [currentUserProfile.uid],
          },
        });
      }
    })
    .catch((e) => console.error("promise Error add to fav", e));
};

export const removeFromFloorMembers = (currentUserProfile, floor, cb) => async (
  dispatch
) => {
  db.collection("floors")
    .doc(floor.id)
    .set(
      {
        members: firebase.firestore.FieldValue.arrayRemove(
          currentUserProfile.uid
        ),
        members_count: firebase.firestore.FieldValue.increment(-1),
      },
      { merge: true }
    )
    .then(() => {
      analytics.logEvent("favorites_removed");
      if (cb) cb();

      dispatch({
        type: EDIT_FLOOR,
        payload: {
          ...floor,
          members: floor.members.filter((f) => f.id !== currentUserProfile.id),
        },
      });

      dispatch({
        type: DELETE_FLOOR,
        payload: floor.id,
      });
    })
    .catch((e) => console.error("promise Error remove form fav", e));
};
