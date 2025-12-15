// Состояние прогресса - ОБЪЯВЛЯЕМ ТОЛЬКО ЗДЕСЬ!
let userProgress;

// Стили для улучшенного отображения
const enhancedStyles = `
<style>
    /* Стили для контрольных работ */
    .module-test {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 15px;
        padding: 25px;
        margin: 25px 0;
        border-left: 5px solid #3498db;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .module-test h3 {
        color: #3498db;
        font-size: 1.5em;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .test-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .test-stat {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        border: 1px solid rgba(52, 152, 219, 0.2);
    }
    
    .test-stat strong {
        display: block;
        font-size: 1.8em;
        color: #3498db;
        margin-bottom: 5px;
    }
    
    .test-stat span {
        font-size: 0.9em;
        color: #95a5a6;
    }
    
    /* Стили для цитат */
    .quote-box {
        background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.1) 100%);
        border-left: 4px solid #9b59b6;
        padding: 25px;
        margin: 25px 0;
        border-radius: 0 12px 12px 0;
        position: relative;
        font-style: italic;
        font-size: 1.1em;
        line-height: 1.6;
    }
    
    .quote-box:before {
        content: "❝";
        position: absolute;
        top: -15px;
        left: 20px;
        font-size: 3em;
        color: rgba(155, 89, 182, 0.3);
        font-family: serif;
    }
    
    .quote-author {
        text-align: right;
        color: #95a5a6;
        font-style: normal;
        margin-top: 15px;
        font-size: 0.9em;
        padding-right: 20px;
    }
    
    /* Стили для источников */
    .source-box {
        background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%);
        border-left: 4px solid #2ecc71;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .source-box h4 {
        color: #2ecc71;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .source-box p {
        margin: 10px 0;
        color: #e0e0e0;
        line-height: 1.6;
    }
    
    /* Стили для терминов */
    .definition-box {
        background: linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%);
        border-left: 4px solid #f1c40f;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
        position: relative;
    }
    
    .definition-box h4 {
        color: #f1c40f;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .term {
        background: #f1c40f;
        color: #2c3e50;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.9em;
        font-weight: bold;
        margin-right: 10px;
    }
    
    /* Стили для вопросов проверки */
    .check-question {
        background: rgba(52, 152, 219, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        border: 1px solid rgba(52, 152, 219, 0.2);
    }
    
    .check-question h4 {
        color: #3498db;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Практические советы */
    .practical-tip {
        background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%);
        border-left: 4px solid #e74c3c;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .practical-tip h4 {
        color: #e74c3c;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Стили для контрольных вопросов */
    .test-question {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .test-question h4 {
        color: #3498db;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(52, 152, 219, 0.2);
    }
    
    .test-options {
        margin: 15px 0;
    }
    
    .test-option {
        background: rgba(255, 255, 255, 0.03);
        padding: 12px 15px;
        margin: 8px 0;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .test-option:hover {
        background: rgba(52, 152, 219, 0.1);
        border-color: rgba(52, 152, 219, 0.3);
    }
    
    .test-option input[type="radio"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
    
    .test-option-label {
        flex: 1;
        cursor: pointer;
        color: #e0e0e0;
    }
    
    /* Стили для практических заданий в тестах */
    .practical-task {
        background: rgba(46, 204, 113, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        border: 1px solid rgba(46, 204, 113, 0.2);
    }
    
    .practical-task h4 {
        color: #2ecc71;
        margin-bottom: 15px;
    }
    
    /* Стили для статистики экзамена */
    .exam-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin: 25px 0;
        padding: 20px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        border: 1px solid rgba(52, 152, 219, 0.2);
    }
    
    .exam-stat {
        text-align: center;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        transition: transform 0.3s;
    }
    
    .exam-stat:hover {
        transform: translateY(-5px);
        background: rgba(52, 152, 219, 0.1);
    }
    
    .exam-stat strong {
        display: block;
        font-size: 2em;
        color: #3498db;
        margin-bottom: 8px;
    }
    
    .exam-stat span {
        font-size: 0.9em;
        color: #95a5a6;
        display: block;
    }
    
    /* Стили для правильных/неправильных ответов */
    .option-correct {
        background: rgba(46, 204, 113, 0.15) !important;
        border-color: #2ecc71 !important;
        animation: pulseCorrect 0.5s ease;
    }
    
    .option-incorrect {
        background: rgba(231, 76, 60, 0.15) !important;
        border-color: #e74c3c !important;
        animation: pulseIncorrect 0.5s ease;
    }
    
    @keyframes pulseCorrect {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes pulseIncorrect {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }
    
    /* Стили для результатов теста */
    .test-result {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 15px;
        padding: 30px;
        margin: 25px 0;
        text-align: center;
        border: 2px solid rgba(52, 152, 219, 0.3);
    }
    
    .test-result-score {
        font-size: 3em;
        font-weight: bold;
        color: #3498db;
        margin: 20px 0;
    }
    
    /* Улучшенные стили для заданий */
    .assignment {
        background: linear-gradient(135deg, rgba(41, 128, 185, 0.1) 0%, rgba(52, 152, 219, 0.1) 100%);
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        border: 2px solid rgba(52, 152, 219, 0.2);
    }
    
    .assignment h4 {
        color: #3498db;
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .additional-task {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin-top: 25px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .additional-task h5 {
        color: #f39c12;
        margin-top: 0;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Стили для фидбэка */
    .feedback {
        padding: 15px;
        margin-top: 15px;
        border-radius: 8px;
        font-size: 0.95em;
        line-height: 1.5;
        animation: slideIn 0.3s ease;
        display: none;
    }
    
    .feedback.correct {
        background: rgba(46, 204, 113, 0.15);
        border-left: 4px solid #2ecc71;
        color: #2ecc71;
    }
    
    .feedback.incorrect {
        background: rgba(231, 76, 60, 0.15);
        border-left: 4px solid #e74c3c;
        color: #e74c3c;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Стили для кнопок */
    .btn-primary, .btn-secondary {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        font-size: 1em;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
    }
    
    .btn-secondary {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }
    
    /* Стили для текстовых полей */
    textarea {
        width: 100%;
        min-height: 100px;
        padding: 15px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-color);
        font-family: inherit;
        font-size: 1em;
        resize: vertical;
        transition: all 0.3s;
        margin: 10px 0;
    }
    
    textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        background: rgba(255, 255, 255, 0.08);
    }
    
    /* Стили для таблиц в контенте */
    .theory-block table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .theory-block th {
        background: rgba(52, 152, 219, 0.2);
        padding: 15px;
        text-align: left;
        color: #3498db;
        font-weight: 600;
    }
    
    .theory-block td {
        padding: 12px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #e0e0e0;
    }
    
    .theory-block tr:hover {
        background: rgba(52, 152, 219, 0.1);
    }
    
    /* Адаптивные стили */
    @media (max-width: 768px) {
        .test-stats,
        .exam-stats {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .module-test {
            padding: 15px;
            margin: 15px 0;
        }
        
        .quote-box {
            padding: 20px 15px;
            font-size: 1em;
        }
        
        .test-result-score {
            font-size: 2em;
        }
    }
    
    @media (max-width: 480px) {
        .test-stats,
        .exam-stats {
            grid-template-columns: 1fr;
        }
        
        .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
            margin: 5px 0;
        }
    }
    
    /* Стили для вкладок */
    .test-tab {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
        color: white !important;
        font-weight: bold !important;
    }
    
    .test-tab.completed {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
    }
</style>
`;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпатии загружается...");
    
    // Добавляем стили
    document.head.insertAdjacentHTML('beforeend', enhancedStyles);
    
    initTheme();
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    
    // Открываем последний сохраненный модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    } else {
        // Показываем приветственный экран
        showWelcomeScreen();
    }
});

