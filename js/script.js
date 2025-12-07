// =============================================
// СИСТЕМА АВТОРИЗАЦИИ (УПРОЩЕННАЯ - ТОЛЬКО ИМЯ)
// =============================================

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
        this.currentUser = this.getUser();
        this.isAuthenticated = !!this.currentUser;
        console.log('Пользователь загружен:', this.currentUser);
    },

    // Получить пользователя
    getUser() {
        const userJson = localStorage.getItem('empathy_course_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    // Сохранить пользователя
    saveUser(user) {
        localStorage.setItem('empathy_course_user', JSON.stringify(user));
    },

    // Удалить пользователя
    removeUser() {
        localStorage.removeItem('empathy_course_user');
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

    // Выход
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.removeUser();
        
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

    // Обновление UI
    updateUI() {
        const userInfo = document.getElementById('userName');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const certificateBtn = document.getElementById('certificateBtn');
        const resetBtn = document.getElementById('resetBtn');
        const myProgressBtn = document.getElementById('myProgressBtn');

        if (this.isAuthenticated && this.currentUser) {
            // Пользователь авторизован
            if (userInfo) userInfo.textContent = this.currentUser.name;
            if (dropdownUserName) dropdownUserName.textContent = this.currentUser.name;
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (myProgressBtn) myProgressBtn.style.display = 'block';
            
            // Активируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.remove('disabled');
            }
        } else {
            // Гость
            if (userInfo) userInfo.textContent = 'Гость';
            if (dropdownUserName) dropdownUserName.textContent = 'Гость';
            
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (myProgressBtn) myProgressBtn.style.display = 'none';
            
            // Деактивируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.add('disabled');
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

        // Проверяем прогресс
        if (!window.userProgress || !window.courseData) {
            this.showMessage('error', 'Не удалось загрузить данные прогресса');
            return;
        }

        const totalModules = window.courseData.modules.length;
        const completedModules = window.userProgress.completedModules.length;

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
        localStorage.removeItem('empathyCourseProgress');
        
        // Сброс переменной
        if (window.userProgress) {
            window.userProgress = getDefaultProgress();
        }
        
        // Обновление UI
        this.updateUI();
        
        // Закрытие модального окна
        document.getElementById('modalOverlay').style.display = 'none';
        
        // Показ сообщения
        this.showMessage('success', 'Прогресс успешно сброшен!');
        
        // Обновление прогресса в сайдбаре
        if (window.updateProgressUI) {
            window.updateProgressUI();
        }
        
        // Обновление списка модулей
        if (window.renderModulesList) {
            window.renderModulesList();
        }
        
        // Показ экрана приветствия
        if (window.showWelcomeScreen) {
            window.showWelcomeScreen();
        }
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

// =============================================
// СИСТЕМА ПРОГРЕССА И МОДУЛЕЙ
// =============================================

// Состояние прогресса
let userProgress;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпетии загружается...");
    
    // Ждем загрузки данных курса
    if (typeof courseData === 'undefined') {
        console.error("courseData не загружен! Проверьте порядок загрузки скриптов.");
        // Ждем немного и пробуем снова
        setTimeout(initApp, 100);
    } else {
        initApp();
    }
});

function initApp() {
    console.log("Инициализация приложения...");
    
    // Инициализируем в правильном порядке
    initTheme();
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    initProfileDropdown();
    
    // Проверяем состояние и показываем соответствующий контент
    if (userProgress.currentModule && userProgress.currentSubmodule && courseData) {
        console.log("Открываем сохраненный модуль:", userProgress.currentModule, userProgress.currentSubmodule);
        // Открываем последний сохраненный модуль
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    } else {
        console.log("Нет сохраненного прогресса или данных курса");
        // Показываем приветственный экран
        setTimeout(() => {
            showWelcomeScreen();
        }, 100);
    }
    
    console.log("Приложение инициализировано");
}

// Инициализация прогресса
function initProgress() {
    console.log("Инициализация прогресса...");
    const saved = localStorage.getItem('empathyCourseProgress');
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
            console.log("Прогресс загружен:", userProgress);
        } catch (e) {
            console.error("Ошибка загрузки прогресса:", e);
            userProgress = getDefaultProgress();
        }
    } else {
        userProgress = getDefaultProgress();
        console.log("Создан новый прогресс:", userProgress);
    }
}

function getDefaultProgress() {
    return {
        currentModule: 1,
        currentSubmodule: "1.1",
        completedModules: [],
        completedSubmodules: [],
        testResults: {},
        assignmentResults: {}
    };
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
    updateProgressUI();
    console.log("Прогресс сохранен");
}

