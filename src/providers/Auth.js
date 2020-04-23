import React, { useEffect, useState } from "react";
import firebase from "../firebase";

import { listenToProfile, stopListeningToProfile } from "../actions";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  firebase.auth().onAuthStateChanged((state) => {
    setCurrentUser(state);
  });

  useEffect(() => {
    if (currentUser) {
      listenToProfile(currentUser, setCurrentUserProfile);
      console.log("mine", "wasn't null")
    } else {
      stopListeningToProfile();
    }

    // if (currentUser) {
    //   db.collection("users")
    //     .doc(currentUser.uid)
    //     .get()
    //     .then((doc) => {
    //       setCurrentUserProfile(doc.data());
    //       console.log("mine new profile", doc.data())
    //     })
    //     .catch((err) => {
    //       setCurrentUserProfile(null);
    //     });
    // } else {
    //   setCurrentUserProfile(null);
    // }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserProfile,
        setCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
