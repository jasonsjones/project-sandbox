import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLMutation } from '../dataservice';

interface LoginOptions {
    onSuccess?: (response: GraphQLResponse) => void;
    onError?: (error: Error) => void;
}

export default function useLogin(loginOptions: LoginOptions) {
    return useMutation(makeGraphQLMutation, {
        onSuccess: loginOptions.onSuccess,
        onError: loginOptions.onError
    });
}
