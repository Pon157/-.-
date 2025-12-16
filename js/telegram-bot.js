const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
require('dotenv').config();

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 3000;

// Инициализация Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Инициализация Telegram бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Массив разрешенных пользователей (можно хранить в Supabase)
const allowedUsers = new Set();

// Функция для проверки доступа пользователя
async function isUserAllowed(userId) {
    // Проверяем в Supabase
    const { data, error } = await supabase
        .from('allowed_users')
        .select('*')
        .eq('telegram_id', userId)
        .single();
    
    return !error && data;
}

// Команда /start
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    
    if (await isUserAllowed(userId)) {
        ctx.reply(`👋 Добро пожаловать, ${ctx.from.first_name}!\n\nДоступные команды:\n/check - Проверить сертификат\n/progress - Проверить прогресс курса\n/add_user - Добавить пользователя (только для админов)`);
    } else {
        ctx.reply('⛔ У вас нет доступа к этому боту. Обратитесь к администратору.');
    }
});

// Команда проверки сертификата
bot.command('check', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    ctx.reply('Введите ID сертификата для проверки (формат: EMP-XXXXXXX):');
    
    // Ждем ввода ID
    bot.on('text', async (ctx) => {
        const certId = ctx.message.text.trim();
        
        if (certId.match(/^EMP-\d{7}$/)) {
            try {
                // Поиск сертификата в Supabase
                const { data: certificate, error } = await supabase
                    .from('certificates')
                    .select(`
                        *,
                        users (name, telegram_id)
                    `)
                    .eq('certificate_id', certId)
                    .single();
                
                if (error || !certificate) {
                    ctx.reply('❌ Сертификат не найден.');
                    return;
                }
                
                // Форматируем дату
                const issueDate = new Date(certificate.issue_date).toLocaleDateString('ru-RU');
                
                // Отправляем информацию о сертификате
                const message = `
✅ *Сертификат найден!*

*ID:* ${certificate.certificate_id}
*Владелец:* ${certificate.users.name}
*Курс:* ${certificate.course_name}
*Оценка:* ${certificate.grade}
*Баллы:* ${certificate.score}/${certificate.max_score}
*Дата выдачи:* ${issueDate}
*Статус:* ${certificate.valid ? '✅ Действителен' : '❌ Недействителен'}

${certificate.verification_url ? `🔗 [Проверить онлайн](${certificate.verification_url})` : ''}
                `;
                
                ctx.replyWithMarkdown(message);
                
            } catch (error) {
                console.error('Ошибка при проверке сертификата:', error);
                ctx.reply('⚠️ Произошла ошибка при проверке сертификата.');
            }
        } else {
            ctx.reply('❌ Неверный формат ID сертификата. Формат: EMP-XXXXXXX');
        }
    });
});

// Команда проверки прогресса
bot.command('progress', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    try {
        // Получаем прогресс пользователя из Supabase
        const { data: userProgress, error } = await supabase
            .from('users')
            .select(`
                *,
                progress (
                    module_id,
                    completed,
                    score,
                    completed_at
                )
            `)
            .eq('telegram_id', userId)
            .single();
        
        if (error || !userProgress) {
            return ctx.reply('Пользователь не найден в системе.');
        }
        
        // Формируем сообщение с прогрессом
        let message = `📊 *Прогресс курса*\n\n`;
        message += `*Студент:* ${userProgress.name}\n`;
        
        // Расчет общего прогресса
        if (userProgress.progress && userProgress.progress.length > 0) {
            const completedModules = userProgress.progress.filter(p => p.completed).length;
            const totalModules = 5; // Общее количество модулей в курсе
            
            const overallProgress = Math.round((completedModules / totalModules) * 100);
            message += `*Общий прогресс:* ${overallProgress}%\n`;
            message += `*Пройдено модулей:* ${completedModules}/${totalModules}\n\n`;
            
            // Подробная информация по модулям
            message += `*Детализация:*\n`;
            for (let i = 1; i <= totalModules; i++) {
                const moduleProgress = userProgress.progress.find(p => p.module_id === i);
                if (moduleProgress) {
                    const status = moduleProgress.completed ? '✅' : '⏳';
                    const date = moduleProgress.completed_at 
                        ? new Date(moduleProgress.completed_at).toLocaleDateString('ru-RU')
                        : '';
                    message += `${status} Модуль ${i}: ${moduleProgress.completed ? `Завершен ${date}` : 'В процессе'}\n`;
                    if (moduleProgress.score) {
                        message += `   Баллы: ${moduleProgress.score}\n`;
                    }
                } else {
                    message += `❌ Модуль ${i}: Не начат\n`;
                }
            }
        } else {
            message += 'Прогресс обучения не найден.';
        }
        
        ctx.replyWithMarkdown(message);
        
    } catch (error) {
        console.error('Ошибка при получении прогресса:', error);
        ctx.reply('⚠️ Произошла ошибка при получении прогресса.');
    }
});

