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

/**
 * Registers a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export const logout = () => {
  return signOut(auth);
};

/**
 * Subscribes to auth state changes.
 * @param {(user: import("firebase/auth").User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Sends a password reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export const sendResetEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Updates the current user's password.
 * @param {import("firebase/auth").User} user
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const changePassword = (user, newPassword) => {
  return updatePassword(user, newPassword);
};

/**
 * Updates the current user's email.
 * @param {import("firebase/auth").User} user
 * @param {string} newEmail
 * @returns {Promise<void>}
 */
export const changeEmail = (user, newEmail) => {
  return updateEmail(user, newEmail);
};
