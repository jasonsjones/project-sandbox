import { MutationFunction } from 'react-query';

export interface GraphQLResponse {
    data?: any;
    errors?: any;
}

interface QueryPayload {
    query: string;
    variables?: object;
}

const graphqlEndpoint = 'http://localhost:3000/graphql';

export function makeGraphQLQuery(
    _: string,
    { query, variables = {} }: QueryPayload
): Promise<GraphQLResponse> {
    return fetch(graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
}

export const makeGraphQLMutation: MutationFunction<GraphQLResponse, QueryPayload> = ({
    query,
    variables
}): Promise<GraphQLResponse> => {
    return fetch(graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
};
