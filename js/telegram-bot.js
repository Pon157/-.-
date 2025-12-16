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

// Хранилище ожидаемых действий пользователей
const userActions = new Map();

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
        console.error('Ошибка при проверке доступа:', error);
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
        console.error('Ошибка при проверке админа:', error);
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

// Middleware для обработки ожидаемых действий
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();
    
    const action = userActions.get(userId);
    if (action && ctx.message?.text) {
        // Выполняем ожидаемое действие
        await action.handler(ctx);
        userActions.delete(userId);
        return; // Не передаем дальше по middleware
    }
    
    return next();
});

// ========== КОМАНДЫ БОТА ==========

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = getUserName(ctx);
    
    console.log(`🟢 /start от ${userName} (ID: ${userId})`);
    
    if (await isUserAllowed(userId)) {
        const message = `👋 Добро пожаловать, ${userName}!\n\n` +
            `Я - бот для проверки сертификатов курса "Эмпатия и поддержка в общении".\n\n` +
            `📋 Доступные команды:\n` +
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

bot.command('check', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ Нет доступа');
    }
    
    await ctx.reply('Введите ID сертификата (формат: EMP-XXXXXXX):');
    
    // Сохраняем ожидаемое действие
    userActions.set(userId, {
        type: 'check_certificate',
        handler: async (ctx) => {
            const certId = ctx.message.text.trim().toUpperCase();
            
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
    });
});

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

bot.command('add_user', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ Нет прав администратора');
    }
    
    await ctx.reply('Введите Telegram ID пользователя:');
    
    userActions.set(userId, {
        type: 'add_user',
        handler: async (ctx) => {
            const newUserId = parseInt(ctx.message.text.trim());
            
            if (isNaN(newUserId)) {
                return ctx.reply('❌ Введите цифры');
            }
            
            try {
                const { error } = await supabase
                    .from('allowed_users')
                    .insert([{
                        telegram_id: newUserId,
                        added_by: userId,
                        added_at: new Date().toISOString()
                    }]);
                
                if (error) {
                    console.error('Ошибка добавления:', error);
                    return ctx.reply('❌ Ошибка добавления');
                }
                
                await ctx.reply(`✅ Пользователь ${newUserId} добавлен`);
                
                // Пытаемся уведомить
                try {
                    await bot.telegram.sendMessage(
                        newUserId,
                        '👋 Вам предоставлен доступ к боту!\nИспользуйте /start'
                    );
                } catch {
                    console.log('Не удалось уведомить пользователя');
                }
                
            } catch (error) {
                console.error('Ошибка:', error);
                await ctx.reply('⚠️ Ошибка');
            }
        }
    });
});

bot.command('remove_user', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ Нет прав администратора');
    }
    
    await ctx.reply('Введите Telegram ID для удаления:');
    
    userActions.set(userId, {
        type: 'remove_user',
        handler: async (ctx) => {
            const removeUserId = parseInt(ctx.message.text.trim());
            
            if (isNaN(removeUserId)) {
                return ctx.reply('❌ Введите цифры');
            }
            
            try {
                const { error } = await supabase
                    .from('allowed_users')
                    .delete()
                    .eq('telegram_id', removeUserId);
                
                if (error) {
                    console.error('Ошибка удаления:', error);
                    return ctx.reply('❌ Ошибка удаления');
                }
                
                await ctx.reply(`✅ Пользователь ${removeUserId} удален`);
                
            } catch (error) {
                console.error('Ошибка:', error);
                await ctx.reply('⚠️ Ошибка');
            }
        }
    });
});

bot.command('list_users', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ Нет прав администратора');
    }
    
    try {
        const { data: users, error } = await supabase
            .from('allowed_users')
            .select('*')
            .order('added_at', { ascending: false });
        
        if (error || !users || users.length === 0) {
            return ctx.reply('📭 Нет пользователей');
        }
        
        let message = `👥 Пользователи (${users.length}):\n\n`;
        
        users.forEach((user, index) => {
            const date = new Date(user.added_at).toLocaleDateString('ru-RU');
            message += `${index + 1}. ID: ${user.telegram_id}\n`;
            message += `   📅 Добавлен: ${date}\n`;
            message += `   👤 Добавил: ${user.added_by}\n\n`;
        });
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка:', error);
        await ctx.reply('⚠️ Ошибка');
    }
});

bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ Нет прав администратора');
    }
    
    try {
        const { data: users } = await supabase.from('users').select('*');
        const { data: certificates } = await supabase.from('certificates').select('*');
        const { data: allowedUsers } = await supabase.from('allowed_users').select('*');
        
        let message = `📈 Статистика:\n\n`;
        
        if (users) message += `👤 Пользователей: ${users.length}\n`;
        if (certificates) message += `📄 Сертификатов: ${certificates.length}\n`;
        if (allowedUsers) message += `🤖 В боте: ${allowedUsers.length}\n`;
        
        message += `\n🌐 Сайт: empathy-course.webtm.ru\n`;
        message += `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
        
        await ctx.reply(message);
        
    } catch (error) {
        console.error('Ошибка:', error);
        await ctx.reply('⚠️ Ошибка');
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

app.get('/api/certificate/:id', async (req, res) => {
    try {
        const certId = req.params.id;
        
        const { data: certificate, error } = await supabase
            .from('certificates')
            .select(`
                *,
                users (name)
            `)
            .eq('certificate_id', certId)
            .single();
        
        if (error || !certificate) {
            return res.status(404).json({ error: 'Not found' });
        }
        
        res.json({
            success: true,
            certificate: {
                id: certificate.certificate_id,
                name: certificate.users?.name,
                course: certificate.course_name,
                grade: certificate.grade,
                score: certificate.score,
                maxScore: certificate.max_score,
                date: certificate.issue_date,
                valid: certificate.valid
            }
        });
        
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Server error' });
    }
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
        
        console.log('🤖 Запуск бота (polling mode)...');
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
