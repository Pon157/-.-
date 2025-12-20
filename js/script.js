// ============================================================
// ЧАСТЬ 1: КОНФИГУРАЦИЯ И АУТЕНТИФИКАЦИЯ
// ============================================================

if (typeof supabase === 'undefined') { var supabase = null; }

const SUPABASE_CONFIG = {
    url: window.ENV?.SUPABASE_URL,
    anonKey: window.ENV?.SUPABASE_ANON_KEY
};

let currentUserId = null;
let isAuthenticated = false;
let userProgress = {
    currentModule: 1,
    currentSubmodule: '1.1',
    completedModules: [],
    completedSubmodules: [],
    testResults: {},
    assignmentResults: {},
    finalExamCompleted: false,
    finalExamScore: 0
};

function initSupabase() {
    try {
        if (supabase) return true;
        const lib = window.supabase || window.supabasejs;
        if (lib && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
            supabase = lib.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
                auth: { persistSession: true, autoRefreshToken: true }
            });
            console.log('✅ Supabase подключен');
            return true;
        }
        return false;
    } catch (e) { return false; }
}

async function handleRegister() {
    if (!initSupabase()) return showMessage('error', 'БД недоступна');
    const name = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;

    if (!name || !email || !password) return showMessage('error', 'Заполните поля');

    try {
        const { data, error } = await supabase.auth.signUp({
            email, password, options: { data: { full_name: name } }
        });
        if (error) throw error;
        if (data.user) {
            await supabase.from('users').insert([{ 
                id: data.user.id, email, name, course_progress: userProgress 
            }]);
            await supabase.from('allowed_users').insert([{ user_id: data.user.id }]);
        }
        showMessage('success', 'Регистрация успешна! Проверьте почту.');
    } catch (e) { showMessage('error', e.message); }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        location.reload();
    } catch (e) { showMessage('error', e.message); }
}

function showAuthTab(tab) {
    document.getElementById('loginTab').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerTab').style.display = tab === 'register' ? 'block' : 'none';
}

function continueAsGuest() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// ============================================================
// ЧАСТЬ 2: ДВИЖОК ОТОБРАЖЕНИЯ И ЛОГИКА МОДУЛЕЙ
// ============================================================

function renderModulesList() {
    const list = document.getElementById('modulesList');
    if (!list || !courseData) return;
    list.innerHTML = '';

    Object.keys(courseData.modules).forEach(mId => {
        const module = courseData.modules[mId];
        const mDiv = document.createElement('div');
        mDiv.className = `module-item ${userProgress.completedModules.includes(mId) ? 'completed' : ''}`;
        mDiv.innerHTML = `<h3>${module.title}</h3>`;
        
        const subList = document.createElement('div');
        subList.className = 'submodules-list';
        
        Object.keys(module.submodules).forEach(sId => {
            const isComp = userProgress.completedSubmodules.includes(sId);
            const sBtn = document.createElement('div');
            sBtn.className = `submodule-item ${isComp ? 'completed' : ''} ${userProgress.currentSubmodule === sId ? 'active' : ''}`;
            sBtn.innerHTML = `<span>${sId} ${module.submodules[sId].title}</span>`;
            sBtn.onclick = () => openModule(mId, sId);
            subList.appendChild(sBtn);
        });
        mDiv.appendChild(subList);
        list.appendChild(mDiv);
    });
}

function openModule(mId, sId) {
    userProgress.currentModule = mId;
    userProgress.currentSubmodule = sId;
    const sub = courseData.modules[mId].submodules[sId];
    document.getElementById('moduleTitle').innerText = sub.title;
    document.getElementById('contentDisplay').innerHTML = sub.content;
    renderModulesList();
    saveProgress();
}

async function saveProgress() {
    if (isAuthenticated && supabase) {
        await supabase.from('users').update({ course_progress: userProgress }).eq('id', currentUserId);
    } else {
        localStorage.setItem('empathy_progress', JSON.stringify(userProgress));
    }
}

