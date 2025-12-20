// ========== КОНФИГУРАЦИЯ SUPABASE ==========
const SUPABASE_CONFIG = {
    url: window.ENV?.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL,
    anonKey: window.ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY
};

console.log('🔧 Конфигурация Supabase:', SUPABASE_CONFIG.url ? 'Найдена' : 'Не найдена');

// Инициализируем Supabase клиент если есть конфигурация
function initSupabase() {
    try {
        if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
            if (!window.supabase) {
                console.error('Supabase SDK не загружен!');
                return false;
            }
            
            supabase = window.supabase.createClient(
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
            console.log('✅ Supabase инициализирован');
            return true;
        }
        console.warn('⚠️ Supabase не инициализирован. Работа в гостевом режиме.');
        return false;
    } catch (error) {
        console.error('❌ Ошибка инициализации Supabase:', error);
        return false;
    }
}

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let supabase = null;
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

// ========== СТИЛИ ==========
const enhancedStyles = `
<style>
    /* Основные стили */
    :root {
        --primary-color: #3498db;
        --secondary-color: #2ecc71;
        --danger-color: #e74c3c;
        --warning-color: #f39c12;
        --dark-bg: #1a1a2e;
        --darker-bg: #16213e;
        --light-text: #ecf0f1;
        --gray-text: #95a5a6;
        --border-radius: 12px;
        --box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        --transition: all 0.3s ease;
    }
    
    [data-theme="light"] {
        --dark-bg: #f8f9fa;
        --darker-bg: #e9ecef;
        --light-text: #2c3e50;
        --gray-text: #7f8c8d;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: var(--dark-bg);
        color: var(--light-text);
        line-height: 1.6;
        min-height: 100vh;
    }
    
    /* Контейнеры */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    /* Кнопки */
    .btn-primary, .btn-secondary {
        padding: 12px 24px;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: var(--transition);
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, var(--primary-color), #2980b9);
        color: white;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(52, 152, 219, 0.4);
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--light-text);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }
    
    /* Карточки и блоки */
    .module-card {
        background: var(--darker-bg);
        border-radius: var(--border-radius);
        padding: 25px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: var(--transition);
    }
    
    .module-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--box-shadow);
    }
    
    /* Цитаты */
    .quote-box {
        background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(142, 68, 173, 0.15));
        border-left: 4px solid #9b59b6;
        padding: 20px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        margin: 20px 0;
        position: relative;
    }
    
    .quote-box::before {
        content: "❝";
        font-size: 3rem;
        color: #9b59b6;
        opacity: 0.3;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    
    .quote-author {
        text-align: right;
        font-style: italic;
        color: var(--gray-text);
        margin-top: 10px;
    }
    
    /* Определения */
    .definition-box {
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(41, 128, 185, 0.15));
        border-left: 4px solid var(--primary-color);
        padding: 20px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        margin: 20px 0;
    }
    
    /* Источники */
    .source-box {
        background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(39, 174, 96, 0.15));
        border-left: 4px solid var(--secondary-color);
        padding: 15px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        margin: 20px 0;
        font-size: 0.9rem;
    }
    
    /* Практические советы */
    .practical-tip {
        background: linear-gradient(135deg, rgba(243, 156, 18, 0.15), rgba(230, 126, 34, 0.15));
        border-left: 4px solid var(--warning-color);
        padding: 20px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
        margin: 20px 0;
    }
    
    /* Задания */
    .assignment {
        background: linear-gradient(135deg, rgba(41, 128, 185, 0.1), rgba(52, 152, 219, 0.1));
        border-radius: var(--border-radius);
        padding: 25px;
        margin: 25px 0;
        border: 1px solid rgba(52, 152, 219, 0.3);
    }
    
    .assignment h4 {
        color: var(--primary-color);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Текстовые поля */
    textarea {
        width: 100%;
        padding: 15px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
        color: var(--light-text);
        font-size: 1rem;
        resize: vertical;
        min-height: 120px;
        font-family: inherit;
        transition: var(--transition);
    }
    
    textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    /* Фидбэк */
    .feedback {
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        display: none;
    }
    
    .feedback.correct {
        background: rgba(46, 204, 113, 0.15);
        border-left: 4px solid var(--secondary-color);
        color: #2ecc71;
    }
    
    .feedback.incorrect {
        background: rgba(231, 76, 60, 0.15);
        border-left: 4px solid var(--danger-color);
        color: #e74c3c;
    }
    
    /* Тесты */
    .test-question {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 20px;
        margin: 15px 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .test-option {
        padding: 12px 15px;
        margin: 8px 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .test-option:hover {
        background: rgba(52, 152, 219, 0.1);
        border-color: var(--primary-color);
    }
    
    .test-option input[type="radio"] {
        margin-right: 10px;
    }
    
    /* Статистика */
    .exam-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 25px 0;
    }
    
    .exam-stat {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 20px;
        text-align: center;
        transition: var(--transition);
    }
    
    .exam-stat:hover {
        transform: translateY(-5px);
        background: rgba(52, 152, 219, 0.1);
    }
    
    .exam-stat strong {
        display: block;
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 5px;
    }
    
    /* Автосохранение */
    .draft-saved {
        border-color: var(--secondary-color) !important;
        background: rgba(46, 204, 113, 0.05) !important;
    }
    
    .auto-saving {
        border-color: var(--warning-color) !important;
        background: rgba(243, 156, 18, 0.05) !important;
    }
    
    .auto-save-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 12px 24px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        animation: slideInUp 0.3s ease;
    }
    
    /* Модальные окна */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal {
        background: var(--darker-bg);
        border-radius: var(--border-radius);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--box-shadow);
        animation: modalFadeIn 0.3s ease;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    /* Вкладки */
    .tabs {
        display: flex;
        gap: 5px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 5px;
        margin-bottom: 20px;
    }
    
    .tab {
        flex: 1;
        text-align: center;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .tab.active {
        background: rgba(52, 152, 219, 0.2);
        color: var(--primary-color);
        font-weight: bold;
    }
    
    /* Прогресс бар */
    .progress-container {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin: 20px 0;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    /* Сертификат */
    .certificate {
        background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
        border: 20px solid #f8d7da;
        padding: 40px;
        border-radius: 20px;
        color: #333333;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .certificate-border {
        border: 2px solid #e74c3c;
        padding: 30px;
        position: relative;
    }
    
    .certificate-name {
        font-size: 2.5rem;
        font-weight: bold;
        color: #2c3e50;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background: linear-gradient(135deg, transparent 0%, rgba(52, 152, 219, 0.1) 100%);
        border-radius: 10px;
    }
    
    /* Анимации */
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
    
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .container {
            padding: 0 15px;
        }
        
        .module-card {
            padding: 20px;
        }
        
        .exam-stats {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .certificate {
            padding: 20px;
            border-width: 10px;
        }
        
        .certificate-name {
            font-size: 1.8rem;
        }
        
        .tabs {
            flex-wrap: wrap;
        }
        
        .tab {
            flex: 1 0 calc(50% - 10px);
        }
    }
    
    @media (max-width: 480px) {
        .exam-stats {
            grid-template-columns: 1fr;
        }
        
        .btn-primary, .btn-secondary {
            padding: 10px 16px;
            font-size: 0.9rem;
        }
        
        .tab {
            flex: 1 0 100%;
        }
    }
    
    /* Сноски и примечания */
    .footnote {
        font-size: 0.85rem;
        color: var(--gray-text);
        margin-top: 10px;
        padding-left: 15px;
        border-left: 2px solid var(--warning-color);
    }
    
    .highlight {
        background: rgba(243, 156, 18, 0.2);
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
    }
    
    .key-term {
        color: var(--primary-color);
        font-weight: bold;
        border-bottom: 1px dotted var(--primary-color);
        cursor: help;
    }
    
    /* Списки */
    .enhanced-list {
        margin: 15px 0;
        padding-left: 25px;
    }
    
    .enhanced-list li {
        margin: 8px 0;
        position: relative;
    }
    
    .enhanced-list li::before {
        content: "✓";
        color: var(--secondary-color);
        position: absolute;
        left: -25px;
        font-weight: bold;
    }
    
    /* Бейджи */
    .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0 5px;
    }
    
    .badge-primary {
        background: rgba(52, 152, 219, 0.2);
        color: var(--primary-color);
    }
    
    .badge-success {
        background: rgba(46, 204, 113, 0.2);
        color: var(--secondary-color);
    }
    
    .badge-warning {
        background: rgba(243, 156, 18, 0.2);
        color: var(--warning-color);
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
        // Сначала инициализируем Supabase
        const supabaseInitialized = initSupabase();
        
        if (supabase && supabaseInitialized) {
            console.log('🔄 Проверка сессии...');
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.error("❌ Ошибка получения сессии:", sessionError);
                await loadGuestProgress();
                renderModulesList();
                showWelcomeScreen();
                return;
            }
            
            if (session) {
                currentUserId = session.user.id;
                isAuthenticated = true;
                console.log("✅ Пользователь авторизован:", session.user.email);
                
                try {
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
                    
                } catch (loadError) {
                    console.error("❌ Ошибка загрузки данных:", loadError);
                    showMessage('error', 'Ошибка загрузки данных. Попробуйте обновить страницу.');
                    await loadGuestProgress();
                    renderModulesList();
                    showWelcomeScreen();
                }
                
            } else {
                console.log("👤 Гостевой режим - сессия отсутствует");
                await loadGuestProgress();
                renderModulesList();
                showWelcomeScreen();
            }
        } else {
            console.log("🔄 Работа в гостевом режиме (Supabase не настроен)");
            await loadGuestProgress();
            renderModulesList();
            showWelcomeScreen();
        }
        
    } catch (error) {
        console.error("❌ Критическая ошибка инициализации:", error);
        await loadGuestProgress();
        renderModulesList();
        showWelcomeScreen();
        showMessage('error', 'Ошибка инициализации приложения');
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

function updateUserUI(user) {
    if (!user) return;
    
    const userNameElements = document.querySelectorAll('#userName');
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Пользователь';
    
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = displayName;
        }
    });
    
    // Обновляем кнопки авторизации
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        if (isAuthenticated) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <button class="btn-secondary" style="position: relative;">
                        <i class="fas fa-user-circle"></i> ${displayName}
                    </button>
                    <div class="user-menu-content">
                        <a href="#" class="user-menu-item" onclick="event.preventDefault(); showProfile()">
                            <i class="fas fa-user"></i> Профиль
                        </a>
                        <a href="#" class="user-menu-item" onclick="event.preventDefault(); handleLogout()">
                            <i class="fas fa-sign-out-alt"></i> Выйти
                        </a>
                    </div>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="btn-primary" onclick="showAuthModal()">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </button>
            `;
        }
    }
    
    console.log('✅ UI пользователя обновлено:', displayName);
}

