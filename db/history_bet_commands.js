import BetHistory from './models/bet_history.js';

async function selectUser(user_id) {
  try {
    const user = await BetHistory.findOne({ where: { user_id } });
    return user;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function addBetRecord(
  user_id,
  dice_number,
  bet_amount,
  dice_result,
  dice_result_number,
  bet_multiplier,
  dice_bet_amount,
  bet_date
) {
  try {
    const bet_record = await BetHistory.create({
      user_id,
      dice_number,
      bet_amount,
      dice_result,
      dice_result_number,
      bet_multiplier,
      dice_bet_amount,
      bet_date,
    });
    return bet_record;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function betCount(user_id) {
  try {
    const bets_count = await BetHistory.findAll({
      where: { user_id: user_id },
    });
    return bets_count.length;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { selectUser, addBetRecord, betCount };
