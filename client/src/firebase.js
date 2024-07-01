import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDnrECf-uzTN4kVO1OOsgfpXi-qBB3pYIE",
  authDomain: "profile-management-app-c6595.firebaseapp.com",
  projectId: "profile-management-app-c6595",
  storageBucket: "profile-management-app-c6595.appspot.com",
  messagingSenderId: "264910579629",
  appId: "1:264910579629:web:327b3955d804de1604e324",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
