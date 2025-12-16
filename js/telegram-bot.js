const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Инициализация Telegram бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Функция для проверки доступа пользователя
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

// Функция для проверки админа
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

// Команда /start
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = ctx.from.first_name || ctx.from.username || 'Пользователь';
    
    console.log(`Пользователь ${userName} (ID: ${userId}) начал работу с ботом`);
    
    if (await isUserAllowed(userId)) {
        const welcomeMessage = `
👋 Добро пожаловать, ${userName}!

Я - бот для проверки сертификатов курса "Эмпатия и поддержка в общении".

📋 *Доступные команды:*
/check - Проверить сертификат по ID
/progress - Проверить прогресс курса
/my_certificates - Мои сертификаты
/help - Помощь

Для проверки сертификата используйте команду /check и введите ID сертификата (например: EMP-1234567)
        `;
        
        ctx.replyWithMarkdown(welcomeMessage);
    } else {
        const adminId = process.env.ADMIN_TELEGRAM_ID;
        ctx.reply(
            `⛔ У вас нет доступа к этому боту.\n\n` +
            `Обратитесь к администратору для получения доступа.\n` +
            `ID администратора: ${adminId || 'не указан'}`
        );
    }
});

// Команда /help
bot.help(async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    const helpMessage = `
📚 *Справка по командам бота:*

/start - Начать работу с ботом
/check - Проверить сертификат по ID
/progress - Проверить прогресс обучения
/my_certificates - Посмотреть мои сертификаты
/help - Показать эту справку

👨‍💼 *Для администраторов:*
/add_user - Добавить пользователя
/remove_user - Удалить пользователя
/list_users - Список пользователей
/stats - Статистика

📝 *Как проверить сертификат:*
1. Используйте команду /check
2. Введите ID сертификата (формат: EMP-XXXXXXX)
3. Получите информацию о сертификате

📊 *Как проверить прогресс:*
1. Используйте команду /progress
2. Бот покажет ваш прогресс по модулям
        `;
    
    ctx.replyWithMarkdown(helpMessage);
});

// Команда проверки сертификата
bot.command('check', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    ctx.reply('🔍 Введите ID сертификата для проверки (формат: EMP-XXXXXXX):');
    
    // Временный обработчик для ввода ID сертификата
    const certIdHandler = async (ctx) => {
        const certId = ctx.message.text.trim().toUpperCase();
        
        // Удаляем обработчик после использования
        bot.off('text', certIdHandler);
        
        // Проверка формата ID
        if (!certId.match(/^EMP-\d{7}$/)) {
            return ctx.reply('❌ Неверный формат ID сертификата.\nФормат должен быть: EMP-XXXXXXX (7 цифр)');
        }
        
        try {
            ctx.reply('🔎 Ищу сертификат в базе данных...');
            
            // Поиск сертификата в Supabase
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
            const message = `
✅ *СЕРТИФИКАТ НАЙДЕН!*

📄 *ID сертификата:* \`${certificate.certificate_id}\`
👤 *Владелец:* ${certificate.users.name}
🎓 *Курс:* ${certificate.course_name}
⭐ *Оценка:* ${certificate.grade}
📊 *Баллы:* ${certificate.score} / ${certificate.max_score}
📅 *Дата выдачи:* ${issueDate}
🔒 *Статус:* ${certificate.valid ? '✅ Действителен' : '❌ Недействителен'}

${certificate.verification_url ? `🌐 [Проверить онлайн](${certificate.verification_url})` : ''}

*Проверено:* ${new Date().toLocaleDateString('ru-RU')}
            `;
            
            ctx.replyWithMarkdown(message);
            
        } catch (error) {
            console.error('Ошибка при проверке сертификата:', error);
            ctx.reply('⚠️ Произошла ошибка при проверке сертификата. Попробуйте позже.');
        }
    };
    
    bot.on('text', certIdHandler);
});

