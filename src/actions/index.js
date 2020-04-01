import firebase from "../firebase";
import {
  // STREAMS //
  FETCH_NEW_STREAMS,
  FETCH_MORE_STREAMS,
  NEW_STREAM,
  DELETE_STREAM,
  EDIT_STREAM,

  // SEARCHED STREAMS //
  FETCH_NEW_SEARCHED_STREAMS,
  FETCH_MORE_SEARCHED_STREAMS,

  // MY STREAMS UPCOMING //
  FETCH_NEW_MY_STREAMS_UPCOMING,
  FETCH_MORE_MY_STREAMS_UPCOMING,

  // MY STREAMS PAST //
  FETCH_NEW_MY_STREAMS_PAST,
  FETCH_MORE_MY_STREAMS_PAST,

  // CALENDAR BOTH
  REMOVE_FROM_CALENDAR,

  // CALENDAR UPCOMING //
  FETCH_NEW_CALENDAR_UPCOMING,
  FETCH_MORE_CALENDAR_UPCOMING,
  ADD_TO_CALENDAR_UPCOMING,

  // CALENDAR PAST //
  FETCH_NEW_CALENDAR_PAST,
  FETCH_MORE_CALENDAR_PAST,

  // GLOBAL //
  SET_PAGE,
  TOGGLE_POPUP,
  FETCH_TAGS,
  SET_EDITED_STREAM,
  FETCH_NEW_SUBSCRIPTIONS,
  FETCH_MORE_SUBSCRIPTIONS,
  FETCH_TEMPLATES,
  DELETE_TEMPLATE
} from "./types";

const db = firebase.firestore();
const storage = firebase.storage();

// EXPOLRE STREAMS //

