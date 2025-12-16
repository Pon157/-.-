const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Supabase клиент
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Проверка доступа пользователя
async function isUserAllowed(userId) {
    try {
        const { data, error } = await supabase
            .from('allowed_users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        return !error && data;
    } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
        return false;
    }
}

// Проверка администратора
async function isAdmin(userId) {
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        return !error && data;
    } catch (error) {
        console.error('Ошибка при проверке админа:', error);
        return false;
    }
}

// Получение имени пользователя
function getUserName(ctx) {
    const from = ctx.from;
    if (from.first_name && from.last_name) {
        return `${from.first_name} ${from.last_name}`;
    }
    return from.first_name || from.username || 'Пользователь';
}

// ========== КОМАНДЫ БОТА ==========

// Команда /start
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`🟢 /start от ${userName} (ID: ${userId})`);
    
    if (await isUserAllowed(userId)) {
        const message = `👋 Добро пожаловать, ${userName}!\n\n` +
            `Я - бот для проверки сертификатов курса "Эмпатия и поддержка в общении".\n\n` +
            `📋 Доступные команды:\n` +
            `/check - Проверить сертификат по ID\n` +
            `/progress - Узнать свой прогресс обучения\n` +
            `/my_certificates - Мои сертификаты\n` +
            `/help - Помощь по командам\n\n` +
            `🌐 Сайт курса: empathy-course.webtm.ru\n\n` +
            `📝 Для проверки сертификата:\n` +
            `1. Используйте команду /check\n` +
            `2. Введите ID сертификата (формат: EMP-XXXXXXX)`;
        
        await ctx.reply(message);
    } else {
        const adminId = process.env.ADMIN_TELEGRAM_ID || 'не указан';
        await ctx.reply(
            `⛔ У вас нет доступа к этому боту, ${userName}.\n\n` +
            `Обратитесь к администратору для получения доступа.\n` +
            `ID администратора: ${adminId}`
        );
    }
});

// Команда /help
bot.help(async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    const helpMessage = `📚 Справка по командам бота:\n\n` +
        `/start - Начать работу с ботом\n` +
        `/check - Проверить сертификат по ID\n` +
        `/progress - Проверить прогресс обучения\n` +
        `/my_certificates - Посмотреть мои сертификаты\n` +
        `/help - Показать эту справку\n\n` +
        `👨‍💼 Для администраторов:\n` +
        `/add_user - Добавить пользователя\n` +
        `/remove_user - Удалить пользователя\n` +
        `/list_users - Список пользователей\n` +
        `/stats - Статистика системы\n\n` +
        `📝 Как проверить сертификат:\n` +
        `1. Используйте команду /check\n` +
        `2. Введите ID сертификата (формат: EMP-XXXXXXX)\n` +
        `3. Получите информацию о сертификате\n\n` +
        `📊 Как проверить прогресс:\n` +
        `1. Используйте команду /progress\n` +
        `2. Бот покажет ваш прогресс по модулям\n\n` +
        `🌐 Сайт курса: empathy-course.webtm.ru`;
    
    await ctx.reply(helpMessage);
});

// Команда /check - Проверка сертификата
bot.command('check', async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`🔍 /check от ${userName} (ID: ${userId})`);
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    await ctx.reply('🔍 Введите ID сертификата для проверки (формат: EMP-XXXXXXX):');
    
    // Создаем уникальный обработчик для этого пользователя
    const certIdHandler = async (ctx) => {
        // Проверяем что это тот же пользователь
        if (ctx.from.id !== userId) return;
        
        const certId = ctx.message.text.trim().toUpperCase();
        
        // Удаляем этот обработчик
        bot.off('text', certIdHandler);
        
        // Проверка формата
        if (!certId.match(/^EMP-\d{7}$/)) {
            return ctx.reply('❌ Неверный формат ID сертификата.\nФормат должен быть: EMP-XXXXXXX (7 цифр)');
        }
        
        try {
            await ctx.reply('🔎 Ищу сертификат в базе данных...');
            
            // Поиск в Supabase
            const { data: certificate, error } = await supabase
                .from('certificates')
                .select(`
                    *,
                    users (
                        name,
                        telegram_id
                    )
                `)
                .eq('certificate_id', certId)
                .single();
            
            if (error || !certificate) {
                return ctx.reply('❌ Сертификат не найден в базе данных.');
            }
            
            // Форматируем дату
            const issueDate = new Date(certificate.issue_date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Формируем сообщение
            const message = `✅ СЕРТИФИКАТ НАЙДЕН!\n\n` +
                `📄 ID сертификата: ${certificate.certificate_id}\n` +
                `👤 Владелец: ${certificate.users?.name || 'Не указан'}\n` +
                `🎓 Курс: ${certificate.course_name}\n` +
                `⭐ Оценка: ${certificate.grade}\n` +
                `📊 Баллы: ${certificate.score} / ${certificate.max_score}\n` +
                `📅 Дата выдачи: ${issueDate}\n` +
                `🔒 Статус: ${certificate.valid ? '✅ Действителен' : '❌ Недействителен'}\n\n` +
                `🌐 Сайт для проверки: empathy-course.webtm.ru\n\n` +
                `Проверено: ${new Date().toLocaleDateString('ru-RU')}`;
            
            await ctx.reply(message);
            
        } catch (error) {
            console.error('Ошибка проверки сертификата:', error);
            await ctx.reply('⚠️ Произошла ошибка при проверке сертификата. Попробуйте позже.');
        }
    };
    
    // Устанавливаем обработчик только для этого пользователя
    bot.on('text', certIdHandler);
});

