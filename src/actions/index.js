import firebase from "../firebase";
import {
  // STREAMS //
  FETCH_NEW_STREAMS,
  FETCH_MORE_STREAMS,
  NEW_STREAM,
  DELETE_STREAM,
  EDIT_STREAM,

  // MY STREAMS //
  FETCH_MY_STREAMS,
  ADD_MY_STREAMS,
  EDIT_MY_STREAMS,
  DELETE_MY_STREAMS,

  // CALENDAR //
  FETCH_NEW_CALENDAR,
  FETCH_MORE_CALENDAR,
  ADD_TO_CALENDAR,
  REMOVE_FROM_CALENDAR,
  EDIT_CALENDAR,

  // GLOBAL //
  SET_PAGE,
  TOGGLE_POPUP,
  FETCH_TAGS,
  SET_EDITED_STREAM
} from "./types";

const db = firebase.firestore();
const storage = firebase.storage();

// FETCHING ACTIONS //

export const fetchFirstStreams = (
  setLastVisible,
  tag,
  setReachedLast
) => async dispatch => {
  const data = tag
    ? await db
        .collection("streams")
        .where("tags", "array-contains", tag)
        .orderBy("start_timestamp")
        .limit(25)
        .get()
    : await db
        .collection("streams")
        .orderBy("start_timestamp")
        .limit(25)
        .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 25) setReachedLast(true);

  dispatch({
    type: FETCH_NEW_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreStreams = (
  lastVisible,
  setLastVisible,
  tag,
  setReachedLast
) => async dispatch => {
  const data = tag
    ? await db
        .collection("streams")
        .where("tags", "array-contains", tag)
        .orderBy("start_timestamp")
        .startAfter(lastVisible)
        .limit(25)
        .get()
    : await db
        .collection("streams")
        .orderBy("start_timestamp")
        .startAfter(lastVisible)
        .limit(25)
        .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (!data.docs.length) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchFirstCalendar = (
  userID,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .orderBy("start_timestamp")
    .limit(25)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 25) setReachedLast(true);

  dispatch({
    type: FETCH_NEW_CALENDAR,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMoreCalendar = (
  userID,
  lastVisible,
  setLastVisible,
  setReachedLast
) => async dispatch => {
  const data = await db
    .collection("streams")
    .where("attendants", "array-contains", userID)
    .orderBy("start_timestamp")
    .startAfter(lastVisible)
    .limit(25)
    .get();

  setLastVisible(data.docs[data.docs.length - 1]);
  if (!data.docs.length) setReachedLast(true);

  dispatch({
    type: FETCH_MORE_CALENDAR,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

export const fetchMyStreams = userID => async dispatch => {
  const data = await db
    .collection("streams")
    .where("user_ID", "==", userID)
    .orderBy("start_timestamp")
    .get();

  dispatch({
    type: FETCH_MY_STREAMS,
    payload: !!data.docs ? data.docs.map(doc => doc.data()) : []
  });
};

// STREAMS //

export const newStream = (values, image, reset) => dispatch => {
  const imageName = Date.now() + image.name;

  const batch = db.batch();

  const newDoc = db.collection("streams").doc();

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

          batch.commit().then(() => {
            reset();
            window.location.hash = "";

            dispatch({
              type: NEW_STREAM,
              payload: stream
            });

            dispatch({
              type: ADD_MY_STREAMS,
              payload: stream
            });

            dispatch({
              type: ADD_TO_CALENDAR,
              payload: stream
            });
          });
        });
    }
  );
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
            console.log(values.image_file_name);
            storage
              .ref()
              .child(`images/streams/${values.id}/${values.image_file_name}`)
              .delete();

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

              dispatch({
                type: EDIT_MY_STREAMS,
                payload: stream
              });

              dispatch({
                type: EDIT_CALENDAR,
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
        type: NEW_STREAM,
        payload: values
      });
    });
  }
};

export const removeStream = stream => dispatch => {
  db.collection("streams")
    .doc(stream.id)
    .delete();

  dispatch({
    type: DELETE_STREAM,
    payload: stream.id
  });

  dispatch({
    type: DELETE_MY_STREAMS,
    payload: stream.id
  });

  dispatch({
    type: REMOVE_FROM_CALENDAR,
    payload: stream.id
  });
};

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
    type: EDIT_MY_STREAMS,
    payload: { ...stream, attendants: [...stream.attendants, userUID] }
  });

  dispatch({
    type: ADD_TO_CALENDAR,
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
    type: EDIT_MY_STREAMS,
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

// AUTH //

export const signUp = (email, password, setSubmitting, setFormError) => () => {
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
