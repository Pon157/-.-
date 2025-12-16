// ========== КОНФИГУРАЦИЯ SUPABASE ==========
// Важно: Создайте файл env.js с вашими ключами:
// window.ENV = {
//   SUPABASE_URL: 'https://your-project.supabase.co',
//   SUPABASE_ANON_KEY: 'your-anon-key'
// };

// Альтернативно используйте переменные окружения сервера
const SUPABASE_CONFIG = {
    url: window.ENV?.SUPABASE_URL || process.env.SUPABASE_URL,
    anonKey: window.ENV?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
};

console.log('🔧 Конфигурация Supabase:', SUPABASE_CONFIG.url ? 'Найдена' : 'Не найдена');

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let supabase; // ОБЪЯВЛЕНО ТОЛЬКО ОДИН РАЗ ЗДЕСЬ!

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

let answerDraftsCache = new Map();
let currentUserId = null;
let isAuthenticated = false;
let autoSaveTimer = null;
let uiState = {
    openTabs: {},
    scrollPositions: {},
    theme: 'dark',
    settings: {
        autoSave: true,
        autoSaveInterval: 3000,
        notifications: true
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ SUPABASE КЛИЕНТА ==========
function initializeSupabase() {
    try {
        if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
            supabase = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: false,
                        storage: window.localStorage,
                        storageKey: 'supabase.auth.token'
                    },
                    global: {
                        headers: {
                            'apikey': SUPABASE_CONFIG.anonKey,
                            'Content-Type': 'application/json'
                        }
                    },
                    realtime: {
                        params: {
                            eventsPerSecond: 10
                        }
                    }
                }
            );
            console.log('✅ Supabase клиент инициализирован');
            return true;
        } else {
            console.warn('⚠️ Supabase не инициализирован. Проверьте конфигурацию.');
            console.warn('URL:', SUPABASE_CONFIG.url ? '✓ Установлен' : '✗ Отсутствует');
            console.warn('Anon Key:', SUPABASE_CONFIG.anonKey ? '✓ Установлен' : '✗ Отсутствует');
            console.warn('Библиотека:', window.supabase ? '✓ Загружена' : '✗ Не загружена');
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка инициализации Supabase:', error);
        return false;
    }
}



