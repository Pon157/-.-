// Глобальные переменные
let userProgress = {
    currentModule: 1,
    completedModules: [],
    progress: 0,
    scores: {}
};

let currentUserId = null;
let isAuthenticated = false;
let answerDraftsCache = new Map();

// Данные будут загружаться из отдельных файлов
let courseData = null;

// Функция инициализации
async function initCourse() {
    try {
        // Загрузка данных курса из отдельных файлов
        courseData = await loadCourseData();
        console.log("✅ Данные курса загружены. Всего модулей: " + courseData.modules.length);
        
        // Инициализация интерфейса
        initializeUI();
        
        // Восстановление прогресса
        restoreProgress();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки данных курса:", error);
    }
}

// Функция загрузки данных курса
async function loadCourseData() {
    const baseData = {
        title: "Эмпатия и поддержка в общении",
        modules: [],
        finalExam: window.finalExamData
    };
    
    // Загрузка каждого модуля из отдельного файла
    const moduleFiles = [
        'data/module1.js',
        'data/module2.js', 
        'data/module3.js',
        'data/module4.js',
        'data/module5.js'
    ];
    
    for (let i = 0; i < moduleFiles.length; i++) {
        try {
            const module = await loadModuleData(i + 1);
            if (module) {
                baseData.modules.push(module);
            }
        } catch (error) {
            console.error(`Ошибка загрузки модуля ${i + 1}:`, error);
        }
    }
    
    return baseData;
}

// Функция загрузки конкретного модуля
async function loadModuleData(moduleId) {
    // В реальном приложении здесь будет fetch к файлу
    // Для примера используем switch
    switch(moduleId) {
        case 1:
            return window.module1Data;
        case 2:
            return window.module2Data;
        case 3:
            return window.module3Data;
        case 4:
            return window.module4Data;
        case 5:
            return window.module5Data;
        default:
            return null;
    }
}

// Инициализация UI
function initializeUI() {
    // Создание кнопок оверлея
    createOverlayButtons();
    
    // Инициализация сайдбара
    initSidebar();
    
    // Инициализация вкладок
    initTabs();
    
    // Показ приветственного экрана
    showWelcomeScreen();
    
    // Настройка обработчиков событий
    setupEventListeners();
}

// Функции для работы с оверлеем выбора модуля
function showModuleOverlay() {
    if (!courseData) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'module-overlay';
    overlay.innerHTML = `
        <div class="module-overlay-content">
            <div class="module-overlay-header">
                <h2>Выберите модуль</h2>
                <button class="close-overlay" onclick="closeModuleOverlay()">×</button>
            </div>
            <div class="module-grid">
                ${courseData.modules.map(module => `
                    <div class="module-card" onclick="selectModule(${module.id})">
                        <div class="module-card-header">
                            <h3>${module.title}</h3>
                            <span class="module-status ${module.completed ? 'completed' : 'in-progress'}">
                                ${module.completed ? '✓' : '●'}
                            </span>
                        </div>
                        <p class="module-description">${module.description}</p>
                        <div class="module-stats">
                            <span class="stat-item">
                                <i class="icon submodules"></i>
                                ${module.submodules.length} подмодулей
                            </span>
                            <span class="stat-item">
                                <i class="icon test"></i>
                                Контрольная работа
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="overlay-footer">
                <button class="btn-secondary" onclick="closeModuleOverlay()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeModuleOverlay() {
    const overlay = document.querySelector('.module-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
    }
}

function selectModule(moduleId) {
    closeModuleOverlay();
    loadModule(moduleId);
    updateProgress();
}

// Функция для создания кнопок оверлея
function createOverlayButtons() {
    // Кнопка выбора модуля
    const selectModuleBtn = document.createElement('button');
    selectModuleBtn.className = 'btn-select-module';
    selectModuleBtn.innerHTML = '📚 Выбрать модуль';
    selectModuleBtn.onclick = showModuleOverlay;
    document.body.appendChild(selectModuleBtn);
    
    // Кнопка возврата к теории
    const backToTheoryBtn = document.createElement('button');
    backToTheoryBtn.className = 'btn-back-to-theory';
    backToTheoryBtn.innerHTML = '📖 Вернуться к теории';
    backToTheoryBtn.style.display = 'none';
    backToTheoryBtn.onclick = scrollToTheory;
    document.body.appendChild(backToTheoryBtn);
    
    // Отслеживание прокрутки для показа кнопки
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTheoryBtn.style.display = 'flex';
        } else {
            backToTheoryBtn.style.display = 'none';
        }
    });
}

