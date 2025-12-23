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
from aiogram.exceptions import TelegramAPIError, TelegramForbiddenError

# --- ЛОГИРОВАНИЕ ---
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

# --- БАЗА ДАННЫХ С АВТО-ИСПРАВЛЕНИЕМ ---
db_path = script_dir / "academy_pro.db"

def init_db():
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("""CREATE TABLE IF NOT EXISTS users 
                       (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0, full_name TEXT)""")
        
        # Проверка и добавление колонки full_name (миграция)
        cur.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cur.fetchall()]
        if 'full_name' not in columns:
            logger.info("Обновление базы данных: добавление колонки full_name")
            cur.execute("ALTER TABLE users ADD COLUMN full_name TEXT")
        
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        logger.critical(f"Ошибка инициализации БД: {e}")
        sys.exit(1)

def get_user_data(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT curator_id, is_banned, full_name FROM users WHERE user_id = ?", (user_id,))
        data = cur.fetchone()
        conn.close()
        return data if data else (None, 0, None)
    except sqlite3.Error as e:
        logger.error(f"Ошибка получения данных (ID {user_id}): {e}")
        return (None, 0, None)

def update_user_db(user_id, curator_id=None, full_name=None, is_banned=None):
    try:
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
    except sqlite3.Error as e:
        logger.error(f"Ошибка обновления БД (ID {user_id}): {e}")

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
async def safe_delete(message: types.Message, delay: int = 5):
    await asyncio.sleep(delay)
    try:
        await message.delete()
    except Exception:
        pass

async def notify_status(message: types.Message, text: str, success: bool = True):
    symbol = "✅" if success else "❌"
    try:
        msg = await message.answer(f"{symbol} {text}")
        asyncio.create_task(safe_delete(msg))
    except Exception as e:
        logger.error(f"Не удалось отправить уведомление: {e}")

# --- ХЕНДЛЕРЫ МОДЕРАЦИИ ---

@dp.message(Command("ban"))
async def cmd_ban(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    user_id = None
    if len(message.text.split()) > 1:
        user_id = int(message.text.split()[1])
    elif message.reply_to_message:
        match = re.search(r"ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
        if match: user_id = int(match.group(1))
    
    if user_id:
        update_user_db(user_id, is_banned=1)
        await message.reply(f"🚫 Пользователь {user_id} забанен.")
    else:
        await message.reply("ID не найден. Ответьте на сообщение или введите /ban [ID]")

# --- ПОЛЬЗОВАТЕЛЬСКАЯ ЛОГИКА ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    _, banned, _ = get_user_data(message.from_user.id)
    if banned:
        return await message.answer("❌ Доступ к боту ограничен.")
    
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Куратор", callback_data="m_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="m_stress")
    builder.button(text="📋 Заявка / Сертификат", callback_data="m_admin")
    builder.adjust(1)
    
    await message.answer(f"Привет, {message.from_user.first_name}! Выберите раздел:", reply_markup=builder.as_markup())

@dp.callback_query(F.data == "back_to_menu")
async def back_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Куратор", callback_data="m_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="m_stress")
    builder.button(text="📋 Заявка / Сертификат", callback_data="m_admin")
    builder.adjust(1)
    await callback.message.edit_text("Главное меню:", reply_markup=builder.as_markup())

@dp.callback_query(F.data.startswith("m_"))
async def start_mode(callback: types.CallbackQuery, state: FSMContext):
    uid = callback.from_user.id
    _, banned, full_name = get_user_data(uid)
    if banned: return await callback.answer("Бан.", show_alert=True)
    
    if not full_name:
        await state.update_data(target=callback.data)
        await state.set_state(BotStates.registration)
        return await callback.message.edit_text("📝 Введите ваше <b>Имя и Фамилию</b>:", parse_mode="HTML")

    mode = callback.data
    kb = InlineKeyboardBuilder().button(text="🔙 Меню", callback_data="back_to_menu").as_markup()
    
    if mode == "m_curator":
        await state.set_state(BotStates.chat_curator)
        await callback.message.edit_text("💬 Чат с куратором открыт. Пишите сообщение:", reply_markup=kb)
    elif mode == "m_stress":
        await state.set_state(BotStates.chat_stress)
        await callback.message.edit_text("🔥 ЭКЗАМЕН\n<b>Если вы готовы, напишите «Готов»</b>", parse_mode="HTML", reply_markup=kb)
    elif mode == "m_admin":
        await state.set_state(BotStates.admin_apply)
        await callback.message.edit_text("📋 Чат по заявкам / сертификатам открыт:", reply_markup=kb)

@dp.message(BotStates.registration)
async def process_reg(message: types.Message, state: FSMContext):
    if not message.text or len(message.text) < 3:
        return await message.answer("Введите корректные Имя и Фамилию.")
    
    update_user_db(message.from_user.id, full_name=message.text)
    data = await state.get_data()
    await message.answer(f"Приятно познакомиться, {message.text}!")
    # Имитируем нажатие кнопки режима после регистрации
    callback_data = data.get("target", "m_curator")
    await start_mode(types.CallbackQuery(id="0", from_user=message.from_user, chat_instance="0", message=message, data=callback_data), state)

# --- ПЕРЕСЫЛКА ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def handle_user_msg(m: types.Message, state: FSMContext):
    _, banned, full_name = get_user_data(m.from_user.id)
    if banned: return
    
    st = await state.get_state()
    target = CHAT_CURATOR
    label = "🆕 КУРАТОР"
    
    if st == BotStates.chat_curator.state:
        cur_id, _, _ = get_user_data(m.from_user.id)
        if cur_id: label = "🔒 ВАШ УЧЕНИК"
    elif st == BotStates.chat_stress.state:
        target = CHAT_STRESS_TEST
        label = "⚠️ СТРЕСС"
    elif st == BotStates.admin_apply.state:
        target = CHAT_ADMIN_APPLY
        label = "📧 ЗАЯВКА"

    try:
        await bot.send_message(target, f"👤 <b>{full_name}</b>\n{label} | ID: <code>{m.from_user.id}</code>", parse_mode="HTML")
        await m.copy_to(target)
        await notify_status(m, "Доставлено")
    except Exception as e:
        logger.error(f"Ошибка пересылки от {m.from_user.id}: {e}")
        await notify_status(m, "Ошибка отправки", False)

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
    except TelegramForbiddenError:
        await message.reply("❌ Пользователь заблокировал бота.")
    except Exception as e:
        logger.error(f"Ошибка ответа админа: {e}")
        await message.reply("❌ Ошибка при доставке.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Бот запущен...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
