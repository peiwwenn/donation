import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js"; // ✅ reuse the SAME auth

// Login
export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Register
export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Reset password
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// Google login/register
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}