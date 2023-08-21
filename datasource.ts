
import { DataSource } from 'typeorm';
import config from 'config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.get<string>('database.host'),
  port: 5432,
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
  database: config.get<string>('database.database'),
  logging: false,
  migrations: ['src/migrations/**/*.ts'],
  entities: ['src/**/*.entity.ts'],
  ssl: config.get<boolean>('database.ssl'),
});

