import gameQueue from './models/game_queue.js';
import sequelize from '../data/config.js';

async function selectGameQueue(user_id, game_type) {
  try {
    const user = await gameQueue.findOne({
      where: { user_id: user_id, game_type: game_type },
    });
    return user;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function addGameQueue(user_id, game_type) {
  const transaction = await sequelize.transaction();
  try {
    const exist = await gameQueue.findAll({
      where: { user_id: user_id, game_type: game_type },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (exist.length > 0) {
      await transaction.rollback();
      return null;
    }

    const game = await gameQueue.create(
      {
        user_id,
        game_type,
      },
      { transaction }
    );
    await transaction.commit();
    return game;
  } catch (error) {
    await transaction.rollback();
    console.log(`[${Date()}] ${error}`);
  }
}

export { selectGameQueue, addGameQueue };
