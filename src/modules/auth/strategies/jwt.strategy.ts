import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
