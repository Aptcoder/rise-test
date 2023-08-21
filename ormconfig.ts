import dotenv from 'dotenv';

dotenv.config();

export default {
  type: 'postgres',
  host: 'localhost',
  port: 5678,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'rise',
  logging: false,
  entities: [
    'src/entities/**/*.{js,ts}'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities'
  },
  seeds: [
    'src/seeds/*.ts'
  ],
  factories: [
    'src/seeds/factories/**/*.ts'
  ]
};
