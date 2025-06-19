import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';
import { addBowlingRecord } from '../db/history_bowling_commands.js';

async function bowling(msg) {
  try {
    await checkUser(msg, new Date());
    const user = await selectUser(msg.from.id);

    const bet = parseFloat(msg.text.split(' ').slice(1).join(''));

    if (isNaN(bet) || bet <= 0) {
      return await bot.sendMessage(
        msg.chat.id,
        'Неправильний формат ставки❗️\nВикористовуйте: /bowling <ставка>',
        { reply_to_message_id: msg.message_id }
      );
    } else if (user.balance < bet) {
      return await bot.sendMessage(
        msg.chat.id,
        `У вас недостатньо коштів для цієї ставки❗️\nВаш баланс: ${new Intl.NumberFormat('en-US').format(user.balance)}💵❗️`,
        { reply_to_message_id: msg.message_id }
      );
    }

    const bowlingDice = await bot.sendDice(msg.chat.id, { emoji: '🎳' });
    const diceValue = bowlingDice.dice.value;
    const x =
      diceValue <= 2
        ? 0
        : diceValue === 3
          ? 1
          : diceValue === 4
            ? 1.4
            : diceValue === 5
              ? 1.8
              : diceValue === 6
                ? 2
                : null;
    const now = new Date();
    let bowlingResult, winDetails;
    await user.update({
      balance: (parseFloat(user.balance) - parseFloat(bet)).toFixed(2),
    });

    setTimeout(async () => {
      try {
        const amount = (parseFloat(user.balance) + parseFloat(bet * x)).toFixed(
          2
        );
        await user.update({ balance: amount });
        winDetails = `Ви виграли: ${new Intl.NumberFormat('en-US').format(bet * x)} 💵❗️\n`;
        bowlingResult = `Збито кегель: ${diceValue} 🎳❗️\n`;

        if (diceValue === 6) {
          bowlingResult = `Strike 🎳❗️\n`;
        } else if (diceValue == 3) {
          winDetails = `Повернення ставки 😢\n`;
        } else if (diceValue <= 2) {
          bowlingResult = `Майже... 😢\n`;
          winDetails = `Ви програли 😭\n`;
        }

        await addBowlingRecord(
          msg.from.id,
          bet,
          bowlingResult,
          diceValue,
          x,
          (bet * x).toFixed(2),
          now
        );
        await bot.sendMessage(
          msg.chat.id,
          bowlingResult +
            `Cтавка: ${new Intl.NumberFormat('en-US').format(bet)} 💵❗️\n` +
            winDetails +
            `Ваш баланс: ${new Intl.NumberFormat('en-US').format(user.balance)} 💵❗️`,
          { reply_to_message_id: msg.message_id }
        );
      } catch (error) {
        console.log(`[${Date()}] ${error}`);
      }
    }, 5000);
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default bowling;
