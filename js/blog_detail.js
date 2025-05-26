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
  
  const blog_detail = document.querySelector('#blog-detail');
  
  function getBlogIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
  }
  
  async function getBlogs() {
      try {
          const blogs = await callAPI('GET', '/blogs');
          return blogs;
      } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
          return [];
      }
  }
  
  async function getBlogDetail() {
      const blogId = getBlogIdFromURL();
      if (!blogId) {
          blog_detail.innerHTML = '<p>Không tìm thấy bài blog</p>';
          return;
      }
      const blogs = await getBlogs();
      const blog = blogs.find((p) => p.id === blogId);
      if (!blog) {
          blog_detail.innerHTML = '<p>Không tìm thấy bài blog</p>';
          return;
      }
      renderBlog(blog);
  }
  
  function renderBlog(blog) {
      blog_detail.innerHTML = `
          <div class="container my-5">
              <h2 class="text-center my-3" style="color: #006F3C;">${blog.title}</h2>
              <div class="w-100">
                  <img src=${blog.image} class="w-100" height="400px">
              </div>
              <p class="fs-6 my-3 lh-lg">${blog.content}</p>
          </div>
      `;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      getBlogDetail();
  });