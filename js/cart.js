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
  
  const cartRender = document.querySelector('#cart_render');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  async function getCart() {
    try {
      const userId = currentUser?.userId;
      if (!userId) {
        console.error("Không tìm thấy userId trong localStorage");
        return [];
      }
      const cart = await callAPI('GET', `/cart?userId=${userId}`);
      return Array.isArray(cart.products) ? [cart] : []; 
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
      return [];
    }
  }
  
  async function getProductDetails(productId) {
    if (!productId || typeof productId !== "string") {
      console.error("Lỗi: productId không hợp lệ", productId);
      console.log("Kiểu dữ liệu:", typeof productId);
      return null;
    }
  
    try {
      const product = await callAPI('GET', `/products/${productId}`);
      return product;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      return null;
    }
  }

  async function getCartDetail() {
    const carts = await getCart();
    console.log("🔥 Dữ liệu giỏ hàng từ API:", carts); 
  
    const cartFill = carts.find((p) => p.userId === currentUser?.userId);
    console.log("Giỏ hàng của user:", cartFill); 
  
    if (!cartFill || !cartFill.products || cartFill.products.length === 0) {
      cartRender.innerHTML = `<tr class="align-middle text-center">
                  <td class="w-100 " colspan="5">Giỏ hàng của bạn đang trống, vui lòng chọn sản phẩm</td>   
              </tr>`;
      console.log("❌ Không tìm thấy giỏ hàng hoặc giỏ hàng rỗng");
      return;
    }
  
    let productList = Array.isArray(cartFill.products) ? cartFill.products : [cartFill.products];
  
    const detailedCart = await Promise.all(
      productList.map(async (product) => {
        const productDetails = await getProductDetails(product.productId);
        if (productDetails) {
          return {
            productId: product.productId,
            name: productDetails.name,
            price: productDetails.price,
            image: productDetails.image,
            quantity: product.quantity,
            totalPrice: product.quantity * productDetails.price,
            option: product.option
          };
        }
        return null;
      })
    );
  
    console.log("✅ Danh sách sản phẩm trong giỏ hàng:", detailedCart);
    renderCart(detailedCart.filter((item) => item !== null));
  }
  
  async function deleteProductFromCart(productId) {
    try {
      console.log("Current User ID:", currentUser?.userId);
  
      if (!currentUser?.userId) {
        console.log("Không tìm thấy userId.");
        return;
      }
  
      const cartResponse = await callAPI('GET', `/cart?userId=${currentUser.userId}`);
      const cartId = cartResponse.id;
      if (!cartId) {
        console.log("Không tìm thấy giỏ hàng.");
        return;
      }
  
      await callAPI('DELETE', `/cart/${cartId}/${productId}`);
      console.log("Sản phẩm đã được xóa khỏi giỏ hàng!");
      window.location.reload();
  
      getCartDetail();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  }
  
  async function updateProductQuantity(productId, newQuantity) {
    try {
      const cartResponse = await callAPI('GET', `/cart?userId=${currentUser.userId}`);
      const cartId = cartResponse.id;
      if (!cartId) {
        console.log("Không tìm thấy giỏ hàng của user.");
        return;
      }
  
      const productDetails = await getProductDetails(productId);
      if (!productDetails) {
        console.warn("Không tìm thấy sản phẩm trong API!");
        return;
      }
  
      await callAPI('PUT', `/cart/${cartId}`, { productId, quantity: newQuantity });
      console.log(`Cập nhật thành công: ${productId}, Quantity: ${newQuantity}, Total Price: ${newQuantity * productDetails.price}`);
      showToast("Giỏ hàng đã được cập nhật!");
  
      getCartDetail();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      showToast("Lỗi khi cập nhật giỏ hàng!");
    }
  }
  
  function renderCart(cart) {
    let html = "";
    let totalAmount = 0;
  
    cart.forEach((item, index) => {
      item.totalPrice = item.quantity * item.price;
      totalAmount += item.totalPrice;
      html += `
        <tr class="align-middle text-center">
          <td class="w-50">
            <div class="d-flex align-items-center flex-lg-row flex-md-column flex-sm-column flexsm">
              <img src="${item.image}" alt="product" class="img-fluid" style="width: 100px;">
              <div class="ms-3">
                <h5 class="text-capitalize fw-normal">${item.name}</h5>
              </div>
            </div>
          </td>
          <td style="width: 15%;">${item.price.toLocaleString()}.000₫</td>
          <td style="width: 15%;">
            <div>
              <button class="btn btn-success decrement" data-index="${index}">-</button>
              <span class="mx-2 count" data-index="${index}">${item.quantity}</span>
              <button class="btn btn-success increment" data-index="${index}">+</button>
            </div>
          </td>
          <td style="width: 15%;" class="total-price" data-index="${index}">${item.totalPrice.toLocaleString()}.000₫</td>
          <td style="width: 15%;">
            <i class="bi bi-x-circle fw-bold fs-4 delete-item" data-id="${item.productId}" style="color:#006F3C;cursor:pointer"></i>
          </td>
        </tr>
      `;
    });
    localStorage.setItem('totalAmount', totalAmount);
    cartRender.innerHTML = html;
  
    document.querySelector('#checkout').innerHTML = `
      <div>
        <h3>Tổng số tiền: <span style="color:#006F3C" id="totalPriceToCheckOut">${totalAmount.toLocaleString()}.000₫</span></h3>
        <button class="btn btn-success w-100" onclick="window.location.href='/pages/checkout.html'">Tiến hành đặt hàng</button>
      </div>
    `;

    document.querySelectorAll(".increment, .decrement").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const index = event.target.getAttribute("data-index");
        let product = cart[index];
  
        if (button.classList.contains("increment")) {
          product.quantity++;
        } else if (product.quantity > 1) {
          product.quantity--;
        }
  
        product.totalPrice = product.quantity * product.price;
  
        renderCart(cart);
  
        await updateProductQuantity(product.productId, product.quantity);
      });
    });
  
    document.querySelectorAll(".delete-item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-id");
        console.log(productId);
        deleteProductFromCart(productId);
        showToast("Sản phẩm đã được xóa khỏi giỏ hàng!");
      });
    });
  }
  
  function showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#006F3C",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "10px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        lineHeight: "1.5",
      },
      onClick: function () {}
    }).showToast();
  }
  
  getCartDetail();