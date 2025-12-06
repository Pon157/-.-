// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    
    // Если есть сохраненный прогресс, открываем последний модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        openModule(userProgress.currentModule, userProgress.currentSubmodule);
    }
});

// Рендеринг списка модулей
function renderModulesList() {
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) return;
    
    modulesList.innerHTML = '';
    
    courseData.modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = `module-item ${userProgress.currentModule === module.id ? 'active' : ''}`;
        moduleItem.innerHTML = `
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            ${module.completed ? '<i class="fas fa-check-circle" style="color: #2ecc71; margin-top: 5px;"></i>' : ''}
        `;
        
        moduleItem.addEventListener('click', () => {
            // Убираем активный класс у всех модулей
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            // Добавляем активный класс текущему модулю
            moduleItem.classList.add('active');
            
            // Открываем первый подмодуль выбранного модуля
            openModule(module.id, module.submodules[0]?.id || '1.1');
        });
        
        modulesList.appendChild(moduleItem);
        
        // Рендеринг подмодулей, если модуль активен
        if (userProgress.currentModule === module.id) {
            module.submodules.forEach(submodule => {
                const submoduleItem = document.createElement('div');
                submoduleItem.className = `submodule-item ${userProgress.currentSubmodule === submodule.id ? 'active' : ''}`;
                submoduleItem.innerHTML = `<h4>${submodule.title}</h4>`;
                
                submoduleItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
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
}

// Открытие модуля и подмодуля
function openModule(moduleId, submoduleId) {
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    saveProgress();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Модуль или подмодуль не найден:", moduleId, submoduleId);
        return;
    }
    
    // Обновление заголовка
    const moduleTitle = document.getElementById('moduleTitle');
    const moduleSubtitle = document.getElementById('moduleSubtitle');
    
    if (moduleTitle) moduleTitle.textContent = module.title;
    if (moduleSubtitle) moduleSubtitle.textContent = submodule.title;
    
    // Скрываем тестовую область, если она открыта
    const testArea = document.getElementById('testArea');
    const contentDisplay = document.getElementById('contentDisplay');
    const moduleTabs = document.getElementById('moduleTabs');
    
    if (testArea) testArea.style.display = 'none';
    if (contentDisplay) contentDisplay.style.display = 'block';
    if (moduleTabs) moduleTabs.style.display = 'flex';
    
    // Рендеринг вкладок
    renderTabs(submodule);
    
    // Перерисовка списка модулей для отображения подмодулей
    renderModulesList();
    
    console.log("Открыт модуль:", moduleId, "подмодуль:", submoduleId);
}

// Рендеринг вкладок подмодуля
function renderTabs(submodule) {
    const moduleTabs = document.getElementById('moduleTabs');
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!moduleTabs || !contentDisplay) return;
    
    // Очистка предыдущих вкладок и контента
    moduleTabs.innerHTML = '';
    contentDisplay.innerHTML = '';
    
    // Создание вкладок
    const tabNames = Object.keys(submodule.tabs);
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
            
            // Показываем соответствующий контент
            showTabContent(tabName, submodule);
        });
        
        moduleTabs.appendChild(tab);
    });
    
    // Добавление кнопки для контрольной работы, если она есть у модуля
    const module = courseData.modules.find(m => m.submodules.some(s => s.id === submodule.id));
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
        showTabContent(tabNames[0], submodule);
    }
}

// Показ контента вкладки
function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!contentDisplay || !submodule.tabs[tabName]) return;
    
    contentDisplay.innerHTML = `
        <div class="tab-content active">
            <h3>${submodule.tabs[tabName].title}</h3>
            ${submodule.tabs[tabName].content}
        </div>
    `;
}

// Проверка задания
function checkAssignment(submoduleId) {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!submodule || !submodule.tabs.assignment) return;
    
    const answerElement = document.getElementById(`answer${submoduleId.replace('.', '_')}`);
    const feedbackElement = document.getElementById(`feedback${submoduleId.replace('.', '_')}`);
    
    if (!answerElement || !feedbackElement) return;
    
    const answer = answerElement.value.trim();
    if (!answer) {
        feedbackElement.textContent = "Пожалуйста, напишите ответ перед проверкой.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
        return;
    }
    
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
            const checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check-circle';
            checkIcon.style.color = '#2ecc71';
            checkIcon.style.marginLeft = '10px';
            
            const header = assignmentDiv.querySelector('h4');
            if (header && !header.querySelector('.fa-check-circle')) {
                header.appendChild(checkIcon);
            }
        }
    }
}

