import dotenv from 'dotenv';

dotenv.config();

export default {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET,
  database: {
    host: 'localhost',
    port: 5678,
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'rise'
  }
};
