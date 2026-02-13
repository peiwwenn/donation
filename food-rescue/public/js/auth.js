import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

// ✅ check how this email signs in (google/password/etc)
export function getSignInMethods(email) {
  return fetchSignInMethodsForEmail(auth, email);
}

// ================= EMAIL LOGIN =================
export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ================= EMAIL REGISTER =================
export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// ================= RESET PASSWORD =================
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// ================= GOOGLE LOGIN (REDIRECT) =================
export function loginWithGoogleRedirect() {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
}

// ================= HANDLE GOOGLE REDIRECT RESULT =================
export async function handleGoogleRedirectResult() {
  try {
    return await getRedirectResult(auth);
  } catch (err) {
    console.error("Redirect result error:", err);
    return null;
  }
}

// ================= LOGOUT =================
export function logoutUser() {
  return signOut(auth);
}
