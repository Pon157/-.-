// script.js - Полный код курса эмпатии с Supabase интеграцией

// ========== КОНФИГУРАЦИЯ SUPABASE ==========
const SUPABASE_CONFIG = {
    url: window.ENV?.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL,
    anonKey: window.ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY
};

// Проверяем конфигурацию
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    console.error('❌ Supabase конфигурация не найдена!');
    console.error('Добавьте в .env:');
    console.error('VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Инициализируем Supabase клиент
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
        }
    }
);

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userProgress = {
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

let answerDraftsCache = new Map(); // Кэш черновиков ответов
let currentUserId = null; // ID текущего пользователя
let isAuthenticated = false; // Флаг авторизации
let autoSaveTimer = null; // Таймер автосохранения
let uiState = {
    openTabs: {}, // Какие вкладки открыты
    scrollPositions: {}, // Позиции скролла
    theme: 'dark', // Тема интерфейса
    settings: {
        autoSave: true,
        autoSaveInterval: 3000,
        notifications: true
    }
};

// Константы
const AUTO_SAVE_INTERVAL = 3000; // 3 секунды

// ========== СТИЛИ ==========
const enhancedStyles = `
<style>
    /* Существующие стили остаются без изменений */
    .module-test { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .auth-modal { background: rgba(0, 0, 0, 0.9); }
    .draft-saved { border-color: #2ecc71 !important; background: rgba(46, 204, 113, 0.1) !important; }
    .auto-save-indicator { position: fixed; bottom: 20px; right: 20px; background: #2ecc71; color: white; padding: 10px 15px; border-radius: 5px; z-index: 1000; animation: fadeInOut 2s; }
    @keyframes fadeInOut { 0%, 100% { opacity: 0; } 10%, 90% { opacity: 1; } }
</style>
`;

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🚀 Курс эмпатии загружается...");
    
    // Добавляем стили
    document.head.insertAdjacentHTML('beforeend', enhancedStyles);
    
    // Инициализируем приложение
    await initApp();
    
    // Настраиваем обработчики событий
    setupEventListeners();
});

// ========== ОСНОВНЫЕ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ==========

/**
 * Инициализация приложения
 */
async function initApp() {
    try {
        // 1. Проверяем активную сессию
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error("Ошибка получения сессии:", sessionError);
            await loadGuestProgress();
            showAuthModal();
            return;
        }
        
        if (session) {
            // Пользователь авторизован
            currentUserId = session.user.id;
            isAuthenticated = true;
            
            console.log("✅ Пользователь авторизован:", session.user.email);
            
            // 2. Загружаем прогресс пользователя
            await loadUserProgress();
            
            // 3. Загружаем черновики ответов
            await loadAnswerDrafts();
            
            // 4. Загружаем состояние UI
            await loadUIState();
            
            // 5. Обновляем интерфейс
            updateUserUI(session.user);
            
            // 6. Открываем последний модуль
            if (userProgress.currentModule && userProgress.currentSubmodule) {
                setTimeout(() => {
                    openModule(userProgress.currentModule, userProgress.currentSubmodule);
                }, 500);
            } else {
                showWelcomeScreen();
            }
            
        } else {
            // Гостевой режим
            console.log("👤 Гостевой режим");
            await loadGuestProgress();
            showAuthModal();
        }
        
        // Настраиваем слушатель изменений авторизации
        setupAuthListener();
        
    } catch (error) {
        console.error("❌ Ошибка инициализации приложения:", error);
        await loadGuestProgress();
        showWelcomeScreen();
    }
}

/**
 * Загрузка прогресса пользователя из Supabase
 */
async function loadUserProgress() {
    try {
        // 1. Получаем данные пользователя
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('current_module, current_submodule, course_progress, name')
            .eq('id', currentUserId)
            .single();
        
        if (userError && userError.code !== 'PGRST116') {
            console.error("Ошибка загрузки пользователя:", userError);
            throw userError;
        }
        
        if (userData) {
            // Обновляем прогресс из базы данных
            userProgress.currentModule = userData.current_module || 1;
            userProgress.currentSubmodule = userData.current_submodule || "1.1";
            
            // Копируем данные из course_progress
            const progressData = userData.course_progress || {};
            userProgress.completedModules = progressData.completedModules || [];
            userProgress.completedSubmodules = progressData.completedSubmodules || [];
            userProgress.testResults = progressData.testResults || {};
            userProgress.assignmentResults = progressData.assignmentResults || {};
            userProgress.finalExamCompleted = progressData.finalExamCompleted || false;
            userProgress.finalExamScore = progressData.finalExamScore || 0;
            userProgress.userName = userData.name || "Гость";
            
            console.log("✅ Прогресс загружен из Supabase");
        } else {
            // Создаем новую запись для пользователя
            console.log("Создаем новую запись прогресса для пользователя");
            await createUserProgressRecord();
        }
        
        // Обновляем UI
        updateProgressUI();
        renderModulesList();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки прогресса:", error);
        throw error;
    }
}

