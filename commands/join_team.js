import bot from '../app.js';
import { selectTeamUser, joinTeam, selectTeam } from '../db/team_commands.js';

async function join_team_query(query) {
    try {
        const data = await query.data.split('#');
        const team_id = parseInt(data[1]);
        const team = await selectTeam(team_id);
        const user = await selectTeamUser(query.from.id);

        if (user) {
            await bot.answerCallbackQuery(query.id, 
            { text: 'Ти вже в команді❗️', show_alert: true });
            return;
        }

        await joinTeam(query.from.id, query.from.first_name, 'member',
                        team_id, team.team_name, query.message.chat.id);

        await bot.sendMessage(query.message.chat.id,
        `${query.from.first_name} приєднався до команди <b>${team.team_name}</b>❗️`,
        { parse_mode: 'HTML' });

        await bot.deleteMessage(query.message.chat.id, query.message.message_id);

    } catch (error) {
      console.log(`[${Date()}] ${error}`);
    }
}

async function accept_invite(query) {
    try {
        const data = await query.data.split('#');
        const user_id = parseInt(data[1]);
        const team_id = parseInt(data[2]);
        const team = await selectTeam(team_id);
        const user = await selectTeamUser(query.from.id);

        if (query.from.id != user_id) {
            await bot.answerCallbackQuery(query.id, 
            { text: 'Ця кнопка не для тебе❗️', show_alert: true });
            return;

        } else if (user) {
            await bot.answerCallbackQuery(query.id, 
            { text: 'Ти вже в команді❗️', show_alert: true });
            return;
        }  

        await joinTeam(user_id, query.from.first_name, 'member',
                       team_id, team.team_name, query.message.chat.id);

        await bot.sendMessage(query.message.chat.id,
        `${query.from.first_name} приєднався до команди ${team.team_name}❗️`,
        { parse_mode: 'HTML' });
        
        await bot.deleteMessage(query.message.chat.id, query.message.message_id);

    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function decline_invite(query) {
    try {
        await bot.deleteMessage(query.message.chat.id, query.message.message_id);
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

export { join_team_query, accept_invite, decline_invite };