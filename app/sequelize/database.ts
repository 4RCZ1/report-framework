import { Sequelize } from 'sequelize';
import * as pg from 'pg';

const database = 'postgres';
const username = 'postgres';
const password = 'changeme';
const host = 'localhost';
const dialect = 'postgres';

export const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectModule: pg,
  logging: true
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch((error: any) => console.error('Unable to connect to the database:', error));

// Sync all models
sequelize.sync({ force: false})
  .then(() => console.log('All models were synchronized successfully.'))
  .catch(error => console.error('An error occurred while synchronizing models:', error));