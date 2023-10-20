// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIHo37BQE-dM6hTMqZeTWxSSwLeJQIiZA",
  authDomain: "twitter-5cfdd.firebaseapp.com",
  projectId: "twitter-5cfdd",
  storageBucket: "twitter-5cfdd.appspot.com",
  messagingSenderId: "1035773822764",
  appId: "1:1035773822764:web:c874112024a47bbd828e89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
