import bot from '../app.js';
import {
  selectUser,
  checkUser,
  formatRemainingTime,
} from '../db/quick_commands.js';

async function bonus(msg) {
  try {
    const thisBot = await bot.getMe();
    const user = await selectUser(msg.from.id);

    const KyivTime = new Date(user.last_time_bonus);
    KyivTime.setHours(KyivTime.getHours() + 3);
    const Now = new Date();

    if (msg.text == '/bonus' || msg.text == `/bonus@${thisBot.username}`) {
      await checkUser(msg, new Date());

      if (Now > KyivTime) {
        const bonus =
          user.status == 'premium'
            ? Math.random() * (1000 - 200 + 1) + 200
            : Math.random() * (500 - 50 + 1) + 50;

        await user.update({
          balance: (parseFloat(user.balance) + parseFloat(bonus)).toFixed(2),
          last_time_bonus: Now.setHours(Now.getHours()),
        });

        const formattedBalance = new Intl.NumberFormat('en-US').format(
          user.balance
        );

        await bot.sendMessage(
          msg.chat.id,
          `Бонус: ${bonus.toFixed(2)}💵❗️\nВаш баланс: ${formattedBalance}💵❗️\n` +
            `Cпробуй ще раз черз: 3 год. 00 хв. 00 сек.`,
          { reply_to_message_id: msg.message_id }
        );
      } else {
        await bot.sendMessage(
          msg.chat.id,
          `Ти вже отримав(ла) бонус сьогодні❗️\n` +
            `Cпробуй ще раз черз: ${formatRemainingTime(KyivTime, Now)}`
        );
      }
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default bonus;
