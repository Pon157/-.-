// УЛУЧШЕННАЯ БАЗА ЗНАНИЙ С СИСТЕМОЙ ПРОВЕРКИ
const knowledgeBase = {
    // Модуль 1.1
    "1.1": {
        assignment: {
            question: "Опишите разницу между «жалко» и «понимаю тебя»",
            validation: {
                type: "text",
                minWords: 30,
                requiredKeywords: [
                    { keyword: "жалость", points: 3, synonyms: ["жалеть", "жалко", "бедняжка"] },
                    { keyword: "эмпатия", points: 3, synonyms: ["сопереживание", "понимание", "чувствовать вместе"] },
                    { keyword: "позиция сверху", points: 2, synonyms: ["сверху", "неравенство", "дистанция"] },
                    { keyword: "позиция равных", points: 2, synonyms: ["равные", "наравне", "вместе"] },
                    { keyword: "пример", points: 2, synonyms: ["ситуация", "фраза", "ответ"] }
                ],
                minScore: 8
            },
            modelAnswer: "Жалость — это позиция сверху вниз («Бедняжка, как тебе не повезло»), которая создает дистанцию и неравенство. Эмпатия — это позиция равных («Понимаю твое разочарование, я бы тоже расстроился»), когда мы разделяем чувства другого человека, оставаясь рядом с ним."
        },
        quiz: {
            "1": {
                type: "single",
                question: "Что является ключевым отличием эмпатии от жалости?",
                options: [
                    { id: "a", text: "Эмпатия — это позиция сверху, жалость — позиция равных" },
                    { id: "b", text: "Эмпатия — это позиция равных, жалость — позиция сверху" },
                    { id: "c", text: "Между ними нет существенной разницы" }
                ],
                correct: "b"
            },
            "2": {
                type: "multiple",
                question: "Какие утверждения верны об эмпатии? (выберите все подходящие)",
                options: [
                    { id: "a", text: "Требует уязвимости и открытости" },
                    { id: "b", text: "Это способ «чувствовать вместе»" },
                    { id: "c", text: "Всегда включает в себя решение проблемы за другого" },
                    { id: "d", text: "Укрепляет отношения" }
                ],
                correct: ["a", "b", "d"]
            }
        }
    },
    
    // Модуль 1.2
    "1.2": {
        assignment: {
            question: "Приведите пример каждого вида эмпатии",
            validation: {
                type: "text",
                minWords: 40,
                requiredKeywords: [
                    { keyword: "когнитивная", points: 2, synonyms: ["интеллектуальная", "понимание", "умом"] },
                    { keyword: "эмоциональная", points: 2, synonyms: ["чувствовать", "эмоции", "зеркальные нейроны"] },
                    { keyword: "сострадательная", points: 2, synonyms: ["помощь", "действие", "поддержка"] },
                    { keyword: "пример когнитивной", points: 2, synonyms: ["понимаю ситуацию", "осознаю"] },
                    { keyword: "пример эмоциональной", points: 2, synonyms: ["чувствую твою боль", "сопереживаю"] },
                    { keyword: "пример сострадательной", points: 2, synonyms: ["помочь", "поддержать", "предложить помощь"] }
                ],
                minScore: 8
            },
            modelAnswer: "Когнитивная эмпатия: «Понимаю, как сложно потерять работу в нынешней экономической ситуации» (интеллектуальное понимание). Эмоциональная эмпатия: «Я чувствую твою тревогу и растерянность» (разделение эмоций). Сострадательная эмпатия: «Давай подумаем, как я могу поддержать тебя в поиске новой работы» (понимание + желание помочь конструктивно)."
        },
        quiz: {
            "1": {
                type: "single",
                question: "Какой вид эмпатии наиболее подвержен риску выгорания?",
                options: [
                    { id: "a", text: "Когнитивная эмпатия" },
                    { id: "b", text: "Эмоциональная эмпатия" },
                    { id: "c", text: "Сострадательная эмпатия" }
                ],
                correct: "b"
            },
            "2": {
                type: "multiple",
                question: "Какие утверждения верны о зеркальных нейронах? (выберите все подходящие)",
                options: [
                    { id: "a", text: "Активируются при выполнении действия" },
                    { id: "b", text: "Активируются при наблюдении за действием другого" },
                    { id: "c", text: "Отвечают только за логическое мышление" },
                    { id: "d", text: "Являются основой эмоциональной эмпатии" }
                ],
                correct: ["a", "b", "d"]
            },
            "3": {
                type: "single",
                question: "Какой вид эмпатии уместен при анализе договора с клиентом?",
                options: [
                    { id: "a", text: "Эмоциональная эмпатия" },
                    { id: "b", text: "Когнитивная эмпатия" },
                    { id: "c", text: "Сострадательная эмпатия" }
                ],
                correct: "b"
            }
        }
    },
    
    // Модуль 1.3
    "1.3": {
        assignment: {
            question: "Ответьте эмпатично",
            validation: {
                type: "text",
                minWords: 25,
                requiredKeywords: [
                    { keyword: "похоже", points: 1, synonyms: ["вижу", "кажется", "чувствуется"] },
                    { keyword: "чувствуешь", points: 2, synonyms: ["испытываешь", "переживаешь"] },
                    { keyword: "усталость", points: 2, synonyms: ["устал", "истощение", "выгорание"] },
                    { keyword: "давление", points: 2, synonyms: ["прессинг", "нагрузка", "стресс"] },
                    { keyword: "непонимание", points: 2, synonyms: ["одиночество", "непонятый", "изоляция"] },
                    { keyword: "тяжело", points: 1, synonyms: ["сложно", "трудно", "нелегко"] }
                ],
                minScore: 6,
                prohibitedKeywords: [
                    "не переживай",
                    "ерунда",
                    "взбодрись",
                    "сам виноват",
                    "забей"
                ]
            },
            modelAnswer: "Похоже, ты чувствуешь себя совершенно истощенным от постоянного давления на работе и ощущаешь, что тебя никто не понимает. Должно быть, очень тяжело, когда кажется, что все навалилось сразу и нет поддержки."
        },
        quiz: {
            "1": {
                type: "single",
                question: "Что такое конгруэнтность в общении?",
                options: [
                    { id: "a", text: "Умение быстро отвечать" },
                    { id: "b", text: "Совпадение слов и невербальных сигналов" },
                    { id: "c", text: "Способность говорить красиво" }
                ],
                correct: "b"
            },
            "2": {
                type: "multiple",
                question: "Какие из этих невербальных сигналов показывают эмпатию? (выберите все подходящие)",
                options: [
                    { id: "a", text: "Наклон тела к собеседнику" },
                    { id: "b", text: "Скрещенные руки на груди" },
                    { id: "c", text: "Умеренный зрительный контакт" },
                    { id: "d", text: "Проверка телефона во время разговора" }
                ],
                correct: ["a", "c"]
            },
            "3": {
                type: "single",
                question: "Какой процент информации об эмоциях передается через слова по данным исследований?",
                options: [
                    { id: "a", text: "Около 7%" },
                    { id: "b", text: "Около 50%" },
                    { id: "c", text: "Около 90%" }
                ],
                correct: "a"
            }
        }
    }
};

// СИСТЕМА ПРОВЕРКИ РАЗВЕРНУТЫХ ОТВЕТОВ
function checkAssignment(submoduleId) {
    console.log("=== ПРОВЕРКА РАЗВЕРНУТОГО ОТВЕТА ===");
    
    const answerId = 'answer' + submoduleId.replace('.', '_');
    const feedbackId = 'feedback' + submoduleId.replace('.', '_');
    
    const answerElement = document.getElementById(answerId);
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!answerElement || !feedbackElement) {
        console.error("Элементы не найдены");
        return;
    }
    
    const userAnswer = answerElement.value.trim();
    
    if (!userAnswer) {
        showFeedback(feedbackElement, "❌ Пожалуйста, напишите ответ перед проверкой.", false);
        return;
    }
    
    // Проверка на минимальную длину
    if (userAnswer.length < 50) {
        showFeedback(feedbackElement, "❌ Ответ слишком короткий. Напишите развернутый ответ минимум из 50 символов.", false);
        return;
    }
    
    // Проверка на осмысленность (защита от "хуй" и т.д.)
    if (isMeaninglessAnswer(userAnswer)) {
        showFeedback(feedbackElement, "❌ Ответ не соответствует теме задания. Пожалуйста, напишите осмысленный ответ, используя термины из урока.", false);
        return;
    }
    
    // Получаем данные для проверки
    const assignmentData = knowledgeBase[submoduleId]?.assignment;
    if (!assignmentData) {
        showFeedback(feedbackElement, "⚠️ Данные для проверки не найдены.", false);
        return;
    }
    
    const validation = assignmentData.validation;
    
    // Проверяем запрещенные слова
    if (validation.prohibitedKeywords) {
        for (const prohibited of validation.prohibitedKeywords) {
            if (userAnswer.toLowerCase().includes(prohibited.toLowerCase())) {
                showFeedback(feedbackElement, `❌ В ответе найдено запрещенное выражение: "${prohibited}". Эмпатичный ответ не должен содержать обесценивающих фраз.`, false);
                return;
            }
        }
    }
    
    // Проверяем по ключевым словам
    let totalScore = 0;
    let maxScore = 0;
    let foundKeywords = [];
    let missingKeywords = [];
    
    const lowerAnswer = userAnswer.toLowerCase();
    
    validation.requiredKeywords.forEach(keywordData => {
        maxScore += keywordData.points;
        
        // Проверяем основное ключевое слово и его синонимы
        const allKeywords = [keywordData.keyword.toLowerCase(), ...keywordData.synonyms.map(s => s.toLowerCase())];
        let found = false;
        
        for (const kw of allKeywords) {
            if (lowerAnswer.includes(kw)) {
                totalScore += keywordData.points;
                foundKeywords.push(keywordData.keyword);
                found = true;
                break;
            }
        }
        
        if (!found) {
            missingKeywords.push(keywordData.keyword);
        }
    });
    
    // Проверяем минимальное количество слов
    const wordCount = userAnswer.split(/\s+/).length;
    if (validation.minWords && wordCount < validation.minWords) {
        totalScore -= 2;
    }
    
    // Вычисляем процент
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    // Формируем обратную связь
    let feedback = `<h4>Результаты проверки задания</h4>`;
    feedback += `<p><strong>Набрано баллов:</strong> ${totalScore} из ${maxScore} (${percentage}%)</p>`;
    
    if (foundKeywords.length > 0) {
        feedback += `<p>✅ Найдены ключевые понятия: ${foundKeywords.join(', ')}</p>`;
    }
    
    if (missingKeywords.length > 0) {
        feedback += `<p>❌ Отсутствуют: ${missingKeywords.join(', ')}</p>`;
    }
    
    // Проверяем результат
    if (percentage >= 70 && totalScore >= validation.minScore) {
        feedback += `<p style="color: #2ecc71; font-weight: bold;">✅ Отлично! Задание выполнено успешно.</p>`;
        feedback += `<p><strong>Пример хорошего ответа:</strong><br><em>${assignmentData.modelAnswer}</em></p>`;
        
        // Сохраняем результат
        saveProgress(submoduleId, 'assignment', percentage);
        
        showFeedback(feedbackElement, feedback, true);
    } else {
        feedback += `<p style="color: #e74c3c; font-weight: bold;">❌ Нужно доработать ответ.</p>`;
        feedback += `<p><strong>Рекомендации:</strong></p>`;
        feedback += `<ul>`;
        feedback += `<li>Используйте термины из урока</li>`;
        feedback += `<li>Приведите конкретные примеры</li>`;
        feedback += `<li>Пишите развернуто (минимум ${validation.minWords || 30} слов)</li>`;
        feedback += `</ul>`;
        feedback += `<p><strong>Пример правильного ответа:</strong><br><em>${assignmentData.modelAnswer}</em></p>`;
        
        showFeedback(feedbackElement, feedback, false);
    }
}