export const fetchFirstStreams = (
  setLastVisible,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("start", ">", timestampNow)
    .orderBy("start")
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreStreams = (
  lastVisible,
  setLastVisible,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("start", ">", timestampNow)
    .orderBy("start")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// SEARCHED STREAMS //

export const fetchFirstSearchedStreams = (
  setLastVisible,
  tag,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("tags", "array-contains", tag)
    .where("start", ">", timestampNow)
    .orderBy("start")
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_SEARCHED_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreSearchedStreams = (
  lastVisible,
  setLastVisible,
  tag,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("tags", "array-contains", tag)
    .where("start", ">", timestampNow)
    .orderBy("start")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_SEARCHED_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// SUBSCRIPTIONS STREAMS //

export const fetchFirstSubscriptionStreams = (
  setLastVisible,
  userUID,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("followers", "array-contains", userUID)
    .where("start", ">", timestampNow)
    .orderBy("start")
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_SUBSCRIPTIONS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreSubscriptionStreams = (
  lastVisible,
  setLastVisible,
  userUID,
  setReachedLast,
  timestampNow
) => async dispatch => {
  const data = db
    .collection("streams")
    .where("followers", "array-contains", userUID)
    .where("start", ">", timestampNow)
    .orderBy("start")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_SUBSCRIPTIONS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// CALENDAR UPCOMING //

export const fetchFirstCalendarUpcoming = (
  userID,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .where("start", ">", Date.now())
    .orderBy("start", "asc")
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_CALENDAR_UPCOMING,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreCalendarUpcoming = (
  userID,
  lastVisible,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .where("start", ">", Date.now())
    .orderBy("start", "asc")
    .startAfter(lastVisible)
    .limit(2)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_CALENDAR_UPCOMING,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// CALENDAR PAST //

export const fetchFirstCalendarPast = (
  userID,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .where("start", "<", Date.now())
    .orderBy("start", "desc")
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_CALENDAR_PAST,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreCalendarPast = (
  userID,
  lastVisible,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .where("start", "<", Date.now())
    .orderBy("start", "desc")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_CALENDAR_PAST,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// MY STREAMS UPCOMING //

export const fetchFirstMyStreamsUpcoming = (
  userID,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("user_ID", "==", userID)
    .where("start", ">", Date.now())
    .orderBy("start", "asc")
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_MY_STREAMS_UPCOMING,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreMyStreamsUpcoming = (
  userID,
  lastVisible,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("user_ID", "==", userID)
    .where("start", ">", Date.now())
    .orderBy("start", "asc")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_MY_STREAMS_UPCOMING,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// MY STREAMS PAST //

export const fetchFirstMyStreamsPast = (
  userID,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("user_ID", "==", userID)
    .where("start", "<", Date.now())
    .orderBy("start", "desc")
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 15) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_MY_STREAMS_PAST,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreMyStreamsPast = (
  userID,
  lastVisible,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("user_ID", "==", userID)
    .where("start", "<", Date.now())
    .orderBy("start", "desc")
    .startAfter(lastVisible)
    .limit(15)
    .get();

  if (data.docs[data.docs.length - 1])
    setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 15) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_MY_STREAMS_PAST,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchSingleStream = (streamID, setStream) => async dispatch => {
  const doc = await db
    .collection("streams")
    .doc(streamID)
    .get();

  setStream(doc.data());
};

// STREAMS //

const makeTemplate = (stream, batch) => {
  const templateDoc = db.collection("templates").doc();
  const templateStream = { ...stream, id: templateDoc.id };
  delete templateStream.url;
  delete templateStream.start;
  delete templateStream.end;

  batch.set(templateDoc, templateStream);
};

export const deleteTemplate = template => async dispatch => {
  db.collection("templates")
    .doc(template.id)
    .delete()
    .then(() => {
      dispatch({
        type: DELETE_TEMPLATE,
        payload: template.id
      });
    });
};

const dispatchNew = (reset, dispatch, stream) => {
  reset();

  dispatch({
    type: NEW_STREAM,
    payload: stream
  });

  dispatch({
    type: ADD_TO_CALENDAR_UPCOMING,
    payload: stream
  });
};

export const newStream = (values, image, isTemplate, reset) => dispatch => {
  const batch = db.batch();
  const newDoc = db.collection("streams").doc();

  if (image) {
    const imageName = Date.now() + image.name;

    const uploadTask = storage
      .ref(`/images/streams/${newDoc.id}/${imageName}`)
      .put(image);

    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      snapShot => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      err => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref(`images/streams/${newDoc.id}`)
          .child(imageName)
          .getDownloadURL()
          .then(fireBaseUrl => {
            const stream = {
              ...values,
              image: fireBaseUrl,
              image_file_name: imageName,
              id: newDoc.id
            };

            batch.set(newDoc, stream);

            addTags(values.tags, newDoc.id, batch);

            if (isTemplate) {
              makeTemplate(stream, batch);
            }

            batch.commit().then(d => {
              dispatchNew(reset, dispatch, stream);
            });
          });
      }
    );
  } else {
    const stream = {
      ...values,
      id: newDoc.id
    };

    batch.set(newDoc, stream);

    addTags(values.tags, newDoc.id, batch);

    if (isTemplate) {
      makeTemplate(stream, batch);
    }

    batch.commit().then(d => {
      dispatchNew(reset, dispatch, stream);
    });
  }
};

export const updateStream = (
  values,
  tagsToAdd,
  tagsToRemove,
  image,
  reset
) => dispatch => {
  const batch = db.batch();
  const docRef = db.collection("streams").doc(values.id);
  if (image) {
    const imageName = Date.now() + image.name;

    const uploadTask = storage
      .ref(`/images/streams/${values.id}/${imageName}`)
      .put(image);

    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      snapShot => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      err => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref(`images/streams/${values.id}`)
          .child(imageName)
          .getDownloadURL()
          .then(fireBaseUrl => {
            if (!values.from_template) {
              storage
                .ref()
                .child(`images/streams/${values.id}/${values.image_file_name}`)
                .delete();
            }

            const stream = {
              ...values,
              image: fireBaseUrl,
              image_file_name: imageName
            };

            batch.set(docRef, stream);

            addTags(tagsToAdd, values.id, batch);
            removeTags(tagsToRemove, values.id, batch);

            batch.commit().then(() => {
              reset();
              window.location.hash = "";

              dispatch({
                type: EDIT_STREAM,
                payload: stream
              });
            });
          });
      }
    );
  } else {
    batch.set(docRef, values);

    addTags(tagsToAdd, values.id, batch);
    removeTags(tagsToRemove, values.id);

    batch.commit().then(() => {
      reset();
      window.location.hash = "";

      dispatch({
        type: EDIT_STREAM,
        payload: values
      });
    });
  }
};

export const removeStream = stream => dispatch => {
  const batch = db.batch();

  const doc = db.collection("streams").doc(stream.id);
  batch.delete(doc);

  removeTags(stream.tags, stream.id, batch);

  batch.commit().then(() => {
    if (!stream.from_template) {
      storage
        .ref()
        .child(`images/streams/${stream.id}/${stream.image_file_name}`)
        .delete();
    }

    dispatch({
      type: DELETE_STREAM,
      payload: stream.id
    });

    dispatch({
      type: REMOVE_FROM_CALENDAR,
      payload: stream.id
    });
  });
};

// STREAM ACTIONS //

export const attand = (stream, userUID) => async dispatch => {
  await db
    .collection("streams")
    .doc(stream.id)
    .set(
      { attendants: firebase.firestore.FieldValue.arrayUnion(userUID) },
      { merge: true }
    );

  dispatch({
    type: EDIT_STREAM,
    payload: { ...stream, attendants: [...stream.attendants, userUID] }
  });

  dispatch({
    type: ADD_TO_CALENDAR_UPCOMING,
    payload: { ...stream, attendants: [...stream.attendants, userUID] }
  });
};

export const unattand = (stream, userUID) => async dispatch => {
  await db
    .collection("streams")
    .doc(stream.id)
    .set(
      { attendants: firebase.firestore.FieldValue.arrayRemove(userUID) },
      { merge: true }
    );

  dispatch({
    type: EDIT_STREAM,
    payload: {
      ...stream,
      attendants: stream.attendants.filter(id => id !== userUID)
    }
  });

  dispatch({
    type: EDIT_STREAM,
    payload: {
      ...stream,
      attendants: stream.attendants.filter(id => id !== userUID)
    }
  });

  dispatch({
    type: REMOVE_FROM_CALENDAR,
    payload: stream.id
  });
};

export const follow = (
  user,
  hostID,
  setCurrentUserProfile,
  cb
) => async dispatch => {
  const batch = db.batch();

  const hostRef = db.collection("users").doc(hostID);
  batch.set(
    hostRef,
    { followers: firebase.firestore.FieldValue.arrayUnion(user.uid) },
    { merge: true }
  );

  const userRef = db.collection("users").doc(user.uid);
  batch.set(
    userRef,
    { following: firebase.firestore.FieldValue.arrayUnion(hostID) },
    { merge: true }
  );

  // Add current user to all the future events of this host
  const futureHostEvents = await db
    .collection("streams")
    .where("user_ID", "==", hostID)
    .where("start", ">", Date.now())
    .get();

  futureHostEvents.docs.forEach(doc => {
    let eventRef = db.collection("streams").doc(doc.id);
    batch.set(
      eventRef,
      {
        followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
      },
      { merge: true }
    );
  });

  batch.commit().then(() => {
    setCurrentUserProfile({ ...user, following: [...user.following, hostID] });
    cb();
  });
};

export const unfollow = (
  user,
  hostID,
  setCurrentUserProfile,
  cb
) => async dispatch => {
  const batch = db.batch();

  const hostRef = db.collection("users").doc(hostID);
  batch.set(
    hostRef,
    { followers: firebase.firestore.FieldValue.arrayRemove(user.uid) },
    { merge: true }
  );

  const userRef = db.collection("users").doc(user.uid);
  batch.set(
    userRef,
    { following: firebase.firestore.FieldValue.arrayRemove(hostID) },
    { merge: true }
  );

  // Remove current user to all the future events of this host
  const futureHostEvents = await db
    .collection("streams")
    .where("user_ID", "==", hostID)
    .where("start", ">", Date.now())
    .get();

  futureHostEvents.docs.forEach(doc => {
    let eventRef = db.collection("streams").doc(doc.id);
    batch.set(
      eventRef,
      {
        followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
      },
      { merge: true }
    );
  });

  batch.commit().then(() => {
    setCurrentUserProfile({
      ...user,
      following: user.following.filter(id => id !== hostID)
    });
    cb();
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
    .then(result => {
      result.user.sendEmailVerification();
      setSubmitting(2);
    })
    .catch(err => {
      if (err.code === "auth/email-already-in-use") {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            setSubmitting(3);
            togglePopup();
          })
          .catch(err => {
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
  firebase.auth().signOut();
};

export const resendVerification = () => () => {
  firebase.auth().currentUser.sendEmailVerification();
};

export const providerSignIn = provider => () => {
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  switch (provider) {
    case "google":
      firebase.auth().signInWithPopup(googleProvider);
      break;
    case "facebook":
      firebase.auth().signInWithPopup(facebookProvider);
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
      snapShot => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      err => {
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
          .then(fireBaseUrl => {
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
                  avatar_file_name: curTS + image.name
                },
                { merge: true }
              )
              .then(() => {
                updateLocaly();
                window.location.hash = "";
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
      });
  }
};

// GLOBAL //

export const setCurrentPage = value => {
  return {
    type: SET_PAGE,
    payload: value
  };
};

export const setEditedStream = stream => {
  return {
    type: SET_EDITED_STREAM,
    payload: stream
  };
};

export const fetchTags = () => async dispatch => {
  const data = await db.collection("tags_count").get();

  const allTags = [];

  data.docs.map(doc => {
    for (let [key, value] of Object.entries(doc.data())) {
      allTags.push({ [key]: value });
    }
  });

  dispatch({
    type: FETCH_TAGS,
    payload: allTags
  });
};

export const fetchTemplates = userID => async dispatch => {
  const data = await db
    .collection("templates")
    .where("user_ID", "==", userID)
    .get();

  dispatch({
    type: FETCH_TEMPLATES,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const togglePopup = () => {
  return {
    type: TOGGLE_POPUP
  };
};

const removeTags = (tags, docID, batch) => {
  tags.forEach(tag => {
    const tagRef = db.collection("tags").doc(tag);
    batch.set(
      tagRef,
      {
        streams: firebase.firestore.FieldValue.arrayRemove(docID)
      },
      { merge: true }
    );

    const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
    batch.set(
      tagsCountRef,
      {
        [tag]: firebase.firestore.FieldValue.increment(-1) || 0
      },
      { merge: true }
    );
  });
};

const addTags = (tags, docID, batch) => {
  tags.forEach(tag => {
    const tagRef = db.collection("tags").doc(tag);
    batch.set(
      tagRef,
      {
        streams: firebase.firestore.FieldValue.arrayUnion(docID)
      },
      { merge: true }
    );

    const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
    batch.set(
      tagsCountRef,
      {
        [tag]: firebase.firestore.FieldValue.increment(1) || 1
      },
      { merge: true }
    );
  });
};

// DANGAROUS STREAMS //

export const deleteTags = () => async () => {
  const tags = await db.collection("tags").get();

  tags.docs.forEach(tag => {
    console.log(tag);
    db.collection("tags")
      .doc(tag.id)
      .delete();
  });

  const tagsCount = await db.collection("tags_count").get();

  tagsCount.docs.forEach(tag => {
    console.log(tag);
    db.collection("tags_count")
      .doc(tag.id)
      .delete();
  });
};
