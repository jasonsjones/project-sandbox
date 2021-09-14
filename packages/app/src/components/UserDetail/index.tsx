import { User } from '../../types';

type UserRecordProps = { className?: string; user: User };
function UserDetail({ user }: UserRecordProps): JSX.Element {
    return (
        <div className="flex gap-x-8 mt-12">
            <img
                src="http://localhost:3000/default/avatar.png"
                alt="default avatar"
                className="w-32 rounded-full border-2 border-purple-300"
            />
            <div className="flex flex-col justify-center">
                <p className="text-3xl">{user.displayName}</p>
                <p className="text-xl">{user.email}</p>
            </div>
        </div>
    );
}

export default UserDetail;