// Инициализация прогресса
function initProgress() {
    const saved = localStorage.getItem('empathyCourseProgress');
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
            // Добавляем поле для итогового экзамена если его нет
            if (!userProgress.finalExamCompleted) {
                userProgress.finalExamCompleted = false;
                userProgress.finalExamScore = 0;
            }
        } catch (e) {
            console.error("Ошибка загрузки прогресса:", e);
            userProgress = getDefaultProgress();
        }
    } else {
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
        assignmentResults: {},
        finalExamCompleted: false,
        finalExamScore: 0,
        userName: "Гость"
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
    
    // Основной прогресс бар
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const mobileProgressText = document.querySelector('#mobileProgressText');
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `Прогресс: ${percent}%`;
    if (mobileProgressText) mobileProgressText.textContent = `${percent}%`;
    
    // Обновляем имя пользователя если есть
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = userProgress.userName || "Гость";
        }
    });
    
    // Кнопка итогового экзамена
    const finalExamBtn = document.getElementById('finalExamBtn');
    if (finalExamBtn) {
        const allModulesCompleted = userProgress.completedModules.length === courseData.modules.length;
        if (allModulesCompleted && !userProgress.finalExamCompleted) {
            finalExamBtn.classList.remove('disabled');
            finalExamBtn.onclick = openFinalExam;
        } else {
            finalExamBtn.classList.add('disabled');
            finalExamBtn.onclick = function(e) {
                e.preventDefault();
                if (!allModulesCompleted) {
                    alert(`Завершите все модули! Вы прошли ${userProgress.completedModules.length} из ${courseData.modules.length}.`);
                } else {
                    alert('Итоговый экзамен уже пройден!');
                }
            };
        }
    }
    
    // Сертификат
    const certBtn = document.getElementById('certificateBtn');
    if (certBtn) {
        if (userProgress.finalExamCompleted) {
            certBtn.classList.remove('disabled');
            certBtn.onclick = showCertificate;
        } else {
            certBtn.classList.add('disabled');
            certBtn.onclick = function(e) {
                e.preventDefault();
                alert('Сначала пройдите итоговый экзамен!');
            };
        }
    }
    
    // Обновляем прогресс модуля в заголовке
    updateModuleProgress();
}

// Обновление прогресса текущего модуля
function updateModuleProgress() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.submodules) return;
    
    const totalSubmodules = module.submodules.length;
    const completedInModule = module.submodules.filter(sub => 
        userProgress.completedSubmodules.includes(sub.id)
    ).length;
    
    const percent = totalSubmodules > 0 ? Math.round((completedInModule / totalSubmodules) * 100) : 0;
    
    const indicator = document.getElementById('moduleProgressIndicator');
    const progressFill = document.getElementById('moduleProgressFill');
    const progressPercent = document.getElementById('moduleProgressPercent');
    
    if (indicator && progressFill && progressPercent) {
        if (percent > 0 && percent < 100) {
            indicator.style.display = 'flex';
            progressFill.style.width = percent + '%';
            progressPercent.textContent = `${percent}%`;
        } else {
            indicator.style.display = 'none';
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
        
        // Добавляем иконку завершенности
        const completedIcon = userProgress.completedModules.includes(module.id) ? 
            '<i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i>' : 
            '<i class="far fa-circle" style="color: #ccc; margin-right: 8px;"></i>';
        
        moduleItem.innerHTML = `
            <h3>${completedIcon} ${module.title}</h3>
            <p>${module.description}</p>
            ${module.completed ? '<span class="module-completed">✓ Завершен</span>' : ''}
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
                
                // Иконка завершенности для подмодуля
                const subCompletedIcon = userProgress.completedSubmodules.includes(submodule.id) ? 
                    '<i class="fas fa-check" style="color: #2ecc71; margin-right: 8px; font-size: 0.8rem;"></i>' : 
                    '<i class="far fa-circle" style="color: #ccc; margin-right: 8px; font-size: 0.8rem;"></i>';
                
                submoduleItem.innerHTML = `<h4>${subCompletedIcon} ${submodule.title}</h4>`;
                
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
    
    // Скрываем тест и экзамен
    document.getElementById('testArea').style.display = 'none';
    document.getElementById('finalExamArea').style.display = 'none';
    
    // Обновляем заголовки
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleSubtitle').textContent = submodule.title;
    
    // Показываем контент
    document.getElementById('contentDisplay').style.display = 'block';
    document.getElementById('moduleTabs').style.display = 'flex';
    
    // Рендерим вкладки
    renderTabs(submodule);
    
    // Обновляем список модулей
    renderModulesList();
    
    // Обновляем прогресс модуля
    updateModuleProgress();
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
    
    // Кнопка контрольной работы модуля (если завершены все подмодули)
    const module = courseData.modules.find(m => 
        m.submodules && m.submodules.some(s => s.id === submodule.id)
    );
    
    if (module && module.test) {
        const moduleSubmodules = module.submodules || [];
        const allSubmodulesCompleted = moduleSubmodules.every(sub => 
            userProgress.completedSubmodules.includes(sub.id)
        );
        
        if (allSubmodulesCompleted && !userProgress.completedModules.includes(module.id)) {
            const testTab = document.createElement('div');
            testTab.className = 'tab test-tab';
            testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Пройти контрольную';
            testTab.addEventListener('click', () => showTestInfo(module.id));
            moduleTabs.appendChild(testTab);
        } else if (userProgress.completedModules.includes(module.id)) {
            const testTab = document.createElement('div');
            testTab.className = 'tab test-tab completed';
            testTab.innerHTML = '<i class="fas fa-check-circle"></i> Тест пройден';
            testTab.addEventListener('click', () => {
                showTestResultModal(module.id);
            });
            moduleTabs.appendChild(testTab);
        }
    }
    
    // Показываем первую вкладку
    if (tabNames.length > 0) {
        showTabContent(tabNames[0], submodule);
    }
}

// Показать информацию о контрольной работе
function showTestInfo(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Контрольная работа: ${module.title}`;
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #3498db;">${module.test.title}</h3>
                <p>${module.test.description}</p>
            </div>
            
            <div class="test-stats">
                <div class="test-stat">
                    <strong>${module.test.sections ? module.test.sections[0].questions.length : 0}</strong>
                    <span>теоретических вопросов</span>
                </div>
                <div class="test-stat">
                    <strong>${module.test.timeLimit || 30}</strong>
                    <span>минут на выполнение</span>
                </div>
                <div class="test-stat">
                    <strong>${module.test.passingScore || 35}</strong>
                    <span>проходной балл</span>
                </div>
                <div class="test-stat">
                    <strong>${module.test.totalPoints || 50}</strong>
                    <span>баллов всего</span>
                </div>
            </div>
            
            <div style="margin: 25px 0; padding: 20px; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
                <h4 style="color: #3498db; margin-bottom: 10px;">Структура работы:</h4>
                <ul style="margin-left: 20px; color: #e0e0e0;">
                    ${module.test.sections ? module.test.sections.map(section => 
                        `<li>${section.title}</li>`
                    ).join('') : ''}
                </ul>
            </div>
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="btn-primary" onclick="openTest(${moduleId}); document.getElementById('modalOverlay').style.display='none'" style="margin-right: 10px;">
                    <i class="fas fa-play"></i> Начать тест
                </button>
                <button class="btn-secondary" onclick="document.getElementById('modalOverlay').style.display='none'">
                    <i class="fas fa-times"></i> Отмена
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Показать результаты теста
function showTestResultModal(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    const result = userProgress.testResults[moduleId];
    
    if (!module || !result) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Результаты: ${module.test.title}`;
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: ${result.passed ? '#2ecc71' : '#e74c3c'};">${result.passed ? '✅ Тест пройден' : '❌ Тест не пройден'}</h3>
                <p>Модуль: <strong>${module.title}</strong></p>
            </div>
            
            <div class="exam-stats" style="margin: 20px 0;">
                <div class="exam-stat">
                    <strong>${result.score || 0}/${result.total || 0}</strong>
                    <span>Теоретические вопросы</span>
                </div>
                <div class="exam-stat">
                    <strong>${result.practicalScore || 0}</strong>
                    <span>Практические задания</span>
                </div>
                <div class="exam-stat">
                    <strong>${result.additionalScore || 0}</strong>
                    <span>Доп. задания</span>
                </div>
                <div class="exam-stat">
                    <strong>${result.totalPoints || 0}/${result.maxPoints || 0}</strong>
                    <span>Итого баллов</span>
                </div>
            </div>
            
            <div style="background: ${result.passed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'}; 
                     padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border-left: 4px solid ${result.passed ? '#2ecc71' : '#e74c3c'}">
                <h4 style="color: ${result.passed ? '#2ecc71' : '#e74c3c'}; margin-top: 0;">Итоговый результат</h4>
                <div style="font-size: 2em; font-weight: bold; color: ${result.passed ? '#2ecc71' : '#e74c3c'}">
                    ${result.totalPoints || 0}/${result.maxPoints || 0} баллов
                </div>
                <p style="margin-top: 10px; color: #95a5a6;">
                    Проходной балл: ${module.test.passingScore || 35}
                </p>
            </div>
            
            ${!result.passed ? `
                <div style="margin-top: 20px; padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
                    <h4 style="color: #e74c3c; margin-bottom: 10px;">Рекомендации:</h4>
                    <ul style="margin-left: 20px; color: #ccc;">
                        <li>Повторите теоретический материал модуля</li>
                        <li>Проработайте практические задания еще раз</li>
                        <li>Обратите внимание на объяснения к вопросам</li>
                        <li>Попробуйте пройти тест через 1-2 дня</li>
                    </ul>
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="btn-primary" onclick="document.getElementById('modalOverlay').style.display='none'">
                    <i class="fas fa-check"></i> Понятно
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Показ контента вкладки
function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!submodule.tabs[tabName]) {
        contentDisplay.innerHTML = '<p>Контент не найден</p>';
        return;
    }
    
    let content = submodule.tabs[tabName].content;
    
    // Преобразуем специальные классы для лучшего отображения
    if (tabName === 'quote') {
        content = content.replace('class="quote"', 'class="quote-box"')
                        .replace('class="author"', 'class="quote-author"');
    } else if (tabName === 'source') {
        content = content.replace('class="source"', 'class="source-box"');
    }
    
    contentDisplay.innerHTML = `
        <div class="tab-content active">
            ${content || '<p>Контент отсутствует</p>'}
        </div>
    `;
    
    // Инициализируем кнопки проверки заданий
    initCheckButtons();
}

// Инициализация кнопок проверки
function initCheckButtons() {
    console.log("Инициализация кнопок проверки...");
    
    // Находим все кнопки с классом btn-primary в contentDisplay
    const buttons = document.querySelectorAll('#contentDisplay .btn-primary');
    buttons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('checkAssignment')) {
            // Удаляем старый обработчик
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Добавляем новый обработчик с правильным submoduleId
            const match = onclickAttr.match(/checkAssignment\('([^']+)'\)/);
            if (match && match[1]) {
                newButton.addEventListener('click', function() {
                    checkAssignment(match[1]);
                });
                console.log("Кнопка настроена для подмодуля:", match[1]);
            }
        }
    });
    
    // Также обрабатываем кнопки btn-secondary
    const secondaryButtons = document.querySelectorAll('#contentDisplay .btn-secondary');
    secondaryButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('checkExtraAssignment')) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            const match = onclickAttr.match(/checkExtraAssignment\('([^']+)'\)/);
            if (match && match[1]) {
                newButton.addEventListener('click', function() {
                    checkExtraAssignment(match[1]);
                });
            }
        }
    });
}

