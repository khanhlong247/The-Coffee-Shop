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
  
  document.getElementById("login-btn").addEventListener("click", async (event) => {
    event.preventDefault(); 
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
  
    if (!email || !password) {
      errorMessage.innerText = "Vui lòng nhập email và mật khẩu!";
      return;
    }
  
    try {
      const response = await callAPI('POST', '/auth/login', { email, password });
  
      if (!response.success) {
        errorMessage.innerText = "Email hoặc mật khẩu không đúng!";
        return;
      }
  
      const userData = response.user;
      const userId = userData.id; 
  
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