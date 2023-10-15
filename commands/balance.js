import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';

async function balance(msg) {
    try {
      const thisBot = await bot.getMe();
      if (msg.text == '/balance' || msg.text == `/balance@${thisBot.username}`) {
        
        await checkUser(msg, new Date());
        const user = await selectUser(msg.from.id);
            
        const formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);

        await bot.sendMessage(msg.chat.id, `Баланс: ${formattedBalance}💵❗️`, 
        {reply_to_message_id: msg.message_id});
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default balance;