// УЛУЧШЕННАЯ ПРОВЕРКА ЗАДАНИЯ
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
        showFeedback(feedbackElement, "❌ Пожалуйста, напишите ответ перед проверкой.", false);
        return;
    }
    
    // Проверка длины ответа
    const wordCount = answer.split(/\s+/).length;
    if (wordCount < 5) {
        showFeedback(feedbackElement, "❌ Ответ слишком короткий. Пожалуйста, напишите развернутый ответ (минимум 5 слов).", false);
        return;
    }
    
    console.log("Ответ пользователя (первые 100 символов):", answer.substring(0, 100) + "...");
    console.log("Количество слов:", wordCount);
    
    try {
        // Вызываем функцию проверки из данных
        const result = submodule.tabs.assignment.check(answer);
        
        console.log("Результат проверки:", result);
        
        showFeedback(feedbackElement, result.message, result.correct);
        
        // Если задание выполнено правильно
        if (result.correct) {
            if (!userProgress.completedSubmodules.includes(submoduleId)) {
                userProgress.completedSubmodules.push(submoduleId);
                
                // Добавляем анимацию успеха
                answerElement.style.borderColor = '#2ecc71';
                answerElement.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
                
                // Добавляем галочку к заголовку задания
                const assignmentHeader = answerElement.closest('.assignment')?.querySelector('h4');
                if (assignmentHeader && !assignmentHeader.querySelector('.fa-check-circle')) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check-circle';
                    checkIcon.style.color = '#2ecc71';
                    checkIcon.style.marginLeft = '10px';
                    checkIcon.style.animation = 'scaleIn 0.3s ease';
                    assignmentHeader.appendChild(checkIcon);
                }
                
                saveProgress();
                
                // Проверяем, все ли подмодули модуля завершены
                checkIfModuleCompleted(moduleId);
            }
        } else {
            // Анимация для неправильного ответа
            answerElement.style.borderColor = '#e74c3c';
            answerElement.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
        }
        
    } catch (error) {
        console.error("Ошибка при проверке задания:", error);
        showFeedback(feedbackElement, "❌ Произошла ошибка при проверке. Попробуйте еще раз.", false);
    }
    
    console.log("=== КОНЕЦ ПРОВЕРКИ ===");
}

