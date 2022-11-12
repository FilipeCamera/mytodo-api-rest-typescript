import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import Role from '../models/role';

export default class RoleService {
  private readonly roleRepository: Repository<Role>;
  constructor() {
    this.roleRepository = MyToDoDataSource.getRepository(Role);
  }

  async findByName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { name } });
  }
}
