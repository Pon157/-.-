import asyncio
import logging
import os
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import InlineKeyboardBuilder

# --- КОНФИГУРАЦИЯ ---. 
load_dotenv() # Загружаем переменные из .env

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# ID чатов для пересылки (из вашего ТЗ)
# ВАЖНО: Убедитесь, что бот добавлен в эти чаты и является админом (чтобы видеть сообщения)
CHAT_CURATOR = -5003212025
CHAT_STRESS_TEST = -5063879880
CHAT_ADMIN_APPLY = -5084404528

# --- СОСТОЯНИЯ (FSM) ---
class BotStates(StatesGroup):
    menu = State()              # Главное меню
    topic_selection = State()   # Выбор темы вопроса (для куратора)
    chat_curator = State()      # Режим общения с куратором
    chat_stress = State()       # Режим стресс-теста
    admin_apply = State()       # Подача заявки

# Инициализация
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

# --- КЛАВИАТУРЫ ---

def get_main_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="mode_curator")
    builder.button(text="✍️ Финальная подпись (Стресс-тест)", callback_data="mode_stress")
    builder.button(text="📋 Заявка в администрацию", callback_data="mode_admin")
    builder.adjust(1) # Кнопки в один столбец
    return builder.as_markup()

def get_curator_topics_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="❓ Не понятен курс", callback_data="topic_course")
    builder.button(text="📄 Не понятно задание", callback_data="topic_task")
    builder.button(text="💬 Другой вопрос", callback_data="topic_other")
    builder.button(text="🔙 Назад", callback_data="back_to_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_back_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="🔚 Завершить диалог / Назад", callback_data="back_to_menu")
    return builder.as_markup()

# --- ХЕНДЛЕРЫ (ОБРАБОТЧИКИ) ---

# 1. Команда /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear() # Сбрасываем старые состояния
    welcome_text = (
        "Здравствуйте, вы попали в официальный бот сайта http://empathy-course.webtm.ru\n\n"
        "В данном боте вы можете:\n"
        "• Получить помощь в прохождении курса от куратора\n"
        "• Получить финальную подпись в вашем сертификате\n"
        "• Подать заявку в администрацию в наш бот"
    )
    await message.answer(welcome_text, reply_markup=get_main_keyboard())
    await state.set_state(BotStates.menu)

# 2. Обработка кнопки "Назад"
@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Вы вернулись в главное меню. Выберите действие:", reply_markup=get_main_keyboard())
    await state.set_state(BotStates.menu)

# --- ЛОГИКА РЕЖИМА 1: КУРАТОР ---

@dp.callback_query(F.data == "mode_curator")
async def enter_curator_mode(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.topic_selection)
    await callback.message.edit_text(
        "Вы выбрали связь с куратором.\nПожалуйста, уточните тему вашего вопроса:",
        reply_markup=get_curator_topics_keyboard()
    )

@dp.callback_query(F.data.startswith("topic_"))
async def start_curator_chat(callback: types.CallbackQuery, state: FSMContext):
    topic_map = {
        "topic_course": "Не понятен курс",
        "topic_task": "Не понятно задание",
        "topic_other": "Общий вопрос"
    }
    topic = topic_map.get(callback.data, "Вопрос")
    
    # Сохраняем тему в память, чтобы знать контекст
    await state.update_data(topic=topic)
    await state.set_state(BotStates.chat_curator)
    
    await callback.message.edit_text(
        f"Тема: <b>{topic}</b>.\n\n"
        "Напишите ваш вопрос ниже. Кураторы (чат -5003212025) получат ваше сообщение.",
        parse_mode="HTML",
        reply_markup=get_back_keyboard()
    )

# --- ЛОГИКА РЕЖИМА 2: СТРЕСС-ТЕСТ ---

@dp.callback_query(F.data == "mode_stress")
async def enter_stress_mode(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.chat_stress)
    await callback.message.edit_text(
        "📢 <b>Режим: Стресс-тест (Финальная подпись)</b>\n\n"
        "Вы подключены к чату с экзаменатором. Он проведет стресс-тест.\n"
        "Всё, что вы напишите ниже, будет отправлено экзаменатору.",
        parse_mode="HTML",
        reply_markup=get_back_keyboard()
    )

# --- ЛОГИКА РЕЖИМА 3: ЗАЯВКА В АДМИНИСТРАЦИЮ ---

@dp.callback_query(F.data == "mode_admin")
async def enter_admin_mode(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.admin_apply)
    await callback.message.edit_text(
        "📝 <b>Подача заявки в администрацию</b>\n\n"
        "Напишите текст вашей заявки (резюме, почему хотите вступить и т.д.).\n"
        "Мы передадим её администраторам.",
        parse_mode="HTML",
        reply_markup=get_back_keyboard()
    )

# --- ПЕРЕСЫЛКА СООБЩЕНИЙ ОТ ПОЛЬЗОВАТЕЛЯ В ГРУППЫ ---

@dp.message(BotStates.chat_curator)
async def forward_to_curator(message: types.Message, state: FSMContext):
    data = await state.get_data()
    topic = data.get("topic", "Вопрос")
    
    # Добавляем подпись о теме вопроса перед пересылкой (опционально)
    try:
        # Пересылаем само сообщение
        forwarded_msg = await message.forward(chat_id=CHAT_CURATOR)
        # Отвечаем в группе на это сообщение темой, чтобы кураторы видели контекст
        await bot.send_message(
            chat_id=CHAT_CURATOR, 
            text=f"👆 Вопрос от пользователя по теме: <b>{topic}</b>", 
            reply_to_message_id=forwarded_msg.message_id,
            parse_mode="HTML"
        )
        await message.answer("✅ Сообщение отправлено кураторам. Ждите ответа.", reply_markup=get_back_keyboard())
    except Exception as e:
        await message.answer(f"Ошибка отправки: {e}")

@dp.message(BotStates.chat_stress)
async def forward_to_stress(message: types.Message):
    try:
        await message.forward(chat_id=CHAT_STRESS_TEST)
        await message.answer("✅ Отправлено экзаменатору.", reply_markup=get_back_keyboard())
    except Exception as e:
        await message.answer(f"Ошибка отправки: {e}")

@dp.message(BotStates.admin_apply)
async def forward_to_admin(message: types.Message):
    try:
        await message.forward(chat_id=CHAT_ADMIN_APPLY)
        await message.answer("✅ Заявка отправлена администрации. Спасибо!", reply_markup=get_back_keyboard())
    except Exception as e:
        await message.answer(f"Ошибка отправки: {e}")

# --- ОБРАТНАЯ СВЯЗЬ (ИЗ ГРУПП ПОЛЬЗОВАТЕЛЮ) ---
# Бот слушает сообщения в группах. Если это ОТВЕТ (Reply) на пересланное сообщение,
# он отправляет его автору оригинала.

@dp.message(F.chat.id.in_({CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY}))
async def handle_admin_reply(message: types.Message):
    # Проверяем, является ли это ответом на сообщение
    if message.reply_to_message:
        # Проверяем, было ли сообщение, на которое отвечают, переслано ботом от кого-то
        original_msg = message.reply_to_message
        
        # Попытка найти ID пользователя
        user_id = None
        
        if original_msg.forward_from:
            user_id = original_msg.forward_from.id
        
        # Если у пользователя скрытый аккаунт (Forward Privacy), forward_from будет None.
        # В полноценном продакшене тут нужно использовать базу данных для сопоставления ID сообщений.
        # Но для текущей задачи делаем через стандартный механизм.
        
        if user_id:
            try:
                # Копируем сообщение администратора пользователю
                await message.copy_to(chat_id=user_id)
                # Опционально: ставим реакцию в группе, что отправлено
                await message.react([types.ReactionTypeEmoji(emoji="👍")])
            except Exception as e:
                await message.reply(f"Не удалось доставить ответ пользователю: {e}")
        else:
            # Если user_id не найден (скрытый профиль), сообщаем в чат
            await message.reply(
                "⚠️ Не могу ответить пользователю: у него скрытый профиль (Forward Privacy).\n"
                "Попросите пользователей открыть пересылку сообщений в настройках конфиденциальности."
            )

# --- ЗАПУСК ---
async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Бот остановлен")