// Команда для добавления пользователя (только для админов)
bot.command('add_user', async (ctx) => {
    const userId = ctx.from.id;
    
    // Проверяем, является ли пользователь администратором
    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('telegram_id', userId)
        .single();
    
    if (error || !admin) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    ctx.reply('Введите Telegram ID пользователя, которого нужно добавить:');
    
    // Обработчик ввода Telegram ID
    const userIdInputHandler = async (ctx) => {
        const newUserId = parseInt(ctx.message.text);
        
        if (isNaN(newUserId)) {
            return ctx.reply('❌ Введите корректный Telegram ID (только цифры).');
        }
        
        try {
            // Добавляем пользователя в Supabase
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
                if (error.code === '23505') { // Unique violation
                    return ctx.reply('✅ Пользователь уже имеет доступ.');
                }
                throw error;
            }
            
            ctx.reply(`✅ Пользователь с ID ${newUserId} успешно добавлен!`);
            
            // Уведомляем нового пользователя
            try {
                await bot.telegram.sendMessage(
                    newUserId,
                    '✅ Вам предоставлен доступ к боту проверки сертификатов!\n\n' +
                    'Используйте команду /start для начала работы.'
                );
            } catch (notifyError) {
                console.log('Пользователь еще не начал диалог с ботом');
            }
            
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
            ctx.reply('⚠️ Произошла ошибка при добавлении пользователя.');
        }
        
        // Удаляем обработчик
        bot.off('text', userIdInputHandler);
    };
    
    bot.on('text', userIdInputHandler);
});

// Вебхук для получения обновлений от сайта
app.post('/webhook/certificate-issued', express.json(), async (req, res) => {
    try {
        const { userId, certificateId, courseData } = req.body;
        
        // Сохраняем сертификат в Supabase
        const { error } = await supabase
            .from('certificates')
            .insert([
                {
                    certificate_id: certificateId,
                    user_id: userId,
                    course_name: courseData.courseName,
                    grade: courseData.grade,
                    score: courseData.score,
                    max_score: courseData.maxScore,
                    issue_date: new Date().toISOString(),
                    valid: true,
                    verification_url: `https://ваш-домен.ru/certificate/${certificateId}`
                }
            ]);
        
        if (error) throw error;
        
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка вебхука:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Запуск бота и сервера
const startBot = async () => {
    try {
        // Используем вебхуки для продакшена или polling для разработки
        if (process.env.NODE_ENV === 'production') {
            await bot.launch({
                webhook: {
                    domain: process.env.WEBHOOK_DOMAIN,
                    port: PORT
                }
            });
            console.log(`Бот запущен с вебхуком на порту ${PORT}`);
        } else {
            await bot.launch();
            console.log('Бот запущен в режиме polling');
        }
        
        // Запуск Express сервера
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
        
        // Graceful shutdown
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
        
    } catch (error) {
        console.error('Ошибка при запуске бота:', error);
        process.exit(1);
    }
};

startBot();
