import { FindManyOptions, Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import User from '../models/user';

export default class UserRepository extends Repository<User> {
  constructor() {
    super(User, MyToDoDataSource.createEntityManager());
  }

  async findAll(options?: FindManyOptions<User>): Promise<Array<User>> {
    return await this.find({
      ...options,
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async findOneByID(id: string): Promise<User> {
    return await this.findOne({
      select: { id: true, email: true, createdAt: true, updatedAt: true },
      where: { id },
    });
  }
}
