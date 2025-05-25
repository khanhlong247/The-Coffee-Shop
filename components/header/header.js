import { db } from "../../config/firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const headerInput = document.querySelector('.header_input');
    const subsearch = document.querySelector('.sub_search');
    const closeBtn = document.querySelector('.close_btn');
    const toggleBtn = document.querySelector('.toggle-btn');
    const toggleNavbar = document.querySelector('#toggle_navbar');
    console.log(headerInput);
    console.log(subsearch);
    if (headerInput && subsearch) {
        headerInput.addEventListener('focus', () => {
            console.log("open header menu");
            subsearch.classList.add('d-block');
            subsearch.classList.remove('d-none');
        });

        closeBtn.addEventListener('click', () => {
            console.log("close header menu");
            subsearch.classList.remove('d-block');
            subsearch.classList.add('d-none');
        });
    }


    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth < 576) {
            toggleNavbar.classList.toggle('d-block');
        }
    });

    // Lắng nghe sự kiện resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 576) {
            toggleNavbar.classList.remove("d-block"); // Xóa d-block khi màn hình lớn hơn 576px
        }
    });


});
document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser.avata);
    if (currentUser && currentUser.avata) { // Kiểm tra key đúng là "avatar"
        document.querySelector('#avatar_header').src = currentUser.avata;
    } else {
        document.querySelector('#avatar_header').src = "https://bookvexe.vn/wp-content/uploads/2023/04/chon-loc-25-avatar-facebook-mac-dinh-chat-nhat_2.jpg"; // Ảnh mặc định
    }

    const selectedAddress = localStorage.getItem('selectedAddress');
    console.log(selectedAddress);

    document.querySelector('.header_address-text').innerText = selectedAddress ? selectedAddress : "Chưa chọn địa chỉ";
});






async function searchProduct(searchInput) {
    try {
        const searchKeyword = searchInput.trim().toLowerCase(); // Chuẩn hóa từ khóa tìm kiếm

        const q = query(collection(db, "Products"));
        const querySnapshot = await getDocs(q);

        let foundProduct = null;

        querySnapshot.forEach((doc) => {
            const product = doc.data();

            if (!product.name) return; // Bỏ qua nếu không có name

            const productName = product.name.replace(/\s*\(L\)\s*/gi, "").trim().toLowerCase(); // Chuẩn hóa tên sản phẩm

            if (productName.includes(searchKeyword)) {
                foundProduct = { id: doc.id, ...product };
            }
        });

        if (foundProduct) {
            window.location.href = `/pages/product_detail.html?id=${foundProduct.id}`;
        } else {
            window.location.href = `/pages/error.html`;
        }
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
}


// Lắng nghe sự kiện nhấn Enter
document.querySelector(".header_input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchProduct(event.target.value);
    }
});

