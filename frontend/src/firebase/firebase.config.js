import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl509Hb8vgd34siWlsp7ewWgS3so59WgQ",
  authDomain: "job-portal-demo-8414e.firebaseapp.com",
  projectId: "job-portal-demo-8414e",
  storageBucket: "job-portal-demo-8414e.appspot.com",
  messagingSenderId: "398969390224",
  appId: "1:398969390224:web:b16e17b1e5f61716310415",
  measurementId: "G-JKH8EMC7CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth, storage, ref, uploadBytes, getDownloadURL };
