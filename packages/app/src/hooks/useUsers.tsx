import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { makeGraphQLQuery } from '../dataservice';

export default function useUsers() {
    const { token } = useAuthContext();

    const usersQuery = 'query { users { id displayName email } }';

    return useQuery(['users', { query: usersQuery, token }], makeGraphQLQuery);
}
