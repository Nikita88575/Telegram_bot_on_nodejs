import { Team, teamBlacklist } from "./models/team.js";
import { formattedDate } from "./quick_commands.js";

async function joinTeam(user_id, first_name, role, team_id, team_name, chat_id) {
    try {
        const team = await Team.create({
            user_id, first_name, role,
            team_id, team_name, chat_id
        });
        return team;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function lastTeamID() {
    try {
        const value = await Team.max('team_id');
        if (value === null || isNaN(value)) {
            return 100000;
        }
        return parseInt(value);
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function selectTeamUser(user_id) {
    try {
        const user = await Team.findOne({ where: { user_id }});
        return user;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function selectAllTeamUsers(team_id) {
    const users = await Team.findAll({ where: { team_id }, order: [['role', 'DESC']]});
    
    return users.map(user => { 
        
        const user_role = user.role == 'Owner' ? 'Власник😎' : 'Member' ? 'Учасник🫡' : user.role;

        return `👤Ім\`я: ${user.first_name}\nСтатус: ${user_role}\n` + 
        `ID: <code>${user.user_id}</code>\n`;
    }).join('\n');
}

async function selectTeam(team_id) {
    try {
        const team = await Team.findOne({ where: { team_id } });
        return team;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function leaveTeam(user_id) {
    try {
        const user = await selectTeamUser(user_id);
        await user.destroy();
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    } 
}

async function deleteTeam(user_id) {
    try {
        const user = await selectTeamUser(user_id);

        if (user.role == 'owner') {
            const team = user.team_id;
            await Team.destroy({ where: { team_id: team } });
        } else {
            return;
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function countTeammates(team_id) {
    try {
        const count_teammates = await Team.findAll({ where: { team_id } });
        return count_teammates.length;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function transferRights(owner_id, member_id) {
    try {
        const owner = await selectTeamUser(owner_id);
        const member = await selectTeamUser(member_id);

        if (owner_id == member_id) {
            return 'Не можна передавати права самому собі❗️'
        }

        if (owner.role == 'Owner') {
            await owner.update({ role: 'Member' });
            await member.update({ role: 'Owner' });
            return 'Права було успішно передано❗️';
        } else {
            return 'Виникла помилка при передачі прав❗️';
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function updateTeamUser(msg) {
    const user = await selectTeamUser(msg.from.id);

    await user.update({ first_name: msg.from.first_name });
    return user;
}

async function addToBlacklist(user_id, first_name, team_id, team_name) {
    try {
        const user = await teamBlacklist.create({
            user_id, first_name, 
            team_id, team_name, 
        });
        return user;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function selectFromBlacklist(user_id, team_id) {
    try {
        const user = await teamBlacklist.findOne({ where: { user_id, team_id }});
        return user;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function selectAllBlacklisted(team_id) {
    const users = await teamBlacklist.findAll({ where: { team_id }, order: [['createdAt']]});
    
    const data = users.map(async user => { 
        const date = await formattedDate(user.createdAt);

        return `👤Ім\`я: ${user.first_name}\nСтатус: У чорному списку\n` + 
        `Дата: ${date}\nID: <code>${user.user_id}</code>\n`;
    });
    const result = await Promise.all(data);
    return result.join('\n');  
}

async function rmFromBlacklist(user_id, team_id) {
    try {
        const user = await selectFromBlacklist(user_id, team_id);
        await user.destroy();
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

export { joinTeam, lastTeamID, selectTeamUser, leaveTeam, deleteTeam,
         countTeammates, selectTeam, selectAllTeamUsers, transferRights,
         addToBlacklist, selectFromBlacklist, rmFromBlacklist, 
         selectAllBlacklisted, updateTeamUser,  };