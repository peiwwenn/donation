import {
  registerWithEmail,
  loginWithGoogle,
  handleGoogleRedirectResult
} from "./auth.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

window.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registerForm");
  const emailEl = document.getElementById("regEmail");
  const pwEl = document.getElementById("regPassword");
  const googleBtn = document.getElementById("regGoogleBtn");
  const errorBox = document.getElementById("regError");
  const successBox = document.getElementById("regSuccess");

  /* ================= HANDLE GOOGLE REDIRECT RESULT ================= */
  try {
    const result = await handleGoogleRedirectResult();
    if (result?.user) {
      window.location.href = "index.html";
      return;
    }
  } catch (e) {
    console.warn("No redirect result");
  }

  /* ================= AUTO REDIRECT IF ALREADY LOGGED IN ================= */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });

  /* ================= EMAIL REGISTER ================= */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      errorBox.textContent = "";
      successBox.style.display = "none";

      try {
        await registerWithEmail(
          emailEl.value.trim(),
          pwEl.value
        );

        successBox.style.display = "block";

        // Small delay so user sees success message
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);

      } catch (err) {
        console.error(err);
        errorBox.textContent = err.message;
      }
    });
  }

  /* ================= GOOGLE REGISTER ================= */
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      loginWithGoogle(); // redirect-based
    });
  }
});
