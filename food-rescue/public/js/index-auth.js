import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { logoutUser } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginNavBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const userAvatar = document.getElementById("userAvatar");
  const logoutBtn = document.getElementById("logoutBtn");

  // 🔍 Debug check (VERY IMPORTANT)
  console.log("index-auth loaded", {
    loginBtn,
    userMenu,
    userAvatar
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user.email);

      loginBtn.style.display = "none";
      userMenu.style.display = "block";

      userName.textContent = user.displayName || "User";
      userEmail.textContent = user.email;

      if (user.photoURL) {
        userAvatar.src = user.photoURL;
      } else {
        userAvatar.src = "assets/img/user.png";
      }
    } else {
      loginBtn.style.display = "block";
      userMenu.style.display = "none";
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    await logoutUser();
    window.location.reload();
  });
});
