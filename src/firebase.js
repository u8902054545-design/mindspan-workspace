import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCDYprLWHGhQM6jTjmepoqU_G2bFJHe6p4",
    authDomain: "mindspan-workspace-5ff90.firebaseapp.com",
    projectId: "mindspan-workspace-5ff90",
    databaseURL: "https://mindspan-workspace-5ff90-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