// Команда проверки прогресса
bot.command('progress', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    try {
        ctx.reply('📊 Загружаю информацию о прогрессе...');
        
        // Получаем пользователя по Telegram ID
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        if (userError || !user) {
            return ctx.reply('❌ Пользователь не найден в системе.\nСначала зарегистрируйтесь на сайте.');
        }
        
        // Получаем прогресс пользователя
        const { data: progress, error: progressError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .order('module_id', { ascending: true });
        
        let message = `📈 *ПРОГРЕСС ОБУЧЕНИЯ*\n\n`;
        message += `👤 *Студент:* ${user.name}\n`;
        
        if (progress && progress.length > 0) {
            const completedModules = progress.filter(p => p.completed).length;
            const totalModules = 5;
            const overallProgress = Math.round((completedModules / totalModules) * 100);
            
            message += `📊 *Общий прогресс:* ${overallProgress}%\n`;
            message += `✅ *Пройдено модулей:* ${completedModules}/${totalModules}\n\n`;
            
            // Детализация по модулям
            message += `*Детализация по модулям:*\n`;
            
            for (let i = 1; i <= totalModules; i++) {
                const moduleProgress = progress.find(p => p.module_id === i);
                
                if (moduleProgress) {
                    const status = moduleProgress.completed ? '✅' : '⏳';
                    const date = moduleProgress.completed_at 
                        ? new Date(moduleProgress.completed_at).toLocaleDateString('ru-RU')
                        : '';
                    const score = moduleProgress.score ? ` (${moduleProgress.score} баллов)` : '';
                    
                    message += `${status} *Модуль ${i}:* ${moduleProgress.completed ? `Завершен ${date}${score}` : 'В процессе'}\n`;
                } else {
                    message += `❌ *Модуль ${i}:* Не начат\n`;
                }
            }
            
            // Если все модули пройдены, показываем информацию об экзамене
            if (completedModules === totalModules) {
                const { data: certificate, error: certError } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('issue_date', { ascending: false })
                    .limit(1)
                    .single();
                
                if (certificate && !certError) {
                    message += `\n🎓 *Итоговый экзамен пройден!*\n`;
                    message += `📄 *ID сертификата:* \`${certificate.certificate_id}\`\n`;
                    message += `⭐ *Оценка:* ${certificate.grade}\n`;
                    message += `📊 *Баллы:* ${certificate.score}/${certificate.max_score}\n`;
                }
            }
            
        } else {
            message += '📝 *Прогресс не найден.*\n\nНачните обучение на сайте: https://empathy-course.webtm.ru';
        }
        
        ctx.replyWithMarkdown(message);
        
    } catch (error) {
        console.error('Ошибка при получении прогресса:', error);
        ctx.reply('⚠️ Произошла ошибка при получении прогресса. Попробуйте позже.');
    }
});

// Команда для просмотра моих сертификатов
bot.command('my_certificates', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isUserAllowed(userId)) {
        return ctx.reply('⛔ У вас нет доступа к этой команде.');
    }
    
    try {
        // Получаем пользователя
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', userId)
            .single();
        
        if (userError || !user) {
            return ctx.reply('❌ Пользователь не найден в системе.');
        }
        
        // Получаем сертификаты пользователя
        const { data: certificates, error: certError } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .order('issue_date', { ascending: false });
        
        if (certError || !certificates || certificates.length === 0) {
            return ctx.reply('📭 У вас пока нет сертификатов.\n\nПройти курс и получить сертификат можно на сайте: https://empathy-course.webtm.ru');
        }
        
        let message = `📜 *ВАШИ СЕРТИФИКАТЫ*\n\n`;
        message += `👤 *Владелец:* ${user.name}\n`;
        message += `🎓 *Количество сертификатов:* ${certificates.length}\n\n`;
        
        certificates.forEach((cert, index) => {
            const issueDate = new Date(cert.issue_date).toLocaleDateString('ru-RU');
            message += `*${index + 1}. ${cert.course_name}*\n`;
            message += `📄 ID: \`${cert.certificate_id}\`\n`;
            message += `⭐ Оценка: ${cert.grade}\n`;
            message += `📊 Баллы: ${cert.score}/${cert.max_score}\n`;
            message += `📅 Дата: ${issueDate}\n`;
            message += `🔒 Статус: ${cert.valid ? '✅ Действителен' : '❌ Недействителен'}\n`;
            
            if (cert.verification_url) {
                message += `🔗 [Проверить](${cert.verification_url})\n`;
            }
            
            message += `\n`;
        });
        
        ctx.replyWithMarkdown(message);
        
    } catch (error) {
        console.error('Ошибка при получении сертификатов:', error);
        ctx.reply('⚠️ Произошла ошибка при получении списка сертификатов.');
    }
});

// АДМИН КОМАНДЫ

