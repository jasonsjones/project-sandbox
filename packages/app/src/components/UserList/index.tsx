import React from 'react';
import { useQuery } from 'react-query';
import { makeGraphQLQuery } from '../../dataservice';
import Spinner from '../Spinner';
import UserCard from '../UserCard';

type UserListProps = { className: string };

function UserList({ className }: UserListProps): JSX.Element {
    const statusQuery = 'query { users { id displayName email } }';
    const { data, isLoading } = useQuery(['users', { query: statusQuery }], makeGraphQLQuery);
    if (isLoading) return <Spinner />;
    return (
        <div className={className}>
            <h2 className="text-3xl text-gray-600 text-center border-b-2">User List</h2>

            <div className="px-8 py-4 md:p-4">
                {data?.data?.users?.length > 0 ? (
                    <div className="flex text-gray-500 text-lg">
                        <span className="w-1/2 px-2">Id</span>
                        <span className="w-1/2 px-2">Name</span>
                        <span className="w-1/2 px-2">Email</span>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-800"> No users currently registered </p>
                )}

                {data &&
                    data.data?.users?.map(
                        (user: { id: string; displayName: string; email: string }) => {
                            return (
                                <div key={user.id} className="flex mb-2">
                                    <span className="w-1/2 px-2 text-sm text-purple-900 md:text-base">
                                        {user.id}
                                    </span>
                                    <span className="w-1/2 px-2 text-sm text-gray-800 md:text-base">
                                        {user.displayName}
                                    </span>
                                    <span className="w-1/2 px-2 text-sm text-gray-800 md:text-base">
                                        {user.email}
                                    </span>
                                </div>
                            );
                        }
                    )}
            </div>
            <h2 className="mb-2 text-3xl text-gray-600 text-center">User Cards</h2>
            <div className="grid grid-flow-rows grid-col-1 mx-8 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {data &&
                    data.data?.users?.map(
                        (user: { id: string; displayName: string; email: string }) => {
                            return <UserCard key={user.id} user={user} />;
                        }
                    )}
            </div>
        </div>
    );
}
export default UserList;
