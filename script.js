// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Документ загружен, инициализируем...");
    
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    
    // Если есть сохраненный прогресс, открываем последний модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        console.log("Открываем сохраненный модуль:", userProgress.currentModule);
        // Небольшая задержка для гарантии, что DOM готов
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    } else {
        // Показываем приветственный экран
        showWelcomeScreen();
    }
});

// Показать приветственный экран
function showWelcomeScreen() {
    const contentDisplay = document.getElementById('contentDisplay');
    const moduleTabs = document.getElementById('moduleTabs');
    const testArea = document.getElementById('testArea');
    
    if (contentDisplay) contentDisplay.style.display = 'block';
    if (moduleTabs) moduleTabs.style.display = 'none';
    if (testArea) testArea.style.display = 'none';
    
    document.getElementById('moduleTitle').textContent = 'Добро пожаловать на курс';
    document.getElementById('moduleSubtitle').textContent = '«Эмпатия и поддержка в общении»';
    
    const welcomeHTML = `
        <div class="welcome-screen">
            <div class="welcome-icon">
                <i class="fas fa-hands-helping"></i>
            </div>
            <h1>Полный курс: «Эмпатия и поддержка в общении»</h1>
            <p>Этот интерактивный курс проведет вас через 5 модулей, научит основам эмпатии, активному слушанию и поддержке людей, переживших травму.</p>
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
                    <h3>Итоговый экзамен</h3>
                    <p>Проверка знаний и получение сертификата</p>
                </div>
            </div>
            <p class="start-instruction">Выберите модуль в меню слева, чтобы начать обучение.</p>
        </div>
    `;
    
    if (contentDisplay) contentDisplay.innerHTML = welcomeHTML;
}

// Инициализация прогресса из localStorage
function initProgress() {
    const savedProgress = localStorage.getItem('empathyCourseProgress');
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
            console.log("Прогресс загружен:", userProgress);
        } catch (e) {
            console.error("Ошибка загрузки прогресса:", e);
            userProgress = getDefaultProgress();
        }
    } else {
        userProgress = getDefaultProgress();
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

// Сохранение прогресса в localStorage
function saveProgress() {
    try {
        localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
        console.log("Прогресс сохранен:", userProgress);
    } catch (e) {
        console.error("Ошибка сохранения прогресса:", e);
    }
    
    // Обновление прогресса на UI
    updateProgressUI();
}

// Обновление отображения прогресса
function updateProgressUI() {
    const totalSubmodules = courseData.modules.reduce((total, module) => {
        return total + (module.submodules ? module.submodules.length : 0);
    }, 0);
    
    const completedSubmodules = userProgress.completedSubmodules ? userProgress.completedSubmodules.length : 0;
    const progressPercent = totalSubmodules > 0 ? Math.round((completedSubmodules / totalSubmodules) * 100) : 0;
    
    // Обновление прогресс-бара
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    if (progressText) {
        progressText.textContent = `Прогресс: ${progressPercent}%`;
    }
    
    // Активация кнопки сертификата при 100% выполнении
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        if (progressPercent === 100) {
            certificateBtn.classList.remove('disabled');
            certificateBtn.onclick = showCertificate;
        } else {
            certificateBtn.classList.add('disabled');
            certificateBtn.onclick = function(e) {
                e.preventDefault();
                showCertificateNotAvailable();
            };
        }
    }
}

function showCertificateNotAvailable() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Сертификат недоступен';
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="color: #e74c3c; font-size: 4rem; margin-bottom: 20px;">
                <i class="fas fa-lock"></i>
            </div>
            <h3>Завершите все модули курса</h3>
            <p>Для получения сертификата необходимо завершить все модули.</p>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Рендеринг списка модулей
