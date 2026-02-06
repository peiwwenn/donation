import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js"; // ✅ reuse the SAME auth

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
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
}

// ================= HANDLE GOOGLE REDIRECT RESULT =================
// Call this on login.html page load (in login.js) to complete redirect login.
export async function handleGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result; // result?.user exists if login succeeded
  } catch (err) {
    // If there's no redirect result, Firebase may throw or return null depending on browser
    return null;
  }
}
