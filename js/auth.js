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

    // Вход (упрощенный - просто используем регистрацию)
    login(name) {
        return this.registerSimple(name);
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
            if (userInfo) {
                userInfo.textContent = this.currentUser.name;
                // Добавляем аватар, если его нет
                if (!userInfo.querySelector('.user-avatar')) {
                    const avatar = document.createElement('div');
                    avatar.className = 'user-avatar';
                    avatar.style.cssText = `
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: ${this.currentUser.avatar?.color || '#3498db'};
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        margin-right: 10px;
                    `;
                    avatar.textContent = this.currentUser.avatar?.initials || this.currentUser.name.substring(0, 2).toUpperCase();
                    userInfo.insertBefore(avatar, userInfo.firstChild);
                }
            }
            
            if (dropdownUserName) dropdownUserName.textContent = this.currentUser.name;
            if (dropdownUserEmail) dropdownUserEmail.textContent = '';
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (myProgressBtn) myProgressBtn.style.display = 'block';
            
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
            if (userInfo) {
                userInfo.textContent = 'Гость';
                // Удаляем аватар если есть
                const avatar = userInfo.querySelector('.user-avatar');
                if (avatar) avatar.remove();
            }
            if (dropdownUserName) dropdownUserName.textContent = 'Гость';
            if (dropdownUserEmail) dropdownUserEmail.textContent = '';
            
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (myProgressBtn) myProgressBtn.style.display = 'none';
            
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
        
        // Обновляем обработчики событий
        this.setupDropdownEventListeners();
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
        const nameInput = document.getElementById('simpleUserName');
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitSimpleAuth();
                }
            });
            nameInput.focus();
        }
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
        if (name) {
            this.registerSimple(name);
        } else {
            this.showMessage('error', 'Пожалуйста, введите ваше имя');
            nameInput.focus();
        }
    },

    // Показать сертификат
    showCertificate() {
        if (!this.isAuthenticated) {
            this.showSimpleAuth();
            return;
        }

        // Проверяем прогресс через глобальную переменную
        const userProgress = window.userProgress;
        const courseData = window.courseData;
        
        if (!userProgress || !courseData) {
            this.showMessage('error', 'Не удалось загрузить данные прогресса');
            return;
        }

        const totalModules = courseData.modules.length;
        const completedModules = userProgress.completedModules.length;

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
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (!modalTitle || !modalBody || !modalOverlay) return;

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
                    <button class="btn-secondary" onclick="document.getElementById('modalOverlay').style.display='none'">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
                
                <p class="certificate-note">
                    <i class="fas fa-info-circle"></i>
                    Сертификат можно сохранить как PDF или изображение
                </p>
            </div>
        `;
        
        modalBody.innerHTML = certificateHTML;
        modalOverlay.style.display = 'flex';
    },

    // Скачать сертификат
    downloadCertificate() {
        // Простой способ для демо - открываем в новом окне для печати
        const certificateContent = document.getElementById('certificateContent');
        if (certificateContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Сертификат - ${this.currentUser.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .certificate { 
                                border: 20px solid #f8d7da; 
                                padding: 40px; 
                                text-align: center; 
                                max-width: 800px; 
                                margin: 0 auto;
                            }
                            h1 { color: #e74c3c; }
                            .certificate-name { 
                                background: #f8f9fa; 
                                padding: 20px; 
                                display: inline-block; 
                                border: 2px dashed #3498db;
                                font-size: 2.5rem;
                            }
                            @media print {
                                body { margin: 0; padding: 0; }
                                .certificate { border-width: 30px; }
                            }
                        </style>
                    </head>
                    <body>
                        ${certificateContent.outerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 1000);
                            }
                        <\/script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            this.showMessage('success', 'Функция скачивания в разработке. Вы можете сделать скриншот.');
        }
    },

    // Поделиться сертификатом
    shareCertificate() {
        if (navigator.share) {
            navigator.share({
                title: 'Мой сертификат курса эмпатии',
                text: `${this.currentUser.name} прошел(а) курс «Эмпатия и поддержка в общении»!`,
                url: window.location.href
            }).catch(error => {
                console.log('Ошибка при попытке поделиться:', error);
                this.showMessage('info', 'Скопируйте ссылку на эту страницу, чтобы поделиться.');
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
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (!modalTitle || !modalBody || !modalOverlay) return;

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
                
                <div class="reset-buttons" style="display: flex; gap: 15px; margin-top: 30px; justify-content: center;">
                    <button class="btn-secondary" onclick="Auth.performReset()" style="background: #e74c3c; color: white; border: none;">
                        <i class="fas fa-redo"></i> Сбросить всё
                    </button>
                    <button class="btn-primary" onclick="document.getElementById('modalOverlay').style.display='none'">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = confirmHTML;
        modalOverlay.style.display = 'flex';
    },

    // Выполнить сброс
    performReset() {
        if (!this.isAuthenticated) return;
        
        // Сброс прогресса
        localStorage.removeItem('empathyCourseProgress');
        
        // Сброс переменной если она существует
        if (window.userProgress) {
            window.userProgress = window.getDefaultProgress ? window.getDefaultProgress() : {
                currentModule: 1,
                currentSubmodule: "1.1",
                completedModules: [],
                completedSubmodules: [],
                testResults: {},
                assignmentResults: {}
            };
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

    // Показать прогресс
    showProgress() {
        if (!this.isAuthenticated) {
            this.showSimpleAuth();
            return;
        }

        const userProgress = window.userProgress;
        const courseData = window.courseData;
        
        if (!userProgress || !courseData) {
            this.showMessage('error', 'Не удалось загрузить данные прогресса');
            return;
        }

        const totalModules = courseData.modules.length;
        const completedModules = userProgress.completedModules.length;
        const totalSubmodules = courseData.modules.reduce((sum, module) => {
            return sum + (module.submodules ? module.submodules.length : 0);
        }, 0);
        const completedSubmodules = userProgress.completedSubmodules.length;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (!modalTitle || !modalBody || !modalOverlay) return;
        
        modalTitle.textContent = '📊 Мой прогресс';
        
        const progressHTML = `
            <div class="progress-report">
                <div class="user-info-progress" style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding: 20px; background: var(--card-bg); border-radius: 10px;">
                    <div class="avatar-progress" style="background: ${this.currentUser.avatar?.color || '#3498db'}; 
                         width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                         color: white; font-weight: bold; font-size: 1.5rem;">
                        ${this.currentUser.avatar?.initials || this.currentUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #ffffff;">${this.currentUser.name}</h3>
                        <p style="margin: 0; color: #cccccc;">Зарегистрирован: ${new Date(this.currentUser.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
                
                <div class="progress-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div class="stat-card" style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center;">
                        <div class="stat-icon" style="background: #3498db; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-info">
                            <h4 style="margin: 0 0 5px 0; color: #ffffff; font-size: 1.8rem;">${completedModules} / ${totalModules}</h4>
                            <p style="margin: 0; color: #cccccc;">Модулей завершено</p>
                        </div>
                    </div>
                    
                    <div class="stat-card" style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center;">
                        <div class="stat-icon" style="background: #2ecc71; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="stat-info">
                            <h4 style="margin: 0 0 5px 0; color: #ffffff; font-size: 1.8rem;">${completedSubmodules} / ${totalSubmodules}</h4>
                            <p style="margin: 0; color: #cccccc;">Заданий выполнено</p>
                        </div>
                    </div>
                    
                    <div class="stat-card" style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center;">
                        <div class="stat-icon" style="background: #f39c12; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h4 style="margin: 0 0 5px 0; color: #ffffff; font-size: 1.8rem;">${totalSubmodules > 0 ? Math.round((completedSubmodules / totalSubmodules) * 100) : 0}%</h4>
                            <p style="margin: 0; color: #cccccc;">Общий прогресс</p>
                        </div>
                    </div>
                </div>
                
                <div class="module-progress" style="background: var(--card-bg); padding: 20px; border-radius: 10px;">
                    <h4 style="margin: 0 0 20px 0; color: #ffffff;">Прогресс по модулям:</h4>
                    ${courseData.modules.map(module => {
                        const submodulesCount = module.submodules?.length || 0;
                        const completedCount = userProgress.completedSubmodules?.filter(id => id.startsWith(module.id + '.'))?.length || 0;
                        const percent = submodulesCount > 0 ? Math.round((completedCount / submodulesCount) * 100) : 0;
                        
                        return `
                            <div class="module-progress-item" style="margin-bottom: 15px;">
                                <div class="module-title" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: #cccccc;">${module.title}</span>
                                    <span style="color: #3498db; font-weight: bold;">${completedCount}/${submodulesCount}</span>
                                </div>
                                <div class="progress-bar-small" style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div class="progress-fill-small" style="height: 100%; background: ${percent === 100 ? '#2ecc71' : '#3498db'}; width: ${percent}%; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        modalBody.innerHTML = progressHTML;
        modalOverlay.style.display = 'flex';
    },

    // Настройка обработчиков событий dropdown
    setupDropdownEventListeners() {
        const userInfo = document.getElementById('userInfo');
        const profileDropdown = document.getElementById('profileDropdown');
        
        if (!userInfo || !profileDropdown) return;
        
        // Закрываем все предыдущие обработчики
        userInfo.replaceWith(userInfo.cloneNode(true));
        profileDropdown.replaceWith(profileDropdown.cloneNode(true));
        
        // Получаем новые элементы
        const newUserInfo = document.getElementById('userInfo');
        const newProfileDropdown = document.getElementById('profileDropdown');
        
        let hideTimeout;
        let showTimeout;
        let isDropdownOpen = false;
        
        function showDropdown() {
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            showTimeout = setTimeout(() => {
                newProfileDropdown.style.opacity = '1';
                newProfileDropdown.style.visibility = 'visible';
                newProfileDropdown.style.transform = 'translateY(0)';
                newProfileDropdown.classList.add('show');
                isDropdownOpen = true;
            }, 50);
        }
        
        function hideDropdown() {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                if (!isDropdownOpen) return;
                newProfileDropdown.style.opacity = '0';
                newProfileDropdown.style.visibility = 'hidden';
                newProfileDropdown.style.transform = 'translateY(-10px)';
                newProfileDropdown.classList.remove('show');
                isDropdownOpen = false;
            }, 300);
        }
        
        // Показываем dropdown при наведении на профиль
        newUserInfo.addEventListener('mouseenter', showDropdown);
        
        // Показываем dropdown при наведении на сам dropdown
        newProfileDropdown.addEventListener('mouseenter', showDropdown);
        
        // Скрываем dropdown при уходе с профиля или dropdown
        newUserInfo.addEventListener('mouseleave', (e) => {
            const relatedTarget = e.relatedTarget;
            if (!newProfileDropdown.contains(relatedTarget) && !newUserInfo.contains(relatedTarget)) {
                hideDropdown();
            }
        });
        
        newProfileDropdown.addEventListener('mouseleave', (e) => {
            const relatedTarget = e.relatedTarget;
            if (!newProfileDropdown.contains(relatedTarget) && !newUserInfo.contains(relatedTarget)) {
                hideDropdown();
            }
        });
        
        // Клик для мобильных устройств
        newUserInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDropdownOpen) {
                hideDropdown();
            } else {
                showDropdown();
            }
        });
    },

    // Настройка глобальных обработчиков событий
    setupEventListeners() {
        // Клик по профилю
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });
        }

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
        
        // Добавляем стили если их нет
        if (!document.querySelector('#message-styles')) {
            const messageStyles = document.createElement('style');
            messageStyles.id = 'message-styles';
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
                    background: white;
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
        }
        
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

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    },

    // Проверить авторизацию
    checkAuth() {
        return this.isAuthenticated;
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Экспорт для использования в других файлах
window.Auth = Auth;
