require('dotenv').config();
const express = require('express');
const app = express();

// API для конфигурации
app.get('/api/config', (req, res) => {
    console.log('📡 Запрос конфигурации');
    
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    });
});

// Статические файлы
app.use(express.static('public'));

// Все остальные маршруты
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🔧 Режим: ${process.env.NODE_ENV}`);
    console.log(`🌐 Домен: ${process.env.WEBHOOK_DOMAIN}`);
});
