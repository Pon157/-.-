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
        userName: "Ученик"
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
    
    // Обновляем имя пользователя если есть
    const userNameElements = document.querySelectorAll('#userName, #dropdownUserName');
    userNameElements.forEach(el => {
        if (el && userProgress.userName) {
            el.textContent = userProgress.userName;
        }
    });
    
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
    
    // Кнопка контрольной работы (только если есть тест у модуля)
    const module = courseData.modules.find(m => 
        m.submodules && m.submodules.some(s => s.id === submodule.id)
    );
    
    if (module && module.test) {
        const testTab = document.createElement('div');
        testTab.className = 'tab';
        testTab.innerHTML = '<i class="fas fa-clipboard-check"></i> Тест';
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

// Проверка дополнительного задания
function checkExtraAssignment(submoduleId) {
    alert("Дополнительное задание отправлено на проверку!");
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
    if (module.test.questions && Array.isArray(module.test.questions)) {
        module.test.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'test-question';
            
            let optionsHtml = '';
            if (question.type === 'multiple-choice' && Array.isArray(question.options)) {
                optionsHtml = question.options.map((option, i) => `
                    <label style="display: block; margin: 8px 0; padding: 8px 12px; background: var(--hover-color); border-radius: 6px;">
                        <input type="radio" name="question${index}" value="${i}" style="margin-right: 10px;">
                        ${option}
                    </label>
                `).join('');
            } else if (question.type === 'true-false') {
                optionsHtml = `
                    <label style="display: block; margin: 8px 0; padding: 8px 12px; background: var(--hover-color); border-radius: 6px;">
                        <input type="radio" name="question${index}" value="true" style="margin-right: 10px;">
                        Верно
                    </label>
                    <label style="display: block; margin: 8px 0; padding: 8px 12px; background: var(--hover-color); border-radius: 6px;">
                        <input type="radio" name="question${index}" value="false" style="margin-right: 10px;">
                        Неверно
                    </label>
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

// Отправка теста
function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.questions ? module.test.questions.length : 0;
    
    // Проверяем вопросы
    if (module.test.questions && Array.isArray(module.test.questions)) {
        module.test.questions.forEach((question, index) => {
            const selected = document.querySelector(`input[name="question${index}"]:checked`);
            if (question.type === 'multiple-choice') {
                if (selected && parseInt(selected.value) === question.correct) {
                    score++;
                }
            } else if (question.type === 'true-false') {
                if (selected && (selected.value === 'true') === question.correct) {
                    score++;
                }
            }
        });
    }
    
    const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    
    // Практическое задание (упрощенная проверка)
    let practicalScore = 0;
    const practicalAnswer = document.getElementById('practicalAnswer')?.value || '';
    if (practicalAnswer.trim().length > 10) {
        practicalScore = module.test.practical ? (module.test.practical.maxPoints || 10) * 0.7 : 0;
    }
    
    const totalPoints = score * 2 + practicalScore; // Примерная система баллов
    const maxPoints = totalQuestions * 2 + (module.test.practical ? module.test.practical.maxPoints : 0);
    const passed = percent >= 70;
    
    // Показываем результат
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Результат теста';
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: ${passed ? '#2ecc71' : '#e74c3c'};">${passed ? '✅ Поздравляем!' : '❌ Попробуйте еще'}</h3>
            <p>Теоретическая часть: ${score} из ${totalQuestions} (${percent}%)</p>
            <p>Практическая часть: ${Math.round(practicalScore)} баллов</p>
            <p><strong>Итого: ${totalPoints} из ${maxPoints} баллов</strong></p>
            <p style="margin-top: 20px;"><strong>${passed ? 'Тест пройден!' : 'Нужно набрать минимум 70% по теории и выполнить практику'}</strong></p>
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
            passed: passed
        };
        saveProgress();
    }
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
                    <h3>Именной сертификат</h3>
                    <p>Получите сертификат с вашим именем</p>
                </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
                <p class="start-instruction">Начните обучение, выбрав модуль слева</p>
                <button onclick="openModule(1, '1.1')" class="btn-primary" style="margin-top: 20px; padding: 15px 30px; font-size: 1.1rem;">
                    <i class="fas fa-play-circle"></i> Начать обучение
                </button>
            </div>
        </div>
    `;
}

// Показать сертификат
function showCertificate() {
    const total = courseData.modules.length;
    const completed = userProgress.completedModules.length;
    
    if (completed < total) {
        alert(`Завершите все модули! Вы прошли ${completed} из ${total}.`);
        return;
    }
    
    // Создаем отдельное модальное окно для сертификата
    const certificateModal = document.createElement('div');
    certificateModal.className = 'certificate-modal-overlay';
    certificateModal.id = 'certificateModal';
    certificateModal.innerHTML = `
        <div class="certificate-modal">
            <div class="certificate-modal-header">
                <h3>🎓 Ваш сертификат</h3>
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
                                    и проявил(а) высокий уровень компетенций в области:
                                </div>
                                
                                <div style="margin: 30px 0; text-align: left; max-width: 600px; margin: 30px auto;">
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="margin: 10px 0; padding-left: 20px; position: relative;">
                                            <i class="fas fa-check" style="position: absolute; left: 0; color: #2ecc71;"></i>
                                            Понимание основ эмпатии и ее видов
                                        </li>
                                        <li style="margin: 10px 0; padding-left: 20px; position: relative;">
                                            <i class="fas fa-check" style="position: absolute; left: 0; color: #2ecc71;"></i>
                                            Общение с людьми, пережившими травму
                                        </li>
                                        <li style="margin: 10px 0; padding-left: 20px; position: relative;">
                                            <i class="fas fa-check" style="position: absolute; left: 0; color: #2ecc71;"></i>
                                            Техники активного слушания
                                        </li>
                                        <li style="margin: 10px 0; padding-left: 20px; position: relative;">
                                            <i class="fas fa-check" style="position: absolute; left: 0; color: #2ecc71;"></i>
                                            Поддержка без давления
                                        </li>
                                        <li style="margin: 10px 0; padding-left: 20px; position: relative;">
                                            <i class="fas fa-check" style="position: absolute; left: 0; color: #2ecc71;"></i>
                                            Самоподдержка и установление границ
                                        </li>
                                    </ul>
                                </div>
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
                                    <strong>Результат</strong>
                                    <p>Отлично</p>
                                </div>
                                <div class="detail">
                                    <strong>ID сертификата</strong>
                                    <p>EMP-${Date.now().toString().slice(-8)}</p>
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
                <p><i class="fas fa-info-circle"></i> Сертификат можно проверить по ID</p>
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
                            body { margin: 0; padding: 20px; }
                            .certificate { 
                                background: white !important; 
                                color: black !important;
                                border: 20px solid #f8d7da !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">${certificateContent}</div>
                </body>
            </html>
        `;
        
        window.print();
        document.body.innerHTML = originalContent;
        location.reload();
    }
}

function saveCertificateAsImage() {
    alert('Функция сохранения в разработке. Используйте кнопку "Распечатать".');
}

function shareCertificate() {
    if (navigator.share) {
        navigator.share({
            title: 'Мой сертификат по курсу эмпатии',
            text: `Я завершил(а) курс "Эмпатия и поддержка в общении"!`,
            url: window.location.href
        });
    } else {
        alert('Скопируйте ссылку на страницу, чтобы поделиться успехом!');
    }
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

    // Обработчик клика на профиль для изменения имени
const userInfo = document.querySelector('.user-info');
if (userInfo) {
    userInfo.addEventListener('click', function(e) {
        e.preventDefault();
        showNameInput('login');
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
    
    // Простая авторизация по имени
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNameInput('login');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNameInput('register');
        });
    }
    
    // Кнопка прогресса
    const myProgressBtn = document.getElementById('myProgressBtn');
    if (myProgressBtn) {
        myProgressBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProgressDetails();
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
                <label for="userNameInput" style="display: block; margin-bottom: 10px; color: #f5f5f5;">Введите ваше имя:</label>
                <input type="text" id="userNameInput" placeholder="Иван Иванов" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #3498db; background: #2a2a2a; color: white;">
            </div>
            <button class="btn-primary" onclick="submitName('${type}')" style="margin-top: 20px; width: 100%; padding: 12px;">
                ${type === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
    
    // Фокус на поле ввода
    setTimeout(() => {
        const input = document.getElementById('userNameInput');
        if (input) input.focus();
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
    
    userProgress.userName = name;
    saveProgress();
    
    document.getElementById('modalOverlay').style.display = 'none';
    alert(type === 'login' ? `Добро пожаловать, ${name}!` : `Регистрация успешна, ${name}!`);
}

// Показать детали прогресса
function showProgressDetails() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const totalModules = courseData.modules.length;
    const completedModules = userProgress.completedModules.length;
    const completedSubmodules = userProgress.completedSubmodules.length;
    
    let totalSubmodules = 0;
    courseData.modules.forEach(module => {
        if (module.submodules) {
            totalSubmodules += module.submodules.length;
        }
    });
    
    const moduleProgress = Math.round((completedModules / totalModules) * 100);
    const submoduleProgress = Math.round((completedSubmodules / totalSubmodules) * 100);
    
    modalTitle.textContent = 'Мой прогресс';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #f5f5f5;">${userProgress.userName || 'Ученик'}</h3>
                <p style="color: #888;">ID: ${userProgress.userName ? userProgress.userName.toLowerCase().replace(/\s+/g, '') + Date.now().toString().slice(-6) : 'guest'}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h4 style="color: #f5f5f5; margin-bottom: 15px;">Общий прогресс</h4>
                <div style="background: #2a2a2a; border-radius: 10px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #ccc;">Модули</span>
                        <span style="color: #fff;">${completedModules}/${totalModules} (${moduleProgress}%)</span>
                    </div>
                    <div style="height: 10px; background: #404040; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${moduleProgress}%; background: linear-gradient(90deg, #3498db, #2ecc71);"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 20px; margin-bottom: 10px;">
                        <span style="color: #ccc;">Уроки</span>
                        <span style="color: #fff;">${completedSubmodules}/${totalSubmodules} (${submoduleProgress}%)</span>
                    </div>
                    <div style="height: 10px; background: #404040; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${submoduleProgress}%; background: linear-gradient(90deg, #e74c3c, #f39c12);"></div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 style="color: #f5f5f5; margin-bottom: 15px;">Пройденные модули</h4>
                <div style="background: #2a2a2a; border-radius: 10px; padding: 15px; max-height: 200px; overflow-y: auto;">
                    ${courseData.modules.map(module => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #404040;">
                            <span style="color: ${userProgress.completedModules.includes(module.id) ? '#2ecc71' : '#ccc'};">
                                ${userProgress.completedModules.includes(module.id) ? '✅ ' : '○ '}
                                ${module.title}
                            </span>
                            ${userProgress.testResults[module.id] ? 
                                `<span style="color: #f39c12;">${userProgress.testResults[module.id].percent}%</span>` : 
                                `<span style="color: #888;">Не тестирован</span>`
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
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

console.log("✅ Курс эмпатии загружен и готов к работе!");