// ========== СТИЛИ ==========
const enhancedStyles = `
<style>
    /* Все твои оригинальные стили остаются */
    .module-test { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .quote-box { background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.1) 100%); }
    .definition-box { background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.1) 100%); }
    .source-box { background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%); }
    .check-question { background: rgba(52, 152, 219, 0.1); }
    .practical-tip { background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%); }
    .test-question { background: rgba(255, 255, 255, 0.05); }
    .test-option:hover { background: rgba(52, 152, 219, 0.1); }
    .practical-task { background: rgba(46, 204, 113, 0.1); }
    .exam-stat:hover { transform: translateY(-5px); background: rgba(52, 152, 219, 0.1); }
    .option-correct { background: rgba(46, 204, 113, 0.15) !important; border-color: #2ecc71 !important; }
    .option-incorrect { background: rgba(231, 76, 60, 0.15) !important; border-color: #e74c3c !important; }
    .test-result { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
    .assignment { background: linear-gradient(135deg, rgba(41, 128, 185, 0.1) 0%, rgba(52, 152, 219, 0.1) 100%); }
    .additional-task { background: rgba(255, 255, 255, 0.05); }
    .feedback.correct { background: rgba(46, 204, 113, 0.15); border-left: 4px solid #2ecc71; }
    .feedback.incorrect { background: rgba(231, 76, 60, 0.15); border-left: 4px solid #e74c3c; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
    textarea:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2); }
    
    /* Новые стили для автосохранения */
    .draft-saved {
        border: 2px solid #2ecc71 !important;
        background: rgba(46, 204, 113, 0.05) !important;
    }
    
    .auto-saving {
        border: 2px solid #f39c12 !important;
        background: rgba(243, 156, 18, 0.05) !important;
    }
    
    .auto-save-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        animation: slideInUp 0.3s ease;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .auth-modal {
        background: rgba(0, 0, 0, 0.95) !important;
    }
    
    .auth-tab {
        cursor: pointer;
        padding: 12px 20px;
        border: none;
        background: none;
        color: #95a5a6;
        font-size: 1rem;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
    }
    
    .auth-tab.active {
        color: #3498db;
        border-bottom: 2px solid #3498db;
        font-weight: bold;
    }
    
    .user-menu {
        position: relative;
        display: inline-block;
    }
    
    .user-menu-content {
        display: none;
        position: absolute;
        right: 0;
        top: 100%;
        background: #2c3e50;
        min-width: 200px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 1000;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .user-menu:hover .user-menu-content {
        display: block;
    }
    
    .user-menu-item {
        display: block;
        padding: 12px 20px;
        color: white;
        text-decoration: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        transition: background 0.3s;
    }
    
    .user-menu-item:hover {
        background: #3498db;
    }
    
    .guest-warning {
        background: rgba(243, 156, 18, 0.1);
        border-left: 4px solid #f39c12;
        padding: 15px;
        margin: 15px 0;
        border-radius: 0 8px 8px 0;
        color: #f39c12;
    }
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

async function initApp() {
    try {
        if (supabase) {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.error("Ошибка получения сессии:", sessionError);
                await loadGuestProgress();
                showAuthModal();
                return;
            }
            
            if (session) {
                currentUserId = session.user.id;
                isAuthenticated = true;
                console.log("✅ Пользователь авторизован:", session.user.email);
                
                await loadUserProgress();
                await loadAnswerDrafts();
                await loadUIState();
                
                updateUserUI(session.user);
                
                if (userProgress.currentModule && userProgress.currentSubmodule) {
                    setTimeout(() => {
                        openModule(userProgress.currentModule, userProgress.currentSubmodule);
                    }, 500);
                } else {
                    showWelcomeScreen();
                }
                
                setupAuthListener();
                
            } else {
                console.log("👤 Гостевой режим");
                await loadGuestProgress();
                showAuthModal();
            }
        } else {
            console.log("🔄 Работа в гостевом режиме (Supabase не настроен)");
            await loadGuestProgress();
            showWelcomeScreen();
        }
        
    } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        await loadGuestProgress();
        showWelcomeScreen();
    }
}

async function loadUserProgress() {
    try {
        if (!supabase || !currentUserId) return;
        
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('current_module, current_submodule, course_progress, name')
            .eq('id', currentUserId)
            .single();
        
        if (userError && userError.code !== 'PGRST116') {
            throw userError;
        }
        
        if (userData) {
            userProgress.currentModule = userData.current_module || 1;
            userProgress.currentSubmodule = userData.current_submodule || "1.1";
            
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
            await createUserProgressRecord();
        }
        
        updateProgressUI();
        renderModulesList();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки прогресса:", error);
        throw error;
    }
}

async function createUserProgressRecord() {
    try {
        if (!supabase || !currentUserId) return;
        
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
        console.error("❌ Ошибка создания записи:", error);
    }
}

async function loadAnswerDrafts() {
    try {
        if (!supabase || !currentUserId) return;
        
        const { data: drafts, error } = await supabase
            .from('answer_drafts')
            .select('submodule_id, answer_type, answer_text, form_data')
            .eq('user_id', currentUserId);
        
        if (error) {
            console.error("Ошибка загрузки черновиков:", error);
            return;
        }
        
        answerDraftsCache.clear();
        
        if (drafts && drafts.length > 0) {
            drafts.forEach(draft => {
                const key = `${draft.submodule_id}_${draft.answer_type}`;
                answerDraftsCache.set(key, {
                    text: draft.answer_text,
                    formData: draft.form_data
                });
            });
            console.log(`✅ Загружено ${drafts.length} черновиков`);
        }
        
        restoreAnswerDrafts();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки черновиков:", error);
    }
}

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

async function loadUIState() {
    try {
        if (!supabase || !currentUserId) return;
        
        const { data, error } = await supabase
            .from('ui_state')
            .select('open_tabs, scroll_positions, theme, settings')
            .eq('user_id', currentUserId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
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
            
            setTheme(uiState.theme);
            console.log("✅ Состояние UI загружено");
        }
        
    } catch (error) {
        console.error("❌ Ошибка загрузки состояния UI:", error);
    }
}

async function loadGuestProgress() {
    const saved = localStorage.getItem('empathyCourseProgress');
    if (saved) {
        try {
            userProgress = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
            userProgress = getDefaultProgress();
        }
    } else {
        userProgress = getDefaultProgress();
    }
    
    updateProgressUI();
    renderModulesList();
}

function setupAuthListener() {
    if (!supabase) return;
    
    supabase.auth.onAuthStateChange((event, session) => {
        console.log("Событие авторизации:", event);
        
        switch (event) {
            case 'SIGNED_IN':
                location.reload();
                break;
            case 'SIGNED_OUT':
                currentUserId = null;
                isAuthenticated = false;
                answerDraftsCache.clear();
                showAuthModal();
                break;
        }
    });
}

// ========== ФУНКЦИИ АВТОСОХРАНЕНИЯ ==========

function setupAutoSaveForModule() {
    const currentSubmoduleId = userProgress.currentSubmodule;
    if (!currentSubmoduleId) return;
    
    const textareas = document.querySelectorAll('#contentDisplay textarea');
    
    textareas.forEach(textarea => {
        const id = textarea.id;
        let answerType = '';
        
        if (id.startsWith('answer')) {
            answerType = 'main';
        } else if (id.includes('extra')) {
            answerType = 'extra';
        } else if (id.includes('test') || id.includes('exam')) {
            answerType = 'test';
        }
        
        if (answerType) {
            setupAutoSave(textarea, currentSubmoduleId, answerType);
        }
    });
    
    // Также настраиваем автосохранение для radio buttons
    const radioGroups = document.querySelectorAll('input[type="radio"]');
    radioGroups.forEach(radio => {
        radio.addEventListener('change', function() {
            const groupName = this.name;
            const group = document.querySelectorAll(`input[name="${groupName}"]:checked`);
            if (group.length > 0) {
                saveRadioGroupState(currentSubmoduleId, groupName, group[0].value);
            }
        });
    });
    
    console.log("✅ Автосохранение настроено");
}

function setupAutoSave(element, submoduleId, answerType = 'main') {
    if (!uiState.settings.autoSave || !isAuthenticated) return;
    
    let saveTimeout = null;
    
    element.addEventListener('input', function() {
        if (saveTimeout) clearTimeout(saveTimeout);
        
        element.classList.add('auto-saving');
        element.classList.remove('draft-saved');
        
        saveTimeout = setTimeout(() => {
            let formData = null;
            
            if (answerType === 'extra') {
                // Для дополнительных заданий собираем все поля
                const extraFields = document.querySelectorAll(`textarea[id^="extra${submoduleId.replace('.', '_')}"]`);
                if (extraFields.length > 1) {
                    formData = {};
                    extraFields.forEach(field => {
                        formData[field.id] = field.value;
                    });
                }
            }
            
            saveAnswerDraft(submoduleId, element.value, answerType, formData);
            
            element.classList.remove('auto-saving');
            element.classList.add('draft-saved');
            
        }, uiState.settings.autoSaveInterval || 3000);
    });
    
    element.addEventListener('blur', function() {
        if (saveTimeout) clearTimeout(saveTimeout);
        
        let formData = null;
        if (answerType === 'extra') {
            const extraFields = document.querySelectorAll(`textarea[id^="extra${submoduleId.replace('.', '_')}"]`);
            if (extraFields.length > 1) {
                formData = {};
                extraFields.forEach(field => {
                    formData[field.id] = field.value;
                });
            }
        }
        
        saveAnswerDraft(submoduleId, element.value, answerType, formData);
        
        element.classList.remove('auto-saving');
        element.classList.add('draft-saved');
    });
}

async function saveAnswerDraft(submoduleId, answerText, answerType = 'main', formData = null) {
    if (!isAuthenticated || !currentUserId) {
        // В гостевом режиме сохраняем в localStorage
        const guestDrafts = JSON.parse(localStorage.getItem('guestAnswerDrafts') || '{}');
        const key = `${submoduleId}_${answerType}`;
        guestDrafts[key] = { text: answerText, formData: formData };
        localStorage.setItem('guestAnswerDrafts', JSON.stringify(guestDrafts));
        return;
    }
    
    try {
        const key = `${submoduleId}_${answerType}`;
        answerDraftsCache.set(key, {
            text: answerText,
            formData: formData
        });
        
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
        
        const { error } = await supabase
            .from('answer_drafts')
            .upsert(draftData, {
                onConflict: 'user_id,submodule_id,answer_type'
            });
        
        if (error) throw error;
        
        showAutoSaveIndicator();
        
        console.log(`💾 Черновик сохранен: ${submoduleId} (${answerType})`);
        
    } catch (error) {
        console.error("❌ Ошибка сохранения:", error);
    }
}

async function saveRadioGroupState(submoduleId, groupName, value) {
    if (!isAuthenticated || !currentUserId) return;
    
    try {
        const key = `${submoduleId}_radio_${groupName}`;
        answerDraftsCache.set(key, value);
        
        await supabase
            .from('answer_drafts')
            .upsert({
                user_id: currentUserId,
                submodule_id: submoduleId,
                answer_type: `radio_${groupName}`,
                answer_text: value,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,submodule_id,answer_type'
            });
        
    } catch (error) {
        console.error("Ошибка сохранения радио-группы:", error);
    }
}

async function saveProgress() {
    if (!isAuthenticated || !currentUserId) {
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
        console.log("💾 Прогресс сохранен");
        
    } catch (error) {
        console.error("❌ Ошибка сохранения:", error);
    }
}

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
        console.log("💾 UI сохранено");
        
    } catch (error) {
        console.error("❌ Ошибка сохранения UI:", error);
    }
}

function showAutoSaveIndicator() {
    const existing = document.querySelector('.auto-save-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '<i class="fas fa-check"></i> Автосохранено';
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => indicator.remove(), 300);
        }
    }, 2000);
}

// ========== ФУНКЦИИ АУТЕНТИФИКАЦИИ ==========

function showAuthModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Вход в систему';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #3498db;">Добро пожаловать в курс эмпатии!</h3>
                <p>Войдите, чтобы сохранять прогресс на всех устройствах.</p>
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

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        document.getElementById('modalOverlay').style.display = 'none';
        showMessage('success', 'Вход выполнен!');
        setTimeout(() => location.reload(), 1000);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        showMessage('error', error.message || 'Ошибка входа');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль минимум 6 символов');
        return;
    }
    
    try {
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
        
        document.getElementById('modalOverlay').style.display = 'none';
        showMessage('success', 'Регистрация успешна! Проверьте почту.');
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showMessage('error', error.message || 'Ошибка регистрации');
    }
}

function continueAsGuest() {
    document.getElementById('modalOverlay').style.display = 'none';
    showWelcomeScreen();
}

async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        showMessage('success', 'Вы вышли');
        location.reload();
        
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showMessage('error', 'Ошибка выхода');
    }
}

function showAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.borderBottom = 'none';
    });
    
    const activeTab = document.querySelector(`.auth-tab[onclick*="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.borderBottom = '2px solid #3498db';
    }
    
    document.getElementById('loginTab').style.display = tabName === 'login' ? 'block' : 'none';
    document.getElementById('registerTab').style.display = tabName === 'register' ? 'block' : 'none';
}

