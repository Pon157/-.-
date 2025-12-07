// Система авторизации (только имя)
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
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
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
            if (dropdownUserEmail) dropdownUserEmail.textContent = '';
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (myProgressBtn) myProgressBtn.style.display = 'block';
            
            // Активируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.remove('disabled');
            }
            
            if (resetBtn) {
                resetBtn.onclick = () => this.resetProgress();
            }
        } else {
            // Гость
            if (userInfo) userInfo.textContent = 'Гость';
            if (dropdownUserName) dropdownUserName.textContent = 'Гость';
            if (dropdownUserEmail) dropdownUserEmail.textContent = '';
            
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (myProgressBtn) myProgressBtn.style.display = 'none';
            
            // Деактивируем кнопки
            if (certificateBtn) {
                certificateBtn.classList.add('disabled');
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

        // Проверяем прогресс
        const progress = window.userProgress || getDefaultProgress();
        const totalModules = courseData?.modules?.length || 5;
        const completedModules = progress?.completedModules?.length || 0;

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
        
        // Сертификат
        document.getElementById('certificateBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCertificate();
        });
        
        // Мой прогресс
        document.getElementById('myProgressBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProgress();
        });
    },

    // Показать прогресс
    showProgress() {
        if (!this.isAuthenticated) {
            this.showSimpleAuth();
            return;
        }

        const progress = window.userProgress || getDefaultProgress();
        const totalModules = courseData?.modules?.length || 5;
        const completedModules = progress?.completedModules?.length || 0;
        const totalSubmodules = courseData?.modules?.reduce((sum, module) => {
            return sum + (module.submodules ? module.submodules.length : 0);
        }, 0) || 0;
        const completedSubmodules = progress?.completedSubmodules?.length || 0;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '📊 Мой прогресс';
        
        const progressHTML = `
            <div class="progress-report">
                <div class="user-info-progress">
                    <div class="avatar-progress" style="background: ${this.currentUser.avatar?.color || '#3498db'}; 
                         width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                         color: white; font-weight: bold; font-size: 1.5rem;">
                        ${this.currentUser.avatar?.initials || this.currentUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3>${this.currentUser.name}</h3>
                        <p>Зарегистрирован: ${new Date(this.currentUser.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
                
                <div class="progress-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #3498db;">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-info">
                            <h4>${completedModules} / ${totalModules}</h4>
                            <p>Модулей завершено</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #2ecc71;">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="stat-info">
                            <h4>${completedSubmodules} / ${totalSubmodules}</h4>
                            <p>Заданий выполнено</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #f39c12;">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h4>${totalSubmodules > 0 ? Math.round((completedSubmodules / totalSubmodules) * 100) : 0}%</h4>
                            <p>Общий прогресс</p>
                        </div>
                    </div>
                </div>
                
                <div class="module-progress">
                    <h4>Прогресс по модулям:</h4>
                    ${courseData?.modules?.map(module => {
                        const submodulesCount = module.submodules?.length || 0;
                        const completedCount = progress?.completedSubmodules?.filter(id => id.startsWith(module.id + '.'))?.length || 0;
                        const percent = submodulesCount > 0 ? Math.round((completedCount / submodulesCount) * 100) : 0;
                        
                        return `
                            <div class="module-progress-item">
                                <div class="module-title">
                                    <span>${module.title}</span>
                                    <span>${completedCount}/${submodulesCount}</span>
                                </div>
                                <div class="progress-bar-small">
                                    <div class="progress-fill-small" style="width: ${percent}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('') || ''}
                </div>
            </div>
        `;
        
        modalBody.innerHTML = progressHTML;
        document.getElementById('modalOverlay').style.display = 'flex';
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

// =============================================
// СИСТЕМА ПРОГРЕССА
// =============================================

// Состояние прогресса - ОБЪЯВЛЯЕМ ТОЛЬКО ЗДЕСЬ!
let userProgress;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпатии загружается...");
    
    initTheme();
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    initProfileDropdown();
    
    // Инициализация авторизации
    Auth.init();
    
    // Открываем последний сохраненный модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    }
});

// Инициализация прогресса
function initProgress() {
    const saved = localStorage.getItem('empathyCourseProgress');
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка загрузки прогресса:", e);
            // Значения по умолчанию
            userProgress = getDefaultProgress();
        }
    } else {
        // Значения по умолчанию
        userProgress = getDefaultProgress();
    }
    console.log("Прогресс загружен:", userProgress);
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
}

// Обновление UI прогресса
function updateProgressUI() {
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
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) return;
    
    // Находим или создаем контейнер модулей
    let container = modulesList.querySelector('.modules-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'modules-container';
        
        // Вставляем перед прогрессом
        const progressContainer = modulesList.querySelector('.progress-container');
        if (progressContainer) {
            modulesList.insertBefore(container, progressContainer);
        } else {
            modulesList.appendChild(container);
        }
    }
    
    container.innerHTML = '';
    
    courseData.modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = `module-item ${userProgress.currentModule === module.id ? 'active' : ''}`;
        moduleItem.innerHTML = `
            <h3>${module.title}</h3>
            <p>${module.description}</p>
        `;
        
        moduleItem.addEventListener('click', () => {
            // Сброс активных классов
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            moduleItem.classList.add('active');
            
            // Открываем первый подмодуль
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
}

// Открытие модуля
function openModule(moduleId, submoduleId) {
    console.log("Открываем модуль:", moduleId, submoduleId);
    
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    saveProgress();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Модуль или подмодуль не найдены");
        return;
    }
    
    // Обновляем заголовки
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleSubtitle').textContent = submodule.title;
    
    // Скрываем тест, показываем контент
    document.getElementById('testArea').style.display = 'none';
    document.getElementById('contentDisplay').style.display = 'block';
    document.getElementById('moduleTabs').style.display = 'flex';
    
    // Рендерим вкладки
    renderTabs(submodule);
    
    // Обновляем список модулей
    renderModulesList();
}

// Рендеринг вкладок
function renderTabs(submodule) {
    const moduleTabs = document.getElementById('moduleTabs');
    const contentDisplay = document.getElementById('contentDisplay');
    
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
            // Активная вкладка
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            // Показываем контент
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
    console.log("Инициализация кнопок проверки...");
    
    // Удаляем старые обработчики
    const oldButtons = document.querySelectorAll('.check-btn');
    oldButtons.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Добавляем новые обработчики
    const buttons = document.querySelectorAll('.check-btn');
    buttons.forEach(button => {
        const submoduleId = button.getAttribute('data-submodule');
        if (submoduleId) {
            button.addEventListener('click', function() {
                checkAssignment(submoduleId);
            });
            console.log("Кнопка настроена для подмодуля:", submoduleId);
        }
    });
    
    console.log("Настроено кнопок:", buttons.length);
}

// ПРОВЕРКА ЗАДАНИЯ
function checkAssignment(submoduleId) {
    console.log("=== НАЧАЛО ПРОВЕРКИ ===");
    console.log("Подмодуль для проверки:", submoduleId);
    
    // Находим текущий модуль
    const moduleId = userProgress.currentModule;
    console.log("Текущий модуль:", moduleId);
    
    // Находим модуль
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) {
        console.error("Модуль не найден:", moduleId);
        return;
    }
    
    console.log("Найден модуль:", module.title);
    
    // Находим подмодуль
    const submodule = module.submodules.find(s => s.id === submoduleId);
    if (!submodule) {
        console.error("Подмодуль не найден:", submoduleId);
        return;
    }
    
    console.log("Найден подмодуль:", submodule.title);
    
    // Проверяем, есть ли задание
    if (!submodule.tabs || !submodule.tabs.assignment) {
        console.error("У подмодуля нет задания:", submoduleId);
        return;
    }
    
    console.log("Задание найдено");
    
    // ID элементов
    const answerId = 'answer' + submoduleId.replace('.', '_');
    const feedbackId = 'feedback' + submoduleId.replace('.', '_');
    
    console.log("Ищем элементы:", answerId, feedbackId);
    
    const answerElement = document.getElementById(answerId);
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!answerElement) {
        console.error("Не найден textarea с id:", answerId);
        return;
    }
    
    if (!feedbackElement) {
        console.error("Не найден feedback с id:", feedbackId);
        return;
    }
    
    console.log("Элементы найдены!");
    
    const answer = answerElement.value.trim();
    
    if (!answer) {
        feedbackElement.textContent = "Пожалуйста, напишите ответ перед проверкой.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
        return;
    }
    
    console.log("Ответ пользователя:", answer.substring(0, 50) + "...");
    
    try {
        // Вызываем функцию проверки из данных
        const result = submodule.tabs.assignment.check(answer);
        
        console.log("Результат проверки:", result);
        
        feedbackElement.textContent = result.message;
        feedbackElement.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
        feedbackElement.style.display = "block";
        
        // Если задание выполнено правильно
        if (result.correct) {
            if (!userProgress.completedSubmodules.includes(submoduleId)) {
                userProgress.completedSubmodules.push(submoduleId);
                saveProgress();
                
                // Добавляем галочку к заголовку задания
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
        console.error("Ошибка при проверке задания:", error);
        feedbackElement.textContent = "Произошла ошибка при проверке. Попробуйте еще раз.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
    }
    
    console.log("=== КОНЕЦ ПРОВЕРКИ ===");
}

// Открытие теста
function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    // Показываем тест, скрываем контент
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    // Заполняем тест
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
    // Вопросы
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
    
    // Практическое задание
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
        }, 50); // Небольшая задержка для плавности
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
        }, 300); // Задержка перед скрытием
    }
    
    // Показываем dropdown при наведении на профиль
    userProfile.addEventListener('mouseenter', showDropdown);
    
    // Показываем dropdown при наведении на сам dropdown
    profileDropdown.addEventListener('mouseenter', showDropdown);
    
    // Скрываем dropdown при уходе с профиля или dropdown
    userProfile.addEventListener('mouseleave', (e) => {
        // Проверяем, что курсор действительно ушел за пределы обоих элементов
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
    
    profileDropdown.addEventListener('mouseleave', (e) => {
        // Проверяем, что курсор действительно ушел за пределы обоих элементов
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
    
    // Добавляем стрелку-указатель к dropdown (опционально)
    if (!profileDropdown.querySelector('.dropdown-arrow')) {
        const arrow = document.createElement('div');
        arrow.className = 'dropdown-arrow';
        arrow.style.cssText = `
            position: absolute;
            top: -8px;
            right: 15px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid white;
        `;
        profileDropdown.prepend(arrow);
    }
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
}

// Отправка теста
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.questions.length;
    
    // Проверяем вопросы
    module.test.questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && parseInt(selected.value) === question.correct) {
            score++;
        }
    });
    
    // Практическое задание
    let practicalPassed = false;
    if (module.test.practical) {
        const answer = document.getElementById('practicalAnswer')?.value || '';
        practicalPassed = module.test.practical.check(answer);
    }
    
    const percent = Math.round((score / totalQuestions) * 100);
    const passed = percent >= 70 && (module.test.practical ? practicalPassed : true);
    
    // Показываем результат
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
    
    // Сохраняем результат
    if (passed && !userProgress.completedModules.includes(moduleId)) {
        userProgress.completedModules.push(moduleId);
        module.completed = true;
        saveProgress();
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
    console.log('Тема установлена:', theme);
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.Auth = Auth;
window.showWelcomeScreen = showWelcomeScreen;

console.log("✅ Курс эмпатии загружен и готов к работе!");

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
        </div>
    `;
    
    // Добавляем обработчик для кнопки
    const promoRegisterBtn = document.getElementById('promoRegister');
    if (promoRegisterBtn) {
        promoRegisterBtn.addEventListener('click', () => {
            Auth.showSimpleAuth();
        });
    }
}

// Если нет текущего модуля, показываем приветственный экран
if (!userProgress.currentModule) {
    showWelcomeScreen();
}
