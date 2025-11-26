document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 閱讀進度條 ---
    const progressBar = document.getElementById('progress-bar');

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }

    // --- 2. 目錄滾動監聽 (修正版) ---
    const sections = document.querySelectorAll('h3[id]');
    const navLinks = document.querySelectorAll('.toc-link');

    // 輔助函式：切換 Active 樣式
    function setActiveLink(id) {
        navLinks.forEach(link => link.classList.remove('active'));
        const targetLink = document.querySelector(`.toc-link[href="#${id}"]`);
        if (targetLink) targetLink.classList.add('active');
    }

    // A. 使用 IntersectionObserver 處理正常滾動
    const observerOptions = {
        root: null,
        // 觸發區域：視窗上方 20% 到下方 70% 之間的區域
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                setActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // B. 修復 BUG：監聽 Scroll 事件處理「到底部」的情況
    // 當頁面捲動到底部時，強制選取最後一個項目
    window.addEventListener('scroll', () => {
        updateProgress(); // 同時更新進度條

        // 判斷是否接近底部 (容許 20px 的誤差)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                setActiveLink(lastSection.getAttribute('id'));
            }
        }
    });

    // --- 3. 點擊平滑滾動 ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // 先關閉 Observer 一瞬間，避免滾動過程亂跳 (可選，這裡簡化處理)
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                // 點擊當下立刻變色，提供即時回饋
                setActiveLink(targetId);
            }
        });
    });

    // --- 4. 模擬按鈕提示 ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === '#') {
                e.preventDefault();
                alert('範例連結：請在 href 填入實際 HTML 檔案路徑');
            }
        });
    });

});