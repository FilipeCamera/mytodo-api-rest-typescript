import { RefreshToken } from '../models';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { RefreshTokenRepository } from '../repositories';
import { ServerError } from '../helpers/errors';

export default class TokenService {
  private readonly tokenRefreshRepository: RefreshTokenRepository;

  constructor() {
    this.tokenRefreshRepository = new RefreshTokenRepository();
  }

  async generate(user: User): Promise<Record<string, string>> {
    const accessToken = jwt.sign(
      { sub: user.id, admin: user.role.name === 'ADMIN' },
      process.env.JWT_SECRET_KEY,
      {
        audience: 'urn:jwt:type:access',
        issuer: 'urn:system:token-issuer:type:access',
        expiresIn: '5m',
      }
    );

    const existRefreshToken = await this.tokenRefreshRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existRefreshToken) {
      await this.tokenRefreshRepository.remove(existRefreshToken);
    }
    const expiresIn = dayjs().add(15, 'minutes').unix();
    const refreshToken = this.tokenRefreshRepository.create({
      user: user,
      expiresIn: expiresIn,
    });

    if (!refreshToken) {
      throw new ServerError('Could not create refresh token');
    }

    await this.tokenRefreshRepository.save(refreshToken);

    return { accessToken, refreshToken: refreshToken.id };
  }

  async verify(token: string): Promise<boolean> {
    const valid = !!jwt.verify(token, process.env.JWT_SECRET_KEY);

    return valid;
  }

  async refresh(id: string): Promise<Record<string, string>> {
    const refresh = await this.tokenRefreshRepository.findOne({
      where: { id },
      relations: { user: { role: true } },
    });

    if (!refresh) {
      throw new Error('Refresh Token invalid');
    }

    const { accessToken, refreshToken } = await this.generate(refresh.user);

    return { accessToken, refreshToken };
  }

  async getRefreshToken(id: string): Promise<RefreshToken> {
    return await this.tokenRefreshRepository.findOne({ where: { id } });
  }

  async deleteRefreshToken(id: string) {
    return await this.tokenRefreshRepository.delete(id);
  }
}
