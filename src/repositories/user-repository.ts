import { Repository } from "typeorm";
import { User } from "../models/user";

class UserRepository extends Repository<User> {}

export default UserRepository;
