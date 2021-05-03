import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import clc from 'cli-color';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    use(req: Request, _: Response, next: NextFunction) {
        const hasBody = Object.keys(req.body).length !== 0;
        const methodAndPath = `${clc.green(req.method)}  ${clc.white(req.path)}`;

        let query = '';
        let variables = '';
        if (hasBody && req.body.operationName === 'IntrospectionQuery') {
            query = 'graphql playground query';
        } else if (hasBody && Object.keys(req.body).includes('query')) {
            query = req.body.query;
            variables = req.body.variables;

            this.logger.log(methodAndPath);
            this.logger.log(clc.cyan.italic(query), `${LoggerMiddleware.name} -- query`);
            this.logger.log(
                clc.magenta(JSON.stringify(variables)),
                `${LoggerMiddleware.name} -- variables`
            );
        } else {
            this.logger.log(`${methodAndPath}`);
        }

        next();
    }
}
