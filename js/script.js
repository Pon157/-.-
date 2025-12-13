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
            testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Пройти тест';
            testTab.addEventListener('click', () => openTest(module.id));
            moduleTabs.appendChild(testTab);
        } else if (userProgress.completedModules.includes(module.id)) {
            const testTab = document.createElement('div');
            testTab.className = 'tab test-tab completed';
            testTab.innerHTML = '<i class="fas fa-check-circle"></i> Тест пройден';
            testTab.addEventListener('click', () => {
                alert(`Тест модуля уже пройден! Результат: ${userProgress.testResults[module.id]?.percent || 0}%`);
            });
            moduleTabs.appendChild(testTab);
        }
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
            ${submodule.tabs[tabName].content || '<p>Контент отсутствует</p>'}
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

// Проверка дополнительного задания
function checkExtraAssignment(submoduleId) {
    const answerId = 'extra' + submoduleId.replace('.', '_') + 'a';
    const answerElement = document.getElementById(answerId);
    
    if (!answerElement || !answerElement.value.trim()) {
        alert("Пожалуйста, заполните все поля дополнительного задания.");
        return;
    }
    
    // Улучшенная проверка дополнительных заданий
    const answer = answerElement.value.trim();
    const wordCount = answer.split(/\s+/).length;
    
    if (wordCount < 3) {
        alert("❌ Ответ слишком короткий. Пожалуйста, напишите развернутый ответ.");
        return;
    }
    
    // Простая проверка по наличию ключевых слов
    const positiveKeywords = ["понима", "поддерж", "эмпат", "слуша", "чувств"];
    let hasKeywords = false;
    
    positiveKeywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) {
            hasKeywords = true;
        }
    });
    
    if (hasKeywords) {
        alert("✅ Дополнительное задание выполнено хорошо! Вы использовали правильные термины.");
    } else {
        alert("⚠️ Попробуйте использовать термины из урока: 'понимание', 'поддержка', 'эмпатия', 'чувства'.");
    }
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
                        <button class="btn-primary" onclick="openTest(${moduleId}); document.getElementById('modalOverlay').style.display='none';" style="margin-right: 10px;">
                            Пройти тест
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
            <strong>${module.test.questions ? module.test.questions.length : 0}</strong>
            <span>вопросов</span>
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
    
    // Вопросы
    if (module.test.questions && Array.isArray(module.test.questions)) {
        module.test.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'test-question';
            
            let optionsHtml = '';
            if (question.type === 'multiple-choice' && Array.isArray(question.options)) {
                optionsHtml = `
                    <div class="test-options">
                        ${question.options.map((option, i) => `
                            <div class="test-option">
                                <input type="radio" name="question${index}" value="${i}" id="q${index}_opt${i}">
                                <label for="q${index}_opt${i}" class="test-option-label">${option}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (question.type === 'true-false') {
                optionsHtml = `
                    <div class="test-options">
                        <div class="test-option">
                            <input type="radio" name="question${index}" value="true" id="q${index}_true">
                            <label for="q${index}_true" class="test-option-label">Верно</label>
                        </div>
                        <div class="test-option">
                            <input type="radio" name="question${index}" value="false" id="q${index}_false">
                            <label for="q${index}_false" class="test-option-label">Неверно</label>
                        </div>
                    </div>
                `;
            }
            
            questionDiv.innerHTML = `
                <h4>Вопрос ${index + 1}: ${question.question}</h4>
                ${optionsHtml}
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
            <p><strong>Критерии оценки:</strong></p>
            <ul>
                ${module.test.practical.scoringCriteria ? module.test.practical.scoringCriteria.map(criterion => 
                    `<li>${criterion}</li>`
                ).join('') : ''}
            </ul>
            <p><strong>Максимальный балл:</strong> ${module.test.practical.maxPoints || 10}</p>
            <textarea id="practicalAnswer" placeholder="Напишите ваш ответ..." rows="5" style="width: 100%; margin-top: 10px;"></textarea>
        `;
        testContent.appendChild(practicalDiv);
    }
    
    // Дополнительные задания
    if (module.test.additionalTasks && Array.isArray(module.test.additionalTasks)) {
        module.test.additionalTasks.forEach((additionalTask, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'test-question';
            taskDiv.innerHTML = `
                <h4>Дополнительное задание ${index + 1}</h4>
                <p>${additionalTask.task}</p>
                <p><strong>Баллов:</strong> ${additionalTask.points || 5}</p>
                <textarea id="additionalAnswer${index}" placeholder="Напишите ваш ответ..." rows="3" style="width: 100%; margin-top: 10px;"></textarea>
            `;
            testContent.appendChild(taskDiv);
        });
    }
}

