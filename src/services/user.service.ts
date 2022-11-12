import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import Role from '../models/role';
import User from '../models/user';

export default class UserService {
  private readonly userRepository: Repository<User>;
  constructor() {
    this.userRepository = MyToDoDataSource.getRepository(User);
  }

  async existUser(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({
      where: { email },
    }));
  }

  create(email: string, password: string, role: Role): User {
    return this.userRepository.create({ email, password, role });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Array<User>> {
    return await this.userRepository.find();
  }

  async remove(user: User): Promise<boolean> {
    return !!(await this.userRepository.remove(user));
  }
}
