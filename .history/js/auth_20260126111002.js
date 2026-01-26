import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  alert("Logged in");
};

window.logout = async () => {
  await signOut(auth);
  alert("Logged out");
};
