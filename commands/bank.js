import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';
import { selectItem } from '../db/item_commands.js';

async function bank(msg) {
  try {
    const item = await selectItem('Obligation');

    const user = await selectUser(msg.from.id);
    const bank_balance = parseInt(user.bank) * parseInt(item.price);
    const price = new Intl.NumberFormat('en-US').format(item.price);

    const thisBot = await bot.getMe();
    if (
      msg.text == '/bank' ||
      msg.text == '!bank' ||
      msg.text == `/bank@${thisBot.username}` ||
      msg.text == `!bank@${thisBot.username}`
    ) {
      await checkUser(msg, new Date());
      const value = new Intl.NumberFormat('en-US').format(bank_balance);

      await bot.sendMessage(
        msg.chat.id,
        'У банку можна обміняти гроші на облігації, і навпаки.\n' +
          `Ціна однієї облігації: ${price}💵.\n\n` +
          `У тебе ${user.bank} облінгції на суму ${value} 💵.\n` +
          'Купівля: <code>/bank +1</code> або <code>!bank +1</code>\n' +
          'Продаж: <code>/bank -1</code> або <code>!bank -1</code>',
        { reply_to_message_id: msg.message_id, parse_mode: 'HTML' }
      );
    } else if (msg.text.startsWith('/bank') || msg.text.startsWith('!bank')) {
      const value = msg.text.split(' ')[1];
      const amount = parseInt(value.match(/\d+/));

      if (value.startsWith('+')) {
        const total = amount * parseInt(item.price);

        if (parseInt(user.balance) >= total) {
          await user.update({ bank: parseInt(user.bank) + amount });
          await user.update({
            balance: (parseFloat(user.balance) + parseFloat(-total)).toFixed(2),
          });

          const formattedBank = new Intl.NumberFormat('en-US').format(
            parseInt(user.bank) * parseInt(item.price)
          );

          await bot.sendMessage(
            msg.chat.id,
            `Ти успішно купив ${amount} облігацій ❗️\nУ тебе ${user.bank} облігації на суму ${formattedBank}💵❗️`,
            { reply_to_message_id: msg.message_id }
          );
        } else {
          const formattedBalance = new Intl.NumberFormat('en-US').format(
            user.balance
          );
          await bot.sendMessage(
            msg.chat.id,
            `У тебе недостатньо коштів❗️\nТвій баланс: ${formattedBalance}💵❗️`,
            { reply_to_message_id: msg.message_id }
          );
        }
      } else if (value.startsWith('-')) {
        const total = amount * parseInt(item.price);
        if (parseInt(user.bank) >= amount) {
          await user.update({ bank: parseInt(user.bank) - amount });
          await user.update({
            balance: (parseFloat(user.balance) + parseFloat(total)).toFixed(2),
          });

          const formattedBank = new Intl.NumberFormat('en-US').format(
            parseInt(user.bank) * parseInt(item.price)
          );

          await bot.sendMessage(
            msg.chat.id,
            `Ти успішно продав ${amount} облігацій ❗️\nУ тебе ${user.bank} облігації на суму ${formattedBank}💵❗️`,
            { reply_to_message_id: msg.message_id }
          );
        } else {
          await bot.sendMessage(
            msg.chat.id,
            `У тебе недостатньо облігацій❗️\nКількість облігацій: ${user.bank}❗️`,
            { reply_to_message_id: msg.message_id }
          );
        }
      }
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default bank;
