import { useParams } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import Spinner from '../../components/Spinner';
import useUser from '../../hooks/useUser';

function UserDetailPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const { data: response, isLoading } = useUser(id);

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
            <div className="flex gap-x-8 mt-12">
                <img
                    src="http://localhost:3000/default/avatar.png"
                    alt="default avatar"
                    className="w-32 rounded-full border-2 border-purple-300"
                />
                <div className="flex flex-col justify-center">
                    <p>{id}</p>
                    <p className="text-3xl">{response?.data?.user.displayName}</p>
                    <p className="text-xl">{response?.data?.user.email}</p>
                </div>
            </div>
            <div className="mt-24 mb-4 mx-auto max-w-md">
                <FileUpload />
            </div>
        </div>
    );
}

export default UserDetailPage;
