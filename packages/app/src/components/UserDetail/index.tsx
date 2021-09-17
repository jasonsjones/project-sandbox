import { User } from '../../types';

type UserRecordProps = { className?: string; user: User };
function UserDetail({ user }: UserRecordProps): JSX.Element {
    // const profileNumber = Math.floor(Math.random() * 90) + 1;
    // const profileImgSrc = `https://randomuser.me/api/portraits/men/${profileNumber}.jpg`;
    const profileImgSrc = 'http://localhost:3000/default/avatar.png';

    return (
        <div className="flex gap-x-8 mt-12">
            <img
                src={profileImgSrc}
                alt="default avatar"
                className="w-48 rounded-full border-4 border-purple-300"
            />
            <div className="flex flex-col justify-center gap-y-4">
                <p className="text-4xl text-purple-800">{user.displayName}</p>
                <p className="text-2xl text-gray-700">{user.email}</p>
                <p className="text-l italic text-gray-400">{user.id}</p>
            </div>
        </div>
    );
}

export default UserDetail;