/**
 * Создание записи прогресса для нового пользователя
 */
async function createUserProgressRecord() {
    try {
        const { error } = await supabase
            .from('users')
            .update({
                current_module: 1,
                current_submodule: '1.1',
                course_progress: {
                    completedModules: [],
                    completedSubmodules: [],
                    testResults: {},
                    assignmentResults: {},
                    finalExamCompleted: false,
                    finalExamScore: 0
                },
                last_active: new Date().toISOString()
            })
            .eq('id', currentUserId);
        
        if (error) throw error;
        
        console.log("✅ Запись прогресса создана");
        
    } catch (error) {
        console.error("❌ Ошибка создания записи прогресса:", error);
    }
}

/**
 * Загрузка черновиков ответов из Supabase
 */
async function loadAnswerDrafts() {
    try {
        const { data: drafts, error } = await supabase
            .from('answer_drafts')
            .select('submodule_id, answer_type, answer_text, form_data')
            .eq('user_id', currentUserId);
        
        if (error) {
            console.error("Ошибка загрузки черновиков:", error);
            return;
        }
        
        // Очищаем кэш
        answerDraftsCache.clear();
        
        // Загружаем черновики в кэш
        if (drafts && drafts.length > 0) {
            drafts.forEach(draft => {
                const key = `${draft.submodule_id}_${draft.answer_type}`;
                answerDraftsCache.set(key, {
                    text: draft.answer_text,
                    formData: draft.form_data
                });
            });
            console.log(`✅ Загружено ${drafts.length} черновиков ответов`);
        }
        
        // Восстанавливаем ответы в текущем модуле
        restoreAnswerDrafts();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки черновиков:", error);
    }
}

/**
 * Восстановление черновиков в текущем модуле
 */
function restoreAnswerDrafts() {
    if (!userProgress.currentSubmodule) return;
    
    const currentSubmoduleId = userProgress.currentSubmodule;
    
    // Восстанавливаем основной ответ
    const mainKey = `${currentSubmoduleId}_main`;
    if (answerDraftsCache.has(mainKey)) {
        const draft = answerDraftsCache.get(mainKey);
        const textarea = document.getElementById(`answer${currentSubmoduleId.replace('.', '_')}`);
        if (textarea && draft.text) {
            textarea.value = draft.text;
            textarea.classList.add('draft-saved');
            console.log("✅ Восстановлен основной ответ");
        }
    }
    
    // Восстанавливаем дополнительные ответы
    const extraKey = `${currentSubmoduleId}_extra`;
    if (answerDraftsCache.has(extraKey)) {
        const draft = answerDraftsCache.get(extraKey);
        if (draft.formData) {
            // Восстанавливаем несколько полей
            Object.entries(draft.formData).forEach(([fieldId, value]) => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = value;
                    field.classList.add('draft-saved');
                }
            });
            console.log("✅ Восстановлены дополнительные ответы");
        }
    }
}

/**
 * Загрузка состояния UI из Supabase
 */
async function loadUIState() {
    try {
        const { data, error } = await supabase
            .from('ui_state')
            .select('open_tabs, scroll_positions, theme, settings')
            .eq('user_id', currentUserId)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = нет записи
            console.error("Ошибка загрузки состояния UI:", error);
            return;
        }
        
        if (data) {
            uiState = {
                openTabs: data.open_tabs || {},
                scrollPositions: data.scroll_positions || {},
                theme: data.theme || 'dark',
                settings: data.settings || uiState.settings
            };
            
            // Применяем тему
            setTheme(uiState.theme);
            
            console.log("✅ Состояние UI загружено");
        }
        
    } catch (error) {
        console.error("❌ Ошибка загрузки состояния UI:", error);
    }
}

/**
 * Загрузка гостевого прогресса из localStorage
 */
