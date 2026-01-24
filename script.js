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

    // --- 3. App Logic Bundle ---
    const app = {
        // --- Core UI ---
        init: function() {
            this.initTheme();
            this.renderServices();
            this.updateUI();
        },

        initTheme: function() {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');
            const iconSun = document.getElementById('iconSun');
            const iconMoon = document.getElementById('iconMoon');

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.setAttribute('data-theme', 'dark');
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
            }
        },

        toggleTheme: function() {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            
            const iconSun = document.getElementById('iconSun');
            const iconMoon = document.getElementById('iconMoon');
            iconSun.style.display = target === 'dark' ? 'block' : 'none';
            iconMoon.style.display = target === 'dark' ? 'none' : 'block';
        },

        // --- Modals ---
        openModal: function(id) {
            document.getElementById(id).classList.add('active');
        },
        closeModal: function(id) {
            document.getElementById(id).classList.remove('active');
        },
        switchModal: function(from, to) {
            this.closeModal(from);
            setTimeout(() => this.openModal(to), 200);
        },

        // --- Render Services ---
        renderServices: function() {
            const grid = document.getElementById('serviceGrid');
            grid.innerHTML = '';
            
            SERVICES.forEach(svc => {
                const isVisible = serviceVisibility[svc.id] !== false;
                if (!isVisible) return; 

                const div = document.createElement('div');
                div.className = 'card';
                div.onclick = () => {
                    if(svc.isPlaceholder) {
                        this.showToast('暂未正式开发');
                    } else {
                        window.open(svc.url, '_blank', 'noopener,noreferrer');
                    }
                };
                if (svc.isPlaceholder) div.title = "暂未正式开发";

                div.innerHTML = `
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${svc.icon}</svg>
                    </div>
                    <h3>${svc.title}</h3>
                    <p>${svc.desc}</p>
                    <div class="card-link">${svc.isPlaceholder ? '敬请期待' : '进入服务'}</div>
                `;
                grid.appendChild(div);
            });
        },

        // --- Auth & User ---
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

        checkStrength: function(password) {
            const bar = document.getElementById('strengthBar');
            const text = document.getElementById('strengthText');
            let score = 0;
            if (password.length > 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;

            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759'];
            const labels = ['弱', '中', '强', '非常强'];
            
            const width = Math.min((score / 4) * 100, 100);
            bar.style.width = width + '%';
            bar.style.backgroundColor = colors[Math.max(0, score - 1)];
            text.textContent = labels[Math.max(0, score - 1)];
            text.style.color = colors[Math.max(0, score - 1)];
        },

        handleRegister: function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;

            const forbidden = ['admin', 'root', 'null', 'undefined'];
            if (forbidden.includes(name.toLowerCase())) {
                this.showToast('用户名包含敏感词');
                return;
            }
            if (users.find(u => u.email === email)) {
                this.showToast('该邮箱已被注册');
                return;
            }
            const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            if (!strongRegex.test(pass)) {
                this.showToast('密码需含大小写字母、数字及特殊符号，且大于8位');
                return;
            }

            const newUser = {
                username: name,
                email: email,
                password: pass,
                joined: Date.now(),
                lastLogin: Date.now(),
                apiKey: this.generateRandomKey()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            this.closeModal('registerModal');
            this.updateUI();
            this.showToast('注册成功');
        },

        handleLogin: function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPass').value;

            const user = users.find(u => u.email === email && u.password === pass);

            if (user) {
                user.lastLogin = Date.now();
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('users', JSON.stringify(users));
                this.closeModal('loginModal');
                this.updateUI();
                this.showToast(`欢迎回来，${user.username}`);
            } else {
                this.showToast('邮箱或密码错误');
            }
        },

        handleForgot: function(e) {
            e.preventDefault();
            this.showToast('重置链接已发送（模拟）');
            this.closeModal('forgotModal');
        },

        logout: function() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            this.updateUI();
            this.showToast('已退出登录');
            document.getElementById('adminDashboard').classList.add('hidden');
        },

        generateApiKey: function() {
            if(!currentUser) return;
            const newKey = 'sk_' + this.generateRandomKey();
            currentUser.apiKey = newKey;
            
            const idx = users.findIndex(u => u.email === currentUser.email);
            if(idx !== -1) users[idx] = currentUser;
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('users', JSON.stringify(users));
            this.updateUI();
            this.showToast('API 密钥已更新');
        },

        generateRandomKey: function() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },

        // --- Admin Logic ---
        openAdminPanel: function() {
            if (!currentUser || currentUser.email !== ADMIN_EMAIL) return;
            const panel = document.getElementById('adminDashboard');
            panel.classList.remove('hidden');
            panel.style.display = 'block';
            this.renderAdminUserTable();
            this.renderAdminServiceToggles();
            panel.scrollIntoView({ behavior: 'smooth' });
        },

        closeAdminPanel: function() {
            document.getElementById('adminDashboard').classList.add('hidden');
        },

        renderAdminUserTable: function() {
            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = '';
            users.forEach(u => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td contenteditable="true" onblur="window.app.adminEditUser('${u.email}', 'username', this.innerText)">${u.username}</td>
                    <td>${u.email}</td>
                    <td>${new Date(u.joined).toLocaleDateString()}</td>
                    <td><button class="text-xs text-sec" onclick="alert('模拟重置密码')">重置密码</button></td>
                `;
                tbody.appendChild(tr);
            });
        },

        adminEditUser: function(email, field, value) {
            const idx = users.findIndex(u => u.email === email);
            if(idx !== -1) {
                users[idx][field] = value;
                localStorage.setItem('users', JSON.stringify(users));
                this.showToast('用户信息已更新');
            }
        },

        renderAdminServiceToggles: function() {
            const container = document.getElementById('serviceToggles');
            container.innerHTML = '';
            SERVICES.forEach(svc => {
                const isVisible = serviceVisibility[svc.id] !== false;
                const div = document.createElement('div');
                div.className = 'dash-row';
                div.innerHTML = `
                    <span>${svc.title}</span>
                    <button class="btn btn-sm ${isVisible ? 'btn-primary' : 'btn-ghost'}" 
                        onclick="window.app.toggleService('${svc.id}')">
                        ${isVisible ? '显示中' : '已隐藏'}
                    </button>
                `;
                container.appendChild(div);
            });
        },

        toggleService: function(id) {
            const current = serviceVisibility[id] !== false;
            serviceVisibility[id] = !current;
            localStorage.setItem('serviceVisibility', JSON.stringify(serviceVisibility));
            this.renderAdminServiceToggles();
            this.renderServices();
        },

        exportUsers: function() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "users_backup.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },

        // --- Utilities ---
        showToast: function(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }
    };

    // Expose app to window so HTML onClick works
    window.app = app;

    // Initialize on Load
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
        // Bind Theme Toggle Event Listener manually since it's cleaner than onclick in HTML
        document.getElementById('themeToggle').addEventListener('click', () => app.toggleTheme());
    });

})();
