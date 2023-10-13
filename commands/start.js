import bot from "../app.js";
import { selectUser, addUser, updateUser} from '../db/quick_commands.js';
import referral from "./invite.js";

async function start(msg) {
  try {
    const thisBot = bot.getMe();
    if (msg.text == '/start' || `/start@${thisBot.username}`) {

      const user = await selectUser(msg.from.id);
  
      if (!user) {
        await addUser(msg.from.id, msg.from.first_name, msg.from.last_name, msg.from.username, new Date(), null);
        await bot.sendMessage(msg.chat.id, 'Я тебе запам`ятав❗️', {reply_to_message_id: msg.message_id});
      } else {
        await updateUser(msg.from.id, msg.from.first_name, msg.from.last_name, msg.from.username);
      }
    } else if (msg.text.startsWith('/start')) {

      const user = await selectUser(msg.from.id);
      const referralUserId = msg.text.split(' ')[1];
      const referralUser = await selectUser(referralUserId);

      if (!user) {
        if (referralUser) {
  
          await addUser(msg.from.id, msg.from.first_name, msg.from.last_name, msg.from.username, new Date(), referralUserId);
          const user = await selectUser(msg.from.id);
          await user.update({balance: parseFloat(user.balance) + 5000});
          await bot.sendMessage(msg.chat.id, 
            `Я тебе запам\`ятав❗️\nТримай бонус за приєднання за запрошенням ${referralUser.first_name}❗️\nБонус: 5000💵❗️`);
          
          let bonus;
          referralUser.status == 'premium' ? bonus = 8000 : bonus = 5000;
          await referralUser.update({balance: parseFloat(referralUser.balance) + bonus, count_refs: parseInt(referralUser.count_refs) + 1});
          await bot.sendMessage(referralUserId, `За твоїм запрошенням приєднався(лась) ${user.first_name}❗️\nБонус: ${bonus}💵❗️`);

        } else {
          await bot.sendMessage(msg.chat.id, 'Не знайдено користувача з таким id❗️');
        }
      } else {
        if (user.referral_id) {
          await bot.sendMessage(msg.chat.id, `Я тебе пам\`ятаю, ти приєднався за запрошенням ${referralUser.first_name}❗️`);
        } else {
          await bot.sendMessage(msg.chat.id, 'Я тебе пам`ятаю❗️');
        }
      }
    }
  } catch (error) {
    console.error('Помилка при створенні або оновленні даних користувача:', error);
    await bot.sendMessage(msg.chat.id, 'Виникла помилка під час створення або оновлення даних користувача❗️');
  }
};

export default start;