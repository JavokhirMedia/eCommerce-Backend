import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.ACCESS_TOKEN_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role // Rol token ichida mavjudligiga ishonch hosil qiling
        };
    }
}