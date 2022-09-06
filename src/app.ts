import "reflect-metadata";
import { Application, application } from "express";
import routes from "./routes";

class App {
  private readonly app: Application;

  constructor() {
    this.app = application;
    this.app.use(routes);
  }

  listen(port: number) {
    this.app.listen(port, () => console.log(`API rodando na porta ${port}`));
  }
}

export default new App();
