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

export function makeGraphQLFileUpload({ query, variables = {} }: QueryPayload, file: File) {
    const data = new FormData();

    if (Object.keys(variables).length > 0) {
        data.append(
            'operations',
            JSON.stringify({
                query,
                variables
            })
        );

        data.append(
            'map',
            JSON.stringify({
                '0': [`variables.${Object.keys(variables)[0]}`]
            })
        );
        data.append('0', file as Blob);
    }

    return fetch(graphqlEndpoint, {
        method: 'POST',
        body: data
    }).then((res) => res.json());
}