// Обновление UI прогресса
function updateProgressUI() {
    if (!courseData || !courseData.modules) {
        console.warn("courseData не загружен для обновления UI");
        return;
    }
    
    const totalSubmodules = courseData.modules.reduce((sum, module) => {
        return sum + (module.submodules ? module.submodules.length : 0);
    }, 0);
    
    const completed = userProgress.completedSubmodules.length;
    const percent = totalSubmodules > 0 ? Math.round((completed / totalSubmodules) * 100) : 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const certificateBtn = document.getElementById('certificateBtn');
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `Прогресс: ${percent}%`;
    
    // Обновляем сертификат
    if (certificateBtn) {
        const totalModules = courseData.modules.length;
        const completedModules = userProgress.completedModules.length;
        const allCompleted = completedModules >= totalModules;
        
        if (allCompleted) {
            certificateBtn.classList.remove('disabled');
            certificateBtn.title = "Получить сертификат";
        } else {
            certificateBtn.classList.add('disabled');
            certificateBtn.title = `Завершите все модули! ${completedModules}/${totalModules}`;
        }
    }
}

// Рендеринг списка модулей
function renderModulesList() {
    console.log("Рендеринг списка модулей...");
    
    if (!courseData || !courseData.modules) {
        console.error("courseData не загружен!");
        return;
    }
    
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) {
        console.error("modulesList не найден!");
        return;
    }
    
    // Очищаем старые модули
    const oldContainer = modulesList.querySelector('.modules-container');
    if (oldContainer) oldContainer.remove();
    
    // Создаем контейнер
    const container = document.createElement('div');
    container.className = 'modules-container';
    
    // Добавляем каждый модуль
    courseData.modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = `module-item ${userProgress.currentModule === module.id ? 'active' : ''}`;
        moduleItem.innerHTML = `
            <h3>${module.title}</h3>
            <p>${module.description}</p>
        `;
        
        moduleItem.addEventListener('click', () => {
            console.log("Клик по модулю:", module.id);
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            moduleItem.classList.add('active');
            
            if (module.submodules && module.submodules.length > 0) {
                openModule(module.id, module.submodules[0].id);
            }
        });
        
        container.appendChild(moduleItem);
        
        // Подмодули для активного модуля
        if (userProgress.currentModule === module.id && module.submodules) {
            module.submodules.forEach(submodule => {
                const submoduleItem = document.createElement('div');
                submoduleItem.className = `submodule-item ${userProgress.currentSubmodule === submodule.id ? 'active' : ''} ${userProgress.completedSubmodules.includes(submodule.id) ? 'completed' : ''}`;
                submoduleItem.innerHTML = `
                    <h4>${submodule.title}</h4>
                    ${userProgress.completedSubmodules.includes(submodule.id) ? '<i class="fas fa-check-circle"></i>' : ''}
                `;
                
                submoduleItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log("Клик по подмодулю:", submodule.id);
                    document.querySelectorAll('.submodule-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    submoduleItem.classList.add('active');
                    openModule(module.id, submodule.id);
                });
                
                container.appendChild(submoduleItem);
            });
        }
    });
    
    // Добавляем контейнер в сайдбар
    modulesList.insertBefore(container, modulesList.querySelector('.sidebar-footer'));
    
    console.log("Список модулей отрендерен");
}

// Открытие модуля
function openModule(moduleId, submoduleId) {
    console.log("Открываем модуль:", moduleId, submoduleId);
    
    if (!courseData || !courseData.modules) {
        console.error("courseData не загружен!");
        return;
    }
    
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    saveProgress();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module?.submodules?.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Модуль или подмодуль не найдены");
        return;
    }
    
    // Обновляем заголовки
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleSubtitle').textContent = submodule.title;
    
    // Скрываем тест и показываем контент
    document.getElementById('testArea').style.display = 'none';
    document.getElementById('contentDisplay').style.display = 'block';
    document.getElementById('moduleTabs').style.display = 'flex';
    
    // Скрываем экран приветствия если он виден
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Рендерим вкладки
    renderTabs(submodule);
    
    // Обновляем список модулей
    renderModulesList();
}

