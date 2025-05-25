import { db } from "../config/firebase.js"
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const blog_detail = document.querySelector('#blog-detail');

function getBlogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function getBlogs() {
    try {
        const querySnapshot = await getDocs(collection(db, "Blogs"));
        let blogs = [];

        querySnapshot.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() });
        });

        return blogs;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Firestore:", error);
        return [];
    }
}

async function getBlogDetail() {
    const blogId = getBlogIdFromURL();
    if (!blogId) {
        blog_detail.innerHTML = '<p>Không tìm thấy sản phẩm</p>'
        return;
    }
    const blogs = await getBlogs();
    const blog = blogs.find((p) => p.id === blogId);
    if (!blog) {
        blog_detail.innerHTML = '<p>Không tìm thấy sản phẩm</p>'
        return;
    }
    renderBlog(blog);
    // renderRelatedProducts(product.category)
}

function renderBlog(blog) {
    blog_detail.innerHTML = `
        <div class="container my-5">
            <h2 class = "text-center my-3" style="color: #006F3C;">${blog.title}</h2>
            <div class="w-100">
                <img src=${blog.image} class="w-100" height="400px">
            </div>
            <p class="fs-6 my-3 lh-lg" >${blog.content}</p>
        </div>
    `;
}

window.onload = () => {
    getBlogDetail();
}