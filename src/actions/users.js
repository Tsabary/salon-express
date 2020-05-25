import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { FETCH_UPDATES, RESET_NOTIFICATIONS } from "./types";

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

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

  console.log("loging outtt")

  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("loging outtt work")

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

export const resendVerification = (cb) => () => {
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(() => {
      cb();
    });
};

export const providerSignIn = (provider, cb) => () => {
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  switch (provider) {
    case "google":
      firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(res => {
          console.log("user12", res)
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

export const passwordReset = (email, setSubmitting) => () => {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      setSubmitting(6);
    });
};

// USER //
let profileListener;
export const listenToProfile = (user, setProfile) => () => {
  console.log("user16", "about to listen")

  profileListener = db
    .collection("users")
    .doc(user.uid)
    .onSnapshot((docProfile) => {
      console.log("user14", docProfile)

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
