import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import { Todo } from '../models';

export default class TodoRepository extends Repository<Todo> {
  constructor() {
    super(Todo, MyToDoDataSource.createEntityManager());
  }
}
