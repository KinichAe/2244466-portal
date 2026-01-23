// 登录/注册弹窗逻辑
const modal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.querySelector('.close');
const toggleLink = document.getElementById('toggleMode');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const verifyRow = document.getElementById('verifyRow');

function openModal(isRegister = false) {
  modal.style.display = 'flex';
  modalTitle.textContent = isRegister ? '注册' : '登录';
  submitBtn.textContent = isRegister ? '注册' : '登录';
  verifyRow.style.display = isRegister ? 'flex' : 'none';
}

loginBtn.addEventListener('click', () => openModal(false));
registerBtn.addEventListener('click', () => openModal(true));

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

toggleLink.addEventListener('click', e => {
  e.preventDefault();
  const isLogin = modalTitle.textContent === '登录';
  openModal(!isLogin);
});

// 假的表单提交（目前只弹窗提示）
document.getElementById('authForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('功能开发中... 目前仅演示界面，实际登录/注册后续再接入。');
  modal.style.display = 'none';
});

// 假的发送验证码
document.getElementById('sendCode')?.addEventListener('click', () => {
  alert('验证码已发送至邮箱（演示）');
});