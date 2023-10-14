import bot from '../app.js';
import { selectUser, checkUser, transferMoney } from '../db/quick_commands.js';

async function give_m(msg) {
    try {
      if (msg.text.startsWith('+')) {
        await checkUser(msg, new Date());
            
        if (msg.reply_to_message) {
          const user = await selectUser(msg.from.id);
          const toUser = await selectUser(msg.reply_to_message.from.id);
          const thisBotID = bot.getMe().id;
          const thisBot = await  selectUser(thisBotID);
                  
          const value =  parseFloat(msg.text.split('+')[1]);
  
          if (isNaN(value) || value <= 0) {
            await bot.sendMessage(msg.chat.id, 'Не вірний формат передачі❗️\nВикористовуйте: +[сума]');
            return;

          } else if (!toUser) {
            await bot.sendMessage(msg.chat.id, 'Я не знаю цього користувача❗️');
            return;

          } else if (parseFloat(user.balance) < value) {
            await bot.sendMessage(msg.chat.id, 'У вас недостатньо коштів❗️');
            return;

          } else if (msg.reply_to_message.from.is_bot) {
            const formattedBalance = new Intl.NumberFormat('en-US').format(thisBot.balance);
            await bot.sendMessage(msg.chat.id, `Мені не треба❗️\nУ мене є ${formattedBalance}💵❗️`);
            return;

          } else if (user.user_id == toUser.user_id) {
            await bot.sendMessage(msg.chat.id, 'Не можна передавати кошти самому собі❗️');
            return;
          }

          await transferMoney(user.user_id, toUser.user_id, value);
          await bot.sendMessage(msg.chat.id, value);
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default give_m;