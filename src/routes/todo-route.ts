import { Router } from 'express';
import TodoController from '../controllers/todo-controller';
import { withAccessAuthenticated } from '../middlewares/auth-middlewares';
import { TodoService, UserService } from '../services';

const todoRoutes = Router();

const userService = new UserService();
const todoService = new TodoService();

const todoController = new TodoController(userService, todoService);

todoRoutes.get('/todos', withAccessAuthenticated, (req, res) =>
  todoController.read(req, res)
);

todoRoutes.post('/todos', withAccessAuthenticated, (req, res) =>
  todoController.create(req, res)
);

export default todoRoutes;
