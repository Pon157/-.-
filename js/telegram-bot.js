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

// Хранилище ожидаемых действий
const pendingActions = new Map();

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

async function isUserAllowed(userId) {
    try {
        const { data, error } = await supabase
            .from('allowed_users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        return !error && data;
    } catch (error) {
        console.error('Ошибка проверки доступа:', error);
        return false;
    }
}

async function isAdmin(userId) {
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        return !error && data;
    } catch (error) {
        console.error('Ошибка проверки админа:', error);
        return false;
    }
}

function getUserName(ctx) {
    const from = ctx.from;
    if (from.first_name && from.last_name) {
        return `${from.first_name} ${from.last_name}`;
    }
    return from.first_name || from.username || 'Пользователь';
}

// Очистка ожиданий при новой команде
function clearPendingAction(userId) {
    if (pendingActions.has(userId)) {
        pendingActions.delete(userId);
    }
}

// Middleware для очистки ожиданий при командах
bot.use((ctx, next) => {
    if (ctx.message && ctx.message.text && ctx.message.text.startsWith('/')) {
        const userId = ctx.from?.id;
        if (userId) {
            clearPendingAction(userId);
        }
    }
    return next();
});

// ========== ОБЩИЕ КОМАНДЫ ==========

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`🟢 /start от ${userName} (${userId})`);
    
    if (await isUserAllowed(userId)) {
        const message = `👋 Добро пожаловать, ${userName}!\n\n` +
            `Я - бот для проверки сертификатов курса.\n\n` +
            `📋 Команды:\n` +
            `/check - Проверить сертификат\n` +
            `/progress - Мой прогресс\n` +
            `/help - Помощь\n\n` +
            `🌐 Сайт: empathy-course.webtm.ru`;
        
        await ctx.reply(message);
    } else {
        const adminId = process.env.ADMIN_TELEGRAM_ID || 'не указан';
        await ctx.reply(
            `⛔ Нет доступа, ${userName}.\n\n` +
            `Обратитесь к администратору.\n` +
            `ID: ${adminId}`
        );
    }
});

bot.help(async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ Нет доступа');
    }
    
    const helpMessage = `📚 Помощь:\n\n` +
        `/start - Начать\n` +
        `/check - Проверить сертификат\n` +
        `/progress - Прогресс обучения\n` +
        `/help - Эта справка\n\n` +
        `🌐 Сайт: empathy-course.webtm.ru`;
    
    await ctx.reply(helpMessage);
});

// ========== ПРОВЕРКА СЕРТИФИКАТА ==========

bot.command('check', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ Нет доступа');
    }
    
    // Если есть аргумент
    const args = ctx.message.text.split(' ');
    if (args.length > 1) {
        const certId = args[1].trim().toUpperCase();
        await checkCertificate(ctx, certId);
        return;
    }
    
    await ctx.reply('Введите ID сертификата (формат: EMP-XXXXXXX):');
    
    pendingActions.set(userId, {
        type: 'check_cert',
        handler: async (ctx) => {
            const certId = ctx.message.text.trim().toUpperCase();
            await checkCertificate(ctx, certId);
        }
    });
});

async function checkCertificate(ctx, certId) {
    if (!certId.match(/^EMP-\d{7}$/)) {
        return ctx.reply('❌ Неверный формат. Используйте: EMP-XXXXXXX');
    }
    
    try {
        await ctx.reply(`🔍 Ищу: ${certId}...`);
        
        const { data: certificate, error } = await supabase
            .from('certificates')
            .select(`
                *,
                users (name)
            `)
            .eq('certificate_id', certId)
            .single();
        
        if (error || !certificate) {
            return ctx.reply('❌ Сертификат не найден');
        }
        
        const date = new Date(certificate.issue_date).toLocaleDateString('ru-RU');
        const message = `✅ Сертификат найден!\n\n` +
            `📄 ID: ${certificate.certificate_id}\n` +
            `👤 Владелец: ${certificate.users?.name || 'Не указан'}\n` +
            `🎓 Курс: ${certificate.course_name}\n` +
            `⭐ Оценка: ${certificate.grade}\n` +
            `📊 Баллы: ${certificate.score}/${certificate.max_score}\n` +
            `📅 Дата: ${date}\n` +
            `🔒 Статус: ${certificate.valid ? '✅ Действителен' : '❌ Недействителен'}`;
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка проверки:', error);
        await ctx.reply('⚠️ Ошибка при проверке');
    }
}

