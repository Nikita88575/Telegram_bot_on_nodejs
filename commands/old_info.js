import bot from '../app.js';
import { selectUser, checkUser, formattedDate, countRefs } from '../db/quick_commands.js';

async function info(msg) {
    try {
      const thisBot = await bot.getMe();
      if (msg.text == '/info' || msg.text == `/info@${thisBot.username}`) {

        if (msg.reply_to_message) {

          if (msg.reply_to_message.from.is_bot) {
            return;
          }

          await checkUser(msg, new Date());
            
          const user = await selectUser(msg.reply_to_message.from.id);
          const from_user = await selectUser(msg.from.id);
          const date = await formattedDate(user.createdAt);
          const formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
          const bank = new Intl.NumberFormat('en-US').format(user.bank);
          const formattedDick = new Intl.NumberFormat('en-US').format(user.dick_size);
          const count_refs = await countRefs(user.user_id);
      
          if (user.status == 'premium' && from_user.status != 'premium') {
            await bot.sendMessage(msg.chat.id,
            `Ви не можете перелгядати інформацію користувачів з premium статусом.`,
            {parse_mode: 'HTML', reply_to_message_id: msg.message_id});

          } else {
            await bot.sendMessage(msg.chat.id, 
            `👤 Ім'я: ${user.first_name}\n` +
            `👤 Прізвище: ${user.last_name}\n` +
            `👤 Username: ${user.username}\n` +
            `Баланс: ${formattedBalance}💵\n` +
            `🏦 Банк: ${bank}\n` +
            `Довжина песюна: ${formattedDick} см.📏\n` +
            `Статус: ${user.status}\n` +
            `Запросив(ла): ${count_refs}👤\n` +
            `🗓 У боті з: ${date}\n\n` +
            `<code>${user.user_id}</code>`,
            {parse_mode: 'HTML', reply_to_message_id: msg.message_id});
          }
          
        } else {

          if (msg.from.is_bot) {
            return;
          }

          await checkUser(msg, new Date());
      
          const user = await selectUser(msg.from.id);
          const date = await formattedDate(user.createdAt);
          const formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
          const bank = new Intl.NumberFormat('en-US').format(user.bank);
          const formattedDick = new Intl.NumberFormat('en-US').format(user.dick_size);
          const count_refs = await countRefs(msg.from.id);
    
          await bot.sendMessage(msg.chat.id, 
          `👤 Ім'я: ${user.first_name}\n` +
          `👤 Прізвище: ${user.last_name}\n` +
          `👤 Username: ${user.username}\n` +
          `Баланс: ${formattedBalance}💵\n` +
          `🏦 Банк: ${bank}\n` +
          `Довжина песюна: ${formattedDick} см.📏\n` +
          `Статус: ${user.status}\n` +
          `Запросив(ла): ${count_refs}👤\n` +
          `🗓 У боті з: ${date}\n\n` +
          `<code>${user.user_id}</code>`,
          {parse_mode: 'HTML', reply_to_message_id: msg.message_id});
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
};

export default info;