function renderModulesList() {
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) {
        console.error("Элемент modulesList не найден!");
        return;
    }
    
    modulesList.innerHTML = '';
    
    courseData.modules.forEach(module => {
        if (!module) return;
        
        const moduleItem = document.createElement('div');
        moduleItem.className = `module-item ${userProgress.currentModule === module.id ? 'active' : ''}`;
        moduleItem.innerHTML = `
            <h3>${module.title || 'Без названия'}</h3>
            <p>${module.description || ''}</p>
            ${userProgress.completedModules.includes(module.id) ? '<i class="fas fa-check-circle" style="color: #2ecc71; margin-top: 5px;"></i>' : ''}
        `;
        
        moduleItem.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Клик по модулю:", module.id);
            
            // Убираем активный класс у всех модулей
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            // Добавляем активный класс текущему модулю
            moduleItem.classList.add('active');
            
            // Открываем первый подмодуль выбранного модуля
            const firstSubmodule = module.submodules && module.submodules.length > 0 ? module.submodules[0].id : "1.1";
            openModule(module.id, firstSubmodule);
        });
        
        modulesList.appendChild(moduleItem);
        
        // Рендеринг подмодулей, если модуль активен
        if (userProgress.currentModule === module.id && module.submodules && module.submodules.length > 0) {
            module.submodules.forEach(submodule => {
                if (!submodule) return;
                
                const submoduleItem = document.createElement('div');
                submoduleItem.className = `submodule-item ${userProgress.currentSubmodule === submodule.id ? 'active' : ''}`;
                submoduleItem.innerHTML = `<h4>${submodule.title || 'Без названия'}</h4>`;
                
                submoduleItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log("Клик по подмодулю:", submodule.id);
                    
                    // Убираем активный класс у всех подмодулей
                    document.querySelectorAll('.submodule-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Добавляем активный класс текущему подмодулю
                    submoduleItem.classList.add('active');
                    
                    openModule(module.id, submodule.id);
                });
                
                modulesList.appendChild(submoduleItem);
            });
        }
    });
    
    // Добавляем прогресс
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <p id="progressText">Прогресс: 0%</p>
        <div class="certificate-link">
            <a href="#" id="certificateBtn" class="disabled">
                <i class="fas fa-award"></i> Сертификат
            </a>
        </div>
    `;
    modulesList.appendChild(progressContainer);
    
    // Инициализируем прогресс после рендеринга
    updateProgressUI();
}

// Открытие модуля и подмодуля
function openModule(moduleId, submoduleId) {
    console.log("openModule вызван с:", moduleId, submoduleId);
    
    // Обновляем прогресс
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    saveProgress();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) {
        console.error("Модуль не найден:", moduleId);
        return;
    }
    
    const submodule = module.submodules ? module.submodules.find(s => s.id === submoduleId) : null;
    if (!submodule) {
        console.error("Подмодуль не найден:", submoduleId, "в модуле", moduleId);
        // Пробуем открыть первый доступный подмодуль
        if (module.submodules && module.submodules.length > 0) {
            openModule(moduleId, module.submodules[0].id);
            return;
        }
    }
    
    // Обновление заголовка
    const moduleTitle = document.getElementById('moduleTitle');
    const moduleSubtitle = document.getElementById('moduleSubtitle');
    
    if (moduleTitle) moduleTitle.textContent = module.title;
    if (moduleSubtitle) moduleSubtitle.textContent = submodule ? submodule.title : '';
    
    // Скрываем тестовую область, если она открыта
    const testArea = document.getElementById('testArea');
    const contentDisplay = document.getElementById('contentDisplay');
    const moduleTabs = document.getElementById('moduleTabs');
    
    if (testArea) testArea.style.display = 'none';
    if (contentDisplay) {
        contentDisplay.style.display = 'block';
        contentDisplay.style.opacity = '0';
        setTimeout(() => {
            contentDisplay.style.opacity = '1';
        }, 10);
    }
    if (moduleTabs) moduleTabs.style.display = 'flex';
    
    // Рендеринг вкладок
    if (submodule) {
        renderTabs(submodule);
    } else {
        // Если подмодуля нет, показываем сообщение
        if (contentDisplay) {
            contentDisplay.innerHTML = `
                <div class="welcome-screen">
                    <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #f39c12; margin-bottom: 20px;"></i>
                    <h2>Контент в разработке</h2>
                    <p>Этот модуль находится в разработке. Выберите другой модуль.</p>
                </div>
            `;
        }
        if (moduleTabs) moduleTabs.innerHTML = '';
    }
    
    // Перерисовка списка модулей для отображения подмодулей
    renderModulesList();
}

// Рендеринг вкладок подмодуля
function renderTabs(submodule) {
    const moduleTabs = document.getElementById('moduleTabs');
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!moduleTabs || !contentDisplay || !submodule) {
        console.error("Элементы не найдены или подмодуль пустой");
        return;
    }
    
    // Очистка предыдущих вкладок и контента
    moduleTabs.innerHTML = '';
    contentDisplay.innerHTML = '';
    
    // Проверяем, есть ли вкладки у подмодуля
    if (!submodule.tabs || Object.keys(submodule.tabs).length === 0) {
        contentDisplay.innerHTML = `
            <div class="tab-content active">
                <h3>${submodule.title}</h3>
                <p>Контент для этого раздела находится в разработке.</p>
            </div>
        `;
        return;
    }
    
    // Создание вкладок
    const tabNames = Object.keys(submodule.tabs);
    let activeTabName = tabNames[0];
    
    tabNames.forEach((tabName, index) => {
        const tab = document.createElement('div');
        tab.className = `tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = submodule.tabs[tabName].title;
        tab.dataset.tab = tabName;
        
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            // Добавляем активный класс текущей вкладке
            tab.classList.add('active');
            activeTabName = tabName;
            
            // Показываем соответствующий контент
            showTabContent(tabName, submodule);
        });
        
        moduleTabs.appendChild(tab);
    });
    
    // Добавление кнопки для контрольной работы, если она есть у модуля
    const module = courseData.modules.find(m => m.submodules && m.submodules.some(s => s.id === submodule.id));
    if (module && module.test) {
        const testTab = document.createElement('div');
        testTab.className = 'tab';
        testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Контрольная';
        testTab.addEventListener('click', () => {
            openTest(module.id);
        });
        moduleTabs.appendChild(testTab);
    }
    
    // Показ содержимого первой вкладки
    if (tabNames.length > 0) {
        showTabContent(activeTabName, submodule);
    }
}

