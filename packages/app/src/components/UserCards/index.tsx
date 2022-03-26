import { Link } from 'react-router-dom';
import { User } from '../../types';

type UserCardProps = { user: User };
function UserCard({ user }: UserCardProps): JSX.Element {
    return (
        <Link
            to={`/users/${user.id}`}
            className="flex p-4 min-w-max text-base md:text-xl transition duration-200 ease-in-out border-l-4 border-purple-600 bg-gray-100 shadow-md transform hover:shadow-lg cursor-pointer"
        >
            <img
                src="http://localhost:3000/default/avatar.png"
                alt="default avatar"
                className="w-24 rounded-full border-2 border-purple-300"
            />
            <div className="flex flex-col justify-center ml-4 text-purple-900">
                <span>{user.displayName}</span>
                <span>{user.email}</span>
            </div>
        </Link>
    );
}

type UserCardsProps = { className?: string; users: User[] };
function UserCards({ className, users }: UserCardsProps): JSX.Element {
    return (
        <div className={className}>
            <h2 className="mb-2 text-3xl md:text-4xl text-gray-600 text-center">User Cards</h2>
            <div className="grid grid-flow-rows grid-col-1 mx-8 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {users.map((user: User) => {
                    return <UserCard key={user.id} user={user} />;
                })}
            </div>
        </div>
    );
}

export default UserCards;
