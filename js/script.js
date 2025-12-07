// =============================================
// СИСТЕМА ПРОГРЕССА И МОДУЛЕЙ
// =============================================

// Состояние прогресса
let userProgress;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпатии загружается...");
    console.log("courseData доступен?", typeof courseData !== 'undefined');
    
    if (typeof courseData !== 'undefined') {
        console.log("✅ courseData загружен, модулей:", courseData.modules.length);
        initApp();
    } else {
        console.error("❌ courseData не загружен! Проверьте порядок скриптов.");
        // Показываем сообщение об ошибке
        showErrorScreen();
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
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        console.log("Открываем сохраненный модуль:", userProgress.currentModule, userProgress.currentSubmodule);
        // Открываем последний сохраненный модуль
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    } else {
        console.log("Нет сохраненного прогресса, показываем приветственный экран");
        // Показываем приветственный экран
        setTimeout(() => {
            showWelcomeScreen();
        }, 100);
    }
    
    console.log("Приложение инициализировано");
}

// Показать экран ошибки
function showErrorScreen() {
    const contentDisplay = document.getElementById('contentDisplay');
    if (contentDisplay) {
        contentDisplay.innerHTML = `
            <div class="error-screen">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h1>Ошибка загрузки курса</h1>
                <p>Не удалось загрузить данные курса. Пожалуйста:</p>
                <ol>
                    <li>Проверьте подключение к интернету</li>
                    <li>Обновите страницу (F5)</li>
                    <li>Если проблема повторяется, свяжитесь с поддержкой</li>
                </ol>
                <button class="btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Обновить страницу
                </button>
            </div>
        `;
    }
}
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
            if (window.Auth && window.Auth.checkAuth()) {
                window.Auth.resetProgress();
            } else {
                if (window.Auth) window.Auth.showSimpleAuth();
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
    
  // Показать сертификат
showCertificate() {
    if (!this.isAuthenticated) {
        this.showSimpleAuth();
        return;
    }

    // Проверяем прогресс через глобальные переменные или localStorage
    let userProgress;
    const savedProgress = localStorage.getItem('empathyCourseProgress');
    
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
        } catch (e) {
            console.error("Ошибка парсинга прогресса:", e);
            this.showMessage('error', 'Ошибка загрузки прогресса');
            return;
        }
    } else {
        userProgress = {
            completedModules: [],
            completedSubmodules: []
        };
    }

    // Получаем данные курса
    let courseData = window.courseData;
    if (!courseData) {
        // Если нет в глобальной переменной, пытаемся получить из localStorage
        const savedCourse = localStorage.getItem('empathyCourseData');
        if (savedCourse) {
            try {
                courseData = JSON.parse(savedCourse);
            } catch (e) {
                console.error("Ошибка парсинга данных курса:", e);
            }
        }
    }

    if (!courseData) {
        this.showMessage('error', 'Не удалось загрузить данные курса');
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
    
    // Кнопка "Мой прогресс"
    document.getElementById('myProgressBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.Auth && window.Auth.showProgress) {
            window.Auth.showProgress();
        }
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

// Сброс прогресса (старая функция для обратной совместимости)
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
            if (window.Auth) {
                window.Auth.showSimpleAuth();
            }
        });
    }
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.showWelcomeScreen = showWelcomeScreen;
window.getDefaultProgress = getDefaultProgress;
window.updateProgressUI = updateProgressUI;
window.renderModulesList = renderModulesList;
window.resetProgress = resetProgress;

console.log("✅ Курс эмпатии загружен и готов к работе!");
