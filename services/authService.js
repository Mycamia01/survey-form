import { auth } from "../firebase/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email,
    name: email.split('@')[0],
    role: "system_user",
    createdAt: new Date().toISOString()
  });
  
  return userCredential;
};

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const sendResetEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const changePassword = (user, newPassword) => {
  return updatePassword(user, newPassword);
};

export const changeEmail = (user, newEmail) => {
  return updateEmail(user, newEmail);
};