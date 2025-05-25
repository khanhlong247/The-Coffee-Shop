import { db } from "../config/firebase.js"
import { collection, getDocs, setDoc, updateDoc, doc, arrayUnion, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const productDetail = document.getElementById('product-detail');



function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

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
async function getProductDetail() {
    const productId = getProductIdFromURL();
    if (!productId) {
        productDetail.innerHTML = '<p>Không tìm thấy sản phẩm</p>'
        return;
    }
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
        productDetail.innerHTML = '<p>Không tìm thấy sản phẩm</p>'
        return;
    }
    renderProduct(product);
    renderRelatedProducts(product.category)
}

// Định nghĩa hàm selectOption trong phạm vi toàn cục
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

    // Cập nhật trạng thái vào object
    selectedOptions[category] = button.textContent.trim();

    // Log ra console theo dạng yêu cầu
    console.log(selectedOptions);
};

//add to cart
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
        // Truy vấn giỏ hàng của user trong Firestore
        const cartRef = collection(db, "Cart");
        const cartQuery = query(cartRef, where("userId", "==", currentUser.userId));
        const cartSnapshot = await getDocs(cartQuery);

        let updatedCart = {};

        if (!cartSnapshot.empty) {
            // Nếu giỏ hàng đã tồn tại, cập nhật mảng `products`
            const cartDoc = cartSnapshot.docs[0];
            const cartData = cartDoc.data();
            let updatedProducts = Array.isArray(cartData.products) ? [...cartData.products] : [];

            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng, thì tăng số lượng
            const existingProductIndex = updatedProducts.findIndex((p) => p.productId === productId);
            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].quantity += count;
                updatedProducts[existingProductIndex].totalPrice += newProduct.totalPrice;
            } else {
                updatedProducts.push(newProduct);
            }

            // Cập nhật giỏ hàng trong Firestore
            await updateDoc(doc(db, "Cart", cartDoc.id), { products: updatedProducts });

            // Cập nhật localStorage
            updatedCart = { ...cartData, products: updatedProducts };
            localStorage.setItem("currentCart", JSON.stringify(updatedCart));
            console.log("Giỏ hàng đã được cập nhật thành công!");

        } else {
            // Nếu giỏ hàng chưa tồn tại, tạo mới với mảng `products`
            updatedCart = {
                userId: currentUser.userId,
                products: [newProduct],
                status: "Shipping",
                createdAt: new Date().toISOString()
            };

            // Lưu vào Firestore
            await addDoc(cartRef, updatedCart);

            // Cập nhật localStorage
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
                    <button class="btn text-white" onclick = "addToCart('${product.id}')" style="background-color: #006F3C;"><i class="bi bi-cart-check-fill me-2"></i>Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
        <h2 style="color: #006F3C;" class="mt-5  fw-bold ">Sản phẩm liên quan</h2>
        <div class = "mt-5 overflow-hidden mb-5">
            <div class="swiper-container">
                <div class="swiper-wrapper " id="related_product"></div>


                    <!-- Thanh hiển thị số trang -->
                
            </div>
        </div>
    
    `;

    // Gán sự kiện tăng giảm số lượng
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

async function renderRelatedProducts(category) {
    const products = await getRelatedProducts();
    const relatedProducts = products.filter((p) => p.category === category);// lấy ra các sản phẩm có nội dung liên quan
    const relatedProductContainer = document.getElementById("related_product");

    relatedProductContainer.innerHTML = ""; // Xóa nội dung cũ

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
                        <a href="product_detail.html?id=${product.id}" class="btn text-white"  style="background-color: #006F3C;">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        `;
        relatedProductContainer.innerHTML += relatedProductHTML;
    });

    // Khởi tạo Swiper sau khi đã render xong
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
        loop: true, // Lặp vô hạn
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
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
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
        onClick: function () { } // Callback after click
    }).showToast();
}

window.onload = () => {
    getProductDetail();
    renderRelatedProducts();
};