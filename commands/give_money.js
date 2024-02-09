import bot from '../app.js';
import { selectUser, checkUser, transferMoney } from '../db/quick_commands.js';

async function give_m(msg) {
    try {
      if (msg.text.startsWith('+')) {
        await checkUser(msg, new Date());
            
        if (msg.reply_to_message) {
          const toUser = await selectUser(msg.reply_to_message.from.id);
          const user = await selectUser(msg.from.id);
          
          const value = parseFloat(msg.text.split('+')[1]);
  
          if (isNaN(value) || value <= 0) {
            return await bot.sendMessage(msg.chat.id, 'Не вірний формат передачі❗️\nВикористовуйте: +[сума]');

          } else if (!toUser) {
            return await bot.sendMessage(msg.chat.id, 'Я не знаю цього користувача❗️');

          } else if (parseFloat(user.balance) < value) {
            return await bot.sendMessage(msg.chat.id, 'У вас недостатньо коштів❗️');

          } else if (msg.reply_to_message.from.is_bot) {
            return await bot.sendMessage(msg.chat.id, `Не можна передавати кошти боту❗️`);

          } else if (msg.from.id == msg.reply_to_message.from.id) {
            return await bot.sendMessage(msg.chat.id, 'Не можна передавати кошти самому собі❗️');
          }

          await transferMoney(msg.from.id, msg.reply_to_message.from.id, value);
          await bot.sendMessage(msg.chat.id, `Ти успішно передав ${value}💵 ${toUser.first_name}`,
          {reply_to_message_id: msg.message_id});
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default give_m;