import { DataSource } from 'typeorm';

import 'dotenv/config';

import User from '../models/user';
import Role from '../models/role';
import Todo from '../models/todo';

const PORT = parseInt(process.env.DB_PORT) || 49153;

const MyToDoDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_URL,
  port: PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Role, Todo],
  //logging: true,
  synchronize: true,
});

export default MyToDoDataSource;
