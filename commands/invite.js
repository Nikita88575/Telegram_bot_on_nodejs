import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';

async function referral(msg) {
    try {
      const thisBot = bot.getMe();
      if (msg.text == '/referral' || `/referral@${thisBot.username}`) {
        await checkUser(msg, new Date());
        const user = await selectUser(msg.from.id);
                
        const referralLink = `https://t.me/${thisBot.username}?start=${msg.from.id}`;

        await bot.sendMessage(msg.chat.id,
        `Кількість запрошенних користувачів: ${user.count_refs}\n` + 
        `Ваше посилання для запрошення: ${referralLink}`, 
        {reply_to_message_id: msg.message_id});
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default referral;