// Отправка теста модуля
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.questions ? module.test.questions.length : 0;
    let detailedResults = [];
    
    // Проверяем вопросы
    if (module.test.questions && Array.isArray(module.test.questions)) {
        module.test.questions.forEach((question, index) => {
            const selected = document.querySelector(`input[name="question${index}"]:checked`);
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
    
    // Проверка практического задания
    let practicalScore = 0;
    const practicalAnswer = document.getElementById('practicalAnswer')?.value || '';
    if (practicalAnswer.trim().length > 20) {
        practicalScore = module.test.practical ? Math.round((module.test.practical.maxPoints || 10) * 0.7) : 0;
    }
    
    // Проверка дополнительных заданий
    let additionalScore = 0;
    if (module.test.additionalTasks) {
        module.test.additionalTasks.forEach((task, index) => {
            const answer = document.getElementById(`additionalAnswer${index}`)?.value || '';
            if (answer.trim().length > 10) {
                additionalScore += Math.round((task.points || 5) * 0.6);
            }
        });
    }
    
    const totalPoints = score * 2 + practicalScore + additionalScore;
    const maxPoints = (totalQuestions * 2) + (module.test.practical ? module.test.practical.maxPoints : 0) + 
                     (module.test.additionalTasks ? module.test.additionalTasks.reduce((sum, task) => sum + (task.points || 0), 0) : 0);
    
    const passed = totalPoints >= module.test.passingScore;
    
    // Показываем результат
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат теста';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: ${passed ? '#2ecc71' : '#e74c3c'};">${passed ? '✅ Поздравляем!' : '❌ Попробуйте еще'}</h3>
            </div>
            
            <div class="exam-stats" style="margin: 20px 0;">
                <div class="exam-stat">
                    <strong>${score}/${totalQuestions}</strong>
                    <span>Теоретическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong>${Math.round(practicalScore)}</strong>
                    <span>Практика</span>
                </div>
                <div class="exam-stat">
                    <strong>${additionalScore}</strong>
                    <span>Доп. задания</span>
                </div>
            </div>
            
            <div style="background: var(--card-bg); padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="text-align: center; font-size: 1.2rem;">
                    <strong>Итого: ${totalPoints} из ${maxPoints} баллов</strong><br>
                    <span style="color: ${passed ? '#2ecc71' : '#e74c3c'};">${passed ? 'Тест пройден!' : 'Необходимо набрать минимум ' + module.test.passingScore + ' баллов'}</span>
                </p>
            </div>
            
            ${!passed ? `
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
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    // Сохраняем результат
    if (passed && !userProgress.completedModules.includes(moduleId)) {
        userProgress.completedModules.push(moduleId);
        module.completed = true;
        userProgress.testResults[moduleId] = {
            score: score,
            total: totalQuestions,
            percent: percent,
            practicalScore: practicalScore,
            additionalScore: additionalScore,
            totalPoints: totalPoints,
            maxPoints: maxPoints,
            passed: passed,
            date: new Date().toISOString()
        };
        saveProgress();
    }
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
            <strong>${exam.theoryQuestions.length}</strong>
            <span>теоретических вопросов</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.practicalTasks.length}</strong>
            <span>практических заданий</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.additionalTasks.length}</strong>
            <span>дополнительных заданий</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.scoring.total}</strong>
            <span>баллов всего</span>
        </div>
        <div class="exam-stat">
            <strong>${exam.scoring.passing}</strong>
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
        <p><strong>Время выполнения:</strong> Не ограничено (рекомендуется 60-90 минут)</p>
        <p><strong>Структура экзамена:</strong></p>
        <ol>
            <li>Теоретическая часть (15 вопросов) — ${exam.scoring.theory}</li>
            <li>Практическая часть (5 заданий) — ${exam.scoring.practical}</li>
            <li>Дополнительные задания (2 задания) — ${exam.scoring.additional}</li>
        </ol>
        <p><strong>Оценка:</strong> ${exam.scoring.passing}</p>
        <p style="color: #4a90e2; font-weight: bold;">Удачи!</p>
    `;
    examContent.appendChild(instruction);
    
    // Теоретические вопросы
    const theorySection = document.createElement('div');
    theorySection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Теоретическая часть</h3>`;
    examContent.appendChild(theorySection);
    
    exam.theoryQuestions.forEach((question, index) => {
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
            <h4>Теоретический вопрос ${index + 1}: ${question.question}</h4>
            ${optionsHtml}
        `;
        examContent.appendChild(questionDiv);
    });
    
    // Практические задания
    const practicalSection = document.createElement('div');
    practicalSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Практическая часть</h3>`;
    examContent.appendChild(practicalSection);
    
    exam.practicalTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'test-question';
        taskDiv.innerHTML = `
            <h4>Практическое задание ${index + 1}: ${task.task}</h4>
            ${task.situation ? `<p><strong>Ситуация:</strong> ${task.situation}</p>` : ''}
            <p><strong>Требования:</strong> ${task.requirements}</p>
            <p><strong>Максимальный балл:</strong> ${task.maxPoints}</p>
            <textarea id="practicalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="6" style="width: 100%; margin-top: 10px;"></textarea>
            <div class="assignment-hint" style="margin-top: 10px;">
                <i class="fas fa-lightbulb"></i>
                <strong>Подсказка:</strong> Обратите внимание на критерии оценки: ${task.scoringCriteria ? task.scoringCriteria.join(', ') : 'полнота и точность ответа'}.
            </div>
        `;
        examContent.appendChild(taskDiv);
    });
    
    // Дополнительные задания
    const additionalSection = document.createElement('div');
    additionalSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: #ffffff;">Дополнительные задания</h3>`;
    examContent.appendChild(additionalSection);
    
    exam.additionalTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'test-question';
        taskDiv.innerHTML = `
            <h4>Дополнительное задание ${index + 1}: ${task.type === 'case-analysis' ? 'Анализ кейса' : 'Саморефлексия'}</h4>
            <p><strong>Задание:</strong> ${task.task}</p>
            <p><strong>Требования:</strong> ${task.requirements}</p>
            <p><strong>Максимальный балл:</strong> ${task.maxPoints}</p>
            <textarea id="additionalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="8" style="width: 100%; margin-top: 10px;"></textarea>
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
    let additionalScore = 0;
    
    // Проверка теоретических вопросов
    exam.theoryQuestions.forEach((question, index) => {
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
    exam.practicalTasks.forEach((task, index) => {
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
    
    // Проверка дополнительных заданий
    exam.additionalTasks.forEach((task, index) => {
        const answer = document.getElementById(`additionalExam${index}`)?.value || '';
        if (answer.trim().length > 100) {
            // Базовый балл за развернутый ответ
            additionalScore += Math.round(task.maxPoints * 0.5);
            
            // Дополнительные баллы за структуру
            if (answer.includes("1.") && answer.includes("2.") && answer.includes("3.")) {
                additionalScore += Math.round(task.maxPoints * 0.3);
            }
        }
    });
    
    const totalScore = theoryScore + practicalScore + additionalScore;
    const maxScore = parseInt(exam.scoring.total);
    const passingScore = parseInt(exam.scoring.passing.split(' ')[0]);
    const passed = totalScore >= passingScore;
    
    // Определяем оценку
    let grade = "F";
    let gradeText = "Не сдано";
    Object.entries(exam.scoring.grades).forEach(([g, range]) => {
        const rangeMatch = range.match(/(\d+)-(\d+)/);
        if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            if (totalScore >= min && totalScore <= max) {
                grade = g;
                gradeText = range.split('(')[1].replace(')', '');
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
                    <strong style="font-size: 1.8rem;">${theoryScore}/${exam.scoring.theory.split(' ')[0]}</strong>
                    <span>Теоретическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong style="font-size: 1.8rem;">${practicalScore}/${exam.scoring.practical.split(' ')[0]}</strong>
                    <span>Практическая часть</span>
                </div>
                <div class="exam-stat">
                    <strong style="font-size: 1.8rem;">${additionalScore}/${exam.scoring.additional.split(' ')[0]}</strong>
                    <span>Дополнительные задания</span>
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
    const gradeInfo = exam.scoring.grades[userProgress.finalExamGrade] || "Успешно завершено";
    
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
                                        <p>${userProgress.finalExamScore} баллов</p>
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

console.log("✅ Курс эмпатии загружен и готов к работе!");
