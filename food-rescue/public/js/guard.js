import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

/**
 * Redirects to login.html if user is not logged in.
 * Saves the current page so after login you can return.
 */
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      const here = window.location.pathname.split("/").pop() || "index.html";
      window.location.href = `login.html?redirect=${encodeURIComponent(here)}`;
    }
  });
}