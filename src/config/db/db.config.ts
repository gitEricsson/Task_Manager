import { Sequelize } from 'sequelize';
import AppConfig from '../app.config';

const sequelize = new Sequelize(
  {
      dialect: 'postgres',
      host: AppConfig.db.host,
      username: AppConfig.db.username,
      password: AppConfig.db.password,
      database:  AppConfig.db.database,
    port: AppConfig.db.port,
    logging: AppConfig.db.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(
      `Database Connection Established Successfully\nHOST: ${AppConfig.db.host}\nPORT: ${AppConfig.db.port}\nDATABASE: ${AppConfig.db.database}`
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

const closeConnection = async (): Promise<void> => {
  await sequelize.close();
};

export { sequelize, connectToDatabase, closeConnection };