// Добавление пользователя
bot.command('add_user', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    ctx.reply('Введите Telegram ID пользователя для добавления:');
    
    const userIdHandler = async (ctx) => {
        const newUserId = parseInt(ctx.message.text.trim());
        
        // Удаляем обработчик
        bot.off('text', userIdHandler);
        
        if (isNaN(newUserId) || newUserId.toString().length < 5) {
            return ctx.reply('❌ Введите корректный Telegram ID (только цифры).');
        }
        
        try {
            // Проверяем, есть ли уже пользователь
            const { data: existingUser, error: checkError } = await supabase
                .from('allowed_users')
                .select('*')
                .eq('telegram_id', newUserId)
                .single();
            
            if (!checkError && existingUser) {
                return ctx.reply('✅ Пользователь уже имеет доступ к боту.');
            }
            
            // Добавляем пользователя
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
                console.error('Ошибка при добавлении пользователя:', error);
                return ctx.reply('❌ Ошибка при добавлении пользователя.');
            }
            
            ctx.reply(`✅ Пользователь с ID ${newUserId} успешно добавлен!`);
            
            // Пытаемся уведомить пользователя
            try {
                await bot.telegram.sendMessage(
                    newUserId,
                    `👋 Привет! Тебе предоставлен доступ к боту проверки сертификатов курса "Эмпатия и поддержка в общении".\n\n` +
                    `Используй команду /start для начала работы.\n` +
                    `Сайт курса: https://empathy-course.webtm.ru`
                );
            } catch (notifyError) {
                console.log('Пользователь еще не начал диалог с ботом');
            }
            
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
            ctx.reply('⚠️ Произошла ошибка при добавлении пользователя.');
        }
    };
    
    bot.on('text', userIdHandler);
});

// Удаление пользователя
bot.command('remove_user', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    ctx.reply('Введите Telegram ID пользователя для удаления:');
    
    const userIdHandler = async (ctx) => {
        const removeUserId = parseInt(ctx.message.text.trim());
        
        // Удаляем обработчик
        bot.off('text', userIdHandler);
        
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
                console.error('Ошибка при удалении пользователя:', error);
                return ctx.reply('❌ Ошибка при удалении пользователя.');
            }
            
            ctx.reply(`✅ Пользователь с ID ${removeUserId} успешно удален!`);
            
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            ctx.reply('⚠️ Произошла ошибка при удалении пользователя.');
        }
    };
    
    bot.on('text', userIdHandler);
});

// Список пользователей
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
        
        let message = `👥 *СПИСОК ПОЛЬЗОВАТЕЛЕЙ*\n\n`;
        message += `📊 *Всего пользователей:* ${users.length}\n\n`;
        
        users.forEach((user, index) => {
            const addedDate = new Date(user.added_at).toLocaleDateString('ru-RU');
            message += `*${index + 1}. ID:* ${user.telegram_id}\n`;
            message += `   📅 Добавлен: ${addedDate}\n`;
            message += `   👤 Добавил: ${user.added_by}\n\n`;
        });
        
        ctx.replyWithMarkdown(message);
        
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        ctx.reply('⚠️ Произошла ошибка при получении списка пользователей.');
    }
});

// Статистика
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!await isAdmin(userId)) {
        return ctx.reply('⛔ У вас нет прав администратора.');
    }
    
    try {
        // Получаем статистику
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');
        
        const { data: certificates, error: certsError } = await supabase
            .from('certificates')
            .select('*');
        
        const { data: allowedUsers, error: allowedError } = await supabase
            .from('allowed_users')
            .select('*');
        
        let message = `📈 *СТАТИСТИКА СИСТЕМЫ*\n\n`;
        
        if (!usersError && users) {
            message += `👤 *Зарегистрированных пользователей:* ${users.length}\n`;
        }
        
        if (!certsError && certificates) {
            const validCerts = certificates.filter(c => c.valid).length;
            message += `📄 *Выдано сертификатов:* ${certificates.length}\n`;
            message += `✅ *Действительных:* ${validCerts}\n`;
            message += `❌ *Недействительных:* ${certificates.length - validCerts}\n`;
        }
        
        if (!allowedError && allowedUsers) {
            message += `🤖 *Пользователей бота:* ${allowedUsers.length}\n`;
        }
        
        message += `\n🌐 *Сайт:* https://empathy-course.webtm.ru\n`;
        message += `🕒 *Время сервера:* ${new Date().toLocaleString('ru-RU')}`;
        
        ctx.replyWithMarkdown(message);
        
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        ctx.reply('⚠️ Произошла ошибка при получении статистики.');
    }
});

