document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпатии загружается...");

    initTheme();
    initProgress();
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    initProfileDropdown(); // Инициализируем улучшенный dropdown

    // Открываем последний сохраненный модуль
    if (userProgress.currentModule && userProgress.currentSubmodule) {
@@ -437,6 +439,82 @@ function openTest(moduleId) {
    }
}

// Улучшение работы dropdown меню профиля
function initProfileDropdown() {
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!userProfile || !profileDropdown) return;
    
    let hideTimeout;
    let showTimeout;
    let isDropdownOpen = false;
    
    function showDropdown() {
        clearTimeout(hideTimeout);
        clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            profileDropdown.style.opacity = '1';
            profileDropdown.style.visibility = 'visible';
            profileDropdown.style.transform = 'translateY(0)';
            profileDropdown.style.display = 'block';
            isDropdownOpen = true;
        }, 50); // Небольшая задержка для плавности
    }
    
    function hideDropdown() {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => {
            if (!isDropdownOpen) return;
            profileDropdown.style.opacity = '0';
            profileDropdown.style.visibility = 'hidden';
            profileDropdown.style.transform = 'translateY(-10px)';
            profileDropdown.style.display = 'none';
            isDropdownOpen = false;
        }, 300); // Задержка перед скрытием
    }
    
    // Показываем dropdown при наведении на профиль
    userProfile.addEventListener('mouseenter', showDropdown);
    
    // Показываем dropdown при наведении на сам dropdown
    profileDropdown.addEventListener('mouseenter', showDropdown);
    
    // Скрываем dropdown при уходе с профиля или dropdown
    userProfile.addEventListener('mouseleave', (e) => {
        // Проверяем, что курсор действительно ушел за пределы обоих элементов
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
    
    profileDropdown.addEventListener('mouseleave', (e) => {
        // Проверяем, что курсор действительно ушел за пределы обоих элементов
        const relatedTarget = e.relatedTarget;
        if (!profileDropdown.contains(relatedTarget) && !userProfile.contains(relatedTarget)) {
            hideDropdown();
        }
    });
    
    // Добавляем стрелку-указатель к dropdown (опционально)
    if (!profileDropdown.querySelector('.dropdown-arrow')) {
        const arrow = document.createElement('div');
        arrow.className = 'dropdown-arrow';
        arrow.style.cssText = `
            position: absolute;
            top: -8px;
            right: 15px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid white;
        `;
        profileDropdown.prepend(arrow);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка отправки теста
@@ -573,26 +651,17 @@ function resetProgress() {
    }
}

// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;

console.log("✅ Курс эмпатии загружен и готов к работе!");


// Инициализация темы
function initTheme() {
    const savedTheme = Storage.getTheme();
    const savedTheme = localStorage.getItem('empathyCourseTheme') || 'light';
    setTheme(savedTheme);

    // Настройка переключателей тем
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            Storage.saveTheme(theme);
            localStorage.setItem('empathyCourseTheme', theme);
        });

        // Активный переключатель
@@ -614,247 +683,137 @@ function setTheme(theme) {
    console.log('Тема установлена:', theme);
}

// Обновление инициализации
document.addEventListener('DOMContentLoaded', function() {
    console.log("Курс эмпатии загружается...");
    
    // Инициализация систем
    initTheme();
    Auth.init();
    initProgress();
    
    // Загрузка данных
    renderModulesList();
    updateProgressUI();
    setupEventListeners();
    
    // Открытие сохраненного модуля
    if (userProgress.currentModule && userProgress.currentSubmodule) {
        setTimeout(() => {
            openModule(userProgress.currentModule, userProgress.currentSubmodule);
        }, 100);
    }
});

// Обновленная функция сохранения прогресса
function saveProgress() {
    Storage.saveProgress(userProgress);
    updateProgressUI();
}

// Обновленная функция обновления UI прогресса
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
    
    // Управление кнопкой сертификата через Auth
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        if (percent === 100 && Auth.checkAuth()) {
            certificateBtn.classList.remove('disabled');
            certificateBtn.onclick = () => Auth.showCertificate();
        } else {
            certificateBtn.classList.add('disabled');
            certificateBtn.onclick = (e) => {
                e.preventDefault();
                if (percent === 100) {
                    Auth.showAuthPromo();
                } else {
                    alert(`Завершите все модули! Прогресс: ${percent}%`);
                }
            };
        }
    }
}

// Обновленная функция сброса прогресса
function resetProgress() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Все данные будут удалены.")) {
        userProgress = Storage.getDefaultProgress();
        
        // Сброс в данных курса
        courseData.modules.forEach(module => {
            module.completed = false;
        });
        
        Storage.saveProgress(userProgress);
        renderModulesList();
        updateProgressUI();
        
        // Показать приветственный экран
        showWelcomeScreen();
        
        alert("Прогресс сброшен. Начните курс заново.");
    }
}
// Делаем функции глобальными
window.checkAssignment = checkAssignment;
window.openModule = openModule;
window.resetProgress = resetProgress;
window.showCertificate = showCertificate;

