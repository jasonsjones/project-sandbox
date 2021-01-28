import React from 'react';

type UserCardProps = {
    user: {
        id?: string;
        displayName?: string;
        email?: string;
    };
};

function UserCard({ user }: UserCardProps): JSX.Element {
    return (
        <div className="flex p-4 transition duration-200 ease-in-out border-2 border-purple-600 rounded-md shadow-md transform hover:bg-purple-100 hover:scale-105 hover:shadow-lg">
            <img
                src="http://localhost:3000/default/avatar.png"
                alt="default avatar"
                className="w-24 rounded-full border-2 border-purple-300"
            />
            <div className="flex flex-col justify-center ml-4 text-purple-900">
                <span>{user.displayName}</span>
                <span>{user.email}</span>
            </div>
        </div>
    );
}

export default UserCard;
