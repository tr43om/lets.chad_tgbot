// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCN3aICuPFMo28bNN_oJA7okNgFEiPpwcs",
    authDomain: "letschadbot.firebaseapp.com",
    projectId: "letschadbot",
    storageBucket: "letschadbot.appspot.com",
    messagingSenderId: "1010954075293",
    appId: "1:1010954075293:web:16cb70292bd69a056e6874",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
