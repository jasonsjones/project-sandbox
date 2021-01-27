import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { makeGraphQLMutation } from '../../dataservice';
import { Button, InputField } from '../common';

const loginOp = `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
  }
}
`;

function LoginForm(): JSX.Element {
    const [accessToken, setAccessToken] = useState('');
    const [authError, setAuthError] = useState('');

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });

    const mutation = useMutation(makeGraphQLMutation);

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
            mutation.mutate(
                {
                    query: loginOp,
                    variables: { email: formValues.email, password: formValues.password }
                },
                {
                    onSuccess: (response) => {
                        const { data, errors } = response;
                        if (data) {
                            setAccessToken(data.login.accessToken);
                            setAuthError('');
                            clearForm();
                        }

                        if (errors.length > 0) {
                            if (errors[0].message === 'Unauthorized') {
                                setAuthError('Unauthorized access. Please try again.');
                            } else {
                                setAuthError('Unexpected error. Please try again.');
                            }
                            setAccessToken('');
                        }
                    },
                    onError: (error) => {
                        console.log(error);
                    }
                }
            );
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
                    <Button className="my-4 mr-6" variant="secondary" clickAction={() => {}}>
                        Cancel
                    </Button>
                    <Button type="submit" className="my-4" variant="primary">
                        Login
                    </Button>
                </div>
            </form>

            {/* Temp dump of access token (jwt) for development */}
            {accessToken ? (
                <p className="mt-8 text-gray-600 break-words">Access Token: {accessToken}</p>
            ) : null}

            {authError ? (
                <div className="flex flex-col justify-center h-12 mt-4 rounded-md bg-red-200 border-2 border-red-700">
                    <p className="text-red-700 text-center">{authError}</p>
                </div>
            ) : null}
        </React.Fragment>
    );
}

export default LoginForm;
