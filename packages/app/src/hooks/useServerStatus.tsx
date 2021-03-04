import { useQuery } from 'react-query';
import { makeGraphQLQuery } from '../dataservice';

export default function useServerStatus() {
    const statusQuery = 'query { status }';
    return useQuery(['status', { query: statusQuery }], makeGraphQLQuery);
}
