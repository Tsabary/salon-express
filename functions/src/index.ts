import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
// const defaultStorage = admin.storage();

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

  const userFollowersRef = db.collection("followers").doc(user.uid);
  batch.set(userFollowersRef, { list: [] });

  const userProfileRef = db.doc("users/" + user.uid);

  batch.set(userProfileRef, {
    uid: user.uid,
    email: user.email,
    following: [],
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
    if (profile.username !== profileOld.username) {
      const data = await db
        .collection("streams")
        .where("user_username", "==", profileOld.username)
        .get();

      data.docs.map((doc) => {
        const stream = doc.data();
        const streamRef = db.collection("streams").doc(stream.id);

        batch.set(
          streamRef,
          { user_username: profile.username },
          { merge: true }
        );
      });
    }

    // If the new list of mentors is longer, let's find the new mentor and add ourselves to their followers list
    if (profile.following.length > profileOld.following.length) {
      const mentorID = profile.following.filter(
        (id: string) => !profileOld.following.includes(id)
      )[0];

      const mentorFollowersDoc = db.collection("followers").doc(mentorID);

      batch.set(
        mentorFollowersDoc,
        { list: admin.firestore.FieldValue.arrayUnion(context.params.userID) },
        { merge: true }
      );
    }

    // If the new list of mentors is shorter, let's find the mentor we stopped following and remove ourselves from their followers list
    if (profile.following.length < profileOld.following.length) {
      const mentorID = profileOld.following.filter(
        (id: string) => !profile.following.includes(id)
      )[0];

      const mentorFollowersDoc = db.collection("followers").doc(mentorID);

      batch.set(
        mentorFollowersDoc,
        { list: admin.firestore.FieldValue.arrayRemove(context.params.userID) },
        { merge: true }
      );
    }

    return batch.commit();
  });

// FOLLOWERS DOC UPDATED //

exports.followersUpdate = functions.firestore
  .document("followers/{mentorID}")
  .onUpdate(async (change, context) => {
    const newList = change.after.data();
    const oldList = change.before.data();

    const batch = db.batch();

    if (!oldList || !newList) return;

    const futureStreams = await db
      .collection("streams")
      .where("user_ID", "==", context.params.mentorID)
      .where("start", ">", new Date())
      .get();

    if (newList.list.length > oldList.list.length) {
      // New List is longer - add new follower to all future posts
      const followerID = newList.list.filter(
        (id: string) => !oldList.list.includes(id)
      )[0];

      futureStreams.docs.forEach((doc) => {
        const docRef = db.collection("streams").doc(doc.data().id);
        return batch.set(
          docRef,
          {
            followers: admin.firestore.FieldValue.arrayUnion(followerID),
          },
          { merge: true }
        );
      });
    } else {
      // New List is short - remove follower from all future posts
      const followerID = oldList.list.filter(
        (id: string) => !newList.list.includes(id)
      )[0];

      futureStreams.docs.forEach((doc) => {
        const docRef = db.collection("streams").doc(doc.data().id);
        return batch.set(
          docRef,
          {
            followers: admin.firestore.FieldValue.arrayRemove(followerID),
          },
          { merge: true }
        );
      });
    }

    return batch.commit();
  });

// STREAM CREATED //

exports.streamCreated = functions.firestore
  .document("streams/{streamID}")
  .onCreate((snap, context) => {
    const stream = snap.data();
    const batch = db.batch();

    if (!stream) return;

    // For every tag in the stream, add the stream ID to the list of streams using that tag, and increase the usage count for that tag
    stream.tags.forEach((tag: string) => {
      // Adding the stream ID to the list of streams using that tag
      const tagRef = db.collection("tags").doc(tag);
      batch.set(
        tagRef,
        {
          streams: admin.firestore.FieldValue.arrayUnion(
            context.params.streamID
          ),
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

    return batch.commit();
  });

// STREAM UPDATE //

exports.streamUpdated = functions.firestore
  .document("streams/{streamID}")
  .onUpdate((change, context) => {
    const newStream = change.after.data();
    const oldStream = change.before.data();

    const batch = db.batch();

    if (!newStream || !oldStream || newStream === oldStream) return;

    // let's check if there are any tag mismatch between the new and old list
    if (
      !newStream.tags.every((tag: string) => oldStream.tags.includes(tag)) ||
      !oldStream.tags.every((tag: string) => newStream.tags.includes(tag))
    ) {
      console.log("not all tags are the same");
      // Filter and create a new array of all the tags that we've removed from a post
      const tagsToRemove = oldStream.tags.filter(
        (tag: string) => !newStream.tags.includes(tag)
      );

      // For every tag we've removed, remove the stream ID from the list of streams using that tag, and lower the usage count for that tag
      tagsToRemove.forEach((tag: string) => {
        // Removing the stream ID from the list of streams using that tag
        const tagRef = db.collection("tags").doc(tag);
        batch.set(
          tagRef,
          {
            streams: admin.firestore.FieldValue.arrayRemove(
              context.params.streamID
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
      const tagsToAdd = newStream.tags.filter(
        (tag: string) => !oldStream.tags.includes(tag)
      );

      // For every tag we've added, add the stream ID to the list of streams using that tag, and increase the usage count for that tag
      tagsToAdd.forEach((tag: string) => {
        // Adding the stream ID to the list of streams using that tag
        const tagRef = db.collection("tags").doc(tag);
        batch.set(
          tagRef,
          {
            streams: admin.firestore.FieldValue.arrayUnion(
              context.params.streamID
            ),
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

    return batch.commit();
  });

// STREAM DELETED //

exports.streamDeleted = functions.firestore
  .document("streams/{streamID}")
  .onDelete((snap, context) => {
    const stream = snap.data();
    const batch = db.batch();

    if (!stream) return;

    // For every tag in the stream, add the stream ID to the list of streams using that tag, and increase the usage count for that tag
    stream.tags.forEach((tag: string) => {
      // Removing the stream ID from the list of streams using that tag
      const tagRef = db.collection("tags").doc(tag);
      batch.set(
        tagRef,
        {
          streams: admin.firestore.FieldValue.arrayRemove(
            context.params.streamID
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

    return batch.commit();
  });