// ========== ПРОГРЕСС ==========

bot.command('progress', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ Нет доступа');
    }
    
    try {
        await ctx.reply('📊 Загружаю прогресс...');
        
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        if (userError || !user) {
            return ctx.reply('❌ Пользователь не найден\nЗарегистрируйтесь на сайте');
        }
        
        const { data: progress, error: progressError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id);
        
        let message = `📈 Прогресс\n\n👤 Студент: ${user.name}\n`;
        
        if (progress && progress.length > 0) {
            const completed = progress.filter(p => p.completed).length;
            const total = 5;
            const percent = Math.round((completed / total) * 100);
            
            message += `📊 Общий прогресс: ${percent}%\n`;
            message += `✅ Пройдено: ${completed}/${total}\n\n`;
            
            for (let i = 1; i <= total; i++) {
                const module = progress.find(p => p.module_id === i);
                if (module) {
                    message += module.completed ? `✅ Модуль ${i}\n` : `⏳ Модуль ${i} (в процессе)\n`;
                } else {
                    message += `❌ Модуль ${i} (не начат)\n`;
                }
            }
        } else {
            message += '📝 Прогресс не найден\nНачните обучение на сайте';
        }
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка прогресса:', error);
        await ctx.reply('⚠️ Ошибка при получении прогресса');
    }
});

// ========== АДМИН КОМАНДЫ ==========

// Обработка команды add_user с аргументом или без
bot.command('add_user', async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`➕ /add_user от ${userName} (${userId})`);
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ Нет прав администратора');
    }
    
    // Проверяем есть ли аргумент
    const args = ctx.message.text.split(' ').filter(arg => arg.trim() !== '');
    
    if (args.length > 1) {
        // Есть аргумент - добавляем сразу
        const newUserId = parseInt(args[1].trim());
        await addUser(ctx, userId, newUserId);
    } else {
        // Нет аргумента - запрашиваем
        await ctx.reply('Введите Telegram ID пользователя:');
        
        pendingActions.set(userId, {
            type: 'add_user',
            handler: async (ctx) => {
                const newUserId = parseInt(ctx.message.text.trim());
                await addUser(ctx, userId, newUserId);
            }
        });
    }
});

async function addUser(ctx, adminId, newUserId) {
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
                    added_by: adminId,
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
                `👋 Привет! Тебе предоставлен доступ к боту проверки сертификатов.\n\n` +
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
}

// Обработка текстовых сообщений (ожидаемые действия)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    
    // Если это команда - обрабатывается выше
    if (text.startsWith('/')) return;
    
    // Проверяем есть ли ожидаемое действие
    const pendingAction = pendingActions.get(userId);
    if (pendingAction) {
        try {
            await pendingAction.handler(ctx);
            pendingActions.delete(userId);
        } catch (error) {
            console.error('Ошибка обработки действия:', error);
            await ctx.reply('⚠️ Ошибка обработки команды');
            pendingActions.delete(userId);
        }
    }
});

// ========== API ==========

app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        bot: 'Empathy Course Certificate Bot',
        time: new Date().toISOString()
    });
});

// ========== ЗАПУСК ==========

const startBot = async () => {
    try {
        console.log('🚀 Запуск бота...');
        console.log(`📁 Директория: ${__dirname}`);
        console.log(`⚙️ Режим: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔌 Порт: ${PORT}`);
        
        console.log('🔌 Проверка Supabase...');
        try {
            const { error } = await supabase.from('users').select('count').limit(1);
            if (error) {
                console.log('⚠️ Supabase: ошибка подключения');
            } else {
                console.log('✅ Supabase: соединение установлено');
            }
        } catch (error) {
            console.log('⚠️ Supabase: ошибка:', error.message);
        }
        
        console.log('🤖 Запуск бота...');
        await bot.launch();
        console.log('✅ Бот запущен!');
        console.log('📢 Готов к работе. Используйте /start в Telegram');
        
        app.listen(PORT, () => {
            console.log(`🌐 Сервер запущен на порту ${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api/status`);
        });
        
        process.once('SIGINT', () => {
            console.log('\n🛑 Завершение работы...');
            bot.stop('SIGINT');
            process.exit(0);
        });
        
        process.once('SIGTERM', () => {
            console.log('\n🛑 Завершение работы...');
            bot.stop('SIGTERM');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error);
        process.exit(1);
    }
};

startBot();
