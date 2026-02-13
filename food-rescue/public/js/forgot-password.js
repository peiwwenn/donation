import { resetPassword, getSignInMethods } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailEl = document.querySelector('input[type="email"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailEl.value.trim();
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      // ✅ check sign-in method first
      const methods = await getSignInMethods(email);

      // No account exists
      if (!methods || methods.length === 0) {
        alert("No account found with this email.");
        return;
      }

      // Google-only account → cannot reset password
      if (methods.includes("google.com") && !methods.includes("password")) {
        alert("This email uses Google Sign-In. Please login with Google.");
        window.location.href = "login.html";
        return;
      }

      // Email/password account → send reset email
      if (methods.includes("password")) {
        await resetPassword(email);
        alert("Reset link sent! Please check your inbox (and spam).");
        window.location.href = "login.html";
        return;
      }

      // Other providers (rare)
      alert(`This email uses: ${methods.join(", ")}. Please use that sign-in method.`);
    } catch (err) {
      alert(err.message || String(err));
    }
  });
});