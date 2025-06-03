import bot from '../app.js';
import {
  selectUser,
  checkUser,
  formattedDate,
  countRefs,
} from '../db/quick_commands.js';
import { betCount } from '../db/history_bet_commands.js';

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
        bets;

      if (msg.reply_to_message) {
        await checkUser(msg, new Date());
        user = await selectUser(msg.reply_to_message.from.id);
        from_user = await selectUser(msg.from.id);
        date = await formattedDate(user.createdAt);
        formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
        bank = new Intl.NumberFormat('en-US').format(user.bank);
        formattedDick = new Intl.NumberFormat('en-US').format(user.dick_size);
        count_refs = await countRefs(user.user_id);
        bets = await betCount(user.user_id);

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
        date = await formattedDate(user.createdAt);
        formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
        bank = new Intl.NumberFormat('en-US').format(user.bank);
        formattedDick = new Intl.NumberFormat('en-US').format(user.dick_size);
        count_refs = await countRefs(msg.from.id);
        bets = await betCount(user.user_id);
      }

      await bot.sendMessage(
        msg.chat.id,
        `👤 Ім'я: ${user.first_name}\n` +
          `👤 Прізвище: ${user.last_name}\n` +
          `👤 Username: ${user.username}\n` +
          `💵 Баланс: ${formattedBalance}\n` +
          `🏦 Банк: ${bank}\n` +
          `🎲 Зіграно у кубик: ${bets}\n` +
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
