import bot from '../app.js';
import { selectTeamUser, joinTeam, lastTeamID } from '../db/team_commands.js';
import { selectItem } from '../db/item_commands.js';
import { selectUser } from '../db/quick_commands.js';

async function create_team(msg) {
  try {
    const thisBot = await bot.getMe();
    if (msg.text == `${'/createteam'}` || msg.text == `/createteam${thisBot.username}`) {
  
      const user = await selectUser(msg.from.id);
      const team_user = await selectTeamUser(msg.from.id);
  
      if (!team_user) {
        const options = {
          inline_keyboard: [
            [{ text: 'Так', callback_data: `create_team#${msg.from.id}` },
             { text: 'НІ', callback_data: `cancel_team#${msg.from.id}` }],
          ],
        };
  
        const item = await selectItem(1);
        if (parseFloat(user.balance) >= parseInt(item.price)) {
  
          await bot.sendMessage(msg.chat.id, 
          `Вартість стврорення комманди: ${item.price}💵❗️\nПродовжити ?`,
          { reply_markup: options, reply_to_message_id: msg.message_id });
  
        } else {
          await bot.sendMessage(msg.chat.id, 
          `В тебе не вистачає❗️\nБаланс: ${user.balance}💵❗️`,
          { reply_to_message_id: msg.message_id });
        } 
      
      } else {
        await bot.sendMessage(msg.chat.id, 'Ти вже в команді❗️',
        { reply_to_message_id: msg.message_id });
      }
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function team_query(query) {
    try {
      const data = await query.data;
      const user_id = parseInt(data.match(/\d+/));
      const user = await selectUser(user_id);
      const item = await selectItem(1);
  
      if (query.from.id != user_id) {
        await bot.answerCallbackQuery(query.id, 
        { text: 'Ця кнопка не для тебе❗️', show_alert: true });
  
      } else {
  
        const handleTestResponse = async (message) => {
          if (message.text.length >= 3) {
  
            if (message.from.id == user_id) {
              const team_id = await lastTeamID() + 1;
              await joinTeam(message.from.id, message.from.first_name, 'owner',
                            team_id, message.text, message.chat.id);
              
              await user.update({ balance: parseFloat(user.balance) - parseInt(item.price) })
    
              await bot.sendMessage(message.chat.id,
              `Ти успішно створив(ла) команду з назвою ${message.text}❗️\n`,
              { reply_to_message_id: message.message_id });
    
              await bot.deleteMessage(query.message.chat.id, query.message.message_id);
              bot.removeListener('message', handleTestResponse);
            }
          } else {
            await bot.sendMessage(message.chat.id,
            'Назва команды повинна мати як мінімум 3 літери❗️',
            { reply_to_message_id: message.message_id });
          }
        };
        
        if (data.startsWith('create_team')) {
  
          await bot.sendMessage(query.message.chat.id,
          'Введіть назву команди', 
          { reply_to_message_id: query.message_idmessage_id });
          bot.on('message', handleTestResponse);
  
        } else if (data.startsWith('cancel_team')) {
          bot.removeAllListeners('message', handleTestResponse);
          await bot.deleteMessage(query.message.chat.id, query.message.message_id);
        }
      }
    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
  }

export { create_team, team_query };