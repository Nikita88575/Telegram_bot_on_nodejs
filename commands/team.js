import bot from '../app.js';
import { selectUser } from '../db/quick_commands.js';
import { selectTeamUser, countTeammates, selectTeam,
         selectAllTeamUsers, leaveTeam, transferRights,
         deleteTeam, selectAllBlacklisted, addToBlacklist,
         updateTeamUser, selectFromBlacklist,
         rmFromBlacklist } from '../db/team_commands.js';

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

      await updateTeamUser(msg);
      const team = await selectTeam(user.team_id)
      const users = await selectAllTeamUsers(team.team_id);
      const teammates = await countTeammates(team.team_id);
      
      let options;
      if (user.role == 'Owner') {
        options = {
          inline_keyboard: [
            [{ text: 'Чорний список',
            callback_data: `blacklist#${msg.from.id}`}],

            [{ text: 'Розпустити команду',
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

      await bot.sendMessage(msg.chat.id,
      `Команда <b>${team.team_name}</b>\nУчастників: ${teammates}\n\n${users}`,
      { reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: options });
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

    if (user.role == 'Owner') {
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

    if (user.role != 'Owner') {
      await bot.sendMessage(query.message.chat.id,
      'Тільки власник може розпустити команду❗️');
      return;
    }

    await bot.sendMessage(query.message.chat.id,
    `Команда <b>${user.team_name}</b> розформована❗️`,
    { parse_mode: 'HTML' })
    await deleteTeam(user_id);
    await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

const userStates = {};

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
        
    const options = {
      inline_keyboard: [
        [{ text: 'Закрити',
        callback_data: `close_menu#${user_id}`}],
      ],
    };
    
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
        
        delete userStates[user_id];
      }
    };

    if (data[0] == 'transfer_rights') {
      userStates[user_id] = {
        state: 'waiting_message',
        handler: handleResponse,
    };
    bot.on('message', handleResponse);
      
    } else if (data[0] == 'close_menu') {
      await bot.deleteMessage(query.message.chat.id, query.message.message_id);
      
      if (userStates[user_id] && userStates[user_id].state === 'waiting_message') {
        bot.removeListener('message', userStates[user_id].handler);
        delete userStates[user_id];
        return;
      }
    }
    
    console.log(userStates);
    await bot.editMessageText('Введи ID учасника якому хочете передати права❗️',
    { parse_mode: 'HTML', chat_id: query.message.chat.id,
    message_id: query.message.message_id, reply_markup: options });  
    
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function close_team_menu(query) {
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
    await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function black_list(query) {
  try {
    const data = await query.data.split('#');
    const user_id = parseInt(data[1]);
    const user = await selectTeamUser(user_id);
    const users = await selectAllBlacklisted(user.team_id);
    
    const options = {
      inline_keyboard: [
        [{ text: 'Додати до чорного списку',
        callback_data: `add_to_blacklist#${query.from.id}`}],

        [{ text: 'Вилуити з чорного списку',
        callback_data: `rm_from_blacklist#${query.from.id}`}],

        [{ text: 'Закрити',
        callback_data: `close_blacklist_menu#${query.from.id}`}],
      ],
    };

    if (query.from.id != user_id) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ця кнопка не для тебе❗️', show_alert: true });
      return;

    } else if (!user) {
      await bot.answerCallbackQuery(query.id, 
      { text: 'Ти не в команді❗️', show_alert: true });
      return;

    } else if (!users) {
      await bot.editMessageText('У чорному списку пусто❗️',
      { parse_mode: 'HTML', chat_id: query.message.chat.id,
      message_id: query.message.message_id, reply_markup: options });
      return;
    }


    await bot.editMessageText(users,
    { parse_mode: 'HTML', chat_id: query.message.chat.id,
    message_id: query.message.message_id, reply_markup: options });

  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function add_to_blacklist(query) {
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

    const getUserID = async (message) => {
      try {
        if (message.from.id == user_id) {
          const member_id = await message.text.match(/\d+/);
          const member = await selectUser(member_id);
          const user = await selectTeamUser(message.from.id);
          const is_blacklisted = await selectFromBlacklist(member_id, user.team_id);

          if (!member) {
            await bot.sendMessage(message.chat.id, 'Не знайдено такого користувача❗️');
            return;
          } else if (is_blacklisted) {
            await bot.sendMessage(message.chat.id, 'Цей користувач вже у чорному списку❗️');
            return;
          }
  
          await addToBlacklist(member_id, member.first_name,
                               user.team_id, user.team_name);
            
          await bot.sendMessage(message.chat.id,
          `Користувача ${member.first_name} додано до чорного списку ${user.team_name}❗️`,
          { reply_to_message_id: message.message_id });
  
          await bot.deleteMessage(query.message.chat.id, query.message.message_id);
          bot.removeListener('message', getUserID);
          delete userStates[user_id];
        }
        
      } catch (error) {
        console.log(`[${Date()}] ${error}`);
      }
    };

    if (data[0] == 'add_to_blacklist') {
      // Устанавливаем состояние ожидания для пользователя
      userStates[user_id] = {
        state: 'waiting_user_id',
        handler: getUserID,
      };
      bot.on('message', getUserID);

    } else if (data[0] == 'close_blacklist_menu') {
      await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    
      if (userStates[user_id] && userStates[user_id].state === 'waiting_user_id') {
        // Если да, удаляем обработчик
        bot.removeListener('message', userStates[user_id].handler);
        // Удаляем состояние ожидания для этого пользователя
        delete userStates[user_id];
        return;
      };
    }

    await bot.sendMessage(query.message.chat.id,
    'Введи ID учасника якого хочеш додати у чорний список❗️');
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function rm_from_blacklist(query) {
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

    const rmUserID = async (message) => {
      try {
        if (message.from.id == user_id) {
          const member_id = await message.text.match(/\d+/);
          const member = await selectUser(member_id);
          const user = await selectTeamUser(message.from.id);
          const users = await selectAllBlacklisted(user.team_id);
          const is_blacklisted = await selectFromBlacklist(member_id, user.team_id);

          if (!users) {
            await bot.sendMessage(message.chat.id, 'У чорному списку нікого немає❗️');
            return;
          } else if (!member) {
            await bot.sendMessage(message.chat.id, 'Не знайдено такого користувача❗️');
            return;
          } else if (!is_blacklisted) {
            await bot.sendMessage(message.chat.id, 'Цей користувач не у чорному списку❗️');
            return;
          } 
          await rmFromBlacklist(member_id, user.team_id);
            
          await bot.sendMessage(message.chat.id,
          `Користувача ${member.first_name} вилучено з чорного списку ${user.team_name}❗️`,
          { reply_to_message_id: message.message_id });
  
          await bot.deleteMessage(query.message.chat.id, query.message.message_id);
          bot.removeListener('message', rmUserID);
          delete userStates[user_id];
        }
        
      } catch (error) {
        console.log(`[${Date()}] ${error}`);
      }
    };

    if (data[0] == 'rm_from_blacklist') {
      // Устанавливаем состояние ожидания для пользователя
      userStates[user_id] = {
        state: 'waiting_user_id',
        handler: rmUserID,
      };
      bot.on('message', rmUserID);

    } else if (data[0] == 'close_blacklist_menu') {
      await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    
      if (userStates[user_id] && userStates[user_id].state === 'waiting_user_id') {
        // Если да, удаляем обработчик
        bot.removeListener('message', userStates[user_id].handler);
        // Удаляем состояние ожидания для этого пользователя
        delete userStates[user_id];
        return;
      };
    }

    await bot.sendMessage(query.message.chat.id,
    'Введи ID учасника якого хочеш вилучити з чорного списку❗️');
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { team, leave_team, delete_team, transfer_rights,
         close_team_menu, black_list, add_to_blacklist,
         rm_from_blacklist };