// Открытие теста
function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    // Скрываем основную область контента
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    
    // Показываем область теста
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    // Заполняем тест
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
    // Теоретические вопросы
    module.test.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'test-question';
        questionDiv.innerHTML = `
            <h4>Вопрос ${index + 1}: ${question.question}</h4>
            ${question.options.map((option, optIndex) => `
                <label>
                    <input type="radio" name="question${index}" value="${optIndex}">
                    ${option}
                </label>
            `).join('')}
        `;
        testContent.appendChild(questionDiv);
    });
    
    // Практическое задание
    if (module.test.practical) {
        const practicalDiv = document.createElement('div');
        practicalDiv.className = 'test-question';
        practicalDiv.innerHTML = `
            <h4>Практическое задание</h4>
            <p>${module.test.practical.task}</p>
            <textarea id="practicalAnswer" placeholder="Напишите ваш ответ здесь..." rows="5"></textarea>
        `;
        testContent.appendChild(practicalDiv);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка отправки теста
    const submitTestBtn = document.getElementById('submitTestBtn');
    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', submitTest);
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
    
    // Кнопка сертификата
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        certificateBtn.addEventListener('click', showCertificate);
    }
    
    // Модальное окно
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOkBtn = document.getElementById('modalOkBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
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
            modalOverlay.style.display = 'none';
        });
    }
}

// Отправка теста на проверку
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.questions.length;
    
    // Проверка теоретических вопросов
    module.test.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && parseInt(selectedOption.value) === question.correct) {
            score++;
        }
    });
    
    // Проверка практического задания
    let practicalPassed = false;
    if (module.test.practical) {
        const practicalAnswer = document.getElementById('practicalAnswer')?.value.trim() || '';
        practicalPassed = module.test.practical.check(practicalAnswer);
    }
    
    // Вычисление результата
    const theoryPercent = Math.round((score / totalQuestions) * 100);
    const passed = theoryPercent >= 70 && (module.test.practical ? practicalPassed : true);
    
    // Показ результата
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат контрольной работы';
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>${passed ? 'Поздравляем!' : 'Есть над чем поработать'}</h3>
            <p>Теоретическая часть: ${score} из ${totalQuestions} (${theoryPercent}%)</p>
            <p>Практическая часть: ${practicalPassed ? 'Зачтено' : 'Требуется доработка'}</p>
            <p style="font-size: 1.2rem; margin-top: 20px;">
                <strong>${passed ? 'Вы успешно прошли контрольную работу!' : 'Попробуйте еще раз после повторения материала.'}</strong>
            </p>
            ${passed ? '<div style="color: #27ae60; font-size: 3rem; margin: 20px;"><i class="fas fa-trophy"></i></div>' : ''}
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    // Если тест пройден, отмечаем модуль как завершенный
    if (passed) {
        if (!userProgress.completedModules.includes(moduleId)) {
            userProgress.completedModules.push(moduleId);
            module.completed = true;
            saveProgress();
        }
    }
}

// Показать сертификат
function showCertificate() {
    // Проверяем, завершены ли все модули
    const totalModules = courseData.modules.length;
    const completedModules = userProgress.completedModules.length;
    
    if (completedModules < totalModules) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Сертификат недоступен';
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="color: #e74c3c; font-size: 4rem; margin-bottom: 20px;">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>Завершите все модули курса</h3>
                <p>Вы прошли ${completedModules} из ${totalModules} модулей.</p>
                <p>Для получения сертификата необходимо завершить все модули и итоговый экзамен.</p>
            </div>
        `;
        
        document.getElementById('modalOverlay').style.display = 'flex';
        return;
    }
    
    // Показываем сертификат
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
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
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Все ваши результаты будут удалены.")) {
        userProgress = {
            currentModule: 1,
            currentSubmodule: "1.1",
            completedModules: [],
            completedSubmodules: [],
            testResults: {},
            assignmentResults: {}
        };
        
        // Сброс в данных курса
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        saveProgress();
        renderModulesList();
        updateProgressUI();
        
        // Возврат к начальному экрану
        document.getElementById('moduleTitle').textContent = 'Добро пожаловать на курс';
        document.getElementById('moduleSubtitle').textContent = '«Эмпатия и поддержка в общении»';
        
        const contentDisplay = document.getElementById('contentDisplay');
        const moduleTabs = document.getElementById('moduleTabs');
        const testArea = document.getElementById('testArea');
        
        contentDisplay.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-icon">
                    <i class="fas fa-hands-helping"></i>
                </div>
                <h1>Полный курс: «Эмпатия и поддержка в общении»</h1>
                <p>Прогресс сброшен. Выберите модуль в меню слева, чтобы начать обучение заново.</p>
            </div>
        `;
        moduleTabs.innerHTML = '';
        testArea.style.display = 'none';
        contentDisplay.style.display = 'block';
    }
}
