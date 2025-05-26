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
  const OrderContainer = document.getElementById('render_order');
  
  async function getOrders() {
    try {
      if (!currentUser || !currentUser.userId) {
        console.error("Không tìm thấy người dùng. Vui lòng đăng nhập lại!");
        return;
      }
  
      const orders = await callAPI('GET', `/bills?userId=${currentUser.userId}`);
      if (!orders || orders.length === 0) {
        renderOrder([]);
        return;
      }
  
      const detailedOrders = await Promise.all(orders.map(async (order) => {
        if (order.products) {
          order.products = await Promise.all(order.products.map(async (product) => {
            const productDetails = await callAPI('GET', `/products/${product.productId}`);
            return {
              name: productDetails ? productDetails.name : "Sản phẩm không tồn tại",
              quantity: product.quantity,
              price: product.price,
              totalPrice: product.totalPrice,
              options: product.option
            };
          }));
        }
        return order;
      }));
  
      renderOrder(detailedOrders);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu orders:", error);
    }
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return "Không xác định";
  
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Không xác định";
  
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  
  function renderOrder(orders) {
    if (orders.length === 0) {
      OrderContainer.innerHTML = "<p class='text-muted'>Bạn chưa có đơn hàng nào.</p>";
      return;
    }
  
    OrderContainer.innerHTML = orders.map((order, orderIndex) => ` 
      <div class="card my-3 shadow">
        <div class="card-header bg-success text-white">
          <h4 class="card-title">Đơn hàng #${order.id}</h4>
        </div>
        <div class="card-body">
          <p class="card-text text-success fs-4 fw-bold">Ngày đặt hàng: 
            <span class="text-black fw-medium">${formatDate(order.createdAt)}</span>
          </p>
          <p class="card-text text-success fs-4 fw-bold">Tổng tiền: 
            <span class="text-black fw-medium">${order.totalAmount}.000₫</span>
          </p>
          <p class="card-text text-success fs-4 fw-bold">Trạng thái: 
            <span class="text-black fw-medium">${order.isPending ? "Đơn hàng đang được vận chuyển" : "Đơn hàng đã được chuẩn bị"}</span>
          </p>
          <button class="btn btn-primary" type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#collapseOrder${orderIndex}" 
            aria-expanded="false" 
            aria-controls="collapseOrder${orderIndex}">
            Xem chi tiết đơn hàng
          </button>
          
          <div class="collapse mt-3" id="collapseOrder${orderIndex}">
            <div class="card card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col" class="text-success">STT</th>
                    <th scope="col" class="text-success">Tên sản phẩm</th>
                    <th scope="col" class="text-success text-center">Đã thanh toán</th>
                    <th scope="col" class="text-success text-center">Số lượng</th>
                    <th scope="col" class="text-success text-center">Giá</th>
                    <th scope="col" class="text-success text-center">Tổng Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.products.map((product, index) => `
                    <tr>
                      <th scope="row">${index + 1}</th>
                      <td>${product.name}</td>
                      <td class="text-center">
                        ${order.paymentMethod === "Card" || order.paymentMethod === "QrCode"
                          ? '<span class="text-success fs-4 fw-bold"><i class="bi bi-check2"></i></span>'
                          : '<span class="text-danger fs-4 fw-bold"><i class="bi bi-x"></i></span>'
                        }
                      </td>
                      <td class="text-center">${product.quantity}</td>
                      <td class="text-center">${product.price}.000₫</td>
                      <td class="text-center">${product.totalPrice}.000₫</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    getOrders();
  });