// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, setDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    authDomain: "a4hub.firebaseapp.com",
    projectId: "a4hub",
    storageBucket: "a4hub.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
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

// Helper function to check if user is admin
export const isUserAdmin = async (userId) => {
  const userDoc = await db.collection('users').doc(userId).get();
  return userDoc.exists && userDoc.data().isAdmin;
};

// Helper function to get user by username
export const getUserByUsername = async (username) => {
  const usersRef = db.collection('users');
  const querySnapshot = await usersRef.where('username', '==', username).get();
  return querySnapshot.empty ? null : querySnapshot.docs[0];
};

// Create default admin user if it doesn't exist
export const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@a4hub.com';
    const adminPassword = '123456';
    
    // Check if admin user exists
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('email', '==', adminEmail).get();
    
    if (querySnapshot.empty) {
      // Create admin user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;
      
      // Set admin privileges
      await setDoc(doc(db, 'users', user.uid), {
        email: adminEmail,
        username: 'admin',
        isAdmin: true,
        createdAt: new Date().toISOString()
      });
      
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}; 