// Вспомогательная функция для отображения обратной связи
function showFeedback(element, message, isCorrect) {
    element.textContent = message;
    element.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    element.style.display = "block";
    
    // Прокручиваем к фидбэку
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// РАСШИРЕННАЯ ПРОВЕРКА ДОПОЛНИТЕЛЬНОГО ЗАДАНИЯ
function checkExtraAssignment(submoduleId) {
    console.log("=== НАЧАЛО ПРОВЕРКИ ДОПОЛНИТЕЛЬНОГО ЗАДАНИЯ ===");
    
    // Находим текущий модуль и подмодуль
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Не найден модуль или подмодуль");
        return;
    }
    
    console.log("Проверка дополнительного задания для:", submoduleId);
    
    // Получаем все текстовые поля дополнительного задания
    const textareas = document.querySelectorAll(`textarea[id^="extra${submoduleId.replace('.', '_')}"]`);
    
    if (textareas.length === 0) {
        alert("Дополнительные задания не найдены на этой странице.");
        return;
    }
    
    // Проверяем, все ли поля заполнены
    let allFilled = true;
    const answers = [];
    
    textareas.forEach((textarea, index) => {
        const answer = textarea.value.trim();
        answers.push(answer);
        
        if (!answer) {
            allFilled = false;
            textarea.style.borderColor = '#e74c3c';
            textarea.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            
            // Анимация пустого поля
            textarea.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 300,
                iterations: 1
            });
        } else {
            textarea.style.borderColor = '#2ecc71';
            textarea.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
        }
    });
    
    if (!allFilled) {
        alert("❌ Пожалуйста, заполните все поля дополнительного задания.");
        return;
    }
    
    // Продвинутая проверка в зависимости от модуля
    let feedback = "";
    let allCorrect = true;
    
    switch(submoduleId) {
        case "1.1":
            // Проверка для модуля 1.1
            answers.forEach((answer, index) => {
                const wordCount = answer.split(/\s+/).length;
                if (wordCount < 3) {
                    feedback += `\n• Поле ${index + 1}: Слишком короткий ответ. Попробуйте написать более развернуто (минимум 3 слова).`;
                    allCorrect = false;
                }
            });
            
            if (allCorrect) {
                const hasEmpathyKeywords = answers.some(answer => 
                    answer.toLowerCase().includes("понимаю") || 
                    answer.toLowerCase().includes("представляю") ||
                    answer.toLowerCase().includes("чувствую")
                );
                
                const hasPityKeywords = answers.some(answer => 
                    answer.toLowerCase().includes("жалко") ||
                    answer.toLowerCase().includes("бедный") ||
                    answer.toLowerCase().includes("несчастный")
                );
                
                if (hasEmpathyKeywords && hasPityKeywords) {
                    feedback = "✅ Отлично! Вы четко разделили эмпатическую реакцию и реакцию жалости. Вы показали понимание ключевой разницы между этими подходами.";
                } else {
                    feedback = "⚠️ Хорошо, но попробуйте четче разделить реакции. Помните: эмпатия = понимание чувств на равных, жалость = сверху вниз.";
                    allCorrect = false;
                }
            }
            break;
            
        case "1.2":
            // Проверка для модуля 1.2
            const typesToCheck = ["когнитив", "эмоциональ", "сострада"];
            let foundTypes = 0;
            
            answers.forEach(answer => {
                typesToCheck.forEach(type => {
                    if (answer.toLowerCase().includes(type)) {
                        foundTypes++;
                    }
                });
            });
            
            if (foundTypes >= 2) {
                feedback = "✅ Отлично! Вы правильно определили разные виды эмпатии в предложенных ситуациях. Это показывает хорошее понимание теоретического материала.";
            } else {
                feedback = "⚠️ Попробуйте еще раз. Обратите внимание на различия между:\n• Когнитивной эмпатией (понимание мыслей)\n• Эмоциональной эмпатией (разделение чувств)\n• Сострадательной эмпатией (желание помочь)";
                allCorrect = false;
            }
            break;
            
        case "1.3":
            // Проверка для модуля 1.3
            let reflectionScore = 0;
            
            answers.forEach(answer => {
                const reflectionWords = ["интонация", "тон", "выражение", "поза", "взгляд", "жест"];
                let hasReflection = false;
                
                reflectionWords.forEach(word => {
                    if (answer.toLowerCase().includes(word)) {
                        hasReflection = true;
                    }
                });
                
                if (hasReflection) reflectionScore++;
                
                // Проверка глубины анализа
                if (answer.length > 20 && answer.split(/\s+/).length > 5) {
                    reflectionScore++;
                }
            });
            
            if (reflectionScore >= answers.length * 1.5) {
                feedback = "✅ Превосходно! Вы детально проанализировали невербальные аспекты эмпатии. Это показывает глубокое понимание важности языка тела в общении.";
            } else {
                feedback = "⚠️ Хорошее начало! Для более полного анализа обратите внимание на:\n• Тон голоса (теплый, спокойный)\n• Выражение лица (соответствующее эмоциям)\n• Позу тела (открытая, наклон вперед)\n• Зрительный контакт (умеренный)";
                allCorrect = false;
            }
            break;
            
        case "2.1":
            // Проверка для модуля 2.1
            let traumaUnderstanding = 0;
            
            answers.forEach(answer => {
                const traumaKeywords = ["субъектив", "восприятие", "внутренний", "переживание", "след", "реакция"];
                let hasKeywords = false;
                
                traumaKeywords.forEach(keyword => {
                    if (answer.toLowerCase().includes(keyword)) {
                        hasKeywords = true;
                    }
                });
                
                if (hasKeywords) traumaUnderstanding++;
                
                // Проверка глубины анализа
                if (answer.length > 30 && answer.split(/\s+/).length > 8) {
                    traumaUnderstanding++;
                }
            });
            
            if (traumaUnderstanding >= answers.length * 1.5) {
                feedback = "✅ Отличный анализ! Вы правильно поняли, что травма — это не событие, а его психологический след. Вы учитываете субъективность переживания.";
            } else {
                feedback = "⚠️ Попробуйте глубже проанализировать. Ключевые моменты:\n• Травма = внутренняя реакция, а не внешнее событие\n• Одно и то же событие может быть травмирующим для одного и нет для другого\n• Важно субъективное восприятие";
                allCorrect = false;
            }
            break;
            
        case "2.2":
            // Проверка для модуля 2.2
            let transformationScore = 0;
            
            answers.forEach((answer, index) => {
                // Проверяем, убраны ли токсичные элементы
                const toxicPhrases = ["не плачь", "хватит ныть", "возьми себя", "забудь", "все будет хорошо", "другим хуже"];
                let hasToxic = false;
                
                toxicPhrases.forEach(phrase => {
                    if (answer.toLowerCase().includes(phrase)) {
                        hasToxic = true;
                    }
                });
                
                if (!hasToxic) transformationScore++;
                
                // Проверяем наличие эмпатичных элементов
                const empathicPhrases = ["понимаю", "слышу тебя", "могу представить", "это тяжело", "имеешь право", "чувства важны"];
                let hasEmpathic = false;
                
                empathicPhrases.forEach(phrase => {
                    if (answer.toLowerCase().includes(phrase)) {
                        hasEmpathic = true;
                    }
                });
                
                if (hasEmpathic) transformationScore++;
            });
            
            if (transformationScore >= answers.length * 1.8) {
                feedback = "✅ Великолепно! Вы успешно трансформировали токсичные фразы в поддерживающие. Новые формулировки показывают уважение к чувствам человека.";
            } else {
                feedback = "⚠️ Хорошая попытка! Помните ключевые принципы:\n• Избегайте обесценивания ('не плачь', 'все будет хорошо')\n• Признавайте чувства ('я понимаю, что тебе тяжело')\n• Давайте право на переживания ('это нормально чувствовать так')";
                allCorrect = false;
            }
            break;
            
        case "2.3":
            // Проверка для модуля 2.3
            let safetyScore = 0;
            
            answers.forEach(answer => {
                const safetyKeywords = ["безопасность", "доверие", "выбор", "контроль", "уважение", "границы", "поддержка"];
                let hasKeywords = false;
                
                safetyKeywords.forEach(keyword => {
                    if (answer.toLowerCase().includes(keyword)) {
                        hasKeywords = true;
                    }
                });
                
                if (hasKeywords) safetyScore++;
                
                // Проверка конкретных предложений
                if (answer.toLowerCase().includes("можно") || 
                    answer.toLowerCase().includes("хочешь") ||
                    answer.toLowerCase().includes("предлагаю")) {
                    safetyScore++;
                }
            });
            
            if (safetyScore >= answers.length * 1.5) {
                feedback = "✅ Прекрасная работа! Ваши планы по созданию безопасного пространства учитывают ключевые принципы: уважение, выбор, доверие и поддержка без давления.";
            } else {
                feedback = "⚠️ Хороший подход. Для более полного плана учтите:\n• Предоставление выбора и контроля\n• Уважение к готовности/неготовности говорить\n• Обеспечение физической и эмоциональной безопасности\n• Избегание давления и требований";
                allCorrect = false;
            }
            break;
            
        default:
            // Общая проверка для остальных модулей
            let totalWords = 0;
            let qualityScore = 0;
            
            answers.forEach(answer => {
                const wordCount = answer.split(/\s+/).length;
                totalWords += wordCount;
                
                // Оценка качества
                if (wordCount >= 10) qualityScore++;
                if (answer.length > 50) qualityScore++;
                if (/[.!?]$/.test(answer.trim())) qualityScore++; // Завершенные предложения
            });
            
            const avgWords = totalWords / answers.length;
            
            if (avgWords >= 15 && qualityScore >= answers.length * 2) {
                feedback = "✅ Отличная работа! Ваши ответы развернуты, продуманы и демонстрируют хорошее понимание материала.";
            } else if (avgWords >= 10) {
                feedback = "⚠️ Неплохо! Для улучшения ответов:\n• Пишите более развернуто\n• Используйте примеры из теории\n• Структурируйте мысли\n• Проверяйте, полностью ли вы ответили на вопрос";
                allCorrect = false;
            } else {
                feedback = "❌ Ответы слишком краткие. Пожалуйста, напишите более подробные ответы, используя знания из урока.";
                allCorrect = false;
            }
    }
    
    // Показываем результат
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат проверки дополнительного задания';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: ${allCorrect ? '#2ecc71' : '#f39c12'};">${allCorrect ? '✅ Задание выполнено!' : '⚠️ Есть что улучшить'}</h3>
            </div>
            
            <div style="background: ${allCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(243, 156, 18, 0.1)'}; 
                     padding: 20px; border-radius: 10px; border-left: 4px solid ${allCorrect ? '#2ecc71' : '#f39c12'}; margin-bottom: 20px;">
                <h4 style="color: ${allCorrect ? '#2ecc71' : '#f39c12'}; margin-top: 0;">Обратная связь:</h4>
                <p style="white-space: pre-line; line-height: 1.6; color: #e0e0e0;">${feedback}</p>
            </div>
            
            ${!allCorrect ? `
                <div style="margin-top: 20px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 8px;">
                    <h4 style="color: #3498db; margin-bottom: 10px;">💡 Рекомендации для улучшения:</h4>
                    <ul style="margin-left: 20px; color: #ccc;">
                        <li>Перечитайте теоретический материал модуля</li>
                        <li>Используйте ключевые термины из урока</li>
                        <li>Приводите конкретные примеры</li>
                        <li>Пишите развернутые ответы (минимум 3-5 предложений)</li>
                        <li>Структурируйте мысли (можно использовать списки)</li>
                    </ul>
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="btn-primary" onclick="document.getElementById('modalOverlay').style.display='none'" style="padding: 12px 30px;">
                    Продолжить обучение
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    console.log("=== КОНЕЦ ПРОВЕРКИ ДОПОЛНИТЕЛЬНОГО ЗАДАНИЯ ===");
}

// Проверка завершения модуля
function checkIfModuleCompleted(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.submodules) return;
    
    const allSubmodulesCompleted = module.submodules.every(sub => 
        userProgress.completedSubmodules.includes(sub.id)
    );
    
    if (allSubmodulesCompleted && !userProgress.completedModules.includes(moduleId)) {
        // Показываем сообщение о завершении модуля
        setTimeout(() => {
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            modalTitle.textContent = '🎉 Модуль завершен!';
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #2ecc71;">Поздравляем!</h3>
                    <p>Вы успешно завершили модуль:</p>
                    <p style="font-size: 1.2rem; font-weight: bold; margin: 15px 0;">«${module.title}»</p>
                    <p>Теперь вы можете пройти контрольную работу модуля.</p>
                    <div style="margin-top: 20px;">
                        <button class="btn-primary" onclick="showTestInfo(${moduleId}); document.getElementById('modalOverlay').style.display='none';" style="margin-right: 10px;">
                            Пройти контрольную
                        </button>
                        <button class="btn-secondary" onclick="document.getElementById('modalOverlay').style.display='none'">
                            Позже
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('modalOverlay').style.display = 'flex';
        }, 500);
    }
}

// Открытие теста модуля
function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    // Скрываем контент и экзамен
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    document.getElementById('finalExamArea').style.display = 'none';
    
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    // Заполняем тест
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
    // Добавляем информацию о тесте
    const testInfo = document.createElement('div');
    testInfo.className = 'exam-stats';
    testInfo.innerHTML = `
        <div class="exam-stat">
            <strong>${module.test.sections ? module.test.sections[0].questions.length : 0}</strong>
            <span>теоретических вопросов</span>
        </div>
        <div class="exam-stat">
            <strong>${module.test.timeLimit || 30}</strong>
            <span>минут на выполнение</span>
        </div>
        <div class="exam-stat">
            <strong>${module.test.totalPoints}</strong>
            <span>баллов всего</span>
        </div>
        <div class="exam-stat">
            <strong>${module.test.passingScore}</strong>
            <span>проходной балл</span>
        </div>
    `;
    testContent.appendChild(testInfo);
    
    // Добавляем секции теста
    if (module.test.sections && Array.isArray(module.test.sections)) {
        module.test.sections.forEach((section, sectionIndex) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'test-section';
            
            sectionDiv.innerHTML = `
                <h3 class="test-section-title">${section.title}</h3>
            `;
            
            if (section.type === 'theory' && section.questions) {
                section.questions.forEach((question, questionIndex) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.className = 'test-question';
                    
                    let optionsHtml = '';
                    if (question.type === 'multiple-choice' && Array.isArray(question.options)) {
                        optionsHtml = `
                            <div class="test-options">
                                ${question.options.map((option, i) => `
                                    <div class="test-option">
                                        <input type="radio" name="question${sectionIndex}_${questionIndex}" value="${i}" id="q${sectionIndex}_${questionIndex}_opt${i}">
                                        <label for="q${sectionIndex}_${questionIndex}_opt${i}" class="test-option-label">${option}</label>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    } else if (question.type === 'true-false') {
                        optionsHtml = `
                            <div class="test-options">
                                <div class="test-option">
                                    <input type="radio" name="question${sectionIndex}_${questionIndex}" value="true" id="q${sectionIndex}_${questionIndex}_true">
                                    <label for="q${sectionIndex}_${questionIndex}_true" class="test-option-label">Верно</label>
                                </div>
                                <div class="test-option">
                                    <input type="radio" name="question${sectionIndex}_${questionIndex}" value="false" id="q${sectionIndex}_${questionIndex}_false">
                                    <label for="q${sectionIndex}_${questionIndex}_false" class="test-option-label">Неверно</label>
                                </div>
                            </div>
                        `;
                    }
                    
                    questionDiv.innerHTML = `
                        <h4>Вопрос ${questionIndex + 1}: ${question.question}</h4>
                        ${optionsHtml}
                    `;
                    sectionDiv.appendChild(questionDiv);
                });
            } else if (section.type === 'practical' && section.questions) {
                section.questions.forEach((task, taskIndex) => {
                    const taskDiv = document.createElement('div');
                    taskDiv.className = 'test-question';
                    
                    let taskContent = '';
                    if (task.type === 'situation-analysis') {
                        taskContent = `
                            <p>${task.question}</p>
                            <div class="situations">
                                ${task.situations ? task.situations.map((situation, i) => `
                                    <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                                        <p><strong>Ситуация ${i + 1}:</strong> ${situation.text}</p>
                                        <input type="text" placeholder="Ваш ответ" id="situation${taskIndex}_${i}" style="width: 100%; padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
                                    </div>
                                `).join('') : ''}
                            </div>
                        `;
                    } else if (task.type === 'scenario') {
                        taskContent = `
                            <p>${task.question}</p>
                            <ul style="margin-left: 20px;">
                                ${task.requirements ? task.requirements.map(req => `<li>${req}</li>`).join('') : ''}
                            </ul>
                            <textarea id="scenario${taskIndex}" placeholder="Напишите ваш ответ..." rows="5" style="width: 100%; margin-top: 10px;"></textarea>
                        `;
                    }
                    
                    taskDiv.innerHTML = taskContent;
                    sectionDiv.appendChild(taskDiv);
                });
            }
            
            testContent.appendChild(sectionDiv);
        });
    }
    
    // Кнопка отправки теста
    const submitBtn = document.createElement('div');
    submitBtn.style.marginTop = '30px';
    submitBtn.style.textAlign = 'center';
    submitBtn.innerHTML = `
        <button class="btn-primary" id="submitTestBtn" style="padding: 15px 40px; font-size: 1.1rem;">
            <i class="fas fa-paper-plane"></i> Отправить на проверку
        </button>
    `;
    testContent.appendChild(submitBtn);
}

// Отправка теста модуля
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.sections ? 
        (module.test.sections.find(s => s.type === 'theory')?.questions?.length || 0) : 0;
    let detailedResults = [];
    
    // Проверяем теоретические вопросы
    const theorySection = module.test.sections?.find(s => s.type === 'theory');
    if (theorySection && theorySection.questions) {
        theorySection.questions.forEach((question, index) => {
            const selected = document.querySelector(`input[name="question0_${index}"]:checked`);
            let isCorrect = false;
            
            if (question.type === 'multiple-choice') {
                isCorrect = selected && parseInt(selected.value) === question.correct;
            } else if (question.type === 'true-false') {
                isCorrect = selected && (selected.value === 'true') === question.correct;
            }
            
            if (isCorrect) {
                score++;
            }
            
            // Добавляем результат в детали
            detailedResults.push({
                question: question.question,
                isCorrect: isCorrect,
                explanation: question.explanation
            });
            
            // Подсвечиваем правильные/неправильные ответы
            if (selected) {
                const option = selected.closest('.test-option');
                if (option) {
                    option.classList.add(isCorrect ? 'option-correct' : 'option-incorrect');
                }
            }
        });
    }
    
    const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    
    // Проверка практических заданий (упрощенная)
    let practicalScore = 0;
    const practicalSection = module.test.sections?.find(s => s.type === 'practical');
    if (practicalSection && practicalSection.questions) {
        practicalSection.questions.forEach((task, index) => {
            if (task.type === 'scenario') {
                const answer = document.getElementById(`scenario${index}`)?.value || '';
                if (answer.trim().length > 50) {
                    practicalScore += task.points ? Math.round(task.points * 0.7) : 5;
                }
            }
        });
    }
    
    // Проверка практического задания из отдельной секции
    let assignmentScore = 0;
    const assignmentSection = module.test.sections?.find(s => s.type === 'assignment');
    if (assignmentSection) {
        assignmentScore = Math.round((assignmentSection.maxPoints || 10) * 0.6);
    }
    
    const totalPoints = score * 2 + practicalScore + assignmentScore;
    const maxPoints = (totalQuestions * 2) + 
                     (practicalSection?.questions?.reduce((sum, q) => sum + (q.points || 5), 0) || 0) +
                     (assignmentSection?.maxPoints || 0);
    
    const passed = totalPoints >= module.test.passingScore;
    
    // Сохраняем результат
    if (passed && !userProgress.completedModules.includes(moduleId)) {
        userProgress.completedModules.push(moduleId);
        module.completed = true;
        userProgress.testResults[moduleId] = {
            score: score,
            total: totalQuestions,
            percent: percent,
            practicalScore: practicalScore,
            assignmentScore: assignmentScore,
            totalPoints: totalPoints,
            maxPoints: maxPoints,
            passed: passed,
            date: new Date().toISOString()
        };
        saveProgress();
    }
    
    // Показываем результат
    showTestResult(moduleId, {
        score,
        totalQuestions,
        percent,
        practicalScore,
        assignmentScore,
        totalPoints,
        maxPoints,
        passed,
        detailedResults
    });
}

// Показать результат теста
function showTestResult(moduleId, result) {
    const module = courseData.modules.find(m => m.id === moduleId);
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат контрольной работы';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: ${result.passed ? '#2ecc71' : '#e74c3c'};">${result.passed ? '✅ Поздравляем!' : '❌ Попробуйте еще'}</h3>
                <p>Модуль: <strong>${module.title}</strong></p>
            </div>
            
            <div class="exam-stats" style="margin: 20px 0;">
                <div class="exam-stat">
                    <strong>${result.score}/${result.totalQuestions}</strong>
                    <span>Теоретическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong>${Math.round(result.practicalScore)}</strong>
                    <span>Практика</span>
                </div>
                <div class="exam-stat">
                    <strong>${result.assignmentScore}</strong>
                    <span>Задания</span>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, ${result.passed ? '#2ecc71' : '#e74c3c'} 0%, ${result.passed ? '#27ae60' : '#c0392b'} 100%); 
                     color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <h2 style="margin: 0; font-size: 2.5rem;">${result.totalPoints}/${result.maxPoints}</h2>
                <p style="margin: 10px 0 0 0; font-size: 1.1rem;">
                    ${result.passed ? 'Вы успешно прошли контрольную работу!' : `Необходимо набрать ${module.test.passingScore} баллов`}
                </p>
            </div>
            
            ${!result.passed ? `
                <div style="margin-top: 20px; padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
                    <h4 style="color: #e74c3c; margin-bottom: 10px;">Рекомендации:</h4>
                    <ul style="margin-left: 20px; color: #ccc;">
                        <li>Повторите теорию модуля</li>
                        <li>Пройдите практические задания еще раз</li>
                        <li>Обратите внимание на объяснения к вопросам</li>
                        <li>Попробуйте пройти тест через 1-2 дня</li>
                    </ul>
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="btn-primary" onclick="document.getElementById('modalOverlay').style.display='none'; openModule(${moduleId}, '${module.submodules[0].id}');" style="margin-right: 10px;">
                    <i class="fas fa-arrow-left"></i> Вернуться к модулю
                </button>
                ${!result.passed ? `
                    <button class="btn-secondary" onclick="openTest(${moduleId}); document.getElementById('modalOverlay').style.display='none'">
                        <i class="fas fa-redo"></i> Попробовать снова
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

// ОТКРЫТИЕ ИТОГОВОГО ЭКЗАМЕНА
function openFinalExam() {
    const exam = courseData.finalExam;
    
    if (!exam) {
        alert("Итоговый экзамен не найден!");
        return;
    }
    
    // Проверяем, все ли модули пройдены
    const allModulesCompleted = userProgress.completedModules.length === courseData.modules.length;
    if (!allModulesCompleted) {
        alert(`Сначала завершите все модули! Вы прошли ${userProgress.completedModules.length} из ${courseData.modules.length}.`);
        return;
    }
    
    if (userProgress.finalExamCompleted) {
        if (confirm("Итоговый экзамен уже пройден. Хотите пройти его снова?")) {
            userProgress.finalExamCompleted = false;
            userProgress.finalExamScore = 0;
            saveProgress();
        } else {
            return;
        }
    }
    
    // Скрываем контент и тесты
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    document.getElementById('testArea').style.display = 'none';
    
    const finalExamArea = document.getElementById('finalExamArea');
    finalExamArea.style.display = 'block';
    
    // Заполняем экзамен
    document.getElementById('finalExamTitle').textContent = exam.title;
    document.getElementById('finalExamDescription').textContent = exam.description;
    
    const examContent = document.getElementById('finalExamContent');
    examContent.innerHTML = '';
    
    // Добавляем статистику экзамена
    const examStats = document.createElement('div');
    examStats.className = 'exam-stats';
    examStats.innerHTML = `
        <div class="exam-stat">
            <strong>${exam.sections[0].questions.length}</strong>
            <span>теоретических вопросов</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.sections[1].tasks.length}</strong>
            <span>практических заданий</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.sections[2].tasks.length}</strong>
            <span>ситуационных анализов</span>
        </div>
        <div class="exam-stat">
            <strong>${parseInt(exam.scoring.total)}</strong>
            <span>баллов всего</span>
        </div>
        <div class="exam-stat">
            <strong>${parseInt(exam.scoring.passing)}</strong>
            <span>проходной балл</span>
        </div>
    `;
    examContent.appendChild(examStats);
    
    // Добавляем инструкцию
    const instruction = document.createElement('div');
    instruction.className = 'test-question';
    instruction.innerHTML = `
        <h4>Инструкция к итоговому экзамену</h4>
        <p>Итоговый экзамен проверяет ваши знания по всем 5 модулям курса.</p>
        <p><strong>Время выполнения:</strong> ${exam.timeLimit} минут</p>
        <p><strong>Структура экзамена:</strong></p>
        <ol>
            <li>Теоретическая часть (${exam.sections[0].questions.length} вопросов) — ${exam.scoring.theory}</li>
            <li>Практическая часть (${exam.sections[1].tasks.length} заданий) — ${exam.scoring.practical}</li>
            <li>Ситуационный анализ (${exam.sections[2].tasks.length} кейс) — ${exam.scoring.caseStudy}</li>
        </ol>
        <p><strong>Оценка:</strong> ${exam.scoring.passing} (${Math.round(parseInt(exam.scoring.passing) / parseInt(exam.scoring.total) * 100)}%)</p>
        <p style="color: #4a90e2; font-weight: bold;">Удачи!</p>
    `;
    examContent.appendChild(instruction);
    
    // Теоретические вопросы
    const theorySection = document.createElement('div');
    theorySection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Теоретическая часть</h3>`;
    examContent.appendChild(theorySection);
    
    exam.sections[0].questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'test-question';
        
        let optionsHtml = '';
        if (question.type === 'multiple-choice' && Array.isArray(question.options)) {
            optionsHtml = `
                <div class="test-options">
                    ${question.options.map((option, i) => `
                        <div class="test-option">
                            <input type="radio" name="theory${index}" value="${i}" id="theory${index}_opt${i}">
                            <label for="theory${index}_opt${i}" class="test-option-label">${option}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'true-false') {
            optionsHtml = `
                <div class="test-options">
                    <div class="test-option">
                        <input type="radio" name="theory${index}" value="true" id="theory${index}_true">
                        <label for="theory${index}_true" class="test-option-label">Верно</label>
                    </div>
                    <div class="test-option">
                        <input type="radio" name="theory${index}" value="false" id="theory${index}_false">
                        <label for="theory${index}_false" class="test-option-label">Неверно</label>
                    </div>
                </div>
            `;
        }
        
        questionDiv.innerHTML = `
            <h4>Вопрос ${index + 1}: ${question.question}</h4>
            ${optionsHtml}
        `;
        examContent.appendChild(questionDiv);
    });
    
    // Практические задания
    const practicalSection = document.createElement('div');
    practicalSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Практическая часть</h3>`;
    examContent.appendChild(practicalSection);
    
    exam.sections[1].tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'test-question';
        
        let taskContent = '';
        if (task.situation) {
            taskContent = `
                <h4>Задание ${index + 1}: ${task.task}</h4>
                <p><strong>Ситуация:</strong> ${task.situation}</p>
                <p><strong>Требования:</strong> ${task.requirements}</p>
                <p><strong>Максимальный балл:</strong> ${task.maxPoints}</p>
                <textarea id="practicalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="6" style="width: 100%; margin-top: 10px;"></textarea>
            `;
        } else {
            taskContent = `
                <h4>Задание ${index + 1}: ${task.task}</h4>
                <p><strong>Требования:</strong> ${task.requirements}</p>
                <p><strong>Максимальный балл:</strong> ${task.maxPoints}</p>
                <textarea id="practicalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="6" style="width: 100%; margin-top: 10px;"></textarea>
            `;
        }
        
        taskDiv.innerHTML = taskContent;
        examContent.appendChild(taskDiv);
    });
    
    // Ситуационный анализ
    const caseSection = document.createElement('div');
    caseSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Ситуационный анализ</h3>`;
    examContent.appendChild(caseSection);
    
    exam.sections[2].tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'test-question';
        
        taskDiv.innerHTML = `
            <h4>Кейс ${index + 1}: ${task.situation}</h4>
            <p><strong>Вопросы для анализа:</strong></p>
            <ol style="margin-left: 20px; margin-bottom: 20px;">
                ${task.questions.map((q, i) => `<li>${q}</li>`).join('')}
            </ol>
            <textarea id="caseExam${index}" placeholder="Напишите ваш анализ здесь..." rows="8" style="width: 100%; margin-top: 10px;"></textarea>
        `;
        examContent.appendChild(taskDiv);
    });
}