// Команда /progress - Прогресс обучения
bot.command('progress', async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`📊 /progress от ${userName} (ID: ${userId})`);
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    try {
        await ctx.reply('📊 Загружаю информацию о прогрессе...');
        
        // Находим пользователя в базе
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        if (userError || !user) {
            return ctx.reply('❌ Пользователь не найден в системе.\nЗарегистрируйтесь на сайте: empathy-course.webtm.ru');
        }
        
        // Получаем прогресс
        const { data: progress, error: progressError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .order('module_id', { ascending: true });
        
        let message = `📈 ПРОГРЕСС ОБУЧЕНИЯ\n\n`;
        message += `👤 Студент: ${user.name}\n`;
        
        if (progress && progress.length > 0) {
            const completedModules = progress.filter(p => p.completed).length;
            const totalModules = 5;
            const overallProgress = Math.round((completedModules / totalModules) * 100);
            
            message += `📊 Общий прогресс: ${overallProgress}%\n`;
            message += `✅ Пройдено модулей: ${completedModules}/${totalModules}\n\n`;
            
            // Детализация
            message += `Детализация по модулям:\n`;
            
            for (let i = 1; i <= totalModules; i++) {
                const moduleProgress = progress.find(p => p.module_id === i);
                
                if (moduleProgress) {
                    const status = moduleProgress.completed ? '✅' : '⏳';
                    const date = moduleProgress.completed_at 
                        ? new Date(moduleProgress.completed_at).toLocaleDateString('ru-RU')
                        : '';
                    const score = moduleProgress.score ? ` (${moduleProgress.score} баллов)` : '';
                    
                    message += `${status} Модуль ${i}: ${moduleProgress.completed ? `Завершен ${date}${score}` : 'В процессе'}\n`;
                } else {
                    message += `❌ Модуль ${i}: Не начат\n`;
                }
            }
            
        } else {
            message += '📝 Прогресс не найден.\n\nНачните обучение на сайте: empathy-course.webtm.ru';
        }
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка получения прогресса:', error);
        await ctx.reply('⚠️ Произошла ошибка при получении прогресса. Попробуйте позже.');
    }
});

// Команда /my_certificates - Мои сертификаты
bot.command('my_certificates', async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`📜 /my_certificates от ${userName} (ID: ${userId})`);
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    try {
        // Находим пользователя
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        if (userError || !user) {
            return ctx.reply('❌ Пользователь не найден в системе.');
        }
        
        // Получаем сертификаты
        const { data: certificates, error: certError } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .order('issue_date', { ascending: false });
        
        if (certError || !certificates || certificates.length === 0) {
            return ctx.reply('📭 У вас пока нет сертификатов.\n\nПройти курс можно на сайте: empathy-course.webtm.ru');
        }
        
        let message = `📜 ВАШИ СЕРТИФИКАТЫ\n\n`;
        message += `👤 Владелец: ${user.name}\n`;
        message += `🎓 Количество сертификатов: ${certificates.length}\n\n`;
        
        certificates.forEach((cert, index) => {
            const issueDate = new Date(cert.issue_date).toLocaleDateString('ru-RU');
            message += `${index + 1}. ${cert.course_name}\n`;
            message += `   📄 ID: ${cert.certificate_id}\n`;
            message += `   ⭐ Оценка: ${cert.grade}\n`;
            message += `   📊 Баллы: ${cert.score}/${cert.max_score}\n`;
            message += `   📅 Дата: ${issueDate}\n`;
            message += `   🔒 Статус: ${cert.valid ? '✅ Действителен' : '❌ Недействителен'}\n\n`;
        });
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка получения сертификатов:', error);
        await ctx.reply('⚠️ Произошла ошибка при получении списка сертификатов.');
    }
});

