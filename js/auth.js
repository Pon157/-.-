
// Система аутентификации и регистрации

const Auth = {
    currentUser: null,
    isAuthenticated: false,

    // Инициализация
    init() {
        this.loadUser();
        this.setupEventListeners();
        this.updateUI();
    },

    // Загрузка пользователя из хранилища
    loadUser() {
        this.currentUser = Storage.getUser();
        this.isAuthenticated = !!this.currentUser;
        console.log('Пользователь загружен:', this.currentUser);
    },

    // Регистрация
    async register(userData) {
        try {
            // Валидация
            if (!this.validateRegistration(userData)) {
                throw new Error('Проверьте правильность введенных данных');
            }

            // Проверка, не зарегистрирован ли уже email
            const existingUsers = this.getUsers();
            if (existingUsers.find(u => u.email === userData.email)) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создание пользователя
            const user = {
                id: this.generateId(),
                name: userData.name.trim(),
                email: userData.email.toLowerCase().trim(),
                password: this.hashPassword(userData.password),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: 'student',
                avatar: this.generateAvatar(userData.name),
                settings: {
                    notifications: true,
                    theme: 'light',
                    language: 'ru'
                }
            };

            // Сохранение
            this.saveUser(user);
            this.currentUser = user;
            this.isAuthenticated = true;

            // Обновление UI
            this.updateUI();
            this.showMessage('success', 'Регистрация прошла успешно!');

            return { success: true, user };
        } catch (error) {
            this.showMessage('error', error.message);
            return { success: false, error: error.message };
        }
    },

    // Вход
    async login(email, password) {
        try {
            // Поиск пользователя
            const users = this.getUsers();
            const user = users.find(u => 
                u.email === email.toLowerCase().trim() && 
                u.password === this.hashPassword(password)
            );

            if (!user) {
                throw new Error('Неверный email или пароль');
            }

            // Обновление времени входа
            user.lastLogin = new Date().toISOString();
            this.saveUser(user);
            
            this.currentUser = user;
            this.isAuthenticated = true;

            // Обновление UI
            this.updateUI();
            this.showMessage('success', `Добро пожаловать, ${user.name}!`);

            return { success: true, user };
        } catch (error) {
            this.showMessage('error', error.message);
            return { success: false, error: error.message };
        }
    },

    // Выход
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        Storage.removeUser();
        
        // Обновление UI
        this.updateUI();
        this.showMessage('info', 'Вы вышли из системы');
        
        // Возврат на главную
        window.location.reload();
    },

    // Валидация регистрации
    validateRegistration(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }

        if (!this.validateEmail(data.email)) {
            errors.push('Введите корректный email');
        }

        if (!data.password || data.password.length < 6) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }

        if (data.password !== data.confirm) {
            errors.push('Пароли не совпадают');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        return true;
    },

    // Валидация email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Хэширование пароля (упрощенное для демо)
    hashPassword(password) {
        // В реальном приложении используйте bcrypt или аналоги
        return btoa(password); // Только для демо!
    },

    // Генерация ID
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Генерация аватара
    generateAvatar(name) {
        const colors = ['#6a89cc', '#4a69bd', '#3498db', '#2ecc71', '#e74c3c', '#f39c12'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Создаем инициалы
        const initials = name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        
        return {
            initials,
            color,
            type: 'initials'
        };
    },

    // Получить всех пользователей
    getUsers() {
        const usersJson = localStorage.getItem('empathy_course_users') || '[]';
        return JSON.parse(usersJson);
    },

    // Сохранить пользователя
    saveUser(user) {
        // Сохраняем текущего пользователя
        Storage.saveUser(user);
        
        // Обновляем список всех пользователей
        const users = this.getUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('empathy_course_users', JSON.stringify(users));
    },

    // Обновление UI
    updateUI() {
        const userInfo = document.getElementById('userName');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const certificateBtn = document.getElementById('certificateBtn');

        if (this.isAuthenticated && this.currentUser) {
            // Пользователь авторизован
            if (userInfo) userInfo.textContent = this.currentUser.name;
            if (dropdownUserName) dropdownUserName.textContent = this.currentUser.name;
            if (dropdownUserEmail) dropdownUserEmail.textContent = this.currentUser.email;
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            
            // Активируем кнопку сертификата
            if (certificateBtn) {
                certificateBtn.classList.remove('disabled');
                certificateBtn.onclick = () => this.showCertificate();
            }
        } else {
            // Гость
            if (userInfo) userInfo.textContent = 'Гость';
            if (dropdownUserName) dropdownUserName.textContent = 'Гость';
            if (dropdownUserEmail) dropdownUserEmail.textContent = '';
            
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            
            // Деактивируем кнопку сертификата
            if (certificateBtn) {
                certificateBtn.classList.add('disabled');
                certificateBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showAuthPromo();
                };
            }
        }
    },

    // Показать/скрыть форму авторизации
    toggleAuthForm(show) {
        const authArea = document.getElementById('authArea');
        const moduleArea = document.getElementById('moduleArea');
        
        if (authArea && moduleArea) {
            if (show) {
                authArea.style.display = 'flex';
                moduleArea.style.display = 'none';
            } else {
                authArea.style.display = 'none';
                moduleArea.style.display = 'block';
            }
        }
    },

    // Показать промо авторизации
    showAuthPromo() {
        this.toggleAuthForm(true);
        this.showMessage('info', 'Зарегистрируйтесь для получения сертификата!');
    },

    // Показать сертификат
    showCertificate() {
        if (!this.isAuthenticated) {
            this.showAuthPromo();
            return;
        }

        const progress = Storage.getProgress();
        const totalModules = courseData.modules.length;
        const completedModules = progress.completedModules.length;

        if (completedModules < totalModules) {
            this.showMessage('warning', `Завершите все модули! Вы прошли ${completedModules} из ${totalModules}.`);
            return;
        }

        // Генерация именного сертификата
        this.generateCertificate();
    },

    // Генерация сертификата
    generateCertificate() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modalTitle || !modalBody) return;

        modalTitle.textContent = '🎓 Ваш именной сертификат';
        
        const certificateHTML = `
            <div class="certificate-container">
                <div class="certificate" id="certificateContent">
                    <div class="certificate-border">
                        <div class="certificate-header">
                            <h1>СЕРТИФИКАТ</h1>
                            <p>о успешном прохождении курса</p>
                        </div>
                        
                        <div class="certificate-body">
                            <h2>«Эмпатия и поддержка в общении»</h2>
                            <div class="certificate-award">
                                <i class="fas fa-award"></i>
                            </div>
                            
                            <p class="certificate-text">
                                Настоящим удостоверяется, что
                            </p>
                            
                            <h3 class="certificate-name">${this.currentUser.name}</h3>
                            
                            <p class="certificate-text">
                                успешно освоил(а) программу из 5 модулей
                                и проявил(а) компетенции в области эмпатического общения,
                                активного слушания и поддержки людей.
                            </p>
                            
                            <div class="certificate-details">
                                <div class="detail">
                                    <strong>Дата выдачи:</strong>
                                    <p>${new Date().toLocaleDateString('ru-RU')}</p>
                                </div>
                                <div class="detail">
                                    <strong>Идентификатор:</strong>
                                    <p>EMP-${this.currentUser.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="certificate-footer">
                            <div class="signature">
                                <div class="signature-line"></div>
                                <p>Подпись</p>
                            </div>
                            <div class="logo-cert">
                                <i class="fas fa-heart"></i>
                                <span>Курс Эмпатии</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="certificate-actions">
                    <button class="btn-primary" onclick="Auth.downloadCertificate()">
                        <i class="fas fa-download"></i> Скачать сертификат
                    </button>
                    <button class="btn-secondary" onclick="Auth.shareCertificate()">
                        <i class="fas fa-share-alt"></i> Поделиться
                    </button>
                    <button class="btn-secondary" onclick="Auth.printCertificate()">
                        <i class="fas fa-print"></i> Распечатать
                    </button>
                </div>
                
                <p class="certificate-note">
                    <i class="fas fa-info-circle"></i>
                    Сертификат можно сохранить как PDF или изображение
                </p>
            </div>
        `;
        
        modalBody.innerHTML = certificateHTML;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    // Скачать сертификат
    downloadCertificate() {
        // В реальном приложении здесь была бы генерация PDF
        this.showMessage('success', 'Функция скачивания в разработке. Вы можете сделать скриншот.');
    },

    // Поделиться сертификатом
    shareCertificate() {
        if (navigator.share) {
            navigator.share({
                title: 'Мой сертификат курса эмпатии',
                text: `Я прошел(а) курс «Эмпатия и поддержка в общении»!`,
                url: window.location.href
            });
        } else {
            this.showMessage('info', 'Скопируйте ссылку на эту страницу, чтобы поделиться.');
        }
    },

    // Печать сертификата
    printCertificate() {
        window.print();
    },

    // Показать сообщение
    showMessage(type, text) {
        // Создаем элемент сообщения
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${text}</span>
            <button class="message-close"><i class="fas fa-times"></i></button>
        `;
        
        // Добавляем в тело документа
        document.body.appendChild(message);
        
        // Анимация появления
        setTimeout(() => message.classList.add('show'), 10);
        
        // Закрытие сообщения
        const closeBtn = message.querySelector('.message-close');
        closeBtn.onclick = () => this.hideMessage(message);
        
        // Автоматическое закрытие
        setTimeout(() => this.hideMessage(message), 5000);
    },

    // Скрыть сообщение
    hideMessage(message) {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопки входа/регистрации
        document.getElementById('loginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForm(true);
            this.switchAuthTab('login');
        });
        
        document.getElementById('registerBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForm(true);
            this.switchAuthTab('register');
        });
        
        document.getElementById('promoRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForm(true);
            this.switchAuthTab('register');
        });
        
        // Выход
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Закрытие формы авторизации
        document.getElementById('closeAuth')?.addEventListener('click', () => {
            this.toggleAuthForm(false);
        });
        
        // Переключение вкладок авторизации
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });
        
        // Отправка формы входа
        document.getElementById('submitLogin')?.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorElement = document.getElementById('loginError');
            
            if (!email || !password) {
                errorElement.textContent = 'Заполните все поля';
                return;
            }
            
            errorElement.textContent = '';
            const result = await this.login(email, password);
            
            if (result.success) {
                this.toggleAuthForm(false);
            }
        });
        
        // Отправка формы регистрации
        document.getElementById('submitRegister')?.addEventListener('click', async () => {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirm').value;
            const errorElement = document.getElementById('registerError');
            
            const userData = { name, email, password, confirm };
            const result = await this.register(userData);
            
            if (result.success) {
                this.toggleAuthForm(false);
            }
        });
        
        // Enter в формах
        ['loginEmail', 'loginPassword', 'registerName', 'registerEmail', 'registerPassword', 'registerConfirm']
            .forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            if (id.startsWith('login')) {
                                document.getElementById('submitLogin').click();
                            } else {
                                document.getElementById('submitRegister').click();
                            }
                        }
                    });
                }
            });
    },

    // Переключение вкладок авторизации
    switchAuthTab(tabName) {
        // Активная вкладка
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Активная форма
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Form`);
        });
        
        // Очистка ошибок
        document.getElementById('loginError').textContent = '';
        document.getElementById('registerError').textContent = '';
        
        // Очистка полей при переключении
        if (tabName === 'login') {
            document.getElementById('loginEmail').focus();
        } else {
            document.getElementById('registerName').focus();
        }
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    },

    // Проверить авторизацию
    checkAuth() {
        return this.isAuthenticated;
    },

    // Обновить данные пользователя
    updateUser(updates) {
        if (!this.isAuthenticated) return false;
        
        this.currentUser = { ...this.currentUser, ...updates };
        this.saveUser(this.currentUser);
        this.updateUI();
        
        return true;
    }
};

// Стили для сообщений (добавить в CSS)
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .message.show {
        transform: translateX(0);
    }
    
    .message-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .message-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .message-info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    .message-warning {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
    }
    
    .message-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
    }
`;

document.head.appendChild(messageStyles);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Экспорт для использования в других файлах
window.Auth = Auth;
