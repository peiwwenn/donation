import { registerWithEmail, handleGoogleRedirectResult } from "./auth.js";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

window.addEventListener("DOMContentLoaded", async () => {
  const provider = new GoogleAuthProvider();
  const form = document.getElementById("registerForm");
  const emailEl = document.getElementById("regEmail");
  const pwEl = document.getElementById("regPassword");
  const confirmPwEl = document.getElementById("regConfirmPassword");
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

      if (!errorBox) {
        console.error("regError element not found");
      }

      errorBox.textContent = "";
      errorBox.style.setProperty("display", "none", "important");
      if (successBox) successBox.style.display = "none";

     const pw = pwEl.value || "";
     const confirmPw = confirmPwEl?.value || "";

      // Confirm password check
      if (pw !== confirmPw) {
        errorBox.textContent = "Passwords do not match.";
        errorBox.style.setProperty("display", "block", "important");
        return;
      }

      try {
        await registerWithEmail(emailEl.value.trim(), pw);

        if (successBox) {
          successBox.textContent = "Account created successfully! Redirecting to login...";
          successBox.style.setProperty("display", "block", "important");
        }

        // Small delay so user sees success message
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);

      } catch (err) {
        console.error("REGISTERED ERROR:", err);
        const code = err?.code || ""; // may be undefined
        const msg = err?.message || String(err);

        // Email already registered -> redirect to login
        if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
          errorBox.textContent = "This email is already registered. Redirecting to login...";
          errorBox.style.setProperty("display", "block", "important")

          setTimeout(() => {
            window.location.href = "login.html";
          }, 1200);
          return;
        }
        errorBox.textContent = msg;
        errorBox.style.setProperty("display", "block", "important");
      }
    });
  }

  /* ================= GOOGLE REGISTER ================= */
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Google signed in:", result.user.email);
        window.location.href = "index.html";
      } catch (err) {
        console.error("❌ Google sign-in error:", err.code, err.message);
        errorBox.textContent = err.message;
        errorBox.style.display = "block";
      }
    });
  }
});
