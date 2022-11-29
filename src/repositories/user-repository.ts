import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import User from '../models/user';

export default class UserRepository extends Repository<User> {
  constructor() {
    super(User, MyToDoDataSource.createEntityManager());
  }
}
