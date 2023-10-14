import bot from '../app.js';
import { selectUser, checkUser } from '../db/quick_commands.js';

async function dice(msg) {
    try {
      await checkUser(msg, new Date());
      const user = await selectUser(msg.from.id);
    
      const chosenNumber = parseInt(msg.text.split(' ')[1]);
      const bet = parseFloat(msg.text.split(' ')[2]);
    
      if (isNaN(bet) || isNaN(chosenNumber) || bet <= 0 || chosenNumber < 1 || chosenNumber > 6) {
          
        await bot.sendMessage(msg.chat.id, 
        'Неправильний формат ставки чи числа❗️\nВикористовуйте: /dice <число від 1 до 6> <ставка>',
        {reply_to_message_id: msg.message_id});
        return;

      } else if (user.balance < bet) {

        await bot.sendMessage(msg.chat.id, 
        `У вас недостатньо коштів для цієї ставки❗️\nВаш баланс: ${user.balance}💵❗️`,
        {reply_to_message_id: msg.message_id});
        return;

      }
    
      await bot.sendDice(msg.chat.id)
      .then(async (message) => {

        await user.update({balance: parseFloat(user.balance).toFixed(2) - parseFloat(bet).toFixed(2)});
        const diceValue = message.dice.value;
     
        setTimeout(async () => {

          if (parseInt(diceValue) == chosenNumber) {

            let x;
            user.status == 'premium' ? x = 2.8 : x = 2.3;
                
            const amount = parseFloat(user.balance) + parseFloat(bet * x);
            await user.update({balance: amount.toFixed(2)});
            const check = await selectUser(msg.from.id);

            await bot.sendMessage(msg.chat.id, 
            `Випало: ${diceValue}❗️\nВи виграли: ${parseFloat(bet * x).toFixed(2)}💵❗️\n` + 
            `Ваш баланс: ${parseFloat(check.balance).toFixed(2)}💵❗️`,
            {reply_to_message_id: msg.message_id});

            } else {

              const check = await selectUser(msg.from.id);
              await bot.sendMessage(msg.chat.id, 
              `Випало: ${diceValue}❗️\nВи програли❗️\nВаш баланс: ${parseFloat(check.balance).toFixed(2)}💵❗️`,
              {reply_to_message_id: msg.message_id});

            }
        }, 5200);
      });
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default dice;