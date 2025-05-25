import { db } from "../config/firebase.js"
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import Swal from "https://cdn.skypack.dev/sweetalert2";
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const cardContainer = document.querySelector('#renderCard');
const currentCart = JSON.parse(localStorage.getItem("currentCart"));
if (!currentCart || currentCart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
}
console.log("currentCart: ", currentCart);
async function getCards() {
    try {
        if (!currentUser || !currentUser.userId) {
            console.error("Không tìm thấy người dùng. Vui lòng đăng nhập lại!");
            return;
        }

        const q = query(collection(db, "Cards"), where("userId", "==", currentUser.userId));
        const querySnapshot = await getDocs(q);
        let cards = [];

        querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() });
        });

        renderCards(cards);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu card:", error);
    }
}


const sendingEmail = async () => {
    const serviceId = 'service_gcw8sl8';
    const templateId = 'template_t21zqjo';
    const public_key = 'H3d-OtjvkwB-PtLa_';//khởi đầu của một hàm gửi email, nơi bạn thiết lập các thông tin cần thiết (service ID, template ID, public key) để tương tác với một dịch vụ gửi email bên ngoài. Các thông tin này giúp xác định cấu hình và đảm bảo rằng yêu cầu gửi email được thực hiện một cách hợp lệ và được xác thực.

    const template_params = {
        from_name: 'Phúc Long Coffe Store',
        from_email: '624nguyetminh@gmail.com',
        to_name: currentUser.username,
        to_email: currentUser.email,
        message: 'Đơn hàng của quý khách đã được xác nhận, chúc quý khách một ngày vui vẻ !!!'
    };

    try {
        const response = await emailjs.send(serviceId, templateId, template_params, public_key);
        console.log('SUCCESS!', response.status, response.text);
        return true;
    } catch (error) {
        console.log('FAILED', error);
        return false;
    }
};

