import bot from '../app.js';
import { selectTeamUser, countTeammates } from '../db/team_commands.js';

async function invite_to_team(msg) {
  try {
    const thisBot = await bot.getMe();
    if (msg.text == `/invite` || msg.text == `/invite${thisBot.username}`) {
      
      const user = await selectTeamUser(msg.from.id);

      if (msg.reply_to_message && !msg.reply_to_message.from.is_bot 
          && msg.reply_to_message.from.id != msg.from.id) {

        const invited_user = await selectTeamUser(msg.reply_to_message.from.id);
    
        if (!user) {
          await bot.sendMessage(msg.chat.id, 'У вас немає команди❗️',
          { reply_to_message_id: msg.message_id });

        } else {
          if (user.role == 'owner') {

            if (invited_user) {
              await bot.sendMessage(msg.chat.id, 'Цей користувач уже в команді❗️',
              { reply_to_message_id: msg.message_id });

            } else {
              const options = {
                inline_keyboard: [
                  [{ text: 'Прийняти',
                  callback_data: `accept_invite#${msg.reply_to_message.from.id}#${user.team_id}`},
  
                  { text: 'Відхилити',
                  callback_data: `decline_invite#${msg.reply_to_message.from.id}`}],
                ],
              };
              
              const teammates_count = await countTeammates(user.team_id);
              const message = await bot.sendMessage(msg.chat.id,
              `Користувач ${user.first_name} запросив(ла) тебе до своєї команди ` + 
              `<b>${user.team_name}</b>❗️\nУчасників в команді: ${teammates_count}👥❗️`,
              { reply_to_message_id: msg.reply_to_message.message_id,
                reply_markup: options, parse_mode: 'HTML' });

              setTimeout(async () => {
                await bot.deleteMessage(msg.chat.id, message.message_id);
              }, 60000 );
            }
          } else {
            await bot.sendMessage(msg.chat.id, 'Тільки власник команди може запрошувати людей❗️',
            { reply_to_message_id: msg.message_id });
          }
        }
      } else {

        const options = {
          inline_keyboard: [
            [{ text: 'Прийняти', callback_data: `join_team#${user.team_id}`}],
          ],
        };

        const teammates_count = await countTeammates(user.team_id);
        const message = await bot.sendMessage(msg.chat.id,
        `Користувач ${user.first_name} запрошує до своєї команди <b>${user.team_name}</b>❗️\n` +
        `Участників в команді: ${teammates_count}👥❗️`, { reply_markup: options, parse_mode: 'HTML' });

        setTimeout(async () => {
          await bot.deleteMessage(msg.chat.id, message.message_id);
        }, 60000 );
      }
    } 
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export default invite_to_team;