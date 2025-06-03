import bot from '../app.js';
import { checkUser, countRefs } from '../db/quick_commands.js';

async function referral(msg) {
  try {
    const thisBot = await bot.getMe();
    if (
      msg.text == '/referral' ||
      msg.text == `/referral@${thisBot.username}`
    ) {
      await checkUser(msg, new Date());
      const count = await countRefs(msg.from.id);

      const referralLink = `https://t.me/${thisBot.username}?start=${msg.from.id}`;

      await bot.sendMessage(
        msg.chat.id,
        `Кількість запрошенних користувачів: ${count}\n` +
          `Ваше посилання для запрошення: ${referralLink}`,
        { reply_to_message_id: msg.message_id }
      );
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default referral;
