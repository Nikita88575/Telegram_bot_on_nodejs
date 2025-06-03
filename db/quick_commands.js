import User from './models/user.js';

async function selectUser(user_id) {
  try {
    const user = await User.findOne({ where: { user_id } });
    return user;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function addUser(
  user_id,
  first_name,
  last_name,
  username,
  last_call,
  ref_id
) {
  try {
    const user = await User.create({
      user_id,
      first_name,
      last_name: last_name || '',
      username: username || '',
      status: 'active',
      balance: 0.0,
      bank: 1,
      dick_size: 0.0,
      ref_id,
      last_time_bonus: last_call.setUTCFullYear(2024),
      last_time_dick: last_call.setUTCFullYear(2024),
    });
    return user;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function updateUser(user_id, first_name, last_name, username) {
  try {
    const user = await selectUser(user_id);

    if (user) {
      await user.update({
        first_name: first_name || '',
        last_name: last_name || '',
        username: username || '',
      });
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function checkUser(msg, last_call) {
  try {
    if (!msg.from.is_bot || !msg.reply_to_message.from.is_bot) {
      if (msg.reply_to_message) {
        const user = await selectUser(msg.reply_to_message.from.id);

        if (!user) {
          await addUser(
            msg.reply_to_message.from.id,
            msg.reply_to_message.from.first_name,
            msg.reply_to_message.from.last_name,
            msg.reply_to_message.from.username,
            last_call,
            null
          );
        } else {
          await updateUser(
            msg.reply_to_message.from.id,
            msg.reply_to_message.from.first_name,
            msg.reply_to_message.from.last_name,
            msg.reply_to_message.from.username
          );
        }
      } else {
        const user = await selectUser(msg.from.id);

        if (!user) {
          await addUser(
            msg.from.id,
            msg.from.first_name,
            msg.from.last_name,
            msg.from.username,
            last_call,
            null
          );
        } else {
          await updateUser(
            msg.from.id,
            msg.from.first_name,
            msg.from.last_name,
            msg.from.username
          );
        }
      }
    }
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function formattedDate(date) {
  try {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const str_date = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return str_date;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

function formatRemainingTime(targetTime, currentTime) {
  const nextAvailableBonus = targetTime;
  nextAvailableBonus.setHours(nextAvailableBonus.getHours());
  const diffMs = nextAvailableBonus - currentTime;
  if (diffMs <= 0) return '00 сек.';

  const date = new Date(diffMs);
  const days = String(date.getUTCDate() - 1).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return days > 0
    ? `${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`
    : hours > 0
      ? `${hours} год. ${minutes} хв. ${seconds} сек.`
      : minutes > 0
        ? `${minutes} хв. ${seconds} сек.`
        : `${seconds} сек.`;
}

async function dickMeter(user_id, size) {
  const user = await selectUser(user_id);
  const new_size = parseFloat(user.dick_size) + size;

  await user.update({
    dick_size: parseFloat(new_size).toFixed(2),
    last_time_dick: new Date(),
  });
}

async function transferMoney(from_user_id, to_user_id, value) {
  const from_user = await selectUser(from_user_id);
  const to_user = await selectUser(to_user_id);

  await to_user.update({ balance: parseFloat(to_user.balance) + value });
  await from_user.update({ balance: parseFloat(from_user.balance) - value });
}

async function countRefs(user_id) {
  try {
    const count_referrals = await User.findAll({
      where: { referral_id: user_id },
    });
    return count_referrals.length;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export {
  selectUser,
  addUser,
  updateUser,
  checkUser,
  formattedDate,
  dickMeter,
  transferMoney,
  countRefs,
  formatRemainingTime,
};
