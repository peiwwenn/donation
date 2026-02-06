import { loginWithGoogle, loginWithEmail } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailEl = document.getElementById("loginEmail");
  const pwEl = document.getElementById("loginPassword");
  const googleBtn = document.getElementById("loginGoogleBtn");
  const errorBox = document.getElementById("loginError");

  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirect") || "index.html";

  // ================= EMAIL LOGIN =================
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.textContent = "";

      try {
        await loginWithEmail(
          emailEl.value.trim(),
          pwEl.value
        );
        window.location.href = redirectTo;
      } catch (err) {
        console.error(err);
        errorBox.textContent = err.message;
      }
    });
  }

  // ================= GOOGLE LOGIN =================
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        await loginWithGoogle();
        window.location.href = redirectTo;
      } catch (err) {
        console.error(err);

        // Ignore harmless popup errors
        if (
          err.code === "auth/popup-closed-by-user" ||
          err.code === "auth/cancelled-popup-request"
        ) {
          return;
        }

        alert(err.message);
      }
    });
  }
});
