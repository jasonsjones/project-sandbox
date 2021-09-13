import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { makeGraphQLQuery } from '../dataservice';

export default function useUsers(id: string) {
    const { token } = useAuthContext();

    const usersQuery = `
    query fetchUser($id: String!) {
         user (id: $id) {
             id
             displayName
             email
        }
    }`;

    return useQuery(['user', { query: usersQuery, variables: { id }, token }], makeGraphQLQuery);
}
