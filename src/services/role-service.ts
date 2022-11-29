import Role from '../models/role';
import { RoleRepository } from '../repositories';

export default class RoleService {
  private readonly roleRepository: RoleRepository;
  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async findByName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { name } });
  }
}
