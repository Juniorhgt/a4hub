// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2K48YIXmp65WMbwaQcxgyHEqC6fZry9w",
    authDomain: "a4hub-f721a.firebaseapp.com",
    projectId: "a4hub-f721a",
    storageBucket: "a4hub-f721a.firebasestorage.app",
    messagingSenderId: "192326389784",
    appId: "1:192326389784:web:6f22e46125e72b1541f36d",
    measurementId: "G-C27516Q26Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export services
export { auth, db, storage, analytics }; 