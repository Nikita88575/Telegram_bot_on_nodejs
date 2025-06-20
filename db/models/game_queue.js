import { DataTypes } from 'sequelize';
import sequelize from '../../data/config.js';
import User from './user.js';

const gameQueue = sequelize.define('game_queue', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  game_type: {
    type: DataTypes.STRING,
  },
});

gameQueue.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user',
});

export default gameQueue;
