import { registerWithEmail } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailEl = document.querySelector('input[type="email"]');
  const pwEl = document.querySelector('input[type="password"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await registerWithEmail(emailEl.value.trim(), pwEl.value);
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
});