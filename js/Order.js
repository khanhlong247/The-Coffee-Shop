
import { db } from "../config/firebase.js";
import { collection, getDocs, getDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const OrderContainer = document.getElementById('render_order')

async function getOrders() {
    try {
        if (!currentUser || !currentUser.userId) {
            console.error("Không tìm thấy người dùng. Vui lòng đăng nhập lại!");
            return;
        }

        const q = query(collection(db, "Bills"), where("userId", "==", currentUser.userId));
        const querySnapshot = await getDocs(q);
        let orders = [];

        for (const document of querySnapshot.docs) {
            let orderData = { id: document.id, ...document.data() };

            // Kiểm tra nếu order có danh sách sản phẩm
            if (orderData.products) {
                orderData.products = await Promise.all(orderData.products.map(async (product) => {
                    const productRef = doc(db, "Products", product.productId);
                    const productSnap = await getDoc(productRef);

                    return {
                        name: productSnap.exists() ? productSnap.data().name : "Sản phẩm không tồn tại",
                        quantity: product.quantity,
                        price: product.price,
                        totalPrice: product.totalPrice,
                        options: product.option
                    };
                }));
            }

            orders.push(orderData);
        }

        renderOrder(orders);
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
                                    <th scope="col" class = "text-success">STT</th>
                                    <th scope="col" class = "text-success">Tên sản phẩm</th>
                                    <th scope="col" class = "text-success text-center">Đã thanh toán</th>
                                    <th scope="col" class = "text-success text-center">Số lượng</th>
                                    <th scope="col" class = "text-success text-center">Giá</th>
                                    <th scope="col" class = "text-success text-center">Tổng Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.products.map((product, index) => `
                                    <tr>
                                        <th scope="row">${index + 1}</th>
                                        <td>${product.name}</td>
                                        <td class = "text-center">
                                            ${order.paymentMethod === "Card" || order.paymentMethod === "QrCode"
            ? '<span class="text-success fs-4 fw-bold"><i class="bi bi-check2"></i></span>'
            : '<span class="text-danger fs-4 fw-bold"><i class="bi bi-x"></i></span>'
        }
                                        </td>

                                        <td class="text-center">${product.quantity}</td>
                                        <td class="text-center">${product.price}.000₫</td>
                                        <td class="text-center">${product.totalPrice}.000₫</td>
                                    </tr>
                                `).join('')
        }
                            </tbody >
                        </table >
                    </div >
                </div >
            </div >
        </div >
    `).join('');
}




window.onload = () => {
    getOrders();
}