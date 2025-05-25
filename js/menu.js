import { db } from "../config/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll("nav ul > li > a"); // Tất cả mục menu cấp 1
    const subnavs = document.querySelectorAll(".subnav"); // Tất cả subnav

    menuItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            const subnav = item.nextElementSibling; // Lấy subnav kế bên (nếu có)

            if (subnav && subnav.classList.contains("subnav")) {
                // Đóng tất cả subnav trước khi mở menu mới
                subnavs.forEach((nav) => {
                    if (nav !== subnav) nav.style.display = "none";
                });

                // Toggle hiển thị menu được chọn
                subnav.style.display = subnav.style.display === "block" ? "none" : "block";
            }
        });
    });

    // Đóng tất cả menu khi click ra ngoài
    document.addEventListener("click", () => {
        subnavs.forEach((subnav) => {
            subnav.style.display = "none";
        });
    });
});


//get elements
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
        const querySnapshot = await getDocs(collection(db, "Products"));
        let products = [];

        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        return products;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Firestore:", error);
        return [];
    }
}



// Hàm hiển thị sản phẩm lên HTML
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
            best_seller_collection.innerHTML += html; // Append each product's HTML
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
            newYear_collection.innerHTML += html; // Append each product's HTML
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
            tiramisu_collection.innerHTML += html; // Append each product's HTML
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
            fruit_tea_collection.innerHTML += html; // Append each product's HTML
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
            milk_tea.innerHTML += html; // Append each product's HTML
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
            silky_icecream.innerHTML += html; // Append each product's HTML
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
            coffe.innerHTML += html; // Append each product's HTML
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
            crushed_ice.innerHTML += html; // Append each product's HTML
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
            origin_tea.innerHTML += html; // Append each product's HTML
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
            cookies.innerHTML += html; // Append each product's HTML
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
            bread.innerHTML += html; // Append each product's HTML
        }
    });
}




// Gọi hàm khi tải trang
window.onload = () => {
    displayProducts();
};
