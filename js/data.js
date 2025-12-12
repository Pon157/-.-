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
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block"
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/QNwvfBPt/6d8b84cbd3fe11f0adb37e72a190c2a8-(2).jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/4yzjyMhQ/6d8b84cbd3fe11f0adb37e72a190c2a8.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p>                     </p>
                                <p><strong>Расширенная теория:</strong> Эмпатия часто путается с сочувствием (симпатией) или жалостью, но это фундаментально разные процессы.</p>
                                <ul>
                                    <li><strong>Жалость:</strong> Позиция «сверху вниз». Вы смотрите на человека в беде и думаете: «Бедняжка, хорошо, что это не со мной». Это дистанцирует.</li>
                                    <li><strong>Сочувствие (Sympathy):</strong> Это понимание того, что кому-то плохо, но без эмоционального вовлечения. Вы «чувствуете за» кого-то.</li>
                                    <li><strong>Эмпатия (Empathy):</strong> Это способность «чувствовать вместе». Это позиция равного. Вы мысленно встаете на место человека, используя свой эмоциональный опыт, чтобы понять его боль. Эмпатия требует уязвимости, так как вы должны затронуть что-то внутри себя, что знает это чувство.</li>
                                </ul>
                                <p><strong>Ключевой механизм:</strong> Эмпатия не требует от вас исправить ситуацию. Она требует быть рядом в этой ситуации.</p>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Какое утверждение описывает жалость, а не эмпатию?<br>
                                    2. Нужно ли обязательно пережить точно такую же ситуацию, чтобы проявить эмпатию? (Ответ: Нет, нужно найти схожую эмоцию).<br>
                                    3. Почему фраза «Хотя бы ты не заболел...» является блокиратором эмпатии?</p>
                                </div>
                                <p><strong>Ключевое отличие от сочувствия:</strong></p>
                                <ul>
                                    <li><strong>Сочувствие (жалость)</strong> — это чувство сожаления о несчастье другого, часто с позиции сверху вниз («мне жаль тебя»).</li>
                                    <li><strong>Эмпатия (сопереживание)</strong> — это способность поставить себя на место другого и понять его переживания «изнутри» («я понимаю, что ты чувствуешь»).</li>
                                </ul>
                            </div>`
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
                    title: "Виды эмпатии: Как работает наш мозг",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
    <picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/0jyJy6jM/ac06b750d3ff11f08fd6b2f688e16018-(3).jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/hGsw7wMv/ac06b750d3ff11f08fd6b2f688e16018-(1).jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>

                                <p><strong>Расширенная теория:</strong> Психологи выделяют три уровня эмпатии, которые задействуют разные участки мозга:</p>
                                <ul>
                                    <li><strong>Когнитивная эмпатия («Я понимаю»):</strong> Вы интеллектуально понимаете точку зрения другого человека. Это навык переговорщиков. Риск: Можно понять, как манипулировать человеком, не сопереживая ему.</li>
                                    <li><strong>Эмоциональная эмпатия («Я чувствую»):</strong> Вы физически ощущаете эмоции другого (спасибо зеркальным нейронам). Если друг плачет, у вас тоже ком в горле. Риск: Если не иметь границ, это ведет к быстрому выгоранию.</li>
                                    <li><strong>Сострадательная эмпатия (Эмпатическая забота):</strong> Баланс. Вы понимаете и чувствуете, но не тонете в чужих эмоциях, а испытываете импульс помочь. Это конструктивная форма поддержки.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Если вы расплакались, увидев плачущего человека, какой вид эмпатии сработал?<br>
                                    2. Какой вид эмпатии наиболее важен для врача или психолога, чтобы не выгореть?<br>
                                    3. В чем опасность только когнитивной эмпатии?</p>
                                </div>
                            </div>`
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
                    title: "Эмпатия в невербалике",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/BvrZj5Wd/1ab6a8a8-cfbf-48b5-b695-95beab50.jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/SxVzYvD4/1ab6a8a8-cfbf-48b5-b695-95beab503c1e.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> По данным исследований (Мейерабиан и др.), слова передают лишь около 7% информации об эмоциях. Эмпатия считывается через:</p>
                                <ul>
                                    <li><strong>Проксемику:</strong> Дистанция. Наклон корпуса в сторону собеседника (сигнал интереса) против откинутой назад позы (сигнал оценки/отстраненности).</li>
                                    <li><strong>Паралингвистику:</strong> Тон, темп, громкость. Эмпатичный голос часто ниже, медленнее и теплее.</li>
                                    <li><strong>Конгруэнтность:</strong> Соответствие ваших слов вашему лицу. Если вы говорите «Я тебе сочувствую» с каменным лицом или улыбкой, собеседник считает это как ложь или сарказм.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Что такое конгруэнтность в общении?<br>
                                    2. Как поза тела может противоречить эмпатичным словам?<br>
                                    3. Почему быстрый темп речи может помешать человеку почувствовать поддержку?</p>
                                </div>
                                <p>Эмпатия в общении проявляется не только через слова, но и через невербальные сигналы:</p>
                                <ul>
                                    <li><strong>Тон голоса</strong> — спокойный, теплый, соответствующий настроению собеседника.</li>
                                    <li><strong>Выражение лица</strong> — отзеркаливание эмоций (без преувеличения).</li>
                                    <li><strong>Язык тела</strong> — открытая поза, наклон к собеседнику, кивки.</li>
                                    <li><strong>Паузы и молчание</strong> — предоставление времени для выражения чувств.</li>
                                </ul>
                            </div>`
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
                    title: "Анатомия травмы",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/jqc1Sz7b/09f76f0d-eef4-41ff-9e59-80ac6197a099.jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/PrBQXx2s/09f76f0d-eef4-41ff-9e59-80ac6197.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Травма — это не само ужасное событие, а реакция нашей нервной системы на него.</p>
                                <ul>
                                    <li><strong>Механизм:</strong> Когда ресурсов психики не хватает, чтобы переварить шок, опыт «застревает». Человек может жить в прошлом, реагируя на триггеры здесь и сейчас так, будто опасность все еще рядом.</li>
                                    <li><strong>Влияние на общение:</strong> Человек в травме может быть гиперчувствительным, замкнутым или агрессивным. Это не «плохой характер», это работа миндалевидного тела (центра страха) в мозге.</li>
                                    <li><strong>Задача собеседника:</strong> Не быть терапевтом, а быть «стабильным объектом». Ваше спокойствие помогает их нервной системе успокоиться (ко-регуляция).</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Верно ли, что травма — это всегда физическое увечье?<br>
                                    2. Что означает термин «ко-регуляция»?<br>
                                    3. Почему человек с травмой может реагировать агрессией на, казалось бы, простые слова?</p>
                                </div>
                                <p><strong>Основное определение:</strong> Травма — это не просто событие, а его психологический след, который остается в человеке надолго.</p>
                                <ul>
                                    <li><strong>Травма ≠ событие:</strong> Два человека могут пережить одно и то же событие, но только у одного разовьется травма.</li>
                                    <li><strong>Субъективное переживание:</strong> Важна не объективная тяжесть события, а то, как человек его воспринял.</li>
                                    <li><strong>Долгосрочные последствия:</strong> Травма влияет на восприятие мира, отношения с другими и самооценку.</li>
                                </ul>
                            </div>`
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
                    title: "Токсичная позитивность и обесценивание",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/tRDVvgLW/production-images-aa115eb7-6edf.png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/tJry3wv2/production-images-aa115eb7-6edf-4e9b-88c5-557eac318796.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Самые благие намерения часто наносят вред.</p>
                                <ul>
                                    <li><strong>Токсичная позитивность:</strong> Это навязывание счастья и отрицание негатива. Фразы типа «Всё будет хорошо», «Улыбнись», «Ищи плюсы» говорят человеку: «Твои текущие чувства неправильные, скрой их». Это вызывает стыд и изоляцию.</li>
                                    <li><strong>Обесценивание:</strong> Попытка уменьшить проблему, чтобы она казалась решаемой. «Да ерунда», «У других хуже». Это сигнал: «Твоя боль не важна».</li>
                                    <li><strong>Сравнительное страдание:</strong> Вера в то, что если кто-то голодает в Африке, вы не имеете права грустить из-за увольнения. Эмпатия не конечный ресурс, она не заканчивается от того, что вы посочувствовали обоим.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Преобразуйте фразу «Не грусти, всё наладится» в эмпатичное высказывание.<br>
                                    2. Почему сравнение «А вот у Кати ситуация еще хуже» не помогает?<br>
                                    3. В чем главная опасность токсичной позитивности?</p>
                                </div>
                                <p><strong>Наиболее частые и вредные ошибки при общении с пережившими травму:</strong></p>
                                <ul>
                                    <li><strong>Токсичная позитивность:</strong> «Все будет хорошо», «Смотри на позитив» — обесценивает реальные страдания.</li>
                                    <li><strong>Обесценивание:</strong> «Другим еще хуже», «Это не так страшно» — отрицает право человека на свои чувства.</li>
                                    <li><strong>Советы без запроса:</strong> «Тебе нужно...», «Просто сделай...» — лишает человека контроля.</li>
                                    <li><strong>Давление на откровенность:</strong> «Расскажи подробнее» — может ретравматизировать.</li>
                                </ul>
                            </div>`
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
                    title: "Создание безопасного пространства",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/h4xKhZ00/production-images-936ef6e8-aa91.png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/XYWqV6Sg/production-images-936ef6e8-aa91-4742-ba60-1015cc7c97cf.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Безопасное пространство (Holding space) — это готовность быть с человеком, не осуждая его, не пытаясь его исправить и не влияя на исход ситуации.</p>
                                <ul>
                                    <li><strong>Отсутствие оценки:</strong> Мы убираем внутреннего критика. Если человек говорит «Я ненавижу свою мать», мы не говорим «Так нельзя», мы принимаем это как факт его чувств сейчас.</li>
                                    <li><strong>Конфиденциальность:</strong> Ощущение, что сказанное останется здесь.</li>
                                    <li><strong>Предсказуемость:</strong> Вы не вскакиваете, не перебиваете, ваши реакции стабильны.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Что значит «быть контейнером» для чужих эмоций?<br>
                                    2. Как оценочные суждения разрушают безопасность?<br>
                                    3. Выберите действие, создающее безопасность: дать совет или просто сидеть рядом?</p>
                                </div>
                                <p><strong>Основные принципы создания безопасного пространства — основа помощи пережившему травму:</strong></p>
                                <ul>
                                    <li><strong>Безопасность:</strong> Физическая и эмоциональная защищенность.</li>
                                    <li><strong>Доверие:</strong> Последовательность, надежность, конфиденциальность.</li>
                                    <li><strong>Отсутствие давления:</strong> Не заставлять говорить или действовать.</li>
                                    <li><strong>Валидация чувств:</strong> Признание права человека на любые эмоции.</li>
                                    <li><strong>Контроль у человека:</strong> Он решает, что, когда и как делать.</li>
                                </ul>
                            </div>`
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
                    title: "Техника отражения и перефразирования",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/T2zbGLLn/production-images-2476882b-49bb-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/zBdy93mw/production-images-2476882b-49bb.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>

                                <p><strong>Расширенная теория:</strong> Отражение — это возвращение собеседнику сути его слов, чтобы он услышал себя со стороны и понял, что вы его поняли.</p>
                                <ul>
                                    <li><strong>Эхо-техника:</strong> Повторение последних слов (с вопросительной интонацией).<br><em>Клиент: «Я так устал от этой неопределенности».<br>Вы: «От неопределенности?..»</em></li>
                                    <li><strong>Парафраз смысла:</strong> «Правильно ли я слышу, что ты чувствуешь... потому что...».</li>
                                    <li><strong>Валидация:</strong> Подтверждение нормальности чувств. «Это совершенно естественно — злиться в такой ситуации».</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. В чем разница между «попугайничаньем» и качественным парафразом?<br>
                                    2. Зачем нужно уточнять «Правильно ли я понял»?<br>
                                    3. Какой эффект дает валидация эмоций собеседника?</p>
                                </div>
                                <p><strong>Основное определение:</strong> Техника отражения (рефлексивное слушание) — это повторение ключевых слов и смыслов говорящего, чтобы показать, что вы действительно слышите.</p>
                                <ul>
                                    <li><strong>Повторение ключевых слов:</strong> «Ты говоришь, что чувствуешь [слово из речи собеседника]»</li>
                                    <li><strong>Перефразирование:</strong> «Если я правильно понял, ты ощущаешь...»</li>
                                    <li><strong>Отражение эмоций:</strong> «Похоже, это вызывает у тебя [эмоция]»</li>
                                    <li><strong>Важно:</strong> Не добавлять свои интерпретации, не давать советов, не перебивать.</li>
                                </ul>
                            </div>`
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
                    title: "Уточняющие вопросы (Искусство задавания вопросов)",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/nznd3SZr/production-images-4326d45d-4c80-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/yxVwSYWt/production-images-4326d45d-4c80.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong></p>
                                <ul>
                                    <li><strong>Открытые вопросы:</strong> Начинаются с «Что», «Как», «Каким образом». Они приглашают к рассказу.</li>
                                    <li><strong>Закрытые вопросы:</strong> Требуют ответа «Да/Нет». Полезны для уточнения фактов, но убивают диалог о чувствах.</li>
                                    <li><strong>Опасное «Почему»:</strong> Вопрос «Почему ты это сделал?» часто звучит как обвинение. Лучше заменить на «Что побудило тебя?..» или «Как так вышло, что?..».</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Переделайте вопрос «Ты расстроился?» в открытый вопрос.<br>
                                    2. Почему стоит избегать вопроса «Почему?» в эмоциональных беседах?<br>
                                    3. Приведите пример вопроса, который помогает человеку раскрыться.</p>
                                </div>
                                <p><strong>Основные принципы:</strong> Уточняющие вопросы помогают глубже понять чувства и потребности собеседника:</p>
                                <ul>
                                    <li><strong>Открытые вопросы:</strong> «Что ты чувствуешь?», «Что для тебя самое сложное?», «Чего ты хочешь?»</li>
                                    <li><strong>Уточняющие вопросы:</strong> «Ты имеешь в виду, что...?», «Правильно ли я понимаю, что...?»</li>
                                    <li><strong>Вопросы о чувствах:</strong> «Какая эмоция сейчас самая сильная?», «Что вызывает самое болезненное чувство?»</li>
                                    <li><strong>Избегайте:</strong> Закрытых вопросов («Да/Нет»), вопросов «почему» (могут звучать как обвинение).</li>
                                </ul>
                            </div>`
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
                    title: "Невербальное слушание и паузы",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/Hsm0GZhM/production-images-3dd3d439-2006-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/Kc6q1DsD/production-images-3dd3d439-2006.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong></p>
                                <ul>
                                    <li><strong>Сила паузы:</strong> В паузах происходит осознание. Если человек замолчал, не спешите заполнять эфир. Дайте ему 3–5 секунд. Часто после паузы следует самое важное признание.</li>
                                    <li><strong>Активное молчание:</strong> Это не проверка телефона. Это взгляд в глаза, кивки, звуки подтверждения («угу», «ммм»). Вы всем видом показываете: «Я здесь, продолжай».</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Сколько секунд рекомендуется выждать, прежде чем отвечать?<br>
                                    2. Как собеседник понимает, что вы его слушаете, если вы молчите?<br>
                                    3. Что делать, если пауза затянулась и стала неловкой?</p>
                                </div>
                                <p><strong>Основные принципы:</strong> Невербальные сигналы составляют до 70% коммуникации при активном слушании:</p>
                                <ul>
                                    <li><strong>Контакт глазами:</strong> Умеренный, не пристальный (60-70% времени).</li>
                                    <li><strong>Кивки:</strong> Подтверждение, что вы следите за рассказом.</li>
                                    <li><strong>Открытая поза:</strong> Руки не скрещены, наклон к собеседнику.</li>
                                    <li><strong>Паузы:</strong> Дают время подумать и выразить чувства.</li>
                                    <li><strong>Соответствующее выражение лица:</strong> Эмпатическое отзеркаливание эмоций.</li>
                                </ul>
                            </div>`
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
                        const answerLower = answer.toLowerCase();
                        
                        // Проверяем отражение
                        const hasReflection = answerLower.includes("ссор") || 
                                            answerLower.includes("мелоч") || 
                                            answerLower.includes("разучил") || 
                                            answerLower.includes("понимать") ||
                                            answerLower.includes("конфликт") ||
                                            answerLower.includes("непонимание");
                        
                        // Проверяем вопрос
                        const hasQuestion = answer.includes("?");
                        const hasGoodQuestion = hasQuestion && (
                            answerLower.includes("что") || 
                            answerLower.includes("как") || 
                            answerLower.includes("почему") ||
                            answerLower.includes("расскажи") ||
                            answerLower.includes("опиши")
                        );
                        
                        // Проверяем длину
                        const hasLength = answer.length > 25;
                        
                        return (hasReflection && hasGoodQuestion && hasLength) ||
                               (hasReflection && answer.length > 40) ||
                               (hasGoodQuestion && answer.length > 50);
                    }
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
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/7Y4xw4N1/production-images-72872d40-f7f3-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/8z1PBGJL/production-images-72872d40-f7f3.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong></p>
                                <ul>
                                    <li><strong>Помощь (Партнерство):</strong> Вы даете удочку. Вы верите, что у человека есть силы справиться, вы лишь ассистируете. Ответственность остается на человеке.</li>
                                    <li><strong>Спасательство (Треугольник Карпмана):</strong> Вы делаете за человека, даже когда он не просил. Вы считаете его беспомощным. Это тешит ваше эго («Я герой»), но делает другого зависимым. В итоге Спасатель часто становится Жертвой («Я для них всё, а они неблагодарные») или Преследователем.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. В чем ключевое отличие спасателя от помощника?<br>
                                    2. К чему в итоге приводит непрошеное спасательство?<br>
                                    3. Как понять, что вы попали в роль Спасателя? (Маркер: вы работаете больше, чем сам клиент).</p>
                                </div>
                                <p><strong>Разница между помощью и спасением — принципиально разные подходы:</strong></p>
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
                                    <tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Дает инструменты и знания для решения проблемы</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Решает проблему самостоятельно, оставляя другого в неведении</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">«Давай подумаем вместе, как ты можешь это исправить»</td>
    <td style="padding: 10px; border: 1px solid #ddd;">«Не волнуйся, я уже всё уладил»</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Создает условия для роста и обучения</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Создает зависимость и привычку полагаться на других</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">«Я рядом, если будут сложности»</td>
    <td style="padding: 10px; border: 1px solid #ddd;">«Дай лучше я, а то ты не справишься»</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Спрашивает: «Чем именно я могу быть полезен?»</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Действует исходя из своих предположений о нуждах другого</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">Принимает отказ от помощи без обиды</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Настаивает и обижается, если помощь отвергают («Я же хотел как лучше!»)</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Помощь оказывается по запросу или с согласия</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Вмешивается непрошено, оправдываясь чрезвычайными обстоятельствами</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">Позволяет человеку прожить последствия своего выбора (там, где это безопасно)</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Постоянно защищает от любых негативных последствий</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Эмоциональная поддержка: «Я понимаю, что это сложно для тебя»</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Эмоциональное поглощение: «Я не могу спать, пока у тебя эта проблема»</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">Фокус на процессе и усилиях человека</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Фокус только на быстром результате любой ценой</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Ответственность за решение остается у того, кому помогают</td>
    <td style="padding: 10px; border: 1px solid #ddd;">«Спасатель» берет ответственность за процесс и результат на себя</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">«Каков твой план действий?»</td>
    <td style="padding: 10px; border: 1px solid #ddd;">«Вот тебе план, просто следуй ему»</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Усиливает уверенность человека в себе</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Подрывает веру человека в свои силы</td>
</tr>
<tr>
    <td style="padding: 10px; border: 1px solid #ddd;">Баланс: помогает, но не в ущерб своим нуждам и ресурсам</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Жертвенность: помогает, истощая себя</td>
</tr>
<tr style="background: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd;">Признает право другого на ошибку</td>
    <td style="padding: 10px; border: 1px solid #ddd;">Воспринимает ошибки другого как свою личную неудачу</td>
</tr>
                                </table>
                            </div>`
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
                    title: "Формулировка экологичных предложений",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/HW2N8CgP/production-images-e970a623-2c2c-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/GpyN48L6/production-images-e970a623-2c2c.png" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Экологичность общения — это уважение к субъектности (воле) другого.</p>
                                <ul>
                                    <li><strong>Вопрос-разрешение:</strong> Прежде чем поддержать или дать совет, спросите: «Тебе сейчас нужно решение или просто выговориться?».</li>
                                    <li><strong>Я-сообщения:</strong> Вместо директивного «Тебе надо поспать», используйте мягкое предложение: «Я переживаю за твое состояние, может быть, стоит отдохнуть?».</li>
                                    <li><strong>Принцип выбора:</strong> Всегда оставляйте человеку право отказаться от помощи без чувства вины.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Почему важно спрашивать, какой вид поддержки нужен?<br>
                                    2. Как предложить помощь так, чтобы человеку было легко отказаться?<br>
                                    3. Переформулируйте директиву «Иди к врачу» в экологичное предложение.</p>
                                </div>
                                <p><strong>Как правильно предлагать помощь:</strong></p>
                                <ul>
                                    <li><strong>Вопросительная форма:</strong> «Хочешь, я помогу с...?» вместо «Я сделаю...»</li>
                                    <li><strong>Конкретные предложения:</strong> «Могу помочь с поиском терапевта» вместо «Я все улажу»</li>
                                    <li><strong>Уважение отказа:</strong> «Хорошо, если передумаешь — я рядом»</li>
                                    <li><strong>Совместное планирование:</strong> «Давай подумаем, какие есть варианты»</li>
                                    <li><strong>Избегайте:</strong> Ультиматумов, манипуляций, чувства вины.</li>
                                </ul>
                            </div>`
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
                    title: "Баланс между заботой и автономией",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/25gbC5Tv/9bbfb80f-9429-4d20-896c-dbd6c199-(1).jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/43yVJqGk/9bbfb80f-9429-4d20-896c-dbd6c199.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Гиперопека — враг автономии.</p>
                                <ul>
                                    <li><strong>Зона ближайшего развития:</strong> Поддерживать нужно там, где человек почти может сам, но ему чуть-чуть трудно. Делать то, что он может сам — значит инвалидизировать его.</li>
                                    <li><strong>Уважение к «Нет»:</strong> Если человек отказывается от помощи, это проявление его силы, а не глупости. Принять отказ — высшая форма уважения.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Что такое инвалидизация через помощь?<br>
                                    2. Почему принятие отказа — это тоже форма поддержки?<br>
                                    3. Как определить границы, где помощь становится вредной?</p>
                                </div>
                                <p><strong>Здоровые границы в поддержке:</strong></p>
                                <ul>
                                    <li><strong>Ваши ресурсы важны:</strong> Вы не можете помочь всем всегда.</li>
                                    <li><strong>«Нет» — это нормально:</strong> Отказ от помощи ≠ отказ от человека.</li>
                                    <li><strong>Распределение ответственности:</strong> Вы не отвечаете за счастье другого.</li>
                                    <li><strong>Своевременность:</strong> Помощь уместна, когда человек готов ее принять.</li>
                                    <li><strong>Профессиональные границы:</strong> Знать, когда направить к специалисту.</li>
                                </ul>
                            </div>`
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
                    title: "Эмпатическое выгорание и усталость от сострадания",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/25gbC5Tv/9bbfb80f-9429-4d20-896c-dbd6c199-(1).jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/jdBGQ08g/2009f6fb-650c-403c-8953-d29cb84d.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong></p>
                                <ul>
                                    <li><strong>Усталость от сострадания (Compassion Fatigue):</strong> Состояние физического и эмоционального истощения, специфичное для тех, кто много помогает. Симптомы: цинизм, раздражительность, апатия, ночные кошмары.</li>
                                    <li><strong>Вторичная травматизация:</strong> Вы слушаете так глубоко, что травма собеседника начинает влиять на вас (вы начинаете бояться того же, чего и он).</li>
                                    <li><strong>Физиология:</strong> Постоянная активация системы заботы истощает дофамин и серотонин.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Назовите три ранних признака эмоционального выгорания.<br>
                                    2. Чем усталость от сострадания отличается от обычной усталости?<br>
                                    3. Что такое вторичная травма?</p>
                                </div>
                                <p><strong>Основное определение:</strong> Эмоциональное выгорание у помогающих специалистов и эмпатов:</p>
                                <ul>
                                    <li><strong>Три компонента:</strong> 1) Эмоциональное истощение, 2) Деперсонализация (цинизм), 3) Снижение профессиональной эффективности.</li>
                                    <li><strong>Ранние признаки:</strong> Хроническая усталость, раздражительность, проблемы со сном, частые болезни.</li>
                                    <li><strong>Факторы риска:</strong> Отсутствие границ, перфекционизм, неумение говорить «нет», недостаток поддержки.</li>
                                    <li><strong>Профилактика:</strong> Регулярный отдых, хобби, супервизия, реалистичные ожидания.</li>
                                </ul>
                            </div>`
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
                    title: "Цикл стресса и методы восстановления",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/1tH8wKsN/5-2-(1).png"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/SQf6fWDT/5-2.png"
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Стресс — это физиологический цикл. Просто «успокоиться головой» недостаточно, нужно вывести гормоны стресса из тела (теория Э. и А. Нагоски).</p>
                                <ul>
                                    <li><strong>Завершение цикла:</strong> Физическая активность, глубокое дыхание (выдох длиннее вдоха), смех, плач, творчество, объятия (20 секунд).</li>
                                    <li><strong>Информационный детокс:</strong> Мозгу нужно время «блуждания» (default mode network), чтобы переварить эмоции. Скроллинг ленты не является отдыхом.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Почему лежание на диване с телефоном не всегда восстанавливает?<br>
                                    2. Назовите 3 способа физически завершить цикл стресса.<br>
                                    3. Как дыхание влияет на парасимпатическую нервную систему?</p>
                                </div>
                                <p><strong>Эффективные методы восстановления для помогающих:</strong></p>
                                <ul>
                                    <li><strong>Физические:</strong> Сон 7-9 часов, регулярные прогулки, спорт, массаж.</li>
                                    <li><strong>Эмоциональные:</strong> Ведение дневника, творчество, терапия, группы поддержки.</li>
                                    <li><strong>Ментальные:</strong> Медитация, чтение не по работе, цифровой детокс.</li>
                                    <li><strong>Социальные:</strong> Общение с непрофессиональным кругом, хобби, волонтерство в другой сфере.</li>
                                    <li><strong>Профессиональные:</strong> Супервизия, повышение квалификации, расстановка приоритетов.</li>
                                </ul>
                            </div>`
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
                    title: "Личные границы как инструмент эмпатии",
                    tabs: {
                        theory: {
                            title: "Теория",
                            content: `<div class="theory-block">
<picture>
    <!-- Для мобильных -->
    <source 
        media="(max-width: 1000px)" 
        srcset="https://i.postimg.cc/7bvrLpd1/c5931846-f37a-4cc7-8dfa-94e66f31-(1).jpg"
    >
    <!-- Для десктопов и фолбэк -->
    <img 
        src="https://i.postimg.cc/c1zsjz9s/c5931846-f37a-4cc7-8dfa-94e66f31.jpg" 
        alt="Эмпатия и понимание"
        class="responsive-image"
    >
</picture>

<style>
    .responsive-image {
        width: 30%;
        max-width: 30%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
        display: block;
    }
    
    /* Для мобильных устройств */
    @media (max-width: 1000px) {
        .responsive-image {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
                                <p><strong>Расширенная теория:</strong> Брене Браун вывела формулу: «Самые эмпатичные люди — это люди с самыми жесткими границами».</p>
                                <ul>
                                    <li><strong>Парадокс:</strong> Нельзя быть эмпатичным 24/7. Если вы не защищаете свой ресурс, вы начинаете ненавидеть тех, кому помогаете.</li>
                                    <li><strong>Как говорить «Нет»:</strong> «Я слышу, как тебе тяжело, но прямо сейчас у меня нет ресурсу выслушать это качественно. Давай поговорим вечером?». Это честнее, чем слушать вполуха.</li>
                                </ul>
                                <div class="check-question">
                                    <h4>Вопросы для проверки:</h4>
                                    <p>1. Почему без границ невозможна долгая эмпатия?<br>
                                    2. Как корректно отказать в разговоре, если у вас нет сил?<br>
                                    3. Связаны ли границы с эгоизмом? (Ответ: Нет, это забота о сохранности отношений).</p>
                                </div>
                                <p><strong>Установление и защита личных границ:</strong></p>
                                <ul>
                                    <li><strong>Виды границ:</strong> Физические, эмоциональные, временные, интеллектуальные, материальные.</li>
                                    <li><strong>Как устанавливать:</strong> Четко, спокойно, без оправданий. «Мне некомфортно обсуждать это».</li>
                                    <li><strong>Как защищать:</strong> Повторять, не поддаваться на манипуляции, уходить при нарушении.</li>
                                    <li><strong>Чувство вины:</strong> Нормально при установлении границ, но не повод от них отказываться.</li>
                                    <li><strong>Границы ≠ жестокость:</strong> Это забота о себе и отношениях.</li>
                                </ul>
                            </div>`
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
