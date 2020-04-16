import firebase from "../firebase";
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
} from "./types";

const db = firebase.firestore();
const storage = firebase.storage();
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
      : await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get();

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
      : await db
          .collection("rooms")
          .where("listed", "==", true)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get();

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
    .get();

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
    .get();

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
    .get();

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
    .get();

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
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .orderBy("last_visit", "desc")
          .limit(90)
          .get();

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
      : await db
          .collection("rooms")
          .where("tags", "array-contains", tag)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(15)
          .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_searched");

  dispatch({
    type: FETCH_MORE_SEARCHED,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

// ROOM //

export const logGuestEntry = (room) => () => {
  const roomRef = db.collection("rooms").doc(room.id);
  roomRef.set(
    {
      last_visit: new Date(),
      visitors_count: firebase.firestore.FieldValue.increment(1),
    },
    { merge: true }
  );
  analytics.logEvent("room_entered");
};

// FAVORITES LIST //

export const addToFavorites = (currentUserProfile, room) => async (
  dispatch
) => {
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

      dispatch({
        type: ADD_TO_FAVORITES,
        payload: {
          ...room,
          favorites: room.favorites
            ? [...room.favorites, currentUserProfile.uid]
            : [currentUserProfile.uid],
        },
      });
    });
};

export const removeFromFavorites = (currentUserProfile, room) => async (
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

      dispatch({
        type: REMOVE_FROM_FAVORITES,
        payload: {
          ...room,
          favorites: room.favorites.filter(
            (r) => r.id !== currentUserProfile.id
          ),
        },
      });
    });
};

// STRANGER //

export const fetchStrangerProfile = (strangerUsername) => async (dispatch) => {
  const data = await db
    .collection("users")
    .where("username", "==", strangerUsername)
    .get();

  const profile = data.docs.map((doc) => doc.data())[0];

  analytics.logEvent("stranger_profile_visitor");

  dispatch({
    type: FETCH_STRANGER_PROFILE,
    payload: profile ? profile : null,
  });
};

// SINGLE ROOM //

export const fetchSingleRoom = (roomID, setRoom) => async (dispatch) => {
  const doc = await db.collection("rooms").doc(roomID).get();

  analytics.logEvent("room_direct_navigation");
  if (doc.data()) {
    setRoom(doc.data())
    // dispatch({
    //   type: NEW_ROOM,
    //   payload: doc.data(),
    // });
  }
};

export const fetchRoomComments = (roomID, setComments) => async () => {
  const data = await db
    .collection("comments")
    .orderBy("created_on", "desc")
    .where("room_ID", "==", roomID)
    .get();

  if (data.docs) {
    setComments(data.docs.map((doc) => doc.data()));
  }
};

export const associateWithRoom = (room, associate) => async (dispatch) => {

  const newRoom = { ...room, associate };
  console.log("associate with room", newRoom);
  db.collection("rooms")
    .doc(room.id)
    .set({ associate }, { merge: true })
    .then(() => {
      dispatch({
        type: EDIT_ROOM,
        payload: newRoom,
      });
    });
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
    });
};

export const newRoom = (values, reset) => (dispatch) => {
  window.scrollTo(0, 0);

  const batch = db.batch();
  const newDoc = db.collection("rooms").doc();

  const room = {
    ...values,
    last_visit: new Date(),
    id: newDoc.id,
  };

  batch.set(newDoc, room);

  batch.commit().then((d) => {
    analytics.logEvent("room_opened", {
      language: values.language,
      tags: values.tags,
    });

    reset();

    dispatch({
      type: NEW_ROOM,
      payload: room,
    });
  });
};

export const updateRoom = (values, tagsToAdd, tagsToRemove, reset) => (
  dispatch
) => {
  const batch = db.batch();
  const docRef = db.collection("rooms").doc(values.id);

  batch.set(docRef, values);

  batch.commit().then(() => {
    reset();
    window.location.hash = "";
    analytics.logEvent("room_updated");

    dispatch({
      type: EDIT_ROOM,
      payload: values,
    });
  });
};

export const removeRoom = (room) => (dispatch) => {
  const batch = db.batch();

  const doc = db.collection("rooms").doc(room.id);
  batch.delete(doc);

  batch.commit().then(() => {
    analytics.logEvent("room_deleted");

    dispatch({
      type: DELETE_ROOM,
      payload: room.id,
    });
  });
};

export const newComment = (values, cb) => async () => {
  console.log(values);
  const commentDoc = await db.collection("comments").doc();
  const comment = { ...values, created_on: new Date(), id: commentDoc.id };

  commentDoc.set(comment).then(() => {
    cb();
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

  batch.commit().then(() => {
    setCurrentUserProfile({
      ...userProfile,
      following: [...userProfile.following, hostID],
    });

    analytics.logEvent("follow");

    cb();
  });
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

  batch.commit().then(() => {
    setCurrentUserProfile({
      ...userProfile,
      following: userProfile.following.filter((id) => id !== hostID),
    });

    analytics.logEvent("unfollow");

    cb();
  });
};

// FAQ //

export const fetchQuestions = () => async (dispatch) => {
  const data = await db
    .collection("questions")
    .orderBy("placement", "asc")
    .get();

  dispatch({
    type: FETCH_QUESTIONS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const addQuestion = (values, userUID, cb) => () => {
  if (userUID !== "PPryp7ws2lekKx1mePChgH0Sh3t1") return;
  const docRef = db.collection("questions").doc();
  docRef.set({ ...values, id: docRef.id }).then(() => {
    cb();
  });
};

// CAREERS //
export const fetchPositions = () => async (dispatch) => {
  const data = await db.collection("positions").get();

  dispatch({
    type: FETCH_POSITIONS,
    payload: !!data.docs
      ? data.docs.map((doc) => {
          return doc.data();
        })
      : [],
  });
};

export const fetchSinglePosition = (id) => async (dispatch) => {
  const data = await db.collection("positions").doc(id).get();

  dispatch({
    type: FETCH_SINGLE_POSITION,
    payload: data.data() ? data.data() : {},
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
            console.log("login error:", err);

            if (err.code === "auth/wrong-password") {
              setSubmitting(0);
              setFormError("Wrong password");
            }
          });
      } else {
        console.log("signup error:", err);
        setSubmitting(4);
      }
    });
};

export const logOut = () => () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      analytics.logEvent("logout");
    });
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
          console.log("google signin in success");
        });

      break;
    case "facebook":
      firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then(() => {
          analytics.logEvent("signup_facebook");
          cb();
          console.log("facebook signin in success");
        });

      break;
  }
};

// USER //

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
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
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
              });
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
      });
  }
};

// GLOBAL //

export const setEditedRoom = (room) => {
  return {
    type: SET_EDITED_ROOM,
    payload: room,
  };
};

export const fetchTags = () => async (dispatch) => {
  const data = await db.collection("tags_count").get();

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
