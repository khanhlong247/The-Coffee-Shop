const callAPI = async (method, endpoint, body = null) => {
  const ports = [3000, 4000, 5000]; 
  let lastError = null;

  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'your-secret-api-key'
        },
        body: body ? JSON.stringify(body) : null
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      console.warn(`Failed to connect to port ${port}:`, error.message);
    }
  }
  throw lastError || new Error('All ports failed to connect');
};
  
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
        const userData = {
          email,
          password,
          username,
          createdAt: new Date().toLocaleDateString(),
          phone: "",
          avata: "",
          address: "",
          isLoggin: false,
        };
  
        const response = await callAPI('POST', '/users', userData);
  
        console.log("Người dùng đã được thêm với ID:", response.id);
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Chuyển hướng đến trang đăng nhập...",
          icon: "success",
        }).then(() => {
          window.location.href = "/index.html";
        });
  
      } catch (error) {
        console.error("Lỗi khi thêm người dùng qua API:", error);
        errorMessage.innerText = "Lỗi hệ thống, vui lòng thử lại!";
      }
    });
  });