// API эндпоинты для сайта
app.post('/api/webhook/certificate-issued', async (req, res) => {
    try {
        const { userId, userName, certificateData } = req.body;
        
        console.log('Получен вебхук о выданном сертификате:', { userId, userName });
        
        // Сохраняем пользователя
        const { data: user, error: userError } = await supabase
            .from('users')
            .upsert([
                {
                    name: userName,
                    telegram_id: userId,
                    updated_at: new Date().toISOString()
                }
            ], { onConflict: 'telegram_id' })
            .select()
            .single();
        
        if (userError) {
            console.error('Ошибка при сохранении пользователя:', userError);
            return res.status(500).json({ error: 'Failed to save user' });
        }
        
        // Сохраняем сертификат
        const { error: certError } = await supabase
            .from('certificates')
            .insert([
                {
                    certificate_id: certificateData.id,
                    user_id: user.id,
                    course_name: certificateData.courseName,
                    grade: certificateData.grade,
                    score: certificateData.score,
                    max_score: certificateData.maxScore,
                    issue_date: new Date().toISOString(),
                    valid: true,
                    verification_url: `https://empathy-course.webtm.ru/certificate/${certificateData.id}`
                }
            ]);
        
        if (certError) {
            console.error('Ошибка при сохранении сертификата:', certError);
            return res.status(500).json({ error: 'Failed to save certificate' });
        }
        
        console.log('Сертификат успешно сохранен в базе данных');
        
        // Отправляем уведомление пользователю в Telegram
        try {
            await bot.telegram.sendMessage(
                userId,
                `🎉 Поздравляем, ${userName}!\n\n` +
                `Вы успешно завершили курс "Эмпатия и поддержка в общении"!\n\n` +
                `📄 *ID вашего сертификата:* \`${certificateData.id}\`\n` +
                `⭐ *Оценка:* ${certificateData.grade}\n` +
                `📊 *Баллы:* ${certificateData.score}/${certificateData.maxScore}\n\n` +
                `Проверить сертификат можно командой /check\n` +
                `Посмотреть все сертификаты: /my_certificates`
            );
        } catch (telegramError) {
            console.log('Не удалось отправить уведомление в Telegram');
        }
        
        res.json({ success: true, message: 'Certificate saved successfully' });
        
    } catch (error) {
        console.error('Ошибка в вебхуке:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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
                    name,
                    telegram_id
                )
            `)
            .eq('certificate_id', certificateId)
            .single();
        
        if (error || !certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        
        res.json({
            success: true,
            certificate: {
                id: certificate.certificate_id,
                name: certificate.users.name,
                course: certificate.course_name,
                grade: certificate.grade,
                score: certificate.score,
                maxScore: certificate.max_score,
                issueDate: certificate.issue_date,
                valid: certificate.valid,
                verificationUrl: certificate.verification_url
            }
        });
        
    } catch (error) {
        console.error('Ошибка при проверке сертификата:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Статическая раздача файлов сайта
app.use(express.static(path.join(__dirname, 'public')));

// Запуск бота и сервера
const startBot = async () => {
    try {
        // Создаем папку public если её нет
        try {
            await fs.mkdir(path.join(__dirname, 'public'), { recursive: true });
        } catch (err) {
            // Папка уже существует
        }
        
        // Проверяем соединение с Supabase
        console.log('Проверяем соединение с Supabase...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('Предупреждение: не удалось подключиться к Supabase. Проверьте настройки.');
        } else {
            console.log('Соединение с Supabase установлено успешно!');
        }
        
        // Запускаем бота
        if (process.env.NODE_ENV === 'production') {
            await bot.launch({
                webhook: {
                    domain: process.env.WEBHOOK_DOMAIN,
                    port: PORT
                }
            });
            console.log(`🚀 Бот запущен в режиме production`);
            console.log(`🌐 Вебхук: ${process.env.WEBHOOK_DOMAIN}`);
        } else {
            await bot.launch();
            console.log('🤖 Бот запущен в режиме polling');
        }
        
        // Запускаем Express сервер
        app.listen(PORT, () => {
            console.log(`✅ Сервер запущен на порту ${PORT}`);
            console.log(`🌍 API доступен по адресу: http://localhost:${PORT}/api/`);
            console.log(`📝 Проверка сертификата: http://localhost:${PORT}/api/certificate/EMP-1234567`);
        });
        
        // Graceful shutdown
        process.once('SIGINT', () => {
            console.log('Завершение работы...');
            bot.stop('SIGINT');
            process.exit(0);
        });
        
        process.once('SIGTERM', () => {
            console.log('Завершение работы...');
            bot.stop('SIGTERM');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Ошибка при запуске бота:', error);
        process.exit(1);
    }
};

startBot();
