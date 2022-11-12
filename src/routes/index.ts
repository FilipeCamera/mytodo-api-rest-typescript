import { Router } from 'express';
import userRoutes from './user.router';

const routes = Router();

routes
  .get('/api', (req, res) => {
    return res.send('Bem-vindo a API do MyTodo!');
  })
  .use('/api', userRoutes);

export default routes;
