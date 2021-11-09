import { UnauthorizedException, Injectable, NestMiddleware, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/modules/user-module/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private userService: UserService
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        if (req.headers.authorization) {
            let [type, token] = req.headers.authorization.split(" ");
            let checker = this.userService.verifyAccount(token);
            if (checker.isSuccess) {
                req.user = checker.data;
                next();
            }
        }
        else throw new UnauthorizedException();
    }
}
