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
ADMIN_CHATS = [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]

# --- БАЗА ДАННЫХ ---
db_path = script_dir / "academy_pro.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS users 
                   (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0, full_name TEXT)""")
    conn.commit()
    conn.close()

def get_user_data(user_id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT curator_id, is_banned, full_name FROM users WHERE user_id = ?", (user_id,))
    data = cur.fetchone()
    conn.close()
    return data if data else (None, 0, None)

def update_user_db(user_id, curator_id=None, full_name=None, is_banned=None):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))
    if curator_id is not None:
        cur.execute("UPDATE users SET curator_id = ? WHERE user_id = ?", (curator_id, user_id))
    if full_name is not None:
        cur.execute("UPDATE users SET full_name = ? WHERE user_id = ?", (full_name, user_id))
    if is_banned is not None:
        cur.execute("UPDATE users SET is_banned = ? WHERE user_id = ?", (is_banned, user_id))
    conn.commit()
    conn.close()

init_db()

# --- БОТ ---
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

class BotStates(StatesGroup):
    registration = State()
    chat_curator = State()
    chat_stress = State()
    admin_apply = State()

# --- ВСПОМОГАТЕЛЬНЫЕ ---
async def delete_after_delay(message: types.Message, delay: int = 5):
    await asyncio.sleep(delay)
    try: await message.delete()
    except: pass

async def safe_send_report(message: types.Message, text: str):
    report = await message.answer(f"✅ {text}")
    asyncio.create_task(delete_after_delay(report, 5))

def get_main_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="btn_mode_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="btn_mode_stress")
    builder.button(text="📋 Заявка / Сертификат", callback_data="btn_mode_admin")
    builder.adjust(1)
    return builder.as_markup()

def get_back_kb():
    return InlineKeyboardBuilder().button(text="🔙 Меню", callback_data="back_to_menu").as_markup()

# --- ХЕНДЛЕРЫ МОДЕРАЦИИ (ДЛЯ АДМИНОВ) ---

@dp.message(Command("ban"))
async def cmd_ban(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    
    user_id = None
    # Если написали /ban ID
    parts = message.text.split()
    if len(parts) > 1:
        user_id = int(parts[1])
    # Если ответили на сообщение пользователя командой /ban
    elif message.reply_to_message:
        source = message.reply_to_message.text or message.reply_to_message.caption or ""
        match = re.search(r"ID: (\d+)", source)
        if match: user_id = int(match.group(1))

    if user_id:
        update_user_db(user_id, is_banned=1)
        await message.reply(f"🚫 Пользователь <code>{user_id}</code> забанен.", parse_mode="HTML")
    else:
        await message.reply("Не удалось найти ID. Используйте: /ban [ID] или ответьте на сообщение.")

@dp.message(Command("kick"))
async def cmd_kick(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    parts = message.text.split()
    if len(parts) > 1:
        user_id = int(parts[1])
        update_user_db(user_id, curator_id=0) # Сброс привязки
        await message.reply(f"🔄 Привязка куратора для <code>{user_id}</code> сброшена.", parse_mode="HTML")

# --- ПОЛЬЗОВАТЕЛЬСКАЯ ЧАСТЬ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    _, banned, _ = get_user_data(message.from_user.id)
    if banned: return await message.answer("❌ Вы заблокированы модератором.")
    await message.answer(f"Привет! Выберите раздел:", reply_markup=get_main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=get_main_kb())

@dp.callback_query(F.data.startswith("btn_mode_"))
async def check_reg(callback: types.CallbackQuery, state: FSMContext):
    _, banned, full_name = get_user_data(callback.from_user.id)
    if banned: return await callback.answer("Вы забанены.", show_alert=True)
    
    if not full_name:
        await state.update_data(target_mode=callback.data)
        await state.set_state(BotStates.registration)
        await callback.message.edit_text("📝 Введите ваше <b>Имя и Фамилию</b>:", parse_mode="HTML")
        return
    await enter_mode(callback.message, state, callback.data)

@dp.message(BotStates.registration)
async def process_reg(message: types.Message, state: FSMContext):
    update_user_db(message.from_user.id, full_name=message.text)
    data = await state.get_data()
    await message.answer(f"Приятно познакомиться, {message.text}!")
    await enter_mode(message, state, data.get("target_mode", "btn_mode_curator"))

async def enter_mode(message: types.Message, state: FSMContext, mode: str):
    if "curator" in mode:
        await state.set_state(BotStates.chat_curator)
        await message.answer("💬 ЧАТ С КУРАТОРОМ открыт.", reply_markup=get_back_kb())
    elif "stress" in mode:
        await state.set_state(BotStates.chat_stress)
        await message.answer("🔥 РЕЖИМ СТРЕСС-ТЕСТА\n<b>Если вы готовы, напишите «Готов»</b>", parse_mode="HTML", reply_markup=get_back_kb())
    elif "admin" in mode:
        await state.set_state(BotStates.admin_apply)
        await message.answer("📋 ЧАТ ПО ЗАЯВКАМ / СЕРТИФИКАТАМ.", reply_markup=get_back_kb())

# --- БЕСКОНЕЧНЫЙ ЧАТ ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def process_infinite_chat(m: types.Message, state: FSMContext):
    _, banned, full_name = get_user_data(m.from_user.id)
    if banned: return await m.answer("❌ Вы заблокированы.")

    current_state = await state.get_state()
    target_chat = CHAT_CURATOR
    prefix = "🆕 КУРАТОР"
    
    if current_state == BotStates.chat_curator.state:
        cur_id, _, _ = get_user_data(m.from_user.id)
        if cur_id: prefix = "🔒 ВАШ УЧЕНИК"
    elif current_state == BotStates.chat_stress.state:
        target_chat = CHAT_STRESS_TEST
        prefix = "⚠️ СТРЕСС-ТЕСТ"
    elif current_state == BotStates.admin_apply.state:
        target_chat = CHAT_ADMIN_APPLY
        prefix = "📧 ЗАЯВКА/СЕРТИФИКАТ"

    try:
        await bot.send_message(target_chat, f"👤 <b>{full_name}</b>\n{prefix} | ID: <code>{m.from_user.id}</code>", parse_mode="HTML")
        await m.copy_to(target_chat)
        await safe_send_report(m, "Доставлено")
    except:
        await m.answer("❌ Ошибка отправки.")

# --- ОТВЕТЫ ---
@dp.message(F.reply_to_message)
async def handle_admin_reply(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    source = message.reply_to_message.text or message.reply_to_message.caption or ""
    match = re.search(r"ID: (\d+)", source)
    if not match: return
    
    user_id = int(match.group(1))
    if message.chat.id == CHAT_CURATOR:
        cur_id, _, _ = get_user_data(user_id)
        if not cur_id: update_user_db(user_id, curator_id=message.from_user.id)

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
