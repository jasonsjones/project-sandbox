import { useParams } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import Spinner from '../../components/Spinner';
import UserDetail from '../../components/UserDetail';
import useUser from '../../hooks/useUser';

function UserDetailPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const { data: response, isLoading } = useUser(id);

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
            <h1 className="text-4xl">User Profile</h1>
            <UserDetail user={response?.data.user} />
            <div className="mt-24 mb-4 mx-auto max-w-md">
                <FileUpload />
            </div>
        </div>
    );
}

export default UserDetailPage;
