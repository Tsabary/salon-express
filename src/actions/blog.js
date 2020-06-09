import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { NEW_POST, FETCH_NEW_BLOG_POSTS, FETCH_MORE_BLOG_POSTS } from "./types";

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

export const newPost = (values, image, cb) => async (dispatch) => {
  const postDoc = db.collection("blog_posts").doc();

  if (!image) return;

  const ref = storage.ref(`/images/blog_posts/${postDoc.id}/`);

  const upload = await ref.put(image);
  if (!upload) return;

  const downloadUrl = await ref.getDownloadURL();
  if (!downloadUrl) return;

  const postObj = {
    ...values,
    id: postDoc.id,
    created_on: new Date(),
    image: downloadUrl,
  };

  postDoc.set(postObj).then(() => {
    cb(postDoc.id);
    dispatch({
      type: NEW_POST,
      payload: postObj,
    });
  });
};

export const savePost = (values, image, cb) => async (dispatch) => {
  const postDoc = db.collection("blog_posts").doc(values.id);

  if (image) {
    const ref = storage.ref(`/images/blog_posts/${postDoc.id}/`);

    const upload = await ref.put(image);
    if (!upload) return;

    const downloadUrl = await ref.getDownloadURL();
    if (!downloadUrl) return;

    const postObj = {
      ...values,
      image: downloadUrl,
    };

    postDoc.set(postObj).then(() => {
      cb();
      //   dispatch({
      //     type: NEW_POST,
      //     payload: postObj,
      //   });
    });
  } else {
    postDoc.set(values).then(() => {
      cb();
    });
  }
};

export const fetchFirstBlogPosts = (setLastVisible, setReachedLast) => async (
  dispatch
) => {
  const data = await db
    .collection("blog_posts")
    .orderBy("created_on", "desc")
    .limit(90)
    .get();

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length === 20) setReachedLast(false);

  dispatch({
    type: FETCH_NEW_BLOG_POSTS,
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
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          // .where("language", "in", [...languages, "lir"])
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch mo ex", e))
      : await db
          .collection("rooms")
          .where("private", "==", false)
          .orderBy("last_visit", "desc")
          .startAfter(lastVisible)
          .limit(90)
          .get()
          .catch((e) => console.error("promise Error fetch mo ex", e));

  if (data.docs.length) setLastVisible(data.docs[data.docs.length - 1]);
  if (data.docs.length < 90) setReachedLast(true);

  analytics.logEvent("fetch_more_explore");

  dispatch({
    type: FETCH_MORE_BLOG_POSTS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const fetchCurrentPost = (id, cb) => async () => {
  const post = await db.collection("blog_posts").doc(id).get();

  if (post.data()) {
    cb(post.data());
  }
};

export const fetchBlogComments = (postID, cb) => async () => {
  const data = await db
    .collection("blog_comments")
    .where("post_ID", "==", postID)
    .orderBy("created_on", "desc")
    // .startAfter(lastVisible)
    // .limit(90)
    .get();

  cb(data.docs ? data.docs.map((doc) => doc.data()) : []);
};

export const newComment = (values, cb) => async () => {
  const commentDoc = await db.collection("blog_comments").doc();
  const comment = { ...values, created_on: new Date(), id: commentDoc.id };

  commentDoc
    .set(comment)
    .then(() => {
      analytics.logEvent("comment_new");
      cb(commentDoc.id);
    })
    .catch((e) => console.error("promise Error new comment", e));
};

export const updateComment = (comment, commentID, cb) => async () => {
  const commentDoc = await db.collection("blog_comments").doc(commentID);

  commentDoc.set({ body: comment }, { merge: true }).then(() => {
    analytics.logEvent("comment_update");

    cb();
  });
};

export const deleteComment = (commentID, cb) => async () => {
  const commentDoc = await db.collection("blog_comments").doc(commentID);

  commentDoc.delete().then(() => {
    analytics.logEvent("comment_delete");

    cb();
  });
};

export const postLike = (post, userID, currentlyLikes, cb) => async () => {
  const postDoc = db.collection("blog_posts").doc(post.id);

  currentlyLikes
    ? postDoc
        .set(
          { likes: firebase.firestore.FieldValue.arrayRemove(userID) },
          { merge: true }
        )
        .then(() => {
          cb({ ...post, likes: post.likes.filter((l) => l !== userID) });
        })
    : postDoc
        .set(
          { likes: firebase.firestore.FieldValue.arrayUnion(userID) },
          { merge: true }
        )
        .then(() => {
          cb({ ...post, likes: [...post.likes, userID] });
        });
};