// ========== АДМИН КОМАНДЫ ==========

// Обработчики для админских команд
const adminHandlers = new Map();

// Команда /add_user - Добавить пользователя
bot.command('add_user', async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`➕ /add_user от ${userName} (ID: ${userId})`);
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    await ctx.reply('Введите Telegram ID пользователя для добавления:');
    
    // Создаем обработчик для этого пользователя
    const userIdHandler = async (ctx) => {
        // Проверяем что это тот же пользователь
        if (ctx.from.id !== userId) return;
        
        const newUserId = parseInt(ctx.message.text.trim());
        
        // Удаляем обработчик из Map
        const handler = adminHandlers.get(userId);
        if (handler) {
            bot.off('text', handler);
            adminHandlers.delete(userId);
        }
        
        if (isNaN(newUserId) || newUserId.toString().length < 5) {
            return ctx.reply('❌ Введите корректный Telegram ID (только цифры).');
        }
        
        try {
            // Проверяем существование
            const { data: existingUser } = await supabase
                .from('allowed_users')
                .select('*')
                .eq('telegram_id', newUserId)
                .single();
            
            if (existingUser) {
                return ctx.reply('✅ Пользователь уже имеет доступ к боту.');
            }
            
            // Добавляем
            const { error } = await supabase
                .from('allowed_users')
                .insert([
                    {
                        telegram_id: newUserId,
                        added_by: userId,
                        added_at: new Date().toISOString()
                    }
                ]);
            
            if (error) {
                console.error('Ошибка добавления:', error);
                return ctx.reply('❌ Ошибка при добавлении пользователя.');
            }
            
            await ctx.reply(`✅ Пользователь с ID ${newUserId} успешно добавлен!`);
            
            // Уведомляем пользователя
            try {
                await bot.telegram.sendMessage(
                    newUserId,
                    `👋 Привет! Тебе предоставлен доступ к боту проверки сертификатов курса "Эмпатия и поддержка в общении".\n\n` +
                    `Используй команду /start для начала работы.\n` +
                    `Сайт курса: empathy-course.webtm.ru`
                );
            } catch {
                console.log('Пользователь еще не начал диалог с ботом');
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            await ctx.reply('⚠️ Произошла ошибка при добавлении пользователя.');
        }
    };
    
    // Сохраняем обработчик в Map
    adminHandlers.set(userId, userIdHandler);
    bot.on('text', userIdHandler);
});

// Команда /remove_user - Удалить пользователя
bot.command('remove_user', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    await ctx.reply('Введите Telegram ID пользователя для удаления:');
    
    const removeHandler = async (ctx) => {
        if (ctx.from.id !== userId) return;
        
        const removeUserId = parseInt(ctx.message.text.trim());
        
        // Удаляем обработчик
        const handler = adminHandlers.get(`remove_${userId}`);
        if (handler) {
            bot.off('text', handler);
            adminHandlers.delete(`remove_${userId}`);
        }
        
        if (isNaN(removeUserId)) {
            return ctx.reply('❌ Введите корректный Telegram ID (только цифры).');
        }
        
        try {
            // Удаляем пользователя
            const { error } = await supabase
                .from('allowed_users')
                .delete()
                .eq('telegram_id', removeUserId);
            
            if (error) {
                console.error('Ошибка удаления:', error);
                return ctx.reply('❌ Ошибка при удалении пользователя.');
            }
            
            await ctx.reply(`✅ Пользователь с ID ${removeUserId} успешно удален!`);
            
        } catch (error) {
            console.error('Ошибка удаления:', error);
            await ctx.reply('⚠️ Произошла ошибка при удалении пользователя.');
        }
    };
    
    adminHandlers.set(`remove_${userId}`, removeHandler);
    bot.on('text', removeHandler);
});

// Команда /list_users - Список пользователей
bot.command('list_users', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    try {
        const { data: users, error } = await supabase
            .from('allowed_users')
            .select('*')
            .order('added_at', { ascending: false });
        
        if (error || !users || users.length === 0) {
            return ctx.reply('📭 В базе данных нет пользователей.');
        }
        
        let message = `👥 СПИСОК ПОЛЬЗОВАТЕЛЕЙ\n\n`;
        message += `📊 Всего пользователей: ${users.length}\n\n`;
        
        users.forEach((user, index) => {
            const addedDate = new Date(user.added_at).toLocaleDateString('ru-RU');
            message += `${index + 1}. ID: ${user.telegram_id}\n`;
            message += `   📅 Добавлен: ${addedDate}\n`;
            message += `   👤 Добавил: ${user.added_by}\n\n`;
        });
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка:', error);
        await ctx.reply('⚠️ Произошла ошибка при получении списка пользователей.');
    }
});

