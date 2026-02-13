import {
  loginWithEmail,
  getSignInMethods,
  loginWithGoogleRedirect,
  handleGoogleRedirectResult
} from "./auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js"; // must exist at same level as login.js

import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const provider = new GoogleAuthProvider();

window.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("loginForm");
  const emailEl = document.getElementById("loginEmail");
  const pwEl = document.getElementById("loginPassword");
  const googleBtn = document.getElementById("loginGoogleBtn");
  const errorBox = document.getElementById("loginError");

  const redirectTo = "index.html";

  // ✅ MOST RELIABLE: if user is signed in, go index
  onAuthStateChanged(auth, (user) => {
    console.log("🔎 onAuthStateChanged:", user);
    if (user) window.location.href = redirectTo;
  });

  // ✅ OPTIONAL: handle redirect result (sometimes null)
  try {
    const result = await handleGoogleRedirectResult();
    console.log("🔎 getRedirectResult:", result);
    if (result?.user) window.location.href = redirectTo;
  } catch (err) {
    console.error("❌ redirect result error:", err);
    if (errorBox) errorBox.textContent = err?.message || String(err);
  }

  // EMAIL LOGIN
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorBox) errorBox.textContent = "";

    const email = emailEl.value.trim();
    const password = pwEl.value;

    try {
      const methods = await getSignInMethods(email);

      // Google-only account → block email/password login
      if (methods.includes("google.com") && !methods.includes("password")) {
        if (errorBox) errorBox.textContent = "This email uses Google Sign-In. Please login with Google.";
        return;
      }

      // proceed with email/password login
      await loginWithEmail(email, password);
      window.location.href = redirectTo;
    } catch (err) {
      if (errorBox) errorBox.textContent = err.message || String(err);
    }
  });

  // GOOGLE LOGIN
  googleBtn.addEventListener("click", async () => {
    try {
      console.log("Google login clicked");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Logged in as:", result.user.email);
      window.location.href = "index.html";
    } catch (err) {
      console.error("❌ Google login error:", err.code, err.message);
      alert(`${err.code}\n${err.message}`);
    }
  });
});
