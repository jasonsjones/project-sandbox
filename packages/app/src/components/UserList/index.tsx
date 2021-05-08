import React from 'react';
import { User } from '../../types';

type UserRecordProps = { className?: string; user: User };
function UserRecord({ className, user }: UserRecordProps): JSX.Element {
    return (
        <div className={className}>
            <span className="w-1/2 px-2 text-sm text-purple-900 md:text-xl">{user.id}</span>
            <span className="w-1/2 px-2 text-sm text-gray-800 md:text-xl">{user.displayName}</span>
            <span className="w-1/2 px-2 text-sm text-gray-800 md:text-xl">{user.email}</span>
        </div>
    );
}

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
                        <UserRecord
                            key={user.id}
                            user={user}
                            className="flex mb-2 border-l-4 border-white hover:border-purple-600 cursor-pointer"
                        />
                    );
                })}
            </div>
        </div>
    );
}
export default UserList;