// Показ контента вкладки
function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!contentDisplay || !submodule.tabs[tabName]) {
        console.error("Не могу показать контент вкладки:", tabName);
        return;
    }
    
    contentDisplay.innerHTML = `
        <div class="tab-content active">
            <h3>${submodule.tabs[tabName].title}</h3>
            ${submodule.tabs[tabName].content || '<p>Контент отсутствует</p>'}
        </div>
    `;
    
    // Инициализируем обработчики для кнопок проверки заданий
    initializeAssignmentButtons();
}

// Инициализация кнопок проверки заданий
function initializeAssignmentButtons() {
    // Находим все кнопки проверки и назначаем обработчики
    const checkButtons = document.querySelectorAll('button[onclick^="checkAssignment"]');
    checkButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        const submoduleIdMatch = onclickAttr.match(/checkAssignment\('(.+?)'\)/);
        if (submoduleIdMatch) {
            const submoduleId = submoduleIdMatch[1];
            button.onclick = function() {
                checkAssignment(submoduleId);
            };
            button.removeAttribute('onclick');
        }
    });
}

// Проверка задания
function checkAssignment(submoduleId) {
    console.log("Проверка задания для подмодуля:", submoduleId);
    
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.submodules) return;
    
    const submodule = module.submodules.find(s => s.id === submoduleId);
    if (!submodule || !submodule.tabs || !submodule.tabs.assignment) return;
    
    const answerElement = document.getElementById(`answer${submoduleId.replace('.', '_')}`);
    const feedbackElement = document.getElementById(`feedback${submoduleId.replace('.', '_')}`);
    
    if (!answerElement || !feedbackElement) {
        console.error("Элементы ответа не найдены для подмодуля:", submoduleId);
        return;
    }
    
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
        
        // Сохраняем результат, если задание выполнено правильно
        if (result.correct) {
            if (!userProgress.completedSubmodules.includes(submoduleId)) {
                userProgress.completedSubmodules.push(submoduleId);
                saveProgress();
            }
            
            // Отмечаем задание как выполненное в UI
            const assignmentDiv = answerElement.closest('.assignment');
            if (assignmentDiv) {
                const header = assignmentDiv.querySelector('h4');
                if (header && !header.querySelector('.fa-check-circle')) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check-circle';
                    checkIcon.style.color = '#2ecc71';
                    checkIcon.style.marginLeft = '10px';
                    header.appendChild(checkIcon);
                }
            }
        }
    } catch (error) {
        console.error("Ошибка при проверке задания:", error);
        feedbackElement.textContent = "Произошла ошибка при проверке задания.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
    }
}