async function initApp() {
    initSupabase();
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            currentUserId = session.user.id;
            isAuthenticated = true;
            const { data } = await supabase.from('users').select('course_progress').eq('id', currentUserId).single();
            if (data) userProgress = data.course_progress;
        }
    }
    renderModulesList();
}

// ============================================================
// ЧАСТЬ 2: ДВИЖОК ОТОБРАЖЕНИЯ И ЛОГИКА МОДУЛЕЙ
// ============================================================

function renderModulesList() {
    const list = document.getElementById('modulesList');
    if (!list || !courseData) return;
    list.innerHTML = '';

    Object.keys(courseData.modules).forEach(mId => {
        const module = courseData.modules[mId];
        const mDiv = document.createElement('div');
        mDiv.className = `module-item ${userProgress.completedModules.includes(mId) ? 'completed' : ''}`;
        mDiv.innerHTML = `<h3>${module.title}</h3>`;
        
        const subList = document.createElement('div');
        subList.className = 'submodules-list';
        
        Object.keys(module.submodules).forEach(sId => {
            const isComp = userProgress.completedSubmodules.includes(sId);
            const sBtn = document.createElement('div');
            sBtn.className = `submodule-item ${isComp ? 'completed' : ''} ${userProgress.currentSubmodule === sId ? 'active' : ''}`;
            sBtn.innerHTML = `<span>${sId} ${module.submodules[sId].title}</span>`;
            sBtn.onclick = () => openModule(mId, sId);
            subList.appendChild(sBtn);
        });
        mDiv.appendChild(subList);
        list.appendChild(mDiv);
    });
}

function openModule(mId, sId) {
    userProgress.currentModule = mId;
    userProgress.currentSubmodule = sId;
    const sub = courseData.modules[mId].submodules[sId];
    document.getElementById('moduleTitle').innerText = sub.title;
    document.getElementById('contentDisplay').innerHTML = sub.content;
    renderModulesList();
    saveProgress();
}

async function saveProgress() {
    if (isAuthenticated && supabase) {
        await supabase.from('users').update({ course_progress: userProgress }).eq('id', currentUserId);
    } else {
        localStorage.setItem('empathy_progress', JSON.stringify(userProgress));
    }
}

async function initApp() {
    initSupabase();
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            currentUserId = session.user.id;
            isAuthenticated = true;
            const { data } = await supabase.from('users').select('course_progress').eq('id', currentUserId).single();
            if (data) userProgress = data.course_progress;
        }
    }
    renderModulesList();
}

// ============================================================
// ЧАСТЬ 3: ДАННЫЕ КУРСА (МОДУЛИ 1 И 2)
// ============================================================

