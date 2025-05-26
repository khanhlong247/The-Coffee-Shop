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
  
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  
  function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
      $(selector).innerHTML = cached;
    }
  
    if (path.startsWith('/api')) {
      callAPI('GET', path.replace('/api', ''))
        .then((html) => {
          if (html !== cached) {
            $(selector).innerHTML = html;
            localStorage.setItem(path, html);
          }
        })
        .catch((error) => console.error(`Lỗi khi tải template từ API: ${path}`, error))
        .finally(() => {
          window.dispatchEvent(new Event("template-loaded"));
        });
    } else {
      fetch(path)
        .then((res) => res.text())
        .then((html) => {
          if (html !== cached) {
            $(selector).innerHTML = html;
            localStorage.setItem(path, html);
          }
        })
        .catch((error) => console.error(`Lỗi khi tải template từ file: ${path}`, error))
        .finally(() => {
          window.dispatchEvent(new Event("template-loaded"));
        });
    }
  }
  
  function isHidden(element) {
    if (!element) return true;
  
    if (window.getComputedStyle(element).display === "none") {
      return true;
    }
  
    let parent = element.parentElement;
    while (parent) {
      if (window.getComputedStyle(parent).display === "none") {
        return true;
      }
      parent = parent.parentElement;
    }
  
    return false;
  }
  
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;
  
    const items = $$(".js-dropdown-list > li");
  
    items.forEach((item) => {
      const arrowPos = item.offsetLeft + item.offsetWidth / 2;
      item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
  });
  
  window.addEventListener("resize", calArrowPos);
  
  window.addEventListener("template-loaded", calArrowPos);
  
  window.addEventListener("template-loaded", initJsToggle);
  
  function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
      const target = button.getAttribute("toggle-target");
      if (!target) {
        document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
      }
      button.onclick = () => {
        if (!$(target)) {
          return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
        }
        const isHidden = $(target).classList.contains("hide");
  
        requestAnimationFrame(() => {
          $(target).classList.toggle("hide", !isHidden);
          $(target).classList.toggle("show", isHidden);
        });
      };
    });
  }