function showProfile() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Профиль пользователя';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3498db, #2ecc71); 
                     border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fas fa-user" style="font-size: 2rem; color: white;"></i>
                </div>
                <h3>${userProgress.userName}</h3>
                <p style="color: var(--gray-text);">${isAuthenticated ? '✅ Авторизован' : '👤 Гость'}</p>
            </div>
            
            <div class="module-card" style="margin-bottom: 15px;">
                <h4><i class="fas fa-chart-line"></i> Статистика прогресса</h4>
                <p><strong>Завершено модулей:</strong> ${userProgress.completedModules.length} из ${courseData.modules.length}</p>
                <p><strong>Завершено подмодулей:</strong> ${userProgress.completedSubmodules.length}</p>
                <p><strong>Итоговый экзамен:</strong> ${userProgress.finalExamCompleted ? `✅ ${userProgress.finalExamScore} баллов` : '❌ Не пройден'}</p>
            </div>
            
            ${isAuthenticated ? `
                <div class="module-card">
                    <h4><i class="fas fa-cog"></i> Настройки</h4>
                    <div style="margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <input type="checkbox" id="autoSaveToggle" ${uiState.settings.autoSave ? 'checked' : ''} onchange="toggleAutoSave(this.checked)">
                            <span>Автосохранение</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <input type="checkbox" id="notificationsToggle" ${uiState.settings.notifications ? 'checked' : ''} onchange="toggleNotifications(this.checked)">
                            <span>Уведомления</span>
                        </label>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
}

function toggleAutoSave(enabled) {
    uiState.settings.autoSave = enabled;
    saveUIState();
    showMessage('success', `Автосохранение ${enabled ? 'включено' : 'выключено'}`);
}

function toggleNotifications(enabled) {
    uiState.settings.notifications = enabled;
    saveUIState();
    showMessage('success', `Уведомления ${enabled ? 'включены' : 'выключены'}`);
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
                showMessage('info', 'Вы вышли из системы');
                setTimeout(() => location.reload(), 1000);
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
    if (!uiState.settings.autoSave) return;
    
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

function showMessage(type, message) {
    const existing = document.querySelector('.system-message');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `system-message ${type}`;
    
    let icon = 'fa-info-circle';
    let bgColor = '#3498db';
    
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            bgColor = '#2ecc71';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            bgColor = '#e74c3c';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            bgColor = '#f39c12';
            break;
        case 'info':
            icon = 'fa-info-circle';
            bgColor = '#3498db';
            break;
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${bgColor}99;
    `;
    
    notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ========== ФУНКЦИИ АУТЕНТИФИКАЦИИ ==========

function showAuthModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Вход в систему';
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3498db, #2ecc71); 
                     border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fas fa-hands-helping" style="font-size: 1.5rem; color: white;"></i>
                </div>
                <h3 style="color: var(--primary-color);">Добро пожаловать!</h3>
                <p style="color: var(--gray-text);">Войдите, чтобы сохранять прогресс на всех устройствах.</p>
            </div>
            
            <div id="authContainer">
                <div class="tabs" style="margin-bottom: 20px;">
                    <div class="tab active" onclick="showAuthTab('login')">
                        Вход
                    </div>
                    <div class="tab" onclick="showAuthTab('register')">
                        Регистрация
                    </div>
                </div>
                
                <div id="loginTab">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--light-text);">Email</label>
                        <input type="email" id="loginEmail" placeholder="ваш@email.com" 
                               style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--light-text);">Пароль</label>
                        <input type="password" id="loginPassword" placeholder="Ваш пароль" 
                               style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white;">
                    </div>
                    <button onclick="handleLogin()" class="btn-primary" style="width: 100%; padding: 14px;">
                        <i class="fas fa-sign-in-alt"></i> Войти
                    </button>
                </div>
                
                <div id="registerTab" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--light-text);">Имя для сертификата</label>
                        <input type="text" id="registerName" placeholder="Иван Иванов" 
                               style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--light-text);">Email</label>
                        <input type="email" id="registerEmail" placeholder="ваш@email.com" 
                               style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--light-text);">Пароль</label>
                        <input type="password" id="registerPassword" placeholder="Не менее 6 символов" 
                               style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white;">
                    </div>
                    <button onclick="handleRegister()" class="btn-primary" style="width: 100%; padding: 14px;">
                        <i class="fas fa-user-plus"></i> Зарегистрироваться
                    </button>
                </div>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button onclick="continueAsGuest()" class="btn-secondary" style="width: 100%; padding: 12px; margin-bottom: 10px;">
                        Продолжить как гость
                    </button>
                    <p style="text-align: center; font-size: 0.85rem; color: var(--gray-text);">
                        <i class="fas fa-info-circle"></i> В гостевом режиме прогресс сохраняется только в этом браузере
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
        showMessage('error', 'Заполните все поля');
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
        showMessage('error', error.message || 'Ошибка входа. Проверьте email и пароль.');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showMessage('error', 'Заполните все поля');
        return;
    }
    
    if (password.length < 6) {
        showMessage('error', 'Пароль должен содержать минимум 6 символов');
        return;
    }
    
    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', 'Введите корректный email');
        return;
    }
    
    // Проверяем наличие Supabase
    if (!supabase) {
        showMessage('error', '❌ Supabase не настроен. Обратитесь к администратору.');
        console.error('❌ Supabase не инициализирован.');
        return;
    }
    
    try {
        showMessage('info', '⏳ Регистрация...');
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    name: name
                },
                emailRedirectTo: window.location.origin
            }
        });
        
        if (authError) {
            // Проверка на уже существующий email
            if (authError.message.includes('already registered')) {
                throw new Error('Этот email уже зарегистрирован. Попробуйте войти.');
            }
            throw authError;
        }
        
        if (authData.user) {
            console.log('✅ Пользователь создан в Auth:', authData.user.id);
            
            // Создаем запись пользователя в таблице users
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
                        },
                        created_at: new Date().toISOString(),
                        last_active: new Date().toISOString()
                    }
                ]);
            
            if (userError && userError.code !== '23505') { // 23505 = duplicate key
                console.error('Ошибка создания пользователя:', userError);
                throw userError;
            }
            
            console.log('✅ Запись пользователя создана');
            
            // Добавляем пользователя в allowed_users
            try {
                const { error: allowedError } = await supabase
                    .from('allowed_users')
                    .insert([
                        {
                            telegram_id: null,
                            user_id: authData.user.id,
                            added_by: null,
                            added_at: new Date().toISOString()
                        }
                    ]);
                
                if (allowedError && allowedError.code !== '23505') {
                    console.warn('Ошибка добавления в allowed_users:', allowedError);
                }
            } catch (err) {
                console.warn('Не удалось добавить в allowed_users:', err);
            }
        }
        
        document.getElementById('modalOverlay').style.display = 'none';
        
        // Проверяем нужно ли подтверждение email
        if (authData.user && !authData.user.confirmed_at) {
            showMessage('success', '✅ Регистрация успешна! Проверьте почту и подтвердите email, затем войдите.');
        } else {
            showMessage('success', '✅ Регистрация успешна! Входим...');
            setTimeout(() => location.reload(), 1500);
        }
        
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        showMessage('error', error.message || 'Ошибка регистрации. Попробуйте еще раз.');
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
        
        showMessage('success', 'Вы вышли из системы');
        setTimeout(() => location.reload(), 1000);
        
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showMessage('error', 'Ошибка выхода');
    }
}

function showAuthTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.tab[onclick*="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
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
        moduleItem.className = `module-card ${userProgress.currentModule === module.id ? 'active' : ''}`;
        
        const completedIcon = userProgress.completedModules.includes(module.id) ? 
            '<i class="fas fa-check-circle" style="color: var(--secondary-color); margin-right: 8px;"></i>' : 
            '<i class="far fa-circle" style="color: var(--gray-text); margin-right: 8px;"></i>';
        
        moduleItem.innerHTML = `
            <h3>${completedIcon} ${module.title}</h3>
            <p>${module.description}</p>
            ${module.completed ? '<span class="badge badge-success" style="margin-top: 10px;">✓ Завершен</span>' : ''}
        `;
        
        moduleItem.addEventListener('click', () => {
            document.querySelectorAll('.module-card').forEach(item => {
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
                    '<i class="fas fa-check" style="color: var(--secondary-color); margin-right: 8px; font-size: 0.8rem;"></i>' : 
                    '<i class="far fa-circle" style="color: var(--gray-text); margin-right: 8px; font-size: 0.8rem;"></i>';
                
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
    
    // Улучшаем форматирование контента
    content = content
        .replace(/<h3>/g, '<h3 class="module-heading">')
        .replace(/<h4>/g, '<h4 class="sub-heading">')
        .replace(/<p>/g, '<p class="text-paragraph">')
        .replace(/<ul>/g, '<ul class="enhanced-list">')
        .replace(/<ol>/g, '<ol class="enhanced-list">')
        .replace(/class="quote"/g, 'class="quote-box"')
        .replace(/class="author"/g, 'class="quote-author"')
        .replace(/class="source"/g, 'class="source-box"')
        .replace(/class="definition"/g, 'class="definition-box"')
        .replace(/class="practical-tip"/g, 'class="practical-tip"');
    
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
                
                answerElement.style.borderColor = 'var(--secondary-color)';
                answerElement.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
                
                const assignmentHeader = answerElement.closest('.assignment')?.querySelector('h4');
                if (assignmentHeader && !assignmentHeader.querySelector('.fa-check-circle')) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check-circle';
                    checkIcon.style.color = 'var(--secondary-color)';
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
            answerElement.style.borderColor = 'var(--danger-color)';
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
            textarea.style.borderColor = 'var(--danger-color)';
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
            textarea.style.borderColor = 'var(--secondary-color)';
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
            textarea.style.borderColor = 'var(--secondary-color)';
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
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--secondary-color), #27ae60); 
                         border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="fas fa-trophy" style="font-size: 2rem; color: white;"></i>
                    </div>
                    <h3 style="color: var(--secondary-color); margin-bottom: 10px;">Поздравляем!</h3>
                    <p>Вы успешно завершили модуль:</p>
                    <p style="font-size: 1.2rem; font-weight: bold; margin: 15px 0; color: var(--light-text);">«${module.title}»</p>
                    <p>Теперь вы можете пройти контрольную работу модуля.</p>
                    <div style="margin-top: 25px;">
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
                <h3 style="color: var(--primary-color);">${module.test.title}</h3>
                <p style="color: var(--gray-text);">${module.test.description}</p>
            </div>
            
            <div class="exam-stats">
                <div class="exam-stat">
                    <strong>${module.test.sections ? module.test.sections[0].questions.length : 0}</strong>
                    <span>теоретических вопросов</span>
                </div>
                <div class="exam-stat">
                    <strong>${module.test.timeLimit || 30}</strong>
                    <span>минут на выполнение</span>
                </div>
                <div class="exam-stat">
                    <strong>${module.test.passingScore || 35}</strong>
                    <span>проходной балл</span>
                </div>
                <div class="exam-stat">
                    <strong>${module.test.totalPoints || 50}</strong>
                    <span>баллов всего</span>
                </div>
            </div>
            
            <div class="module-card" style="margin: 25px 0;">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">Структура работы:</h4>
                <ul class="enhanced-list" style="color: var(--light-text);">
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
                <h3 style="color: ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'};">${result.passed ? '✅ Тест пройден' : '❌ Тест не пройден'}</h3>
                <p style="color: var(--gray-text);">Модуль: <strong style="color: var(--light-text);">${module.title}</strong></p>
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
            
            <div class="module-card" style="background: ${result.passed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'}; 
                     border-left: 4px solid ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'}">
                <h4 style="color: ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'}; margin-top: 0;">Итоговый результат</h4>
                <div style="font-size: 2em; font-weight: bold; color: ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'}">
                    ${result.totalPoints || 0}/${result.maxPoints || 0} баллов
                </div>
                <p style="margin-top: 10px; color: var(--gray-text);">
                    Проходной балл: ${module.test.passingScore || 35}
                </p>
            </div>
            
            ${!result.passed ? `
                <div class="module-card" style="margin-top: 20px; background: rgba(231, 76, 60, 0.1); border-left: 4px solid var(--danger-color);">
                    <h4 style="color: var(--danger-color); margin-bottom: 10px;">Рекомендации:</h4>
                    <ul class="enhanced-list" style="color: var(--light-text);">
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
                                        <input type="text" placeholder="Ваш ответ" id="situation${taskIndex}_${i}" 
                                               style="width: 100%; padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;">
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
                            <textarea id="scenario${taskIndex}" placeholder="Напишите ваш ответ..." rows="5" 
                                      style="width: 100%; margin-top: 10px;"></textarea>
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
        <button class="btn-primary" id="submitTestBtn" onclick="submitTest()" style="padding: 15px 40px; font-size: 1.1rem;">
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
                <h3 style="color: ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'}; font-size: 1.8rem;">
                    ${result.passed ? '✅ Поздравляем!' : '❌ Попробуйте еще'}
                </h3>
                <p style="color: var(--gray-text);">Модуль: <strong style="color: var(--light-text);">${module.title}</strong></p>
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
            
            <div class="module-card" style="background: linear-gradient(135deg, ${result.passed ? 'var(--secondary-color)' : 'var(--danger-color)'} 0%, ${result.passed ? '#27ae60' : '#c0392b'} 100%); 
                     color: white; text-align: center; margin: 20px 0; border: none;">
                <h2 style="margin: 0; font-size: 2.5rem;">${result.totalPoints}/${result.maxPoints}</h2>
                <p style="margin: 10px 0 0 0; font-size: 1.1rem;">
                    ${result.passed ? 'Вы успешно прошли контрольную работу!' : `Необходимо набрать ${module.test.passingScore} баллов`}
                </p>
            </div>
            
            ${!result.passed ? `
                <div class="module-card" style="margin-top: 20px; background: rgba(231, 76, 60, 0.1); border-left: 4px solid var(--danger-color);">
                    <h4 style="color: var(--danger-color); margin-bottom: 10px;">Рекомендации:</h4>
                    <ul class="enhanced-list" style="color: var(--light-text);">
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
        <h4><i class="fas fa-info-circle" style="color: var(--primary-color); margin-right: 10px;"></i>Инструкция к итоговому экзамену</h4>
        <p>Итоговый экзамен проверяет ваши знания по всем 5 модулям курса.</p>
        <p><strong>Время выполнения:</strong> ${exam.timeLimit} минут</p>
        <p><strong>Структура экзамена:</strong></p>
        <ol class="enhanced-list">
            <li>Теоретическая часть (${exam.sections[0].questions.length} вопросов) — ${exam.scoring.theory}</li>
            <li>Практическая часть (${exam.sections[1].tasks.length} заданий) — ${exam.scoring.practical}</li>
            <li>Ситуационный анализ (${exam.sections[2].tasks.length} кейс) — ${exam.scoring.caseStudy}</li>
        </ol>
        <p><strong>Оценка:</strong> ${exam.scoring.passing} (${Math.round(parseInt(exam.scoring.passing) / parseInt(exam.scoring.total) * 100)}%)</p>
        <p style="color: var(--primary-color); font-weight: bold; margin-top: 15px;"><i class="fas fa-star"></i> Удачи!</p>
    `;
    examContent.appendChild(instruction);
    
    const theorySection = document.createElement('div');
    theorySection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: var(--light-text);">Теоретическая часть</h3>`;
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
    practicalSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: var(--light-text);">Практическая часть</h3>`;
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
                <textarea id="practicalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="6" 
                          style="width: 100%; margin-top: 10px;"></textarea>
            `;
        } else {
            taskContent = `
                <h4>Задание ${index + 1}: ${task.task}</h4>
                <p><strong>Требования:</strong> ${task.requirements}</p>
                <p><strong>Максимальный балл:</strong> ${task.maxPoints}</p>
                <textarea id="practicalExam${index}" placeholder="Напишите ваш ответ здесь..." rows="6" 
                          style="width: 100%; margin-top: 10px;"></textarea>
            `;
        }
        
        taskDiv.innerHTML = taskContent;
        examContent.appendChild(taskDiv);
    });
    
    const caseSection = document.createElement('div');
    caseSection.innerHTML = `<h3 style="margin: 30px 0 20px 0; color: var(--light-text);">Ситуационный анализ</h3>`;
    examContent.appendChild(caseSection);
    
    exam.sections[2].tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'test-question';
        
        taskDiv.innerHTML = `
            <h4>Кейс ${index + 1}: ${task.situation}</h4>
            <p><strong>Вопросы для анализа:</strong></p>
            <ol class="enhanced-list" style="margin-bottom: 20px;">
                ${task.questions.map((q, i) => `<li>${q}</li>`).join('')}
            </ol>
            <textarea id="caseExam${index}" placeholder="Напишите ваш анализ здесь..." rows="8" 
                      style="width: 100%; margin-top: 10px;"></textarea>
        `;
        examContent.appendChild(taskDiv);
    });
    
    const submitBtn = document.createElement('div');
    submitBtn.style.marginTop = '30px';
    submitBtn.style.textAlign = 'center';
    submitBtn.innerHTML = `
        <button class="btn-primary" onclick="submitFinalExam()" style="padding: 15px 40px; font-size: 1.1rem;">
            <i class="fas fa-paper-plane"></i> Отправить экзамен на проверку
        </button>
    `;
    examContent.appendChild(submitBtn);
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
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${passed ? 'var(--secondary-color)' : 'var(--danger-color)'}, ${passed ? '#27ae60' : '#c0392b'}); 
                     border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas ${passed ? 'fa-trophy' : 'fa-redo'}" style="font-size: 2rem; color: white;"></i>
                </div>
                <h3 style="color: ${passed ? 'var(--secondary-color)' : 'var(--danger-color)'}; font-size: 1.8rem;">
                    ${passed ? '🎉 Поздравляем!' : '😔 Попробуйте еще раз'}
                </h3>
                <p style="font-size: 1.2rem; margin: 10px 0; color: var(--light-text);">Итоговая оценка: <strong style="color: ${passed ? 'var(--secondary-color)' : 'var(--danger-color)'}">${grade} (${gradeText})</strong></p>
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
            
            <div class="module-card" style="background: linear-gradient(135deg, ${passed ? 'var(--secondary-color)' : 'var(--danger-color)'} 0%, ${passed ? '#27ae60' : '#c0392b'} 100%); 
                     color: white; text-align: center; margin: 20px 0; border: none;">
                <h2 style="margin: 0; font-size: 2.5rem;">${totalScore}/${maxScore}</h2>
                <p style="margin: 10px 0 0 0; font-size: 1.1rem;">
                    ${passed ? 'Вы успешно прошли итоговый экзамен!' : `Необходимо набрать ${passingScore} баллов`}
                </p>
            </div>
            
            ${passed ? `
                <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 1.1rem; margin-bottom: 20px; color: var(--light-text);">Теперь вы можете получить сертификат об окончании курса!</p>
                    <button class="btn-primary" onclick="showCertificate(); document.getElementById('modalOverlay').style.display='none';" style="font-size: 1.1rem; padding: 15px 30px;">
                        <i class="fas fa-award"></i> Получить сертификат
                    </button>
                </div>
            ` : `
                <div class="module-card" style="margin-top: 20px; background: rgba(231, 76, 60, 0.1); border-left: 4px solid var(--danger-color);">
                    <h4 style="color: var(--danger-color); margin-bottom: 15px;">Рекомендации для улучшения результата:</h4>
                    <ul class="enhanced-list" style="color: var(--light-text);">
                        <li>Повторите теорию всех модулей</li>
                        <li>Отработайте практические задания</li>
                        <li>Обратите внимание на объяснения к вопросам</li>
                        <li>Попробуйте пройти экзамен через 2-3 дня</li>
                        <li>Используйте конспекты и ключевые термины</li>
                    </ul>
                    <p style="margin-top: 15px; color: var(--warning-color);">
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
            <div style="text-align: center; padding: 40px 20px;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); 
                     border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                    <i class="fas fa-hands-helping" style="font-size: 3rem; color: white;"></i>
                </div>
                <h1 style="color: var(--primary-color); margin-bottom: 15px;">Полный курс: «Эмпатия и поддержка в общении»</h1>
                <p style="font-size: 1.1rem; color: var(--gray-text); max-width: 700px; margin: 0 auto 40px;">
                    Развивайте эмоциональный интеллект, учитесь слушать и поддерживать других. 
                    Практический курс для всех, кто хочет улучшить качество общения.
                </p>
                
                <div class="exam-stats" style="margin: 40px 0;">
                    <div class="exam-stat">
                        <strong>5</strong>
                        <span>модулей</span>
                    </div>
                    <div class="exam-stat">
                        <strong>15+</strong>
                        <span>практических заданий</span>
                    </div>
                    <div class="exam-stat">
                        <strong>5</strong>
                        <span>контрольных работ</span>
                    </div>
                    <div class="exam-stat">
                        <strong>1</strong>
                        <span>итоговый экзамен</span>
                    </div>
                </div>
                
                <div class="module-card" style="max-width: 800px; margin: 0 auto 30px;">
                    <h3><i class="fas fa-list-ol" style="color: var(--primary-color); margin-right: 10px;"></i>Структура курса</h3>
                    <p>Каждый модуль содержит:</p>
                    <ul class="enhanced-list" style="margin: 15px 0;">
                        <li>Теоретический материал с примерами</li>
                        <li>Практические задания с проверкой</li>
                        <li>Контрольную работу по модулю</li>
                        <li>Дополнительные материалы для углубления</li>
                    </ul>
                    <p style="margin-top: 15px; color: var(--gray-text);">
                        <i class="fas fa-certificate" style="color: var(--warning-color);"></i>
                        После завершения всех модулей вас ждет итоговый экзамен и сертификат!
                    </p>
                </div>
                
                <div style="margin-top: 40px;">
                    <button onclick="openModule(1, '1.1')" class="btn-primary" style="padding: 18px 40px; font-size: 1.2rem;">
                        <i class="fas fa-play-circle"></i> Начать обучение
                    </button>
                    <p style="margin-top: 20px; color: var(--gray-text);">
                        ${isAuthenticated ? '✅ Ваш прогресс сохраняется автоматически' : '👤 Работаете как гость? <a href="#" onclick="showAuthModal()" style="color: var(--primary-color);">Войдите</a>, чтобы сохранять прогресс на всех устройствах.'}
                    </p>
                </div>
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
    certificateModal.className = 'modal-overlay';
    certificateModal.id = 'certificateModal';
    
    const exam = courseData.finalExam;
    const gradeInfo = userProgress.finalExamGrade ? exam.scoring.gradingScale[userProgress.finalExamGrade] || "Успешно завершено" : "Успешно завершено";
    
    certificateModal.innerHTML = `
        <div class="modal" style="max-width: 900px;">
            <div class="modal-header">
                <h3 style="margin: 0;">🎓 Ваш сертификат об окончании курса</h3>
                <button class="btn-secondary" onclick="document.getElementById('certificateModal').remove()" style="padding: 8px 12px;">
                    &times;
                </button>
            </div>
            <div class="modal-body">
                <div class="certificate-container">
                    <div class="certificate">
                        <div class="certificate-border">
                            <div class="certificate-header" style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #e74c3c; font-size: 2.5rem; margin-bottom: 10px;">СЕРТИФИКАТ</h1>
                                <p style="color: #7f8c8d; font-size: 1.2rem;">о прохождении курса</p>
                            </div>
                            
                            <div class="certificate-body" style="text-align: center;">
                                <h2 style="color: #2c3e50; font-size: 1.8rem; margin-bottom: 30px;">«Эмпатия и поддержка в общении»</h2>
                                
                                <div style="margin: 30px 0;">
                                    <i class="fas fa-award" style="font-size: 3rem; color: #f39c12;"></i>
                                </div>
                                
                                <div style="font-size: 1.1rem; color: #7f8c8d; margin-bottom: 20px;">
                                    Настоящим удостоверяется, что
                                </div>
                                
                                <div class="certificate-name">
                                    ${userProgress.userName || "Ученик"}
                                </div>
                                
                                <div style="font-size: 1.1rem; color: #7f8c8d; margin: 30px 0; line-height: 1.6;">
                                    успешно завершил(а) полный курс обучения, состоящий из 5 модулей,<br>
                                    и проявил(а) высокий уровень компетенций в области эмпатии и поддержки.
                                </div>
                                
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0;">
                                    <div style="text-align: left;">
                                        <strong style="color: #2c3e50;">Дата выдачи</strong>
                                        <p style="color: #7f8c8d; margin-top: 5px;">${new Date().toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div style="text-align: left;">
                                        <strong style="color: #2c3e50;">Итоговая оценка</strong>
                                        <p style="color: #7f8c8d; margin-top: 5px;">${gradeInfo}</p>
                                    </div>
                                    <div style="text-align: left;">
                                        <strong style="color: #2c3e50;">Результат экзамена</strong>
                                        <p style="color: #7f8c8d; margin-top: 5px;">${userProgress.finalExamScore} баллов из ${exam.scoring.total}</p>
                                    </div>
                                    <div style="text-align: left;">
                                        <strong style="color: #2c3e50;">ID сертификата</strong>
                                        <p style="color: #7f8c8d; margin-top: 5px;">EMP-${Date.now().toString().slice(-8)}</p>
                                    </div>
                                </div>
                                
                                <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                                    <h4 style="color: #2c3e50; margin-bottom: 15px;">Пройденные модули:</h4>
                                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                                        ${courseData.modules.map(module => `
                                            <span style="background: #e8f4fc; color: #2c3e50; padding: 8px 15px; border-radius: 20px; font-size: 0.9rem;">
                                                ${module.title.split('.')[1]}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
                                <div style="text-align: left;">
                                    <div style="width: 200px; height: 1px; background: #333; margin-bottom: 5px;"></div>
                                    <p style="color: #7f8c8d; font-size: 0.9rem; margin: 0;">Директор курса</p>
                                    <p style="color: #7f8c8d; font-size: 0.9rem; margin: 0;">Д-р псих. наук</p>
                                </div>
                                
                                <div style="text-align: center;">
                                    <div style="display: flex; align-items: center; gap: 10px; color: #e74c3c; font-weight: bold;">
                                        <i class="fas fa-heart"></i>
                                        <span>Курс Эмпатии</span>
                                    </div>
                                </div>
                                
                                <div style="text-align: right;">
                                    <div style="width: 150px; height: 100px; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-family="Arial" font-size="10" fill="%23999" text-anchor="middle">Печать</text></svg>') no-repeat center; opacity: 0.3;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                <button class="btn-primary" onclick="printCertificate()" style="margin-right: 10px;">
                    <i class="fas fa-print"></i> Распечатать
                </button>
                <button class="btn-secondary" onclick="saveCertificateAsImage()">
                    <i class="fas fa-download"></i> Сохранить
                </button>
                ${navigator.share ? `
                    <button class="btn-secondary" onclick="shareCertificate()" style="margin-left: 10px;">
                        <i class="fas fa-share-alt"></i> Поделиться
                    </button>
                ` : ''}
            </div>
            
            <div style="padding: 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
                <p style="color: var(--gray-text); font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> Сертификат можно проверить по ID: EMP-${Date.now().toString().slice(-8)}
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(certificateModal);
}

function printCertificate() {
    const certificateElement = document.querySelector('.certificate');
    if (certificateElement) {
        const originalContent = document.body.innerHTML;
        const certificateContent = certificateElement.outerHTML;
        
        document.body.innerHTML = `
            <!DOCTYPE html>
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
                                max-width: 800px;
                                margin: 0 auto;
                            }
                            .certificate-actions { display: none !important; }
                            .certificate-note { display: none !important; }
                        }
                        body { 
                            font-family: 'Times New Roman', Times, serif;
                            margin: 0;
                            padding: 40px;
                            background: #f5f5f5;
                        }
                        .certificate { 
                            background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
                            border: 20px solid #f8d7da;
                            padding: 40px;
                            border-radius: 20px;
                            color: #333333;
                            max-width: 800px;
                            margin: 0 auto;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        }
                        .certificate-border {
                            border: 2px solid #e74c3c;
                            padding: 30px;
                            position: relative;
                        }
                        .certificate-name {
                            font-size: 2.5rem;
                            font-weight: bold;
                            color: #2c3e50;
                            text-align: center;
                            margin: 20px 0;
                            padding: 10px;
                        }
                        h1, h2, h3, h4 {
                            color: #2c3e50;
                        }
                    </style>
                </head>
                <body>
                    ${certificateContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        };
                    <\/script>
                </body>
            </html>
        `;
        
        window.print();
    }
}

function saveCertificateAsImage() {
    alert('Для сохранения сертификата как изображения:\n\n1. Нажмите "Распечатать"\n2. В диалоге печати выберите "Сохранить как PDF"\n\nИли сделайте скриншот сертификата (Ctrl+Shift+S в Windows/Linux, Cmd+Shift+4 в Mac)');
}

function shareCertificate() {
    if (navigator.share) {
        navigator.share({
            title: `Мой сертификат по курсу эмпатии - ${userProgress.userName}`,
            text: `Я завершил(а) курс "Эмпатия и поддержка в общении" с результатом ${userProgress.finalExamScore} баллов!`,
            url: window.location.href
        });
    } else {
        const shareText = `Я завершил(а) курс "Эмпатия и поддержка в общении"!\nРезультат: ${userProgress.finalExamScore} баллов, оценка: ${userProgress.finalExamGrade}.\n\nID сертификата: EMP-${Date.now().toString().slice(-8)}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('success', 'Текст сертификата скопирован в буфер обмена!');
        }).catch(() => {
            prompt('Скопируйте текст для публикации:', shareText);
        });
    }
}

function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?\n\nЭто действие удалит:\n• Все завершенные модули\n• Результаты тестов\n• Результат итогового экзамена\n• Все черновики ответов\n\nЭто действие нельзя отменить.")) {
        userProgress = getDefaultProgress();
        
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        localStorage.removeItem('empathyCourseProgress');
        localStorage.removeItem('guestAnswerDrafts');
        
        if (isAuthenticated && currentUserId) {
            // Очищаем черновики в базе данных
            supabase.from('answer_drafts').delete().eq('user_id', currentUserId);
            // Сбрасываем прогресс в базе данных
            supabase.from('users').update({
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
            }).eq('id', currentUserId);
        }
        
        location.reload();
    }
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
        } else {
            localStorage.setItem('empathyCourseProgress', JSON.stringify(userProgress));
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
window.showProfile = showProfile;

console.log("✅ Курс эмпатии загружен!");