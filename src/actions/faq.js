import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import {
  // GLOBAL //
  FETCH_QUESTIONS,
} from "./types";

const db = firebase.firestore();

export const newQuestion = (question, currentUserProfile, cb) => () => {
  const questionDoc = db.collection("questions").doc();
  const QObj = { question, created_on: new Date(), id: questionDoc.id };
  if (currentUserProfile) QObj.user_ID = currentUserProfile.uid;
  questionDoc.set(QObj).then(() => {
    cb();
  });
};

export const answerQuestion = (answer, question, cb) => () => {
  const questionDoc = db.collection("questions").doc(question.id);

  questionDoc.set({ answer }, { merge: true }).then(() => {
    cb();
  });
};

export const fetchQuestions = () => async (dispatch) => {
  const data = await db
    .collection("questions")
    // .orderBy("placement", "asc")
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_QUESTIONS,
    payload: data.docs ? data.docs.map((doc) => doc.data()) : [],
  });
};

export const addQuestion = (values, userUID, cb) => () => {
  if (userUID !== "KbhtqAE0B9RDAonhQqgZ1CWsg1o1") return;
  const docRef = db.collection("questions").doc();
  docRef
    .set({ ...values, id: docRef.id })
    .then(() => {
      cb();
    })
    .catch((e) => console.error("promise Error", e));
};
