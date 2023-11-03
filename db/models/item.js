import { DataTypes } from 'sequelize';
import sequelize from '../../data/config.js';

const Item = sequelize.define('item', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
});

export default Item;