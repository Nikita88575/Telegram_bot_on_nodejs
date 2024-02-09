import { DataTypes } from 'sequelize';
import sequelize from '../../data/config.js';

const Team = sequelize.define('team', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chat_id: {
    type: DataTypes.BIGINT,
  },
});

const teamBlacklist = sequelize.define('teams_blacklist', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}); 

export { Team, teamBlacklist};