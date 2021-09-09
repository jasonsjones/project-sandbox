import { useState } from 'react';
import { Button } from '../../components/common';
import Spinner from '../../components/Spinner';
import UserCards from '../../components/UserCards';
import UserList from '../../components/UserList';
import useQueryParams from '../../hooks/useQueryParams';
import useUsers from '../../hooks/useUsers';

enum VIEW {
    List = 'list',
    Cards = 'cards'
}

function UserListPage(): JSX.Element {
    const query = useQueryParams();
    const [view, setView] = useState(query.get('view') || VIEW.Cards);
    const { data: response, isLoading } = useUsers();

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
            <div className="flex justify-center gap-x-4">
                <Button
                    type="button"
                    className="w-32 my-4"
                    variant={view === VIEW.List ? 'primary' : 'secondary'}
                    clickAction={() => setView(VIEW.List)}
                >
                    List
                </Button>
                <Button
                    type="button"
                    className="w-32 my-4"
                    variant={view === VIEW.Cards ? 'primary' : 'secondary'}
                    clickAction={() => setView(VIEW.Cards)}
                >
                    Cards
                </Button>
            </div>
            {view === VIEW.List ? (
                <UserList className="mt-16" users={response?.data.users} />
            ) : (
                <UserCards className="mt-16" users={response?.data.users} />
            )}
        </div>
    );
}

export default UserListPage;
