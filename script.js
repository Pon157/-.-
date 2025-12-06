// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Документ загружен, инициализируем...");
    
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    
    // Открываем сохраненный модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    }
});

// Инициализация прогресса
function initProgress() {
    const savedProgress = localStorage.getItem('empathyCourseProgress');
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
        } catch (e) {
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

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
    updateProgressUI();
}

// Обновление прогресса
function updateProgressUI() {
    const totalSubmodules = courseData.modules.reduce((total, module) => {
        return total + (module.submodules ? module.submodules.length : 0);
    }, 0);
    
    const completedSubmodules = userProgress.completedSubmodules.length;
    const progressPercent = totalSubmodules > 0 ? Math.round((completedSubmodules / totalSubmodules) * 100) : 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `Прогресс: ${progressPercent}%`;
    
    // Сертификат
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        if (progressPercent === 100) {
            certificateBtn.classList.remove('disabled');
        } else {
            certificateBtn.classList.add('disabled');
        }
    }
}

// Рендеринг списка модулей (ИСПРАВЛЕННАЯ)
function renderModulesList() {
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) return;
    
    // Создаем контейнер для модулей
    let container = modulesList.querySelector('.modules-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'modules-container';
        // Вставляем перед прогресс-контейнером
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
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            moduleItem.classList.add('active');
            openModule(module.id, module.submodules[0].id);
        });
        
        container.appendChild(moduleItem);
        
        // Подмодули
        if (userProgress.currentModule === module.id) {
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
    
    updateProgressUI();
}

// Открытие модуля
function openModule(moduleId, submoduleId) {
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    saveProgress();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleSubtitle').textContent = submodule.title;
    
    // Скрываем тест
    document.getElementById('testArea').style.display = 'none';
    document.getElementById('contentDisplay').style.display = 'block';
    document.getElementById('moduleTabs').style.display = 'flex';
    
    renderTabs(submodule);
    renderModulesList();
}

