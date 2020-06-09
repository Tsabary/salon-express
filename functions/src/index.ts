import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const ALGOLIA_ID = functions.config().algoliasalon.id;
const ALGOLIA_ADMIN_KEY = functions.config().algoliasalon.key;
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

const roomsIndex = client.initIndex("rooms");
const floorsIndex = client.initIndex("floors");
const questionsIndex = client.initIndex("questions");
const usersIndex = client.initIndex("users");
const blogPostsIndex = client.initIndex("blog_posts");
const tagsIndex = client.initIndex("tags_count");
const skillsIndex = client.initIndex("skills_count");

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

  const userName =
    user.providerData && user.providerData[0].displayName
      ? user.providerData[0].displayName
      : "";

  const userAvatar =
    user.providerData && user.providerData[0].photoURL
      ? user.providerData[0].photoURL
      : "";

  // Create a profile
  const userProfileRef = db.doc("users/" + user.uid);

  batch.set(userProfileRef, {
    uid: user.uid,
    email: user.email,
    languages: [],
    username: user.uid,
    name: userName,
    avatar: userAvatar,
  });

  const userRoomRef = db.collection("rooms").doc();
  const newRoom = {
    admins: [
      {
        uid: user.uid,
        email: user.email,
        username: user.uid,
        name: userName,
        avatar: userAvatar,
      },
    ],
    admins_ID: [user.uid],
    associate: true,
    description: `Hi there${
      userName ? ` ${userName}` : ""
    }, Welcome to your first Room! Invite your friends, play music and watch videos together. Here for business? This could also be your virtual office. Welcome to Salon Express!`,
    favorites_count: 0,
    id: userRoomRef.id,
    language: "lir",
    last_visit: new Date(),
    private: true,
    name: `${userName ? `${userName}'s` : "My"} first Room`,
    tags: ["my-first-room"],
    user_ID: user.uid,
    user_avatar: userAvatar,
    user_username: user.uid,
    visitors_count: 0,
  };

  batch.set(userRoomRef, newRoom);

  // Save user to Algolia
  promises.push(
    usersIndex.saveObject({
      objectID: user.uid,
      email: user.email,
      username: user.uid,
      name:
        user.providerData && user.providerData[0].displayName
          ? user.providerData[0].displayName
          : "",
      avatar:
        user.providerData && user.providerData[0].photoURL
          ? user.providerData[0].photoURL
          : "",
    })
  );

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
    const promises: any = [];

    if (!profile || !profileOld || profile === profileOld) return;
    if (
      profile.username === profileOld.username &&
      profile.name === profileOld.name &&
      profile.avatar === profileOld.avatar &&
      profile.update === profileOld.update
    )
      return;

    // // If the user changed their username, change the user name in all of that user's posts- past or future
    // const roomsData = await db
    //   .collection("rooms")
    //   .where("user_ID", "==", profile.uid)
    //   .get();

    // roomsData.docs.map((doc) => {
    //   const room = doc.data();
    //   const roomRef = db.collection("rooms").doc(room.id);

    //   batch.set(
    //     roomRef,
    //     {
    //       user_username: profile.username,
    //       user_name: profile.name,
    //       user_avatar: profile.avatar,
    //     },
    //     { merge: true }
    //   );
    // });

    const commentsData = await db
      .collection("comments")
      .where("user_ID", "==", profile.uid)
      .get();

    commentsData.docs.map((doc) => {
      const comment = doc.data();
      const commentRef = db.collection("comments").doc(comment.id);
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

    const floorsData = await db
      .collection("floors")
      .where("admins_ID", "array-contains", profile.uid)
      .get();

    floorsData.docs.map((doc) => {
      const floor = doc.data();

      const newFloorAdmins = floor.admins.map((ad: any) =>
        ad.uid !== profile.uid
          ? ad
          : {
              name: profile.name,
              username: profile.username,
              email: profile.email,
              uid: profile.uid,
              avatar: profile.avatar,
            }
      );

      const floorRef = db.collection("floors").doc(floor.id);
      batch.set(
        floorRef,
        {
          ...floor,
          admins: newFloorAdmins,
        },
        { merge: true }
      );
    });

    const roomsData = await db
      .collection("rooms")
      .where("admins_ID", "array-contains", profile.uid)
      .get();

    roomsData.docs.map((doc) => {
      const room = doc.data();

      const newRoomAdmins = room.admins.map((ad: any) =>
        ad.uid !== profile.uid
          ? ad
          : {
              name: profile.name,
              username: profile.username,
              email: profile.email,
              uid: profile.uid,
              avatar: profile.avatar,
            }
      );

      const roomRef = db.collection("rooms").doc(room.id);
      batch.set(
        roomRef,
        {
          ...room,
          admins: newRoomAdmins,
        },
        { merge: true }
      );
    });

    promises.push(
      usersIndex.saveObject({
        objectID: profile.uid,
        email: profile.email,
        username: profile.username,
        name: profile.name,
        avatar: profile.avatar,
      })
    );

    promises.push(batch.commit());

    return Promise.all(promises);
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

    // const multiverseRef = db.collection("multiverses").doc(room.id);
    // batch.set(multiverseRef, {
    //   title: "Home",
    //   members: [room.user_ID],
    //   created_on: new Date(),
    //   user_ID: room.user_ID,
    // });

    if (room) {
      promises.push(
        roomsIndex.saveObject({
          objectID: room.id,
          language: room.language,
          tags: room.tags,
          name: room.name,
          image: room.image,
          members: room.members,
          user_ID: room.user_ID,
          visitors_count: room.visitors_count,
          last_visit: room.last_visit,
          private: room.private,
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
    }

    promises.push(batch.commit());

    if (newRoom) {
      promises.push(
        roomsIndex.saveObject({
          objectID: newRoom.id,
          language: newRoom.language,
          tags: newRoom.tags,
          name: newRoom.name,
          image: newRoom.image,
          members: newRoom.members,
          user_ID: newRoom.user_ID,
          visitors_count: newRoom.visitors_count,
          last_visit: newRoom.last_visit,
          private: newRoom.private,
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

    promises.push(roomsIndex.deleteObject(room.id));

    return Promise.all(promises);
  });

// FLOOR CREATED //

exports.floorCreated = functions.firestore
  .document("floors/{floorID}")
  .onCreate((snap, context) => {
    const floor = snap.data();
    const batch = db.batch();
    const promises: any = [];

    if (!floor) return;

    promises.push(batch.commit());

    promises.push(
      floorsIndex.saveObject({
        objectID: floor.id,
        name: floor.name,
        description: floor.description,
        image: floor.image,
        private: floor.private,
        tags: floor.tags,
      })
    );

    return Promise.all(promises);
  });

// FLOOR UPDATE //

exports.floorUpdated = functions.firestore
  .document("floors/{floorID}")
  .onUpdate((change, context) => {
    const floor = change.after.data();
    const oldFloor = change.before.data();

    const batch = db.batch();
    const promises: any = [];

    if (!floor || !oldFloor || floor === oldFloor) return;

    promises.push(batch.commit());

    promises.push(
      floorsIndex.saveObject({
        objectID: floor.id,
        name: floor.name,
        description: floor.description,
        image: floor.image,
        private: floor.private,
        tags: floor.tags,
      })
    );

    return Promise.all(promises);
  });

// floor DELETED //

exports.floorDeleted = functions.firestore
  .document("floor/{floorID}")
  .onDelete((snap, context) => {
    const floor = snap.data();
    const batch = db.batch();
    const promises: any = [];

    if (!floor) return;

    promises.push(batch.commit());

    promises.push(floorsIndex.deleteObject(floor.id));

    return Promise.all(promises);
  });

// QUESTION UPDATE //

exports.questionUpdated = functions.firestore
  .document("questions/{questionID}")
  .onUpdate((change, context) => {
    const newQ = change.after.data();
    const oldQ = change.before.data();

    const batch = db.batch();
    const promises: any = [];

    if (!newQ || !oldQ || newQ === oldQ) return;

    promises.push(batch.commit());

    if (newQ) {
      promises.push(
        questionsIndex.saveObject({
          objectID: newQ.id,
          question: newQ.question,
          answer: newQ.answer,
        })
      );
    }

    return Promise.all(promises);
  });

/////////// BLOG POSTS //////////

const wordCount = (string: string) => {
  return string
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// BLOG POST CREATE //

exports.BloPostCreated = functions.firestore
  .document("blog_posts/{postID}")
  .onCreate((snap, context) => {
    const bp = snap.data();
    const promises: any = [];

    if (!bp) return;

    promises.push(
      blogPostsIndex.saveObject({
        objectID: bp.id,
        created_on: bp.created_on,
        image: bp.image,
        body: wordCount(bp.body),
        title: bp.title,
        subtitle: bp.subtitle,
      })
    );

    return Promise.all(promises);
  });

// BLOG POST UPDATE //

exports.blogPostUpdated = functions.firestore
  .document("blog_posts/{postID}")
  .onUpdate((change, context) => {
    const newBP = change.after.data();
    const oldBP = change.before.data();

    const batch = db.batch();
    const promises: any = [];

    if (!newBP || !oldBP || newBP === oldBP) return;

    promises.push(batch.commit());

    if (newBP) {
      promises.push(
        blogPostsIndex.saveObject({
          objectID: newBP.id,
          created_on: newBP.created_on,
          image: newBP.image,
          body: wordCount(newBP.body),
          title: newBP.title,
          subtitle: newBP.subtitle,
        })
      );
    }

    return Promise.all(promises);
  });

// BLOG POST DELETE //

exports.blogPostDeleted = functions.firestore
  .document("blog_posts/{postID}")
  .onDelete((snap, context) => {
    const bp = snap.data();
    const promises: any = [];

    if (!bp) return;

    promises.push(blogPostsIndex.deleteObject(bp.id));

    return Promise.all(promises);
  });

// TAG COUNT CREATED //

exports.tagCountCreated = functions.firestore
  .document("tags_count/{tagsPrefix}")
  .onCreate((snap, context) => {
    const tagsPrefix = snap.data();
    const batch = db.batch();
    const promises: any = [];

    if (!tagsPrefix) return;

    // promises.push(
    //   roomsIndex.saveObject({
    //     objectID: room.id,
    //     language: room.language,
    //     tags: room.tags,
    //     name: room.name,
    //     image: room.image,
    //     members: room.members,
    //     user_ID: room.user_ID,
    //     visitors_count: room.visitors_count,
    //     last_visit: room.last_visit,
    //     private: room.private,
    //     created_on: room.created_on,
    //     favorites_count: room.favorites_count,
    //   })
    // );

    return Promise.all(promises);
  });

// TAG COUNT UPDATE //

exports.tagCountUpdated = functions.firestore
  .document("tags_count/{tagsPrefix}")
  .onUpdate((change, context) => {
    const newTagsPrefix = change.after.data();
    const oldTagsPrefix = change.before.data();

    const batch = db.batch();
    const promises: any = [];

    if (!newTagsPrefix || !oldTagsPrefix || newTagsPrefix === oldTagsPrefix) return;


    // promises.push(
    //   roomsIndex.saveObject({
    //     objectID: newRoom.id,
    //     language: newRoom.language,
    //     tags: newRoom.tags,
    //     name: newRoom.name,
    //     image: newRoom.image,
    //     members: newRoom.members,
    //     user_ID: newRoom.user_ID,
    //     visitors_count: newRoom.visitors_count,
    //     last_visit: newRoom.last_visit,
    //     private: newRoom.private,
    //     created_on: newRoom.created_on,
    //     favorites_count: newRoom.favorites_count,
    //   })
    // );
    

    return Promise.all(promises);
  });

// MULTIVERSE UPDATED //

// exports.multiverseUpdated = functions.firestore
//   .document("multiverses/{roomID}")
//   .onUpdate((change, context) => {
//     const newPortals = change.after.data();
//     const oldPortals = change.before.data();

//     const batch = db.batch();
//     const promises: any = [];
//     console.log("newPortals", newPortals);
//     console.log("oldPortals", oldPortals);

//     if (!newPortals || !oldPortals || newPortals === oldPortals) return;

//     const newPortalsArray = Object.values(newPortals);

//     const filteredPortalsArray = Object.values(newPortals).filter(
//       (port: any) => port.members.length
//     );

//     const emptyPortalsExist = Object.values(newPortals).every(
//       (port: any) => port.members.length
//     );

//     console.log("newPortalsArray", newPortalsArray);
//     console.log("filteredPortalsArray", filteredPortalsArray);
//     console.log("emptyPortalsExist", emptyPortalsExist);

//     if (!emptyPortalsExist) {
//       const multiverseDoc = db
//         .collection("multiverses")
//         .doc(context.params.roomID);

//       if (filteredPortalsArray.length) {
//         const filteredPortalsObject: any = {};

//         filteredPortalsArray.forEach((por: any) => {
//           const key = por.title.trim().split(" ").join("").toLowerCase();
//           filteredPortalsObject[key] = por;
//         });
//         console.log("filteredPortalsObject", filteredPortalsObject);

//         batch.set(multiverseDoc, filteredPortalsObject);
//       } else {
//         batch.delete(multiverseDoc);
//       }
//     }

//     promises.push(batch.commit());

//     return Promise.all(promises);
//   });