// Команда /stats - Статистика
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    try {
        // Получаем статистику
        const { data: users } = await supabase.from('users').select('*');
        const { data: certificates } = await supabase.from('certificates').select('*');
        const { data: allowedUsers } = await supabase.from('allowed_users').select('*');
        
        let message = `📈 СТАТИСТИКА СИСТЕМЫ\n\n`;
        
        if (users) {
            message += `👤 Зарегистрированных пользователей: ${users.length}\n`;
        }
        
        if (certificates) {
            const validCerts = certificates.filter(c => c.valid).length;
            message += `📄 Выдано сертификатов: ${certificates.length}\n`;
            message += `✅ Действительных: ${validCerts}\n`;
            message += `❌ Недействительных: ${certificates.length - validCerts}\n`;
        }
        
        if (allowedUsers) {
            message += `🤖 Пользователей бота: ${allowedUsers.length}\n`;
        }
        
        message += `\n🌐 Сайт: empathy-course.webtm.ru\n`;
        message += `🕒 Время сервера: ${new Date().toLocaleString('ru-RU')}`;
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка:', error);
        await ctx.reply('⚠️ Произошла ошибка при получении статистики.');
    }
});

// ========== API ЭНДПОИНТЫ ==========

// API для проверки статуса
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        service: 'Empathy Course Bot',
        mode: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        endpoints: {
            check: '/api/certificate/:id',
            webhook: '/telegram-webhook'
        }
    });
});

// API для проверки сертификата
app.get('/api/certificate/:id', async (req, res) => {
    try {
        const certificateId = req.params.id;
        
        const { data: certificate, error } = await supabase
            .from('certificates')
            .select(`
                *,
                users (
                    name
                )
            `)
            .eq('certificate_id', certificateId)
            .single();
        
        if (error || !certificate) {
            return res.status(404).json({
                error: 'Certificate not found',
                id: certificateId
            });
        }
        
        res.json({
            success: true,
            certificate: {
                id: certificate.certificate_id,
                name: certificate.users?.name || 'Не указан',
                course: certificate.course_name,
                grade: certificate.grade,
                score: certificate.score,
                maxScore: certificate.max_score,
                issueDate: certificate.issue_date,
                valid: certificate.valid
            }
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Вебхук для Telegram (для production)
app.post('/telegram-webhook', async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(200);
    }
});

// ========== ЗАПУСК БОТА ==========

const startBot = async () => {
    try {
        console.log('🚀 Запуск бота проверки сертификатов...');
        console.log(`📁 Директория: ${__dirname}`);
        console.log(`🌐 Домен: ${process.env.WEBHOOK_DOMAIN || 'Не указан'}`);
        console.log(`⚙️ Режим: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔌 Порт: ${PORT}`);
        
        // Проверяем Supabase
        console.log('🔌 Проверяем соединение с Supabase...');
        try {
            const { data, error } = await supabase.from('users').select('count').limit(1);
            if (error) {
                console.log('⚠️ Не удалось подключиться к Supabase. Проверьте настройки.');
            } else {
                console.log('✅ Соединение с Supabase установлено!');
            }
        } catch (error) {
            console.log('⚠️ Ошибка проверки Supabase:', error.message);
        }
        
        // Всегда запускаем в режиме polling (без вебхука)
        console.log('🤖 Запускаем бота в режиме polling...');
        await bot.launch();
        console.log('✅ Бот запущен в режиме polling!');
        console.log('📢 Готов к работе. Используйте /start в Telegram');
        
        // Запускаем Express сервер
        app.listen(PORT, () => {
            console.log(`✅ Express сервер запущен на порту ${PORT}`);
            console.log(`🌐 API доступен: http://localhost:${PORT}/api/status`);
            console.log(`📄 Проверка сертификата: http://localhost:${PORT}/api/certificate/EMP-1234567`);
            console.log(`📱 Бот работает в режиме polling`);
        });
        
        // Graceful shutdown
        process.once('SIGINT', () => {
            console.log('\n🛑 Получен SIGINT, завершаем работу...');
            bot.stop('SIGINT');
            process.exit(0);
        });
        
        process.once('SIGTERM', () => {
            console.log('\n🛑 Получен SIGTERM, завершаем работу...');
            bot.stop('SIGTERM');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Критическая ошибка при запуске бота:', error);
        process.exit(1);
    }
};

// Запускаем бота
startBot();
