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
  
  const productDetail = document.getElementById('product-detail');
  
  function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  
  async function getProducts() {
    try {
      const products = await callAPI('GET', '/products');
      return products;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
      return [];
    }
  }

  async function getProductDetail() {
    const productId = getProductIdFromURL();
    if (!productId) {
      productDetail.innerHTML = '<p>Không tìm thấy sản phẩm</p>';
      return;
    }
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      productDetail.innerHTML = '<p>Không tìm thấy sản phẩm</p>';
      return;
    }
    renderProduct(product);
    renderRelatedProducts(product.category);
  }
  
  window.selectedOptions = {
    "Đá": "Bình thường",
    "Đường": "Bình thường",
    "Trà": "Bình thường"
  };
  
  window.selectOption = function (button, category) {
    let group = button.parentElement.children;
  
    for (let btn of group) {
      btn.classList.remove("active");
    }
  
    button.classList.add("active");
  
    selectedOptions[category] = button.textContent.trim();
  
    console.log(selectedOptions);
  };
  
  window.addToCart = async function (productId) {
    const count = parseInt(document.getElementById('count').textContent);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);
  
    if (!product) {
      alert("Không tìm thấy sản phẩm!");
      return;
    }
  
    const newProduct = {
      productId: product.id,
      price: Number.parseInt(product.price),
      quantity: count,
      totalPrice: Number.parseInt(product.price) * count,
      option: selectedOptions
    };
  
    try {
      const cartResponse = await callAPI('GET', `/cart?userId=${currentUser.userId}`);
      let updatedCart = {};
  
      if (cartResponse && cartResponse.id) {
        let updatedProducts = Array.isArray(cartResponse.products) ? [...cartResponse.products] : [];
  
        const existingProductIndex = updatedProducts.findIndex((p) => p.productId === productId);
        if (existingProductIndex !== -1) {
          updatedProducts[existingProductIndex].quantity += count;
          updatedProducts[existingProductIndex].totalPrice += newProduct.totalPrice;
        } else {
          updatedProducts.push(newProduct);
        }
  
        await callAPI('PUT', `/cart/${cartResponse.id}`, { products: updatedProducts });
  
        updatedCart = { ...cartResponse, products: updatedProducts };
        localStorage.setItem("currentCart", JSON.stringify(updatedCart));
        console.log("Giỏ hàng đã được cập nhật thành công!");
  
      } else {
        updatedCart = {
          userId: currentUser.userId,
          products: [newProduct],
          status: "Shipping",
          createdAt: new Date().toISOString()
        };
  
        const response = await callAPI('POST', '/cart', updatedCart);
        updatedCart.id = response.id; 
  
        localStorage.setItem("currentCart", JSON.stringify(updatedCart));
        console.log("Giỏ hàng mới đã được tạo!");
      }
  
      showToast("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật giỏ hàng:", error);
      showToast("Lỗi khi thêm sản phẩm vào giỏ hàng!");
    }
  };
  
  function renderProduct(product) {
    productDetail.innerHTML = `
      <div class="row">
        <div class="col-lg-6 col-md-12 col-sm-12 rounded shadow" style="height:400px">
          <img src="${product.image}" alt="" class="w-100 h-100">
        </div>  
        <div class="col-lg-6 col-md-12 col-sm-12">
          <h1 style="color: #006F3C;">${product.name}</h1>
          <p class="px-2 fs-6 py-1 bg-danger d-inline-block text-white mt-3 text-uppercase shadow rounded">${product.category}</p>
  
          <div class="w-100 d-flex justify-content-between mt-3">
            <p class="fs-3 fw-bold" style="color: #006F3C;">${product.price}.000₫</p>
            <div>
              <button class="btn btn-success" id="decrement">-</button>
              <span class="mx-2" id="count">1</span>
              <button class="btn btn-success" id="increment">+</button>
            </div>
          </div>
  
          <div class="mb-3">
            <strong>Đá</strong>
            <div>
              <button class="btn btn-option" onclick="selectOption(this, 'Đá')">Không</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Đá')">Ít</button>
              <button class="btn btn-option active" onclick="selectOption(this, 'Đá')">Bình thường</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Đá')">Nhiều</button>
            </div>
          </div>
  
          <div class="mb-3">
            <strong>Đường</strong>
            <div>
              <button class="btn btn-option" onclick="selectOption(this, 'Đường')">Không</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Đường')">Ít</button>
              <button class="btn btn-option active" onclick="selectOption(this, 'Đường')">Bình thường</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Đường')">Nhiều</button>
            </div>
          </div>
  
          <div class="mb-3">
            <strong>Trà</strong>
            <div>
              <button class="btn btn-option" onclick="selectOption(this, 'Trà')">Không</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Trà')">Ít</button>
              <button class="btn btn-option active" onclick="selectOption(this, 'Trà')">Bình thường</button>
              <button class="btn btn-option" onclick="selectOption(this, 'Trà')">Nhiều</button>
            </div>
          </div>
          
          <h3 style="color: #006F3C;">${product.description !== 'none' ? "Mô tả sản phẩm" : ""}</h3>
          <div id="description">
            <p>${product.description !== 'none' ? product.description : ""}</p>
          </div>
          
  
          <div class="d-flex w-100 justify-content-center mt-4">
            <button class="btn text-white" onclick="addToCart('${product.id}')" style="background-color: #006F3C;"><i class="bi bi-cart-check-fill me-2"></i>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
      <h2 style="color: #006F3C;" class="mt-5 fw-bold">Sản phẩm liên quan</h2>
      <div class="mt-5 overflow-hidden mb-5">
        <div class="swiper-container">
          <div class="swiper-wrapper" id="related_product"></div>
        </div>
      </div>
    `;
  
    const decrementBtn = document.getElementById("decrement");
    const incrementBtn = document.getElementById("increment");
    const countElement = document.getElementById("count");
  
    if (decrementBtn && incrementBtn && countElement) {
      let count = 1;
      decrementBtn.addEventListener("click", () => {
        if (count > 1) {
          count--;
          countElement.textContent = count;
        }
      });
  
      incrementBtn.addEventListener("click", () => {
        count++;
        countElement.textContent = count;
      });
    } else {
      console.error("Không tìm thấy nút tăng giảm số lượng!");
    }
  }
  
  async function getRelatedProducts() {
    try {
      const products = await callAPI('GET', '/products');
      return products;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
      return [];
    }
  }
  
  async function renderRelatedProducts(category) {
    const products = await getRelatedProducts();
    const relatedProducts = products.filter((p) => p.category === category);
    const relatedProductContainer = document.getElementById("related_product");
  
    relatedProductContainer.innerHTML = ""; 
  
    if (relatedProducts.length === 0) {
      relatedProductContainer.innerHTML = "<p>Không có sản phẩm liên quan</p>";
      return;
    }
  
    relatedProducts.forEach((product) => {
      const relatedProductHTML = `
        <div class="swiper-slide">
          <div class="card rounded shadow">
            <img src="${product.image}" class="card-img-top overflow-hidden" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title fs-4 fw-bold" style="color: #006F3C;">${product.name}</h5>
              <p class="card-text fw-bold fs-5" style="color: #006F3C;">${product.price}.000₫</p>
              <a href="product_detail.html?id=${product.id}" class="btn text-white" style="background-color: #006F3C;">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `;
      relatedProductContainer.innerHTML += relatedProductHTML;
    });
  
    new Swiper(".swiper-container", {
      slidesPerView: 1,
      spaceBetween: 5,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        bulletClass: "swiper-pagination-bullet",
        bulletActiveClass: "swiper-pagination-bullet-active",
        dynamicBullets: true,
      },
      loop: true,
      autoplay: {
        delay: 1000,
        disableOnInteraction: false
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 }
      }
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
        fontSize: "25px",
        lineHeight: "1.5",
      },
      onClick: function () {}
    }).showToast();
  }

  document.addEventListener('DOMContentLoaded', () => {
    getProductDetail();
  });