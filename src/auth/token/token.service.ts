import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class TokenService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async invalidateToken(token: string): Promise<void> {
    const payload = this.jwtService.verify(token);
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    const ttl = Math.max(0, exp - now);

    await this.redis.setex(`blacklist:${token}`, ttl, 'true');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${token}`);
    return Boolean(result);
  }
}
