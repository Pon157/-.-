import asyncio
import logging
import re
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command, StateFilter
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
    return InlineKeyboardBuilder().button(text="🔙 Выйти в меню", callback_data="back_to_menu").as_markup()

# --- ХЕНДЛЕРЫ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(f"Привет, {message.from_user.first_name}! Выберите раздел:", reply_markup=get_main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=get_main_kb())

@dp.callback_query(F.data.startswith("mode_"))
async def modes_handler(callback: types.CallbackQuery, state: FSMContext):
    if callback.data == "mode_curator":
        await state.set_state(BotStates.chat_curator)
        await callback.message.edit_text("💬 ЧАТ С КУРАТОРОМ\nПишите ваши сообщения:", reply_markup=get_back_kb())
    elif callback.data == "mode_stress":
        await state.set_state(BotStates.chat_stress)
        await callback.message.edit_text("🔥 РЕЖИМ СТРЕСС-ТЕСТА\nЭкзаменатор на связи:", reply_markup=get_back_kb())
    elif callback.data == "mode_admin":
        await state.set_state(BotStates.admin_apply)
        await callback.message.edit_text("📋 ЧАТ ПО ЗАЯВКАМ\nПишите подробности:", reply_markup=get_back_kb())

# --- БЕСКОНЕЧНЫЙ ЧАТ (ИСПРАВЛЕННЫЙ ФИЛЬТР) ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def process_infinite_chat(m: types.Message, state: FSMContext):
    current_state = await state.get_state()
    target_chat = None
    prefix = ""

    if current_state == BotStates.chat_curator.state:
        target_chat = CHAT_CURATOR
        cur_id, _ = get_user_data(m.from_user.id)
        prefix = "🔒 ВАШ УЧЕНИК" if cur_id else "🆕 КУРАТОР (НОВЫЙ)"
    elif current_state == BotStates.chat_stress.state:
        target_chat = CHAT_STRESS_TEST
        prefix = "⚠️ СТРЕСС-ТЕСТ"
    elif current_state == BotStates.admin_apply.state:
        target_chat = CHAT_ADMIN_APPLY
        prefix = "📧 ЗАЯВКА"

    try:
        await bot.send_message(target_chat, f"👤 {prefix}\nID: <code>{m.from_user.id}</code>", parse_mode="HTML")
        await m.copy_to(target_chat)
        await safe_send_report(m, "Доставлено", True)
    except Exception:
        await safe_send_report(m, "Ошибка отправки", False)

# --- ОТВЕТЫ ---
@dp.message(F.reply_to_message)
async def handle_admin_reply(message: types.Message):
    if message.chat.id not in [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]: return
    match = re.search(r"ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
    if not match: return
    
    user_id = int(match.group(1))
    if message.chat.id == CHAT_CURATOR:
        cur_id, _ = get_user_data(user_id)
        if not cur_id: set_curator(user_id, message.from_user.id)

    try:
        await message.copy_to(user_id)
        try: await message.react([types.ReactionTypeEmoji(emoji="✅")])
        except: pass
    except:
        await message.reply("❌ Не доставлено.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