// ========== ОСНОВНЫЕ ФУНКЦИИ КУРСА ==========

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
    
    await saveUIState();
    
    userProgress.currentModule = moduleId;
    userProgress.currentSubmodule = submoduleId;
    await saveProgress();
    
    uiState.openTabs[moduleId] = submoduleId;
    await saveUIState();
    
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) return;
    
    document.getElementById('testArea').style.display = 'none';
    document.getElementById('finalExamArea').style.display = 'none';
    
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleSubtitle').textContent = submodule.title;
    
    document.getElementById('contentDisplay').style.display = 'block';
    document.getElementById('moduleTabs').style.display = 'flex';
    
    renderTabs(submodule);
    renderModulesList();
    updateModuleProgress();
    
    // Настраиваем автосохранение после рендеринга
    setTimeout(() => setupAutoSaveForModule(), 100);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function updateProgressUI() {
    const totalSubmodules = courseData.modules.reduce((sum, module) => {
        return sum + (module.submodules ? module.submodules.length : 0);
    }, 0);
    
    const completed = userProgress.completedSubmodules.length;
    const percent = totalSubmodules > 0 ? Math.round((completed / totalSubmodules) * 100) : 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const mobileProgressText = document.querySelector('#mobileProgressText');
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `Прогресс: ${percent}%`;
    if (mobileProgressText) mobileProgressText.textContent = `${percent}%`;
    
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = userProgress.userName || "Гость";
        }
    });
    
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
    
    updateModuleProgress();
}

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