// Открытие теста
function openTest(moduleId) {
    console.log("Открытие теста для модуля:", moduleId);
    
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) {
        console.error("Тест не найден для модуля:", moduleId);
        return;
    }
    
    // Скрываем основную область контента
    const contentDisplay = document.getElementById('contentDisplay');
    const moduleTabs = document.getElementById('moduleTabs');
    const testArea = document.getElementById('testArea');
    
    if (contentDisplay) contentDisplay.style.display = 'none';
    if (moduleTabs) moduleTabs.style.display = 'none';
    if (testArea) {
        testArea.style.display = 'block';
        testArea.style.opacity = '0';
        setTimeout(() => {
            testArea.style.opacity = '1';
        }, 10);
    }
    
    // Заполняем тест
    const testTitle = document.getElementById('testTitle');
    const testDescription = document.getElementById('testDescription');
    const testContent = document.getElementById('testContent');
    
    if (testTitle) testTitle.textContent = module.test.title || 'Контрольная работа';
    if (testDescription) testDescription.textContent = module.test.description || '';
    
    if (testContent) {
        testContent.innerHTML = '';
        
        // Теоретические вопросы
        if (module.test.questions && module.test.questions.length > 0) {
            module.test.questions.forEach((question, index) => {
                if (!question) return;
                
                const questionDiv = document.createElement('div');
                questionDiv.className = 'test-question';
                
                let optionsHTML = '';
                if (question.options && question.options.length > 0) {
                    optionsHTML = question.options.map((option, optIndex) => `
                        <label>
                            <input type="radio" name="question${index}" value="${optIndex}">
                            ${option}
                        </label>
                    `).join('');
                }
                
                questionDiv.innerHTML = `
                    <h4>Вопрос ${index + 1}: ${question.question || 'Без текста'}</h4>
                    ${optionsHTML}
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
                <p>${module.test.practical.task || ''}</p>
                <textarea id="practicalAnswer" placeholder="Напишите ваш ответ здесь..." rows="5"></textarea>
            `;
            testContent.appendChild(practicalDiv);
        }
        
        // Если нет заданий
        if (!module.test.questions && !module.test.practical) {
            testContent.innerHTML = '<p>Тестовые задания еще не добавлены.</p>';
        }
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log("Настройка обработчиков событий...");
    
    // Кнопка отправки теста
    const submitTestBtn = document.getElementById('submitTestBtn');
    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', submitTest);
        console.log("Кнопка submitTestBtn найдена");
    } else {
        console.warn("Кнопка submitTestBtn не найдена");
    }
    
    // Кнопка закрытия теста
    const closeTestBtn = document.getElementById('closeTestBtn');
    if (closeTestBtn) {
        closeTestBtn.addEventListener('click', () => {
            const testArea = document.getElementById('testArea');
            const contentDisplay = document.getElementById('contentDisplay');
            const moduleTabs = document.getElementById('moduleTabs');
            
            if (testArea) testArea.style.display = 'none';
            if (contentDisplay) contentDisplay.style.display = 'block';
            if (moduleTabs) moduleTabs.style.display = 'flex';
            
            // Возвращаемся к текущему модулю
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        });
    }
    
    // Кнопка сброса прогресса
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }
    
    // Модальное окно
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOkBtn = document.getElementById('modalOkBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.style.display = 'none';
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.style.display = 'none';
        });
    }
    
    console.log("Обработчики событий настроены");
}

