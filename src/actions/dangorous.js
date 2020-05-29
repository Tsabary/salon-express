import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

const db = firebase.firestore();

export const createUpdateInUsers = () => async (dispatch) => {
  console.log("updatinggg");
  const batch = db.batch();

  const data = await db
    .collection("users")
    // .where("uid", "==", "KbhtqAE0B9RDAonhQqgZ1CWsg1o1")
    .get();

  if (data.docs) {
    data.docs.forEach((doc) => {
      console.log("updatinggg id", doc.id);

      const docRef = db.collection("users").doc(doc.id);
      const docObj = { ...doc.data(), update: true };
      batch.set(docRef, docObj);
    });
  }

  batch.commit().catch((e) => {
    console.log("updatinggg error", e);
  });
};

export const removeUpdateInUsers = () => async (dispatch) => {
  const batch = db.batch();

  const data = await db
    .collection("users")
    // .where("uid", "==", "KbhtqAE0B9RDAonhQqgZ1CWsg1o1")
    .get();

  if (data.docs) {
    data.docs.forEach((doc) => {
      const docRef = db.collection("users").doc(doc.id);
      const docObj = { ...doc.data(), update: true };
      delete docObj.update;
      batch.set(docRef, docObj);
    });
  }

  batch.commit();
};

export const createUpdateInRooms = () => async (dispatch) => {
  const batch = db.batch();

  const data = await db
    .collection("rooms")
    // .where("id", "==", "9QNkyIJOh2ubjn6vKoe1")
    .get();

  if (data.docs) {
    data.docs.forEach((doc) => {
      const docRef = db.collection("rooms").doc(doc.id);
      const docObj = { ...doc.data(), update: true };
      batch.set(docRef, docObj);
    });
  }

  batch
    .commit()
    .then(() => {
      console.log("updatinggg success");
    })
    .catch((e) => {
      console.log("updatinggg error", e);
    });
};

export const removeUpdateInRooms = () => async (dispatch) => {
  const batch = db.batch();

  const data = await db
    .collection("rooms")
    .where("id", "==", "9QNkyIJOh2ubjn6vKoe1")
    .get();

  if (data.docs) {
    data.docs.forEach((doc) => {
      const docRef = db.collection("rooms").doc(doc.id);
      const docObj = { ...doc.data(), update: true };
      delete docObj.update;
      batch.set(docRef, docObj);
    });
  }

  batch.commit();
};
