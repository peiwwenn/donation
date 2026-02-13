import { auth } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.addEventListener("DOMContentLoaded", async () => {
  // AOS can stay in HTML, but doesn't hurt here:
  // AOS.init();

  const sendBtn = document.getElementById("sendOtpBtn");
  const verifyBtn = document.getElementById("verifyOtpBtn");
  const resendBtn = document.getElementById("resendOtpBtn");

  const nameEl = document.getElementById("phoneName");
  const phoneEl = document.getElementById("phoneNumber");
  const codeEl = document.getElementById("otpCode");

  const sendLoading = document.getElementById("sendLoading");
  const sendError = document.getElementById("sendError");
  const sendSuccess = document.getElementById("sendSuccess");

  const stepVerify = document.getElementById("stepVerify");

  const verifyError = document.getElementById("verifyError");
  const verifySuccess = document.getElementById("verifySuccess");

  function hide(el) { if (el) el.style.display = "none"; }
  function show(el) { if (el) el.style.display = "block"; }

  function resetSendMsgs() {
    hide(sendLoading);
    hide(sendError);
    hide(sendSuccess);
    if (sendError) sendError.textContent = "";
  }

  function resetVerifyMsgs() {
    hide(verifyError);
    hide(verifySuccess);
    if (verifyError) verifyError.textContent = "";
  }

  // ✅ Firebase needs reCAPTCHA verifier on web
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  let recaptchaReady = false;
  async function ensureRecaptcha() {
    if (!recaptchaReady) {
      await recaptchaVerifier.render();
      recaptchaReady = true;
    }
  }

  async function sendOtp() {
    resetSendMsgs();
    resetVerifyMsgs();

    const name = nameEl?.value.trim();
    const phoneRaw = phoneEl?.value.trim();

    if (!name) {
      if (sendError) sendError.textContent = "Please enter your name.";
      show(sendError);
      return;
    }
    if (!phoneRaw) {
      if (sendError) sendError.textContent = "Please enter your phone number.";
      show(sendError);
      return;
    }

    // Your UI already shows +60, so we build +60xxxxxxxxx
    const phone = `+60${phoneRaw.replace(/\s+/g, "")}`;

    show(sendLoading);

    try {
      await ensureRecaptcha();

      // ✅ Actually request OTP
      const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);

      window.confirmationResult = confirmationResult;

      hide(sendLoading);
      show(sendSuccess);
      show(stepVerify);
    } catch (err) {
      console.error("OTP send error:", err);
      hide(sendLoading);

      if (sendError) sendError.textContent = err.message || String(err);
      show(sendError);

      // allow retry
      try { recaptchaVerifier.reset(); } catch {}
    }
  }

  async function verifyOtp() {
    resetVerifyMsgs();

    const code = codeEl?.value.trim() || "";
    if (code.length !== 6) {
      if (verifyError) verifyError.textContent = "Please enter the 6-digit verification code.";
      show(verifyError);
      return;
    }

    if (!window.confirmationResult) {
      if (verifyError) verifyError.textContent = "Please request the OTP first.";
      show(verifyError);
      return;
    }

    try {
      // ✅ Confirms the OTP and signs user in with phone
      await window.confirmationResult.confirm(code);

      show(verifySuccess);
      verifySuccess.textContent = "Account created successfully! Redirecting to login...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 900);
    } catch (err) {
      console.error("OTP verify error:", err);
      if (verifyError) verifyError.textContent = err.message || String(err);
      show(verifyError);
    }
  }

  sendBtn?.addEventListener("click", sendOtp);
  resendBtn?.addEventListener("click", sendOtp);
  verifyBtn?.addEventListener("click", verifyOtp);
});