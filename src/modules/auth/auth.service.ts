import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { id: string; email: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }), // TODO: Use config
    };
  }

  async register(email: string, pass: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const passwordHash = await bcrypt.hash(pass, 10);
    return this.usersService.create({
      email,
      passwordHash,
      isVerified: false,
    });
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      // Check if token is in db and not revoked (if implemented)
      // For now just resign
      const newPayload = { email: payload.email, sub: payload.sub };
      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
