import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';

async function bonus(msg) {
    try {
        const thisBot = bot.getMe();
        if (msg.text == '/bonus' || `/bonus@${thisBot.username}`) {
            await checkUser(msg, new Date());
        
            const user = await selectUser(msg.from.id);
        
            const today = new Date();
            today.setUTCHours(today.getHours() + 3);

            const kyivTime = new Date(user.last_time_bonus);
            kyivTime.setHours(kyivTime.getHours() + 3);
        
            if (kyivTime >= today) {
              await bot.sendMessage(msg.chat.id, `Ти вже отримав(ла) бонус сьогодні❗️`);

            } else {

                let bonus;
                if (user.status == 'premium') {
                    bonus = Math.random() * (1000 - 200 + 1) + 200;
                } else {
                    bonus = Math.random() * (500 - 50 + 1) + 50;
                }
                const amount = parseFloat(user.balance) + parseFloat(bonus);

                await user.update({ balance: parseFloat(amount).toFixed(2), last_time_bonus: new Date() });
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