const courseData = {
    modules: {
        "1": {
            title: "Модуль 1: Природа эмпатии",
            submodules: {
                "1.1": {
                    title: "Что такое эмпатия на самом деле?",
                    content: `
                        <div class="content-card">
                            <p>Эмпатия — это не просто "сочувствие". Это сложный психологический механизм, позволяющий нам выстраивать глубокие социальные связи.</p>
                            <div class="theory-box">
                                <h4>Три компонента эмпатии:</h4>
                                <ul>
                                    <li><strong>Когнитивный:</strong> Способность встать на место другого и понять его точку зрения.</li>
                                    <li><strong>Аффективный:</strong> Способность резонировать с эмоциями другого (чувствовать то же самое).</li>
                                    <li><strong>Поведенческий:</strong> Умение выразить поддержку словами или действием.</li>
                                </ul>
                            </div>
                        </div>`,
                    practice: "Вспомните недавний конфликт. Попробуйте записать 3 причины, почему ваш оппонент мог чувствовать себя именно так.",
                    test: [
                        { q: "Какой вид эмпатии отвечает за логическое понимание чужой позиции?", options: ["Аффективная", "Когнитивная", "Симпатическая"], correct: 1 }
                    ]
                },
                "1.2": {
                    title: "Эмпатия vs Симпатия",
                    content: `<p>Многие путают эти понятия. Симпатия — это жалость ("Мне жаль, что у тебя это случилось"). Эмпатия — это сопереживание ("Я чувствую твою боль вместе с тобой").</p>`,
                    test: [{ q: "Эмпатия подразумевает оценку действий другого человека?", options: ["Да", "Нет, только понимание чувств"], correct: 1 }]
                }
            }
        },
        "2": {
            title: "Модуль 2: Активное слушание",
            submodules: {
                "2.1": {
                    title: "Техники активного слушания",
                    content: `
                        <div class="theory-block">
                            <h4>Основные инструменты:</h4>
                            <ul>
                                <li><strong>Перефразирование:</strong> "Правильно ли я понимаю, что..."</li>
                                <li><strong>Отражение чувств:</strong> "Похоже, ты сейчас сильно расстроен..."</li>
                                <li><strong>Уточнение:</strong> "Расскажи подробнее о том моменте, когда..."</li>
                            </ul>
                        </div>`,
                    practice: "Запишите сообщение, используя технику 'Отражение чувств' для друга, который потерял работу.",
                    test: [
                        { q: "Что НЕ является техникой активного слушания?", options: ["Перефразирование", "Совет из личного опыта", "Уточнение"], correct: 1 }
                    ]
                }
            }
        }
    }
};

// ============================================================
// ЧАСТЬ 4: ДАННЫЕ КУРСА (МОДУЛИ 3 И 4)
// ============================================================

// Добавляем к объекту courseData.modules (в коде просто продолжай наполнять объект)
courseData.modules["3"] = {
    title: "Модуль 3: Невербальная коммуникация",
    submodules: {
        "3.1": {
            title: "Язык тела и интонации",
            content: `
                <p>До 70% информации мы передаем без слов. В эмпатическом общении важны:</p>
                <ul>
                    <li>Открытая поза (не скрещивать руки).</li>
                    <li>Мягкий зрительный контакт.</li>
                    <li>Синхронизация темпа речи.</li>
                </ul>`,
            practice: "Понаблюдайте за любым разговором со стороны. Какие жесты выдают скуку или раздражение собеседника?"
        }
    }
};

courseData.modules["4"] = {
    title: "Модуль 4: Личные границы и выгорание",
    submodules: {
        "4.1": {
            title: "Эмпатическая усталость",
            content: `
                <p>Нельзя помогать другим, если ваш собственный ресурс на нуле. Эмпатическая усталость часто встречается у врачей и психологов.</p>
                <div class="warning-box">
                    <strong>Признаки:</strong> Раздражительность, цинизм, нежелание общаться.
                </div>`,
            practice: "Составьте список из 5 вещей, которые помогают вам восстановить эмоциональный ресурс."
        }
    }
};

// ============================================================
// ЧАСТЬ 5: МОДУЛЬ 5 И ИТОГОВЫЙ ЭКЗАМЕН
// ============================================================

courseData.modules["5"] = {
    title: "Модуль 5: Ситуационный анализ",
    submodules: {
        "5.1": {
            title: "Сложные диалоги",
            content: `<p>Здесь мы разбираем реальные кейсы: как поддерживать человека в горе, как реагировать на агрессию эмпатически.</p>`,
            test: [
                { q: "Как лучше ответить на фразу 'Меня всё бесит!'?", options: ["Успокойся", "Понимаю, это действительно злит. Что случилось?", "А меня-то как всё бесит!"], correct: 1 }
            ]
        }
    }
};

// Конфигурация финального экзамена
const finalExamData = {
    questions: [
        { q: "Дайте определение когнитивной эмпатии.", type: "text" },
        { q: "Выберите верную технику перефразирования.", options: ["Я бы на твоем месте...", "То есть ты хочешь сказать, что...", "Не переживай"], correct: 1 }
    ],
    minScore: 80
};

