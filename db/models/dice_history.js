import { DataTypes } from 'sequelize';
import sequelize from '../../data/config.js';
import User from './user.js';

const diceHistory = sequelize.define('dice_history', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  // Users choise
  dice_number: {
    type: DataTypes.BIGINT,
  },
  // Users bet
  bet_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  // Dice result (win/lose)
  dice_result: {
    type: DataTypes.STRING,
  },
  // Dice number
  dice_result_number: {
    type: DataTypes.BIGINT,
  },
  // Bet result
  bet_multiplier: {
    type: DataTypes.FLOAT,
  },
  // Bet result
  dice__result_bet_amount: {
    type: DataTypes.FLOAT,
  },
  // Bet date/time
  bet_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

diceHistory.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user',
});

export default diceHistory;
