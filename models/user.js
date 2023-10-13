import { DataTypes } from 'sequelize';
import sequelize from '../data/config.js';

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  dick_size: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  referral_id: {
    type: DataTypes.BIGINT,
    defaultValue: null,
  },
  count_refs: {
    type: DataTypes.BIGINT,
    defaultValue: null,
  },
  last_time_bonus: {
    type: DataTypes.DATE,
  },
  last_time_dick: {
    type: DataTypes.DATE,
  },
});

export default User;