// Рендеринг вкладок
function renderTabs(submodule) {
    const moduleTabs = document.getElementById('moduleTabs');
    const contentDisplay = document.getElementById('contentDisplay');
    
    moduleTabs.innerHTML = '';
    contentDisplay.innerHTML = '';
    
    const tabNames = Object.keys(submodule.tabs);
    tabNames.forEach((tabName, index) => {
        const tab = document.createElement('div');
        tab.className = `tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = submodule.tabs[tabName].title;
        tab.dataset.tab = tabName;
        
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showTabContent(tabName, submodule);
        });
        
        moduleTabs.appendChild(tab);
    });
    
    // Кнопка контрольной
    const module = courseData.modules.find(m => m.submodules.some(s => s.id === submodule.id));
    if (module.test) {
        const testTab = document.createElement('div');
        testTab.className = 'tab';
        testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Контрольная';
        testTab.addEventListener('click', () => openTest(module.id));
        moduleTabs.appendChild(testTab);
    }
    
    if (tabNames.length > 0) {
        showTabContent(tabNames[0], submodule);
    }
}

// Показ контента вкладки (ИСПРАВЛЕННАЯ)
function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = `
        <div class="tab-content active">
            <h3>${submodule.tabs[tabName].title}</h3>
            ${submodule.tabs[tabName].content}
        </div>
    `;
    
    // Инициализируем кнопки СРАЗУ
    setTimeout(initializeAssignmentButtons, 50);
}

// Инициализация кнопок проверки (ИСПРАВЛЕННАЯ)
function initializeAssignmentButtons() {
    const buttons = document.querySelectorAll('button[onclick*="checkAssignment"]');
    buttons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        const match = onclick.match(/checkAssignment\('(.+?)'\)/);
        if (match) {
            const submoduleId = match[1];
            button.onclick = () => checkAssignment(submoduleId);
            button.removeAttribute('onclick');
        }
    });
}

// Проверка задания (ИСПРАВЛЕННАЯ)
function checkAssignment(submoduleId) {
    console.log("Проверка задания:", submoduleId);
    
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!submodule.tabs.assignment) return;
    
    const answerId = `answer${submoduleId.replace('.', '_')}`;
    const feedbackId = `feedback${submoduleId.replace('.', '_')}`;
    
    const answerElement = document.getElementById(answerId);
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!answerElement || !feedbackElement) {
        console.error("Не найдены элементы:", answerId, feedbackId);
        return;
    }
    
    const answer = answerElement.value.trim();
    if (!answer) {
        feedbackElement.textContent = "Напишите ответ перед проверкой.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
        return;
    }
    
    try {
        const result = submodule.tabs.assignment.check(answer);
        
        feedbackElement.textContent = result.message;
        feedbackElement.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
        feedbackElement.style.display = "block";
        
        if (result.correct && !userProgress.completedSubmodules.includes(submoduleId)) {
            userProgress.completedSubmodules.push(submoduleId);
            saveProgress();
        }
    } catch (error) {
        console.error("Ошибка проверки:", error);
        feedbackElement.textContent = "Ошибка проверки.";
        feedbackElement.className = "feedback incorrect";
        feedbackElement.style.display = "block";
    }
}

// Открытие теста
function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
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

// Настройка обработчиков
function setupEventListeners() {
    document.getElementById('submitTestBtn')?.addEventListener('click', submitTest);
    document.getElementById('closeTestBtn')?.addEventListener('click', () => {
        document.getElementById('testArea').style.display = 'none';
        document.getElementById('contentDisplay').style.display = 'block';
        document.getElementById('moduleTabs').style.display = 'flex';
    });
    
    document.getElementById('resetBtn')?.addEventListener('click', resetProgress);
    document.getElementById('certificateBtn')?.addEventListener('click', showCertificate);
    
    // Модальное окно
    document.getElementById('closeModalBtn')?.addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'none';
    });
    document.getElementById('modalOkBtn')?.addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'none';
    });
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) {
            document.getElementById('modalOverlay').style.display = 'none';
        }
    });
}

// Отправка теста
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
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
    
    const theoryPercent = Math.round((score / totalQuestions) * 100);
    const passed = theoryPercent >= 70 && (module.test.practical ? practicalPassed : true);
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат';
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <h3>${passed ? 'Поздравляем!' : 'Попробуйте еще'}</h3>
            <p>Теория: ${score}/${totalQuestions} (${theoryPercent}%)</p>
            ${module.test.practical ? `<p>Практика: ${practicalPassed ? 'Зачтено' : 'Нет'}</p>` : ''}
            ${passed ? '<div style="color: green; font-size: 3rem;"><i class="fas fa-trophy"></i></div>' : ''}
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    if (passed && !userProgress.completedModules.includes(moduleId)) {
        userProgress.completedModules.push(moduleId);
        module.completed = true;
        saveProgress();
    }
}

// Сертификат
function showCertificate() {
    const completed = userProgress.completedModules.length;
    const total = courseData.modules.length;
    
    if (completed < total) {
        alert(`Завершите все модули! Вы прошли ${completed} из ${total}.`);
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Ваш сертификат';
    modalBody.innerHTML = `
        <div class="certificate">
            <div class="certificate-content">
                <h1>СЕРТИФИКАТ</h1>
                <p>Курс «Эмпатия и поддержка в общении»</p>
                <p>Выдан: ${new Date().toLocaleDateString('ru-RU')}</p>
                <div style="margin: 30px 0; font-size: 1.5rem;">
                    <i class="fas fa-award" style="color: gold; font-size: 3rem;"></i>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Сбросить весь прогресс?")) {
        userProgress = getDefaultProgress();
        courseData.modules.forEach(m => m.completed = false);
        saveProgress();
        renderModulesList();
        location.reload();
    }
}

// Глобальные функции
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;

console.log("Script loaded");