// ОТПРАВКА ИТОГОВОГО ЭКЗАМЕНА
function submitFinalExam() {
    const exam = courseData.finalExam;
    if (!exam) return;
    
    let theoryScore = 0;
    let practicalScore = 0;
    let caseScore = 0;
    
    // Проверка теоретических вопросов
    exam.sections[0].questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="theory${index}"]:checked`);
        let isCorrect = false;
        
        if (question.type === 'multiple-choice') {
            isCorrect = selected && parseInt(selected.value) === question.correct;
        } else if (question.type === 'true-false') {
            isCorrect = selected && (selected.value === 'true') === question.correct;
        }
        
        if (isCorrect) {
            theoryScore += 2; // 2 балла за каждый правильный теоретический вопрос
        }
    });
    
    // Проверка практических заданий (упрощенная проверка)
    exam.sections[1].tasks.forEach((task, index) => {
        const answer = document.getElementById(`practicalExam${index}`)?.value || '';
        if (answer.trim().length > 50) {
            // Базовый балл за наличие развернутого ответа
            practicalScore += Math.round(task.maxPoints * 0.6);
            
            // Дополнительные баллы за качество
            const keywords = ["эмпатия", "поддержка", "понимание", "слушание", "чувства", "границы"];
            let keywordCount = 0;
            keywords.forEach(keyword => {
                if (answer.toLowerCase().includes(keyword)) keywordCount++;
            });
            
            if (keywordCount >= 3) {
                practicalScore += Math.round(task.maxPoints * 0.2);
            }
        }
    });
    
    // Проверка ситуационного анализа
    exam.sections[2].tasks.forEach((task, index) => {
        const answer = document.getElementById(`caseExam${index}`)?.value || '';
        if (answer.trim().length > 100) {
            // Базовый балл за развернутый ответ
            caseScore += Math.round(15 * 0.5);
            
            // Дополнительные баллы за структуру
            if (answer.includes("1.") && answer.includes("2.") && answer.includes("3.")) {
                caseScore += Math.round(15 * 0.3);
            }
        }
    });
    
    const totalScore = theoryScore + practicalScore + caseScore;
    const maxScore = parseInt(exam.scoring.total);
    const passingScore = parseInt(exam.scoring.passing);
    const passed = totalScore >= passingScore;
    
    // Определяем оценку
    let grade = "F";
    let gradeText = "Не сдано";
    Object.entries(exam.scoring.gradingScale).forEach(([g, range]) => {
        const rangeMatch = range.match(/(\d+)-(\d+)/);
        if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            if (totalScore >= min && totalScore <= max) {
                grade = g;
                gradeText = range;
            }
        }
    });
    
    // Сохраняем результат
    userProgress.finalExamCompleted = true;
    userProgress.finalExamScore = totalScore;
    userProgress.finalExamGrade = grade;
    userProgress.finalExamDate = new Date().toISOString();
    saveProgress();
    
    // Показываем результаты
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результаты итогового экзамена';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: ${passed ? '#2ecc71' : '#e74c3c'}; font-size: 1.8rem;">
                    ${passed ? '🎉 Поздравляем!' : '😔 Попробуйте еще раз'}
                </h3>
                <p style="font-size: 1.2rem; margin: 10px 0;">Итоговая оценка: <strong style="color: ${passed ? '#2ecc71' : '#e74c3c'}">${grade} (${gradeText})</strong></p>
            </div>
            
            <div class="exam-stats" style="margin: 20px 0;">
                <div class="exam-stat">
                    <strong style="font-size: 1.8rem;">${theoryScore}/30</strong>
                    <span>Теоретическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong style="font-size: 1.8rem;">${practicalScore}/45</strong>
                    <span>Практическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong style="font-size: 1.8rem;">${caseScore}/15</strong>
                    <span>Ситуационный анализ</span>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, ${passed ? '#2ecc71' : '#e74c3c'} 0%, ${passed ? '#27ae60' : '#c0392b'} 100%); 
                     color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <h2 style="margin: 0; font-size: 2.5rem;">${totalScore}/${maxScore}</h2>
                <p style="margin: 10px 0 0 0; font-size: 1.1rem;">
                    ${passed ? 'Вы успешно прошли итоговый экзамен!' : `Необходимо набрать ${passingScore} баллов`}
                </p>
            </div>
            
            ${passed ? `
                <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">Теперь вы можете получить сертификат об окончании курса!</p>
                    <button class="btn-primary" onclick="showCertificate(); document.getElementById('modalOverlay').style.display='none';" style="font-size: 1.1rem; padding: 15px 30px;">
                        <i class="fas fa-award"></i> Получить сертификат
                    </button>
                </div>
            ` : `
                <div style="margin-top: 20px; padding: 20px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
                    <h4 style="color: #e74c3c; margin-bottom: 15px;">Рекомендации для улучшения результата:</h4>
                    <ul style="margin-left: 20px; color: #ccc;">
                        <li>Повторите теорию всех модулей</li>
                        <li>Отработайте практические задания</li>
                        <li>Обратите внимание на объяснения к вопросам</li>
                        <li>Попробуйте пройти экзамен через 2-3 дня</li>
                        <li>Используйте конспекты и ключевые термины</li>
                    </ul>
                    <p style="margin-top: 15px; color: #f39c12;">
                        <i class="fas fa-info-circle"></i> Вы можете пересдать экзамен в любое время
                    </p>
                </div>
            `}
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    // Обновляем UI (активируем кнопку сертификата)
    updateProgressUI();
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
                    <p>Комплексная проверка знаний</p>
                </div>
                <div class="feature">
                    <i class="fas fa-award"></i>
                    <h3>Именной сертификат</h3>
                    <p>Получите сертификат с вашим именем</p>
                </div>
            </div>
            
            <div class="module-test-button" style="margin-top: 40px;">
                <h3>Структура курса</h3>
                <p>Курс состоит из 5 модулей, каждый содержит:</p>
                <ul style="text-align: left; max-width: 600px; margin: 15px auto;">
                    <li>Теоретический материал с примерами</li>
                    <li>Практические задания с проверкой</li>
                    <li>Контрольную работу по модулю</li>
                    <li>Итоговый экзамен по всему курсу</li>
                </ul>
                <button onclick="openModule(1, '1.1')" class="btn-primary" style="margin-top: 20px; padding: 15px 30px; font-size: 1.1rem;">
                    <i class="fas fa-play-circle"></i> Начать обучение
                </button>
            </div>
        </div>
    `;
}

