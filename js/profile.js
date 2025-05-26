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
  
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  document.getElementById('username').innerHTML = currentUser.username;
  document.getElementById('email').innerHTML = currentUser.email;
  document.getElementById('addressText').innerHTML = currentUser.address ? currentUser.address : "Bạn chưa cập nhật địa chỉ";
  document.getElementById('phoneText').innerHTML = currentUser.phone ? currentUser.phone : "Bạn chưa cập nhật số điện thoại";
  document.getElementById('register_day').innerHTML = currentUser.createdAt;
  
  document.getElementById('avatar_sidebar').src = currentUser.avata ? currentUser.avata : 'https://bookvexe.vn/wp-content/uploads/2023/04/chon-loc-25-avatar-facebook-mac-dinh-chat-nhat_2.jpg';
  document.getElementById('address').value = currentUser.address;
  document.getElementById('phonenumber').value = currentUser.phone;
  document.getElementById('avata').value = currentUser.avata;
  
  async function getCards() {
    try {
      if (!currentUser || !currentUser.userId) {
        console.error("Không tìm thấy người dùng. Vui lòng đăng nhập lại!");
        return;
      }
  
      const cards = await callAPI('GET', `/cards?userId=${currentUser.userId}`);
      renderCards(cards);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu card:", error);
    }
  }
  
  function renderCards(cards) {
    let cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = "";
  
    if (cards.length === 0) {
      cardsContainer.innerHTML = "<p class='text-muted'>Bạn chưa có thẻ nào.</p>";
      return;
    }
  
    let cardsHTML = cards
      .map(
        (card) => `
        <div class="card col-lg-3 mx-3 border rounded-5 shadow" style="background-color: #1E2E69; width:20rem">
          <div class="payment-cart" style="background: #1E2E69; margin-bottom: 10px;">
            <img src="../assets/images/bay.svg" alt="" class="payment-cart__img">
            <div class="payment-cart__top">
              <img src="../assets/images/icon.svg" alt="" class="payment-cart__icon">
              <span class="payment-cart__type">FeatherCard</span>
            </div>
            <div class="payment-cart__number">
              ${card.cardNumber}
            </div>
            <div class="payment-cart__bottom">
              <div>
                <div class="payment-cart__label">Card Holder</div>
                <div class="payment-cart__value">${currentUser.username}</div>
              </div>
              <div>
                <div class="payment-cart__label">Expired</div>
                <div class="payment-cart__value">${card.expiryDate}</div>
              </div>
              <img src="../assets/images/tron.svg" alt="" class="payment-cart__circle">
            </div>
          </div>
        </div>
      `
      )
      .join(""); 
  
    cardsContainer.innerHTML = cardsHTML;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    getCards();
  });