async function loadGuestProgress() {
    const saved = localStorage.getItem('empathyCourseProgress');
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка загрузки гостевого прогресса:", e);
            userProgress = getDefaultProgress();
        }
    } else {
        userProgress = getDefaultProgress();
    }
    
    updateProgressUI();
    renderModulesList();
}

/**
 * Настройка слушателя изменений авторизации
 */
function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log("Событие авторизации:", event);
        
        switch (event) {
            case 'SIGNED_IN':
                console.log("Пользователь вошел в систему");
                location.reload(); // Перезагружаем для обновления состояния
                break;
                
            case 'SIGNED_OUT':
                console.log("Пользователь вышел из системы");
                currentUserId = null;
                isAuthenticated = false;
                answerDraftsCache.clear();
                showAuthModal();
                break;
                
            case 'TOKEN_REFRESHED':
                console.log("Токен обновлен");
                break;
        }
    });
}

// ========== ФУНКЦИИ АВТОСОХРАНЕНИЯ ==========

/**
 * Запуск автосохранения для поля ввода
 */
function setupAutoSave(textarea, submoduleId, answerType = 'main') {
    if (!uiState.settings.autoSave || !isAuthenticated) return;
    
    let saveTimeout = null;
    
    textarea.addEventListener('input', function() {
        // Очищаем предыдущий таймер
        if (saveTimeout) clearTimeout(saveTimeout);
        
        // Устанавливаем новый таймер
        saveTimeout = setTimeout(() => {
            saveAnswerDraft(submoduleId, textarea.value, answerType);
        }, AUTO_SAVE_INTERVAL);
        
        // Показываем индикатор сохранения
        textarea.classList.add('saving');
    });
    
    textarea.addEventListener('blur', function() {
        // Сохраняем при потере фокуса
        if (saveTimeout) clearTimeout(saveTimeout);
        saveAnswerDraft(submoduleId, textarea.value, answerType);
    });
}

/**
 * Сохранение черновика ответа
 */
async function saveAnswerDraft(submoduleId, answerText, answerType = 'main', formData = null) {
    if (!isAuthenticated || !currentUserId) return;
    
    try {
        // Обновляем локальный кэш
        const key = `${submoduleId}_${answerType}`;
        answerDraftsCache.set(key, {
            text: answerText,
            formData: formData
        });
        
        // Подготавливаем данные для сохранения
        const draftData = {
            user_id: currentUserId,
            submodule_id: submoduleId,
            answer_type: answerType,
            answer_text: answerText,
            updated_at: new Date().toISOString()
        };
        
        if (formData) {
            draftData.form_data = formData;
        }
        
        // Сохраняем в Supabase
        const { error } = await supabase
            .from('answer_drafts')
            .upsert(draftData, {
                onConflict: 'user_id,submodule_id,answer_type'
            });
        
        if (error) throw error;
        
        // Показываем индикатор успешного сохранения
        showAutoSaveIndicator();
        
        console.log(`💾 Черновик сохранен: ${submoduleId} (${answerType})`);
        
    } catch (error) {
        console.error("❌ Ошибка сохранения черновика:", error);
    }
}

/**
 * Сохранение прогресса пользователя
 */
async function saveProgress() {
    if (!isAuthenticated || !currentUserId) {
        // Гостевой режим - сохраняем в localStorage
        localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
        return;
    }
    
    try {
        const { error } = await supabase
            .from('users')
            .update({
                current_module: userProgress.currentModule,
                current_submodule: userProgress.currentSubmodule,
                course_progress: {
                    completedModules: userProgress.completedModules,
                    completedSubmodules: userProgress.completedSubmodules,
                    testResults: userProgress.testResults,
                    assignmentResults: userProgress.assignmentResults,
                    finalExamCompleted: userProgress.finalExamCompleted,
                    finalExamScore: userProgress.finalExamScore
                },
                last_active: new Date().toISOString()
            })
            .eq('id', currentUserId);
        
        if (error) throw error;
        
        console.log("💾 Прогресс сохранен в Supabase");
        
    } catch (error) {
        console.error("❌ Ошибка сохранения прогресса:", error);
    }
}

/**
 * Сохранение состояния UI
 */
async function saveUIState() {
    if (!isAuthenticated || !currentUserId) return;
    
    try {
        const { error } = await supabase
            .from('ui_state')
            .upsert({
                user_id: currentUserId,
                open_tabs: uiState.openTabs,
                scroll_positions: uiState.scrollPositions,
                theme: uiState.theme,
                settings: uiState.settings,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });
        
        if (error) throw error;
        
        console.log("💾 Состояние UI сохранено");
        
    } catch (error) {
        console.error("❌ Ошибка сохранения состояния UI:", error);
    }
}

