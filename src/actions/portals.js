import firebase from "../firebase";

import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { titleToKey } from "../utils/strings";

const db = firebase.firestore();

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

export const listenToMultiverse = (
    entityID,
    setMultiverse,
    setMultiverseArray,
    cb
  ) => () => {
    console.log("minnne", "attached listener");
  
    multiverseListener = db
      .collection("multiverses")
      .doc(entityID)
      .onSnapshot((docMultiverse) => {
        if (docMultiverse.data()) {
          setMultiverse(docMultiverse.data());
  
          const arrayVerse = Object.values(docMultiverse.data());
  
          setMultiverseArray(arrayVerse.sort(compare));
        } else {
          if (cb) cb();
        }
      });
  };
  
  // Deteching the listener for the multiverse
  export const detachMultiverseListener = () => () => {
    if (multiverseListener) multiverseListener();
  };


// Enter a portal
export const enterPortal = (entityID, portal, uid, cb) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(entityID);

  // const key = titleToKey(portal.title);

  let newPortalKey = titleToKey(portal.new.title);
  let oldPortalKey = portal && portal.old ? titleToKey(portal.old.title) : null;

  console.log("portals", `entering portal ${portal.new.title}`);

  batch.set(
    portalDoc,
    {
      [newPortalKey]: {
        title: portal.new.title,
        created_on: portal.new.created_on,
        members: firebase.firestore.FieldValue.arrayUnion(uid),
      },
    },
    { merge: true }
  );

  if (oldPortalKey) {
    batch.set(
      portalDoc,
      {
        [oldPortalKey]: {
          title: portal.old.title,
          created_on: portal.old.created_on,
          members: firebase.firestore.FieldValue.arrayRemove(uid),
        },
      },
      { merge: true }
    );
  }

  batch.commit().then(() => {
    if (cb) cb();
  });
};

// Leave a portal
export const leavePortal = (entityID, portal, uids, cb) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(entityID);
  const key = titleToKey(portal.title);

  console.log("portals", `leaving portal ${portal.title}`);

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

  batch.commit().then(() => {
    if (cb) cb();
  });
};

//Replacing between UUID and UID in the portal logs
export const replaceUids = (entityID, portal, previousID, newID, cb) => () => {
  const batch = db.batch();
  const portalDoc = db.collection("multiverses").doc(entityID);
  const key = titleToKey(portal.new.title);

  // console.log("portals", `replacing ids previous: ${previousID} next ${newID}`);

  batch.set(
    portalDoc,
    {
      [key]: {
        title: portal.new.title,
        created_on: portal.new.created_on,
        members: firebase.firestore.FieldValue.arrayUnion(newID),
      },
    },

    { merge: true }
  );
  if (previousID) {
    batch.set(
      portalDoc,
      {
        [key]: {
          title: portal.new.title,
          created_on: portal.new.created_on,
          members: firebase.firestore.FieldValue.arrayRemove(previousID),
        },
      },

      { merge: true }
    );
  }

  batch.commit().then(() => {
    cb();
  });
};

// Opening a new portal
export const newPortal = (newPortal, oldPortal, entityID, uid, cb) => () => {
  const portalObj = {
    title: newPortal.title,
    members: [uid],
    created_on: new Date(),
    user_ID: uid,
  };
  if (newPortal.totem) {
    portalObj.totem = newPortal.totem;
  }

  const batch = db.batch();
  const verseDoc = db.collection("multiverses").doc(entityID);

  let newPortalKey = titleToKey(newPortal.title);
  let oldPortalKey = oldPortal ? titleToKey(oldPortal.title) : null;

  batch.set(
    verseDoc,
    {
      [newPortalKey]: portalObj,
    },
    { merge: true }
  );

  if (oldPortalKey) {
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
