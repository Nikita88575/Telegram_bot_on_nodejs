import bot from '../app.js';
import { selectTeamUser, countTeammates, selectTeam,
         selectAllTeamUsers, leaveTeam, transferRights, deleteTeam } from '../db/team_commands.js';

async function team(msg) {
  try {
    const thisBot = await bot.getMe();
    if (msg.text == `/team` || msg.text == `/team${thisBot.username}`) {

      const user = await selectTeamUser(msg.from.id);
      if (!user) {
        await bot.sendMessage(msg.chat.id, `Ти не в команді ❗️`,
        { reply_to_message_id: msg.message_id });
        return;
      }

      const team = await selectTeam(user.team_id)
      const users = await selectAllTeamUsers(team.team_id);
      const teammates = await countTeammates(team.team_id);
      
      let options;
      if (user.role == 'owner') {
        options = {
          inline_keyboard: [
            [{ text: 'Розформувати команду',
            callback_data: `delete_team#${msg.from.id}#${user.team_id}`}],

            [{ text: 'Передати права іншому',
            callback_data: `transfer_rights#${msg.from.id}` }],
  
            [{ text: 'Закрити',
            callback_data: `close_team_menu#${msg.from.id}`}],
          ],
        };

      } else {
        options = {
          inline_keyboard: [
            [{ text: 'Покинути команду',
            callback_data: `leave_team#${msg.from.id}`}],
  
            [{ text: 'Закрити',
            callback_data: `close_team_menu#${msg.from.id}`}],
          ],
        };
      }

      const message = await bot.sendMessage(msg.chat.id,
      `Команда <b>${team.team_name}</b>\nУчастників: ${teammates}\n\n${users}`,
      { reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: options });

      setTimeout(async () => {
        await bot.deleteMessage(msg.chat.id, message.message_id);
      }, 60000 );
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function leave_team(query) {
  try {
    const data = await query.data.split('#');
    const user_id = parseInt(data[1]);
    const user = await selectTeamUser(user_id);

    if (query.from.id != user_id) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ця кнопка не для тебе❗️', show_alert: true });
      return;
    } else if (!user) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ти не в команді❗️', show_alert: true });
      return;
    }

    if (user.role == 'owner') {
      await bot.sendMessage(query.message.chat.id,
      `Власник не може покинути команду❗️`)
      return;
    }
  
    await bot.sendMessage(query.message.chat.id,
    `${query.from.first_name} успішно лівнув з команди ${user.team_name}❗️`)
    await leaveTeam(user_id);
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function delete_team(query) {
  try {
    const data = await query.data.split('#');
    const user_id = parseInt(data[1]);
    const user = await selectTeamUser(user_id);

    if (query.from.id != user_id) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ця кнопка не для тебе❗️', show_alert: true });
      return;
    } else if (!user) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ти не в команді❗️', show_alert: true });
      return;
    }

    if (user.role != 'owner') {
      await bot.sendMessage(query.message.chat.id,
      'Тільки власник може розформувати команду❗️');
      return;
    }

    await bot.sendMessage(query.message.chat.id,
    `Команда <b>${user.team_name}</b> розформована❗️`,
    { parse_mode: 'HTML' })
    await deleteTeam(user_id);
    
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function transfer_rights(query) {
  try {
    const data = await query.data.split('#');
    const user_id = parseInt(data[1]);
    const user = await selectTeamUser(user_id);

    if (query.from.id != user_id) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ця кнопка не для тебе❗️', show_alert: true });
      return;
    } else if (!user) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ти не в команді❗️', show_alert: true });
      return;
    }

    const handleResponse = async (message) => {
      if (message.from.id == user_id) {
        const member_id = await message.text.match(/\d+/);
        const member = await selectTeamUser(member_id);

        if (!member || member.team_id != user.team_id) {
          await bot.sendMessage(message.chat.id,
          'Не можна передати права цьому користувачу❗️',
          { reply_to_message_id: message.message_id });
          return;
        }
        const result = await transferRights(user_id, member_id);
          
        await bot.sendMessage(message.chat.id, `${result}\n`,
        { reply_to_message_id: message.message_id });

        await bot.deleteMessage(query.message.chat.id, query.message.message_id);
        bot.removeListener('message', handleResponse);
      }
    };

    await bot.sendMessage(query.message.chat.id,
    'Введи ID учасника якому хочете передати права❗️');
    bot.on('message', handleResponse);

    if (user_answer.startsWith('close_team_menu')) {
      bot.removeAllListeners('message', handleResponse);
      await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    }

  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function close_team_menu(query) {
  try {
    await bot.deleteMessage(query.message.chat.id, query.message.message_id);
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { team, leave_team, delete_team, transfer_rights, close_team_menu};