// Функция для прокрутки к теории
function scrollToTheory() {
    const theorySection = document.querySelector('.theory-section');
    if (theorySection) {
        theorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Функция для создания таблиц "хорошо/плохо"
function createGoodBadTable(goodItems, badItems) {
    const maxRows = Math.max(goodItems.length, badItems.length);
    let tableRows = '';
    
    for (let i = 0; i < maxRows; i++) {
        tableRows += `
            <tr>
                <td class="good-cell">${goodItems[i] || ''}</td>
                <td class="bad-cell">${badItems[i] || ''}</td>
            </tr>
        `;
    }
    
    return `
        <div class="good-bad-table-container">
            <table class="good-bad-table">
                <tr>
                    <th class="good-header">👍 Хорошо</th>
                    <th class="bad-header">👎 Плохо</th>
                </tr>
                ${tableRows}
            </table>
        </div>
    `;
}

// Функция для создания кнопки перехода к заданию
function createGoToAssignmentButton(submoduleId) {
    return `<button class="btn-go-to-assignment" onclick="scrollToAssignment('${submoduleId}')">
                <i class="icon">→</i> Перейти к заданию
            </button>`;
}

// Функция для прокрутки к заданию
function scrollToAssignment(submoduleId) {
    const assignmentElement = document.querySelector(`[data-submodule="${submoduleId}"] .assignment`);
    if (assignmentElement) {
        assignmentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Функция проверки задания
function checkAssignment(submoduleId) {
    console.log("=== НАЧАЛО ПРОВЕРКИ ===");
    
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module?.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Модуль или подмодуль не найдены");
        return;
    }
    
    const answerId = 'answer' + submoduleId.replace('.', '_');
    const feedbackId = 'feedback' + submoduleId.replace('.', '_');
    
    const answerElement = document.getElementById(answerId);
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!answerElement || !feedbackElement) return;
    
    const answer = answerElement.value.trim();
    
    if (!answer) {
        showFeedback(feedbackElement, "❌ Пожалуйста, напишите ответ перед проверкой.", false);
        return;
    }
    
    // Проверка задания
    if (submodule.tabs.assignment && submodule.tabs.assignment.check) {
        const result = submodule.tabs.assignment.check(answer);
        showFeedback(feedbackElement, result.message, result.correct);
        
        if (result.correct) {
            // Очистка черновика
            if (isAuthenticated && currentUserId) {
                clearDraft(submoduleId);
            }
            
            // Сохранение прогресса
            markSubmoduleComplete(submoduleId);
        }
    }
}

// Функция для проверки заданий с выбором ответа
function checkChoiceAssignment(submoduleId, questionId) {
    const questionElement = document.getElementById(questionId);
    const feedbackElement = document.getElementById(`feedback_${questionId}`);
    
    if (!questionElement || !feedbackElement) return;
    
    const selectedOptions = questionElement.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    
    if (selectedOptions.length === 0) {
        showFeedback(feedbackElement, "❌ Пожалуйста, выберите ответ.", false);
        return;
    }
    
    const questionData = getQuestionData(submoduleId, questionId);
    if (!questionData) return;
    
    let correct = true;
    const selectedValues = Array.from(selectedOptions).map(opt => opt.value);
    
    if (questionData.type === 'single') {
        correct = selectedValues[0] === questionData.correctAnswer;
    } else if (questionData.type === 'multiple') {
        const correctAnswers = questionData.correctAnswers || [];
        correct = selectedValues.length === correctAnswers.length && 
                 selectedValues.every(val => correctAnswers.includes(val)) &&
                 correctAnswers.every(val => selectedValues.includes(val));
    }
    
    if (correct) {
        showFeedback(feedbackElement, "✅ Правильно! " + (questionData.explanation || ""), true);
        markCorrectAnswers(questionElement, questionData);
        saveChoiceProgress(submoduleId, questionId, true);
    } else {
        showFeedback(feedbackElement, "❌ Неправильно. " + (questionData.explanation || "Попробуйте еще раз."), false);
        markCorrectAnswers(questionElement, questionData);
        saveChoiceProgress(submoduleId, questionId, false);
    }
}

// Вспомогательные функции
function showFeedback(element, message, isCorrect) {
    element.textContent = message;
    element.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    element.style.display = 'block';
}

function markCorrectAnswers(questionElement, questionData) {
    const allInputs = questionElement.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    const allLabels = questionElement.querySelectorAll('label.choice-label');
    
    allLabels.forEach(label => {
        label.classList.remove('correct', 'incorrect', 'selected-correct', 'selected-incorrect');
    });
    
    allInputs.forEach(input => {
        const label = input.closest('.choice-item')?.querySelector('label.choice-label') || 
                     input.nextElementSibling;
        
        if (!label) return;
        
        const isSelected = input.checked;
        let isCorrect = false;
        
        if (questionData.type === 'single') {
            isCorrect = input.value === questionData.correctAnswer;
        } else if (questionData.type === 'multiple') {
            isCorrect = questionData.correctAnswers?.includes(input.value) || false;
        }
        
        if (isSelected && isCorrect) {
            label.classList.add('selected-correct');
        } else if (isSelected && !isCorrect) {
            label.classList.add('selected-incorrect');
        } else if (!isSelected && isCorrect) {
            label.classList.add('correct');
        }
        
        input.disabled = true;
    });
}

function getQuestionData(submoduleId, questionId) {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module?.submodules.find(s => s.id === submoduleId);
    
    if (!submodule) return null;
    
    if (submodule.choiceQuestions && submodule.choiceQuestions[questionId]) {
        return submodule.choiceQuestions[questionId];
    }
    
    if (module.test && module.test.choiceQuestions) {
        return module.test.choiceQuestions.find(q => q.id === questionId);
    }
    
    return null;
}

function saveChoiceProgress(submoduleId, questionId, isCorrect) {
    if (!isAuthenticated || !currentUserId) return;
    
    const progressKey = `${submoduleId}_choice_${questionId}`;
    
    localStorage.setItem(progressKey, JSON.stringify({
        completed: true,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    }));
    
    // В реальном приложении здесь будет запрос к БД
    console.log(`Прогресс сохранен: ${progressKey} - ${isCorrect}`);
}

function clearDraft(submoduleId) {
    if (isAuthenticated && currentUserId) {
        const key = `${submoduleId}_main`;
        answerDraftsCache.delete(key);
    }
}

function markSubmoduleComplete(submoduleId) {
    if (!userProgress.completedModules.includes(submoduleId)) {
        userProgress.completedModules.push(submoduleId);
        updateProgress();
        saveProgress();
    }
}

function updateProgress() {
    const totalSubmodules = courseData.modules.reduce((total, module) => 
        total + module.submodules.length, 0
    );
    
    const completed = userProgress.completedModules.length;
    userProgress.progress = Math.round((completed / totalSubmodules) * 100);
    
    // Обновление UI
    const progressFill = document.querySelector('.progress-fill');
    const miniProgressFill = document.querySelector('.mini-progress-fill');
    const progressText = document.getElementById('progressText');
    const mobileProgress = document.querySelector('.mobile-progress');
    
    if (progressFill) progressFill.style.width = `${userProgress.progress}%`;
    if (miniProgressFill) miniProgressFill.style.width = `${userProgress.progress}%`;
    if (progressText) progressText.textContent = `Прогресс: ${userProgress.progress}%`;
    if (mobileProgress) mobileProgress.textContent = `${userProgress.progress}%`;
}

function saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

function restoreProgress() {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
        userProgress = JSON.parse(saved);
        updateProgress();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initCourse);

// Экспорт глобальных функций
window.checkAssignment = checkAssignment;
window.checkChoiceAssignment = checkChoiceAssignment;
window.showModuleOverlay = showModuleOverlay;
window.closeModuleOverlay = closeModuleOverlay;
window.selectModule = selectModule;
window.scrollToAssignment = scrollToAssignment;
window.scrollToTheory = scrollToTheory;
window.createGoodBadTable = createGoodBadTable;
window.createGoToAssignmentButton = createGoToAssignmentButton;

console.log("✅ Основной скрипт загружен");