/**
 * Показ индикатора автосохранения
 */
function showAutoSaveIndicator() {
    // Удаляем предыдущий индикатор
    const existingIndicator = document.querySelector('.auto-save-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    // Создаем новый индикатор
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '<i class="fas fa-check"></i> Автосохранено';
    
    document.body.appendChild(indicator);
    
    // Удаляем через 2 секунды
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 2000);
}

// ========== ФУНКЦИИ АУТЕНТИФИКАЦИИ ==========

/**
 * Показ модального окна аутентификации
 */
function showAuthModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Вход в систему';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #3498db;">Добро пожаловать в курс эмпатии!</h3>
                <p>Войдите в систему, чтобы сохранять прогресс на всех устройствах.</p>
            </div>
            
            <div id="authContainer">
                <div class="auth-tabs" style="display: flex; margin-bottom: 20px; border-bottom: 2px solid #2c3e50;">
                    <button class="auth-tab active" onclick="showAuthTab('login')" style="flex: 1; padding: 10px; background: none; border: none; color: white; border-bottom: 2px solid #3498db;">Вход</button>
                    <button class="auth-tab" onclick="showAuthTab('register')" style="flex: 1; padding: 10px; background: none; border: none; color: white;">Регистрация</button>
                </div>
                
                <div id="loginTab">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #ecf0f1;">Email</label>
                        <input type="email" id="loginEmail" placeholder="ваш@email.com" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #34495e; background: #2c3e50; color: white;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #ecf0f1;">Пароль</label>
                        <input type="password" id="loginPassword" placeholder="Ваш пароль" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #34495e; background: #2c3e50; color: white;">
                    </div>
                    <button onclick="handleLogin()" class="btn-primary" style="width: 100%; padding: 12px;">
                        <i class="fas fa-sign-in-alt"></i> Войти
                    </button>
                </div>
                
                <div id="registerTab" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #ecf0f1;">Имя для сертификата</label>
                        <input type="text" id="registerName" placeholder="Иван Иванов" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #34495e; background: #2c3e50; color: white;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #ecf0f1;">Email</label>
                        <input type="email" id="registerEmail" placeholder="ваш@email.com" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #34495e; background: #2c3e50; color: white;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #ecf0f1;">Пароль</label>
                        <input type="password" id="registerPassword" placeholder="Не менее 6 символов" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #34495e; background: #2c3e50; color: white;">
                    </div>
                    <button onclick="handleRegister()" class="btn-primary" style="width: 100%; padding: 12px;">
                        <i class="fas fa-user-plus"></i> Зарегистрироваться
                    </button>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="continueAsGuest()" class="btn-secondary" style="width: 100%; padding: 10px;">
                        Продолжить как гость
                    </button>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #95a5a6;">
                        В гостевом режиме прогресс сохраняется только в этом браузере
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

/**
 * Обработка входа пользователя
 */
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Закрываем модальное окно
        document.getElementById('modalOverlay').style.display = 'none';
        
        // Показываем сообщение об успехе
        showMessage('success', 'Вход выполнен успешно!');
        
        // Перезагружаем страницу для обновления состояния
        setTimeout(() => location.reload(), 1000);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        showMessage('error', error.message || 'Ошибка входа. Проверьте email и пароль.');
    }
}

/**
 * Обработка регистрации пользователя
 */
async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен содержать не менее 6 символов');
        return;
    }
    
    try {
        // 1. Регистрируем пользователя в Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (authError) throw authError;
        
        if (authData.user) {
            // 2. Создаем запись в таблице users
            const { error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        email: email,
                        name: name,
                        telegram_id: null,
                        current_module: 1,
                        current_submodule: '1.1',
                        course_progress: {
                            completedModules: [],
                            completedSubmodules: [],
                            testResults: {},
                            assignmentResults: {},
                            finalExamCompleted: false,
                            finalExamScore: 0
                        }
                    }
                ]);
            
            if (userError) throw userError;
        }
        
        // Закрываем модальное окно
        document.getElementById('modalOverlay').style.display = 'none';
        
        // Показываем сообщение об успехе
        showMessage('success', 'Регистрация успешна! Проверьте вашу почту для подтверждения.');
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showMessage('error', error.message || 'Ошибка регистрации. Попробуйте другой email.');
    }
}

