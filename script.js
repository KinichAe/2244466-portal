(function() {
    // --- 1. Data Configuration ---
    const SERVICES = [
        { id: 'note', title: '笔记同步面板', desc: 'Obsidian vaults 跨设备实时同步管理中心', url: 'https://note.2244466.xyz', icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
        { id: 'memo', title: '即时备忘录', desc: '轻量级网页端备忘录，支持 Markdown', url: 'https://memo.2244466.xyz', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>' },
        { id: 'mail', title: '电子邮件', desc: '个人全功能邮箱服务，支持过滤规则', url: 'https://mail.kinich.cc', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
        { id: 'temp', title: '临时邮箱', desc: '即开即用，24小时自动销毁', url: 'https://tempmail.2244466.xyz', icon: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>' },
        { id: 'sub', title: '订阅管理', desc: '管理您的订阅服务与续费提醒 (Beta)', url: 'https://sub.2244466.xyz', icon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
        { id: 'chat', title: '加密聊天', desc: '零知识、端到端加密即时通讯', url: 'https://tele.2244466.xyz', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
        { id: 'extra', title: '其他服务', desc: '更多工具正在孵化中...', url: '#', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>', isPlaceholder: true }
    ];

    const ADMIN_EMAIL = "admin@2244466.xyz";

    // --- 2. State Management ---
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let serviceVisibility = JSON.parse(localStorage.getItem('serviceVisibility')) || {};

    // 自动创建默认管理员（只在 users 为空时执行）
    if (users.length === 0) {
        const defaultAdmin = {
            username: "admin",
            email: ADMIN_EMAIL,
            password: "Admin123!",
            joined: Date.now(),
            lastLogin: Date.now(),
            apiKey: "sk_default_admin_" + Math.random().toString(36).substring(2, 10)
        };
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // --- 3. App Logic Bundle ---
    const app = {
        // ... 其他方法保持不变 ...

        init: function() {
            this.initTheme();
            this.renderServices();
            this.updateUI();
        },

        // ... 主题切换、模态框、服务渲染、登录注册、登出等函数保持原样 ...

        // 只需确保 updateUI() 中 admin 判断使用的是 ADMIN_EMAIL
        updateUI: function() {
            const authBtns = document.getElementById('authButtons');
            const userMenu = document.getElementById('userMenu');
            const dash = document.getElementById('userDashboard');
            const adminEntry = document.getElementById('adminEntry');

            if (currentUser) {
                authBtns.classList.add('hidden');
                userMenu.classList.remove('hidden');
                userMenu.style.display = 'flex';
                document.getElementById('navUsername').textContent = currentUser.username;
                dash.style.display = 'block';

                document.getElementById('dashEmail').textContent = currentUser.email;
                document.getElementById('regDate').textContent = new Date(currentUser.joined).toLocaleDateString();
                document.getElementById('apiKey').textContent = currentUser.apiKey || 'Wait...';

                if (currentUser.email === ADMIN_EMAIL) {
                    adminEntry.classList.remove('hidden');
                    adminEntry.style.display = 'flex';
                } else {
                    adminEntry.classList.add('hidden');
                }
            } else {
                authBtns.classList.remove('hidden');
                userMenu.classList.add('hidden');
                dash.style.display = 'none';
                document.getElementById('adminDashboard').classList.add('hidden');
            }
        },

        // ... 其余代码（checkStrength, handleRegister, handleLogin, generateApiKey, admin 相关函数等）保持原样 ...
    };

    window.app = app;

    document.addEventListener('DOMContentLoaded', () => {
        app.init();
        document.getElementById('themeToggle').addEventListener('click', () => app.toggleTheme());
    });
})();
