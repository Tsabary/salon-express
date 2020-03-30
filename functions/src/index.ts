import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
// const defaultStorage = admin.storage();


exports.userCreated = functions.auth.user().onCreate(user => {
  if (
    user.providerData &&
    ["facebook.com", "google.com"].includes(user.providerData[0].providerId)
  ) {
    const promises: any = [];

    if (user.providerData[0].providerId === "facebook.com") {
      promises.push(
        admin.auth().updateUser(user.uid, {
          emailVerified: true
        })
      );
    }

    promises.push(
      db.doc("users/" + user.uid).set({
        uid: user.uid,
        name: user.providerData[0].displayName
          ? user.providerData[0].displayName.split(" ")[0]
          : "",
        avatar: user.providerData[0].photoURL ? user.providerData[0].photoURL : "",
        email: user.email
      })
    );

    return Promise.all(promises);
  } else {
    return db.doc("users/" + user.uid).set({
      uid: user.uid,
      email: user.email ? user.email : ""
    });
  }
});