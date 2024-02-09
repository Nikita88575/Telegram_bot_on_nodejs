import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import sequelize from './data/config.js';
import start from './commands/start.js';
import info from './commands/info.js';
import bonus from './commands/bonus.js';
import dick from './commands/dick_meter.js';
import balance from './commands/balance.js';
import dice from './commands/dice.js';
import referral from './commands/invite.js';
import help from './commands/help.js';
import give_m from './commands/give_money.js';
import bank from './commands/bank.js';
import { create_team, team_query } from './commands/create_team.js';
import { join_team_query, accept_invite, decline_invite } from './commands/join_team.js';
import invite_to_team from './commands/invite_to_team.js';
import { team, leave_team, delete_team,
         transfer_rights, close_team_menu,
         black_list, add_to_blacklist, rm_from_blacklist } from './commands/team.js';
import isPrivateChat from './filters/is_private.js';
import isGroup from './filters/Is_group.js';

config();

const token = process.env.botApi;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  await isPrivateChat(msg) ? await start(msg) : null;
});

bot.onText(/\/info/, async (msg) => {
  await info(msg);
});

bot.onText(/\/bonus/, async (msg) => {
  await bonus(msg);
});

bot.onText(/\/dick/, async (msg) => {
  await dick(msg);
});

bot.onText(/\/balance/, async (msg) => {
  await balance(msg);
});

bot.onText(/\/dice/, async (msg) => {
  await dice(msg);
});

bot.onText(/\/referral/, async (msg) => {
  await isPrivateChat(msg) ? await referral(msg) : null;
});

bot.onText(/\/help/, async (msg) => {
  await isPrivateChat(msg) ? await help(msg) : null;
});

bot.onText(/\+(\d+(\.\d{1,2})?)/, async (msg) => {
  await isGroup(msg) ? await give_m(msg) : null;
});

bot.onText(/^\/bank(\s[+-]?\d+)?|!bank(\s[+-]?\d+)?$/i, async (msg) => {
  await bank(msg);
});

bot.onText(/\/createteam/, async (msg) => {
  await isGroup(msg) ? await create_team(msg) : null;
});

bot.on('callback_query', async (query) => {
  const data = query.data;

  if (data.startsWith('create_team') ||
      data.startsWith('cancel_team')) {
    await team_query(query);

  } else if (data.startsWith('join_team')) {
    await join_team_query(query);

  } else if (data.startsWith('accept_invite')) {
    await accept_invite(query);

  } else if (data.startsWith('decline_invite')) {
    await decline_invite(query);

  } else if (data.startsWith('leave_team')) {
    await leave_team(query);

  } else if (data.startsWith('delete_team')) {
    await delete_team(query);

  } else if (data.startsWith('transfer_rights') ||
             data.startsWith('close_menu')) {
    await transfer_rights(query);

  } else if (data.startsWith('blacklist')) {
    await black_list(query);

  } else if (data.startsWith('add_to_blacklist')  ||
             data.startsWith('close_blacklist_menu')) {
    await add_to_blacklist(query);
  
  } else if (data.startsWith('rm_from_blacklist')  ||
             data.startsWith('close_blacklist_menu')) {
    await rm_from_blacklist(query);
  }
  
});

bot.onText(/\/invite/, async (msg) => {
  await isGroup(msg) ? await invite_to_team(msg) : null;
});

bot.onText(/\/team/, async (msg) => {
  await team(msg);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Перевірка з`єднання.');
    await sequelize.sync();
    console.log('Базу даних синхронізовано.');
  } catch (error) {
    console.error('Помилка синхронізації бази даних:', error);
  }

  await bot.setMyCommands([
    {command: '/start', description: 'Старт'},
    {command: '/help', description: ' Допомога'},
    {command: '/info', description: 'Інформація про користувача'},
    {command: '/balance', description: 'Перевірка балансу'},
    {command: '/bonus', description: 'Бонус'},
    {command: '/dick', description: 'Гра "Песюн"'},
    {command: '/dice', description: 'Гра "Кубик"'},
    {command: '/referral', description: 'Реферальна система'}
  ]);
  
  await bot.sendMessage(process.env.ownerId, 'Я живий');
  console.log('Бота запущено...');
})();

export default bot;