function renderModulesList() {
    const modulesList = document.getElementById('modulesList');
    if (!modulesList) return;
    
    let container = modulesList.querySelector('.modules-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'modules-container';
        
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
        
        const completedIcon = userProgress.completedModules.includes(module.id) ? 
            '<i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i>' : 
            '<i class="far fa-circle" style="color: #ccc; margin-right: 8px;"></i>';
        
        moduleItem.innerHTML = `
            <h3>${completedIcon} ${module.title}</h3>
            <p>${module.description}</p>
            ${module.completed ? '<span class="module-completed">✓ Завершен</span>' : ''}
        `;
        
        moduleItem.addEventListener('click', () => {
            document.querySelectorAll('.module-item').forEach(item => {
                item.classList.remove('active');
            });
            moduleItem.classList.add('active');
            
            if (module.submodules && module.submodules.length > 0) {
                openModule(module.id, module.submodules[0].id);
            }
        });
        
        container.appendChild(moduleItem);
        
        if (userProgress.currentModule === module.id && module.submodules) {
            module.submodules.forEach(submodule => {
                const submoduleItem = document.createElement('div');
                submoduleItem.className = `submodule-item ${userProgress.currentSubmodule === submodule.id ? 'active' : ''}`;
                
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
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            showTabContent(tabName, submodule);
        });
        
        moduleTabs.appendChild(tab);
    });
    
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
    
    if (tabNames.length > 0) {
        showTabContent(tabNames[0], submodule);
    }
}

