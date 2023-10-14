import User from "./models/user.js";

async function selectUser(user_id) {
    try {
        const user = await User.findOne({ where: { user_id } });
        return user;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
        throw new Error('An error occurred while selecting the user.');
    }
}

async function addUser(user_id, first_name, last_name, username, last_call, ref_id) {
    try {
        const user = await User.create({
            user_id,
            first_name,
            last_name: last_name || '',
            username: username || '',
            status: 'active',
            balance: 0.00,
            dick_size: 0.00,
            referral_id: ref_id,
            count_refs: 0,
            last_time_bonus: last_call.setUTCFullYear(2022),
            last_time_dick: last_call.setUTCFullYear(2022),
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
            user.first_name = first_name;
            user.last_name = last_name || '';
            user.username = username || '';

            await user.save();
            return user;
        } else {
            throw new Error('User not found.');
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function checkUser(msg, last_call) {
    try {
        if (msg.reply_to_message) {
            const user = await selectUser(msg.reply_to_message.from.id);

            if (!user) {
                await addUser(msg.reply_to_message.from.id, 
                              msg.reply_to_message.from.first_name,
                              msg.reply_to_message.from.last_name, 
                              msg.reply_to_message.from.username,
                              last_call, null,
                             );
            } else {
                await updateUser(msg.reply_to_message.from.id, 
                                 msg.reply_to_message.from.first_name,
                                 msg.reply_to_message.from.last_name, 
                                 msg.reply_to_message.from.username,
                                );
                
            }
        } else {
            const user = await selectUser(msg.from.id);

            if (!user) {
                await addUser(msg.from.id, msg.from.first_name,
                              msg.from.last_name, msg.from.username,
                              last_call, null,
                             );
            } else {
                await updateUser(msg.from.id, msg.from.first_name,
                                 msg.from.last_name, msg.from.username
                                );
            }
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function formattedDate(user_id) {
    try {
        const user = await selectUser(user_id);

        const date = String(user.createdAt.getDate()).padStart(2, '0');;
        const month = String(user.createdAt.getMonth() + 1).padStart(2, '0');;
        const year = user.createdAt.getFullYear();
        const hours = String(user.createdAt.getHours()).padStart(2, '0');;
        const seconds = String(user.createdAt.getSeconds()).padStart(2, '0');;
        const minutes = String(user.createdAt.getMinutes()).padStart(2, '0');;

        const str_date = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return str_date;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function dickMeter(user_id, size) {
    const user = await selectUser(user_id);
    const new_size = parseFloat(user.dick_size) + size;
  
    if (parseFloat(new_size) <= 0) {
      await user.update({ dick_size: 0.0, last_time_dick: new Date() });
    } else {
      await user.update({ dick_size: parseFloat(new_size).toFixed(2), last_time_dick: new Date() });
    }
  }
  
async function transferMoney(from_user_id, to_user_id, value) {
    const from_user = await selectUser(from_user_id);
    const to_user = await selectUser(to_user_id);

    await to_user.update({ balance: parseFloat(to_user.balance) + value });
    await from_user.update({ balance: parseFloat(from_user.balance) - value });
}

async function transferBank(user_id, value) {
    const user = await selectUser(user_id);

    await user.update({ bank: parseInt(user.bank) + value });
}

async function paymentSys(user_id, amount) {
    const user = await selectUser(user_id);

    await user.update({ balance: (parseFloat(user.balance) + parseFloat(amount)).toFixed(2) });
}

export { selectUser, addUser, updateUser, checkUser, formattedDate, dickMeter, paymentSys, transferBank, transferMoney};