// Показать сертификат
function showCertificate() {
    if (!userProgress.finalExamCompleted) {
        alert('Сначала пройдите итоговый экзамен!');
        return;
    }
    
    // Создаем отдельное модальное окно для сертификата
    const certificateModal = document.createElement('div');
    certificateModal.className = 'certificate-modal-overlay';
    certificateModal.id = 'certificateModal';
    
    const exam = courseData.finalExam;
    const gradeInfo = userProgress.finalExamGrade ? exam.scoring.gradingScale[userProgress.finalExamGrade] || "Успешно завершено" : "Успешно завершено";
    
    certificateModal.innerHTML = `
        <div class="certificate-modal">
            <div class="certificate-modal-header">
                <h3>🎓 Ваш сертификат об окончании курса</h3>
                <button class="certificate-close-btn" id="closeCertificateBtn">&times;</button>
            </div>
            <div class="certificate-modal-body">
                <div class="certificate-container">
                    <div class="certificate">
                        <div class="certificate-border">
                            <div class="certificate-header">
                                <h1>СЕРТИФИКАТ</h1>
                                <p>о прохождении курса</p>
                            </div>
                            
                            <div class="certificate-body">
                                <h2>«Эмпатия и поддержка в общении»</h2>
                                
                                <div class="certificate-award">
                                    <i class="fas fa-award"></i>
                                </div>
                                
                                <div class="certificate-text">
                                    Настоящим удостоверяется, что
                                </div>
                                
                                <div class="certificate-name">
                                    ${userProgress.userName || "Ученик"}
                                </div>
                                
                                <div class="certificate-text">
                                    успешно завершил(а) полный курс обучения, состоящий из 5 модулей,<br>
                                    и проявил(а) высокий уровень компетенций в области эмпатии и поддержки.
                                </div>
                                
                                <div class="certificate-details">
                                    <div class="detail">
                                        <strong>Дата выдачи</strong>
                                        <p>${new Date().toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div class="detail">
                                        <strong>Итоговая оценка</strong>
                                        <p>${gradeInfo}</p>
                                    </div>
                                    <div class="detail">
                                        <strong>Результат экзамена</strong>
                                        <p>${userProgress.finalExamScore} баллов из ${exam.scoring.total}</p>
                                    </div>
                                    <div class="detail">
                                        <strong>ID сертификата</strong>
                                        <p>EMP-${Date.now().toString().slice(-8)}</p>
                                    </div>
                                </div>
                                
                                <div style="margin: 30px 0; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                                    <h4 style="color: #2c3e50; margin-bottom: 15px;">Пройденные модули:</h4>
                                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                                        ${courseData.modules.map(module => `
                                            <span style="background: #e8f4fc; color: #2c3e50; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">
                                                ${module.title.split('.')[1]}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="certificate-footer">
                                <div class="signature">
                                    <div class="signature-line"></div>
                                    <p>Директор курса</p>
                                    <p>Д-р псих. наук</p>
                                </div>
                                
                                <div class="logo-cert">
                                    <i class="fas fa-heart"></i>
                                    <span>Курс Эмпатии</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="certificate-actions">
                <button class="btn-primary" onclick="printCertificate()">
                    <i class="fas fa-print"></i> Распечатать
                </button>
                <button class="btn-secondary" onclick="saveCertificateAsImage()">
                    <i class="fas fa-download"></i> Сохранить
                </button>
                <button class="btn-secondary" onclick="shareCertificate()">
                    <i class="fas fa-share-alt"></i> Поделиться
                </button>
            </div>
            
            <div class="certificate-note">
                <p><i class="fas fa-info-circle"></i> Сертификат можно проверить по ID: EMP-${Date.now().toString().slice(-8)}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(certificateModal);
    
    // Обработчик закрытия
    document.getElementById('closeCertificateBtn').onclick = () => {
        document.body.removeChild(certificateModal);
    };
    
    // Закрытие при клике на фон
    certificateModal.onclick = (e) => {
        if (e.target === certificateModal) {
            document.body.removeChild(certificateModal);
        }
    };
}

