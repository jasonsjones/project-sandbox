import { MutationFunction, QueryFunctionContext } from 'react-query';

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

const devEndpoint = 'http://localhost:3000/graphql';
const prodEndpoint = 'https://orionlabs-api.herokuapp.com';

const graphqlEndpoint = process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint;

export function makeGraphQLQuery({
    queryKey
}: QueryFunctionContext<[string, QueryPayload]>): Promise<GraphQLResponse> {
    const [, { query, variables = {}, token }] = queryKey;
    const fetchHeaders: Record<string, string> = {
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
    file,
    token
}: QueryPayload): Promise<GraphQLResponse> => {
    const fetchHeaders: Record<string, string> = {};

    if (token) {
        fetchHeaders.Authorization = `Bearer ${token}`;
    }
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
        headers: fetchHeaders,
        body: data
    }).then((res) => res.json());
};