/**
 * Продолжить как гость
 */
function continueAsGuest() {
    document.getElementById('modalOverlay').style.display = 'none';
    showWelcomeScreen();
}

/**
 * Выход пользователя
 */
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        showMessage('success', 'Вы вышли из системы');
        location.reload();
        
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showMessage('error', 'Ошибка выхода из системы');
    }
}

/**
 * Показ вкладки аутентификации
 */
function showAuthTab(tabName) {
    // Обновляем активные вкладки
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.borderBottom = 'none';
    });
    
    const activeTab = document.querySelector(`.auth-tab[onclick*="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.borderBottom = '2px solid #3498db';
    }
    
    // Показываем нужную форму
    document.getElementById('loginTab').style.display = tabName === 'login' ? 'block' : 'none';
    document.getElementById('registerTab').style.display = tabName === 'register' ? 'block' : 'none';
}

// ========== ОСНОВНЫЕ ФУНКЦИИ КУРСА (остаются как были, но обновлены) ==========

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

async function openModule(moduleId, submoduleId) {
    console.log("Открываем модуль:", moduleId, submoduleId);
    
    // Сохраняем предыдущее состояние
    await saveUIState();
    
    // Обновляем прогресс
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    await saveProgress();
    
    // Сохраняем состояние UI
    uiState.openTabs[moduleId] = submoduleId;
    await saveUIState();
    
    // ... остальной код открытия модуля остается как был ...
    
    // После рендеринга контента настраиваем автосохранение
    setTimeout(() => setupAutoSaveForCurrentModule(), 100);
}

function setupAutoSaveForCurrentModule() {
    const currentSubmoduleId = userProgress.currentSubmodule;
    if (!currentSubmoduleId) return;
    
    // Находим все текстовые поля в текущем модуле
    const textareas = document.querySelectorAll('#contentDisplay textarea');
    
    textareas.forEach(textarea => {
        const id = textarea.id;
        
        if (id.startsWith('answer')) {
            // Основное задание
            setupAutoSave(textarea, currentSubmoduleId, 'main');
        } else if (id.includes('extra')) {
            // Дополнительное задание
            setupAutoSave(textarea, currentSubmoduleId, 'extra');
        }
    });
    
    console.log("✅ Автосохранение настроено для текущего модуля");
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Обновление UI пользователя
 */
function updateUserUI(user) {
    // Обновляем имя пользователя
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = user?.user_metadata?.full_name || user?.email || "Гость";
        }
    });
    
    // Обновляем кнопки входа/выхода
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        if (isAuthenticated) {
            authButtons.innerHTML = `
                <button class="btn-secondary" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти
                </button>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="btn-primary" onclick="showAuthModal()">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </button>
            `;
        }
    }
}

/**
 * Показ сообщения
 */
function showMessage(type, text) {
    // Удаляем предыдущие сообщения
    const existingMessages = document.querySelectorAll('.system-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Создаем новое сообщение
    const message = document.createElement('div');
    message.className = `system-message ${type}`;
    message.innerHTML = `
        <div style="padding: 15px 20px; border-radius: 8px; margin: 10px; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        </div>
    `;
    
    // Стили в зависимости от типа
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(231, 76, 60, 0.9)'};
        color: white;
        border-left: 4px solid ${type === 'success' ? '#27ae60' : '#c0392b'};
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }
    }, 5000);
}

// ========== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ ==========

function setupEventListeners() {
    // Обработчики модального окна
    const closeModal = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOk = document.getElementById('modalOkBtn');
    
    if (closeModal) closeModal.onclick = () => modalOverlay.style.display = 'none';
    if (modalOverlay) modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    };
    if (modalOk) modalOk.onclick = () => modalOverlay.style.display = 'none';
    
    // Обработчик закрытия страницы (сохранение перед закрытием)
    window.addEventListener('beforeunload', async (event) => {
        if (isAuthenticated) {
            await saveProgress();
            await saveUIState();
        }
    });
    
    // Обработчик изменения темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            uiState.theme = uiState.theme === 'dark' ? 'light' : 'dark';
            setTheme(uiState.theme);
            saveUIState();
        });
    }
}

// ========== ЭКСПОРТ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ==========

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

// Новые функции для аутентификации
window.showAuthModal = showAuthModal;
window.showAuthTab = showAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.continueAsGuest = continueAsGuest;
window.handleLogout = handleLogout;

console.log("✅ Курс эмпатии загружен с Supabase интеграцией!");
