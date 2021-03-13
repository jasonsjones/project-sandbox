import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLFileUpload } from '../dataservice';

interface LoginOptions {
    onSuccess?: (response: GraphQLResponse) => void;
    onError?: (error: Error) => void;
}

export default function useFileUpload(loginOptions: LoginOptions) {
    return useMutation(makeGraphQLFileUpload, {
        onSuccess: loginOptions.onSuccess,
        onError: loginOptions.onError
    });
}
