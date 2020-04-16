import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const ALGOLIA_ID = functions.config().algoliasalon.id;
const ALGOLIA_ADMIN_KEY = functions.config().algoliasalon.key;
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex("rooms");

// USER CREATED //

exports.userCreated = functions.auth.user().onCreate((user) => {
  const promises: any = [];
  const batch = db.batch();

  if (user.providerData && user.providerData[0].providerId === "facebook.com") {
    promises.push(
      admin.auth().updateUser(user.uid, {
        emailVerified: true,
      })
    );
  }

  const userProfileRef = db.doc("users/" + user.uid);

  batch.set(userProfileRef, {
    uid: user.uid,
    email: user.email,
    languages: [],
    username: user.uid,
    name:
      user.providerData && user.providerData[0].displayName
        ? user.providerData[0].displayName
        : "",
    avatar:
      user.providerData && user.providerData[0].photoURL
        ? user.providerData[0].photoURL
        : "",
  });

  promises.push(batch.commit());

  return Promise.all(promises);
});

// USER UPDATED //

exports.userUpdate = functions.firestore
  .document("users/{userID}")
  .onUpdate(async (change, context) => {
    const profile = change.after.data();
    const profileOld = change.before.data();

    const batch = db.batch();

    if (!profile || !profileOld || profile === profileOld) return;

    // If the user changed their username, change the user name in all of that user's posts- past or future
    if (
      profile.username !== profileOld.username ||
      profile.name !== profileOld.name ||
      profile.avatar !== profileOld.avatar
    ) {
      console.log("begin update");

      const roomsData = await db
        .collection("rooms")
        .where("user_ID", "==", profile.uid)
        .get();
      
      console.log("roomsDataLength", roomsData.docs.length)

      roomsData.docs.map((doc) => {
        const room = doc.data();
        const roomRef = db.collection("rooms").doc(room.id);

        console.log("room", room.id);

        batch.set(
          roomRef,
          {
            user_username: profile.username,
            user_name: profile.name,
            user_avatar: profile.avatar,
          },
          { merge: true }
        );
      });

      const commentsData = await db
        .collection("comments")
        .where("user_ID", "==", profile.uid)
        .get();

      commentsData.docs.map((doc) => {
        const comment = doc.data();
        const commentRef = db.collection("comments").doc(comment.id);

        console.log("comment", comment.id);

        batch.set(
          commentRef,
          {
            user_username: profile.username,
            user_name: profile.name,
            user_avatar: profile.avatar,
          },
          { merge: true }
        );
      });
    }

    return batch.commit();
  });


// ROOM CREATED //

exports.roomCreated = functions.firestore
  .document("rooms/{roomID}")
  .onCreate((snap, context) => {
    const room = snap.data();
    const batch = db.batch();
    const promises: any = [];

    if (!room) return;

    // For every tag in the room, add the room ID to the list of rooms using that tag, and increase the usage count for that tag
    room.tags.forEach((tag: string) => {
      // Adding the room ID to the list of rooms using that tag
      const tagRef = db.collection("tags").doc(tag);
      batch.set(
        tagRef,
        {
          rooms: admin.firestore.FieldValue.arrayUnion(context.params.roomID),
        },
        { merge: true }
      );

      // Increasing the usage count for that tag
      const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
      batch.set(
        tagsCountRef,
        {
          [tag]: admin.firestore.FieldValue.increment(1) || 0,
        },
        { merge: true }
      );
    });
    promises.push(batch.commit());

    if (room) {
      promises.push(
        index.saveObject({
          objectID: room.id,
          language: room.language,
          tags: room.tags,
          title: room.title,
          user_ID: room.user_ID,
          visitors_count: room.visitors_count,
          last_visit: room.last_visit,
          created_on: room.created_on,
          favorites_count: room.favorites_count,
        })
      );
    }

    return Promise.all(promises);
  });

// ROOM UPDATE //

