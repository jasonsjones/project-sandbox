import React from 'react';
import FileUpload from '../../components/FileUpload';
import UserList from '../../components/UserList';

function UserListPage(): JSX.Element {
    return (
        <>
            <UserList className="w-full mx-auto mt-12 py-6 md:w-3/4 md:py-0" />
            <div className="my-4 mx-auto max-w-md">
                <FileUpload />
            </div>
        </>
    );
}

export default UserListPage;
