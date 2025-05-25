import { db } from "../config/firebase.js"
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const cartRender = document.querySelector('#cart_render');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

async function getCart() {
    try {
        const querySnapshot = await getDocs(collection(db, "Cart"));
        let cart = [];

        querySnapshot.forEach((doc) => {
            cart.push({ id: doc.id, ...doc.data() });
        });

        return cart;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Firestore:", error);
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
        const productRef = doc(db, "Products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            return productSnap.data();
        } else {
            console.warn("Không tìm thấy sản phẩm với ID:", productId);
        }
        return null;
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return null;
    }
}


async function getCartDetail() {
    const carts = await getCart();
    console.log("🔥 Dữ liệu giỏ hàng từ Firestore:", carts); // Debug data

    const cartFill = carts.find((p) => p.userId === currentUser?.userId);
    console.log("Giỏ hàng của user:", cartFill); // Debug user cart

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

        // Truy vấn giỏ hàng của user
        const cartQuery = query(collection(db, "Cart"), where("userId", "==", currentUser.userId));
        const querySnapshot = await getDocs(cartQuery);

        // Kiểm tra xem có giỏ hàng hay không
        if (querySnapshot.empty) {
            console.log("Không tìm thấy giỏ hàng.");
            return;
        }

        // Lấy document đầu tiên (vì mỗi user chỉ có 1 giỏ hàng)
        const cartDoc = querySnapshot.docs[0];
        let cartData = cartDoc.data();

        console.log("Cart Data Before Deletion:", cartData);

        // Kiểm tra nếu products tồn tại
        if (!cartData.products || cartData.products.length === 0) {
            console.log("Giỏ hàng trống!");
            return;
        }

        // Lọc bỏ sản phẩm cần xóa
        cartData.products = cartData.products.filter((product) => product.productId !== productId);

        // Cập nhật lại Firestore
        await updateDoc(doc(db, "Cart", cartDoc.id), { products: cartData.products });

        console.log("Sản phẩm đã được xóa khỏi giỏ hàng!");
        window.location.reload();

        // Load lại giỏ hàng sau khi xóa
        getCartDetail();
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
    }
}


function renderCart(cart) {
    let html = "";
    let totalAmount = 0;

    cart.forEach((item, index) => {
        item.totalPrice = item.quantity * item.price; // Đảm bảo giá trị đúng
        totalAmount += item.totalPrice; // Tính tổng tiền giỏ hàng
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

    // Gắn sự kiện tăng/giảm số lượng sau khi cập nhật HTML
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

            // Cập nhật trên giao diện ngay lập tức
            renderCart(cart);

            // Gửi cập nhật lên Firestore
            await updateProductQuantity(product.productId, product.quantity, product.totalPrice);
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


async function updateProductQuantity(productId, newQuantity) {
    try {
        const cartQuery = query(collection(db, "Cart"), where("userId", "==", currentUser.userId));
        const querySnapshot = await getDocs(cartQuery);

        if (querySnapshot.empty) {
            console.log("Không tìm thấy giỏ hàng của user.");
            return;
        }

        const cartDoc = querySnapshot.docs[0]; // Lấy giỏ hàng của user
        let cartData = cartDoc.data();

        if (!cartData.products || cartData.products.length === 0) {
            console.log("Giỏ hàng trống!");
            return;
        }

        // Lấy giá sản phẩm mới nhất từ Firestore
        const productDetails = await getProductDetails(productId);
        if (!productDetails) {
            console.warn("Không tìm thấy sản phẩm trong Firestore!");
            return;
        }

        // Cập nhật quantity và totalPrice của sản phẩm
        cartData.products = cartData.products.map((product) => {
            if (product.productId === productId) {
                return {
                    ...product,
                    quantity: newQuantity,
                    totalPrice: newQuantity * productDetails.price // Tính lại tổng tiền
                };
            }
            return product;
        });

        // Cập nhật lại Firestore
        await updateDoc(doc(db, "Cart", cartDoc.id), { products: cartData.products });

        console.log(`Cập nhật thành công: ${productId}, Quantity: ${newQuantity}, Total Price: ${newQuantity * productDetails.price}`);
        showToast("Giỏ hàng đã được cập nhật!");

        // Load lại giỏ hàng sau khi cập nhật
        getCartDetail();
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        showToast("Lỗi khi cập nhật giỏ hàng!");
    }
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
            fontSize: "20px",
            lineHeight: "1.5",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}
// Gọi hàm để lấy giỏ hàng của user
getCartDetail();


