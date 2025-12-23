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

# --- НАСТРОЙКА ЛОГОВ ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("bot_errors.log"), logging.StreamHandler(sys.stdout)]
)
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

# --- БАЗА ДАННЫХ ---
db_path = script_dir / "academy_pro.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS users 
                   (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0, full_name TEXT)""")
    # Миграция
    cur.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cur.fetchall()]
    if 'full_name' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN full_name TEXT")
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
async def delete_after_delay(message: types.Message, delay: int = 5):
    await asyncio.sleep(delay)
    try: await message.delete()
    except: pass

async def send_status(message: types.Message, text: str):
    try:
        msg = await message.answer(f"✅ {text}")
        asyncio.create_task(delete_after_delay(msg))
    except: pass

def main_menu_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Куратор", callback_data="m_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="m_stress")
    builder.button(text="📋 Заявка / Сертификат", callback_data="m_admin")
    builder.adjust(1)
    return builder.as_markup()

def back_kb():
    return InlineKeyboardBuilder().button(text="🔙 Меню", callback_data="back_to_menu").as_markup()

# --- ЛОГИКА ПЕРЕХОДОВ ---
async def enter_mode(message: types.Message, state: FSMContext, mode: str, is_callback: bool = True):
    text = ""
    if "curator" in mode:
        await state.set_state(BotStates.chat_curator)
        text = "💬 <b>Чат с куратором открыт.</b>\nПишите ваши сообщения. Куратор скоро ответит."
    elif "stress" in mode:
        await state.set_state(BotStates.chat_stress)
        text = "🔥 <b>ЭКЗАМЕН (СТРЕСС-ТЕСТ)</b>\nЕсли вы готовы, напишите «Готов»."
    elif "admin" in mode:
        await state.set_state(BotStates.admin_apply)
        text = "📋 <b>Чат по заявкам и сертификатам.</b>\nОпишите ваш запрос:"

    if is_callback:
        try:
            await message.edit_text(text, parse_mode="HTML", reply_markup=back_kb())
        except TelegramBadRequest:
            await message.answer(text, parse_mode="HTML", reply_markup=back_kb())
    else:
        await message.answer(text, parse_mode="HTML", reply_markup=back_kb())

# --- ХЕНДЛЕРЫ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    _, banned, _ = get_user_data(message.from_user.id)
    if banned: return await message.answer("❌ Доступ ограничен.")
    await message.answer(f"Привет, {message.from_user.first_name}! Выберите раздел:", reply_markup=main_menu_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=main_menu_kb())

@dp.callback_query(F.data.startswith("m_"))
async def handle_mode_button(callback: types.CallbackQuery, state: FSMContext):
    uid = callback.from_user.id
    _, banned, full_name = get_user_data(uid)
    if banned: return await callback.answer("Бан.", show_alert=True)
    
    if not full_name:
        await state.update_data(target=callback.data)
        await state.set_state(BotStates.registration)
        return await callback.message.edit_text("📝 Перед началом введите ваше <b>Имя и Фамилию</b>:", parse_mode="HTML")

    await enter_mode(callback.message, state, callback.data, is_callback=True)

@dp.message(BotStates.registration)
async def process_registration(message: types.Message, state: FSMContext):
    if not message.text or len(message.text) < 3:
        return await message.answer("Пожалуйста, введите имя полностью.")
    
    update_user_db(message.from_user.id, full_name=message.text)
    data = await state.get_data()
    target_mode = data.get("target", "m_curator")
    
    await message.answer(f"Приятно познакомиться, {message.text}!")
    await enter_mode(message, state, target_mode, is_callback=False)

# --- БЕСКОНЕЧНАЯ ПЕРЕСЫЛКА ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def handle_user_messages(m: types.Message, state: FSMContext):
    cur_id, banned, full_name = get_user_data(m.from_user.id)
    if banned: return
    
    st = await state.get_state()
    target_chat = CHAT_CURATOR
    label = "🆕 КУРАТОР"
    
    if st == BotStates.chat_curator.state:
        if cur_id: label = "🔒 ВАШ УЧЕНИК"
    elif st == BotStates.chat_stress.state:
        target_chat = CHAT_STRESS_TEST
        label = "⚠️ СТРЕСС"
    elif st == BotStates.admin_apply.state:
        target_chat = CHAT_ADMIN_APPLY
        label = "📧 ЗАЯВКА"

    try:
        # Инфо-карточка для куратора/админа
        info_msg = f"👤 <b>{full_name}</b>\n{label} | ID: <code>{m.from_user.id}</code>"
        await bot.send_message(target_chat, info_msg, parse_mode="HTML")
        await m.copy_to(target_chat)
        await send_status(m, "Доставлено")
    except Exception as e:
        logger.error(f"Ошибка пересылки: {e}")
        await m.answer("❌ Ошибка отправки.")

# --- ОТВЕТЫ КУРАТОРОВ / АДМИНОВ ---

@dp.message(F.reply_to_message)
async def handle_replies(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    
    # Извлекаем ID из сообщения, на которое отвечаем
    source = message.reply_to_message.text or message.reply_to_message.caption or ""
    match = re.search(r"ID: (\d+)", source)
    if not match: return
    
    user_id = int(match.group(1))
    
    # Привязка куратора
    if message.chat.id == CHAT_CURATOR:
        cur_id, _, _ = get_user_data(user_id)
        if not cur_id:
            update_user_db(user_id, curator_id=message.from_user.id)

    try:
        await message.copy_to(user_id)
        try: await message.react([types.ReactionTypeEmoji(emoji="✅")])
        except: pass
    except TelegramForbiddenError:
        await message.reply("❌ Пользователь заблокировал бота.")
    except Exception as e:
        logger.error(f"Ошибка ответа: {e}")
        await message.reply("❌ Ошибка доставки.")

# --- МОДЕРАЦИЯ ---
@dp.message(Command("ban"))
async def cmd_ban(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    uid = None
    if len(message.text.split()) > 1: uid = int(message.text.split()[1])
    elif message.reply_to_message:
        match = re.search(r"ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
        if match: uid = int(match.group(1))
    
    if uid:
        update_user_db(uid, is_banned=1)
        await message.reply(f"🚫 Пользователь {uid} забанен.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Бот запущен...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