// СИСТЕМА ПРОВЕРКИ ТЕСТОВ С ВЫБОРОМ ОТВЕТА
function checkQuiz(submoduleId) {
    console.log("=== ПРОВЕРКА ТЕСТА ===");
    
    const feedbackId = 'quiz-feedback' + submoduleId.replace('.', '_');
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!feedbackElement) {
        console.error("Элемент обратной связи не найден");
        return;
    }
    
    const quizData = knowledgeBase[submoduleId]?.quiz;
    if (!quizData) {
        showFeedback(feedbackElement, "⚠️ Данные теста не найдены.", false);
        return;
    }
    
    let score = 0;
    let totalQuestions = Object.keys(quizData).length;
    let feedbackHTML = `<h4>Результаты теста</h4>`;
    let allCorrect = true;
    
    // Проверяем каждый вопрос
    Object.keys(quizData).forEach(questionKey => {
        const question = quizData[questionKey];
        const questionNumber = questionKey;
        
        feedbackHTML += `<p><strong>Вопрос ${questionNumber}:</strong> ${question.question}</p>`;
        
        let userAnswers = [];
        let isCorrect = false;
        
        if (question.type === 'single') {
            // Одиночный выбор
            const radioName = `q${questionNumber}_${submoduleId.replace('.', '_')}`;
            const selectedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
            
            if (selectedRadio) {
                userAnswers = [selectedRadio.value];
                isCorrect = selectedRadio.value === question.correct;
            }
            
            feedbackHTML += `<div style="margin-left: 20px; margin-bottom: 10px;">`;
            question.options.forEach(option => {
                const isSelected = selectedRadio && selectedRadio.value === option.id;
                const isRightAnswer = option.id === question.correct;
                
                let marker = '○';
                let color = '#95a5a6';
                
                if (isSelected && isRightAnswer) {
                    marker = '✅';
                    color = '#2ecc71';
                } else if (isSelected && !isRightAnswer) {
                    marker = '❌';
                    color = '#e74c3c';
                } else if (!isSelected && isRightAnswer) {
                    marker = '✓';
                    color = '#2ecc71';
                }
                
                feedbackHTML += `<div style="color: ${color}; margin: 2px 0;">${marker} ${option.text}</div>`;
            });
            feedbackHTML += `</div>`;
            
        } else if (question.type === 'multiple') {
            // Множественный выбор
            const checkboxName = `q${questionNumber}_${submoduleId.replace('.', '_')}`;
            const selectedCheckboxes = document.querySelectorAll(`input[name="${checkboxName}"]:checked`);
            
            selectedCheckboxes.forEach(cb => userAnswers.push(cb.value));
            
            // Сортируем для сравнения
            const userAnswersSorted = [...userAnswers].sort();
            const correctAnswersSorted = [...question.correct].sort();
            
            isCorrect = arraysEqual(userAnswersSorted, correctAnswersSorted);
            
            feedbackHTML += `<div style="margin-left: 20px; margin-bottom: 10px;">`;
            question.options.forEach(option => {
                const isSelected = userAnswers.includes(option.id);
                const isRightAnswer = question.correct.includes(option.id);
                
                let marker = '☐';
                let color = '#95a5a6';
                
                if (isSelected && isRightAnswer) {
                    marker = '✅';
                    color = '#2ecc71';
                } else if (isSelected && !isRightAnswer) {
                    marker = '❌';
                    color = '#e74c3c';
                } else if (!isSelected && isRightAnswer) {
                    marker = '☑';
                    color = '#2ecc71';
                }
                
                feedbackHTML += `<div style="color: ${color}; margin: 2px 0;">${marker} ${option.text}</div>`;
            });
            feedbackHTML += `</div>`;
        }
        
        if (isCorrect) {
            score++;
            feedbackHTML += `<p style="color: #2ecc71;">✅ Ответ правильный</p>`;
        } else {
            allCorrect = false;
            feedbackHTML += `<p style="color: #e74c3c;">❌ Ответ неправильный</p>`;
        }
        
        feedbackHTML += `<hr style="border: none; border-top: 1px dashed #ccc; margin: 10px 0;">`;
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    feedbackHTML += `<h4 style="margin-top: 20px;">Итоговый результат: ${score} из ${totalQuestions} (${percentage}%)</h4>`;
    
    if (percentage === 100) {
        feedbackHTML += `<p style="color: #2ecc71; font-weight: bold; font-size: 1.1em;">🎉 Отлично! Все ответы правильные!</p>`;
        
        // Сохраняем результат
        saveProgress(submoduleId, 'quiz', percentage);
        
        showFeedback(feedbackElement, feedbackHTML, true);
    } else if (percentage >= 70) {
        feedbackHTML += `<p style="color: #f39c12; font-weight: bold;">📚 Хорошо, но есть ошибки. Повторите материал.</p>`;
        showFeedback(feedbackElement, feedbackHTML, false);
    } else {
        feedbackHTML += `<p style="color: #e74c3c; font-weight: bold;">📖 Нужно повторить теорию. Обратите внимание на вопросы с ошибками.</p>`;
        showFeedback(feedbackElement, feedbackHTML, false);
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function arraysEqual(arr1, arr2) {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function showFeedback(element, message, isSuccess) {
    element.innerHTML = message;
    element.className = isSuccess ? 'feedback success' : 'feedback error';
    element.style.display = 'block';
    
    // Анимация появления
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 10);
    
    // Прокрутка к элементу
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function isMeaninglessAnswer(text) {
    const lowerText = text.toLowerCase();
    
    // Список бессмысленных или оскорбительных слов
    const meaninglessPatterns = [
        /ху[йея]/i,
        /пизд/i,
        /бля/i,
        /еб/i,
        /\bа\b\s*\bа\b\s*\bа\b/i, // повторяющиеся буквы
        /\bтест\b/i,
        /\bпроверка\b/i,
        /\.{5,}/, // много точек подряд
        /\,{5,}/, // много запятых подряд
        /\s{10,}/ // много пробелов подряд
    ];
    
    // Проверяем на бессмысленные комбинации
    if (text.length > 0) {
        // Если текст состоит в основном из одного повторяющегося символа
        const uniqueChars = new Set(text.replace(/\s/g, ''));
        if (uniqueChars.size < 3 && text.length > 10) return true;
        
        // Если текст слишком короткий для осмысленного ответа
        if (text.split(/\s+/).length < 5) return true;
    }
    
    // Проверяем по паттернам
    for (const pattern of meaninglessPatterns) {
        if (pattern.test(lowerText)) {
            return true;
        }
    }
    
    return false;
}

function saveProgress(submoduleId, type, score) {
    // Сохраняем прогресс в localStorage
    const progressKey = `progress_${submoduleId}_${type}`;
    localStorage.setItem(progressKey, JSON.stringify({
        score: score,
        date: new Date().toISOString(),
        type: type
    }));
    
    console.log(`Прогресс сохранен: ${submoduleId} - ${type} - ${score}%`);
}

// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ФОРМЫ ТЕСТА
function createQuizForm(submoduleId, quizData) {
    let formHTML = '';
    
    Object.keys(quizData).forEach(questionKey => {
        const question = quizData[questionKey];
        const questionNumber = questionKey;
        
        formHTML += `<div class="quiz-question">`;
        formHTML += `<p><strong>Вопрос ${questionNumber}:</strong> ${question.question}</p>`;
        
        if (question.type === 'single') {
            // Радиокнопки для одиночного выбора
            question.options.forEach(option => {
                const inputId = `q${questionNumber}_${submoduleId.replace('.', '_')}_${option.id}`;
                formHTML += `
                <div class="option">
                    <input type="radio" 
                           id="${inputId}" 
                           name="q${questionNumber}_${submoduleId.replace('.', '_')}" 
                           value="${option.id}">
                    <label for="${inputId}">${option.text}</label>
                </div>`;
            });
            
        } else if (question.type === 'multiple') {
            // Чекбоксы для множественного выбора
            question.options.forEach(option => {
                const inputId = `q${questionNumber}_${submoduleId.replace('.', '_')}_${option.id}`;
                formHTML += `
                <div class="option">
                    <input type="checkbox" 
                           id="${inputId}" 
                           name="q${questionNumber}_${submoduleId.replace('.', '_')}" 
                           value="${option.id}">
                    <label for="${inputId}">${option.text}</label>
                </div>`;
            });
        }
        
        formHTML += `</div><hr>`;
    });
    
    // Кнопка проверки
    formHTML += `<button class="btn-primary" onclick="checkQuiz('${submoduleId}')">Проверить тест</button>`;
    formHTML += `<div id="quiz-feedback${submoduleId.replace('.', '_')}" class="feedback"></div>`;
    
    return formHTML;
}

// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ФОРМЫ РАЗВЕРНУТОГО ОТВЕТА
function createAssignmentForm(submoduleId, assignmentData) {
    let formHTML = '';
    
    formHTML += `<div class="assignment-question">`;
    formHTML += `<p><strong>Задание:</strong> ${assignmentData.question}</p>`;
    formHTML += `<textarea id="answer${submoduleId.replace('.', '_')}" 
                         placeholder="Напишите развернутый ответ здесь... (минимум 50 символов)"
                         rows="6"></textarea>`;
    formHTML += `<div class="hint-box">`;
    formHTML += `<p><small>💡 Подсказка: используйте термины из урока, приводите конкретные примеры, пишите развернуто.</small></p>`;
    formHTML += `</div>`;
    formHTML += `<button class="btn-primary" onclick="checkAssignment('${submoduleId}')">Проверить задание</button>`;
    formHTML += `<div id="feedback${submoduleId.replace('.', '_')}" class="feedback"></div>`;
    formHTML += `</div>`;
    
    return formHTML;
}

// ИНИЦИАЛИЗАЦИЯ ТЕСТОВ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
function initializeQuizzes() {
    console.log("Инициализация тестов...");
    
    // Находим все контейнеры для тестов и создаем формы
    Object.keys(knowledgeBase).forEach(submoduleId => {
        const quizData = knowledgeBase[submoduleId]?.quiz;
        if (quizData) {
            const quizContainer = document.getElementById(`quiz-container-${submoduleId.replace('.', '_')}`);
            if (quizContainer) {
                quizContainer.innerHTML = createQuizForm(submoduleId, quizData);
            }
        }
        
        const assignmentData = knowledgeBase[submoduleId]?.assignment;
        if (assignmentData) {
            const assignmentContainer = document.getElementById(`assignment-container-${submoduleId.replace('.', '_')}`);
            if (assignmentContainer) {
                assignmentContainer.innerHTML = createAssignmentForm(submoduleId, assignmentData);
            }
        }
    });
}

// СТИЛИ ДЛЯ ФОРМ И ОБРАТНОЙ СВЯЗИ
const enhancedStyles = `
<style>
    /* СТИЛИ ДЛЯ ТЕСТОВ И ЗАДАНИЙ */
    .quiz-question {
        background: rgba(52, 152, 219, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin: 15px 0;
        border-left: 4px solid #3498db;
    }
    
    .assignment-question {
        background: rgba(46, 204, 113, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin: 15px 0;
        border-left: 4px solid #2ecc71;
    }
    
    .option {
        margin: 10px 0;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        transition: all 0.2s;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .option:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .option input[type="radio"],
    .option input[type="checkbox"] {
        margin-right: 12px;
        transform: scale(1.2);
        cursor: pointer;
    }
    
    .option label {
        cursor: pointer;
        display: inline-block;
        width: calc(100% - 40px);
        vertical-align: middle;
        font-size: 1.05em;
    }
    
    .hint-box {
        background: rgba(241, 196, 15, 0.1);
        padding: 12px;
        border-radius: 8px;
        margin: 10px 0;
        border-left: 3px solid #f1c40f;
    }
    
    /* УЛУЧШЕННЫЕ СТИЛИ ДЛЯ ОБРАТНОЙ СВЯЗИ */
    .feedback {
        margin-top: 25px;
        padding: 20px;
        border-radius: 10px;
        display: none;
        animation: fadeIn 0.5s ease;
        border: 1px solid;
    }
    
    .feedback.success {
        background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%);
        border-color: #2ecc71;
        color: #27ae60;
    }
    
    .feedback.error {
        background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%);
        border-color: #e74c3c;
        color: #c0392b;
    }
    
    .feedback h4 {
        margin-top: 0;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid;
    }
    
    .feedback.success h4 {
        border-color: rgba(46, 204, 113, 0.3);
    }
    
    .feedback.error h4 {
        border-color: rgba(231, 76, 60, 0.3);
    }
    
    /* АНИМАЦИИ */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* КНОПКИ */
    .btn-primary {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 1.05em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 15px;
        display: inline-block;
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
    }
    
    .btn-primary:active {
        transform: translateY(0);
    }
    
    /* ТЕКСТОВЫЕ ПОЛЯ */
    textarea {
        width: 100%;
        min-height: 150px;
        padding: 16px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        color: var(--text-color);
        font-family: inherit;
        font-size: 1.05em;
        line-height: 1.6;
        resize: vertical;
        transition: all 0.3s;
        margin: 15px 0;
    }
    
    textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        background: rgba(255, 255, 255, 0.08);
    }
    
    textarea::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }
    
    /* СЧЕТЧИК СИМВОЛОВ (опционально) */
    .char-counter {
        text-align: right;
        font-size: 0.85em;
        color: #95a5a6;
        margin-top: 5px;
    }
    
    /* ПРОГРЕСС БАР */
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        margin: 10px 0;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    .progress-fill.good {
        background: linear-gradient(90deg, #2ecc71, #27ae60);
    }
    
    .progress-fill.medium {
        background: linear-gradient(90deg, #f39c12, #d35400);
    }
    
    .progress-fill.poor {
        background: linear-gradient(90deg, #e74c3c, #c0392b);
    }
</style>
`;

// ДОБАВЛЯЕМ СТИЛИ В ДОКУМЕНТ
document.head.insertAdjacentHTML('beforeend', enhancedStyles);

// ИНИЦИАЛИЗИРУЕМ ТЕСТЫ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeQuizzes, 100);
});

// ЭКСПОРТ ФУНКЦИЙ
window.knowledgeBase = knowledgeBase;
window.checkAssignment = checkAssignment;
window.checkQuiz = checkQuiz;
window.createQuizForm = createQuizForm;
window.createAssignmentForm = createAssignmentForm;
window.initializeQuizzes = initializeQuizzes;

console.log("✅ Улучшенная система проверки загружена!");
console.log("✅ База знаний содержит модули: " + Object.keys(knowledgeBase).join(', '));
console.log("✅ Функции проверки: checkAssignment(), checkQuiz()");
console.log("✅ Функции создания форм: createQuizForm(), createAssignmentForm()");


// Данные курса: модули, подмодули, задания  
const courseData = {
    title: "Эмпатия и поддержка в общении",
    modules: [
        {
            id: 1,
            title: "Модуль 1. Основы эмпатии",
            description: "Что такое эмпатия и как она работает",
            completed: false,
            submodules: [
                {
                    id: "1.1",
                    title: "Что такое эмпатия: Глубина понимания",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/QNwvfBPt/6d8b84cbd3fe11f0adb37e72a190c2a8-(2).jpg">
        <img src="https://i.postimg.cc/4yzjyMhQ/6d8b84cbd3fe11f0adb37e72a190c2a8.jpg" alt="Эмпатия и понимание" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Эмпатия — это способность разделить чувства другого, оставаясь собой»</div>
        <p class="author">— Карл Роджерс</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Эмпатия часто путается с сочувствием (симпатией) или жалостью, но это фундаментально разные процессы.</p>
    <ul>
        <li><strong>Жалость:</strong> Позиция «сверху вниз». Вы смотрите на человека в беде и думаете: «Бедняжка, хорошо, что это не со мной». Это дистанцирует.</li>
        <li><strong>Сочувствие (Sympathy):</strong> Это понимание того, что кому-то плохо, но без эмоционального вовлечения. Вы «чувствуете за» кого-то.</li>
        <li><strong>Эмпатия (Empathy):</strong> Это способность «чувствовать вместе». Это позиция равного. Вы мысленно встаете на место человека, используя свой эмоциональный опыт, чтобы понять его боль. Эмпатия требует уязвимости, так как вы должны затронуть что-то внутри себя, что знает это чувство.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Уязвимость</h4>
        <p>Состояние открытости и принятия собственных чувств, которое позволяет понять чувства другого. Не слабость, а смелость быть настоящим.</p>
    </div>
    
    <p><strong>Почему эмпатия важна в повседневной жизни:</strong></p>
    <ul>
        <li><strong>Укрепляет отношения:</strong> Люди чувствуют себя услышанными и понятыми</li>
        <li><strong>Снижает конфликты:</strong> Понимание мотивов другого помогает избегать обвинений</li>
        <li><strong>Помогает в воспитании:</strong> Дети, чувствуя эмпатию родителей, учатся управлять эмоциями</li>
        <li><strong>Улучшает рабочую атмосферу:</strong> Коллеги, чувствующие поддержку, работают эффективнее</li>
    </ul>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>APA Dictionary of Psychology</strong></p>
        <p>Американская психологическая ассоциация. Эмпатия определяется как понимание эмоционального состояния другого человека с точки зрения этого человека, а также способность разделить его эмоции.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Похоже, тебе действительно тяжело. Я бы тоже расстроился на твоем месте»</td>
                <td>«Не переживай, это ерунда»</td>
            </tr>
            <tr>
                <td>«Я понимаю твою злость, это действительно несправедливо»</td>
                <td>«Успокойся, не стоит злиться из-за такой мелочи»</td>
            </tr>
            <tr>
                <td>«Должно быть, больно чувствовать себя непонятым»</td>
                <td>«Бедняжка, как тебе не повезло»</td>
            </tr>
            <tr>
                <td>Слушать без планирования ответа, полностью присутствуя</td>
                <td>Слушать, думая о том, что сказать дальше</td>
            </tr>
        </tbody>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Практический совет на сегодня:</h4>
        <p>В течение дня попробуйте в одном разговоре вместо совета сказать: «Похоже, это действительно тяжело для тебя. Я бы тоже расстроился на твоем месте».</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Опишите разницу между «жалко» и «понимаю тебя»</h4>
        <p>Приведите примеры двух фраз: одной, выражающей жалость, и другой, выражающей эмпатию, в ответ на ситуацию: «У меня провалился важный проект на работе».</p>
        <textarea id="answer1_1" placeholder="Напишите ваши варианты фраз здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('1.1')">Проверить задание</button>
        <div id="feedback1_1" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что является ключевым отличием эмпатии от жалости?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_option1" name="q1" value="a">
                <label for="q1_option1">Эмпатия — это позиция сверху, жалость — позиция равных</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_option2" name="q1" value="b">
                <label for="q1_option2">Эмпатия — это позиция равных, жалость — позиция сверху</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_option3" name="q1" value="c">
                <label for="q1_option3">Между ними нет существенной разницы</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны об эмпатии? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_option1" name="q2" value="a">
                <label for="q2_option1">Требует уязвимости и открытости</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_option2" name="q2" value="b">
                <label for="q2_option2">Это способ «чувствовать вместе»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_option3" name="q2" value="c">
                <label for="q2_option3">Всегда включает в себя решение проблемы за другого</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_option4" name="q2" value="d">
                <label for="q2_option4">Укрепляет отношения</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('1.1')">Проверить тест</button>
        <div id="quiz-feedback1_1" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (для практики):</h5>
        <p>Ситуация: ребенок плачет, потому что сломал любимую игрушку.</p>
        <p>1. Напишите реакцию жалости:</p>
        <textarea id="extra1_1a" placeholder="Реакция жалости..."></textarea>
        <p>2. Напишите эмпатическую реакцию:</p>
        <textarea id="extra1_1b" placeholder="Эмпатическая реакция..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('1.1')">Проверить дополнительное задание</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .comparison-table th {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        padding: 15px;
        text-align: left;
        font-weight: 600;
    }
    
    .comparison-table td {
        padding: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .comparison-table tr:last-child td {
        border-bottom: none;
    }
    
    .quiz {
        background: rgba(52, 152, 219, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .quiz-options {
        margin: 15px 0;
    }
    
    .option {
        margin: 10px 0;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        transition: background 0.3s;
    }
    
    .option:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .option input[type="radio"],
    .option input[type="checkbox"] {
        margin-right: 10px;
    }
    
    .option label {
        cursor: pointer;
        font-size: 1em;
    }
    
    .quote-box {
        background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.1) 100%);
        border-left: 4px solid #9b59b6;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .quote {
        font-size: 1.2em;
        font-style: italic;
        color: #f1c40f;
        margin: 0;
    }
    
    .author {
        text-align: right;
        color: #95a5a6;
        margin: 10px 0 0 0;
    }
</style>`
                },
                {
                    id: "1.2",
                    title: "Виды эмпатии: Как работает наш мозг",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/0jyJy6jM/ac06b750d3ff11f08fd6b2f688e16018-(3).jpg">
        <img src="https://i.postimg.cc/hGsw7wMv/ac06b750d3ff11f08fd6b2f688e16018-(1).jpg" alt="Виды эмпатии" class="responsive-image">
    </picture>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Психологи выделяют три уровня эмпатии, которые задействуют разные участки мозга:</p>
    <ul>
        <li><strong>Когнитивная эмпатия («Я понимаю»):</strong> Вы интеллектуально понимаете точку зрения другого человека. Это навык переговорщиков. Риск: Можно понять, как манипулировать человеком, не сопереживая ему.</li>
        <li><strong>Эмоциональная эмпатия («Я чувствую»):</strong> Вы физически ощущаете эмоции другого (списибо зеркальным нейронам). Если друг плачет, у вас тоже ком в горле. Риск: Если не иметь границ, это ведет к быстрому выгоранию.</li>
        <li><strong>Сострадательная эмпатия (Эмпатическая забота):</strong> Баланс. Вы понимаете и чувствуете, но не тонете в чужих эмоциях, а испытываете импульс помочь. Это конструктивная форма поддержки.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Зеркальные нейроны</h4>
        <p>Специальные клетки мозга, которые активируются как при выполнении действия, так и при наблюдении за тем, как это действие выполняет другой. Основа эмоциональной эмпатии.</p>
    </div>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>Greater Good Science Center, Калифорнийский университет в Беркли</strong></p>
        <p>Исследования центра показывают, что сострадательная эмпатия наиболее эффективна для построения прочных отношений и оказания реальной помощи.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Использовать все три вида эмпатии в зависимости от ситуации</td>
                <td>Использовать только эмоциональную эмпатию и выгорать</td>
            </tr>
            <tr>
                <td>Применять когнитивную эмпатию в переговорах</td>
                <td>Использовать когнитивную эмпатию для манипуляций</td>
            </tr>
            <tr>
                <td>Проявлять сострадательную эмпатию — понять, почувствовать и помочь конструктивно</td>
                <td>Погружаться в чужие эмоции без границ</td>
            </tr>
            <tr>
                <td>Балансировать между пониманием и эмоциональной вовлеченностью</td>
                <td>Быть либо полностью холодным, либо полностью поглощенным чужими чувствами</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Какой вид эмпатии нужен в разных ситуациях:</strong></p>
    <table class="empathy-table">
        <tr>
            <th>Ситуация</th>
            <th>Наиболее подходящий вид эмпатии</th>
            <th>Пример реакции</th>
        </tr>
        <tr>
            <td>Коллега рассказывает о сложном проекте</td>
            <td>Когнитивная</td>
            <td>«Понимаю, какие сложные задачи тебе приходится решать»</td>
        </tr>
        <tr>
            <td>Подруга плачет после расставания</td>
            <td>Эмоциональная</td>
            <td>«Мне тоже грустно это слышать» (с искренним сочувствием в голосе)</td>
        </tr>
        <tr>
            <td>Соседка в депрессии не может выйти из дома</td>
            <td>Сострадательная</td>
            <td>«Похоже, тебе сейчас очень тяжело. Хочешь, я помогу с покупками?»</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Упражнение на неделю:</h4>
        <p>В течение недели отмечайте, какой вид эмпатии вы проявляете в разных ситуациях. Вечером записывайте 1-2 примера.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Приведите пример каждого вида эмпатии</h4>
        <p>Представьте ситуацию: друг потерял работу. Как проявится каждый вид эмпатии?</p>
        <textarea id="answer1_2" placeholder="Напишите ваши примеры здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('1.2')">Проверить задание</button>
        <div id="feedback1_2" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Какой вид эмпатии наиболее подвержен риску выгорания?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_2_option1" name="q1_2" value="a">
                <label for="q1_2_option1">Когнитивная эмпатия</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_option2" name="q1_2" value="b">
                <label for="q1_2_option2">Эмоциональная эмпатия</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_option3" name="q1_2" value="c">
                <label for="q1_2_option3">Сострадательная эмпатия</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны о зеркальных нейронах? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_2_option1" name="q2_2" value="a">
                <label for="q2_2_option1">Активируются при выполнении действия</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_option2" name="q2_2" value="b">
                <label for="q2_2_option2">Активируются при наблюдении за действием другого</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_option3" name="q2_2" value="c">
                <label for="q2_2_option3">Отвечают только за логическое мышление</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_option4" name="q2_2" value="d">
                <label for="q2_2_option4">Являются основой эмоциональной эмпатии</label>
            </div>
        </div>
        
        <p><strong>Какой вид эмпатии уместен при анализе договора с клиентом?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_2_option1" name="q3_2" value="a">
                <label for="q3_2_option1">Эмоциональная эмпатия</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_option2" name="q3_2" value="b">
                <label for="q3_2_option2">Когнитивная эмпатия</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_option3" name="q3_2" value="c">
                <label for="q3_2_option3">Сострадательная эмпатия</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('1.2')">Проверить тест</button>
        <div id="quiz-feedback1_2" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (ситуации для анализа):</h5>
        <p>1. Ребенок боится идти к зубному. Какой вид эмпатии поможет больше всего?</p>
        <textarea id="extra1_2a" placeholder="Ваш анализ..."></textarea>
        <p>2. Пожилая соседка рассказывает, как скучает по умершему мужу. Какую эмпатию проявить?</p>
        <textarea id="extra1_2b" placeholder="Ваш анализ..."></textarea>
        <p>3. Коллега злится на начальника. Какой вид эмпатии уместен?</p>
        <textarea id="extra1_2c" placeholder="Ваш анализ..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('1.2')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .empathy-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .empathy-table th {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .empathy-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .empathy-table tr:hover {
        background: rgba(52, 152, 219, 0.05);
    }
</style>`
                },
                {
                    id: "1.3",
                    title: "Эмпатия в невербалике",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/BvrZj5Wd/1ab6a8a8-cfbf-48b5-b695-95beab50.jpg">
        <img src="https://i.postimg.cc/SxVzYvD4/1ab6a8a8-cfbf-48b5-b695-95beab503c1e.jpg" alt="Эмпатия в невербалике" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Слушать — значит слышать не только слова, но и чувства»</div>
        <p class="author">— Неизвестный автор</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> По данным исследований (Мейерабиан и др.), слова передают лишь около 7% информации об эмоциях. Эмпатия считывается через:</p>
    <ul>
        <li><strong>Проксемику:</strong> Дистанция. Наклон корпуса в сторону собеседника (сигнал интереса) против откинутой назад позы (сигнал оценки/отстраненности).</li>
        <li><strong>Паралингвистику:</strong> Тон, темп, громкость. Эмпатичный голос часто ниже, медленнее и теплее.</li>
        <li><strong>Конгруэнтность:</strong> Соответствие ваших слов вашему лицу. Если вы говорите «Я тебе сочувствую» с каменным лицом или улыбкой, собеседник считает это как ложь или сарказм.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Конгруэнтность</h4>
        <p>Совпадение слов, тона голоса и языка тела. Когда вы говорите «мне жаль» с грустным выражением лица — это конгруэнтно. Когда с улыбкой — нет.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Слегка наклоняться к собеседнику</td>
                <td>Откидываться назад, скрещивать руки</td>
            </tr>
            <tr>
                <td>Поддерживать умеренный зрительный контакт (60-70% времени)</td>
                <td>Избегать взгляда или пристально смотреть</td>
            </tr>
            <tr>
                <td>Говорить медленнее и тише, когда собеседник расстроен</td>
                <td>Говорить быстро и громко, перебивать</td>
            </tr>
            <tr>
                <td>Слегка отражать позу собеседника</td>
                <td>Сидеть в закрытой позе (скрещенные руки/ноги)</td>
            </tr>
            <tr>
                <td>Выражение лица соответствует словам</td>
                <td>Улыбаться, когда говорите о грустном</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Типичные ошибки в невербальной эмпатии:</strong></p>
    <table class="mistakes-table">
        <tr>
            <th>Ошибка</th>
            <th>Как воспринимается</th>
            <th>Как исправить</th>
        </tr>
        <tr>
            <td>Скрещенные руки</td>
            <td>Закрытость, защита</td>
            <td>Опустите руки вдоль тела или используйте открытые жесты</td>
        </tr>
        <tr>
            <td>Быстрый темп речи</td>
            <td>Нетерпение, желание поскорее закончить</td>
            <td>Сделайте паузу, дышите глубже, говорите медленнее</td>
        </tr>
        <tr>
            <td>Отсутствие зрительного контакта</td>
            <td>Неискренность, отсутствие интереса</td>
            <td>Смотрите в глаза 60-70% времени, но не пристально</td>
        </tr>
        <tr>
            <td>Проверка телефона</td>
            <td>Полное отсутствие внимания</td>
            <td>Уберите телефон, повернитесь к собеседнику всем телом</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Эксперимент на день:</h4>
        <p>В одном разговоре сегодня сознательно наклонитесь немного вперед к собеседнику и следите за его реакцией. Обычно люди начинают больше раскрываться.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Ответьте эмпатично</h4>
        <p>Перед вами жалоба: «Я так устал от всего. На работе постоянный прессинг, дома тоже никто не понимает. Кажется, я вообще ни на что не способен.»</p>
        <p>Напишите эмпатический ответ, который отразит чувства говорящего.</p>
        <textarea id="answer1_3" placeholder="Напишите ваш ответ здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('1.3')">Проверить задание</button>
        <div id="feedback1_3" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое конгруэнтность в общении?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_3_option1" name="q1_3" value="a">
                <label for="q1_3_option1">Умение быстро отвечать</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_option2" name="q1_3" value="b">
                <label for="q1_3_option2">Совпадение слов и невербальных сигналов</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_option3" name="q1_3" value="c">
                <label for="q1_3_option3">Способность говорить красиво</label>
            </div>
        </div>
        
        <p><strong>Какие из этих невербальных сигналов показывают эмпатию? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_3_option1" name="q2_3" value="a">
                <label for="q2_3_option1">Наклон тела к собеседнику</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_option2" name="q2_3" value="b">
                <label for="q2_3_option2">Скрещенные руки на груди</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_option3" name="q2_3" value="c">
                <label for="q2_3_option3">Умеренный зрительный контакт</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_option4" name="q2_3" value="d">
                <label for="q2_3_option4">Проверка телефона во время разговора</label>
            </div>
        </div>
        
        <p><strong>Какой процент информации об эмоциях передается через слова по данным исследований?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_3_option1" name="q3_3" value="a">
                <label for="q3_3_option1">Около 7%</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_option2" name="q3_3" value="b">
                <label for="q3_3_option2">Около 50%</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_option3" name="q3_3" value="c">
                <label for="q3_3_option3">Около 90%</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('1.3')">Проверить тест</button>
        <div id="quiz-feedback1_3" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (анализ невербалики):</h5>
        <p>Представьте, что вы разговариваете с этим человеком. Опишите:</p>
        <p>1. Как должна звучать ваша интонация:</p>
        <textarea id="extra1_3a" placeholder="Описание интонации..."></textarea>
        <p>2. Какое выражение лица должно быть:</p>
        <textarea id="extra1_3b" placeholder="Описание выражения лица..."></textarea>
        <p>3. Какую позу лучше принять:</p>
        <textarea id="extra1_3c" placeholder="Описание позы..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('1.3')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .mistakes-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .mistakes-table th {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .mistakes-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .mistakes-table tr:hover {
        background: rgba(231, 76, 60, 0.05);
    }
</style>`
                }
            ],
            test: {
                title: "Контрольная работа 1: Основы эмпатии",
                description: "Тест по основам эмпатии и практическое задание",
                timeLimit: 30,
                sections: [
                    {
                        title: "Теоретическая часть",
                        type: "theory",
                        questions: [
                            {
                                type: "multiple-choice",
                                question: "Что является ключевым отличием эмпатии от сочувствия?",
                                options: [
                                    "Эмпатия — это жалость к человеку",
                                    "Эмпатия — это понимание чувств другого с его позиции",
                                    "Эмпатия — это желание быстро решить проблему другого",
                                    "Эмпатия — это выражение собственного мнения о ситуации"
                                ],
                                correct: 1,
                                explanation: "Эмпатия предполагает способность понять чувства другого человека «изнутри», с его точки зрения. Сочувствие (симпатия) — это скорее выражение собственных чувств по поводу ситуации другого."
                            },
                            {
                                type: "multiple-choice",
                                question: "Какой вид эмпатии включает в себя не только понимание, но и желание помочь?",
                                options: [
                                    "Когнитивная эмпатия",
                                    "Эмоциональная эмпатия", 
                                    "Сострадательная эмпатия",
                                    "Рефлексивная эмпатия"
                                ],
                                correct: 2,
                                explanation: "Сострадательная эмпатия (эмпатическая забота) — это баланс понимания, чувствования и импульса помочь конструктивно, не растворяясь в эмоциях другого."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое зеркальные нейроны?",
                                options: [
                                    "Нейроны, отвечающие за память",
                                    "Нейроны, активирующиеся при наблюдении действий других",
                                    "Нейроны, контролирующие речь",
                                    "Нейроны, отвечающие за сон"
                                ],
                                correct: 1,
                                explanation: "Зеркальные нейроны — специальные клетки мозга, которые активируются как при выполнении действия, так и при наблюдении за тем, как это действие выполняет другой. Это биологическая основа эмоциональной эмпатии."
                            },
                            {
                                type: "true-false",
                                question: "Конгруэнтность — это совпадение слов и невербальных сигналов.",
                                correct: true,
                                explanation: "Да, конгруэнтность — это совпадение вербальных и невербальных сообщений. Когда слова соответствуют тону голоса и языку тела, общение воспринимается как искреннее."
                            },
                            {
                                type: "multiple-choice",
                                question: "Какое утверждение о жалости НЕВЕРНО?",
                                options: [
                                    "Жалость создает позицию равенства",
                                    "Жалость часто звучит как «Бедняжка»",
                                    "Жалость может дистанцировать от человека",
                                    "Жалость — это чувство «сверху вниз»"
                                ],
                                correct: 0,
                                explanation: "Жалость создает позицию НЕравенства: «Я (в хорошем положении) смотрю на тебя (в плохом положении)». Эмпатия же предполагает позицию равенства: «Я рядом с тобой в твоих чувствах»."
                            }
                        ]
                    },
                    {
                        title: "Практический анализ",
                        type: "practical",
                        questions: [
                            {
                                type: "situation-analysis",
                                question: "Проанализируйте фразы и определите, какие из них эмпатичные, а какие выражают жалость:",
                                situations: [
                                    {
                                        text: "«Бедный, как тебе не повезло»",
                                        type: "identify"
                                    },
                                    {
                                        text: "«Понимаю, как это обидно, когда тебя забывают»",
                                        type: "identify"
                                    },
                                    {
                                        text: "«Не переживай, это ерунда»",
                                        type: "identify"
                                    }
                                ],
                                correctAnswers: ["жалость", "эмпатия", "обесценивание"],
                                points: 5,
                                explanation: "1 - жалость (позиция сверху, фокус на невезении), 2 - эмпатия (понимание чувств с позиции равенства), 3 - обесценивание (отрицание значимости чувств)"
                            },
                            {
                                type: "scenario",
                                question: "Ситуация: коллега говорит: «Я опоздал на важную встречу из-за пробок, начальник был в ярости». Напишите три разных ответа, демонстрирующих:",
                                requirements: [
                                    "а) когнитивную эмпатию",
                                    "б) эмоциональную эмпатию", 
                                    "в) сострадательную эмпатию"
                                ],
                                modelAnswers: {
                                    a: "Когнитивная: «Понимаю, как неприятно попасть в такую ситуацию — и пробки, и гнев начальника.»",
                                    b: "Эмоциональная: «Должно быть, ты чувствовал себя ужасно, когда на тебя кричали.»",
                                    c: "Сострадательная: «Это действительно тяжелая ситуация. Хочешь, подумаем, как можно смягчить последствия?»"
                                },
                                points: 10,
                                evaluationCriteria: [
                                    "Правильное определение типа эмпатии - 2 балла",
                                    "Соответствие ответа ситуации - 2 балла",
                                    "Использование ключевых слов - 3 балла",
                                    "Общий тон и искренность - 3 балла"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Практическое задание",
                        type: "assignment",
                        task: "Перед вами жалоба: «Мой лучший друг забыл про мой день рождения. Я чувствую себя совсем ненужным.» Напишите эмпатический ответ.",
                        modelAnswer: "«Должно быть, это очень обидно — когда забывает именно лучший друг. Чувствовать себя ненужным в такой день особенно больно.»",
                        scoringCriteria: [
                            {criteria: "Отражает чувства (обида, боль, ощущение ненужности)", points: 3},
                            {criteria: "Использует слова говорящего («лучший друг», «день рождения», «ненужный»)", points: 2},
                            {criteria: "Избегает обесценивания («не переживай», «ерунда»)", points: 3},
                            {criteria: "Сохраняет позицию равенства (не жалость сверху)", points: 2}
                        ],
                        maxPoints: 10
                    }
                ],
                totalPoints: 50,
                passingScore: 35,
                gradingScale: {
                    "A": "45-50 баллов (Отлично)",
                    "B": "40-44 балла (Очень хорошо)",
                    "C": "35-39 баллов (Хорошо)",
                    "D": "30-34 балла (Удовлетворительно)",
                    "F": "Менее 30 баллов (Не сдано)"
                }
            }
        },
        {
            id: 2,
            title: "Модуль 2. Общение с людьми, пережившими травму",
            description: "Как поддержать, не навредив",
            completed: false,
            submodules: [
                {
                    id: "2.1",
                    title: "Анатомия травмы",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/jqc1Sz7b/09f76f0d-eef4-41ff-9e59-80ac6197a099.jpg">
        <img src="https://i.postimg.cc/PrBQXx2s/09f76f0d-eef4-41ff-9e59-80ac6197.jpg" alt="Анатомия травмы" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Травма — это не то, что произошло, а то, что осталось внутри»</div>
        <p class="author">— Джудит Герман</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Травма — это не само ужасное событие, а реакция нашей нервной системы на него.</p>
    <ul>
        <li><strong>Механизм:</strong> Когда ресурсов психики не хватает, чтобы переварить шок, опыт «застревает». Человек может жить в прошлом, реагируя на триггеры здесь и сейчас так, будто опасность все еще рядом.</li>
        <li><strong>Влияние на общение:</strong> Человек в травме может быть гиперчувствительным, замкнутым или агрессивным. Это не «плохой характер», это работа миндалевидного тела (центра страха) в мозге.</li>
        <li><strong>Задача собеседника:</strong> Не быть терапевтом, а быть «стабильным объектом». Ваше спокойствие помогает их нервной системе успокоиться (ко-регуляция).</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Триггер</h4>
        <p>Стимул (звук, запах, ситуация), который вызывает воспоминание о травмирующем событии и эмоциональную реакцию.</p>
    </div>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Ко-регуляция</h4>
        <p>Процесс, когда спокойное состояние одного человека помогает успокоиться другому. Основа безопасности в отношениях.</p>
    </div>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>National Center for PTSD</strong></p>
        <p>Посттравматическое стрессовое расстройство (ПТСР) может развиться после воздействия травмирующего события и включает симптомы повторного переживания, избегания и гипервозбуждения.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Говорить спокойным, ровным голосом</td>
                <td>Говорить громко или резко</td>
            </tr>
            <tr>
                <td>Быть предсказуемым в своих реакциях</td>
                <td>Неожиданно менять тему или настроение</td>
            </tr>
            <tr>
                <td>Давать человеку пространство, не приближаться резко</td>
                <td>Вторгаться в личное пространство</td>
            </tr>
            <tr>
                <td>Спрашивать разрешения перед прикосновением</td>
                <td>Прикасаться без предупреждения</td>
            </tr>
            <tr>
                <td>Признавать право на любые чувства</td>
                <td>Оценивать чувства как «правильные» или «неправильные»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Как проявляется травма в повседневном общении:</strong></p>
    <table class="trauma-table">
        <tr>
            <th>Проявление</th>
            <th>Как это выглядит</th>
            <th>Что НЕ говорить</th>
            <th>Что сказать вместо этого</th>
        </tr>
        <tr>
            <td>Повышенная тревожность</td>
            <td>Постоянное ожидание плохого, невозможность расслабиться</td>
            <td>«Не нервничай из-за ерунды»</td>
            <td>«Похоже, тебе сейчас очень тревожно»</td>
        </tr>
        <tr>
            <td>Эмоциональное онемение</td>
            <td>Кажется равнодушным, не проявляет эмоций</td>
            <td>«Да развесь же ты уши!»</td>
            <td>«Иногда после тяжелого чувства притупляются, это нормально»</td>
        </tr>
        <tr>
            <td>Вспышки гнева</td>
            <td>Агрессивная реакция на мелкие раздражители</td>
            <td>«Что ты как ненормальный!»</td>
            <td>«Я вижу, ты очень зол. Хочешь об этом поговорить?»</td>
        </tr>
        <tr>
            <td>Избегание</td>
            <td>Отказывается от встреч, разговоров</td>
            <td>«Ты что, затворником стал?»</td>
            <td>«Я здесь, когда будешь готов пообщаться»</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Важное правило:</h4>
        <p>Если вы не знаете, что сказать человеку, пережившему травму, лучше просто молча побыть рядом. Ваше присутствие иногда важнее слов.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Объясните разницу между событием и травмой</h4>
        <p>Приведите пример: как одно и то же событие (например, ДТП) может стать травмой для одного человека и не стать для другого?</p>
        <textarea id="answer2_1" placeholder="Напишите ваш ответ здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('2.1')">Проверить задание</button>
        <div id="feedback2_1" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое триггер в контексте травмы?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_2_1_option1" name="q1_2_1" value="a">
                <label for="q1_2_1_option1">Лекарство от ПТСР</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_1_option2" name="q1_2_1" value="b">
                <label for="q1_2_1_option2">Стимул, вызывающий воспоминание о травме</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_1_option3" name="q1_2_1" value="c">
                <label for="q1_2_1_option3">Тип психотерапии</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны о травме? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_2_1_option1" name="q2_2_1" value="a">
                <label for="q2_2_1_option1">Травма — это реакция нервной системы на событие</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_1_option2" name="q2_2_1" value="b">
                <label for="q2_2_1_option2">Все люди одинаково реагируют на одинаковые события</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_1_option3" name="q2_2_1" value="c">
                <label for="q2_2_1_option3">Ко-регуляция помогает успокоить нервную систему</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_1_option4" name="q2_2_1" value="d">
                <label for="q2_2_1_option4">Травма всегда проявляется одинаково у всех людей</label>
            </div>
        </div>
        
        <p><strong>Что важно при общении с человеком, пережившим травму?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_2_1_option1" name="q3_2_1" value="a">
                <label for="q3_2_1_option1">Быть терапевтом и решать его проблемы</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_1_option2" name="q3_2_1" value="b">
                <label for="q3_2_1_option2">Быть «стабильным объектом» и сохранять спокойствие</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_1_option3" name="q3_2_1" value="c">
                <label for="q3_2_1_option3">Заставлять говорить о травме для «проработки»</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('2.1')">Проверить тест</button>
        <div id="quiz-feedback2_1" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (анализ случаев):</h5>
        <p>Прочитайте ситуации и определите, какие факторы могли превратить событие в травму:</p>
        <p>1. Две подруги пережили развод. Одна через год вышла замуж снова, другая 5 лет боится отношений.</p>
        <textarea id="extra2_1a" placeholder="Ваш анализ..."></textarea>
        <p>2. Два студента провалили экзамен. Один через неделю пересдал, второй бросил учебу.</p>
        <textarea id="extra2_1b" placeholder="Ваш анализ..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('2.1')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .trauma-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.9em;
    }
    
    .trauma-table th {
        background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
        color: white;
        padding: 12px;
        text-align: left;
        white-space: nowrap;
    }
    
    .trauma-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .trauma-table tr:hover {
        background: rgba(155, 89, 182, 0.05);
    }
</style>`
                },
                {
                    id: "2.2",
                    title: "Токсичная позитивность и обесценивание",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/tRDVvgLW/production-images-aa115eb7-6edf.png">
        <img src="https://i.postimg.cc/tJry3wv2/production-images-aa115eb7-6edf-4e9b-88c5-557eac318796.png" alt="Токсичная позитивность" class="responsive-image">
    </picture>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Самые благие намерения часто наносят вред.</p>
    <ul>
        <li><strong>Токсичная позитивность:</strong> Это навязывание счастья и отрицание негатива. Фразы типа «Всё будет хорошо», «Улыбнись», «Ищи плюсы» говорят человеку: «Твои текущие чувства неправильные, скрой их». Это вызывает стыд и изоляцию.</li>
        <li><strong>Обесценивание:</strong> Попытка уменьшить проблему, чтобы она казалась решаемой. «Да ерунда», «У других хуже». Это сигнал: «Твоя боль не важна».</li>
        <li><strong>Сравнительное страдание:</strong> Вера в то, что если кто-то голодает в Африке, вы не имеете права грустить из-за увольнения. Эмпатия не конечный ресурс, она не заканчивается от того, что вы посочувствовали обоим.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Токсичная позитивность</h4>
        <p>Культура, требующая от человека быть позитивным всегда, даже когда это неуместно. Отрицает сложные эмоции и может усугублять страдания.</p>
    </div>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>Психологические исследования травмы</strong></p>
        <p>Исследования показывают, что неподдерживающие реакции (обесценивание, советы, токсичная позитивность) могут усилить симптомы ПТСР и замедлить восстановление.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Это действительно тяжело. Я с тобой»</td>
                <td>«Не грусти, всё наладится»</td>
            </tr>
            <tr>
                <td>«Твои чувства важны и имеют право на существование»</td>
                <td>«У других проблемы серьезнее, тебе есть за что быть благодарным»</td>
            </tr>
            <tr>
                <td>«Кажется, тебе действительно больно»</td>
                <td>«Не плачь, возьми себя в руки»</td>
            </tr>
            <tr>
                <td>«Иногда жизнь несправедлива, и это нормально злиться»</td>
                <td>«Смотри на позитив, ищи плюсы»</td>
            </tr>
            <tr>
                <td>Признавать сложность и боль ситуации</td>
                <td>Требовать быстрого «движения дальше»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Примеры вредных фраз и их влияние:</strong></p>
    <table class="toxic-phrases-table">
        <tr>
            <th>Вредная фраза</th>
            <th>Что слышит человек</th>
            <th>Альтернатива</th>
        </tr>
        <tr>
            <td>«Не думай об этом»</td>
            <td>«Твои мысли неправильные, контролируй их»</td>
            <td>«Это, должно быть, тяжело — постоянно об этом думать»</td>
        </tr>
        <tr>
            <td>«Время лечит»</td>
            <td>«Терпи, и все само пройдет»</td>
            <td>«Каждый справляется в своем темпе»</td>
        </tr>
        <tr>
            <td>«Ты сильный, справишься»</td>
            <td>«Не показывай слабость»</td>
            <td>«Это нормально — чувствовать себя слабым в такой ситуации»</td>
        </tr>
        <tr>
            <td>«Забудь и живи дальше»</td>
            <td>«Твоя боль не важна, просто игнорируй ее»</td>
            <td>«Это часть твоей истории, и ты имеешь право чувствовать все, что чувствуешь»</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Упражнение на неделю:</h4>
        <p>Запишите 3 фразы, которые вы обычно говорите, когда кому-то плохо. Проанализируйте, не содержат ли они токсичной позитивности или обесценивания.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Составьте список фраз, которых стоит избегать</h4>
        <p>Перечислите 4 фразы, которые представляют токсичную позитивность или обесценивание чувств человека, пережившего травму.</p>
        <textarea id="answer2_2" placeholder="Напишите фразы здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('2.2')">Проверить задание</button>
        <div id="feedback2_2" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое токсичная позитивность?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_2_2_option1" name="q1_2_2" value="a">
                <label for="q1_2_2_option1">Позитивное мышление, которое всегда помогает</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_2_option2" name="q1_2_2" value="b">
                <label for="q1_2_2_option2">Навязывание позитивных эмоций и отрицание негативных</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_2_option3" name="q1_2_2" value="c">
                <label for="q1_2_2_option3">Способ быстро выйти из депрессии</label>
            </div>
        </div>
        
        <p><strong>Какие из этих фраз представляют токсичную позитивность? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_2_2_option1" name="q2_2_2" value="a">
                <label for="q2_2_2_option1">«Все будет хорошо»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_2_option2" name="q2_2_2" value="b">
                <label for="q2_2_2_option2">«У других еще хуже»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_2_option3" name="q2_2_2" value="c">
                <label for="q2_2_2_option3">«Похоже, тебе действительно тяжело»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_2_option4" name="q2_2_2" value="d">
                <label for="q2_2_2_option4">«Улыбнись, не грусти»</label>
            </div>
        </div>
        
        <p><strong>Почему фраза «У других проблемы серьезнее» вредна?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_2_2_option1" name="q3_2_2" value="a">
                <label for="q3_2_2_option1">Она обесценивает чувства человека</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_2_option2" name="q3_2_2" value="b">
                <label for="q3_2_2_option2">Она заставляет чувствовать вину за свои переживания</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_2_option3" name="q3_2_2" value="c">
                <label for="q3_2_2_option3">И то, и другое</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('2.2')">Проверить тест</button>
        <div id="quiz-feedback2_2" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (трансформация фраз):</h5>
        <p>Переформулируйте эти токсичные фразы в поддерживающие:</p>
        <p>1. «Не плачь, все образуется» →</p>
        <textarea id="extra2_2a" placeholder="Новая фраза..."></textarea>
        <p>2. «У других проблемы серьезнее» →</p>
        <textarea id="extra2_2b" placeholder="Новая фраза..."></textarea>
        <p>3. «Хватит ныть, возьми себя в руки» →</p>
        <textarea id="extra2_2c" placeholder="Новая фраза..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('2.2')">Проверить трансформацию</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .toxic-phrases-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.9em;
    }
    
    .toxic-phrases-table th {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .toxic-phrases-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .toxic-phrases-table tr:hover {
        background: rgba(231, 76, 60, 0.05);
    }
</style>`
                },
                {
                    id: "2.3",
                    title: "Создание безопасного пространства",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/h4xKhZ00/production-images-936ef6e8-aa91.png">
        <img src="https://i.postimg.cc/XYWqV6Sg/production-images-936ef6e8-aa91-4742-ba60-1015cc7c97cf.png" alt="Безопасное пространство" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Безопасность — не отсутствие угрозы, а присутствие связи»</div>
        <p class="author">— Брюс Перри</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Безопасное пространство (Holding space) — это готовность быть с человеком, не осуждая его, не пытаясь его исправить и не влияя на исход ситуации.</p>
    <ul>
        <li><strong>Отсутствие оценки:</strong> Мы убираем внутреннего критика. Если человек говорит «Я ненавижу свою мать», мы не говорим «Так нельзя», мы принимаем это как факт его чувств сейчас.</li>
        <li><strong>Конфиденциальность:</strong> Ощущение, что сказанное останется здесь.</li>
        <li><strong>Предсказуемость:</strong> Вы не вскакиваете, не перебиваете, ваши реакции стабильны.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Холдинг (holding)</h4>
        <p>В психологии — способность «удерживать» эмоции другого, не разрушаясь под их тяжестью. Создание психологической «колыбели» для чувств.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Я здесь, просто побудь со мной»</td>
                <td>«Давай я решу твою проблему»</td>
            </tr>
            <tr>
                <td>Слушать без перебивания</td>
                <td>Перебивать своими историями или советами</td>
            </tr>
            <tr>
                <td>Сохранять спокойный, ровный тон</td>
                <td>Показывать тревогу или раздражение</td>
            </tr>
            <tr>
                <td>Уважать молчание и паузы</td>
                <td>Заполнять тишину разговорами</td>
            </tr>
            <tr>
                <td>Спрашивать: «Хочешь поговорить об этом?»</td>
                <td>Давить: «Расскажи мне все подробно»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Что разрушает безопасное пространство:</strong></p>
    <table class="safety-breakers">
        <tr>
            <th>Действие</th>
            <th>Почему разрушает</th>
        </tr>
        <tr>
            <td>Перебивание</td>
            <td>Сообщает: «Мое мнение важнее твоих чувств»</td>
        </tr>
        <tr>
            <td>Рассказ о своем опыте</td>
            <td>Уводит фокус с человека на вас</td>
        </tr>
        <tr>
            <td>Советы без запроса</td>
            <td>Лишает человека чувства контроля</td>
        </tr>
        <tr>
            <td>Оценочные суждения</td>
            <td>«Ты не должен так чувствовать» вызывает стыд</td>
        </tr>
        <tr>
            <td>Нетерпение</td>
            <td>Постукивание пальцами, взгляды на часы</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Практика для начинающих:</h4>
        <p>Начните с малого: в следующем разговоре просто слушайте 3 минуты, не говоря ни слова (кроме поддерживающих «угу», «понимаю»). Отметьте, что изменилось в диалоге.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Придумайте диалог с поддержкой без давления</h4>
        <p>Ситуация: ваш друг пережил серьезную аварию месяц назад, до сих пор боится садиться в машину.</p>
        <p>Напишите диалог, где вы поддерживаете друга, но не навязываете помощь и не давите.</p>
        <textarea id="answer2_3" placeholder="Напишите диалог здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('2.3')">Проверить задание</button>
        <div id="feedback2_3" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что важнее всего при создании безопасного пространства?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_2_3_option1" name="q1_2_3" value="a">
                <label for="q1_2_3_option1">Быстро решить проблему человека</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_3_option2" name="q1_2_3" value="b">
                <label for="q1_2_3_option2">Обеспечить контроль и выбор самому человеку</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_2_3_option3" name="q1_2_3" value="c">
                <label for="q1_2_3_option3">Дать множество советов</label>
            </div>
        </div>
        
        <p><strong>Какие действия создают безопасное пространство? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_2_3_option1" name="q2_2_3" value="a">
                <label for="q2_2_3_option1">Слушать без перебивания</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_3_option2" name="q2_2_3" value="b">
                <label for="q2_2_3_option2">Сохранять конфиденциальность</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_3_option3" name="q2_2_3" value="c">
                <label for="q2_2_3_option3">Оценивать чувства как правильные/неправильные</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_2_3_option4" name="q2_2_3" value="d">
                <label for="q2_2_3_option4">Уважать паузы и молчание</label>
            </div>
        </div>
        
        <p><strong>Что такое «холдинг» в психологии?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_2_3_option1" name="q3_2_3" value="a">
                <label for="q3_2_3_option1">Способность удерживать эмоции другого без разрушения</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_3_option2" name="q3_2_3" value="b">
                <label for="q3_2_3_option2">Техника физического удерживания человека</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_2_3_option3" name="q3_2_3" value="c">
                <label for="q3_2_3_option3">Метод быстрого решения проблем</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('2.3')">Проверить тест</button>
        <div id="quiz-feedback2_3" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (анализ ситуаций):</h5>
        <p>Проанализируйте, как создать безопасное пространство в этих ситуациях:</p>
        <p>1. Ребенок боится темноты после просмотра страшного фильма.</p>
        <textarea id="extra2_3a" placeholder="Ваш план..."></textarea>
        <p>2. Пожилой человек потерял супруга и не хочет ни с кем общаться.</p>
        <textarea id="extra2_3b" placeholder="Ваш план..."></textarea>
        <p>3. Коллега переживает из-за публичного провала на совещании.</p>
        <textarea id="extra2_3c" placeholder="Ваш план..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('2.3')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .safety-breakers {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .safety-breakers th {
        background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .safety-breakers td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .safety-breakers tr:hover {
        background: rgba(243, 156, 18, 0.05);
    }
</style>`
                }
            ],
            test: {
                title: "Контрольная работа 2: Общение с людьми, пережившими травму",
                description: "Тест по общению с людьми, пережившими травму",
                timeLimit: 35,
                sections: [
                    {
                        title: "Теоретическая часть",
                        type: "theory",
                        questions: [
                            {
                                type: "multiple-choice",
                                question: "Что такое токсичная позитивность?",
                                options: [
                                    "Позитивное мышление, которое всегда помогает",
                                    "Навязывание позитивных эмоций и отрицание негативных",
                                    "Способ быстро выйти из депрессии",
                                    "Метод психотерапии при травмах"
                                ],
                                correct: 1,
                                explanation: "Токсичная позитивность — это требование быть позитивным всегда, даже когда это неуместно. Она отрицает право человека на сложные эмоции и может усугубить страдания."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что важнее всего при создании безопасного пространства?",
                                options: [
                                    "Быстро решить проблему человека",
                                    "Дать множество советов",
                                    "Обеспечить контроль и выбор самому человеку",
                                    "Убедить человека забыть о травме"
                                ],
                                correct: 2,
                                explanation: "Безопасное пространство предполагает, что человек чувствует контроль над ситуацией. Когда у него есть выбор (говорить/не говорить, принимать помощь/отказаться), снижается тревога и включаются внутренние ресурсы."
                            },
                            {
                                type: "true-false",
                                question: "Фраза 'Время лечит' всегда поддерживающая и уместная.",
                                correct: false,
                                explanation: "Часто эта фраза воспринимается как обесценивание текущих страданий. Она как бы говорит: «Твоя боль сейчас не важна, просто жди». Более эмпатично: «Каждый справляется в своем темпе»."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое триггер в контексте травмы?",
                                options: [
                                    "Стимул, вызывающий воспоминание о травме",
                                    "Лекарство от ПТСР",
                                    "Тип психотерапии",
                                    "Стадия переживания горя"
                                ],
                                correct: 0,
                                explanation: "Триггер — это любой стимул (звук, запах, ситуация, слово), который запускает воспоминание о травмирующем событии и соответствующую эмоциональную реакцию, как будто опасность здесь и сейчас."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое ко-регуляция?",
                                options: [
                                    "Когда два человека ссорятся",
                                    "Когда спокойное состояние одного помогает успокоиться другому",
                                    "Когда оба человека испытывают одинаковые эмоции",
                                    "Когда терапевт регулирует эмоции клиента"
                                ],
                                correct: 1,
                                explanation: "Ко-регуляция — это процесс, когда нервная система одного человека (обычно более спокойного) помогает успокоиться нервной системе другого. Это основа безопасности в отношениях."
                            }
                        ]
                    },
                    {
                        title: "Ситуационный анализ",
                        type: "practical",
                        questions: [
                            {
                                type: "transformation",
                                question: "Переформулируйте токсичные фразы в поддерживающие:",
                                items: [
                                    { toxic: "«Не плачь, все образуется»", id: "trans1" },
                                    { toxic: "«Хватит ныть, возьми себя в руки»", id: "trans2" },
                                    { toxic: "«Забудь и живи дальше»", id: "trans3" }
                                ],
                                modelAnswers: {
                                    trans1: "«Слезы — это нормальная реакция на боль. Я здесь с тобой.»",
                                    trans2: "«Похоже, тебе действительно тяжело. Хочешь рассказать, что именно давит больше всего?»",
                                    trans3: "«Это часть твоей истории. Ты имеешь право чувствовать все, что чувствуешь.»"
                                },
                                points: 9,
                                evaluationCriteria: [
                                    "Убирает токсичную позитивность - 1 балл",
                                    "Сохраняет уважение к чувствам - 1 балл",
                                    "Содержит валидацию - 1 балл"
                                ]
                            },
                            {
                                type: "dialogue",
                                question: "Ситуация: ваш друг пережил автомобильную аварию месяц назад. Он боится садиться в машину. Напишите диалог из 5-7 реплик, демонстрирующий создание безопасного пространства.",
                                modelDialog: `Вы: «Как ты себя чувствуешь, когда думаешь о поездке в машине?»
Друг: «Меня всю трясет, сердце колотится...»
Вы: «Это страх очень ощутимый, прямо в теле.»
Друг: «Да, и кажется, что снова попаду в аварию.»
Вы: «После такого опыта это естественно — бояться. Травма оставляет след.»
Друг: «Но как жить? Не могу же я всегда ходить пешком.»
Вы: «Ты хочешь найти способ справляться со страхом?»
Друг: «Да, но не знаю как...»
Вы: «Хочешь, вместе подумаем о маленьких шагах? Например, сначала просто посидеть в неподвижной машине?»`,
                                points: 15,
                                evaluationCriteria: [
                                    "Использует открытые вопросы - 3 балла",
                                    "Валидирует чувства - 3 балла",
                                    "Дает выбор и контроль - 3 балла",
                                    "Предлагает маленькие шаги - 3 балла",
                                    "Сохраняет уважительный тон - 3 балла"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Практическое задание",
                        type: "assignment",
                        task: "Перед вами человек, переживший потерю близкого полгода назад. Он говорит: «До сих пор не могу поверить, что его нет. Иногда ловлю себя на мысли, что вот-вот позвоню ему». Напишите ответ, который создает безопасное пространство.",
                        modelAnswer: "«Это совершенно естественно — еще не верить и иногда забываться. Связь с близким человеком не обрывается в один момент. Ты имеешь право горевать в своем темпе.»",
                        scoringCriteria: [
                            {criteria: "Признает нормальность реакции", points: 3},
                            {criteria: "Избегает обесценивания («пора двигаться»)", points: 3},
                            {criteria: "Поддерживает право на индивидуальный темп", points: 2},
                            {criteria: "Не дает непрошеных советов", points: 2}
                        ],
                        maxPoints: 10
                    }
                ],
                totalPoints: 50,
                passingScore: 35,
                gradingScale: {
                    "A": "45-50 баллов (Отлично)",
                    "B": "40-44 балла (Очень хорошо)",
                    "C": "35-39 баллов (Хорошо)",
                    "D": "30-34 балла (Удовлетворительно)",
                    "F": "Менее 30 баллов (Не сдано)"
                }
            }
        },
        {
            id: 3,
            title: "Модуль 3. Активное слушание",
            description: "Техники слышания и понимания",
            completed: false,
            submodules: [
                {
                    id: "3.1",
                    title: "Техника отражения и перефразирования",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/T2zbGLLn/production-images-2476882b-49bb-(1).png">
        <img src="https://i.postimg.cc/zBdy93mw/production-images-2476882b-49bb.png" alt="Техника отражения" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Самое главное в общении — слышать то, что не сказано»</div>
        <p class="author">— Питер Друкер</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Отражение — это возвращение собеседнику сути его слов, чтобы он услышал себя со стороны и понял, что вы его поняли.</p>
    <ul>
        <li><strong>Эхо-техника:</strong> Повторение последних слов (с вопросительной интонацией).<br><em>Клиент: «Я так устал от этой неопределенности».<br>Вы: «От неопределенности?..»</em></li>
        <li><strong>Парафраз смысла:</strong> «Правильно ли я слышу, что ты чувствуешь... потому что...».</li>
        <li><strong>Валидация:</strong> Подтверждение нормальности чувств. «Это совершенно естественно — злиться в такой ситуации».</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Валидация</h4>
        <p>Подтверждение значимости и законности чувств другого человека. Не означает согласие, а означает: «Твои чувства имеют право на существование».</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Похоже, ты чувствуешь разочарование»</td>
                <td>«Не расстраивайся из-за ерунды»</td>
            </tr>
            <tr>
                <td>«Если я правильно понял, тебе больно из-за...»</td>
                <td>«Ты неправильно все понял»</td>
            </tr>
            <tr>
                <td>«Ты говоришь, что чувствуешь себя одиноко»</td>
                <td>«У тебя же есть друзья, что ты одинокий»</td>
            </tr>
            <tr>
                <td>Использовать слова собеседника для отражения</td>
                <td>Перефразировать так, что смысл искажается</td>
            </tr>
            <tr>
                <td>Спрашивать: «Правильно ли я тебя понял?»</td>
                <td>Утверждать: «Я знаю, что ты чувствуешь»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Примеры правильного и неправильного отражения:</strong></p>
    <table class="reflection-examples">
        <tr>
            <th>Что говорит человек</th>
            <th>Неправильное отражение</th>
            <th>Правильное отражение</th>
        </tr>
        <tr>
            <td>«Я ненавижу свою работу»</td>
            <td>«Не говори так, работа хорошая» (оценка)</td>
            <td>«Ты чувствуешь сильное раздражение к своей работе» (отражение)</td>
        </tr>
        <tr>
            <td>«Меня никто не понимает»</td>
            <td>«Это неправда, я же тебя понимаю» (опровержение)</td>
            <td>«Ты чувствуешь себя одиноко и непонятым» (отражение)</td>
        </tr>
        <tr>
            <td>«Я не знаю, что делать»</td>
            <td>«Просто сделай вот так...» (совет)</td>
            <td>«Ты ощущаешь растерянность и неопределенность» (отражение)</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Практика на сегодня:</h4>
        <p>В одном разговоре сегодня попробуйте использовать технику отражения хотя бы один раз. Просто скажите: «Если я правильно понял, ты чувствуешь...» и посмотрите на реакцию.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Примените технику отражения</h4>
        <p>Жалоба: «Меня постоянно критикует начальник. Даже когда я делаю все правильно, он находит к чему придраться. Я уже не знаю, как работать в таком стрессе.»</p>
        <p>Напишите ответ, используя технику отражения.</p>
        <textarea id="answer3_1" placeholder="Напишите ваш ответ здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('3.1')">Проверить задание</button>
        <div id="feedback3_1" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое техника отражения?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_3_1_option1" name="q1_3_1" value="a">
                <label for="q1_3_1_option1">Критика слов собеседника</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_1_option2" name="q1_3_1" value="b">
                <label for="q1_3_1_option2">Повторение ключевых слов собеседника</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_1_option3" name="q1_3_1" value="c">
                <label for="q1_3_1_option3">Рассказ о своем похожем опыте</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны о валидации? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_3_1_option1" name="q2_3_1" value="a">
                <label for="q2_3_1_option1">Подтверждает право человека на его чувства</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_1_option2" name="q2_3_1" value="b">
                <label for="q2_3_1_option2">Означает согласие с поведением человека</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_1_option3" name="q2_3_1" value="c">
                <label for="q2_3_1_option3">Помогает человеку чувствовать себя понятым</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_1_option4" name="q2_3_1" value="d">
                <label for="q2_3_1_option4">Критикует эмоциональные реакции</label>
            </div>
        </div>
        
        <p><strong>Что такое «эхо-техника» в отражении?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_3_1_option1" name="q3_3_1" value="a">
                <label for="q3_3_1_option1">Повторение последних слов с вопросительной интонацией</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_1_option2" name="q3_3_1" value="b">
                <label for="q3_3_1_option2">Кричать, чтобы перекричать собеседника</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_1_option3" name="q3_3_1" value="c">
                <label for="q3_3_1_option3">Игнорирование слов собеседника</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('3.1')">Проверить тест</button>
        <div id="quiz-feedback3_1" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (практика отражения):</h5>
        <p>Потренируйтесь отражать разные типы высказываний:</p>
        <p>1. «Я так злюсь на мужа! Он опять забыл про нашу годовщину.»</p>
        <textarea id="extra3_1a" placeholder="Ваше отражение..."></textarea>
        <p>2. «У меня ничего не получается. Я неудачник.»</p>
        <textarea id="extra3_1b" placeholder="Ваше отражение..."></textarea>
        <p>3. «Я не знаю, радоваться мне или плакать. С одной стороны повысили, с другой — нагрузка удвоилась.»</p>
        <textarea id="extra3_1c" placeholder="Ваше отражение..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('3.1')">Проверить отражения</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .reflection-examples {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .reflection-examples th {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .reflection-examples td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .reflection-examples tr:hover {
        background: rgba(52, 152, 219, 0.05);
    }
</style>`
                },
                {
                    id: "3.2",
                    title: "Уточняющие вопросы (Искусство задавания вопросов)",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/nznd3SZr/production-images-4326d45d-4c80-(1).png">
        <img src="https://i.postimg.cc/yxVwSYWt/production-images-4326d45d-4c80.png" alt="Уточняющие вопросы" class="responsive-image">
    </picture>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong></p>
    <ul>
        <li><strong>Открытые вопросы:</strong> Начинаются с «Что», «Как», «Каким образом». Они приглашают к рассказу.</li>
        <li><strong>Закрытые вопросы:</strong> Требуют ответа «Да/Нет». Полезны для уточнения фактов, но убивают диалог о чувствах.</li>
        <li><strong>Опасное «Почему»:</strong> Вопрос «Почему ты это сделал?» часто звучит как обвинение. Лучше заменить на «Что побудило тебя?..» или «Как так вышло, что?..».</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Открытые вопросы</h4>
        <p>Вопросы, на которые нельзя ответить «да» или «нет». Они начинаются с: что, как, каким образом, расскажи, опиши, что чувствуешь и т.д.</p>
    </div>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>MindTools: Active Listening</strong></p>
        <p>Активное слушание включает 5 ключевых элементов: 1) Полное внимание, 2) Отражение, 3) Уточнение, 4) Резюмирование, 5) Отсроченная реакция. Уточняющие вопросы помогают избежать недопонимания.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Что ты чувствуешь сейчас?»</td>
                <td>«Тебе плохо?»</td>
            </tr>
            <tr>
                <td>«Как это на тебя повлияло?»</td>
                <td>«Это было плохо?»</td>
            </tr>
            <tr>
                <td>«Что было самым сложным?»</td>
                <td>«Было сложно?»</td>
            </tr>
            <tr>
                <td>«Что привело к такому решению?»</td>
                <td>«Почему ты так поступил?»</td>
            </tr>
            <tr>
                <td>«О чем ты думал в тот момент?»</td>
                <td>«Ты думал об этом?»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Типы открытых вопросов и когда их использовать:</strong></p>
    <table class="question-types">
        <tr>
            <th>Тип вопроса</th>
            <th>Пример</th>
            <th>Когда использовать</th>
        </tr>
        <tr>
            <td>Вопросы о фактах</td>
            <td>«Что произошло?»</td>
            <td>В начале разговора, для ясности</td>
        </tr>
        <tr>
            <td>Вопросы о чувствах</td>
            <td>«Что ты чувствовал в тот момент?»</td>
            <td>Когда человек рассказывает о событии</td>
        </tr>
        <tr>
            <td>Вопросы о мыслях</td>
            <td>«О чем ты думал, когда это случилось?»</td>
            <td>Для понимания когнитивной реакции</td>
        </tr>
        <tr>
            <td>Вопросы о значении</td>
            <td>«Что для тебя значит эта ситуация?»</td>
            <td>Для понимания глубинного смысла</td>
        </tr>
        <tr>
            <td>Вопросы о желаниях</td>
            <td>«Чего ты хочешь сейчас?»</td>
            <td>Для перехода к решению</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Упражнение на день:</h4>
        <p>Сегодня в каждом разговоре попробуйте задать хотя бы один открытый вопрос, начинающийся с «Что» или «Как». Отметьте, как меняется диалог.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Составьте список открытых вопросов</h4>
        <p>Представьте, что друг говорит: «У меня проблемы в отношениях». Составьте 3 открытых вопроса, которые помогут ему лучше понять и выразить свои чувства.</p>
        <textarea id="answer3_2" placeholder="Напишите ваши вопросы здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('3.2')">Проверить задание</button>
        <div id="feedback3_2" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Какой вопрос является открытым?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_3_2_option1" name="q1_3_2" value="a">
                <label for="q1_3_2_option1">«Тебе плохо?»</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_2_option2" name="q1_3_2" value="b">
                <label for="q1_3_2_option2">«Что ты чувствуешь сейчас?»</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_2_option3" name="q1_3_2" value="c">
                <label for="q1_3_2_option3">«Ты злишься на начальника?»</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны об открытых вопросах? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_3_2_option1" name="q2_3_2" value="a">
                <label for="q2_3_2_option1">Начинаются с «что», «как», «расскажи»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_2_option2" name="q2_3_2" value="b">
                <label for="q2_3_2_option2">Требуют ответа «да» или «нет»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_2_option3" name="q2_3_2" value="c">
                <label for="q2_3_2_option3">Помогают человеку раскрыться</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_2_option4" name="q2_3_2" value="d">
                <label for="q2_3_2_option4">Приглашают к развернутому ответу</label>
            </div>
        </div>
        
        <p><strong>Почему вопрос «почему» может быть проблемным?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_3_2_option1" name="q3_3_2" value="a">
                <label for="q3_3_2_option1">Он слишком длинный</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_2_option2" name="q3_3_2" value="b">
                <label for="q3_3_2_option2">Он звучит как обвинение</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_2_option3" name="q3_3_2" value="c">
                <label for="q3_3_2_option3">На него нельзя ответить</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('3.2')">Проверить тест</button>
        <div id="quiz-feedback3_2" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (трансформация вопросов):</h5>
        <p>Преобразуйте закрытые вопросы в открытые:</p>
        <p>1. «Ты злишься на начальника?» →</p>
        <textarea id="extra3_2a" placeholder="Открытый вариант..."></textarea>
        <p>2. «Тебе плохо?» →</p>
        <textarea id="extra3_2b" placeholder="Открытый вариант..."></textarea>
        <p>3. «Это случилось вчера?» →</p>
        <textarea id="extra3_2c" placeholder="Открытый вариант..."></textarea>
        <p>4. «Ты хочешь помочь?» →</p>
        <textarea id="extra3_2d" placeholder="Открытый вариант..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('3.2')">Проверить трансформацию</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .question-types {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.9em;
    }
    
    .question-types th {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .question-types td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .question-types tr:hover {
        background: rgba(46, 204, 113, 0.05);
    }
</style>`
                },
                {
                    id: "3.3",
                    title: "Невербальное слушание и паузы",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/Hsm0GZhM/production-images-3dd3d439-2006-(1).png">
        <img src="https://i.postimg.cc/Kc6q1DsD/production-images-3dd3d439-2006.png" alt="Невербальное слушание" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Иногда молчание — лучший способ показать, что ты рядом»</div>
        <p class="author">— Неизвестный автор</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong></p>
    <ul>
        <li><strong>Сила паузы:</strong> В паузах происходит осознание. Если человек замолчал, не спешите заполнять эфир. Дайте ему 3–5 секунд. Часто после паузы следует самое важное признание.</li>
        <li><strong>Активное молчание:</strong> Это не проверка телефона. Это взгляд в глаза, кивки, звуки подтверждения («угу», «ммм»). Вы всем видом показываете: «Я здесь, продолжай».</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Активное молчание</h4>
        <p>Состояние полного присутствия и внимания к собеседнику без слов. Включает зрительный контакт, кивки, соответствующее выражение лица.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Слегка кивать, поддерживая зрительный контакт</td>
                <td>Смотреть в телефон или по сторонам</td>
            </tr>
            <tr>
                <td>Выдерживать паузы (3-5 секунд)</td>
                <td>Заполнять каждую паузу словами</td>
            </tr>
            <tr>
                <td>Использовать минимальные ответы: «угу», «понятно»</td>
                <td>Перебивать своими историями</td>
            </tr>
            <tr>
                <td>Наклоняться немного вперед к собеседнику</td>
                <td>Откидываться назад, скрещивать руки</td>
            </tr>
            <tr>
                <td>Выражение лица соответствует эмоциям собеседника</td>
                <td>Улыбаться, когда человек плачет</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Элементы невербального слушания и их значение:</strong></p>
    <table class="nonverbal-elements">
        <tr>
            <th>Элемент</th>
            <th>Что показывает</th>
            <th>Как правильно</th>
            <th>Как неправильно</th>
        </tr>
        <tr>
            <td>Зрительный контакт</td>
            <td>Внимание, интерес</td>
            <td>Смотреть в глаза 60-70% времени</td>
            <td>Уставиться или избегать взгляда</td>
        </tr>
        <tr>
            <td>Наклон тела</td>
            <td>Вовлеченность</td>
            <td>Легкий наклон вперед</td>
            <td>Откинуться назад или отвернуться</td>
        </tr>
        <tr>
            <td>Выражение лица</td>
            <td>Эмпатия</td>
            <td>Соответствовать эмоции собеседника</td>
            <td>Показывать скуку или раздражение</td>
        </tr>
        <tr>
            <td>Кивки</td>
            <td>Понимание, согласие</td>
            <td>Легкие кивки в такт речи</td>
            <td>Быстрые частые кивки (нервность)</td>
        </tr>
        <tr>
            <td>Жесты</td>
            <td>Открытость</td>
            <td>Расслабленные руки, открытые ладони</td>
            <td>Скрещенные руки, закрытые позы</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Эксперимент на неделю:</h4>
        <p>В одном разговоре в день сознательно используйте «активное молчание»: не говорите ничего, только кивайте и поддерживайте зрительный контакт. Запишите, что изменилось в диалоге.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Опишите невербальные сигналы активного слушания</h4>
        <p>Представьте ситуацию: ваш друг расстроен и рассказывает о проблеме. Опишите 3-4 невербальных сигнала, которые покажут, что вы активно слушаете.</p>
        <textarea id="answer3_3" placeholder="Напишите ваше описание здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('3.3')">Проверить задание</button>
        <div id="feedback3_3" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое активное молчание?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_3_3_option1" name="q1_3_3" value="a">
                <label for="q1_3_3_option1">Полное отсутствие реакции на собеседника</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_3_option2" name="q1_3_3" value="b">
                <label for="q1_3_3_option2">Полное присутствие без слов, но с невербальными сигналами</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_3_3_option3" name="q1_3_3" value="c">
                <label for="q1_3_3_option3">Проверка телефона во время разговора</label>
            </div>
        </div>
        
        <p><strong>Какие невербальные сигналы показывают активное слушание? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_3_3_option1" name="q2_3_3" value="a">
                <label for="q2_3_3_option1">Легкие кивки головой</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_3_option2" name="q2_3_3" value="b">
                <label for="q2_3_3_option2">Наклон тела к собеседнику</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_3_option3" name="q2_3_3" value="c">
                <label for="q2_3_3_option3">Скрещенные руки на груди</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_3_3_option4" name="q2_3_3" value="d">
                <label for="q2_3_3_option4">Умеренный зрительный контакт</label>
            </div>
        </div>
        
        <p><strong>Почему паузы важны в разговоре?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_3_3_option1" name="q3_3_3" value="a">
                <label for="q3_3_3_option1">Они создают неловкость</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_3_option2" name="q3_3_3" value="b">
                <label for="q3_3_3_option2">Они дают время подумать и способствуют глубине</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_3_3_option3" name="q3_3_3" value="c">
                <label for="q3_3_3_option3">Они показывают незаинтересованность</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('3.3')">Проверить тест</button>
        <div id="quiz-feedback3_3" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (анализ видеозаписи):</h5>
        <p>Посмотрите любое интервью (можно на YouTube) и проанализируйте невербальное поведение слушающего:</p>
        <p>1. Как часто он кивает?</p>
        <textarea id="extra3_3a" placeholder="Ваши наблюдения..."></textarea>
        <p>2. Какое у него выражение лица?</p>
        <textarea id="extra3_3b" placeholder="Ваши наблюдения..."></textarea>
        <p>3. Как он использует паузы?</p>
        <textarea id="extra3_3c" placeholder="Ваши наблюдения..."></textarea>
        <p>4. Какие ошибки, если есть, вы заметили?</p>
        <textarea id="extra3_3d" placeholder="Ваши наблюдения..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('3.3')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .nonverbal-elements {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.85em;
    }
    
    .nonverbal-elements th {
        background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
        color: white;
        padding: 10px;
        text-align: left;
        white-space: nowrap;
    }
    
    .nonverbal-elements td {
        padding: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .nonverbal-elements tr:hover {
        background: rgba(243, 156, 18, 0.05);
    }
</style>`
                }
            ],
            test: {
                title: "Контрольная работа 3: Активное слушание",
                description: "Тест по технике активного слушания",
                timeLimit: 30,
                sections: [
                    {
                        title: "Теоретическая часть",
                        type: "theory",
                        questions: [
                            {
                                type: "multiple-choice",
                                question: "Какой вопрос является открытым?",
                                options: [
                                    "«Тебе плохо?»",
                                    "«Что ты чувствуешь сейчас?»",
                                    "«Ты злишься на начальника?»",
                                    "«Это было вчера?»"
                                ],
                                correct: 1,
                                explanation: "Открытые вопросы начинаются с «что», «как», «расскажи», «опиши» и не предполагают ответа «да/нет». Они приглашают к развернутому ответу."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое техника отражения?",
                                options: [
                                    "Критика слов собеседника",
                                    "Повторение ключевых слов собеседника",
                                    "Рассказ о своем похожем опыте",
                                    "Смена темы разговора"
                                ],
                                correct: 1,
                                explanation: "Отражение (рефлексивное слушание) — это возвращение собеседнику сути его слов, возможно, в других формулировках. Показывает: «Я тебя слышу и понимаю»."
                            },
                            {
                                type: "true-false",
                                question: "Паузы в разговоре мешают эмпатическому общению.",
                                correct: false,
                                explanation: "Паузы, наоборот, помогают. Они дают время подумать, снижают темп до комфортного, позволяют эмоциям «осесть». Часто самое важное говорится после паузы."
                            },
                            {
                                type: "multiple-choice",
                                question: "Почему вопрос «почему» может быть проблемным?",
                                options: [
                                    "Он слишком длинный",
                                    "Он звучит как обвинение",
                                    "На него нельзя ответить",
                                    "Он требует специальных знаний"
                                ],
                                correct: 1,
                                explanation: "«Почему» часто воспринимается как требование оправдаться: «Почему ты это сделал?» = «Объясни свое плохое поведение». Лучше: «Что привело к такому решению?» или «Как это получилось?»"
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое валидация в общении?",
                                options: [
                                    "Проверка правдивости слов",
                                    "Подтверждение значимости чувств другого",
                                    "Критика эмоциональных реакций",
                                    "Оценка правильности поведения"
                                ],
                                correct: 1,
                                explanation: "Валидация — это сообщение: «Твои чувства имеют право на существование». Не обязательно соглашаться с поведением, но можно признать: «Я понимаю, что ты злишься»."
                            }
                        ]
                    },
                    {
                        title: "Практический анализ",
                        type: "practical",
                        questions: [
                            {
                                type: "transformation",
                                question: "Преобразуйте закрытые вопросы в открытые:",
                                items: [
                                    { closed: "Ты расстроен?", id: "qtrans1" },
                                    { closed: "Тебе помочь?", id: "qtrans2" },
                                    { closed: "Это было сложно?", id: "qtrans3" },
                                    { closed: "Ты согласен со мной?", id: "qtrans4" }
                                ],
                                modelAnswers: {
                                    qtrans1: "«Что ты чувствуешь?» или «Расскажи о своих переживаниях»",
                                    qtrans2: "«Чем я могу быть полезен?» или «Какая помощь была бы сейчас уместна?»",
                                    qtrans3: "«Что было самым сложным?» или «Как ты справлялся с трудностями?»",
                                    qtrans4: "«Как ты относишься к этой идее?» или «Что ты думаешь по этому поводу?»"
                                },
                                points: 8,
                                evaluationCriteria: [
                                    "Преобразует в открытый вопрос - 1 балл",
                                    "Сохраняет суть вопроса - 1 балл",
                                    "Способствует диалогу - 0.5 балла"
                                ]
                            },
                            {
                                type: "response",
                                question: "Жалоба: «Я постоянно ссорюсь с женой из-за мелочей. Кажется, мы разучились понимать друг друга.» Напишите ответ, используя:",
                                requirements: [
                                    "1) технику отражения",
                                    "2) один уточняющий вопрос"
                                ],
                                modelAnswer: "«Похоже, тебя беспокоит, что ссоры становятся частыми, а взаимопонимание уходит. (отражение) Что для тебя самое тяжелое в этих конфликтах? (уточняющий вопрос)»",
                                points: 10,
                                evaluationCriteria: [
                                    "Отражение ключевых чувств - 4 балла",
                                    "Вопрос открытый (начинается с «что», «как») - 3 балла",
                                    "Вопрос уточняет чувства, а не факты - 2 балла",
                                    "Ответ не содержит советов - 1 балл"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Практическое задание",
                        type: "assignment",
                        task: "Ситуация: друг говорит: «Меня уволили с работы, и я не знаю, что делать дальше». Напишите ответ, используя: а) технику отражения, б) уточняющий вопрос, в) валидацию чувств.",
                        modelAnswer: "«Увольнение — это действительно тяжелый удар. (валидация) Ты говоришь, что не знаешь, что делать дальше. (отражение) Какие мысли или чувства сейчас самые сильные? (уточняющий вопрос)»",
                        scoringCriteria: [
                            {criteria: "Использует валидацию чувств", points: 3},
                            {criteria: "Применяет технику отражения", points: 3},
                            {criteria: "Задает уточняющий открытый вопрос", points: 3},
                            {criteria: "Сохраняет поддерживающий тон", points: 1}
                        ],
                        maxPoints: 10
                    }
                ],
                totalPoints: 50,
                passingScore: 35,
                gradingScale: {
                    "A": "45-50 баллов (Отлично)",
                    "B": "40-44 балла (Очень хорошо)",
                    "C": "35-39 баллов (Хорошо)",
                    "D": "30-34 балла (Удовлетворительно)",
                    "F": "Менее 30 баллов (Не сдано)"
                }
            }
        },
        {
            id: 4,
            title: "Модуль 4. Поддержка без давления",
            description: "Помощь без спасения",
            completed: false,
            submodules: [
                {
                    id: "4.1",
                    title: "Треугольник Карпмана: Помощь vs Спасательство",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/7Y4xw4N1/production-images-72872d40-f7f3-(1).png">
        <img src="https://i.postimg.cc/8z1PBGJL/production-images-72872d40-f7f3.png" alt="Треугольник Карпмана" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Дайте человеку удочку, а не рыбу»</div>
        <p class="author">— Китайская пословица</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong></p>
    <ul>
        <li><strong>Помощь (Партнерство):</strong> Вы даете удочку. Вы верите, что у человека есть силы справиться, вы лишь ассистируете. Ответственность остается на человеке.</li>
        <li><strong>Спасательство (Треугольник Карпмана):</strong> Вы делаете за человека, даже когда он не просил. Вы считаете его беспомощным. Это тешит ваше эго («Я герой»), но делает другого зависимым. В итоге Спасатель часто становится Жертвой («Я для них всё, а они неблагодарные») или Преследователем.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Треугольник Карпмана</h4>
        <p>Модель созависимых отношений, где люди играют три роли: Спасатель (делает за других), Жертва (беспомощный) и Преследователь (обвинитель). Роли могут меняться.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать (помощь)</th>
                <th>Как плохо делать (спасение)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Хочешь, помогу составить план?»</td>
                <td>«Я сделаю это за тебя»</td>
            </tr>
            <tr>
                <td>«Давай подумаем вместе, как ты можешь это исправить»</td>
                <td>«Не волнуйся, я уже всё уладил»</td>
            </tr>
            <tr>
                <td>«Каков твой план действий?»</td>
                <td>«Вот тебе план, просто следуй ему»</td>
            </tr>
            <tr>
                <td>«Чем именно я могу быть полезен?»</td>
                <td>«Дай лучше я, а то ты не справишься»</td>
            </tr>
            <tr>
                <td>Уважать отказ от помощи без обиды</td>
                <td>Обижаться, если помощь отвергают</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Разница между помощью и спасением:</strong></p>
    <table class="help-rescue-table">
        <tr>
            <th>Помощь (здоровая)</th>
            <th>Спасение (нездоровое)</th>
        </tr>
        <tr>
            <td>Поддержка самостоятельности</td>
            <td>Лишение выбора и контроля</td>
        </tr>
        <tr>
            <td>Уважение границ</td>
            <td>Нарушение границ</td>
        </tr>
        <tr>
            <td>Верит в способности человека</td>
            <td>Считает человека беспомощным</td>
        </tr>
        <tr>
            <td>Дает инструменты и знания</td>
            <td>Решает проблему самостоятельно</td>
        </tr>
        <tr>
            <td>Ответственность остается у человека</td>
            <td>Берет ответственность на себя</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Самопроверка:</h4>
        <p>Вспомните последний раз, когда вы помогали. Задайте себе вопросы: 1) Меня просили? 2) Я давал выбор? 3) Я верю, что человек справится сам? Если на все «да» — это помощь. Если есть «нет» — возможно, спасение.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Определите, где помощь, а где спасение</h4>
        <p>Прочитайте ситуации и определите, где проявляется здоровая помощь, а где — нездоровое спасение:</p>
        <p>1. «Дай, я сам поговорю с твоим начальником о повышении.»</p>
        <p>2. «Хочешь, вместе подготовимся к разговору с начальником?»</p>
        <p>3. «Я знаю лучше, что тебе делать. Слушай меня.»</p>
        <textarea id="answer4_1" placeholder="Напишите ваш анализ здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('4.1')">Проверить задание</button>
        <div id="feedback4_1" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Какая фраза предлагает помощь, а не спасение?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_4_1_option1" name="q1_4_1" value="a">
                <label for="q1_4_1_option1">«Я все сделаю за тебя»</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_1_option2" name="q1_4_1" value="b">
                <label for="q1_4_1_option2">«Хочешь, помогу составить план?»</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_1_option3" name="q1_4_1" value="c">
                <label for="q1_4_1_option3">«Ты должен сделать это немедленно»</label>
            </div>
        </div>
        
        <p><strong>Какие утверждения верны о треугольнике Карпмана? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_4_1_option1" name="q2_4_1" value="a">
                <label for="q2_4_1_option1">Включает роли Спасателя, Жертвы, Преследователя</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_1_option2" name="q2_4_1" value="b">
                <label for="q2_4_1_option2">Роли всегда фиксированы и не меняются</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_1_option3" name="q2_4_1" value="c">
                <label for="q2_4_1_option3">Представляет созависимые отношения</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_1_option4" name="q2_4_1" value="d">
                <label for="q2_4_1_option4">Спасатель делает за других, даже когда не просят</label>
            </div>
        </div>
        
        <p><strong>Кто такие участники треугольника Карпмана?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_4_1_option1" name="q3_4_1" value="a">
                <label for="q3_4_1_option1">Помощник, получатель, наблюдатель</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_1_option2" name="q3_4_1" value="b">
                <label for="q3_4_1_option2">Спасатель, жертва, преследователь</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_1_option3" name="q3_4_1" value="c">
                <label for="q3_4_1_option3">Лидер, последователь, оппозиционер</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('4.1')">Проверить тест</button>
        <div id="quiz-feedback4_1" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (анализ ролей):</h5>
        <p>Проанализируйте эти ситуации с точки зрения треугольника Карпмана:</p>
        <p>1. Мама делает уроки за ребенка, потому что «он устал».</p>
        <textarea id="extra4_1a" placeholder="Кто какую роль играет?"></textarea>
        <p>2. Мужчина постоянно решает проблемы подруги, которая вечно попадает в неприятности.</p>
        <textarea id="extra4_1b" placeholder="Кто какую роль играет?"></textarea>
        <p>3. Женщина жалуется, что все пользуются ее добротой, но продолжает всем помогать.</p>
        <textarea id="extra4_1c" placeholder="Кто какую роль играет?"></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('4.1')">Проверить анализ</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .help-rescue-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .help-rescue-table th {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .help-rescue-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .help-rescue-table tr:hover {
        background: rgba(46, 204, 113, 0.05);
    }
</style>`
                },
                {
                    id: "4.2",
                    title: "Формулировка экологичных предложений",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/HW2N8CgP/production-images-e970a623-2c2c-(1).png">
        <img src="https://i.postimg.cc/GpyN48L6/production-images-e970a623-2c2c.png" alt="Экологичные предложения" class="responsive-image">
    </picture>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Экологичность общения — это уважение к субъектности (воле) другого.</p>
    <ul>
        <li><strong>Вопрос-разрешение:</strong> Прежде чем поддержать или дать совет, спросите: «Тебе сейчас нужно решение или просто выговориться?».</li>
        <li><strong>Я-сообщения:</strong> Вместо директивного «Тебе надо поспать», используйте мягкое предложение: «Я переживаю за твое состояние, может быть, стоит отдохнуть?».</li>
        <li><strong>Принцип выбора:</strong> Всегда оставляйте человеку право отказаться от помощи без чувства вины.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Я-сообщения</h4>
        <p>Способ говорить о своих чувствах и потребностях без обвинений. Формула: «Я чувствую... когда ты... потому что... я хотел бы...».</p>
    </div>
    
    <div class="source-box">
        <h4>📚 Источник</h4>
        <p><strong>Психология помогающего поведения</strong></p>
        <p>Исследования показывают, что помощь, предлагаемая с уважением к автономии, более эффективна и способствует реальным изменениям, чем спасение.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>«Хочешь, я помогу с этим? Как именно?»</td>
                <td>«Я сделаю это за тебя»</td>
            </tr>
            <tr>
                <td>«Я замечаю, что ты выглядишь уставшим. Может, отдохнешь?»</td>
                <td>«Ты должен больше отдыхать»</td>
            </tr>
            <tr>
                <td>«У меня есть идея, хочешь послушать?»</td>
                <td>«Просто сделай так...»</td>
            </tr>
            <tr>
                <td>«Сейчас у меня нет ресурса помочь, но верю, что ты справишься»</td>
                <td>«Сам разбирайся со своими проблемами»</td>
            </tr>
            <tr>
                <td>«Как ты смотришь на визит к врачу?»</td>
                <td>«Ты должен пойти к врачу»</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Формулы экологичных предложений:</strong></p>
    <table class="eco-formulas">
        <tr>
            <th>Ситуация</th>
            <th>Нездоровая формулировка</th>
            <th>Экологичная формулировка</th>
        </tr>
        <tr>
            <td>Предложение помощи</td>
            <td>«Я сделаю это за тебя»</td>
            <td>«Хочешь, я помогу с этим? Если да, то как именно я могу быть полезен?»</td>
        </tr>
        <tr>
            <td>Выражение заботы</td>
            <td>«Ты должен больше отдыхать»</td>
            <td>«Я замечаю, что ты выглядишь уставшим. Может, стоит немного отдохнуть?»</td>
        </tr>
        <tr>
            <td>Предложение решения</td>
            <td>«Просто сделай так...»</td>
            <td>«У меня есть идея, хочешь послушать? Можешь использовать, если тебе откликнется»</td>
        </tr>
        <tr>
            <td>Отказ в помощи</td>
            <td>«Сам разбирайся со своими проблемами»</td>
            <td>«Сейчас у меня нет ресурса помочь, но я верю, что ты справишься. Если будут сложности, можем обсудить позже»</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Практика на неделю:</h4>
        <p>На этой неделе перед тем, как предложить помощь, всегда сначала спрашивайте: «Чем я могу быть полезен?» или «Хочешь, я помогу?» Запишите, как меняются реакции людей.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Переформулируйте фразы спасения в фразы помощи</h4>
        <p>1. «Не волнуйся, я сам поговорю с твоим начальником»</p>
        <p>2. «Я знаю, что для тебя лучше, сделай так, как я говорю»</p>
        <p>3. «Дай я все сделаю за тебя, ты все равно не справишься»</p>
        <textarea id="answer4_2" placeholder="Напишите ваши варианты здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('4.2')">Проверить задание</button>
        <div id="feedback4_2" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое я-сообщения?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_4_2_option1" name="q1_4_2" value="a">
                <label for="q1_4_2_option1">Обвинения в форме «ты»</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_2_option2" name="q1_4_2" value="b">
                <label for="q1_4_2_option2">Говорение о своих чувствах без обвинений</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_2_option3" name="q1_4_2" value="c">
                <label for="q1_4_2_option3">Критика поведения других</label>
            </div>
        </div>
        
        <p><strong>Какие формулировки являются экологичными? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_4_2_option1" name="q2_4_2" value="a">
                <label for="q2_4_2_option1">«Хочешь, я помогу?»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_2_option2" name="q2_4_2" value="b">
                <label for="q2_4_2_option2">«Я сделаю это за тебя»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_2_option3" name="q2_4_2" value="c">
                <label for="q2_4_2_option3">«Как ты смотришь на...?»</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_2_option4" name="q2_4_2" value="d">
                <label for="q2_4_2_option4">«Ты должен...»</label>
            </div>
        </div>
        
        <p><strong>Почему важно спрашивать «Чем я могу быть полезен?»</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_4_2_option1" name="q3_4_2" value="a">
                <label for="q3_4_2_option1">Чтобы быстрее закончить разговор</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_2_option2" name="q3_4_2" value="b">
                <label for="q3_4_2_option2">Чтобы сохранить контроль и выбор за человеком</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_2_option3" name="q3_4_2" value="c">
                <label for="q3_4_2_option3">Чтобы показать свое превосходство</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('4.2')">Проверить тест</button>
        <div id="quiz-feedback4_2" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (практика я-сообщений):</h5>
        <p>Переформулируйте эти фразы в я-сообщения:</p>
        <p>1. «Ты никогда меня не слушаешь!» →</p>
        <textarea id="extra4_2a" placeholder="Я-сообщение..."></textarea>
        <p>2. «Ты опять все испортил» →</p>
        <textarea id="extra4_2b" placeholder="Я-сообщение..."></textarea>
        <p>3. «Перестань ныть и действуй» →</p>
        <textarea id="extra4_2c" placeholder="Я-сообщение..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('4.2')">Проверить я-сообщения</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .eco-formulas {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.9em;
    }
    
    .eco-formulas th {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .eco-formulas td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .eco-formulas tr:hover {
        background: rgba(52, 152, 219, 0.05);
    }
</style>`
                },
                {
                    id: "4.3",
                    title: "Баланс между заботой и автономией",
                    content: `
<div class="theory-block">
    <picture>
        <source media="(max-width: 1000px)" srcset="https://i.postimg.cc/25gbC5Tv/9bbfb80f-9429-4d20-896c-dbd6c199-(1).jpg">
        <img src="https://i.postimg.cc/43yVJqGk/9bbfb80f-9429-4d20-896c-dbd6c199.jpg" alt="Баланс заботы и автономии" class="responsive-image">
    </picture>

    <div class="quote-box">
        <div class="quote">«Можно вытащить человека из воды, но нельзя заставить его плавать»</div>
        <p class="author">— Неизвестный автор</p>
    </div>

    <h3>Теория</h3>
    <p><strong>Расширенная теория:</strong> Гиперопека — враг автономии.</p>
    <ul>
        <li><strong>Зона ближайшего развития:</strong> Поддерживать нужно там, где человек почти может сам, но ему чуть-чуть трудно. Делать то, что он может сам — значит инвалидизировать его.</li>
        <li><strong>Уважение к «Нет»:</strong> Если человек отказывается от помощи, это проявление его силы, а не глупости. Принять отказ — высшая форма уважения.</li>
    </ul>
    
    <div class="definition-box">
        <h4><span class="term">Термин:</span> Зона ближайшего развития</h4>
        <p>Концепция Выготского: задачи, которые человек может решить с помощью более опытного другого, но не может решить самостоятельно. Идеальное место для помощи.</p>
    </div>
    
    <h3>Практика: как хорошо vs как плохо</h3>
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Как хорошо делать</th>
                <th>Как плохо делать</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Спросить: «Тебе нужна поддержка?»</td>
                <td>Навязать помощь, даже когда не просят</td>
            </tr>
            <tr>
                <td>Уважать отказ: «Хорошо, если передумаешь — я рядом»</td>
                <td>Обижаться или давить при отказе</td>
            </tr>
            <tr>
                <td>Помогать в «зоне ближайшего развития»</td>
                <td>Делать за человека то, что он может сам</td>
            </tr>
            <tr>
                <td>Говорить о своих ограничениях: «Сейчас у меня мало сил»</td>
                <td>Помогать в ущерб себе до выгорания</td>
            </tr>
            <tr>
                <td>Направлять к специалистам при серьезных проблемах</td>
                <td>Брать на себя роль терапевта</td>
            </tr>
        </tbody>
    </table>
    
    <p><strong>Как найти баланс: не бросить, но и не душить заботой:</strong></p>
    <table class="balance-table">
        <tr>
            <th>Перекос в сторону</th>
            <th>Симптомы</th>
            <th>Как исправить</th>
        </tr>
        <tr>
            <td>Чрезмерная забота (гиперопека)</td>
            <td>Делаете за других то, что они могут сами<br>Тревожитесь больше, чем они<br>Обижаетесь, если помощь не принимают</td>
            <td>Спросить: «Это в твоей зоне компетенции?»<br>Сделать паузу перед помощью<br>Уважать отказ</td>
        </tr>
        <tr>
            <td>Чрезмерная дистанция (холодность)</td>
            <td>Не предлагаете помощь, даже когда явно нужна<br>Говорите «сам разбирайся»<br>Игнорируете сигналы о помощи</td>
            <td>Спросить: «Тебе нужна поддержка?»<br>Предложить конкретную помощь<br>Быть рядом, даже если не можете помочь</td>
        </tr>
    </table>
    
    <div class="practical-tip">
        <h4>📌 Тест на баланс:</h4>
        <p>Спросите себя: 1) Я помогаю по запросу или навязываюсь? 2) После помощи я чувствую себя истощенным или наполненным? 3) Человек становится самостоятельнее или зависимее от моей помощи? Если больше ответов из первой части — баланс есть.</p>
    </div>
    
    <h3>Задания для проверки знаний</h3>
    
    <div class="assignment">
        <h4>Задание 1: Ситуация установления границ</h4>
        <p>Ваш друг постоянно звонит вам среди ночи в слезах, и это длится уже месяц. Вы чувствуете выгорание. Как вы установите границы, сохраняя заботу?</p>
        <textarea id="answer4_3" placeholder="Напишите ваш вариант здесь..."></textarea>
        <button class="btn-primary" onclick="checkAssignment('4.3')">Проверить задание</button>
        <div id="feedback4_3" class="feedback"></div>
    </div>
    
    <div class="quiz">
        <h4>Задание 2: Выберите правильный ответ</h4>
        <p><strong>Что такое зона ближайшего развития?</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q1_4_3_option1" name="q1_4_3" value="a">
                <label for="q1_4_3_option1">Место, где человек отдыхает</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_3_option2" name="q1_4_3" value="b">
                <label for="q1_4_3_option2">Задачи, которые человек может решить с помощью</label>
            </div>
            <div class="option">
                <input type="radio" id="q1_4_3_option3" name="q1_4_3" value="c">
                <label for="q1_4_3_option3">Территория, где запрещено помогать</label>
            </div>
        </div>
        
        <p><strong>Почему важно уважать отказ от помощи? (выберите все подходящие)</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="checkbox" id="q2_4_3_option1" name="q2_4_3" value="a">
                <label for="q2_4_3_option1">Чтобы сохранить контроль и выбор за человеком</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_3_option2" name="q2_4_3" value="b">
                <label for="q2_4_3_option2">Отказ может быть проявлением силы</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_3_option3" name="q2_4_3" value="c">
                <label for="q2_4_3_option3">Чтобы показать свое превосходство</label>
            </div>
            <div class="option">
                <input type="checkbox" id="q2_4_3_option4" name="q2_4_3" value="d">
                <label for="q2_4_3_option4">Чтобы не тратить свое время</label>
            </div>
        </div>
        
        <p><strong>В треугольнике Карпмана спасатель со временем часто становится:</strong></p>
        
        <div class="quiz-options">
            <div class="option">
                <input type="radio" id="q3_4_3_option1" name="q3_4_3" value="a">
                <label for="q3_4_3_option1">Еще большим спасателем</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_3_option2" name="q3_4_3" value="b">
                <label for="q3_4_3_option2">Жертвой или преследователем</label>
            </div>
            <div class="option">
                <input type="radio" id="q3_4_3_option3" name="q3_4_3" value="c">
                <label for="q3_4_3_option3">Нейтральным наблюдателем</label>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="checkQuiz('4.3')">Проверить тест</button>
        <div id="quiz-feedback4_3" class="feedback"></div>
    </div>
    
    <div class="additional-task">
        <h5>Дополнительное задание (практика баланса):</h5>
        <p>Проанализируйте эти ситуации и предложите сбалансированный подход:</p>
        <p>1. Ваш взрослый сын постоянно просит денег вместо того, чтобы искать работу.</p>
        <textarea id="extra4_3a" placeholder="Ваш сбалансированный подход..."></textarea>
        <p>2. Подруга в депрессии хочет, чтобы вы решали все за нее.</p>
        <textarea id="extra4_3b" placeholder="Ваш сбалансированный подход..."></textarea>
        <p>3. Коллега постоянно перекладывает на вас свою работу.</p>
        <textarea id="extra4_3c" placeholder="Ваш сбалансированный подход..."></textarea>
        <button class="btn-secondary" onclick="checkExtraAssignment('4.3')">Проверить подходы</button>
    </div>
</div>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
    
    .balance-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.9em;
    }
    
    .balance-table th {
        background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
        color: white;
        padding: 12px;
        text-align: left;
    }
    
    .balance-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        vertical-align: top;
    }
    
    .balance-table tr:hover {
        background: rgba(243, 156, 18, 0.05);
    }
</style>`
                }
            ],
            test: {
                title: "Контрольная работа 4: Поддержка без давления",
                description: "Тест по поддержке без давления",
                timeLimit: 35,
                sections: [
                    {
                        title: "Теоретическая часть",
                        type: "theory",
                        questions: [
                            {
                                type: "multiple-choice",
                                question: "Какая фраза предлагает помощь, а не спасение?",
                                options: [
                                    "«Я все сделаю за тебя»",
                                    "«Хочешь, помогу составить план?»",
                                    "«Ты должен сделать это немедленно»",
                                    "«Я знаю, что для тебя лучше»"
                                ],
                                correct: 1,
                                explanation: "Помощь предполагает выбор («хочешь»), спасение — директивность («я сделаю», «ты должен»). Помощь дает удочку, спасение — рыбу."
                            },
                            {
                                type: "multiple-choice", 
                                question: "Почему важно уважать отказ от помощи?",
                                options: [
                                    "Чтобы быстрее закончить разговор",
                                    "Чтобы сохранить контроль и выбор за человеком",
                                    "Чтобы показать свое превосходство",
                                    "Чтобы не тратить свое время"
                                ],
                                correct: 1,
                                explanation: "Уважение к отказу — это уважение к автономии человека. Он лучше знает, что ему нужно. Иногда отказ — это проявление силы («Я справлюсь сам»), а не слабости."
                            },
                            {
                                type: "true-false",
                                question: "В треугольнике Карпмана роли всегда фиксированы и не меняются.",
                                correct: false,
                                explanation: "Роли в треугольнике Карпмана динамичны. Спасатель может стать Жертвой («Я всем помогал, а меня не ценят»), Жертва — Преследователем («Это все из-за тебя!»)."
                            },
                            {
                                type: "multiple-choice",
                                question: "Что такое зона ближайшего развития?",
                                options: [
                                    "Место, где человек отдыхает",
                                    "Задачи, которые человек может решить с помощью",
                                    "Территория, где запрещено помогать",
                                    "Область мозга, отвечающая за эмпатию"
                                ],
                                correct: 1,
                                explanation: "Зона ближайшего развития (Выготский) — это задачи, которые человек может решить С ПОМОЩЬЮ более опытного, но не может решить самостоятельно. Идеальное место для помощи."
                            },
                            {
                                type: "multiple-choice",
                                question: "Кто такие участники треугольника Карпмана?",
                                options: [
                                    "Помощник, получатель, наблюдатель",
                                    "Спасатель, жертва, преследователь",
                                    "Лидер, последователь, оппозиционер",
                                    "Учитель, ученик, родитель"
                                ],
                                correct: 1,
                                explanation: "Треугольник Карпмана: Спасатель (делает за других), Жертва (беспомощный), Преследователь (обвинитель). Это созависимые, нездоровые роли."
                            }
                        ]
                    },
                    {
                        title: "Практический анализ",
                        type: "practical",
                        questions: [
                            {
                                type: "analysis",
                                question: "Проанализируйте ситуации и определите, где помощь, а где спасение:",
                                items: [
                                    { situation: "Ребенок не может завязать шнурки. Вы завязываете за него.", id: "analysis1" },
                                    { situation: "Ребенок не может завязать шнурки. Вы садитесь рядом и говорите: «Давай попробуем вместе. Видишь эту петлю?»", id: "analysis2" },
                                    { situation: "Коллега не справляется с отчетом. Вы говорите: «Дай я сам сделаю, а ты отдохни».", id: "analysis3" },
                                    { situation: "Коллега не справляется с отчетом. Вы говорите: «Какая часть самая сложная? Может, разберем вместе?»", id: "analysis4" }
                                ],
                                correctAnswers: ["спасение", "помощь", "спасение", "помощь"],
                                points: 8,
                                explanation: "Спасение делает за человека, помощь учит и поддерживает самостоятельность."
                            },
                            {
                                type: "boundary-setting",
                                question: "Ситуация: ваш взрослый сын постоянно просит денег в долг и не возвращает. Напишите, как вы установите границы, предложив помощь в поиске работы или составлении бюджета, но отказываясь давать деньги.",
                                modelAnswer: "«Я замечаю, что тебе часто не хватает денег. Я не могу больше давать в долг, потому что это создает напряжение между нами. Но я готов помочь по-другому: можем вместе составить бюджет, поискать варианты дополнительного заработка, или я могу оплатить тебе курсы финансовой грамотности. Какой вариант тебе ближе?»",
                                points: 12,
                                evaluationCriteria: [
                                    "Четко устанавливает границы - 3 балла",
                                    "Предлагает альтернативную помощь - 3 балла",
                                    "Дает выбор - 2 балла",
                                    "Сохраняет уважительный тон - 2 балла",
                                    "Объясняет причину отказа - 2 балла"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Практическое задание",
                        type: "assignment",
                        task: "Ваш друг в депрессии уже месяц не может убраться в квартире. Напишите диалог, где вы предлагаете помощь, но не берете на себя ответственность за его жизнь.",
                        modelDialog: `Вы: «Заметил, что тебе тяжело с уборкой. Чем я могу быть полезен?»
Друг: «Не знаю... Все кажется бессмысленным.»
Вы: «Иногда депрессия забирает все силы. Хочешь, подумаем, как можно разбить уборку на маленькие шаги?»
Друг: «Наверное... Но у меня нет сил даже думать.»
Вы: «Я могу помочь составить план. Например, сегодня — только вынести мусор. Завтра — пропылесосить одну комнату. Как тебе такая идея?»
Друг: «Это звучит менее страшно.»
Вы: «Хочешь, я буду рядом, пока ты выносишь мусор? Или предпочитаешь делать это сам?»`,
                        scoringCriteria: [
                            {criteria: "Спрашивает, а не навязывает", points: 3},
                            {criteria: "Предлагает маленькие шаги", points: 3},
                            {criteria: "Дает выбор (рядом/сам)", points: 2},
                            {criteria: "Не берет на себя уборку", points: 2}
                        ],
                        maxPoints: 10
                    }
                ],
                totalPoints: 50,
                passingScore: 35,
                gradingScale: {
                    "A": "45-50 баллов (Отлично)",
                    "B": "40-44 балла (Очень хорошо)",
                    "C": "35-39 баллов (Хорошо)",
                    "D": "30-34 балла (Удовлетворительно)",
                    "F": "Менее 30 баллов (Не сдано)"
                }
            }
        }
    ],
    finalExam: {
        title: "Итоговый экзамен по курсу «Эмпатия и поддержка в общении»",
        description: "Комплексная проверка знаний по всем 5 модулям курса",
        timeLimit: 90,
        sections: [
            {
                title: "Теоретическая часть (30 баллов)",
                type: "theory",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Что является основой эмоциональной эмпатии?",
                        options: [
                            "Логическое мышление",
                            "Зеркальные нейроны",
                            "Профессиональные знания",
                            "Личный опыт"
                        ],
                        correct: 1,
                        explanation: "Зеркальные нейроны — биологический механизм, позволяющий нам «отзеркаливать» эмоции других. Когда мы видим плачущего человека, наши зеркальные нейроны активируются так, будто плачем мы сами."
                    },
                    {
                        type: "multiple-choice",
                        question: "Какая реакция на жалобу «Я так устал от всего» будет эмпатичной?",
                        options: [
                            "«Возьми себя в руки»",
                            "«Похоже, ты действительно истощен»",
                            "«У всех так бывает»",
                            "«Не думай об этом»"
                        ],
                        correct: 1,
                        explanation: "Эмпатичный ответ отражает чувства и показывает понимание. «Возьми себя в руки» — давление, «У всех так» — обесценивание, «Не думай» — отрицание. «Похоже, ты действительно истощен» — валидация."
                    },
                    {
                        type: "true-false",
                        question: "Токсичная позитивность помогает человеку быстрее справиться с трудностями.",
                        correct: false,
                        explanation: "Токсичная позитивность («Все будет хорошо», «Смотри на позитив») отрицает реальные страдания, вызывает стыд за «неправильные» чувства и может замедлить восстановление."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что важнее при активном слушании?",
                        options: [
                            "Быстро дать совет",
                            "Отзеркаливать позу собеседника",
                            "Слушать, чтобы ответить",
                            "Слушать, чтобы понять"
                        ],
                        correct: 3,
                        explanation: "Активное слушание — это слушание с целью понять, а не ответить. Когда мы слушаем, чтобы ответить, мы уже планируем свой ответ, а не слышим собеседника."
                    },
                    {
                        type: "multiple-choice",
                        question: "В треугольнике Карпмана спасатель со временем часто становится:",
                        options: [
                            "Еще большим спасателем",
                            "Жертвой или преследователем",
                            "Нейтральным наблюдателем",
                            "Профессиональным помощником"
                        ],
                        correct: 1,
                        explanation: "Спасатель, устав от «неблагодарности», часто становится Жертвой («Я всем помогал, а меня не ценят») или Преследователем («Вы все бездельники!»)."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что помогает предотвратить выгорание?",
                        options: [
                            "Работать больше часов",
                            "Установление личных границ",
                            "Игнорирование усталости",
                            "Отказ от отдыха"
                        ],
                        correct: 1,
                        explanation: "Границы — главный инструмент профилактики выгорания. Они позволяют сказать «нет», защитить свое время и энергию, вовремя отдыхать."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что такое конгруэнтность в общении?",
                        options: [
                            "Совпадение слов и невербальных сигналов",
                            "Умение убеждать",
                            "Быстрота реакции",
                            "Знание психологии"
                        ],
                        correct: 0,
                        explanation: "Конгруэнтность — когда слова соответствуют тону голоса, выражению лица, позе. Неконгруэнтное общение («Я тебе сочувствую» с улыбкой) воспринимается как неискреннее."
                    },
                    {
                        type: "multiple-choice",
                        question: "Какой вопрос поможет понять, нужна ли человеку помощь?",
                        options: [
                            "«Ты совсем беспомощный?»",
                            "«Чем я могу быть полезен?»",
                            "«Почему ты не можешь сам?»",
                            "«Когда ты научишься?»"
                        ],
                        correct: 1,
                        explanation: "«Чем я могу быть полезен?» — золотой стандарт. Он дает контроль человеку, предотвращает непрошеную помощь, показывает уважение к его автономии."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что такое валидация чувств?",
                        options: [
                            "Критика эмоциональных реакций",
                            "Подтверждение права на чувства",
                            "Игнорирование эмоций",
                            "Исправление неправильных чувств"
                        ],
                        correct: 1,
                        explanation: "Валидация — это сообщение: «Твои чувства имеют право на существование». Не обязательно соглашаться с поведением, но можно признать: «Я понимаю, что ты злишься»."
                    },
                    {
                        type: "multiple-choice",
                        question: "Почему паузы важны в разговоре?",
                        options: [
                            "Они создают неловкость",
                            "Они дают время подумать",
                            "Они показывают незаинтересованность",
                            "Они ускоряют разговор"
                        ],
                        correct: 1,
                        explanation: "Паузы дают время подумать и вам, и собеседнику. Они снижают темп, создают пространство для глубины. Часто после паузы человек говорит самое важное."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что такое зона ближайшего развития?",
                        options: [
                            "Место для отдыха",
                            "Задачи, которые человек может решить с помощью",
                            "Территория без помощи",
                            "Область комфорта"
                        ],
                        correct: 1,
                        explanation: "Зона ближайшего развития (Выготский) — это то, что человек может сделать С ПОМОЩЬЮ, но не может самостоятельно. Идеальное место для помощи — не слишком просто (скучно), не слишком сложно (страшно)."
                    },
                    {
                        type: "multiple-choice",
                        question: "Как реагировать на отказ от помощи?",
                        options: [
                            "Настаивать на помощи",
                            "Обидеться и уйти",
                            "Уважать выбор человека",
                            "Критиковать за отказ"
                        ],
                        correct: 2,
                        explanation: "Уважение к отказу — высшая форма уважения к автономии. Можно сказать: «Хорошо, я уважаю твое решение. Если передумаешь, я здесь»."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что разрушает безопасное пространство?",
                        options: [
                            "Активное слушание",
                            "Оценочные суждения",
                            "Уважение конфиденциальности",
                            "Предсказуемость реакций"
                        ],
                        correct: 1,
                        explanation: "Оценочные суждения («Ты не должен так чувствовать», «Это неправильно») вызывают стыд и закрывают человека. Безопасность предполагает безусловное принятие чувств."
                    },
                    {
                        type: "multiple-choice",
                        question: "Какой вид эмпатии наиболее устойчив к выгоранию?",
                        options: [
                            "Только эмоциональная",
                            "Только когнитивная",
                            "Баланс всех видов",
                            "Только сострадательная"
                        ],
                        correct: 2,
                        explanation: "Баланс: когнитивная (понимаю), эмоциональная (чувствую), сострадательная (хочу помочь конструктивно). Только эмоциональная ведет к выгоранию, только когнитивная — к холодности."
                    },
                    {
                        type: "multiple-choice",
                        question: "Что такое я-сообщения?",
                        options: [
                            "Обвинения в форме «ты»",
                            "Говорение о своих чувствах",
                            "Критика поведения других",
                            "Ультиматумы и требования"
                        ],
                        correct: 1,
                        explanation: "Я-сообщение: «Я чувствую X, когда ты делаешь Y, потому что Z. Я хотел(а) бы W.» Например: «Я тревожусь, когда ты не звонишь, потому что беспокоюсь. Давай договоримся звонить, если задерживаешься.»"
                    }
                ]
            },
            {
                title: "Практическая часть (45 баллов)",
                type: "practical",
                tasks: [
                    {
                        task: "Ответ на жалобу с активным слушанием",
                        situation: "Друг говорит: «Меня не ценят на работе. Я делаю больше всех, а повышают других.»",
                        requirements: "Используйте технику отражения и задайте один открытый вопрос.",
                        modelAnswer: "«Похоже, ты чувствуешь несправедливость и обиду, когда твои усилия не замечают. (отражение) Что для тебя было бы знаком признания? (открытый вопрос)»",
                        maxPoints: 10,
                        scoringCriteria: [
                            "Точное отражение чувств (несправедливость, обида) - 4 балла",
                            "Открытый вопрос, начинающийся с «что» или «как» - 3 балла",
                            "Отсутствие советов и обесценивания - 2 балла",
                            "Общий поддерживающий тон - 1 балл"
                        ]
                    },
                    {
                        task: "Диалог с человеком, пережившим травму",
                        situation: "Человек через год после развода говорит: «До сих пор не могу поверить, что она ушла. Иногда кажется, что она вот-вот вернется.»",
                        requirements: "Создайте безопасное пространство, избегая токсичной позитивности и обесценивания.",
                        modelAnswer: "«Год — это не так много для переживания такой потери. Чувство неверия и ожидание — это естественно. Ты имеешь право горевать столько, сколько нужно.»",
                        maxPoints: 10,
                        scoringCriteria: [
                            "Валидация чувств (нормализация переживаний) - 3 балла",
                            "Отсутствие токсичной позитивности - 3 балла",
                            "Признание права на индивидуальный темп - 2 балла",
                            "Создание атмосферы принятия - 2 балла"
                        ]
                    },
                    {
                        task: "Пример поддержки без давления",
                        situation: "Ваш родственник потерял работу и впал в апатию. Он не может даже приготовить себе еду.",
                        requirements: "Предложите помощь, которая поддерживает самостоятельность, а не создает зависимость.",
                        modelAnswer: "«Потеря работы — серьезный удар. Я вижу, как тебе тяжело. Я могу помочь по-разному: привезти готовой еды на пару дней, помочь составить резюме, или просто быть рядом. Что из этого было бы сейчас полезнее всего?»",
                        maxPoints: 10,
                        scoringCriteria: [
                            "Предложение помощи с уважением к автономии - 3 балла",
                            "Дает выбор (разные варианты помощи) - 3 балла",
                            "Спрашивает предпочтения («что полезнее всего») - 2 балла",
                            "Баланс практической и эмоциональной поддержки - 2 балла"
                        ]
                    },
                    {
                        task: "Установление границ",
                        situation: "Коллега постоянно делится своими личными проблемами во время работы, что мешает вам сосредоточиться.",
                        requirements: "Установите границы эмпатично, сохраняя хорошие отношения.",
                        modelAnswer: "«Я ценю, что ты доверяешь мне, и хочу быть для тебя поддержкой. Но во время рабочего дня мне сложно совмещать выслушивание и задачи. Давай договоримся обсуждать личное во время обеденного перерыва или после работы? Так я смогу быть более внимательным.»",
                        maxPoints: 10,
                        scoringCriteria: [
                            "Четкое установление границ - 3 балла",
                            "Сохранение эмпатии и уважения - 3 балла",
                            "Предложение конкретной альтернативы - 2 балла",
                            "Объяснение причины (для взаимопонимания) - 2 балла"
                        ]
                    },
                    {
                        task: "Список «запрещённых» фраз и альтернативы",
                        requirements: "Составьте список из 5 фраз, которых следует избегать при поддержке человека в кризисе, и для каждой предложите альтернативу.",
                        modelAnswer: `1) «Все будет хорошо» → «Сейчас действительно тяжело, я с тобой.»
2) «Другим еще хуже» → «Твоя боль уникальна и важна.»
3) «Не думай об этом» → «О чем ты чаще всего думаешь?»
4) «Возьми себя в руки» → «Иногда чувства накрывают с головой.»
5) «Я знаю, что ты чувствуешь» → «Я не могу полностью понять, но я пытаюсь.»`,
                        maxPoints: 5,
                        scoringCriteria: [
                            "Правильное определение токсичных фраз - 2 балла",
                            "Адекватные эмпатичные альтернативы - 2 балла",
                            "Полнота (5 пар фраз) - 1 балл"
                        ]
                    }
                ]
            },
            {
                title: "Ситуационный анализ (15 баллов)",
                type: "case-study",
                tasks: [
                    {
                        task: "Анализ сложной ситуации",
                        situation: "Ваша подруга после тяжелого расставания постоянно плачет, не выходит из дома, отказывается от помощи психолога. Ее родители просят вас «взять ее в руки», так как они «уже не знают, что делать».",
                        questions: [
                            "1. Как вы отреагируете на просьбу родителей?",
                            "2. Как вы поддержите подругу, не нарушая ее границ?",
                            "3. Как позаботитесь о себе в этой ситуации?"
                        ],
                        modelAnswers: {
                            q1: "«Я понимаю ваше беспокойство, но я не могу «взять ее в руки» — это нарушило бы ее автономию. Я могу быть рядом, слушать и поддерживать, но решение обращаться за профессиональной помощью должно быть ее собственным.»",
                            q2: "«Я вижу, как тебе тяжело. Я здесь, если хочешь поговорить или просто помолчать вместе. Если когда-нибудь захочешь рассмотреть вариант терапии, могу помочь найти специалиста.»",
                            q3: "«Установлю для себя границы: выделю определенное время для поддержки, буду регулярно отдыхать, обращусь к своему терапевту/супервизору, если почувствую выгорание.»"
                        },
                        maxPoints: 15,
                        scoringCriteria: [
                            "Уважение автономии подруги - 3 балла",
                            "Баланс поддержки и границ - 3 балла",
                            "Эмпатичный ответ родителям - 3 балла",
                            "План самоподдержки - 3 балла",
                            "Полнота и глубина анализа - 3 балла"
                        ]
                    }
                ]
            }
        ],
        scoring: {
            theory: "30 баллов (2 балла за каждый правильный ответ, всего 15 вопросов)",
            practical: "45 баллов (по 10 баллов за 4 задания + 5 баллов за список фраз)",
            caseStudy: "15 баллов",
            total: "90 баллов",
            passing: "63 балла (70%)",
            gradingScale: {
                "A": "81-90 баллов (Отлично)",
                "B": "72-80 баллов (Очень хорошо)", 
                "C": "63-71 балл (Хорошо)",
                "D": "54-62 балла (Удовлетворительно)",
                "F": "Менее 54 баллов (Не сдано)"
            }
        }
    }
};

// Экспорт данных курса
window.courseData = courseData;

// Функции для проверки заданий с выбором ответа
function checkQuiz(submoduleId) {
    console.log("=== ПРОВЕРКА ТЕСТА ===");
    
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Модуль или подмодуль не найдены");
        return;
    }
    
    const feedbackId = 'quiz-feedback' + submoduleId.replace('.', '_');
    const feedbackElement = document.getElementById(feedbackId);
    
    if (!feedbackElement) return;
    
    // Получаем все вопросы для этого подмодуля
    let score = 0;
    let totalQuestions = 0;
    let feedbackHTML = "<h4>Результаты теста:</h4>";
    
    // Определяем правильные ответы в зависимости от подмодуля
    const correctAnswers = getCorrectAnswersForSubmodule(submoduleId);
    
    // Проверяем каждый вопрос
    correctAnswers.forEach((question, index) => {
        totalQuestions++;
        const questionNumber = index + 1;
        const userAnswers = getUserAnswers(submoduleId, questionNumber, question.type);
        
        if (question.type === 'single') {
            // Одиночный выбор
            if (userAnswers === question.correct) {
                score++;
                feedbackHTML += `<p>✅ Вопрос ${questionNumber}: Верно! ${question.explanation}</p>`;
            } else {
                feedbackHTML += `<p>❌ Вопрос ${questionNumber}: Неверно. ${question.explanation}</p>`;
            }
        } else if (question.type === 'multiple') {
            // Множественный выбор
            const isCorrect = arraysEqual(userAnswers.sort(), question.correct.sort());
            if (isCorrect) {
                score++;
                feedbackHTML += `<p>✅ Вопрос ${questionNumber}: Верно! ${question.explanation}</p>`;
            } else {
                feedbackHTML += `<p>❌ Вопрос ${questionNumber}: Неверно. ${question.explanation}</p>`;
            }
        }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    feedbackHTML += `<p><strong>Итог: ${score} из ${totalQuestions} (${percentage}%)</strong></p>`;
    
    if (percentage >= 70) {
        feedbackHTML += `<p style="color: #2ecc71;">🎉 Отлично! Вы хорошо усвоили материал.</p>`;
    } else if (percentage >= 50) {
        feedbackHTML += `<p style="color: #f39c12;">📚 Хорошо, но можно лучше. Рекомендуем повторить материал.</p>`;
    } else {
        feedbackHTML += `<p style="color: #e74c3c;">📖 Нужно повторить материал. Обратите внимание на теорию.</p>`;
    }
    
    feedbackElement.innerHTML = feedbackHTML;
    feedbackElement.className = 'feedback success';
}

function getUserAnswers(submoduleId, questionNumber, questionType) {
    if (questionType === 'single') {
        // Одиночный выбор
        const radios = document.querySelectorAll(`input[name="q${questionNumber}_${submoduleId.replace('.', '_')}"]`);
        for (let radio of radios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    } else if (questionType === 'multiple') {
        // Множественный выбор
        const checkboxes = document.querySelectorAll(`input[name="q${questionNumber}_${submoduleId.replace('.', '_')}"]`);
        const selected = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                selected.push(cb.value);
            }
        });
        return selected;
    }
}

function getCorrectAnswersForSubmodule(submoduleId) {
    // Возвращаем правильные ответы для каждого подмодуля
    // В реальном приложении это должно быть в данных курса
    const answers = {
        "1.1": [
            { type: 'single', correct: 'b', explanation: 'Эмпатия — это позиция равных, жалость — позиция сверху.' },
            { type: 'multiple', correct: ['a', 'b', 'd'], explanation: 'Эмпатия требует уязвимости, это способ «чувствовать вместе» и укрепляет отношения.' }
        ],
        "1.2": [
            { type: 'single', correct: 'b', explanation: 'Эмоциональная эмпатия наиболее подвержена выгоранию из-за сильного эмоционального вовлечения.' },
            { type: 'multiple', correct: ['a', 'b', 'd'], explanation: 'Зеркальные нейроны активируются при выполнении и наблюдении действий, являются основой эмоциональной эмпатии.' },
            { type: 'single', correct: 'b', explanation: 'При анализе договора уместна когнитивная эмпатия — интеллектуальное понимание позиции другой стороны.' }
        ],
        // Добавьте ответы для остальных подмодулей...
    };
    
    return answers[submoduleId] || [];
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Функция для показа обратной связи
function showFeedback(element, message, isSuccess) {
    element.innerHTML = message;
    element.className = isSuccess ? 'feedback success' : 'feedback error';
    element.style.display = 'block';
}

console.log("✅ Данные курса загружены. Всего модулей: " + courseData.modules.length);
console.log("✅ Все подмодули обновлены: добавлены задания с выбором ответа, таблицы сравнения, объединены все вкладки");
console.log("✅ Итоговый экзамен включает: " + courseData.finalExam.sections[0].questions.length + " теоретических вопросов, " + courseData.finalExam.sections[1].tasks.length + " практических заданий, " + courseData.finalExam.sections[2].tasks.length + " ситуационный анализ");

// Добавляем стили для красивых таблиц и элементов
const tableStyles = `
<style>
    /* Основные стили для таблиц */
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .comparison-table th {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        font-weight: 600;
        text-align: left;
        padding: 16px 12px;
        text-transform: uppercase;
        font-size: 0.9em;
        letter-spacing: 0.5px;
    }
    
    .comparison-table td {
        padding: 14px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        vertical-align: top;
    }
    
    .comparison-table tr:last-child td {
        border-bottom: none;
    }
    
    .comparison-table tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.03);
    }
    
    .comparison-table tr:hover {
        background: rgba(46, 204, 113, 0.08);
        transition: background 0.2s ease;
    }
    
    /* Стили для разных типов таблиц */
    .empathy-table th,
    .mistakes-table th,
    .trauma-table th:first-child,
    .toxic-phrases-table th:first-child {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    
    .help-rescue-table th {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }
    
    .balance-table th:first-child {
        background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
    }
    
    .eco-formulas th {
        background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
    }
    
    .nonverbal-elements th {
        background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    }
    
    .question-types th {
        background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    }
    
    /* Стили для заданий с выбором ответа */
    .quiz {
        background: rgba(52, 152, 219, 0.1);
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        border-left: 5px solid #3498db;
    }
    
    .quiz h4 {
        color: #3498db;
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.2em;
    }
    
    .quiz-options {
        margin: 20px 0;
    }
    
    .option {
        margin: 12px 0;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        transition: all 0.3s;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .option:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .option input[type="radio"],
    .option input[type="checkbox"] {
        margin-right: 15px;
        transform: scale(1.2);
        cursor: pointer;
    }
    
    .option label {
        cursor: pointer;
        font-size: 1.05em;
        color: var(--text-color);
        display: inline-block;
        width: calc(100% - 40px);
        vertical-align: middle;
    }
    
    /* Стили для цитат и определений */
    .quote-box {
        background: linear-gradient(135deg, rgba(155, 89, 182, 0.15) 0%, rgba(142, 68, 173, 0.15) 100%);
        border-left: 5px solid #9b59b6;
        padding: 25px;
        margin: 25px 0;
        border-radius: 0 12px 12px 0;
    }
    
    .quote {
        font-size: 1.3em;
        font-style: italic;
        color: #f1c40f;
        margin: 0;
        line-height: 1.5;
    }
    
    .author {
        text-align: right;
        color: #95a5a6;
        margin: 15px 0 0 0;
        font-size: 0.95em;
    }
    
    .definition-box {
        background: rgba(52, 152, 219, 0.1);
        border-left: 4px solid #3498db;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .definition-box h4 {
        color: #3498db;
        margin-top: 0;
    }
    
    .term {
        color: #f1c40f;
        font-weight: bold;
    }
    
    .source-box {
        background: rgba(46, 204, 113, 0.1);
        border-left: 4px solid #2ecc71;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .source-box h4 {
        color: #2ecc71;
        margin-top: 0;
    }
    
    /* Стили для заданий */
    .assignment {
        background: rgba(243, 156, 18, 0.1);
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        border-left: 5px solid #f39c12;
    }
    
    .assignment h4 {
        color: #f39c12;
        margin-top: 0;
        margin-bottom: 15px;
    }
    
    .additional-task {
        background: rgba(149, 165, 166, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .additional-task h5 {
        color: #95a5a6;
        margin-top: 0;
    }
    
    /* Кнопки */
    .btn-primary, .btn-secondary {
        padding: 12px 25px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        font-size: 1em;
        margin-top: 15px;
        display: inline-block;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Поля ввода */
    textarea {
        width: 100%;
        min-height: 120px;
        padding: 15px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-color);
        font-family: inherit;
        font-size: 1em;
        resize: vertical;
        transition: border-color 0.3s;
        margin: 10px 0;
    }
    
    textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    /* Обратная связь */
    .feedback {
        margin-top: 20px;
        padding: 15px;
        border-radius: 8px;
        display: none;
    }
    
    .feedback.success {
        background: rgba(46, 204, 113, 0.1);
        border-left: 4px solid #2ecc71;
        color: #2ecc71;
    }
    
    .feedback.error {
        background: rgba(231, 76, 60, 0.1);
        border-left: 4px solid #e74c3c;
        color: #e74c3c;
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
        }
        
        table {
            font-size: 0.85em;
        }
        
        .comparison-table th, 
        .comparison-table td {
            padding: 10px 8px;
        }
        
        .quiz, .assignment {
            padding: 15px;
        }
        
        .option {
            padding: 12px;
        }
        
        .quote-box {
            padding: 20px;
        }
        
        .quote {
            font-size: 1.1em;
        }
    }
    
    /* Анимации */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .theory-block > * {
        animation: fadeIn 0.5s ease-out;
    }
    
    /* Заголовки */
    h3 {
        color: #3498db;
        margin-top: 30px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(52, 152, 219, 0.2);
    }
    
    .practical-tip {
        background: rgba(241, 196, 15, 0.1);
        border-left: 4px solid #f1c40f;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .practical-tip h4 {
        color: #f1c40f;
        margin-top: 0;
    }
</style>
`;

// Добавляем стили в документ
document.head.insertAdjacentHTML('beforeend', tableStyles);

console.log("✅ Стили для всех элементов добавлены");
