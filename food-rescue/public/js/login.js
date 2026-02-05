import { loginWithEmail, loginWithGoogle } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailEl = document.querySelector('input[type="email"]');
  const pwEl = document.querySelector('input[type="password"]');

  const googleBtn = document.getElementById("loginGoogleBtn");
  const loginBtn = document.getElementById("loginBtn");

  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirect")|| "index.html"

  async function doLogin() {
    await loginWithEmail(emailEl.value.trim(), pwEl.value);
    window.location.href = redirectTo;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await doLogin();
        //await loginWithEmail(emailEl.value.trim(), pwEl.value);
        //window.location.href = "donate.html"; // change if needed
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // If your page uses a button instead of form submit
  if (loginBtn && !form) {
    loginBtn.addEventListener("click", async () => {
      try {
        await doLogin();
        //await loginWithEmail(emailEl.value.trim(), pwEl.value);
        //window.location.href = "donate.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        await loginWithGoogle();
        window.location.href = redirectTo;
        //window.location.href = "donate.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }
});