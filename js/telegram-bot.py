import asyncio
import logging
import re
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.exceptions import TelegramBadRequest

# --- КОНФИГУРАЦИЯ ---
script_dir = Path(__file__).parent
env_path = script_dir / '.env' if (script_dir / '.env').exists() else script_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)
TOKEN = os.getenv("BOT_TOKEN")

# Твои ID чатов
CHAT_CURATOR = -1003550048093
CHAT_STRESS_TEST = -1003584211374
CHAT_ADMIN_APPLY = -1003686254634

# --- БАЗА ДАННЫХ ---
db_path = script_dir / "academy_pro.db"
def init_db():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0)")
    conn.commit()
    conn.close()

def get_user_data(user_id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT curator_id, is_banned FROM users WHERE user_id = ?", (user_id,))
    data = cur.fetchone()
    conn.close()
    return data if data else (None, 0)

def set_curator(user_id, curator_id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))
    cur.execute("UPDATE users SET curator_id = ? WHERE user_id = ?", (curator_id, user_id))
    conn.commit()
    conn.close()

init_db()

# --- БОТ ---
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

class BotStates(StatesGroup):
    chat_curator = State()
    chat_stress = State()
    admin_apply = State()

# --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

async def delete_after_delay(message: types.Message, delay: int = 5):
    await asyncio.sleep(delay)
    try:
        await message.delete()
    except:
        pass

async def safe_send_report(message: types.Message, text: str, success: bool):
    symbol = "✅" if success else "❌"
    report = await message.answer(f"{symbol} {text}")
    asyncio.create_task(delete_after_delay(report, 5))

# --- КЛАВИАТУРЫ ---
def get_main_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="mode_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="mode_stress")
    builder.button(text="📋 Стать админом", callback_data="mode_admin")
    builder.adjust(1)
    return builder.as_markup()

def get_back_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🔙 Выйти из чата / Меню", callback_data="back_to_menu")
    return builder.as_markup()

# --- ХЕНДЛЕРЫ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(f"Привет, {message.from_user.first_name}! Выберите раздел для общения:", reply_markup=get_main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Вы вышли из чата. Главное меню:", reply_markup=get_main_kb())

@dp.callback_query(F.data.startswith("mode_"))
async def modes_handler(callback: types.CallbackQuery, state: FSMContext):
    if callback.data == "mode_curator":
        await state.set_state(BotStates.chat_curator)
        await callback.message.edit_text("💬 Чат с куратором открыт. Пишите ваши сообщения. Для выхода нажмите кнопку ниже:", reply_markup=get_back_kb())
    elif callback.data == "mode_stress":
        await state.set_state(BotStates.chat_stress)
        await callback.message.edit_text("🔥 Режим Стресс-теста активен. Экзаменатор на связи:", reply_markup=get_back_kb())
    elif callback.data == "mode_admin":
        await state.set_state(BotStates.admin_apply)
        await callback.message.edit_text("📋 Чат по заявкам. Пишите подробности:", reply_markup=get_back_kb())

# --- БЕСКОНЕЧНАЯ ПЕРЕСЫЛКА ---

@dp.message(state=[BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply])
async def process_infinite_chat(m: types.Message, state: FSMContext):
    current_state = await state.get_state()
    
    target_chat = None
    prefix = ""
    
    if current_state == BotStates.chat_curator:
        target_chat = CHAT_CURATOR
        cur_id, _ = get_user_data(m.from_user.id)
        prefix = "🔒 ВАШ УЧЕНИК" if cur_id else "🆕 КУРАТОР (НОВЫЙ)"
    elif current_state == BotStates.chat_stress:
        target_chat = CHAT_STRESS_TEST
        prefix = "⚠️ СТРЕСС-ТЕСТ"
    elif current_state == BotStates.admin_apply:
        target_chat = CHAT_ADMIN_APPLY
        prefix = "📧 ЗАЯВКА"

    try:
        # Отправляем инфо-карточку только если это не текстовый ответ (чтобы не спамить карточками)
        # Но для простоты оставим карточку перед каждым сообщением, чтобы админ мог нажать Reply
        await bot.send_message(target_chat, f"👤 {prefix}\nID: <code>{m.from_user.id}</code>", parse_mode="HTML")
        await m.copy_to(target_chat)
        await safe_send_report(m, "Доставлено", True)
    except Exception as e:
        await safe_send_report(m, "Ошибка доставки", False)

# --- ОТВЕТЫ АДМИНОВ ПОЛЬЗОВАТЕЛЮ ---

@dp.message(F.reply_to_message)
async def handle_admin_reply(message: types.Message):
    # Проверяем, что админ пишет в одном из рабочих чатов
    if message.chat.id not in [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]:
        return

    # Ищем ID пользователя в сообщении, на которое отвечает админ
    match = re.search(r"ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
    if not match:
        return

    user_id = int(match.group(1))

    # Если это чат кураторов, закрепляем его
    if message.chat.id == CHAT_CURATOR:
        cur_id, _ = get_user_data(user_id)
        if not cur_id:
            set_curator(user_id, message.from_user.id)

    try:
        # Пересылаем ответ админа пользователю
        await message.copy_to(user_id)
        # Ставим реакцию админу, что ушло
        try:
            await message.react([types.ReactionTypeEmoji(emoji="✅")])
        except:
            pass
    except Exception:
        await message.reply("❌ Не удалось отправить ответ. Возможно, пользователь заблокировал бота.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
