import bowlingHistory from './models/bowling_history.js';

async function selectUser(user_id) {
  try {
    const user = await bowlingHistory.findOne({ where: { user_id } });
    return user;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function addBowlingRecord(
  user_id,
  bet_amount,
  bowling_result,
  bowling_result_number,
  bet_multiplier,
  bowling_result_bet_amount,
  bet_date
) {
  try {
    const bet_record = await bowlingHistory.create({
      user_id,
      bet_amount,
      bowling_result,
      bowling_result_number,
      bet_multiplier,
      bowling_result_bet_amount,
      bet_date,
    });
    return bet_record;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function bowlingCount(user_id) {
  try {
    const bets_count = await bowlingHistory.findAll({
      where: { user_id: user_id },
    });
    return bets_count.length;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { selectUser, addBowlingRecord, bowlingCount };
