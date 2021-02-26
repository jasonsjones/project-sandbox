import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import clc from 'cli-color';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService, private userService: UserService) {}

    async use(req: Request, _: Response, next: NextFunction) {
        if (Object.keys(req.body).length && req.body.operationName !== 'IntrospectionQuery') {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
                try {
                    const token = authorizationHeader.split(' ')[1];
                    const decodedPayload = this.authService.verifyToken(token);
                    const authUser = await this.userService.findByEmail(
                        decodedPayload.email as string
                    );

                    if (authUser) {
                        req.user = authUser;
                    }
                } catch (err) {
                    // noop for any errors...
                    if (process.env.NODE_ENV !== 'test') {
                        console.log(clc.red('Auth middleware error: ', err.message));
                    }
                }
            }
        }
        next();
    }
}
