// Import Firestore từ Firebase
import { db } from "../config/firebase.js";
import { doc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import Swal from "https://cdn.skypack.dev/sweetalert2";
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signUp-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const username = document.getElementById("username").value.trim();
        const errorMessage = document.getElementById("error-message");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errorMessage.innerText = "Email không hợp lệ! Hãy nhập đúng định dạng.";
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errorMessage.innerText = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
            return;
        }

        if (!username) {
            errorMessage.innerText = "Vui lòng nhập tên người dùng!";
            return;
        }
        try {
            const docRef = await addDoc(collection(db, "Users"), {
                email,
                password,
                username,
                createdAt: new Date().toLocaleDateString(),
                phone: "",
                avata: "",
                address: "",
                isLoggin: false,
            });

            console.log("Người dùng đã được thêm với ID:", docRef.id);
            Swal.fire({
                title: "Đăng ký thành công!",
                text: "Chuyển hướng đến trang đăng nhập...",
                icon: "success",
            }).then(() => {
                window.location.href = "/index.html";
            });

        } catch (error) {
            console.error("Lỗi khi thêm người dùng Firestore:", error);
            errorMessage.innerText = "Lỗi hệ thống, vui lòng thử lại!";
        }
    });
});
