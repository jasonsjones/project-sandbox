import request from 'supertest';
import Express from 'express';
import { oliver, barry, dig, cisco } from './userData';
import { GetUserOp, RegisterUserOp, UserQuery } from './userQueries';

function generateVariableMap(keyName: string) {
    return {
        keyName: [`variables.${keyName}`]
    };
}

const constants = {
    OPERATIONS: 'operations',
    MAP: 'map'
};

export function makeGraphQLCall(
    app: Express.Application,
    query: string,
    variables = {}
): request.Test {
    return request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query, variables });
}

export function makeGraphQLFileUpload(
    app: Express.Application,
    fileLocation: string,
    fileKey: string
): request.Test {
    const query = `
mutation AvatarUpload ($image: Upload!) {
    avatarUpload(image: $image)
}
`;

    const variables = {
        image: null
    };

    const variableMap = generateVariableMap(fileKey);

    return request(app)
        .post('/graphql')
        .set('Content-Type', 'multipart/form-data')
        .field(constants.OPERATIONS, JSON.stringify({ query, variables }))
        .field(constants.MAP, JSON.stringify(variableMap))
        .attach(Object.keys(variableMap)[0], fileLocation);
}

export { oliver, dig, barry, cisco, GetUserOp, RegisterUserOp, UserQuery };
