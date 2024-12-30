import React, { createContext, useContext } from "react";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);