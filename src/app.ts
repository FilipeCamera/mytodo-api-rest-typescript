import 'reflect-metadata';
import 'dotenv/config';
import express, { Application } from 'express';
import routes from './routes';
import MyToDoDataSource from './database';
import cors from 'cors';
import cookieParser from 'cookie-parser';

class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.loadDatabase();
    this.middlewares();
    this.app.use(routes);
  }

  private async loadDatabase() {
    try {
      await MyToDoDataSource.initialize();
    } catch (e) {
      return console.log(e.message);
    }
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  listen(port: number) {
    this.app.listen(port, () => console.log(`API rodando na porta ${port}`));
  }
}

export default new App();
