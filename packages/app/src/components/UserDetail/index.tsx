import { User } from '../../types';
import ProfilePic from '../ProfilePic';

type UserRecordProps = {
    className?: string;
    user: User;
};

function UserDetail({ user }: UserRecordProps): JSX.Element {
    return (
        <div className="flex gap-x-8 mt-12">
            <ProfilePic id={user.id} size="large" />
            <div className="flex flex-col justify-center gap-y-4">
                <p className="text-4xl text-purple-800">{user.displayName}</p>
                <p className="text-2xl text-gray-700">{user.email}</p>
                <p className="text-l italic text-gray-400">{user.id}</p>
            </div>
        </div>
    );
}

export default UserDetail;
