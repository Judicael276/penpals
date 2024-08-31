// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA4a0MU5g1W4B1FqPFXhEiE1rDhjWvUFA",
  authDomain: "penpals-6fa14.firebaseapp.com",
  projectId: "penpals-6fa14",
  storageBucket: "penpals-6fa14.appspot.com",
  messagingSenderId: "846232787970",
  appId: "1:846232787970:web:7520fa055a84edf30e1b1b",
  measurementId: "G-Z4V9YL6ZGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);