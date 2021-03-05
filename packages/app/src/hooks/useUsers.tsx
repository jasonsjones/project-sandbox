import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { makeGraphQLQuery } from '../dataservice';

export default function useUsers() {
    const { token } = useAuthContext();

    const statusQuery = 'query { users { id displayName email } }';

    return useQuery(['users', { query: statusQuery, token }], makeGraphQLQuery);
}
