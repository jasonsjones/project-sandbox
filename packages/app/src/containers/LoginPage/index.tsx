import React from 'react';
import LoginForm from '../../components/LoginForm';

function LoginPage(): JSX.Element {
    return (
        <div className="mt-8 ">
            <div className="w-3/4 mx-auto md:w-1/3">
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;
