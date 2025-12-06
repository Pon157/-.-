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
        {
            id: 2,
            title: "Модуль 2. Общение с людьми, пережившими травму",
            description: "Как поддержать, не навредив",
            completed: false,
            submodules: [
                {
                    id: "2.1",
                    title: "Что такое травма",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Травма — это не просто событие, а его психологический след, который остается в человеке надолго.</p>
                            <ul>
                                <li><strong>Травма ≠ событие:</strong> Два человека могут пережить одно и то же событие, но только у одного разовьется травма.</li>
                                <li><strong>Субъективное переживание:</strong> Важна не объективная тяжесть события, а то, как человек его воспринял.</li>
                                <li><strong>Долгосрочные последствия:</strong> Травма влияет на восприятие мира, отношения с другими и самооценку.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Травма — это не то, что произошло, а то, что осталось внутри»</div>
                            <p class="author">— Джудит Герман</p>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>National Center for PTSD</strong></p>
                                <p>Посттравматическое стрессовое расстройство (ПТСР) может развиться после воздействия травмирующего события и включает симптомы повторного переживания, избегания и гипервозбуждения.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Объясните разницу между событием и травмой</h4>
                                <p>Приведите пример: как одно и то же событие (например, ДТП) может стать травмой для одного человека и не стать для другого?</p>
                                <textarea id="answer2_1" placeholder="Напишите ваш ответ здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('2.1')">Проверить задание</button>
                                <div id="feedback2_1" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const keywords = ["субъектив", "восприятие", "след", "последствия", "внутри", "переживание"];
                                let keywordCount = 0;
                                
                                keywords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) keywordCount++;
                                });
                                
                                if (keywordCount >= 2) {
                                    return {correct: true, message: "Отлично! Вы правильно поняли, что травма — это внутренний след события, а не само событие."};
                                } else {
                                    return {correct: false, message: "Попробуйте подчеркнуть, что травма — это то, как человек пережил событие внутри себя, а не само событие."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "2.2",
                    title: "Ошибки в общении",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Наиболее частые и вредные ошибки при общении с пережившими травму:</p>
                            <ul>
                                <li><strong>Токсичная позитивность:</strong> «Все будет хорошо», «Смотри на позитив» — обесценивает реальные страдания.</li>
                                <li><strong>Обесценивание:</strong> «Другим еще хуже», «Это не так страшно» — отрицает право человека на свои чувства.</li>
                                <li><strong>Советы без запроса:</strong> «Тебе нужно...», «Просто сделай...» — лишает человека контроля.</li>
                                <li><strong>Давление на откровенность:</strong> «Расскажи подробнее» — может ретравматизировать.</li>
                            </ul>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>Психологические исследования травмы</strong></p>
                                <p>Исследования показывают, что неподдерживающие реакции (обесценивание, советы, токсичная позитивность) могут усилить симптомы ПТСР и замедлить восстановление.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Составьте список фраз, которых стоит избегать</h4>
                                <p>Перечислите 4 фразы, которые представляют токсичную позитивность или обесценивание чувств человека, пережившего травму.</p>
                                <textarea id="answer2_2" placeholder="Напишите фразы здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('2.2')">Проверить задание</button>
                                <div id="feedback2_2" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const bannedPhrases = ["все будет хорошо", "не переживай", "другим хуже", "возьми себя в руки", "пора двигаться", "забудь", "не думай об этом", "смотри на позитив"];
                                
                                let foundCount = 0;
                                bannedPhrases.forEach(phrase => {
                                    if (answer.toLowerCase().includes(phrase)) foundCount++;
                                });
                                
                                if (foundCount >= 3) {
                                    return {correct: true, message: "Верно! Вы правильно определили токсичные фразы, которые обесценивают переживания."};
                                } else if (foundCount >= 1) {
                                    return {correct: true, message: "Хорошо, но попробуйте найти больше фраз. Ищите выражения, которые призывают 'быть сильным' или 'не думать о плохом'."};
                                } else {
                                    return {correct: false, message: "Попробуйте включить фразы типа 'Все будет хорошо', 'Другим хуже', 'Пора двигаться дальше' — они представляют токсичную позитивность."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "2.3",
                    title: "Безопасное пространство",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Создание безопасного пространства — основа помощи пережившему травму:</p>
                            <ul>
                                <li><strong>Безопасность:</strong> Физическая и эмоциональная защищенность.</li>
                                <li><strong>Доверие:</strong> Последовательность, надежность, конфиденциальность.</li>
                                <li><strong>Отсутствие давления:</strong> Не заставлять говорить или действовать.</li>
                                <li><strong>Валидация чувств:</strong> Признание права человека на любые эмоции.</li>
                                <li><strong>Контроль у человека:</strong> Он решает, что, когда и как делать.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Безопасность — не отсутствие угрозы, а присутствие связи»</div>
                            <p class="author">— Брюс Перри</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Придумайте диалог с поддержкой без давления</h4>
                                <p>Ситуация: ваш друг пережил серьезную аварию месяц назад, до сих пор боится садиться в машину.</p>
                                <p>Напишите диалог, где вы поддерживаете друга, но не навязываете помощь и не давите.</p>
                                <textarea id="answer2_3" placeholder="Напишите диалог здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('2.3')">Проверить задание</button>
                                <div id="feedback2_3" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const openPhrases = ["хочешь поговорить", "как ты себя чувствуешь", "что тебе нужно", "чем я могу помочь", "хочешь ли ты", "если захочешь", "когда будешь готов"];
                                const pressurePhrases = ["ты должен", "тебе нужно", "я сделаю за тебя", "просто сядь в машину", "преодолей страх"];
                                
                                let openCount = 0;
                                let pressureCount = 0;
                                
                                openPhrases.forEach(phrase => {
                                    if (answer.toLowerCase().includes(phrase)) openCount++;
                                });
                                
                                pressurePhrases.forEach(phrase => {
                                    if (answer.toLowerCase().includes(phrase)) pressureCount++;
                                });
                                
                                if (openCount >= 2 && pressureCount === 0) {
                                    return {correct: true, message: "Идеально! Вы создали безопасное пространство с открытыми вопросами и без давления."};
                                } else if (openCount >= 1) {
                                    return {correct: true, message: "Хорошо, но попробуйте добавить больше открытых предложений ('хочешь...', 'если захочешь...')."};
                                } else {
                                    return {correct: false, message: "В диалоге чувствуется давление. Используйте больше открытых вопросов и предложений, дающих выбор."};
                                }
                            }
                        }
                    }
                }
            ],
            test: {
                title: "Контрольная работа 2",
                description: "Тест по общению с людьми, пережившими травму",
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
                        correct: 1
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
                        correct: 2
                    }
                ],
                practical: {
                    task: "Перед вами человек, переживший потерю близкого полгода назад. Он говорит: «До сих пор не могу поверить, что его нет. Иногда ловлю себя на мысли, что вот-вот позвоню ему». Напишите ответ, который создает безопасное пространство.",
                    check: function(answer) {
                        const safeKeywords = ["понимаю", "естественно", "нормально", "в своем темпе", "когда будешь готов", "хочешь поговорить"];
                        const unsafeKeywords = ["пора двигаться", "нужно забыть", "все будет хорошо", "не думай об этом"];
                        
                        let safeCount = 0;
                        let unsafeCount = 0;
                        
                        safeKeywords.forEach(word => {
                            if (answer.toLowerCase().includes(word)) safeCount++;
                        });
                        
                        unsafeKeywords.forEach(word => {
                            if (answer.toLowerCase().includes(word)) unsafeCount++;
                        });
                        
                        return safeCount >= 2 && unsafeCount === 0;
                    }
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
                    title: "Техника отражения",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Техника отражения (рефлексивное слушание) — это повторение ключевых слов и смыслов говорящего, чтобы показать, что вы действительно слышите.</p>
                            <ul>
                                <li><strong>Повторение ключевых слов:</strong> «Ты говоришь, что чувствуешь [слово из речи собеседника]»</li>
                                <li><strong>Перефразирование:</strong> «Если я правильно понял, ты ощущаешь...»</li>
                                <li><strong>Отражение эмоций:</strong> «Похоже, это вызывает у тебя [эмоция]»</li>
                                <li><strong>Важно:</strong> Не добавлять свои интерпретации, не давать советов, не перебивать.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Самое главное в общении — слышать то, что не сказано»</div>
                            <p class="author">— Питер Друкер</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Примените технику отражения</h4>
                                <p>Жалоба: «Меня постоянно критикует начальник. Даже когда я делаю все правильно, он находит к чему придраться. Я уже не знаю, как работать в таком стрессе.»</p>
                                <p>Напишите ответ, используя технику отражения.</p>
                                <textarea id="answer3_1" placeholder="Напишите ваш ответ здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('3.1')">Проверить задание</button>
                                <div id="feedback3_1" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const reflectionWords = ["критикует", "придраться", "стрессе", "начальник", "правильно"];
                                let reflectionCount = 0;
                                
                                reflectionWords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) reflectionCount++;
                                });
                                
                                if (reflectionCount >= 3 && !answer.toLowerCase().includes("советую") && !answer.toLowerCase().includes("надо бы")) {
                                    return {correct: true, message: "Отлично! Вы точно отразили ключевые слова и чувства собеседника без советов."};
                                } else if (reflectionCount >= 2) {
                                    return {correct: true, message: "Хорошо, но попробуйте отразить больше ключевых слов из жалобы."};
                                } else {
                                    return {correct: false, message: "Ответ не отражает жалобу. Попробуйте повторить ключевые слова: 'критикует', 'придраться', 'стресс'."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "3.2",
                    title: "Уточняющие вопросы",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Уточняющие вопросы помогают глубже понять чувства и потребности собеседника:</p>
                            <ul>
                                <li><strong>Открытые вопросы:</strong> «Что ты чувствуешь?», «Что для тебя самое сложное?», «Чего ты хочешь?»</li>
                                <li><strong>Уточняющие вопросы:</strong> «Ты имеешь в виду, что...?», «Правильно ли я понимаю, что...?»</li>
                                <li><strong>Вопросы о чувствах:</strong> «Какая эмоция сейчас самая сильная?», «Что вызывает самое болезненное чувство?»</li>
                                <li><strong>Избегайте:</strong> Закрытых вопросов («Да/Нет»), вопросов «почему» (могут звучать как обвинение).</li>
                            </ul>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>MindTools: Active Listening</strong></p>
                                <p>Активное слушание включает 5 ключевых элементов: 1) Полное внимание, 2) Отражение, 3) Уточнение, 4) Резюмирование, 5) Отсроченная реакция. Уточняющие вопросы помогают избежать недопонимания.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Составьте список открытых вопросов</h4>
                                <p>Представьте, что друг говорит: «У меня проблемы в отношениях». Составьте 3 открытых вопроса, которые помогут ему лучше понять и выразить свои чувства.</p>
                                <textarea id="answer3_2" placeholder="Напишите ваши вопросы здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('3.2')">Проверить задание</button>
                                <div id="feedback3_2" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const questionIndicators = ["что", "как", "расскажи", "опиши", "какой", "какая"];
                                let questionCount = 0;
                                
                                // Считаем количество вопросительных знаков
                                const questionMarkCount = (answer.match(/\?/g) || []).length;
                                
                                questionIndicators.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) questionCount++;
                                });
                                
                                if (questionMarkCount >= 2 && questionCount >= 2) {
                                    return {correct: true, message: "Отлично! Вы составили хорошие открытые вопросы, начинающиеся с 'что', 'как'."};
                                } else if (questionMarkCount >= 1) {
                                    return {correct: true, message: "Хорошо, но попробуйте добавить больше открытых вопросов, которые начинаются не с 'ты', а с 'что', 'как'."};
                                } else {
                                    return {correct: false, message: "Вопросы должны быть открытыми (не предполагать ответ 'да/нет'). Попробуйте начать с 'Что ты чувствуешь...', 'Как это проявляется...'."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "3.3",
                    title: "Невербальное слушание",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Невербальные сигналы составляют до 70% коммуникации при активном слушании:</p>
                            <ul>
                                <li><strong>Контакт глазами:</strong> Умеренный, не пристальный (60-70% времени).</li>
                                <li><strong>Кивки:</strong> Подтверждение, что вы следите за рассказом.</li>
                                <li><strong>Открытая поза:</strong> Руки не скрещены, наклон к собеседнику.</li>
                                <li><strong>Паузы:</strong> Дают время подумать и выразить чувства.</li>
                                <li><strong>Соответствующее выражение лица:</strong> Эмпатическое отзеркаливание эмоций.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Иногда молчание — лучший способ показать, что ты рядом»</div>
                            <p class="author">— Неизвестный автор</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Опишите невербальные сигналы активного слушания</h4>
                                <p>Представьте ситуацию: ваш друг расстроен и рассказывает о проблеме. Опишите 3-4 невербальных сигнала, которые покажут, что вы активно слушаете.</p>
                                <textarea id="answer3_3" placeholder="Напишите ваше описание здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('3.3')">Проверить задание</button>
                                <div id="feedback3_3" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const nonverbalSignals = ["кив", "взгляд", "поза", "наклон", "выражение лица", "пауза", "молчание", "открытая поза"];
                                let signalCount = 0;
                                
                                nonverbalSignals.forEach(signal => {
                                    if (answer.toLowerCase().includes(signal)) signalCount++;
                                });
                                
                                if (signalCount >= 3) {
                                    return {correct: true, message: "Отлично! Вы хорошо описали ключевые невербальные сигналы активного слушания."};
                                } else if (signalCount >= 2) {
                                    return {correct: true, message: "Хорошо, но попробуйте добавить больше конкретных сигналов: кивки, открытая поза, соответствующий взгляд."};
                                } else {
                                    return {correct: false, message: "Попробуйте описать конкретные невербальные действия: кивки головой, наклон тела к собеседнику, соответствующий взгляд."};
                                }
                            }
                        }
                    }
                }
            ],
    test: {
    title: "Контрольная работа 3",
    description: "Тест по технике активного слушания",
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
            correct: 1
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
            correct: 1
        }
    ],
    practical: {
        task: "Жалоба: «Я постоянно ссорюсь с женой из-за мелочей. Кажется, мы разучились понимать друг друга.» Напишите ответ, используя: 1) технику отражения, 2) один уточняющий вопрос.",
        check: function(answer) {
            console.log("Проверка контрольной 3:", answer);
            
            // Приводим к нижнему регистру для удобства
            const answerLower = answer.toLowerCase();
            
            // Проверяем технику отражения (должно отражать ключевые слова из жалобы)
            const reflectionWords = ["ссор", "мелоч", "разучил", "понимать"];
            let hasReflection = false;
            
            for (const word of reflectionWords) {
                if (answerLower.includes(word)) {
                    hasReflection = true;
                    break;
                }
            }
            
            // Дополнительные проверки на отражение
            if (!hasReflection) {
                // Проверяем синонимы
                const synonyms = ["конфликт", "спор", "разногласи", "непонимание"];
                for (const word of synonyms) {
                    if (answerLower.includes(word)) {
                        hasReflection = true;
                        break;
                    }
                }
            }
            
            // Проверяем наличие вопроса
            const hasQuestion = answer.includes("?");
            
            // Проверяем, что вопрос уточняющий (открытый)
            let hasGoodQuestion = false;
            if (hasQuestion) {
                const questionWords = ["что", "как", "почему", "расскажи", "опиши", "объясни"];
                for (const word of questionWords) {
                    if (answerLower.includes(word + " ") || answerLower.includes(word + "?")) {
                        hasGoodQuestion = true;
                        break;
                    }
                }
                
                // Также проверяем вопросы типа "Что для тебя..."
                if (answerLower.includes("что для") || answerLower.includes("как для")) {
                    hasGoodQuestion = true;
                }
            }
            
            console.log("Результат проверки:", {
                hasReflection,
                hasQuestion,
                hasGoodQuestion,
                answerLength: answer.length
            });
            
            // Условия прохождения:
            // 1) Есть отражение ИЛИ хороший вопрос
            // 2) Ответ не слишком короткий
            return (hasReflection && hasGoodQuestion && answer.length > 20) || 
                   (hasReflection && answer.length > 30) || 
                   (hasGoodQuestion && answer.length > 40);
        }
    }
}
        {
            id: 4,
            title: "Модуль 4. Поддержка без давления",
            description: "Помощь без спасения",
            completed: false,
            submodules: [
                {
                    id: "4.1",
                    title: "Разница между помощью и спасением",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p><strong>Помощь</strong> и <strong>спасение</strong> — принципиально разные подходы:</p>
                            <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Помощь (здоровая)</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Спасение (нездоровое)</th>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd;">Поддержка самостоятельности</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">Лишение выбора и контроля</td>
                                </tr>
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #ddd;">«Хочешь, я помогу?»</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">«Я сделаю это за тебя»</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd;">Уважение границ</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">Нарушение границ</td>
                                </tr>
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #ddd;">Верит в способности человека</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">Считает человека беспомощным</td>
                                </tr>
                            </table>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Дайте человеку удочку, а не рыбу»</div>
                            <p class="author">— Китайская пословица</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Определите, где помощь, а где спасение</h4>
                                <p>Прочитайте ситуации и определите, где проявляется здоровая помощь, а где — нездоровое спасение:</p>
                                <p>1. «Дай, я сам поговорю с твоим начальником о повышении.»</p>
                                <p>2. «Хочешь, вместе подготовимся к разговору с начальником?»</p>
                                <p>3. «Я знаю лучше, что тебе делать. Слушай меня.»</p>
                                <textarea id="answer4_1" placeholder="Напишите ваш анализ здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('4.1')">Проверить задание</button>
                                <div id="feedback4_1" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const helpKeywords = ["помощь", "выбор", "самостоятельность", "вместе", "поддержка"];
                                const rescueKeywords = ["спасение", "замен", "контроль", "сам сделаю", "должен слушать"];
                                
                                let helpCount = 0;
                                let rescueCount = 0;
                                
                                helpKeywords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) helpCount++;
                                });
                                
                                rescueKeywords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) rescueCount++;
                                });
                                
                                if (helpCount >= 2 || rescueCount >= 2) {
                                    return {correct: true, message: "Хорошо! Вы различаете помощь и спасение. Помощь дает выбор, спасение — лишает его."};
                                } else {
                                    return {correct: false, message: "Попробуйте четче разделить: помощь = поддержка самостоятельности, спасение = лишение выбора."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "4.2",
                    title: "Формулировка предложений",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Как правильно предлагать помощь:</p>
                            <ul>
                                <li><strong>Вопросительная форма:</strong> «Хочешь, я помогу с...?» вместо «Я сделаю...»</li>
                                <li><strong>Конкретные предложения:</strong> «Могу помочь с поиском терапевта» вместо «Я все улажу»</li>
                                <li><strong>Уважение отказа:</strong> «Хорошо, если передумаешь — я рядом»</li>
                                <li><strong>Совместное планирование:</strong> «Давай подумаем, какие есть варианты»</li>
                                <li><strong>Избегайте:</strong> Ультиматумов, манипуляций, чувства вины.</li>
                            </ul>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>Психология помогающего поведения</strong></p>
                                <p>Исследования показывают, что помощь, предлагаемая с уважением к автономии, более эффективна и способствует реальным изменениям, чем спасение.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Переформулируйте фразы спасения в фразы помощи</h4>
                                <p>1. «Не волнуйся, я сам поговорю с твоим начальником»</p>
                                <p>2. «Я знаю, что для тебя лучше, сделай так, как я говорю»</p>
                                <p>3. «Дай я все сделаю за тебя, ты все равно не справишься»</p>
                                <textarea id="answer4_2" placeholder="Напишите ваши варианты здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('4.2')">Проверить задание</button>
                                <div id="feedback4_2" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const helpIndicators = ["хочешь", "может быть", "предлагаю", "давай подумаем", "если хочешь", "как ты считаешь"];
                                const rescueIndicators = ["я сделаю", "ты должен", "надо", "обязательно", "лучше знаю"];
                                
                                let helpCount = 0;
                                let rescueCount = 0;
                                
                                helpIndicators.forEach(phrase => {
                                    if (answer.toLowerCase().includes(phrase)) helpCount++;
                                });
                                
                                rescueIndicators.forEach(phrase => {
                                    if (answer.toLowerCase().includes(phrase)) rescueCount++;
                                });
                                
                                if (helpCount >= 2 && rescueCount === 0) {
                                    return {correct: true, message: "Прекрасно! Вы правильно переформулировали спасение в помощь, сохраняя выбор за человеком."};
                                } else if (helpCount >= 1) {
                                    return {correct: true, message: "Хорошо, но есть еще место для улучшения. Используйте больше вопросительных форм и предложений выбора."};
                                } else {
                                    return {correct: false, message: "Ответ все еще содержит элементы спасения. Попробуйте начать с 'Хочешь...' или 'Может быть...'."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "4.3",
                    title: "Баланс между заботой и границами",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Здоровые границы в поддержке:</p>
                            <ul>
                                <li><strong>Ваши ресурсы важны:</strong> Вы не можете помочь всем всегда.</li>
                                <li><strong>«Нет» — это нормально:</strong> Отказ от помощи ≠ отказ от человека.</li>
                                <li><strong>Распределение ответственности:</strong> Вы не отвечаете за счастье другого.</li>
                                <li><strong>Своевременность:</strong> Помощь уместна, когда человек готов ее принять.</li>
                                <li><strong>Профессиональные границы:</strong> Знать, когда направить к специалисту.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Можно вытащить человека из воды, но нельзя заставить его плавать»</div>
                            <p class="author">— Неизвестный автор</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Ситуация установления границ</h4>
                                <p>Ваш друг постоянно звонит вам среди ночи в слезах, и это длится уже месяц. Вы чувствуете выгорание. Как вы установите границы, сохраняя заботу?</p>
                                <textarea id="answer4_3" placeholder="Напишите ваш вариант здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('4.3')">Проверить задание</button>
                                <div id="feedback4_3" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const boundaryIndicators = ["границ", "не могу", "до", "после", "время", "ресурс", "устал", "выгора"];
                                const careIndicators = ["забочусь", "помочь", "поддержать", "предлагаю", "альтернатив", "специалист"];
                                
                                let boundaryCount = 0;
                                let careCount = 0;
                                
                                boundaryIndicators.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) boundaryCount++;
                                });
                                
                                careIndicators.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) careCount++;
                                });
                                
                                if (boundaryCount >= 2 && careCount >= 1) {
                                    return {correct: true, message: "Отлично! Вы установили границы, не теряя заботы о друге."};
                                } else if (boundaryCount >= 1) {
                                    return {correct: true, message: "Хорошо, но попробуйте сочетать установление границ с предложением альтернативной помощи."};
                                } else {
                                    return {correct: false, message: "Попробуйте четко обозначить свои границы (время, ресурсы), но предложить альтернативную поддержку."};
                                }
                            }
                        }
                    }
                }
            ],
            test: {
                title: "Контрольная работа 4",
                description: "Тест по поддержке без давления",
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
                        correct: 1
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
                        correct: 1
                    }
                ],
                practical: {
                    task: "Ваш друг в депрессии уже месяц не может убраться в квартире. Напишите диалог, где вы предлагаете помощь, но не берете на себя ответственность за его жизнь.",
                    check: function(answer) {
                        const hasOffer = answer.toLowerCase().includes("помочь") || 
                                       answer.toLowerCase().includes("предлагаю") ||
                                       answer.toLowerCase().includes("хочешь");
                        
                        const hasChoice = answer.includes("?") || 
                                        answer.toLowerCase().includes("если хочешь") ||
                                        answer.toLowerCase().includes("как ты думаешь");
                        
                        const noRescue = !answer.toLowerCase().includes("я сделаю за тебя") &&
                                       !answer.toLowerCase().includes("обязательно") &&
                                       !answer.toLowerCase().includes("должен");
                        
                        return hasOffer && hasChoice && noRescue;
                    }
                }
            }
        },
        {
            id: 5,
            title: "Модуль 5. Самоподдержка и границы",
            description: "Забота о себе и установление границ",
            completed: false,
            submodules: [
                {
                    id: "5.1",
                    title: "Эмоциональное выгорание",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Эмоциональное выгорание у помогающих специалистов и эмпатов:</p>
                            <ul>
                                <li><strong>Три компонента:</strong> 1) Эмоциональное истощение, 2) Деперсонализация (цинизм), 3) Снижение профессиональной эффективности.</li>
                                <li><strong>Ранние признаки:</strong> Хроническая усталость, раздражительность, проблемы со сном, частые болезни.</li>
                                <li><strong>Факторы риска:</strong> Отсутствие границ, перфекционизм, неумение говорить «нет», недостаток поддержки.</li>
                                <li><strong>Профилактика:</strong> Регулярный отдых, хобби, супервизия, реалистичные ожидания.</li>
                            </ul>`
                        },
                        source: {
                            title: "Источник",
                            content: `<div class="source">
                                <p><strong>WHO Burnout Definition</strong></p>
                                <p>Всемирная организация здравоохранения признала выгорание профессиональным феноменом (2019). Это синдром, возникающий в результате хронического стресса на рабочем месте, который не был успешно преодолен.</p>
                            </div>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Определите признаки выгорания</h4>
                                <p>Опишите 3 ранних признака эмоционального выгорания у помогающего специалиста. Как можно заметить их у себя?</p>
                                <textarea id="answer5_1" placeholder="Напишите ваши наблюдения здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('5.1')">Проверить задание</button>
                                <div id="feedback5_1" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const burnoutSigns = ["усталость", "раздражительность", "сон", "болезнь", "цинизм", "эффективность", "истощение"];
                                let signCount = 0;
                                
                                burnoutSigns.forEach(sign => {
                                    if (answer.toLowerCase().includes(sign)) signCount++;
                                });
                                
                                if (signCount >= 3) {
                                    return {correct: true, message: "Отлично! Вы хорошо определили ключевые признаки выгорания."};
                                } else if (signCount >= 2) {
                                    return {correct: true, message: "Хорошо, но попробуйте добавить больше признаков: хроническая усталость, проблемы со сном, цинизм."};
                                } else {
                                    return {correct: false, message: "Попробуйте описать конкретные признаки: постоянная усталость, раздражительность, снижение эффективности работы."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "5.2",
                    title: "Методы восстановления",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Эффективные методы восстановления для помогающих:</p>
                            <ul>
                                <li><strong>Физические:</strong> Сон 7-9 часов, регулярные прогулки, спорт, массаж.</li>
                                <li><strong>Эмоциональные:</strong> Ведение дневника, творчество, терапия, группы поддержки.</li>
                                <li><strong>Ментальные:</strong> Медитация, чтение не по работе, цифровой детокс.</li>
                                <li><strong>Социальные:</strong> Общение с непрофессиональным кругом, хобби, волонтерство в другой сфере.</li>
                                <li><strong>Профессиональные:</strong> Супервизия, повышение квалификации, расстановка приоритетов.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Нельзя выливать из пустой чашки»</div>
                            <p class="author">— Элеонора Рузвельт</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Составьте свой план восстановления</h4>
                                <p>Составьте список из 5-7 конкретных действий, которые вы будете делать для профилактики выгорания. Укажите регулярность (ежедневно, еженедельно, при необходимости).</p>
                                <textarea id="answer5_2" placeholder="Напишите ваш план здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('5.2')">Проверить задание</button>
                                <div id="feedback5_2" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const recoveryMethods = ["сон", "прогулка", "спорт", "медитация", "дневник", "хобби", "отдых", "общение", "терапия", "массаж"];
                                let methodCount = 0;
                                
                                recoveryMethods.forEach(method => {
                                    if (answer.toLowerCase().includes(method)) methodCount++;
                                });
                                
                                if (methodCount >= 3 && answer.length > 50) {
                                    return {correct: true, message: "Отличный план! Вы включили разнообразные методы восстановления."};
                                } else if (methodCount >= 1) {
                                    return {correct: true, message: "Хорошее начало. Попробуйте добавить больше конкретных действий с указанием регулярности."};
                                } else {
                                    return {correct: false, message: "План слишком общий. Попробуйте указать конкретные действия: 'ежедневная 20-минутная прогулка', '8 часов сна' и т.д."};
                                }
                            }
                        }
                    }
                },
                {
                    id: "5.3",
                    title: "Личные границы",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<p>Установление и защита личных границ:</p>
                            <ul>
                                <li><strong>Виды границ:</strong> Физические, эмоциональные, временные, интеллектуальные, материальные.</li>
                                <li><strong>Как устанавливать:</strong> Четко, спокойно, без оправданий. «Мне некомфортно обсуждать это».</li>
                                <li><strong>Как защищать:</strong> Повторять, не поддаваться на манипуляции, уходить при нарушении.</li>
                                <li><strong>Чувство вины:</strong> Нормально при установлении границ, но не повод от них отказываться.</li>
                                <li><strong>Границы ≠ жестокость:</strong> Это забота о себе и отношениях.</li>
                            </ul>`
                        },
                        quote: {
                            title: "Цитата",
                            content: `<div class="quote">«Нет — это тоже забота о себе»</div>
                            <p class="author">— Неизвестный автор</p>`
                        },
                        assignment: {
                            title: "Задание",
                            content: `<div class="assignment">
                                <h4>Практика установления границ</h4>
                                <p>Ситуация: коллега постоянно сбрасывает на вас свою работу, ссылаясь на вашу «доброту». Вы на грани выгорания. Напишите, как вы установите границу.</p>
                                <textarea id="answer5_3" placeholder="Напишите ваш ответ здесь..."></textarea>
                                <button class="btn-primary" onclick="checkAssignment('5.3')">Проверить задание</button>
                                <div id="feedback5_3" class="feedback"></div>
                            </div>`,
                            check: function(answer) {
                                const boundaryWords = ["не могу", "границ", "откажусь", "нет", "извини", "но", "ресурс", "выгора"];
                                let boundaryCount = 0;
                                
                                boundaryWords.forEach(word => {
                                    if (answer.toLowerCase().includes(word)) boundaryCount++;
                                });
                                
                                if (boundaryCount >= 3 && !answer.toLowerCase().includes("я должен")) {
                                    return {correct: true, message: "Отлично! Вы четко установили границы, заботясь о своих ресурсах."};
                                } else if (boundaryCount >= 2) {
                                    return {correct: true, message: "Хорошо, но можно сделать формулировку более уверенной. Используйте 'я не могу' вместо 'мне неудобно'."};
                                } else {
                                    return {correct: false, message: "Попробуйте четче обозначить свою позицию: 'Я не могу взять эту работу, потому что...', 'Мои ресурсы ограничены'."};
                                }
                            }
                        }
                    }
                }
            ],
            test: {
                title: "Контрольная работа 5",
                description: "Тест по самоподдержке и границам",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Какой из перечисленных признаков НЕ относится к эмоциональному выгоранию?",
                        options: [
                            "Энтузиазм и повышенная работоспособность",
                            "Хроническая усталость",
                            "Циничное отношение к тем, кому помогаешь",
                            "Частые простудные заболевания"
                        ],
                        correct: 0
                    },
                    {
                        type: "multiple-choice",
                        question: "Почему важно уметь говорить «нет»?",
                        options: [
                            "Чтобы показать свою власть",
                            "Чтобы защитить свои ресурсы и избежать выгорания",
                            "Чтобы обидеть других людей",
                            "Чтобы меньше работать"
                        ],
                        correct: 1
                    }
                ],
                practical: {
                    task: "Коллега постоянно сбрасывает на вас свою работу, ссылаясь на вашу «доброту и отзывчивость». Вы чувствуете, что на грани выгорания. Напишите, как вы установите границу в этой ситуации.",
                    check: function(answer) {
                        const hasBoundary = answer.toLowerCase().includes("не могу") ||
                                          answer.toLowerCase().includes("границ") ||
                                          answer.toLowerCase().includes("откажусь") ||
                                          answer.toLowerCase().includes("нет");
                        
                        const isAssertive = !answer.toLowerCase().includes("извини") ||
                                           (answer.toLowerCase().includes("извини") && answer.toLowerCase().includes("но"));
                        
                        const hasSelfCare = answer.toLowerCase().includes("ресурс") ||
                                          answer.toLowerCase().includes("выгора") ||
                                          answer.toLowerCase().includes("устал");
                        
                        return hasBoundary && isAssertive && hasSelfCare;
                    }
                }
            }
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
// let userProgress = {
//    currentModule: 1,
//    currentSubmodule: "1.1",
//    completedModules: [],
//    completedSubmodules: [],
//    testResults: {},
//    assignmentResults: {}
//};
