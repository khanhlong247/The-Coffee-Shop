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

  
  const best_seller_collection = document.getElementById("best_seller_collection");
  const new_year_collect_product = document.querySelector('#new_year_collect_product');
  const coffe_pack_product = document.querySelector('#coffe_pack_product');
  
  async function loadBestSellers() {
    try {
      const products = await callAPI('GET', '/products');
      const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
      renderBestSeller(bestSellers);
    } catch (error) {
      console.error("Lỗi khi lấy Best Seller:", error);
    }
  }
  
  async function getBSTCollection() {
    try {
      const products = await callAPI('GET', '/products');
      const bstCollection = products.filter(p => p.category === 'BST Hộp Quà Tết').slice(0, 8);
      renderBST(bstCollection);
    } catch (error) {
      console.error("Lỗi khi lấy BST Hộp Quà Tết:", error);
    }
  }

  async function getCoffeCollection() {
    try {
      const products = await callAPI('GET', '/products');
      const coffeeCollection = products.filter(p => p.category === 'Cà Phê Gói').slice(0, 8);
      renderCoffePack(coffeeCollection);
    } catch (error) {
      console.error("Lỗi khi lấy Cà Phê Gói:", error);
    }
  }
  
  function renderBestSeller(products) {
    let html = products.map(product => `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card my-3">
          <div class="position-relative">
            <img src="${product.image}" class="bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
            <div class="card-subtitle position-absolute bottom-0 bg-danger w-100 px-3 py-1 text-center text-white">Best Seller</div>
          </div>
          <div class="card-body">
            <h5 class="card-title fw-normal w-100" style="color: #006F3C;">${product.name}</h5>
            <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
            <div class="w-100">
              <button class="btn text-white w-100" style="background-color: #006F3C;" onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  
    best_seller_collection.innerHTML = html;
  }
  
  function renderBST(products) {
    let html = products.map(product => `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card my-3">
          <div class="position-relative">
            <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
            <div class="card-subtitle position-absolute bottom-0 bg-danger w-100 px-3 py-1 text-center text-white">BST Hộp Quà Tết</div>
          </div>
          <div class="card-body">
            <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
            <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
            <div class="w-100">
              <button class="btn text-white w-100" style="background-color: #006F3C;" onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  
    new_year_collect_product.innerHTML = html;
  }
  
  function renderCoffePack(products) {
    let html = products.map(product => `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card my-3">
          <div class="position-relative">
            <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
          </div>
          <div class="card-body">
            <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
            <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
            <div class="w-100">
              <button class="btn text-white w-100" style="background-color: #006F3C;" onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  
    coffe_pack_product.innerHTML = html;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadBestSellers();
    getBSTCollection();
    getCoffeCollection();
  });