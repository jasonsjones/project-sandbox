import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import clc from 'cli-color';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const hasBody = Object.keys(req.body).length !== 0;
        const methodAndPath = `${clc.green(req.method)}  ${clc.white(req.path)}`;

        let query = '';
        let variables = '';
        if (hasBody && req.body.operationName === 'IntrospectionQuery') {
            query = 'graphql playground query';
        } else if (hasBody && Object.keys(req.body).includes('query')) {
            query = req.body.query;
            variables = req.body.variables;

            console.log(methodAndPath);
            console.log('query: ', clc.cyan.italic(query));
            console.log('variables: ', clc.magenta(JSON.stringify(variables)));
        } else {
            console.log(`${methodAndPath}`);
        }

        next();
    }
}
