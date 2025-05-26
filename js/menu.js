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
  
  document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll("nav ul > li > a"); 
    const subnavs = document.querySelectorAll(".subnav"); 
  
    menuItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const subnav = item.nextElementSibling; 
  
        if (subnav && subnav.classList.contains("subnav")) {
          subnavs.forEach((nav) => {
            if (nav !== subnav) nav.style.display = "none";
          });

          subnav.style.display = subnav.style.display === "block" ? "none" : "block";
        }
      });
    });
  
    document.addEventListener("click", () => {
      subnavs.forEach((subnav) => {
        subnav.style.display = "none";
      });
    });
  });
  
  const best_seller_collection = document.querySelector('#best_seller_collection');
  const newYear_collection = document.querySelector('#newYear_collection');
  const tiramisu_collection = document.querySelector('#tiramisu_collection');
  const fruit_tea_collection = document.querySelector('#fruit_tea_collection');
  const milk_tea = document.querySelector('#milk_tea');
  const silky_icecream = document.querySelector('#silky_icecream');
  const coffe = document.querySelector('#coffe');
  const crushed_ice = document.querySelector('#crushed_ice');
  const origin_tea = document.querySelector('#origin_tea');
  const cold_cake = document.querySelector('#cold_cake');
  const cookies = document.querySelector('#cookies');
  const bread = document.querySelector('#bread');
  
  async function getProducts() {
    try {
      const products = await callAPI('GET', '/products');
      return products;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
      return [];
    }
  }

  async function displayProducts() {
    const products = await getProducts();
    products.forEach((product) => {
      if (product.isBestSeller === true) {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;" 
                    onclick="window.location.href='/pages/product_detail.html?id=${product.id}'">
                    <i class="bi bi-cart-plus"></i> Xem thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        best_seller_collection.innerHTML += html; 
      }
      if (product.category === "BST Hộp Quà Tết") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        newYear_collection.innerHTML += html;
      }
      if (product.category === "Bst Tiramisu") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        tiramisu_collection.innerHTML += html;
      }
      if (product.category === "Trà trái cây") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        fruit_tea_collection.innerHTML += html;
      }
      if (product.category === "Trà Sữa") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        milk_tea.innerHTML += html;
      }
      if (product.category === "Kem Silky") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        silky_icecream.innerHTML += html;
      }
      if (product.category === "Cà Phê") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        coffe.innerHTML += html;
      }
      if (product.category === "Đá Xay") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        crushed_ice.innerHTML += html;
      }
      if (product.category === "Trà Nguyên Bản") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        origin_tea.innerHTML += html;
      }
      if (product.category === "Bánh lạnh") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100"> 
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        cold_cake.innerHTML += html;
      }
      if (product.category === "Bánh Cookies") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100">
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        cookies.innerHTML += html;
      }
      if (product.category === "Bánh Mỳ") {
        const html = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div class="card my-2 mx-2">
              <img src="${product.image}" class="card-img-top bg-body-secondary rounded-2 overflow-hidden w-100" alt="...">
              <div class="card-body">
                <h5 class="card-title fw-normal" style="color: #006F3C;">${product.name}</h5>
                <p class="card-text fw-bolder" style="color: #006F3C;">${product.price}.000₫</p>
                <div class="w-100">
                  <button class="btn text-white w-100" style="background-color: #006F3C;"  onclick="window.location.href='/pages/product_detail.html?id=${product.id}'"><i class="bi bi-cart-plus"></i> Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        `;
        bread.innerHTML += html;
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
  });