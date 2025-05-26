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
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cardContainer = document.querySelector('#renderCard');
  const currentCart = JSON.parse(localStorage.getItem("currentCart"));
  if (!currentCart || currentCart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
  }
  console.log("currentCart: ", currentCart);
  
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
  
  const sendingEmail = async () => {
    const serviceId = 'service_gcw8sl8';
    const templateId = 'template_t21zqjo';
    const public_key = 'H3d-OtjvkwB-PtLa_';
  
    const template_params = {
      from_name: 'Phúc Long Coffe Store',
      from_email: '624nguyetminh@gmail.com',
      to_name: currentUser.username,
      to_email: currentUser.email,
      message: 'Đơn hàng của quý khách đã được xác nhận, chúc quý khách một ngày vui vẻ !!!'
    };
  
    try {
      const response = await emailjs.send(serviceId, templateId, template_params, public_key);
      console.log('SUCCESS!', response.status, response.text);
      return true;
    } catch (error) {
      console.log('FAILED', error);
      return false;
    }
  };
  
  function renderCards(cards) {
    if (!cards || cards.length === 0) {
      cardContainer.innerHTML = "<p class='text-muted'>Bạn chưa có thẻ nào.</p>";
      return;
    } else {
      cardContainer.innerHTML = "";
      cards.forEach((card, index) => {
        var html = `
          <div class="w-100 d-flex justify-content-between align-items-center border rounded-3 p-3 shadow mt-3">
            <div>
              <p class="text-success fs-4 fw-bold">(Visa) ${card.cardNumber}</p>
              <input type="text" class="border-0 border-bottom px-2 py-1" placeholder="Enter CVV" id="cvv-${index}">
            </div>
            <input class="form-check-input card-radio" type="radio" name="checkPaymentMethod" data-card-number="${card.cardNumber}">
          </div>
        `;
        cardContainer.innerHTML += html;
      });

      document.querySelectorAll('.card-radio').forEach(radio => {
        radio.addEventListener('click', function () {
          console.log("Số thẻ được chọn:", this.dataset.cardNumber);
        });
      });
  
      document.getElementById("payBtn").addEventListener("click", async () => {
        const selectedCard = document.querySelector('.card-radio:checked');
  
        if (!selectedCard) {
          alert("Vui lòng chọn một thẻ để thanh toán!");
          return;
        }
  
        const cardNumber = selectedCard.dataset.cardNumber;
        const cvvInput = document.getElementById(`cvv-${Array.from(document.querySelectorAll('.card-radio')).indexOf(selectedCard)}`).value.trim();
  
        if (!cvvInput) {
          alert("Vui lòng nhập CVV!");
          return;
        }
  
        try {
          // 1️⃣ Kiểm tra thông tin thẻ
          const cards = await callAPI('GET', `/cards?userId=${currentUser.userId}`);
          const validCard = cards.find(c => c.cardNumber === cardNumber && c.cvv === cvvInput);
          if (!validCard) {
            alert("Thông tin thẻ hoặc CVV không đúng!");
            return;
          }
  
          Swal.fire({
            title: "Thanh toán thành công!",
            text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
            icon: "success",
          });
  
          // 2️⃣ Gửi email xác nhận
          const emailSent = await sendingEmail();
          if (!emailSent) {
            Swal.fire({
              title: "Lỗi gửi Email",
              text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
              icon: "error",
            });
            return;
          }
  
          // 3️⃣ Tạo hóa đơn
          const billId = await createBill("Card");
          if (!billId) {
            alert("Có lỗi xảy ra khi tạo hóa đơn!");
            return;
          }
  
          // 4️⃣ Xóa giỏ hàng
          await removeCart(currentUser.userId);
  
          Swal.fire({
            title: "Gửi Email thành công!",
            text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
            icon: "success",
          }).then(() => {
            window.location.href = '../pages/home.html';
          });
        } catch (error) {
          console.error("Lỗi trong quá trình thanh toán:", error);
          alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
      });
    }
  }
  
  document.getElementById("QRPayBtn").addEventListener("click", async () => {
    console.log("QRPayBtn clicked!");
    Swal.fire({
      title: "Thanh toán thành công!",
      text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
      icon: "success",
    });
  
    const emailSent = await sendingEmail();
    if (!emailSent) {
      Swal.fire({
        title: "Lỗi gửi Email",
        text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
        icon: "error",
      });
      return;
    }
  
    const billId = await createBill("QrCode");
    if (!billId) {
      alert("Có lỗi xảy ra khi tạo hóa đơn!");
      return;
    }
  
    await removeCart(currentUser.userId);
  
    Swal.fire({
      title: "Gửi Email thành công!",
      text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
      icon: "success",
    }).then(() => {
      window.location.href = '../pages/home.html';
    });
  });
  
  document.getElementById("traditionalPayBtn").addEventListener("click", async () => {
    Swal.fire({
      title: "Đặt hàng thành công!",
      text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
      icon: "success",
    });
  
    const emailSent = await sendingEmail();
    if (!emailSent) {
      Swal.fire({
        title: "Lỗi gửi Email",
        text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
        icon: "error",
      });
      return;
    }

    const billId = await createBill("Traditional");
    if (!billId) {
      alert("Có lỗi xảy ra khi tạo hóa đơn!");
      return;
    }

    await removeCart(currentUser.userId);

    Swal.fire({
      title: "Gửi Email thành công!",
      text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
      icon: "success",
    }).then(() => {
      window.location.href = '../pages/home.html';
    });
  });
  
  window.createBill = async function (method) {
    const currentCart = JSON.parse(localStorage.getItem("currentCart")) || {};
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!currentCart.products || !Array.isArray(currentCart.products)) {
      console.error("Giỏ hàng không hợp lệ hoặc rỗng.");
      return null;
    }
  
    const bill = {
      userId: currentUser.userId,
      products: currentCart.products.map(item => ({
        productId: item.productId,
        price: item.price,
        totalPrice: item.price * item.quantity,
        option: item.option,
        quantity: item.quantity
      })),
      isPending: false,
      paymentMethod: method,
      createdAt: new Date().toISOString(),
      totalAmount: currentCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };
  
    try {
      const response = await callAPI('POST', '/bills', bill);
      console.log("Bill created with ID: ", response.id);
      console.log("Bill: ", bill);
  
      await removeCart(currentUser.userId); // Gọi hàm xóa giỏ hàng
      return response.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  };

  async function removeCart(userId) {
    try {
      localStorage.removeItem("currentCart");
      localStorage.removeItem("totalAmount"); 
  
      const cartResponse = await callAPI('GET', `/cart?userId=${userId}`);
      const cartId = cartResponse.id; 
      if (cartId) {
        await callAPI('DELETE', `/cart/${cartId}`);
        console.log("Cart removed successfully from API!");
      } else {
        console.warn("Cart not found in API, skipping delete.");
      }
    } catch (error) {
      console.error("Error removing cart: ", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    getCards();
  });