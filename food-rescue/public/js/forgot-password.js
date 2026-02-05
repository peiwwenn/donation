import { resetPassword } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailEl = document.querySelector('input[type="email"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await resetPassword(emailEl.value.trim());
      alert("Password reset email sent!");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
});