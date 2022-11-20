import { accessTokenOptions, JWT_VALUE } from '@constant';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { JwtPayload } from 'src/types/auth.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
					const token = req?.cookies.refreshToken;
					return token ?? null;
				},
			]),
			secretOrKey: configService.get(JWT_VALUE.JWT_REFRESH_TOKEN_SECRET),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: Payload) {
		const accessToken = this.authService.createJwt({
			payload: { nickname: payload.nickname, email: payload.email },
			secret: JWT_VALUE.JWT_ACCESS_TOKEN_SECRET,
			expirationTime: JWT_VALUE.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
		});

		req.cookies.accessToken = accessToken;

		return payload;
	}
}
