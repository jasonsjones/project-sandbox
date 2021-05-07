import React from 'react';
import FileUpload from '../../components/FileUpload';
import UserList from '../../components/UserList';

function UserListPage(): JSX.Element {
    return (
        <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
            <UserList />
            <div className="mt-24 mb-4 mx-auto max-w-md">
                <FileUpload />
            </div>
        </div>
    );
}

export default UserListPage;
