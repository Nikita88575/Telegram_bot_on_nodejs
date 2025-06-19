import { DataTypes } from 'sequelize';
import sequelize from '../../data/config.js';
import User from './user.js';

const bowlingHistory = sequelize.define('bowling_history', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  // Users bet
  bet_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  // Dice result (win/lose)
  bowling_result: {
    type: DataTypes.STRING,
  },
  // Dice number
  bowling_result_number: {
    type: DataTypes.BIGINT,
  },
  // Bet result
  bet_multiplier: {
    type: DataTypes.FLOAT,
  },
  // Bet result
  bowling_result_bet_amount: {
    type: DataTypes.FLOAT,
  },
  // Bet date/time
  bet_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

bowlingHistory.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user',
});

export default bowlingHistory;