function renderCards(cards) {
    if (cards.length === 0) {
        cardContainer.innerHTML = "<p class='text-muted'>Bạn chưa có thẻ nào.</p>";
        return;
    } else {
        cardContainer.innerHTML = ""; // Xóa nội dung cũ trước khi render
        cards.forEach((card, index) => {
            var html = `
                <div class="w-100 d-flex justify-content-between align-items-center border rounded-3 p-3 shadow mt-3">
                    <div>
                        <p class="text-success fs-4 fw-bold">(Visa) ${card.cardNumber}</p>
                        <input type="text" class="border-0 border-bottom px-2 py-1 " placeholder="Enter CVV" id="cvv-${index}">
                    </div>
                    <input class="form-check-input card-radio" type="radio" name="checkPaymentMethod" data-card-number="${card.cardNumber}">
                </div>
            `;
            cardContainer.innerHTML += html;
        });

        // Gán sự kiện cho tất cả radio buttons sau khi chúng được thêm vào DOM
        document.querySelectorAll('.card-radio').forEach(radio => {
            radio.addEventListener('click', function () {
                console.log("Số thẻ được chọn:", this.dataset.cardNumber);
            });
        });

        document.getElementById("payBtn").addEventListener("click", async () => {
            const selectedCard = document.querySelector('.card-radio:checked');

            if (!selectedCard) {
                alert("Vui lòng chọn một thẻ để thanh toán!");
                return;
            }

            const cardNumber = selectedCard.dataset.cardNumber;
            const cvvInput = document.getElementById(`cvv-${Array.from(document.querySelectorAll('.card-radio')).indexOf(selectedCard)}`).value.trim();

            if (!cvvInput) {
                alert("Vui lòng nhập CVV!");
                return;
            }

            try {
                // 1️⃣ Kiểm tra thông tin thẻ
                const cardsRef = collection(db, "Cards");
                const q = query(cardsRef, where("cardNumber", "==", cardNumber), where("cvv", "==", cvvInput));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    alert("Thông tin thẻ hoặc CVV không đúng!");
                    return;
                }

                Swal.fire({
                    title: "Thanh toán thành công!",
                    text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
                    icon: "success",
                })


                // 2️⃣ Gửi email xác nhận
                const emailSent = await sendingEmail();
                if (!emailSent) {
                    Swal.fire({
                        title: "Lỗi gửi Email",
                        text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
                        icon: "error",
                    })
                    return;
                }

                // 3️⃣ Tạo hóa đơn
                const billId = await createBill("Card");
                if (!billId) {
                    alert("Có lỗi xảy ra khi tạo hóa đơn!");
                    return;
                }

                // 4️⃣ Xóa giỏ hàng
                await removeCart(currentUser.userId);

                Swal.fire({
                    title: "Gửi Email thành công!",
                    text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
                    icon: "success",
                }).then(() => {
                    window.location.href = '../pages/home.html';
                })
            } catch (error) {
                console.error("Lỗi trong quá trình thanh toán:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        });

    }
}

document.getElementById("QRPayBtn").addEventListener("click", async () => {

    console.log("QRPayBtn clicked!");
    Swal.fire({
        title: "Thanh toán thành công!",
        text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
        icon: "success",
    })


    // 2️⃣ Gửi email xác nhận
    const emailSent = await sendingEmail();
    if (!emailSent) {
        Swal.fire({
            title: "Lỗi gửi Email",
            text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
            icon: "error",
        })
        return;
    }

    // 3️⃣ Tạo hóa đơn
    const billId = await createBill("QrCode");
    if (!billId) {
        alert("Có lỗi xảy ra khi tạo hóa đơn!");
        return;
    }

    // 4️⃣ Xóa giỏ hàng
    await removeCart(currentUser.userId);

    Swal.fire({
        title: "Gửi Email thành công!",
        text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
        icon: "success",
    }).then(() => {
        window.location.href = '../pages/home.html';
    })

});

document.getElementById("traditionalPayBtn").addEventListener("click", async () => {

    Swal.fire({
        title: "Đặt hàng thành công!",
        text: "Phúc Long xin cảm ơn quý khách đã mua hàng!",
        icon: "success",
    })


    // 2️⃣ Gửi email xác nhận
    const emailSent = await sendingEmail();
    if (!emailSent) {
        Swal.fire({
            title: "Lỗi gửi Email",
            text: "Email xác nhận không thể gửi được, vui lòng thử lại sau!",
            icon: "error",
        })
        return;
    }


    // 3️⃣ Tạo hóa đơn
    const billId = await createBill("Traditional");
    if (!billId) {
        alert("Có lỗi xảy ra khi tạo hóa đơn!");
        return;
    }

    // 4️⃣ Xóa giỏ hàng
    await removeCart(currentUser.userId);

    // 5️⃣ Tất cả các bước hoàn tất => Chuyển trang
    Swal.fire({
        title: "Gửi Email thành công!",
        text: "Email đã được gửi vui lòng kiểm tra email của bạn!",
        icon: "success",
    }).then(() => {
        window.location.href = '../pages/home.html';
    })


});

window.createBill = async function (method) {
    const billRef = collection(db, "Bills");
    const currentCart = JSON.parse(localStorage.getItem("currentCart")) || {};
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentCart.products || !Array.isArray(currentCart.products)) {
        console.error("Giỏ hàng không hợp lệ hoặc rỗng.");
        return null;
    }

    const bill = {
        userId: currentCart.userId,
        products: currentCart.products.map(item => ({
            productId: item.productId,
            price: item.price,
            totalPrice: item.price * item.quantity,
            option: item.option,
            quantity: item.quantity
        })),
        isPending: false,
        paymentMethod: method,
        createdAt: new Date().toISOString(),
        totalAmount: currentCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };

    try {
        const docRef = await addDoc(billRef, bill);
        console.log("Document written with ID: ", docRef.id);
        console.log("Bill: ", bill);

        await removeCart(currentUser.userId); // Gọi hàm xóa giỏ hàng
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        return null;
    }
};

async function removeCart(userId) {
    try {
        localStorage.removeItem("currentCart");
        localStorage.removeItem("totalAmount"); // Xóa giỏ hàng khỏi localStorage

        // Truy vấn giỏ hàng của user trong Firestore
        const cartQuery = query(collection(db, "Cart"), where("userId", "==", userId));
        const cartDocs = await getDocs(cartQuery);

        if (!cartDocs.empty) {
            // Lặp qua tất cả document trong collection và xóa từng cái
            cartDocs.forEach(async (docSnapshot) => {
                await deleteDoc(doc(db, "Cart", docSnapshot.id));
            });
            console.log("Cart removed successfully from Firestore!");
        } else {
            console.warn("Cart not found in Firestore, skipping delete.");
        }
    } catch (error) {
        console.error("Error removing cart: ", error);
    }
}


window.onload = () => {
    getCards();
}