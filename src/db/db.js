/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

let app;
export const initFirebase = () => {
    const api_key = import.meta.env.VITE_FIREBASE_API_KEY;
    const firebaseConfig = {
        apiKey: api_key,
        authDomain: "merchantile-app.firebaseapp.com",
        projectId: "merchantile-app",
        storageBucket: "merchantile-app.appspot.com",
        messagingSenderId: "530299731534",
        appId: "1:530299731534:web:57b0483a9ddbeea3a54d1f"
    };

    if (app) {
        return
    };

    app = initializeApp(firebaseConfig);
};

export const getDb = () => {
    if (app) {
        const db = getFirestore(app);
        return db;
    }
};

export default app;
