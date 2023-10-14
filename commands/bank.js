import bot from '../app.js';
import { selectUser, checkUser, transferBank, paymentSys } from '../db/quick_commands.js';

async function bank(msg) {
    try {
        const thisBot = bot.getMe();
        if (msg.text == '/bank' || msg.text == '!bank' || 
            msg.text == `/bank@${thisBot.username}` || 
            msg.text == `!bank@${thisBot.username}`) {
        
            await checkUser(msg, new Date());
            const user = await selectUser(msg.from.id);
            
            const bank_balance = parseInt(user.bank) * 50000;
            const value = new Intl.NumberFormat('en-US').format(bank_balance);

            await bot.sendMessage(msg.chat.id,
                'У банку можна обміняти гроші на облігації, і навпаки.\n' + 
                'Ціна однієї облігації: 50 000💵.\n\n' +
                `У Вас ${user.bank} облінгції на суму ${value} 💵.\n` +
                'Купівля: /bank +1 або <code>!bank +1</code>\n' + 
                'Продаж: /bank -1 або <code>!bank -1</code>', 
                {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
        
        } else if (msg.text.startsWith('/bank') || msg.text.startsWith('!bank')) {

            const user = await selectUser(msg.from.id);
            const value = msg.text.split(' ')[1];
            const amount = parseInt(value.match(/\d+/));

            if (value.startsWith('+')) {
                const total = amount * 50000;

                if (parseInt(user.balance) >= total) {

                    await transferBank(msg.from.id, amount);
                    await paymentSys(msg.from.id, parseInt(-total));
                    
                    const obl = await selectUser(msg.from.id);
                    const formattedBank = new Intl.NumberFormat('en-US').format(parseInt(obl.bank) * 50000);
                    
                    await bot.sendMessage(msg.chat.id,
                        `Ти успішно купив ${amount} облігацій ❗️\nУ тебе ${obl.bank} облігації на суму ${formattedBank}💵❗️`,
                        {reply_to_message_id: msg.message_id});

                } else {

                    const formattedBalance = new Intl.NumberFormat('en-US').format(user.balance);
                    await bot.sendMessage(msg.chat.id,
                        `У тебе недостатньо коштів❗️\nТвій баланс: ${formattedBalance}💵❗️`,
                        {reply_to_message_id: msg.message_id});
                }

            } else if (value.startsWith('-')) {

                const total = amount * 50000;
                if (parseInt(user.bank) >= amount) {

                    await transferBank(msg.from.id, -amount);
                    await paymentSys(msg.from.id, total);

                    const obl = await selectUser(msg.from.id);
                    const formattedBank = new Intl.NumberFormat('en-US').format(parseInt(obl.bank) * 50000);
                    
                    await bot.sendMessage(msg.chat.id,
                        `Ти успішно продав ${amount} облігацій ❗️\nУ тебе ${obl.bank} облігації на суму ${formattedBank}💵❗️`,
                        {reply_to_message_id: msg.message_id});

                } else {

                    await bot.sendMessage(msg.chat.id,
                        `У тебе недостатньо облігацій❗️\nКількість облігацій: ${user.bank}❗️`,
                        {reply_to_message_id: msg.message_id});
                }
            }
        }
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
};

export default bank;