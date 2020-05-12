import firebase from "../firebase";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

import { FETCH_POSITIONS, FETCH_SINGLE_POSITION } from "./types";

const db = firebase.firestore();

export const fetchPositions = () => async (dispatch) => {
  const data = await db
    .collection("positions")
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_POSITIONS,
    payload:
      data && data.docs
        ? data.docs.map((doc) => {
            return doc.data();
          })
        : [],
  });
};

export const fetchSinglePosition = (id) => async (dispatch) => {
  const doc = await db
    .collection("positions")
    .doc(id)
    .get()
    .catch((e) => console.error("promise Error", e));

  dispatch({
    type: FETCH_SINGLE_POSITION,
    payload: doc.data() ? doc.data() : {},
  });
};
