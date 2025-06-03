import bot from '../app.js';
import {
  selectUser,
  checkUser,
  dickMeter,
  formatRemainingTime,
} from '../db/quick_commands.js';

async function dick(msg) {
  try {
    const thisBot = await bot.getMe();
    if (msg.text == '/dick' || msg.text == `/dick@${thisBot.username}`) {
      await checkUser(msg, new Date());
      const user = await selectUser(msg.from.id);

      const today = new Date();
      today.setHours(3, 0, 0, 0);

      const KyivTime = new Date(user.last_time_dick);
      KyivTime.setHours(KyivTime.getHours() + 3);

      const tomorrow = new Date();
      tomorrow.setHours(3, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const Now = new Date();
      Now.setHours(Now.getHours() + 3);

      if (KyivTime > today) {
        await bot.sendMessage(
          msg.chat.id,
          `Ти вже грав(ла) сьогодні❗️\n` +
            `Cпробуй ще раз черз: ${formatRemainingTime(tomorrow, Now)}`
        );
      } else {
        const size =
          (await user.status) == 'premium'
            ? Math.random() * (-7 - 15 + 1) + 15
            : Math.random() * (-10 - 10 + 1) + 10;
        await dickMeter(msg.from.id, size);
        const new_size = await selectUser(msg.from.id);

        if (size > 0) {
          await bot.sendMessage(
            msg.chat.id,
            `Твій песюн збільшився на: ${size.toFixed(2)} см📏❗️\n` +
              `Довжина: ${new_size.dick_size} см.📏❗️\n` +
              `Cпробуй ще раз черз: ${formatRemainingTime(tomorrow, Now)}`,
            { reply_to_message_id: msg.message_id }
          );
        } else if (size < 0) {
          await bot.sendMessage(
            msg.chat.id,
            `Твій песюн зменшився на: ${size.toFixed(2).replace('-', '')} см.📏❗️\n` +
              `Довжина: ${new_size.dick_size} см📏❗️\n` +
              `Cпробуй ще раз черз: ${formatRemainingTime(tomorrow, Now)}`,
            { reply_to_message_id: msg.message_id }
          );
        } else {
          await bot.sendMessage(
            msg.chat.id,
            `Твій песюн не змінився❗️\n` +
              `Довжина: ${new_size.dick_size} см.📏❗️\n` +
              `Cпробуй ще раз черз: ${formatRemainingTime(tomorrow, Now)}`,
            { reply_to_message_id: msg.message_id }
          );
        }
      }
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default dick;