function showTabContent(tabName, submodule) {
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (!submodule.tabs[tabName]) {
        contentDisplay.innerHTML = '<p>Контент не найден</p>';
        return;
    }
    
    let content = submodule.tabs[tabName].content;
    
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
    
    initCheckButtons();
}

function initCheckButtons() {
    console.log("Инициализация кнопок проверки...");
    
    const buttons = document.querySelectorAll('#contentDisplay .btn-primary');
    buttons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('checkAssignment')) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            const match = onclickAttr.match(/checkAssignment\('([^']+)'\)/);
            if (match && match[1]) {
                newButton.addEventListener('click', function() {
                    checkAssignment(match[1]);
                });
                console.log("Кнопка настроена для подмодуля:", match[1]);
            }
        }
    });
    
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

// ОБНОВЛЕННАЯ ФУНКЦИЯ checkAssignment
async function checkAssignment(submoduleId) {
    console.log("=== НАЧАЛО ПРОВЕРКИ ===");
    console.log("Подмодуль для проверки:", submoduleId);
    
    const moduleId = userProgress.currentModule;
    console.log("Текущий модуль:", moduleId);
    
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) {
        console.error("Модуль не найден:", moduleId);
        return;
    }
    
    console.log("Найден модуль:", module.title);
    
    const submodule = module.submodules.find(s => s.id === submoduleId);
    if (!submodule) {
        console.error("Подмодуль не найден:", submoduleId);
        return;
    }
    
    console.log("Найден подмодуль:", submodule.title);
    
    if (!submodule.tabs || !submodule.tabs.assignment) {
        console.error("У подмодуля нет задания:", submoduleId);
        return;
    }
    
    console.log("Задание найдено");
    
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
    
    const wordCount = answer.split(/\s+/).length;
    if (wordCount < 5) {
        showFeedback(feedbackElement, "❌ Ответ слишком короткий. Пожалуйста, напишите развернутый ответ (минимум 5 слов).", false);
        return;
    }
    
    console.log("Ответ пользователя (первые 100 символов):", answer.substring(0, 100) + "...");
    console.log("Количество слов:", wordCount);
    
    try {
        const result = submodule.tabs.assignment.check(answer);
        
        console.log("Результат проверки:", result);
        
        showFeedback(feedbackElement, result.message, result.correct);
        
        if (result.correct) {
            if (!userProgress.completedSubmodules.includes(submoduleId)) {
                userProgress.completedSubmodules.push(submoduleId);
                
                answerElement.style.borderColor = '#2ecc71';
                answerElement.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
                
                const assignmentHeader = answerElement.closest('.assignment')?.querySelector('h4');
                if (assignmentHeader && !assignmentHeader.querySelector('.fa-check-circle')) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check-circle';
                    checkIcon.style.color = '#2ecc71';
                    checkIcon.style.marginLeft = '10px';
                    checkIcon.style.animation = 'scaleIn 0.3s ease';
                    assignmentHeader.appendChild(checkIcon);
                }
                
                await saveProgress();
                
                checkIfModuleCompleted(moduleId);
            }
            
            // УДАЛЯЕМ ЧЕРНОВИК ПОСЛЕ УСПЕШНОЙ ПРОВЕРКИ
            if (isAuthenticated && currentUserId) {
                const key = `${submoduleId}_main`;
                answerDraftsCache.delete(key);
                
                // Удаляем из базы данных
                await supabase
                    .from('answer_drafts')
                    .delete()
                    .eq('user_id', currentUserId)
                    .eq('submodule_id', submoduleId)
                    .eq('answer_type', 'main');
                    
                console.log("✅ Черновик удален после успешной проверки");
            }
            
        } else {
            answerElement.style.borderColor = '#e74c3c';
            answerElement.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
        }
        
    } catch (error) {
        console.error("Ошибка при проверке задания:", error);
        showFeedback(feedbackElement, "❌ Произошла ошибка при проверке. Попробуйте еще раз.", false);
    }
    
    console.log("=== КОНЕЦ ПРОВЕРКИ ===");
}

