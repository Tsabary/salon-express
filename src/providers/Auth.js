import React, { useEffect, useState } from "react";
import firebase from "firebase/app";

import { listenToProfile, stopListeningToProfile } from "../actions/users";
import { connect } from "react-redux";

export const AuthContext = React.createContext();

const AuthProvider = ({
  children,
  listenToProfile,
  stopListeningToProfile,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  firebase.auth().onAuthStateChanged((state) => {
    console.log("loging outtt authh", state);

    setCurrentUser(state);
  });

  useEffect(() => {
    if (currentUser) {
      listenToProfile(currentUser, setCurrentUserProfile);
    } else {
      stopListeningToProfile();
      setCurrentUserProfile(null);
    }
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

export const ConnectedAuthProvider = connect(null, {
  listenToProfile,
  stopListeningToProfile,
})(AuthProvider);
