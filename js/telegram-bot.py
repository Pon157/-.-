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
from aiogram.exceptions import TelegramForbiddenError, TelegramBadRequest, TelegramAPIError

# --- ЛОГИ ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
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
    cur.execute("""CREATE TABLE IF NOT EXISTS users 
                   (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0, full_name TEXT)""")
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
async def delete_msg_fast(msg: types.Message):
    await asyncio.sleep(5)
    try: await msg.delete()
    except: pass

async def send_temp_status(m: types.Message, text: str):
    try:
        rep = await m.answer(text)
        asyncio.create_task(delete_msg_fast(rep))
    except: pass

# --- КОМАНДЫ АДМИНА (БАН) ---

@dp.message(Command("ban"))
async def cmd_ban(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    
    target_id = None
    # 1. Если указан ID: /ban 12345
    parts = message.text.split()
    if len(parts) > 1 and parts[1].isdigit():
        target_id = int(parts[1])
    # 2. Если ответ на сообщение
    elif message.reply_to_message:
        src = message.reply_to_message.text or message.reply_to_message.caption or ""
        match = re.search(r"ID: (\d+)", src)
        if match: target_id = int(match.group(1))

    if target_id:
        update_user_db(target_id, is_banned=1)
        await message.reply(f"🚫 Пользователь <code>{target_id}</code> <b>ЗАБАНЕН</b>.", parse_mode="HTML")
    else:
        await message.reply("Не удалось найти ID. Либо /ban [ID], либо ответ на инфо-карточку.")

# --- ПОЛЬЗОВАТЕЛЬСКОЕ МЕНЮ ---

def main_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="🎓 Помощь куратора", callback_data="m_curator")
    builder.button(text="✍️ Стресс-тест", callback_data="m_stress")
    builder.button(text="📋 Стать админом", callback_data="m_admin")
    builder.adjust(1)
    return builder.as_markup()

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    _, banned, _ = get_user_data(message.from_user.id)
    if banned: return await message.answer("🚫 Вы заблокированы в системе.")
    await message.answer("Привет! Выберите раздел для бесконечного общения:", reply_markup=main_kb())

@dp.callback_query(F.data == "back_to_menu")
async def back(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=main_kb())

@dp.callback_query(F.data.startswith("m_"))
async def mode_handler(callback: types.CallbackQuery, state: FSMContext):
    uid = callback.from_user.id
    _, banned, name = get_user_data(uid)
    if banned: return await callback.answer("Вы забанены.", show_alert=True)
    
    if not name:
        await state.update_data(target=callback.data)
        await state.set_state(BotStates.registration)
        return await callback.message.edit_text("📝 Введите ваше <b>Имя и Фамилию</b>:", parse_mode="HTML")
    
    await open_infinite_chat(callback.message, state, callback.data, edit=True)

@dp.message(BotStates.registration)
async def process_reg(message: types.Message, state: FSMContext):
    if not message.text or len(message.text) < 3:
        return await message.answer("Введите имя полностью.")
    update_user_db(message.from_user.id, full_name=message.text)
    data = await state.get_data()
    await message.answer(f"Приятно познакомиться, {message.text}!")
    await open_infinite_chat(message, state, data.get("target", "m_curator"), edit=False)

async def open_infinite_chat(message: types.Message, state: FSMContext, mode: str, edit: bool):
    kb = InlineKeyboardBuilder().button(text="🔙 Выйти в меню", callback_data="back_to_menu").as_markup()
    txt = ""
    if "curator" in mode:
        await state.set_state(BotStates.chat_curator)
        txt = "💬 <b>Чат с КУРАТОРОМ открыт.</b>\nПишите всё, что хотите, он увидит."
    elif "stress" in mode:
        await state.set_state(BotStates.chat_stress)
        txt = "🔥 <b>РЕЖИМ ЭКЗАМЕНА.</b>\nЕсли готовы, напишите «Готов»."
    else:
        await state.set_state(BotStates.admin_apply)
        txt = "📋 <b>Чат 'СТАТЬ АДМИНОМ' открыт.</b>\nПишите вашу заявку."

    if edit: await message.edit_text(txt, parse_mode="HTML", reply_markup=kb)
    else: await message.answer(txt, parse_mode="HTML", reply_markup=kb)

# --- БЕСКОНЕЧНЫЙ ЧАТ (ОТ ПОЛЬЗОВАТЕЛЯ) ---

@dp.message(StateFilter(BotStates.chat_curator, BotStates.chat_stress, BotStates.admin_apply))
async def forward_msg(m: types.Message, state: FSMContext):
    cur_id, banned, name = get_user_data(m.from_user.id)
    if banned: return
    
    st = await state.get_state()
    chat_id = CHAT_CURATOR
    tag = "🆕 НОВЫЙ"
    if st == BotStates.chat_curator.state and cur_id: tag = "🔒 УЧЕНИК"
    elif st == BotStates.chat_stress.state: chat_id, tag = CHAT_STRESS_TEST, "⚠️ СТРЕСС"
    elif st == BotStates.admin_apply.state: chat_id, tag = CHAT_ADMIN_APPLY, "📧 ЗАЯВКА"

    header = f"👤 <b>{name}</b>\n{tag} | ID: <code>{m.from_user.id}</code>"
    
    try:
        # Шлем инфо-карточку + само сообщение
        if m.text:
            await bot.send_message(chat_id, f"{header}\n\n📝: {m.text}", parse_mode="HTML")
        else:
            await bot.send_message(chat_id, header, parse_mode="HTML")
            await m.copy_to(chat_id)
        await send_temp_status(m, "✅ Доставлено")
    except Exception as e:
        logger.error(f"Forward error: {e}")

# --- ОТВЕТЫ АДМИНА (С ОБРАБОТКОЙ ОШИБОК) ---

@dp.message(F.reply_to_message)
async def admin_answer(message: types.Message):
    if message.chat.id not in ADMIN_CHATS: return
    
    src = message.reply_to_message.text or message.reply_to_message.caption or ""
    match = re.search(r"ID: (\d+)", src)
    if not match: return
    
    user_id = int(match.group(1))

    try:
        await message.copy_to(user_id)
        # Ставим реакцию, если получилось (только для новых версий ТГ)
        try: await message.react([types.ReactionTypeEmoji(emoji="✍️")])
        except: pass
        
        # Если куратор ответил первым - привязываем его
        if message.chat.id == CHAT_CURATOR:
            c_id, _, _ = get_user_data(user_id)
            if not c_id: update_user_db(user_id, curator_id=message.from_user.id)

    except TelegramForbiddenError:
        await message.reply("❌ <b>ОШИБКА:</b> Пользователь заблокировал бота. Сообщение не доставлено.")
    except TelegramBadRequest as e:
        await message.reply(f"❌ <b>ОШИБКА:</b> Некорректный запрос или пользователь удалил чат. ({e.message})")
    except TelegramAPIError as e:
        await message.reply(f"❌ <b>КРИТИЧЕСКАЯ ОШИБКА:</b> Сообщение не ушло. Текст: {e.message}")
    except Exception as e:
        logger.error(f"Global reply error: {e}")
        await message.reply("❌ Неизвестная техническая ошибка при отправке.")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
