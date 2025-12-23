import asyncio
import logging
import re
import sqlite3
import os
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import InlineKeyboardBuilder

# --- КОНФИГУРАЦИЯ ---
load_dotenv()  # Загружаем переменные из .env
TOKEN = os.getenv("BOT_TOKEN")

# Твои актуальные ID
CHAT_CURATOR = -1003550048093
CHAT_STRESS_TEST = -1003584211374
CHAT_ADMIN_APPLY = -1003686254634


# --- БАЗА ДАННЫХ (Привязка кураторов и Баны) ---
def init_db():
    conn = sqlite3.connect("academy_pro.db")
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS users 
                   (user_id INTEGER PRIMARY KEY, curator_id INTEGER, is_banned INTEGER DEFAULT 0)""")
    conn.commit()
    conn.close()


def get_user_data(user_id):
    conn = sqlite3.connect("academy_pro.db")
    cur = conn.cursor()
    cur.execute("SELECT curator_id, is_banned FROM users WHERE user_id = ?", (user_id,))
    data = cur.fetchone()
    conn.close()
    return data if data else (None, 0)


def set_curator(user_id, curator_id):
    conn = sqlite3.connect("academy_pro.db")
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))
    cur.execute("UPDATE users SET curator_id = ? WHERE user_id = ?", (curator_id, user_id))
    conn.commit()
    conn.close()


def set_ban(user_id, status):
    conn = sqlite3.connect("academy_pro.db")
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))
    cur.execute("UPDATE users SET is_banned = ? WHERE user_id = ?", (status, user_id))
    conn.commit()
    conn.close()


init_db()

# --- ИНИЦИАЛИЗАЦИЯ БОТА ---
bot = Bot(token=TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)


class BotStates(StatesGroup):
    menu = State()
    chat_curator = State()
    chat_stress = State()
    admin_apply = State()


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
    builder.button(text="🔙 Назад в меню", callback_data="back_to_menu")
    return builder.as_markup()


# --- ХЕНДЛЕРЫ ПОЛЬЗОВАТЕЛЯ ---

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    _, banned = get_user_data(message.from_user.id)
    if banned:
        return await message.answer("❌ Доступ ограничен администрацией.")

    await message.answer(
        f"<b>Приветствуем, {message.from_user.first_name}!</b> 👋\nВыберите нужный раздел:",
        reply_markup=get_main_kb(), parse_mode="HTML"
    )


@dp.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("Главное меню:", reply_markup=get_main_kb())


# Логика: КУРАТОР (С привязкой)
@dp.callback_query(F.data == "mode_curator")
async def mode_curator(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.chat_curator)
    await callback.message.edit_text("🤝 <b>Связь с куратором</b>\nНапишите ваш вопрос ниже:",
                                     parse_mode="HTML", reply_markup=get_back_kb())


@dp.message(BotStates.chat_curator)
async def handle_curator_msg(message: types.Message):
    cur_id, banned = get_user_data(message.from_user.id)
    if banned: return

    status = "🔒 ЗАКРЕПЛЕН ЗА ВАМИ" if cur_id else "🆕 НОВЫЙ ВОПРОС"
    info = f"👤 <b>{status}</b>\nИмя: {message.from_user.full_name}\n🆔 ID: <code>{message.from_user.id}</code>\n"

    await bot.send_message(CHAT_CURATOR, info, parse_mode="HTML")
    await message.copy_to(CHAT_CURATOR)
    await message.answer("✅ Куратор получил ваше сообщение.")


# Логика: СТРЕСС-ТЕСТ (Без привязки)
@dp.callback_query(F.data == "mode_stress")
async def mode_stress(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.chat_stress)
    await callback.message.edit_text("🔥 <b>РЕЖИМ: СТРЕСС-ТЕСТ</b>\nПишите ваши ответы для экзаменатора:",
                                     parse_mode="HTML", reply_markup=get_back_kb())


@dp.message(BotStates.chat_stress)
async def handle_stress_msg(message: types.Message):
    info = f"⚠️ <b>СТРЕСС-ТЕСТ</b>\nОт: {message.from_user.full_name}\n🆔 ID: <code>{message.from_user.id}</code>"
    await bot.send_message(CHAT_STRESS_TEST, info, parse_mode="HTML")
    await message.copy_to(CHAT_STRESS_TEST)
    await message.answer("🚀 Отправлено экзаменатору.")


# Логика: ЗАЯВКА
@dp.callback_query(F.data == "mode_admin")
async def mode_admin(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(BotStates.admin_apply)
    await callback.message.edit_text("📋 <b>Подача заявки</b>\nПришлите ваше резюме:", parse_mode="HTML",
                                     reply_markup=get_back_kb())


@dp.message(BotStates.admin_apply)
async def handle_admin_apply(message: types.Message):
    info = f"📧 <b>НОВАЯ ЗАЯВКА</b>\nID: <code>{message.from_user.id}</code>"
    await bot.send_message(CHAT_ADMIN_APPLY, info, parse_mode="HTML")
    await message.copy_to(CHAT_ADMIN_APPLY)
    await message.answer("📩 Заявка принята.")


# --- КОМАНДЫ МОДЕРАЦИИ (Для админов в группах) ---

@dp.message(Command("ban"))
async def ban_user(message: types.Message):
    if message.chat.id not in [CHAT_CURATOR, CHAT_STRESS_TEST]: return
    try:
        uid = int(message.text.split()[1])
        set_ban(uid, 1)
        await message.reply(f"🚫 Пользователь {uid} забанен.")
    except:
        await message.reply("Пример: /ban 12345678")


@dp.message(Command("kick"))
async def kick_user(message: types.Message):
    if message.chat.id != CHAT_CURATOR: return
    try:
        uid = int(message.text.split()[1])
        set_curator(uid, 0)
        await message.reply(f"🔄 Привязка куратора для {uid} сброшена.")
    except:
        await message.reply("Пример: /kick 12345678")


# --- ОБРАТНАЯ СВЯЗЬ (ОТВЕТЫ) ---

@dp.message(F.reply_to_message)
async def handle_reply(message: types.Message):
    if message.chat.id not in [CHAT_CURATOR, CHAT_STRESS_TEST, CHAT_ADMIN_APPLY]:
        return

    # Достаем ID из сообщения, на которое отвечаем
    match = re.search(r"🆔 ID: (\d+)", message.reply_to_message.text or message.reply_to_message.caption or "")
    if not match: return

    user_id = int(match.group(1))

    # Если ответ в чате КУРАТОРОВ — проверяем/создаем привязку
    if message.chat.id == CHAT_CURATOR:
        cur_id, _ = get_user_data(user_id)
        if not cur_id:
            set_curator(user_id, message.from_user.id)
            await message.answer(f"✅ Вы теперь официальный куратор этого ученика.")

    try:
        await message.copy_to(user_id)
        await message.react([types.ReactionTypeEmoji(emoji="✅")])
    except:
        await message.reply("❌ Не удалось доставить ответ (возможно, бот заблокирован).")


# --- ЗАПУСК ---
async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