// Функции для работы с сертификатом
function printCertificate() {
    const certificateElement = document.querySelector('.certificate');
    if (certificateElement) {
        const originalContent = document.body.innerHTML;
        const certificateContent = certificateElement.innerHTML;
        
        document.body.innerHTML = `
            <html>
                <head>
                    <title>Сертификат - ${userProgress.userName}</title>
                    <style>
                        @media print {
                            body { margin: 0; padding: 20px; background: white !important; }
                            .certificate { 
                                background: white !important; 
                                color: black !important;
                                border: 20px solid #f8d7da !important;
                                box-shadow: none !important;
                            }
                            .certificate-actions { display: none !important; }
                            .certificate-note { display: none !important; }
                        }
                        .certificate { 
                            background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
                            border: 20px solid #f8d7da;
                            padding: 40px;
                            border-radius: 20px;
                            color: #333333;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .certificate-border {
                            border: 2px solid #e74c3c;
                            padding: 30px;
                            position: relative;
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">${certificateContent}</div>
                    <script>
                        window.print();
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    <\/script>
                </body>
            </html>
        `;
        
        window.print();
    }
}

function saveCertificateAsImage() {
    alert('Для сохранения сертификата как изображения:\n1. Нажмите "Распечатать"\n2. В диалоге печати выберите "Сохранить как PDF"\n3. Или сделайте скриншот сертификата');
}