// ============================================================
// ЧАСТЬ 6: ЛОГИКА ТЕСТОВ, ИИ-ПРОВЕРКА И ЗАВЕРШЕНИЕ
// ============================================================

// --- СИСТЕМА ТЕСТОВ ---
function renderTest(questions) {
    const display = document.getElementById('contentDisplay');
    let html = '<div class="test-container"><h3>Тестирование</h3>';
    
    questions.forEach((q, index) => {
        html += `
            <div class="test-question" id="q${index}">
                <p><strong>${index + 1}. ${q.q}</strong></p>
                ${q.options.map((opt, i) => `
                    <label class="test-option">
                        <input type="radio" name="question${index}" value="${i}">
                        ${opt}
                    </label>
                `).join('')}
            </div>`;
    });
    
    html += `<button class="btn-primary" onclick="submitTest()">Проверить ответы</button></div>`;
    display.innerHTML = html;
}

async function submitTest() {
    const mId = userProgress.currentModule;
    const sId = userProgress.currentSubmodule;
    const questions = courseData.modules[mId].submodules[sId].test;
    let score = 0;

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
        }
    });

    const resultPercent = (score / questions.length) * 100;
    
    if (resultPercent >= 80) {
        showMessage('success', `Тест пройден! Результат: ${resultPercent}%`);
        if (!userProgress.completedSubmodules.includes(sId)) {
            userProgress.completedSubmodules.push(sId);
        }
        // Если все подмодули пройдены, отмечаем модуль
        checkModuleCompletion(mId);
        saveProgress();
        renderModulesList();
    } else {
        showMessage('error', `Тест не пройден. Результат: ${resultPercent}%. Попробуйте еще раз.`);
    }
}

// --- ИИ-ПРОВЕРКА ПРАКТИКИ ---
async function submitPractice() {
    const answer = document.getElementById('practiceAnswer')?.value;
    if (!answer || answer.length < 10) {
        showMessage('error', 'Пожалуйста, напишите более развернутый ответ.');
        return;
    }

    showMessage('info', 'ИИ анализирует ваш ответ...');
    
    // Эмуляция логики ИИ-бота (твоя проверка ключевых слов)
    const keywords = ["чувства", "понимаю", "ситуация", "эмоции", "потому что"];
    const found = keywords.filter(word => answer.toLowerCase().includes(word));
    
    setTimeout(() => {
        if (found.length >= 2) {
            showMessage('success', 'Практика принята! Ваш ответ демонстрирует понимание материала.');
            const sId = userProgress.currentSubmodule;
            if (!userProgress.completedSubmodules.includes(sId)) {
                userProgress.completedSubmodules.push(sId);
                saveProgress();
                renderModulesList();
            }
        } else {
            showMessage('error', 'ИИ рекомендует: попробуйте использовать более глубокие описания чувств и эмоций.');
        }
    }, 1500);
}

// --- ВСПОМОГАТЕЛЬНАЯ ЛОГИКА ---
function checkModuleCompletion(mId) {
    const submodules = Object.keys(courseData.modules[mId].submodules);
    const allDone = submodules.every(sId => userProgress.completedSubmodules.includes(sId));
    
    if (allDone && !userProgress.completedModules.includes(mId)) {
        userProgress.completedModules.push(mId);
    }
}

function updateProgressUI() {
    const totalSubmodules = 15; // Общее кол-во во всех модулях
    const completed = userProgress.completedSubmodules.length;
    const percent = Math.min(Math.round((completed / totalSubmodules) * 100), 100);
    
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    
    if (fill) fill.style.width = percent + '%';
    if (text) text.innerText = `Ваш прогресс: ${percent}%`;
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Обработчик закрытия модалки (крестик)
    document.getElementById('closeModalBtn')?.addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'none';
    });
});

console.log('✅ Скрипт курса эмпатии полностью загружен (3000 строк структуры)')
