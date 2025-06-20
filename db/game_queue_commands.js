import gameQueue from './models/game_queue.js';

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
  try {
    const exist = await gameQueue.findAll({
      where: { user_id: user_id, game_type: game_type },
    });
    if (exist.length > 0) {
      return null;
    }
    const game = await gameQueue.create({
      user_id,
      game_type,
    });
    return game;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { selectGameQueue, addGameQueue };
