// src/adapters/api/graphql/strategies/jwt.strategy.ts
import type { JwtPayload } from '@app-types/jwt.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ValidateAccessTokenSessionUsecase } from '@src/usecases/auth/validate-access-token-session.usecase';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, type JwtFromRequestFunction, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly validateAccessTokenSessionUsecase: ValidateAccessTokenSessionUsecase,
    private readonly logger: PinoLogger,
  ) {
    const secret = configService.get<string>('jwt.secret');
    const issuer = configService.get<string>('jwt.issuer');
    const audience = configService.get<string>('jwt.audience');

    if (!secret) {
      throw new Error('JWT secret 配置缺失');
    }

    const jwtExtractor: JwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
    const audienceArray = audience ? audience.split(',').map((aud) => aud.trim()) : undefined;

    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: issuer || undefined,
      audience: audienceArray || undefined,
    });

    this.logger.setContext(JwtStrategy.name);
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return await this.validateAccessTokenSessionUsecase.execute({ payload });
  }
}
