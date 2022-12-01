import { Router } from 'express';
import authRoutes from './auth-route';
import todoRoutes from './todo-route';
import userRoutes from './user-route';

const routes = Router();

routes
  .get('/api', (req, res) => {
    return res.send('Bem-vindo a API do MyTodo!');
  })
  .use('/api', [userRoutes, authRoutes, todoRoutes]);

export default routes;
