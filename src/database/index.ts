import { DataSource } from "typeorm";

import "dotenv/config";

import { User } from "../models/User";
import { Role } from "../models/Role";
import { Todo } from "../models/Todo";

const PORT = parseInt(process.env.DB_PORT) || 5432;

const MyToDoDataSource = new DataSource({
  type: "postgres",
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
