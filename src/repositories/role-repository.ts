import { Repository } from "typeorm";
import { Role } from "../models/role";

class RoleRepository extends Repository<Role> {}

export default RoleRepository;
