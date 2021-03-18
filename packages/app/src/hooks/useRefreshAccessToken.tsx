import { useMutation } from 'react-query';
import { makeGraphQLMutation } from '../dataservice';

export default function useRefreshAccessToken() {
    return useMutation(makeGraphQLMutation);
}