function showFeedback(element, message, isCorrect) {
    element.textContent = message;
    element.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    element.style.display = "block";
    
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function checkExtraAssignment(submoduleId) {
    console.log("=== НАЧАЛО ПРОВЕРКИ ДОПОЛНИТЕЛЬНОГО ЗАДАНИЯ ===");
    
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    const submodule = module.submodules.find(s => s.id === submoduleId);
    
    if (!module || !submodule) {
        console.error("Не найден модуль или подмодуль");
        return;
    }
    
    console.log("Проверка дополнительного задания для:", submoduleId);
    
    const textareas = document.querySelectorAll(`textarea[id^="extra${submoduleId.replace('.', '_')}"]`);
    
    if (textareas.length === 0) {
        alert("Дополнительные задания не найдены на этой странице.");
        return;
    }
    
    let allFilled = true;
    const answers = [];
    
    textareas.forEach((textarea, index) => {
        const answer = textarea.value.trim();
        answers.push(answer);
        
        if (!answer) {
            allFilled = false;
            textarea.style.borderColor = '#e74c3c';
            textarea.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            
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
    
    // Простая проверка - если все поля заполнены, считаем успешным
    const allValid = answers.every(answer => answer.trim().length > 10);
    
    if (allValid) {
        alert("✅ Все дополнительные задания выполнены правильно!");
        textareas.forEach(textarea => {
            textarea.style.borderColor = '#2ecc71';
            textarea.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
        });
    } else {
        alert("❌ Некоторые ответы слишком короткие. Пожалуйста, напишите более развернутые ответы (минимум 10 символов).");
    }
}

function checkIfModuleCompleted(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.submodules) return;
    
    const allSubmodulesCompleted = module.submodules.every(sub => 
        userProgress.completedSubmodules.includes(sub.id)
    );
    
    if (allSubmodulesCompleted && !userProgress.completedModules.includes(moduleId)) {
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

function openTest(moduleId) {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || !module.test) return;
    
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    document.getElementById('finalExamArea').style.display = 'none';
    
    const testArea = document.getElementById('testArea');
    testArea.style.display = 'block';
    
    document.getElementById('testTitle').textContent = module.test.title;
    document.getElementById('testDescription').textContent = module.test.description;
    
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = '';
    
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

function submitTest() {
    const moduleId = userProgress.currentModule;
    const module = courseData.modules.find(m => m.id === moduleId);
    
    if (!module || !module.test) return;
    
    let score = 0;
    const totalQuestions = module.test.sections ? 
        (module.test.sections.find(s => s.type === 'theory')?.questions?.length || 0) : 0;
    let detailedResults = [];
    
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
            
            detailedResults.push({
                question: question.question,
                isCorrect: isCorrect,
                explanation: question.explanation
            });
            
            if (selected) {
                const option = selected.closest('.test-option');
                if (option) {
                    option.classList.add(isCorrect ? 'option-correct' : 'option-incorrect');
                }
            }
        });
    }
    
    const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    
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

function openFinalExam() {
    const exam = courseData.finalExam;
    
    if (!exam) {
        alert("Итоговый экзамен не найден!");
        return;
    }
    
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
    
    document.getElementById('contentDisplay').style.display = 'none';
    document.getElementById('moduleTabs').style.display = 'none';
    document.getElementById('testArea').style.display = 'none';
    
    const finalExamArea = document.getElementById('finalExamArea');
    finalExamArea.style.display = 'block';
    
    document.getElementById('finalExamTitle').textContent = exam.title;
    document.getElementById('finalExamDescription').textContent = exam.description;
    
    const examContent = document.getElementById('finalExamContent');
    examContent.innerHTML = '';
    
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

function submitFinalExam() {
    const exam = courseData.finalExam;
    if (!exam) return;
    
    let theoryScore = 0;
    let practicalScore = 0;
    let caseScore = 0;
    
    exam.sections[0].questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="theory${index}"]:checked`);
        let isCorrect = false;
        
        if (question.type === 'multiple-choice') {
            isCorrect = selected && parseInt(selected.value) === question.correct;
        } else if (question.type === 'true-false') {
            isCorrect = selected && (selected.value === 'true') === question.correct;
        }
        
        if (isCorrect) {
            theoryScore += 2;
        }
    });
    
    exam.sections[1].tasks.forEach((task, index) => {
        const answer = document.getElementById(`practicalExam${index}`)?.value || '';
        if (answer.trim().length > 50) {
            practicalScore += Math.round(task.maxPoints * 0.6);
            
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
    
    exam.sections[2].tasks.forEach((task, index) => {
        const answer = document.getElementById(`caseExam${index}`)?.value || '';
        if (answer.trim().length > 100) {
            caseScore += Math.round(15 * 0.5);
            
            if (answer.includes("1.") && answer.includes("2.") && answer.includes("3.")) {
                caseScore += Math.round(15 * 0.3);
            }
        }
    });
    
    const totalScore = theoryScore + practicalScore + caseScore;
    const maxScore = parseInt(exam.scoring.total);
    const passingScore = parseInt(exam.scoring.passing);
    const passed = totalScore >= passingScore;
    
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
    
    userProgress.finalExamCompleted = true;
    userProgress.finalExamScore = totalScore;
    userProgress.finalExamGrade = grade;
    userProgress.finalExamDate = new Date().toISOString();
    saveProgress();
    
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
    
    updateProgressUI();
}

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

function showCertificate() {
    if (!userProgress.finalExamCompleted) {
        alert('Сначала пройдите итоговый экзамен!');
        return;
    }
    
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
    
    document.getElementById('closeCertificateBtn').onclick = () => {
        document.body.removeChild(certificateModal);
    };
    
    certificateModal.onclick = (e) => {
        if (e.target === certificateModal) {
            document.body.removeChild(certificateModal);
        }
    };
}

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

function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?\nВсе данные будут удалены, включая результаты тестов и экзамена.")) {
        userProgress = getDefaultProgress();
        
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        localStorage.removeItem('empathyCourseProgress');
        location.reload();
    }
}

function updateUserUI(user) {
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = user?.user_metadata?.full_name || user?.email || "Гость";
        }
    });
    
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

function showMessage(type, text) {
    const existingMessages = document.querySelectorAll('.system-message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `system-message ${type}`;
    message.innerHTML = `
        <div style="padding: 15px 20px; border-radius: 8px; margin: 10px; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        </div>
    `;
    
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
    
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }
    }, 5000);
}

function setupEventListeners() {
    const closeModal = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOk = document.getElementById('modalOkBtn');
    
    if (closeModal) closeModal.onclick = () => modalOverlay.style.display = 'none';
    if (modalOverlay) modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    };
    if (modalOk) modalOk.onclick = () => modalOverlay.style.display = 'none';
    
    window.addEventListener('beforeunload', async (event) => {
        if (isAuthenticated) {
            await saveProgress();
            await saveUIState();
        }
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            uiState.theme = uiState.theme === 'dark' ? 'light' : 'dark';
            setTheme(uiState.theme);
            saveUIState();
        });
    }
}

// ========== ЭКСПОРТ ФУНКЦИЙ ==========

window.checkAssignment = checkAssignment;
window.checkExtraAssignment = checkExtraAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;
window.showWelcomeScreen = showWelcomeScreen;
window.submitName = submitName;
window.printCertificate = printCertificate;
window.saveCertificateAsImage = saveCertificateAsImage;
window.shareCertificate = shareCertificate;
window.openFinalExam = openFinalExam;
window.submitFinalExam = submitFinalExam;
window.openTest = openTest;
window.submitTest = submitTest;
window.showTestInfo = showTestInfo;

window.showAuthModal = showAuthModal;
window.showAuthTab = showAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.continueAsGuest = continueAsGuest;
window.handleLogout = handleLogout;

console.log("✅ Курс эмпатии загружен!");
