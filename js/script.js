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
    initProfileDropdown(); // Инициализируем улучшенный dropdown
    
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
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `Прогресс: ${percent}%`;
    
    // Сертификат
    const certBtn = document.getElementById('certificateBtn');
    if (certBtn) {
        if (percent === 100) {
            certBtn.classList.remove('disabled');
            certBtn.onclick = showCertificate;
        } else {
            certBtn.classList.add('disabled');
            certBtn.onclick = function(e) {
                e.preventDefault();
                alert(`Завершите все модули! Прогресс: ${percent}%`);
            };
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
                submoduleItem.className = `submodule-item ${userProgress.currentSubmodule === submodule.id ? 'active' : ''}`;
                submoduleItem.innerHTML = `<h4>${submodule.title}</h4>`;
                
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
        resetBtn.addEventListener('click', resetProgress);
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

// Показать сертификат
function showCertificate() {
    const total = courseData.modules.length;
    const completed = userProgress.completedModules.length;
    
    if (completed < total) {
        alert(`Завершите все модули! Вы прошли ${completed} из ${total}.`);
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = '🎓 Ваш сертификат';
    modalBody.innerHTML = `
        <div class="certificate">
            <div class="certificate-content">
                <h1>СЕРТИФИКАТ</h1>
                <p>о прохождении курса</p>
                <h2>«Эмпатия и поддержка в общении»</h2>
                <p>Настоящим удостоверяется, что слушатель успешно освоил</p>
                <p>программу из 5 модулей и проявил компетенции в области</p>
                <p>эмпатического общения и психологической поддержки.</p>
                <div style="margin-top: 30px;">
                    <p>Дата выдачи: ${new Date().toLocaleDateString('ru-RU')}</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Все данные будут удалены.")) {
        userProgress = getDefaultProgress();
        
        // Сброс в данных курса
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        localStorage.removeItem('empathyCourseProgress');
        location.reload();
    }
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('empathyCourseTheme') || 'light';
    setTheme(savedTheme);
    
    // Настройка переключателей тем
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            localStorage.setItem('empathyCourseTheme', theme);
        });
        
        // Активный переключатель
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
}

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновление активных кнопок
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    console.log('Тема установлена:', theme);
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;

console.log("✅ Курс эмпатии загружен и готов к работе!");

// Добавляем CSS для улучшенного dropdown
const dropdownStyles = `
    .user-profile {
        position: relative;
    }
    
    .profile-dropdown {
        position: absolute;
        top: calc(100% + 5px);
        right: 0;
        width: 250px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        display: none;
    }
    
    .profile-dropdown::before {
        content: '';
        position: absolute;
        top: -8px;
        right: 15px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid white;
    }
    
    .dropdown-content {
        padding: 15px;
    }
    
    .user-details {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    
    .dropdown-content a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        color: #333;
        text-decoration: none;
        border-radius: 5px;
        transition: background 0.3s;
    }
    
    .dropdown-content a:hover {
        background: #f8f9fa;
    }
    
    .dropdown-content hr {
        border: none;
        border-top: 1px solid #eee;
        margin: 10px 0;
    }
`;

// Добавляем стили в документ
const styleElement = document.createElement('style');
styleElement.textContent = dropdownStyles;
document.head.appendChild(styleElement);

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
                    <h3>Зарегистрируйтесь для сохранения прогресса!</h3>
                    <p>Получите именной сертификат после прохождения курса</p>
                    <button id="promoRegister" class="btn-primary">Зарегистрироваться</button>
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
    
    // Добавляем обработчик для кнопки регистрации
    const promoRegisterBtn = document.getElementById('promoRegister');
    if (promoRegisterBtn) {
        promoRegisterBtn.addEventListener('click', () => {
            // Показываем окно авторизации
            const authArea = document.getElementById('authArea');
            if (authArea) {
                authArea.style.display = 'block';
                // Переключаем на вкладку регистрации
                const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
                if (registerTab) registerTab.click();
            }
        });
    }
}
