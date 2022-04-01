import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**********************************************************************
 * This auth guard is no longer wired up in the app.  It was replaced
 * with (and rightly so) passportjs jwt strategy and auth guard.
 * Leaving this here for the time being as an implementation reference.
 **********************************************************************/

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const authUser = ctx.getContext().req.user;
        return !!authUser;
    }
}
