import useAvatar from '../../hooks/useAvatar';

const DEFAULT_PIC = `${process.env.VITE_API_BASEURL}/default/avatar.png`;

type ProfilePicProps = {
    id: string;
    size?: 'small' | 'medium' | 'large';
};

const sizeToClassMap = {
    small: 'w-12',
    medium: 'w-24 border-2',
    large: 'w-48 border-4'
};

function ProfilePic({ id, size = 'medium' }: ProfilePicProps): JSX.Element {
    let profilePic = DEFAULT_PIC;
    const { data: response } = useAvatar(id);

    if (response?.data.avatar) {
        profilePic = response.data.avatar;
    }

    return (
        <img
            src={profilePic}
            alt="profile picture"
            className={`${sizeToClassMap[size]} rounded-full border-purple-300`}
        />
    );
}

export default ProfilePic;
