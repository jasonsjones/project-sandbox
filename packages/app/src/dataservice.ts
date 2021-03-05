import { MutationFunction } from 'react-query';

export interface GraphQLResponse {
    data?: any;
    errors?: any;
}

interface QueryPayload {
    query: string;
    variables?: object;
    token?: string;
    file?: File;
}

const graphqlEndpoint = 'http://localhost:3000/graphql';

export function makeGraphQLQuery({
    queryKey
}: {
    queryKey: [string, QueryPayload];
}): Promise<GraphQLResponse> {
    const [, { query, variables = {}, token }] = queryKey;
    let fetchHeaders: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        fetchHeaders.Authorization = `Bearer ${token}`;
    }

    return fetch(graphqlEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: fetchHeaders,
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
}

export const makeGraphQLMutation: MutationFunction<GraphQLResponse, QueryPayload> = ({
    query,
    variables
}): Promise<GraphQLResponse> => {
    return fetch(graphqlEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
};

export const makeGraphQLFileUpload: MutationFunction<GraphQLResponse, QueryPayload> = ({
    query,
    variables = {},
    file
}: QueryPayload): Promise<GraphQLResponse> => {
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
        credentials: 'include',
        body: data
    }).then((res) => res.json());
};