exports.roomUpdated = functions.firestore
  .document("rooms/{roomID}")
  .onUpdate((change, context) => {
    const newRoom = change.after.data();
    const oldRoom = change.before.data();

    const batch = db.batch();
    const promises: any = [];

    if (!newRoom || !oldRoom || newRoom === oldRoom) return;

    // let's check if there are any tag mismatch between the new and old list
    if (
      !newRoom.tags.every((tag: string) => oldRoom.tags.includes(tag)) ||
      !oldRoom.tags.every((tag: string) => newRoom.tags.includes(tag))
    ) {
      console.log("not all tags are the same");
      // Filter and create a new array of all the tags that we've removed from a post
      const tagsToRemove = oldRoom.tags.filter(
        (tag: string) => !newRoom.tags.includes(tag)
      );

      // For every tag we've removed, remove the room ID from the list of rooms using that tag, and lower the usage count for that tag
      tagsToRemove.forEach((tag: string) => {
        // Removing the room ID from the list of rooms using that tag
        const tagRef = db.collection("tags").doc(tag);
        batch.set(
          tagRef,
          {
            rooms: admin.firestore.FieldValue.arrayRemove(
              context.params.roomID
            ),
          },
          { merge: true }
        );

        // Lowering the usage count for that tag
        const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
        batch.set(
          tagsCountRef,
          {
            [tag]: admin.firestore.FieldValue.increment(-1) || 0,
          },
          { merge: true }
        );
      });

      // Filter and create a new array of all the tags that we've added to a post
      const tagsToAdd = newRoom.tags.filter(
        (tag: string) => !oldRoom.tags.includes(tag)
      );

      // For every tag we've added, add the room ID to the list of rooms using that tag, and increase the usage count for that tag
      tagsToAdd.forEach((tag: string) => {
        // Adding the room ID to the list of rooms using that tag
        const tagRef = db.collection("tags").doc(tag);
        batch.set(
          tagRef,
          {
            rooms: admin.firestore.FieldValue.arrayUnion(context.params.roomID),
          },
          { merge: true }
        );

        // Increasing the usage count for that tag
        const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
        batch.set(
          tagsCountRef,
          {
            [tag]: admin.firestore.FieldValue.increment(1) || 0,
          },
          { merge: true }
        );
      });
    } else {
      console.log("all tags are the same");
    }

    promises.push(batch.commit());

    if (newRoom) {
      promises.push(
        index.saveObject({
          objectID: newRoom.id,
          language: newRoom.language,
          tags: newRoom.tags,
          title: newRoom.title,
          user_ID: newRoom.user_ID,
          visitors_count: newRoom.visitors_count,
          last_visit: newRoom.last_visit,
          created_on: newRoom.created_on,
          favorites_count: newRoom.favorites_count,
        })
      );
    }

    return Promise.all(promises);
  });

// ROOM DELETED //

exports.roomDeleted = functions.firestore
  .document("rooms/{roomID}")
  .onDelete((snap, context) => {
    const room = snap.data();
    const batch = db.batch();
    const promises: any = [];

    if (!room) return;

    // For every tag in the room, add the room ID to the list of rooms using that tag, and increase the usage count for that tag
    room.tags.forEach((tag: string) => {
      // Removing the room ID from the list of rooms using that tag
      const tagRef = db.collection("tags").doc(tag);
      batch.set(
        tagRef,
        {
          rooms: admin.firestore.FieldValue.arrayRemove(context.params.roomID),
        },
        { merge: true }
      );

      // Lowering the usage count for that tag
      const tagsCountRef = db.collection("tags_count").doc(tag[0] + tag[1]);
      batch.set(
        tagsCountRef,
        {
          [tag]: admin.firestore.FieldValue.increment(-1) || 0,
        },
        { merge: true }
      );
    });

    promises.push(batch.commit());

    promises.push(index.deleteObject(room.id));

    return Promise.all(promises);
  });
