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

# --- КОНФИГУРАЦИЯ ---
script_dir = Path(__file__).parent
env_path = script_dir / '.env' if (script_dir / '.env').exists() else script_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)
TOKEN = os.getenv("BOT_TOKEN")

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

# Клавиатуры
def get_main_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="mode_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="mode_stress")
    builder.button(text="📋 Стать админом", callback_data="mode_admin")
    builder.adjust(1)
    return builder.as_markup()

def get_back_kb():
    return InlineKeyboardBuilder().button(text="🔙 Назад в меню", callback_data="back_to_menu").as_markup()

# --- ХЕНДЛЕРЫ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(f"Привет, {message.from_user.first_name}! Выберите раздел:", reply_markup=get_main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=get_main_kb())

# Вход в режимы
@dp.callback_query(F.data == "mode_curator")
async def start_cur(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.chat_curator)
    await callback.message.edit_text("💬 Напишите вопрос куратору:", reply_markup=get_back_kb())

@dp.callback_query(F.data == "mode_stress")
async def start_stress(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.chat_stress)
    await callback.message.edit_text("🔥 Режим Стресс-теста. Пишите ответ:", reply_markup=get_back_kb())

@dp.callback_query(F.data == "mode_admin")
async def start_admin(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.admin_apply)
    await callback.message.edit_text("📋 Напишите вашу заявку:", reply_markup=get_back_kb())

# Пересылка сообщений
@dp.message(BotStates.chat_curator)
async def proc_cur(m: types.Message):
    cur_id, _ = get_user_data(m.from_user.id)
    pref = "🔒 ВАШ УЧЕНИК" if cur_id else "🆕 НОВЫЙ"
    await bot.send_message(CHAT_CURATOR, f"👤 {pref}\nID: <code>{m.from_user.id}</code>", parse_mode="HTML")
    await m.copy_to(CHAT_CURATOR)
    await m.answer("✅ Куратор уведомлен.")

@dp.message(BotStates.chat_stress)
async def proc_stress(m: types.Message):
    await bot.send_message(CHAT_STRESS_TEST, f"⚠️ СТРЕСС-ТЕСТ\nID: <code>{m.from_user.id}</code>", parse_mode="HTML")
    await m.copy_to(CHAT_STRESS_TEST)
    await m.answer("✅ Экзаменатор получил ответ.")

@dp.message(BotStates.admin_apply)
async def proc_admin(m: types.Message):
    await bot.send_message(CHAT_ADMIN_APPLY, f"📧 ЗАЯВКА\nID: <code>{m.from_user.id}</code>", parse_mode="HTML")
    await m.copy_to(CHAT_ADMIN_APPLY)
    await m.answer("✅ Заявка отправлена.")

# ОТВЕТЫ АДМИНОВ
@dp.message(F.reply_to_message)
async def handle_reply(message: types.Message):
    if message.chat.id not in [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]: return
    match = re.search(r"ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
    if not match: return
    
    user_id = int(match.group(1))
    if message.chat.id == CHAT_CURATOR:
        cur_id, _ = get_user_data(user_id)
        if not cur_id: set_curator(user_id, message.from_user.id)

    try:
        await message.copy_to(user_id)
        # Если это текстовое сообщение, ставим реакцию
        try: await message.react([types.ReactionTypeEmoji(emoji="✅")])
        except: pass
    except Exception as e:
        await message.reply(f"❌ Ошибка: пользователь заблокировал бота.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
