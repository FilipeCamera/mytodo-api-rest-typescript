import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';
import express, { Application } from 'express';
import routes from './routes';
import MyToDoDataSource from './database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import HandleErrors from './middlewares/error-middlewares';

class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.loadDatabase();
    this.middlewares();
    this.app.use(routes);
    this.errorsMiddlewares();
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

  private errorsMiddlewares() {
    this.app.use(HandleErrors);
  }

  listen(port: number) {
    this.app.listen(port, () => console.log(`API rodando na porta ${port}`));
  }
}

export default new App();
