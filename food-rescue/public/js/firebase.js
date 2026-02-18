import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrw9JfpfWOQSaDGHSHqQ9twIT8w3uXNTw", // ✅ MUST MATCH WEB APP
  authDomain: "smart-food-rescue-v2.firebaseapp.com",
  projectId: "smart-food-rescue-v2",
  storageBucket: "smart-food-rescue-v2.firebasestorage.app",
  messagingSenderId: "289675567800",
  appId: "1:289675567800:web:d08a6f2950bd6e6569ca4d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Session-only login (recommended for your case)
// User stays logged in until they close the browser tab/window.
// After logout, it won’t “auto appear” logged in again.
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error("Auth persistence error:", err);
});