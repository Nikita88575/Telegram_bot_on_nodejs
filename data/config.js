import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(process.env.DATABASE, null, null, {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
});

export default sequelize;
