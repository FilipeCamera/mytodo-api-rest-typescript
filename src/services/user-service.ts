import { User, Role } from '../models';
import { UserRepository } from '../repositories';

export default class UserService {
  private readonly userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
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
