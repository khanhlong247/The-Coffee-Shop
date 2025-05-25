import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAnfsWcdKsHh5k11Jz5JWilh7NIkz_P7og",
    authDomain: "coffeestore-70950.firebaseapp.com",
    projectId: "coffeestore-70950",
    storageBucket: "coffeestore-70950.firebasestorage.app",
    messagingSenderId: "637786765173",
    appId: "1:637786765173:web:1e38fccf8e939fbdcf053c"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
