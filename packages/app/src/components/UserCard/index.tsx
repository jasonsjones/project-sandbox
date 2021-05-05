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
        <div className="flex p-4 transition duration-200 ease-in-out border-l-4 border-purple-600 bg-gray-100 shadow-md transform hover:shadow-lg cursor-pointer">
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