// Обновленная функция отображения сертификата
function showCertificate() {
    Auth.showCertificate();
}
console.log("✅ Курс эмпатии загружен и готов к работе!");

// Добавьте эти стили для сертификата в ваш CSS
const certificateStyles = `
    .certificate-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .certificate {
        background: linear-gradient(135deg, #fff8e1 0%, #fff 50%, #fff8e1 100%);
        border: 20px solid #ffd54f;
        border-radius: 10px;
        padding: 40px;
// Добавляем CSS для улучшенного dropdown
const dropdownStyles = `
    .user-profile {
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .certificate-border {
        border: 2px solid #ffb300;
        padding: 30px;
        position: relative;
    }
    
    .certificate-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 3px double #ffb300;
        padding-bottom: 20px;
    }
    
    .certificate-header h1 {
        color: #d84315;
        font-size: 2.5rem;
        margin-bottom: 10px;
        letter-spacing: 3px;
    }
    
    .certificate-body {
        text-align: center;
        padding: 30px 0;
    }
    
    .certificate-body h2 {
        color: #2c3e50;
        margin-bottom: 30px;
        font-size: 1.8rem;
    }
    
    .certificate-award {
        font-size: 4rem;
        color: gold;
        margin: 20px 0;
        text-shadow: 0 0 10px rgba(255,215,0,0.5);
    }
    
    .certificate-name {
        color: #1565c0;
        font-size: 2.5rem;
        margin: 20px 0;
        padding: 10px;
        border-top: 2px solid #1565c0;
        border-bottom: 2px solid #1565c0;
        display: inline-block;
    }
    
    .certificate-text {
        color: #555;
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 15px 0;
    }
    
    .certificate-details {
        display: flex;
        justify-content: space-around;
        margin: 30px 0;
        padding: 20px;
        background: #f9f9f9;
    .profile-dropdown {
        position: absolute;
        top: calc(100% + 5px);
        right: 0;
        width: 250px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        display: none;
    }
    
    .profile-dropdown::before {
        content: '';
        position: absolute;
        top: -8px;
        right: 15px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid white;
    }
    
    .dropdown-content {
        padding: 15px;
    }
    
    .user-details {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    
    .detail {
        text-align: center;
    }
    
    .detail strong {
        display: block;
        color: #2c3e50;
        margin-bottom: 5px;
    }
    
    .certificate-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
    }
    
    .signature {
        text-align: center;
    }
    
    .signature-line {
        width: 200px;
        height: 1px;
        background: #000;
        margin: 0 auto 10px;
    }
    
    .logo-cert {
    .dropdown-content a {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #6a89cc;
        font-weight: bold;
    }
    
    .logo-cert i {
        font-size: 1.5rem;
    }
    
    .certificate-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 30px 0;
        padding: 10px;
        color: #333;
        text-decoration: none;
        border-radius: 5px;
        transition: background 0.3s;
    }
    
    .certificate-note {
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        margin-top: 20px;
    .dropdown-content a:hover {
        background: #f8f9fa;
    }
    
    @media print {
        .certificate-actions,
        .certificate-note,
        .modal-footer {
            display: none !important;
        }
        
        .certificate {
            border: none;
            box-shadow: none;
        }
    .dropdown-content hr {
        border: none;
        border-top: 1px solid #eee;
        margin: 10px 0;
    }
`;

// Добавление стилей сертификата
// Добавляем стили в документ
const styleElement = document.createElement('style');
styleElement.textContent = certificateStyles;
styleElement.textContent = dropdownStyles;
document.head.appendChild(styleElement);

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
            
            <div class="auth-promo">
                <div class="auth-promo-content">
                    <i class="fas fa-user-check"></i>
                    <h3>Зарегистрируйтесь для сохранения прогресса!</h3>
                    <p>Получите именной сертификат после прохождения курса</p>
                    <button id="promoRegister" class="btn-primary">Зарегистрироваться</button>
                </div>
            </div>
            
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
        </div>
    `;
    
    // Добавляем обработчик для кнопки регистрации
    const promoRegisterBtn = document.getElementById('promoRegister');
    if (promoRegisterBtn) {
        promoRegisterBtn.addEventListener('click', () => {
            // Показываем окно авторизации
            const authArea = document.getElementById('authArea');
            if (authArea) {
                authArea.style.display = 'block';
                // Переключаем на вкладку регистрации
                const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
                if (registerTab) registerTab.click();
            }
        });
    }
}
