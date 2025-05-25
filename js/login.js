// Import Firestore từ Firebase
import { db } from "../config/firebase.js";
import { collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import Swal from "https://cdn.skypack.dev/sweetalert2";
// ✅ Lắng nghe sự kiện khi bấm nút "Đăng nhập"
document.getElementById("login-btn").addEventListener("click", async (event) => {
    event.preventDefault(); // 🔥 Ngăn form reload trang

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (!email || !password) {
        errorMessage.innerText = "Vui lòng nhập email và mật khẩu!";
        return;
    }

    try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            errorMessage.innerText = "Email hoặc mật khẩu không đúng!";
            return;
        }

        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();


        await updateDoc(doc(db, "Users", userId), { isLoggin: true });


        localStorage.setItem("currentUser", JSON.stringify({ userId, ...userData, isLoggin: true }));

        console.log("Đăng nhập thành công:", { userId, ...userData, isLoggin: true });

        Swal.fire({
            title: "Đăng nhập thành công!",
            text: "Chuyển hướng đến trang chủ...",
            icon: "success",
        }).then(() => {
            window.location.href = "../pages/home.html";
        });

    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        errorMessage.innerText = "Lỗi hệ thống, vui lòng thử lại!";
    }
});