function shareCertificate() {
    if (navigator.share) {
        navigator.share({
            title: 'Мой сертификат по курсу эмпатии',
            text: `Я завершил(а) курс "Эмпатия и поддержка в общении" с оценкой ${userProgress.finalExamGrade}!`,
            url: window.location.href
        });
    } else {
        const shareText = `Я завершил(а) курс "Эмпатия и поддержка в общении"! Результат: ${userProgress.finalExamScore} баллов, оценка: ${userProgress.finalExamGrade}.`;
        prompt('Скопируйте эту ссылку, чтобы поделиться:', shareText);
    }
}

// Сброс прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?\nВсе данные будут удалены, включая результаты тестов и экзамена.")) {
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
    const savedTheme = localStorage.getItem('empathyCourseTheme') || 'dark';
    setTheme(savedTheme);
}

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    console.log('Тема установлена:', theme);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка отправки теста модуля
    const submitBtn = document.getElementById('submitTestBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitTest);
    }
    
    // Кнопка закрытия теста
    const closeTestBtn = document.getElementById('closeTestBtn');
    if (closeTestBtn) {
        closeTestBtn.addEventListener('click', () => {
            document.getElementById('testArea').style.display = 'none';
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        });
    }
    
    // Кнопка отправки итогового экзамена
    const submitFinalExamBtn = document.getElementById('submitFinalExamBtn');
    if (submitFinalExamBtn) {
        submitFinalExamBtn.addEventListener('click', submitFinalExam);
    }
    
    // Кнопка закрытия итогового экзамена
    const closeFinalExamBtn = document.getElementById('closeFinalExamBtn');
    if (closeFinalExamBtn) {
        closeFinalExamBtn.addEventListener('click', () => {
            document.getElementById('finalExamArea').style.display = 'none';
            showWelcomeScreen();
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
    
    // Обработчик для профиля
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function(e) {
            if (!e.target.closest('.profile-menu')) {
                showNameInput('login');
            }
        });
    }
}

// Показать ввод имени
function showNameInput(type) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = type === 'login' ? 'Вход в аккаунт' : 'Регистрация';
    modalBody.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <div class="name-input-container">
                <label for="userNameInput" style="display: block; margin-bottom: 10px; color: #f5f5f5;">Введите ваше имя для сертификата:</label>
                <input type="text" id="userNameInput" placeholder="Иван Иванов" value="${userProgress.userName || ''}" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #3498db; background: #2a2a2a; color: white;">
                <p style="margin-top: 8px; font-size: 0.9rem; color: #888;">Имя будет отображаться в сертификате</p>
            </div>
            <button class="btn-primary" onclick="submitName('${type}')" style="margin-top: 20px; width: 100%; padding: 12px;">
                ${type === 'login' ? 'Сохранить имя' : 'Зарегистрироваться'}
            </button>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    // Фокус на поле ввода
    setTimeout(() => {
        const input = document.getElementById('userNameInput');
        if (input) {
            input.focus();
            input.select();
        }
    }, 100);
}

// Отправить имя
function submitName(type) {
    const userNameInput = document.getElementById('userNameInput');
    const name = userNameInput.value.trim();
    
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    if (name.length > 30) {
        alert('Имя слишком длинное. Максимум 30 символов.');
        return;
    }
    
    userProgress.userName = name;
    saveProgress();
    
    document.getElementById('modalOverlay').style.display = 'none';
    alert(`Имя сохранено: ${name}! Теперь оно будет отображаться в сертификате.`);
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.checkExtraAssignment = checkExtraAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;
window.showWelcomeScreen = showWelcomeScreen;
window.showNameInput = showNameInput;
window.submitName = submitName;
window.printCertificate = printCertificate;
window.saveCertificateAsImage = saveCertificateAsImage;
window.shareCertificate = shareCertificate;
window.openFinalExam = openFinalExam;
window.submitFinalExam = submitFinalExam;
window.openTest = openTest;
window.submitTest = submitTest;
window.showTestInfo = showTestInfo;

console.log("✅ Курс эмпатии загружен и готов к работе!");
