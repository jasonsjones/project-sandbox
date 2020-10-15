import { MutationFunction } from 'react-query';

interface GraphQLResponse {
    data?: any;
    error?: any;
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
    // return Promise.resolve({ data: {}, error: {} });
    return fetch(graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
};

/*
export function makeGraphQLMutation(query: string, variables: UserData): Promise<GraphQLResponse> {
    return fetch(graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
}
*/
