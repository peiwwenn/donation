import {
  loginWithEmail,
  loginWithGoogleRedirect,
  handleGoogleRedirectResult
} from "./auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js"; // must exist at same level as login.js

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

    try {
      await loginWithEmail(emailEl.value.trim(), pwEl.value);
      window.location.href = redirectTo;
    } catch (err) {
      if (errorBox) errorBox.textContent = err.message;
    }
  });

  // GOOGLE LOGIN
  googleBtn?.addEventListener("click", async () => {
    try {
      await loginWithGoogleRedirect();
      // redirect happens after reload
    } catch (err) {
      alert(err.message);
    }
  });
});
