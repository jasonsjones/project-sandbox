import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLMutation } from '../dataservice';

interface RegisterOptions {
    onSuccess?: (response: GraphQLResponse) => void;
    onError?: (error: Error) => void;
}
export default function useRegister(options: RegisterOptions) {
    return useMutation(makeGraphQLMutation, {
        onSuccess: options.onSuccess
    });
}
