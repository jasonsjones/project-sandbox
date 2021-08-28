import FileUpload from '../../components/FileUpload';
import Spinner from '../../components/Spinner';
import UserCards from '../../components/UserCards';
import UserList from '../../components/UserList';
import useUsers from '../../hooks/useUsers';

function UserListPage(): JSX.Element {
    const { data: response, isLoading } = useUsers();

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
            <UserList users={response?.data.users} />
            <UserCards className="mt-24" users={response?.data.users} />
            <div className="mt-24 mb-4 mx-auto max-w-md">
                <FileUpload />
            </div>
        </div>
    );
}

export default UserListPage;
