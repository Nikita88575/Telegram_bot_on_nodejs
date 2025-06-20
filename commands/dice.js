import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';
import { addDiceRecord } from '../db/history_dice_commands.js';
import { addGameQueue } from '../db/game_queue_commands.js';
import gameQueue from '../db/models/game_queue.js';

async function dice(msg) {
  const added = await addGameQueue(msg.from.id, 'dice');
  if (!added) {
    return bot.sendMessage(
      msg.from.id,
      'Ви вже граєте. Дочекайтесь завершення попередньої гри ❗️',
      {
        reply_to_message_id: msg.message_id,
      }
    );
  }

  try {
    await checkUser(msg, new Date());
    const user = await selectUser(msg.from.id);

    const chosenNumber = parseInt(msg.text.split(' ')[1]);
    const bet = parseFloat(msg.text.split(' ').slice(2).join(''));

    const x = user.status === 'premium' ? 2.9 : 2.5;

    if (isNaN(bet) || isNaN(chosenNumber) || bet <= 0 || 1 < chosenNumber > 6) {
      await gameQueue.destroy({
        where: { user_id: msg.from.id, game_type: 'dice' },
      });
      return await bot.sendMessage(
        msg.chat.id,
        'Неправильний формат ставки чи числа❗️\nВикористовуйте: /dice <число від 1 до 6> <ставка>',
        { reply_to_message_id: msg.message_id }
      );
    } else if (user.balance < bet) {
      await gameQueue.destroy({
        where: { user_id: msg.from.id, game_type: 'dice' },
      });
      return await bot.sendMessage(
        msg.chat.id,
        `У вас недостатньо коштів для цієї ставки❗️\nВаш баланс: ${new Intl.NumberFormat('en-US').format(user.balance)}💵❗️`,
        { reply_to_message_id: msg.message_id }
      );
    }

    const message = await bot.sendDice(msg.chat.id);
    const diceValue = message.dice.value;
    const now = new Date();
    await user.update({
      balance: (parseFloat(user.balance) - parseFloat(bet)).toFixed(2),
    });

    setTimeout(async () => {
      try {
        if (parseInt(diceValue) === chosenNumber) {
          const amount = (
            parseFloat(user.balance) + parseFloat(bet * x)
          ).toFixed(2);
          await user.update({ balance: amount });

          await addDiceRecord(
            msg.from.id,
            chosenNumber,
            bet,
            'Win',
            diceValue,
            x,
            (bet * x).toFixed(2),
            now
          );
          await bot.sendMessage(
            msg.chat.id,
            `Випало: ${diceValue}❗️\n` +
              `Cтавка: ${new Intl.NumberFormat('en-US').format(bet)} 💵❗️\n` +
              `Ви виграли: ${new Intl.NumberFormat('en-US').format(bet * x)} 💵❗️\n` +
              `Ваш баланс: ${new Intl.NumberFormat('en-US').format(user.balance)} 💵❗️`,
            { reply_to_message_id: msg.message_id }
          );
        } else {
          await addDiceRecord(
            msg.from.id,
            chosenNumber,
            bet,
            'Lose',
            diceValue,
            x,
            bet,
            now
          );
          await bot.sendMessage(
            msg.chat.id,
            `Випало: ${diceValue}❗️\n` +
              `Cтавка: ${new Intl.NumberFormat('en-US').format(bet)} 💵❗️\n` +
              `Ви програли❗️\nВаш баланс: ${new Intl.NumberFormat('en-US').format(user.balance)} 💵❗️`,
            { reply_to_message_id: msg.message_id }
          );
          await gameQueue.destroy({
            where: { user_id: msg.from.id, game_type: 'dice' },
          });
        }
      } catch (error) {
        console.log(`[${Date()}] ${error}`);
      }
    }, 5000);
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default dice;
