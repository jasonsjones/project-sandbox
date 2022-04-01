import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { GraphQLResponse } from '../../dataservice';
import useLogin from '../../hooks/useLogin';
import { Button, InputField } from '../common';

const loginOp = `
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
  }
}
`;

function LoginForm(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();

    const [authError, setAuthError] = useState('');
    const { login } = useAuthContext();

    const from = location.state || { pathname: '/' };

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });

    const loginMutation = useLogin({
        onSuccess: (response: GraphQLResponse) => {
            const { data, errors } = response;
            if (data) {
                setAuthError('');
                clearForm();
                login(data.login.accessToken, () => {
                    navigate(from as string);
                });
            }

            if (errors?.length > 0) {
                if (errors[0].message === 'Unauthorized') {
                    setAuthError('Unauthorized access. Please try again.');
                } else {
                    setAuthError('Unexpected error. Please try again.');
                }
                login('');
            }
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const updateField: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value
        });
    };

    const clearForm = () => {
        setFormValues({
            email: '',
            password: ''
        });
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (formValues.email.length > 0 && formValues.password.length > 0) {
            loginMutation.mutate({
                query: loginOp,
                variables: {
                    loginInput: { email: formValues.email, password: formValues.password }
                }
            });
        }
    };

    return (
        <React.Fragment>
            <h1 className="mb-4 text-2xl font-semibold text-center text-gray-600 sm:text-3xl">
                Login
            </h1>
            <form onSubmit={handleSubmit}>
                <InputField
                    type="email"
                    className="mb-4"
                    id="email"
                    label="Email"
                    value={formValues.email}
                    changeHandler={updateField}
                />
                <InputField
                    type="password"
                    className="mb-4"
                    id="password"
                    label="Password"
                    value={formValues.password}
                    changeHandler={updateField}
                />
                <div className="flex justify-end">
                    <Button
                        className="my-4 mr-6"
                        variant="secondary"
                        clickAction={() => {
                            /* empty */
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="my-4" variant="primary">
                        Login
                    </Button>
                </div>
            </form>

            {authError ? (
                <div className="flex flex-col justify-center h-12 mt-4 rounded-md bg-red-200 border-2 border-red-700">
                    <p className="text-red-700 text-center">{authError}</p>
                </div>
            ) : null}
        </React.Fragment>
    );
}

export default LoginForm;
