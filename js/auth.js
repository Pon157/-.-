// Упрощенная система авторизации (только имя)

const Auth = {
    currentUser: null,
    isAuthenticated: false,

    // Инициализация
    init() {
        this.loadUser();
        this.setupEventListeners();
        this.updateUI();
        
        // Если пользователь не зарегистрирован, показываем простую форму
        if (!this.isAuthenticated) {
            setTimeout(() => this.showSimpleAuth(), 1000);
        }
    },

    // Загрузка пользователя из хранилища
    loadUser() {
        this.currentUser = Storage.getUser();
        this.isAuthenticated = !!this.currentUser;
        console.log('Пользователь загружен:', this.currentUser);
    },

    // Простая регистрация (только имя)
    async registerSimple(name) {
        try {
            if (!name || name.trim().length < 2) {
                throw new Error('Введите имя (минимум 2 символа)');
            }

            // Создание пользователя
            const user = {
                id: this.generateId(),
                name: name.trim(),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: 'student',
                avatar: this.generateAvatar(name)
            };

            // Сохранение
            this.saveUser(user);
            this.currentUser = user;
            this.isAuthenticated = true;

            // Обновление UI
            this.updateUI();
            this.showMessage('success', `Добро пожаловать, ${user.name}!`);
            
            // Скрываем форму
            this.hideSimpleAuth();

            return { success: true, user };
        } catch (error) {
            this.showMessage('error', error.message);
            return { success: false, error: error.message };
        }
    },

    // Вход (упрощенный)
    login(name) {
        return this.registerSimple(name); // Для простоты используем ту же функцию
    },

    // Выход
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        Storage.removeUser();
        
        // Обновление UI
        this.updateUI();
        this.showMessage('info', 'Вы вышли из системы');
        
        // Показываем форму ввода имени
        setTimeout(() => this.showSimpleAuth(), 500);
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

    // Сохранить пользователя
    saveUser(user) {
        localStorage.setItem('empathy_course_user', JSON.stringify(user));
    },

    // Обновление UI
    updateUI() {
        const userInfo = document.getElementById('userName');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const certificateBtn = document.getElementById('certificateBtn');
        const resetBtn = document.getElementById('resetBtn');

        if (this.isAuthenticated && this.currentUser) {
            // Пользователь авторизован
            if (userInfo) userInfo.textContent = this.currentUser.name;
            if (dropdownUserName) dropdownUserName.textContent = this.currentUser.name;
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            
            // Активируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.remove('disabled');
                certificateBtn.onclick = () => this.showCertificate();
            }
            
            if (resetBtn) {
                resetBtn.onclick = () => this.resetProgress();
            }
        } else {
            // Гость
            if (userInfo) userInfo.textContent = 'Гость';
            if (dropdownUserName) dropdownUserName.textContent = 'Гость';
            
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            
            // Деактивируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.add('disabled');
                certificateBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showSimpleAuth();
                };
            }
            
            if (resetBtn) {
                resetBtn.onclick = () => {
                    this.showMessage('info', 'Войдите, чтобы управлять прогрессом');
                };
            }
        }
    },

    // Показать упрощенную форму авторизации
    showSimpleAuth() {
        if (this.isAuthenticated) return;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (!modalTitle || !modalBody || !modalOverlay) return;
        
        modalTitle.textContent = 'Введите ваше имя';
        
        const authHTML = `
            <div class="auth-form-simple">
                <div class="welcome-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h3>Как вас зовут?</h3>
                <p>Введите ваше имя для персонализации курса и получения сертификата</p>
                
                <div class="name-input-container">
                    <input type="text" id="simpleUserName" placeholder="Например: Алексей" maxlength="50" autofocus>
                </div>
                
                <div class="auth-buttons">
                    <button class="btn-primary" onclick="Auth.submitSimpleAuth()">
                        <i class="fas fa-check"></i> Продолжить
                    </button>
                    <button class="btn-secondary" onclick="Auth.hideSimpleAuth()">
                        <i class="fas fa-times"></i> Позже
                    </button>
                </div>
                
                <p class="auth-note">
                    <i class="fas fa-info-circle"></i>
                    Ваше имя будет отображаться в сертификате после завершения курса
                </p>
            </div>
        `;
        
        modalBody.innerHTML = authHTML;
        modalOverlay.style.display = 'flex';
        
        // Настройка Enter для отправки
        document.getElementById('simpleUserName')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitSimpleAuth();
            }
        });
    },

    // Скрыть упрощенную форму
    hideSimpleAuth() {
        document.getElementById('modalOverlay').style.display = 'none';
    },

    // Отправить упрощенную форму
    submitSimpleAuth() {
        const nameInput = document.getElementById('simpleUserName');
        if (!nameInput) return;
        
        const name = nameInput.value.trim();
        this.registerSimple(name);
    },

    // Показать сертификат
    showCertificate() {
        if (!this.isAuthenticated) {
            this.showSimpleAuth();
            return;
        }

        const progress = Storage.getProgress();
        const totalModules = courseData?.modules?.length || 5;
        const completedModules = progress?.completedModules?.length || 0;

        if (completedModules < totalModules) {
            this.showMessage('warning', `Завершите все модули! Вы прошли ${completedModules} из ${totalModules}.`);
            return;
        }

        // Генерация именного сертификата
        this.generateCertificate();
    },

    // Сбросить прогресс
    resetProgress() {
        if (!this.isAuthenticated) {
            this.showSimpleAuth();
            return;
        }

        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modalTitle || !modalBody) return;

        modalTitle.textContent = 'Сброс прогресса';
        
        const confirmHTML = `
            <div class="confirm-reset">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h3>Вы уверены?</h3>
                <p>Это действие сбросит весь ваш прогресс:</p>
                <ul style="text-align: left; margin: 20px 0;">
                    <li>Завершенные модули</li>
                    <li>Результаты тестов</li>
                    <li>Выполненные задания</li>
                </ul>
                <p style="color: #e74c3c;">Действие нельзя отменить!</p>
                
                <div class="reset-buttons" style="display: flex; gap: 15px; margin-top: 30px;">
                    <button class="btn-secondary" onclick="Auth.performReset()" style="background: #e74c3c;">
                        <i class="fas fa-redo"></i> Сбросить всё
                    </button>
                    <button class="btn-primary" onclick="document.getElementById('modalOverlay').style.display='none'">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = confirmHTML;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    // Выполнить сброс
    performReset() {
        if (!this.isAuthenticated) return;
        
        // Сброс прогресса в Storage
        Storage.resetProgress();
        
        // Обновление UI
        this.updateUI();
        
        // Закрытие модального окна
        document.getElementById('modalOverlay').style.display = 'none';
        
        // Показ сообщения
        this.showMessage('success', 'Прогресс успешно сброшен!');
        
        // Обновление прогресса в сайдбаре
        if (window.updateProgressBar) {
            window.updateProgressBar();
        }
        
        // Перезагрузка текущего модуля
        if (window.loadCurrentModule) {
            window.loadCurrentModule();
        }
    },

    // Генерация сертификата (оставляем без изменений)
    generateCertificate() {
        // ... существующий код ...
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Клик по профилю для показа dropdown
        document.getElementById('userInfo')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });

        // Закрытие dropdown при клике снаружи
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('profileDropdown');
            const userInfo = document.getElementById('userInfo');
            
            if (dropdown && !dropdown.contains(e.target) && !userInfo.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Вход (упрощенный)
        document.getElementById('loginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSimpleAuth();
        });
        
        // Регистрация (упрощенная)
        document.getElementById('registerBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSimpleAuth();
        });
        
        document.getElementById('promoRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSimpleAuth();
        });
        
        // Выход
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Закрытие формы авторизации
        document.getElementById('closeAuth')?.addEventListener('click', () => {
            document.getElementById('authArea').style.display = 'none';
        });
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    },

    // Проверить авторизацию
    checkAuth() {
        return this.isAuthenticated;
    }
};

// Стили для сообщений
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    /* ... существующие стили ... */
`;

document.head.appendChild(messageStyles);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Экспорт для использования в других файлах
window.Auth = Auth;
