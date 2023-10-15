import bot from '../app.js';
import { selectUser, checkUser, dickMeter } from '../db/quick_commands.js';

async function dick(msg) {
    try {
      const thisBot = await bot.getMe();
      if (msg.text == '/dick' || msg.text == `/dick@${thisBot.username}`) {
        await checkUser(msg, new Date());
        const user = await selectUser(msg.from.id);
    
        const today = new Date();
        today.setHours(3, 0, 0, 0);

        const kyivTime = new Date(user.last_time_dick);
        kyivTime.setHours(kyivTime.getHours() + 3);
        
        if (kyivTime >= today) {
          await bot.sendMessage(msg.chat.id, `Ти вже грав(ла) сьогодні❗️`);
        } else {
              
          let size;
          user.status == 'premium' ? size = Math.random() * (-5 - 15 + 1) + 15 : size = Math.random() * (-10 - 10 + 1) + 10;
          await dickMeter(msg.from.id, size);
          const new_size = await selectUser(msg.from.id);

          if (size > 0) {
            await bot.sendMessage(msg.chat.id, 
            `Твій песюн збільшився на: ${size.toFixed(2)} см📏❗️\n` + 
            `Довжина: ${new_size.dick_size} см.📏❗️`,
            {reply_to_message_id: msg.message_id});

          } else if (size < 0) {
            await bot.sendMessage(msg.chat.id, 
            `Твій песюн зменшився на: ${(size.toFixed(2)).replace('-', '')} см.📏❗️\n` + 
            `Довжина: ${new_size.dick_size} см📏❗️`,
            {reply_to_message_id: msg.message_id});
            
          } else { 
            await bot.sendMessage(msg.chat.id, `Твій песюн не змінився❗️\n` +
            `Довжина: ${new_size.dick_size} см.📏❗️`,
            {reply_to_message_id: msg.message_id});
          }
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default dick;