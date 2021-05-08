import React from 'react';
import UserCard from '../UserCard';
import { User } from '../../types';

type UserListProps = { className?: string; users: User[] };

function UserList({ className, users }: UserListProps): JSX.Element {
    return (
        <div className={className}>
            <h2 className="text-3xl md:text-4xl text-gray-600 text-center">User List</h2>

            <div>
                {users.length > 0 ? (
                    <div className="flex mb-2 border-l-4 border-white text-gray-500 text-lg">
                        <span className="w-1/2 px-2">Id</span>
                        <span className="w-1/2 px-2">Name</span>
                        <span className="w-1/2 px-2">Email</span>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-800"> No users currently registered </p>
                )}

                {users.map((user: User) => {
                    return (
                        <div
                            key={user.id}
                            className="flex mb-2 border-l-4 border-white hover:border-purple-600 cursor-pointer"
                        >
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
                })}
            </div>
            <h2 className="mt-24 mb-2 text-3xl md:text-4xl text-gray-600 text-center">
                User Cards
            </h2>
            <div className="grid grid-flow-rows grid-col-1 mx-8 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {users.map((user: User) => {
                    return <UserCard key={user.id} user={user} />;
                })}
            </div>
        </div>
    );
}
export default UserList;
