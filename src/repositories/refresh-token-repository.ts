import { Repository } from 'typeorm';
import MyToDoDataSource from '../database';
import { RefreshToken } from '../models';

export default class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor() {
    super(RefreshToken, MyToDoDataSource.createEntityManager());
  }
}
