import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { makeGraphQLQuery } from '../dataservice';

export default function useAvatar(key: string | undefined) {
    const { token } = useAuthContext();

    const avatarQuery = `
    query fetchAvatar($key: String!) {
         avatar (key: $key)
    }`;

    return useQuery(
        ['avatar', { query: avatarQuery, variables: { key }, token }],
        makeGraphQLQuery
    );
}
