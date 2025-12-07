// Управление локальным хранилищем

const Storage = {
    // Ключи для localStorage
    KEYS: {
        THEME: 'empathy_course_theme',
        USER: 'empathy_course_user',
        PROGRESS: 'empathy_course_progress',
        SETTINGS: 'empathy_course_settings'
    },

    // Сохранить тему
    saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    // Получить сохраненную тему
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    // Сохранить пользователя
    saveUser(user) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    },

    // Получить текущего пользователя
    getUser() {
        const user = localStorage.getItem(this.KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    // Удалить пользователя (выход)
    removeUser() {
        localStorage.removeItem(this.KEYS.USER);
    },

    // Сохранить прогресс
    saveProgress(progress) {
        const user = this.getUser();
        if (user) {
            // Сохраняем прогресс с привязкой к пользователю
            const key = `${this.KEYS.PROGRESS}_${user.id}`;
            localStorage.setItem(key, JSON.stringify(progress));
        } else {
            // Для гостя сохраняем без привязки
            localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
        }
    },

    // Получить прогресс
    getProgress() {
        const user = this.getUser();
        let progress;
        
        if (user) {
            const key = `${this.KEYS.PROGRESS}_${user.id}`;
            progress = localStorage.getItem(key);
        } else {
            progress = localStorage.getItem(this.KEYS.PROGRESS);
        }
        
        return progress ? JSON.parse(progress) : this.getDefaultProgress();
    },

    // Настройки по умолчанию для прогресса
    getDefaultProgress() {
        return {
            currentModule: 1,
            currentSubmodule: "1.1",
            completedModules: [],
            completedSubmodules: [],
            testResults: {},
            assignmentResults: {},
            lastActive: new Date().toISOString()
        };
    },

    // Сохранить настройки
    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Получить настройки
    getSettings() {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {
            notifications: true,
            sound: true,
            autoSave: true
        };
    },

    // Очистить все данные (кроме темы)
    clearAll() {
        const theme = this.getTheme();
        localStorage.clear();
        this.saveTheme(theme);
    },

    // Экспорт данных
    exportData() {
        const data = {
            user: this.getUser(),
            progress: this.getProgress(),
            settings: this.getSettings(),
            theme: this.getTheme(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `empathy_course_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Импорт данных
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Валидация данных
                    if (!data.exportDate) {
                        throw new Error('Неверный формат файла');
                    }
                    
                    // Восстановление данных
                    if (data.theme) this.saveTheme(data.theme);
                    if (data.user) this.saveUser(data.user);
                    if (data.progress) this.saveProgress(data.progress);
                    if (data.settings) this.saveSettings(data.settings);
                    
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsText(file);
        });
    },

    // Получить статистику
    getStatistics() {
        const progress = this.getProgress();
        const user = this.getUser();
        
        const totalSubmodules = courseData.modules.reduce((total, module) => {
            return total + (module.submodules ? module.submodules.length : 0);
        }, 0);
        
        const completed = progress.completedSubmodules.length;
        const percent = totalSubmodules > 0 ? Math.round((completed / totalSubmodules) * 100) : 0;
        
        return {
            user: user ? {
                name: user.name,
                email: user.email,
                joined: user.createdAt
            } : null,
            progress: {
                completedModules: progress.completedModules.length,
                completedSubmodules: completed,
                totalSubmodules: totalSubmodules,
                percentage: percent,
                lastActive: progress.lastActive
            },
            tests: {
                completed: Object.keys(progress.testResults).length,
                averageScore: this.calculateAverageScore(progress.testResults)
            }
        };
    },

    // Рассчитать средний балл
    calculateAverageScore(testResults) {
        const scores = Object.values(testResults);
        if (scores.length === 0) return 0;
        
        const total = scores.reduce((sum, score) => sum + score, 0);
        return Math.round(total / scores.length);
    },

    // Проверить, есть ли сохраненные данные
    hasData() {
        return !!localStorage.getItem(this.KEYS.PROGRESS) || !!this.getUser();
    },

    // Получить все данные пользователя (для админки)
    getAllUserData() {
        const data = {};
        
        // Собираем все ключи, связанные с пользователем
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('empathy_course')) {
                data[key] = localStorage.getItem(key);
            }
        }
        
        return data;
    }
};

// Экспорт для использования в других файлах
window.Storage = Storage;
