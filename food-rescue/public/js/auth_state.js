import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById("loginNav");
  const profileMenu = document.getElementById("profileNav");

  if (user) {
    // logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "flex";
  } else {
    // logged out
    if (loginBtn) loginBtn.style.display = "flex";
    if (profileMenu) profileMenu.style.display = "none";
  }
});