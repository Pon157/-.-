import asyncio
import logging
import re
import sqlite3
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.exceptions import TelegramAPIError, TelegramForbiddenError, TelegramBadRequest

# --- ЛОГИ ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger(__name__)

# --- КОНФИГУРАЦИЯ ---
script_dir = Path(__file__).parent
env_path = script_dir / '.env' if (script_dir / '.env').exists() else script_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)
TOKEN = os.getenv("BOT_TOKEN")

CHAT_CURATOR = -1003550048093
CHAT_STRESS_TEST = -1003584211374
CHAT_ADMIN_APPLY = -1003686254634
ADMIN_CHATS = [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]

# --- БД ---
db_path = script_dir / "academy_pro.db"
def init_db():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0, full_name TEXT)")
    try: cur.execute("ALTER TABLE users ADD COLUMN full_name TEXT")
    except: pass
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
    if curator_id is not None: cur.execute("UPDATE users SET curator_id = ? WHERE user_id = ?", (curator_id, user_id))
    if full_name is not None: cur.execute("UPDATE users SET full_name = ? WHERE user_id = ?", (full_name, user_id))
    if is_banned is not None: cur.execute("UPDATE users SET is_banned = ? WHERE user_id = ?", (is_banned, user_id))
    conn.commit()
    conn.close()

init_db()

# --- БОТ ---
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())

class BotStates(StatesGroup):
    registration = State()
    chat_curator = State()
    chat_stress = State()
    admin_apply = State()

# --- ВСПОМОГАТЕЛЬНЫЕ ---
async def delete_after_5s(msg: types.Message):
    await asyncio.sleep(5)
    try: await msg.delete()
    except: pass

async def send_report(m: types.Message, text: str):
    rep = await m.answer(f"✅ {text}")
    asyncio.create_task(delete_after_5s(rep))

# --- КЛАВИАТУРЫ ---
def get_main_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="m_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="m_stress")
    builder.button(text="📋 Стать админом", callback_data="m_admin")
    builder.adjust(1)
    return builder.as_markup()

# --- ХЕНДЛЕРЫ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(f"Привет! Выберите раздел:", reply_markup=get_main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=get_main_kb())

@dp.callback_query(F.data.startswith("m_"))
async def mode_select(callback: types.CallbackQuery, state: FSMContext):
    _, _, name = get_user_data(callback.from_user.id)
    if not name:
        await state.update_data(target=callback.data)
        await state.set_state(BotStates.registration)
        return await callback.message.edit_text("📝 Введите ваше <b>Имя и Фамилию</b>:", parse_mode="HTML")
    
    await enter_chat(callback.message, state, callback.data, True)

@dp.message(BotStates.registration)
async def reg_done(message: types.Message, state: FSMContext):
    update_user_db(message.from_user.id, full_name=message.text)
    data = await state.get_data()
    await message.answer(f"Приятно познакомиться, {message.text}!")
    await enter_chat(message, state, data.get("target", "m_curator"), False)

async def enter_chat(message: types.Message, state: FSMContext, mode: str, edit: bool):
    kb = InlineKeyboardBuilder().button(text="🔙 Меню", callback_data="back_to_menu").as_markup()
    if "curator" in mode:
        await state.set_state(BotStates.chat_curator)
        txt = "💬 Чат с куратором открыт."
    elif "stress" in mode:
        await state.set_state(BotStates.chat_stress)
        txt = "🔥 ЭКЗАМЕН. Напишите «Готов»."
    else:
        await state.set_state(BotStates.admin_apply)
        txt = "📋 Чат 'Стать админом' открыт."

    if edit: await message.edit_text(txt, reply_markup=kb)
    else: await message.answer(txt, reply_markup=kb)

# --- ПЕРЕСЫЛКА (ОТ ПОЛЬЗОВАТЕЛЯ К АДМИНУ) ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def forward_to_admin(m: types.Message, state: FSMContext):
    cur_id, banned, name = get_user_data(m.from_user.id)
    if banned: return
    
    st = await state.get_state()
    chat = CHAT_CURATOR
    label = "🆕 КУРАТОР"
    if st == BotStates.chat_curator.state and cur_id: label = "🔒 УЧЕНИК"
    elif st == BotStates.chat_stress.state: chat, label = CHAT_STRESS_TEST, "⚠️ СТРЕСС"
    elif st == BotStates.admin_apply.state: chat, label = CHAT_ADMIN_APPLY, "📧 ЗАЯВКА"

    header = f"👤 <b>{name}</b>\n{label} | ID: <code>{m.from_user.id}</code>"
    
    try:
        if m.text:
            await bot.send_message(chat, f"{header}\n\nСообщение: {m.text}", parse_mode="HTML")
        else:
            await bot.send_message(chat, header, parse_mode="HTML")
            await m.copy_to(chat)
        await send_report(m, "Отправлено")
    except Exception as e:
        logger.error(e)

# --- ОТВЕТЫ (ОТ АДМИНА К ПОЛЬЗОВАТЕЛЮ) ---

@dp.message(F.reply_to_message)
async def admin_reply(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    
    # Ищем ID в тексте сообщения, на которое отвечаем
    src = message.reply_to_message.text or message.reply_to_message.caption or ""
    match = re.search(r"ID: (\d+)", src)
    if not match: return
    
    user_id = int(match.group(1))
    
    if message.chat.id == CHAT_CURATOR:
        c_id, _, _ = get_user_data(user_id)
        if not c_id: update_user_db(user_id, curator_id=message.from_user.id)

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