// Отправка теста на проверку
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) {
        console.error("Тест не найден для модуля:", moduleId);
        return;
    }
    
    let score = 0;
    const totalQuestions = module.test.questions ? module.test.questions.length : 0;
    
    // Проверка теоретических вопросов
    if (module.test.questions && module.test.questions.length > 0) {
        module.test.questions.forEach((question, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption && parseInt(selectedOption.value) === question.correct) {
                score++;
            }
        });
    }
    
    // Проверка практического задания
    let practicalPassed = false;
    if (module.test.practical) {
        const practicalAnswer = document.getElementById('practicalAnswer');
        const answer = practicalAnswer ? practicalAnswer.value.trim() : '';
        practicalPassed = module.test.practical.check ? module.test.practical.check(answer) : false;
    }
    
    // Вычисление результата
    const theoryPercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = theoryPercent >= 70 && (module.test.practical ? practicalPassed : true);
    
    // Показ результата
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle && modalBody) {
        modalTitle.textContent = 'Результат контрольной работы';
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>${passed ? 'Поздравляем!' : 'Есть над чем поработать'}</h3>
                <p>Теоретическая часть: ${score} из ${totalQuestions} (${theoryPercent}%)</p>
                ${module.test.practical ? `<p>Практическая часть: ${practicalPassed ? 'Зачтено' : 'Требуется доработка'}</p>` : ''}
                <p style="font-size: 1.2rem; margin-top: 20px;">
                    <strong>${passed ? 'Вы успешно прошли контрольную работу!' : 'Попробуйте еще раз после повторения материала.'}</strong>
                </p>
                ${passed ? '<div style="color: #27ae60; font-size: 3rem; margin: 20px;"><i class="fas fa-trophy"></i></div>' : ''}
            </div>
        `;
        
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.style.display = 'flex';
        
        // Если тест пройден, отмечаем модуль как завершенный
        if (passed) {
            if (!userProgress.completedModules.includes(moduleId)) {
                userProgress.completedModules.push(moduleId);
                if (module) module.completed = true;
                saveProgress();
            }
        }
    }
}

// Показать сертификат
function showCertificate() {
    // Проверяем, завершены ли все модули
    const totalModules = courseData.modules.length;
    const completedModules = userProgress.completedModules ? userProgress.completedModules.length : 0;
    
    if (completedModules < totalModules) {
        showCertificateNotAvailable();
        return;
    }
    
    // Показываем сертификат
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle && modalBody) {
        modalTitle.textContent = 'Ваш сертификат';
        modalBody.innerHTML = `
            <div class="certificate">
                <div class="certificate-content">
                    <h1>СЕРТИФИКАТ</h1>
                    <p>о успешном прохождении курса</p>
                    <h2>«Эмпатия и поддержка в общении»</h2>
                    <p>Настоящим удостоверяется, что</p>
                    <h3>СЛУШАТЕЛЬ КУРСА</h3>
                    <p>успешно освоил(а) программу из 5 модулей</p>
                    <p>и проявил(а) компетенции в области эмпатического общения,</p>
                    <p>активного слушания и поддержки людей, переживших травму.</p>
                    <div style="margin-top: 30px;">
                        <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                        <div>
                            <p>___________________</p>
                            <p>Подпись</p>
                        </div>
                        <div>
                            <div style="color: #6a89cc; font-size: 3rem;">
                                <i class="fas fa-award"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <p style="margin-top: 20px; color: #7f8c8d;">Вы можете сохранить эту страницу как PDF или сделать скриншот.</p>
            </div>
        `;
        
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.style.display = 'flex';
    }
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Все ваши результаты будут удалены.")) {
        userProgress = getDefaultProgress();
        
        // Сброс в данных курса
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        saveProgress();
        renderModulesList();
        updateProgressUI();
        showWelcomeScreen();
        
        // Сброс в localStorage
        localStorage.removeItem('empathyCourseProgress');
        
        alert("Прогресс сброшен. Начните курс заново.");
    }
}

// Глобальные функции для вызова из HTML
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;

console.log("script.js загружен и готов к работе!");
