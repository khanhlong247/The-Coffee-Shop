import { db } from "../config/firebase.js";
import { collection, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const best_seller_collection = document.getElementById("best_seller_collection");
const new_year_collect_product = document.querySelector('#new_year_collect_product');
const coffe_pack_product = document.querySelector('#coffe_pack_product');

// 🚀 Load danh sách sản phẩm Best Seller (8 sản phẩm)
async function loadBestSellers() {
    try {
        const q = query(
            collection(db, "Products"),
            where("isBestSeller", "==", true),
            limit(8)
        );

        const querySnapshot = await getDocs(q);
        let products = [];

        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        renderBestSeller(products);
    } catch (error) {
        console.error("Lỗi khi lấy Best Seller:", error);
    }
}

// 🚀 Lấy danh sách BST Hộp Quà Tết (8 sản phẩm)
async function getBSTCollection() {
    try {
        const q = query(
            collection(db, "Products"),
            where("category", "==", 'BST Hộp Quà Tết'), // Chỉ lọc, không sắp xếp
            limit(8)
        );

        const querySnapshot = await getDocs(q);
        let products = [];

        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        renderBST(products);
    } catch (error) {
        console.error("Lỗi khi lấy BST Hộp Quà Tết:", error);
    }
}

// 🚀 Lấy danh sách Cà Phê Gói (8 sản phẩm)
async function getCoffeCollection() {
    try {
        const q = query(
            collection(db, "Products"),
            where("category", "==", "Cà Phê Gói"), // Chỉ lọc, không sắp xếp
            limit(8)
        );

        const querySnapshot = await getDocs(q);
        let products = [];

        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        renderCoffePack(products);
    } catch (error) {
        console.error("Lỗi khi lấy Cà Phê Gói:", error);
    }
}

// 🎨 Render danh sách Best Seller
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

// 🎨 Render BST Hộp Quà Tết
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

// 🎨 Render danh sách Cà Phê Gói
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



// 🚀 Chạy khi trang load
window.onload = () => {
    loadBestSellers();
    getBSTCollection();
    getCoffeCollection();
};