// Рендеринг вкладок
function renderTabs(submodule) {
    console.log("Рендеринг вкладок для:", submodule.title);
    
    const moduleTabs = document.getElementById('moduleTabs');
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!moduleTabs || !contentDisplay) return;
    
    moduleTabs.innerHTML = '';
    contentDisplay.innerHTML = '';
    
    if (!submodule.tabs) {
        contentDisplay.innerHTML = '<p>Нет контента для этого подмодуля</p>';
        return;
    }
    
    const tabNames = Object.keys(submodule.tabs);
    
    tabNames.forEach((tabName, index) => {
        const tab = document.createElement('div');
        tab.className = `tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = submodule.tabs[tabName].title;
        tab.dataset.tab = tabName;
        
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            showTabContent(tabName, submodule);
        });
        
        moduleTabs.appendChild(tab);
    });
    
    // Кнопка контрольной работы
    const module = courseData.modules.find(m => 
        m.submodules && m.submodules.some(s => s.id === submodule.id)
    );
    
    if (module && module.test) {
        const testTab = document.createElement('div');
        testTab.className = 'tab';
        testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Контрольная';
        testTab.addEventListener('click', () => openTest(module.id));
        moduleTabs.appendChild(testTab);
    }
    
    // Показываем первую вкладку
    if (tabNames.length > 0) {
        showTabContent(tabNames[0], submodule);
    }
}

// Показ контента вкладки
function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!submodule.tabs[tabName]) {
        contentDisplay.innerHTML = '<p>Контент не найден</p>';
        return;
    }
    
    contentDisplay.innerHTML = `
        <div class="tab-content active">
            <h3>${submodule.tabs[tabName].title}</h3>
            ${submodule.tabs[tabName].content || '<p>Контент отсутствует</p>'}
        </div>
    `;
    
    // Инициализируем кнопки проверки заданий
    initCheckButtons();
}

// Инициализация кнопок проверки
function initCheckButtons() {
    const buttons = document.querySelectorAll('.check-btn');
    buttons.forEach(button => {
        const submoduleId = button.getAttribute('data-submodule');
        if (submoduleId) {
            button.addEventListener('click', function() {
                checkAssignment(submoduleId);
            });
        }
    });
}

// ПРОВЕРКА ЗАДАНИЯ
function checkAssignment(submoduleId) {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module?.submodules?.find(s => s.id === submoduleId);
    
    if (!module || !submodule) return;
    
    if (!submodule.tabs || !submodule.tabs.assignment) return;
    
    const answerId = 'answer' + submoduleId.replace('.', '_');
    const feedbackId = 'feedback' + submoduleId.replace('.', '_');
    
    const answerElement = document.getElementById(answerId);
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!answerElement || !feedbackElement) return;
    
    const answer = answerElement.value.trim();
    
    if (!answer) {
        feedbackElement.textContent = "Пожалуйста, напишите ответ перед проверкой.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
        return;
    }
    
    try {
        const result = submodule.tabs.assignment.check(answer);
        
        feedbackElement.textContent = result.message;
        feedbackElement.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
        feedbackElement.style.display = "block";
        
        if (result.correct) {
            if (!userProgress.completedSubmodules.includes(submoduleId)) {
                userProgress.completedSubmodules.push(submoduleId);
                saveProgress();
                
                const assignmentHeader = answerElement.closest('.assignment')?.querySelector('h4');
                if (assignmentHeader && !assignmentHeader.querySelector('.fa-check-circle')) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check-circle';
                    checkIcon.style.color = '#2ecc71';
                    checkIcon.style.marginLeft = '10px';
                    assignmentHeader.appendChild(checkIcon);
                }
            }
        }
        
    } catch (error) {
        feedbackElement.textContent = "Произошла ошибка при проверке. Попробуйте еще раз.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
    }
}

// Открытие теста
function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
    if (module.test.questions) {
        module.test.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'test-question';
            questionDiv.innerHTML = `
                <h4>Вопрос ${index + 1}: ${question.question}</h4>
                ${question.options.map((option, i) => `
                    <label>
                        <input type="radio" name="question${index}" value="${i}">
                        ${option}
                    </label>
                `).join('')}
            `;
            testContent.appendChild(questionDiv);
        });
    }
    
    if (module.test.practical) {
        const practicalDiv = document.createElement('div');
        practicalDiv.className = 'test-question';
        practicalDiv.innerHTML = `
            <h4>Практическое задание</h4>
            <p>${module.test.practical.task}</p>
            <textarea id="practicalAnswer" placeholder="Напишите ваш ответ..." rows="5"></textarea>
        `;
        testContent.appendChild(practicalDiv);
    }
}

// Улучшение работы dropdown меню профиля
function initProfileDropdown() {
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!userProfile || !profileDropdown) return;
    
    let hideTimeout;
    let showTimeout;
    let isDropdownOpen = false;
    
    function showDropdown() {
        clearTimeout(hideTimeout);
        clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            profileDropdown.style.opacity = '1';
            profileDropdown.style.visibility = 'visible';
            profileDropdown.style.transform = 'translateY(0)';
            profileDropdown.style.display = 'block';
            isDropdownOpen = true;
        }, 50);
    }
    
    function hideDropdown() {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => {
            if (!isDropdownOpen) return;
            profileDropdown.style.opacity = '0';
            profileDropdown.style.visibility = 'hidden';
            profileDropdown.style.transform = 'translateY(-10px)';
            profileDropdown.style.display = 'none';
            isDropdownOpen = false;
        }, 300);
    }
    
    userProfile.addEventListener('mouseenter', showDropdown);
    profileDropdown.addEventListener('mouseenter', showDropdown);
    
    userProfile.addEventListener('mouseleave', (e) => {
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
    
    profileDropdown.addEventListener('mouseleave', (e) => {
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка отправки теста
    const submitBtn = document.getElementById('submitTestBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitTest);
    }
    
    // Кнопка закрытия теста
    const closeTestBtn = document.getElementById('closeTestBtn');
    if (closeTestBtn) {
        closeTestBtn.addEventListener('click', () => {
            document.getElementById('testArea').style.display = 'none';
            document.getElementById('contentDisplay').style.display = 'block';
            document.getElementById('moduleTabs').style.display = 'flex';
        });
    }
    
    // Кнопка сброса прогресса
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (Auth.checkAuth()) {
                Auth.resetProgress();
            } else {
                Auth.showSimpleAuth();
            }
        });
    }
    
    // Модальное окно
    const closeModal = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOk = document.getElementById('modalOkBtn');
    
    if (closeModal) closeModal.onclick = () => modalOverlay.style.display = 'none';
    if (modalOverlay) modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    };
    if (modalOk) modalOk.onclick = () => modalOverlay.style.display = 'none';
    
    // Закрытие формы авторизации
    document.getElementById('closeAuth')?.addEventListener('click', () => {
        document.getElementById('authArea').style.display = 'none';
    });
    
    // Кнопка сертификата
    document.getElementById('certificateBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.showCertificate();
    });
}

// Отправка теста
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.questions.length;
    
    module.test.questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && parseInt(selected.value) === question.correct) {
            score++;
        }
    });
    
    let practicalPassed = false;
    if (module.test.practical) {
        const answer = document.getElementById('practicalAnswer')?.value || '';
        practicalPassed = module.test.practical.check(answer);
    }
    
    const percent = Math.round((score / totalQuestions) * 100);
    const passed = percent >= 70 && (module.test.practical ? practicalPassed : true);
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат теста';
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>${passed ? '✅ Поздравляем!' : '❌ Попробуйте еще'}</h3>
            <p>Теоретическая часть: ${score} из ${totalQuestions} (${percent}%)</p>
            ${module.test.practical ? `<p>Практика: ${practicalPassed ? '✅ Зачтено' : '❌ Не зачтено'}</p>` : ''}
            <p><strong>${passed ? 'Тест пройден!' : 'Нужно набрать минимум 70%'}</strong></p>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    if (passed && !userProgress.completedModules.includes(moduleId)) {
        userProgress.completedModules.push(moduleId);
        module.completed = true;
        saveProgress();
    }
}

// Показать сертификат (глобальная функция)
function showCertificate() {
    Auth.showCertificate();
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Все данные будут удалены.")) {
        userProgress = getDefaultProgress();
        
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        localStorage.removeItem('empathyCourseProgress');
        location.reload();
    }
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('empathyCourseTheme') || 'dark';
    setTheme(savedTheme);
}

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Показать приветственный экран
function showWelcomeScreen() {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = `
        <div class="welcome-screen">
            <div class="welcome-icon">
                <i class="fas fa-hands-helping"></i>
            </div>
            <h1>Полный курс: «Эмпатия и поддержка в общении»</h1>
            <p>Развивайте эмоциональный интеллект, учитесь слушать и поддерживать других.</p>
            
            <div class="auth-promo">
                <div class="auth-promo-content">
                    <i class="fas fa-user-check"></i>
                    <h3>Введите ваше имя для сохранения прогресса!</h3>
                    <p>Получите именной сертификат после прохождения курса</p>
                    <button id="promoRegister" class="btn-primary">Начать обучение</button>
                </div>
            </div>
            
            <div class="features">
                <div class="feature">
                    <i class="fas fa-book-open"></i>
                    <h3>5 модулей</h3>
                    <p>Теория, цитаты, практические задания</p>
                </div>
                <div class="feature">
                    <i class="fas fa-check-circle"></i>
                    <h3>Контрольные работы</h3>
                    <p>Тесты и практика после каждого модуля</p>
                </div>
                <div class="feature">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Именной сертификат</h3>
                    <p>Получите сертификат с вашим именем</p>
                </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
                <p style="color: #aaa; font-style: italic;">Или выберите модуль в левой панели для продолжения</p>
            </div>
        </div>
    `;
    
    const promoRegisterBtn = document.getElementById('promoRegister');
    if (promoRegisterBtn) {
        promoRegisterBtn.addEventListener('click', () => {
            Auth.showSimpleAuth();
        });
    }
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.Auth = Auth;
window.showWelcomeScreen = showWelcomeScreen;
window.getDefaultProgress = getDefaultProgress;
window.updateProgressUI = updateProgressUI;
window.renderModulesList = renderModulesList;

console.log("✅ Курс эмпатии загружен и готов к работе!");
