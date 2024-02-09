import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';

async function bonus(msg) {
    try {
      const thisBot = await bot.getMe();
      if (msg.text == '/bonus' || msg.text == `/bonus@${thisBot.username}`) {
        await checkUser(msg, new Date());
        
        const user = await selectUser(msg.from.id);
        
        const kyivTime = new Date(user.last_time_bonus);
        kyivTime.setHours(kyivTime.getHours() + 3);

        const today = new Date();
        today.setUTCHours(today.getHours());
        
        if (kyivTime >= today) {
          await bot.sendMessage(msg.chat.id, `Ти вже отримав(ла) бонус сьогодні❗️`);
        } else {

          const bonus = await user.status == 'premium' ? Math.random() * (1000 - 200 + 1) + 200 : Math.random() * (500 - 50 + 1) + 50;
              
          await user.update({ balance: (parseFloat(user.balance) + parseFloat(bonus)).toFixed(2), 
                              last_time_bonus: today });

          const formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);

          await bot.sendMessage(msg.chat.id, 
          `Бонус: ${bonus.toFixed(2)}💵❗️\nВаш баланс: ${formattedBalance}💵❗️`,
          {reply_to_message_id: msg.message_id});
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default bonus;