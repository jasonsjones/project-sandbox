import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLMutation } from '../dataservice';

interface LogoutOptions {
    onSuccess?: (response: GraphQLResponse) => void;
    onError?: (error: Error) => void;
}

export default function useLogout(logoutOptions: LogoutOptions) {
    return useMutation(makeGraphQLMutation, {
        onSuccess: logoutOptions.onSuccess,
        onError: logoutOptions.onError
    });
}
