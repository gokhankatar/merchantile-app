import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

let app;

export const initFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDqcELbP1Ybt-2vUBYZDTKT61YRZ67A1M4",
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
