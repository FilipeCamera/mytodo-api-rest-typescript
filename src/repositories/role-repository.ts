import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import { Role } from '../models';

export default class RoleRepository extends Repository<Role> {
  constructor() {
    super(Role, MyToDoDataSource.createEntityManager());
  }
}
