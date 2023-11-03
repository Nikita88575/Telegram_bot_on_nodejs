import Team from "./models/team.js";

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
        if (value == null || isNaN(value)) {
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
        
        let user_role;
        user.role == 'owner' ? user_role = 'Власник😎' : 
        user.role == 'member' ? user_role = 'Учасник🫡' :
        user_role = user.role;

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
        const user = await Team.findOne({ where: { user_id } });

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

        if (owner.role == 'owner') {
            await owner.update({ role: 'member' });
            await member.update({ role: 'owner' });
            return 'Права було успішно передано❗️';
        } else {
            return 'Виникла помилка при передачі прав❗️';
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

export { joinTeam, lastTeamID, selectTeamUser, leaveTeam, deleteTeam,
         countTeammates, selectTeam, selectAllTeamUsers, transferRights,
          };