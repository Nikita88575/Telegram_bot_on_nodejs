import bot from '../app.js';
import { checkUser } from '../db/quick_commands.js';

async function help(msg) {
    try {
      const thisBot = await bot.getMe();
      if (msg.text == '/help' || msg.text == `/help@${thisBot.username}`) {
        await checkUser(msg, new Date());

        await bot.sendMessage(msg.chat.id,
        '<b>Команди бота:</b>\n\n<code>/info</code> - Інформація про користувача.\n' +
        '<code>/balance</code> - Перевірка балаесу.\n<code>/bonus</code> - Отримати бонус.\n' +
        '<code>/dick</code> - Гра "Пеюсн".\n' +
        '<code>/referral</code> - Отримати запрошувальне посилання.\n' +
        '<code>/dice</code> - Гра "Кубик". Як грати: /dice [число від 1 до 6] [ставка]',
        {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default help;