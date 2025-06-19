import bot from '../app.js';
import {
  selectUser,
  checkUser,
  formattedDate,
  countRefs,
} from '../db/quick_commands.js';
import { diceCount } from '../db/history_dice_commands.js';
import { bowlingCount } from '../db/history_bowling_commands.js';

async function info(msg) {
  try {
    const thisBot = await bot.getMe();
    if (msg.text == '/info' || msg.text == `/info@${thisBot.username}`) {
      let user,
        from_user,
        date,
        formattedBalance,
        bank,
        formattedDick,
        count_refs,
        user_dice_count,
        user_bowling_count;

      if (msg.reply_to_message) {
        await checkUser(msg, new Date());
        user = await selectUser(msg.reply_to_message.from.id);
        from_user = await selectUser(msg.from.id);

        if (
          (await user.status) == 'premium' &&
          (await from_user.status) != 'premium'
        ) {
          await bot.sendMessage(
            msg.chat.id,
            `Ви не можете перелгядати інформацію користувачів з premium статусом.`,
            { parse_mode: 'HTML', reply_to_message_id: msg.message_id }
          );
          return;
        }
      } else {
        await checkUser(msg, new Date());
        user = await selectUser(msg.from.id);
      }

      date = await formattedDate(user.createdAt);
      formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
      bank = new Intl.NumberFormat('en-US').format(user.bank);
      formattedDick = new Intl.NumberFormat('en-US').format(user.dick_size);
      count_refs = await countRefs(user.user_id);
      user_dice_count = await diceCount(user.user_id);
      user_bowling_count = await bowlingCount(user.user_id);

      await bot.sendMessage(
        msg.chat.id,
        `👤 Ім'я: ${user.first_name}\n` +
          `👤 Прізвище: ${user.last_name}\n` +
          `👤 Username: ${user.username}\n` +
          `💵 Баланс: ${formattedBalance}\n` +
          `🏦 Банк: ${bank}\n` +
          `🎲 Зіграно у кубик: ${user_dice_count}\n` +
          `🎳 Зіграно у боулінг: ${user_bowling_count}\n` +
          `📏 Довжина песюна: ${formattedDick} см.\n` +
          `😎 Статус: ${user.status}\n` +
          `👥 Запросив(ла): ${count_refs}\n` +
          `🗓 У боті з: ${date}\n\n` +
          `<code>${user.user_id}</code>`,
        { parse_mode: 'HTML', reply_to_message_id: msg.message_id }
      );
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default info;
