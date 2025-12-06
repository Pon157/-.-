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
                    title: "Что такое эмпатия",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Эмпатия — это способность понимать и разделять чувства другого человека, при этом сохраняя ясное осознание того, что эти чувства принадлежат другому.</p>
                            <p><strong>Ключевое отличие от сочувствия:</strong></p>
                            <ul>
                                <li><strong>Сочувствие (жалость)</strong> — это чувство сожаления о несчастье другого, часто с позиции сверху вниз («мне жаль тебя»).</li>
                                <li><strong>Эмпатия (сопереживание)</strong> — это способность поставить себя на место другого и понять его переживания «изнутри» («я понимаю, что ты чувствуешь»).</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Эмпатия — это способность разделить чувства другого, оставаясь собой»</div>
                            <p class="author">— Карл Роджерс</p>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>APA Dictionary of Psychology</strong></p>
                                <p>Американская психологическая ассоциация. Эмпатия определяется как понимание эмоционального состояния другого человека с точки зрения этого человека, а также способность разделить его эмоции.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Опишите разницу между «жалко» и «понимаю тебя»</h4>
                                <p>Приведите примеры двух фраз: одной, выражающей жалость, и другой, выражающей эмпатию, в ответ на ситуацию: «У меня провалился важный проект на работе».</p>
                                <textarea id="answer1_1" placeholder="Напишите ваши варианты фраз здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('1.1')">Проверить задание</button>
                                <div id="feedback1_1" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const keywordsEmpathy = ["понимаю", "представляю", "должно быть", "чувствую", "разделяю", "поддержку"];
                                const keywordsPity = ["жалко", "жалеешь", "бедный", "несчастный", "сожалею", "повезло бы"];
                                
                                let hasEmpathy = false;
                                let hasPity = false;
                                
                                keywordsEmpathy.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) hasEmpathy = true;
                                });
                                
                                keywordsPity.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) hasPity = true;
                                });
                                
                                if (hasEmpathy && hasPity) {
                                    return {correct: true, message: "Отлично! Вы четко разделили эмпатию («понимаю тебя») и жалость («жалко»)."};
                                } else if (hasEmpathy) {
                                    return {correct: true, message: "Хорошо! Вы привели пример эмпатии. Попробуйте также добавить пример жалости для контраста."};
                                } else {
                                    return {correct: false, message: "Попробуйте еще. Ищите разницу: жалость — это чувство сверху, эмпатия — разделение чувств на равных."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "1.2",
                    title: "Виды эмпатии",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Психологи выделяют три основных вида эмпатии:</p>
                            <ul>
                                <li><strong>Когнитивная эмпатия</strong> — способность понять, что другой человек чувствует и о чем думает (понимание перспективы).</li>
                                <li><strong>Эмоциональная эмпатия</strong> — способность физически ощутить чувства другого человека, как если бы они были вашими (сопереживание).</li>
                                <li><strong>Сострадательная эмпатия</strong> — понимание чувств другого и желание помочь (эмпатия + действие).</li>
                            </ul>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>Greater Good Science Center, Калифорнийский университет в Беркли</strong></p>
                                <p>Исследования центра показывают, что сострадательная эмпатия наиболее эффективна для построения прочных отношений и оказания реальной помощи.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Приведите пример каждого вида эмпатии</h4>
                                <p>Представьте ситуацию: друг потерял работу. Как проявится каждый вид эмпатии?</p>
                                <textarea id="answer1_2" placeholder="Напишите ваши примеры здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('1.2')">Проверить задание</button>
                                <div id="feedback1_2" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const types = ["когнитив", "эмоциональ", "сострада"];
                                let foundTypes = 0;
                                
                                types.forEach(type => {
                                    if (answer.toLowerCase().includes(type)) foundTypes++;
                                });
                                
                                if (foundTypes >= 2) {
                                    return {correct: true, message: "Хорошая работа! Вы правильно определили виды эмпатии."};
                                } else {
                                    return {correct: false, message: "Попробуйте включить в ответ упоминания когнитивной, эмоциональной и сострадательной эмпатии."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "1.3",
                    title: "Эмпатия в общении",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Эмпатия в общении проявляется не только через слова, но и через невербальные сигналы:</p>
                            <ul>
                                <li><strong>Тон голоса</strong> — спокойный, теплый, соответствующий настроению собеседника.</li>
                                <li><strong>Выражение лица</strong> — отзеркаливание эмоций (без преувеличения).</li>
                                <li><strong>Язык тела</strong> — открытая поза, наклон к собеседнику, кивки.</li>
                                <li><strong>Паузы и молчание</strong> — предоставление времени для выражения чувств.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Слушать — значит слышать не только слова, но и чувства»</div>
                            <p class="author">— Неизвестный автор</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Ответьте эмпатично</h4>
                                <p>Перед вами жалоба: «Я так устал от всего. На работе постоянный прессинг, дома тоже никто не понимает. Кажется, я вообще ни на что не способен.»</p>
                                <p>Напишите эмпатический ответ, который отразит чувства говорящего.</p>
                                <textarea id="answer1_3" placeholder="Напишите ваш ответ здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('1.3')">Проверить задание</button>
                                <div id="feedback1_3" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const reflectionWords = ["устал", "прессинг", "не понимает", "не способен", "тяжело", "сложно"];
                                let reflectionCount = 0;
                                
                                reflectionWords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) reflectionCount++;
                                });
                                
                                if (reflectionCount >= 2 && !answer.toLowerCase().includes("не переживай") && !answer.toLowerCase().includes("все будет хорошо")) {
                                    return {correct: true, message: "Отличный эмпатический ответ! Вы отразили чувства собеседника, не переходя в обесценивание или ложный оптимизм."};
                                } else if (reflectionCount >= 1) {
                                    return {correct: true, message: "Хорошо! Вы начали отражать чувства. Попробуйте также использовать слова, которые передают понимание эмоционального состояния."};
                                } else {
                                    return {correct: false, message: "Попробуйте использовать «отражение» — повторите ключевые эмоциональные слова из жалобы, чтобы показать, что вы действительно слышите чувства."};
                                }
                            }
                        }
                    }
                }
            ],
            test: {
                title: "Контрольная работа 1",
                description: "Тест по основам эмпатии и практическое задание",
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
                        correct: 1
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
                        correct: 2
                    }
                ],
                practical: {
                    task: "Перед вами жалоба: «Мой лучший друг забыл про мой день рождения. Я чувствую себя совсем ненужным.» Напишите эмпатический ответ.",
                    check: function(answer) {
                        const keywords = ["понимаю", "обидно", "чувствуешь себя", "должно быть", "расстроен", "важно"];
                        let keywordCount = 0;
                        
                        keywords.forEach(word => {
                            if (answer.toLowerCase().includes(word)) keywordCount++;
                        });
                        
                        return keywordCount >= 2;
                    }
                }
            }
        },
        // Модули 2-5 будут иметь аналогичную структуру
        {
            id: 2,
            title: "Модуль 2. Общение с людьми, пережившими травму",
            description: "Как поддержать, не навредив",
            completed: false,
            submodules: [
                // Подмодули 2.1, 2.2, 2.3
            ]
        },
        {
            id: 3,
            title: "Модуль 3. Активное слушание", 
            description: "Техники слышания и понимания",
            completed: false,
            submodules: []
        },
        {
            id: 4,
            title: "Модуль 4. Поддержка без давления",
            description: "Помощь без спасения",
            completed: false,
            submodules: []
        },
        {
            id: 5, 
            title: "Модуль 5. Самоподдержка и границы",
            description: "Забота о себе и установление границ",
            completed: false,
            submodules: []
        }
    ],
    finalExam: {
        title: "Итоговый экзамен",
        description: "Проверка знаний по всему курсу",
        theoryQuestions: 20,
        practicalTasks: [
            "Ответ на жалобу с активным слушанием",
            "Диалог с человеком, пережившим травму",
            "Список «запрещённых» фраз",
            "Пример поддержки без давления"
        ]
    }
};

// Состояние прогресса пользователя
let userProgress = {
    currentModule: 1,
    currentSubmodule: "1.1",
    completedModules: [],
    completedSubmodules: [],
    testResults: {},
    assignmentResults: {}
};

// Инициализация прогресса из localStorage
function initProgress() {
    const savedProgress = localStorage.getItem('empathyCourseProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
}

// Сохранение прогресса в localStorage
function saveProgress() {
    localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
    
    // Обновление прогресса на UI
    updateProgressUI();
}

// Обновление отображения прогресса
function updateProgressUI() {
    const totalSubmodules = courseData.modules.reduce((total, module) => {
        return total + module.submodules.length;
    }, 0);
    
    const completedSubmodules = userProgress.completedSubmodules.length;
    const progressPercent = totalSubmodules > 0 ? Math.round((completedSubmodules / totalSubmodules) * 100) : 0;
    
    // Обновление прогресс-бара
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `Прогресс: ${progressPercent}%`;
    }
    
    // Активация кнопки сертификата при 100% выполнении
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        if (progressPercent === 100) {
            certificateBtn.classList.remove('disabled');
        } else {
            certificateBtn.classList.add('disabled');
        }
    }
}
