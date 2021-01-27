import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button, InputField } from '../common/';
import { makeGraphQLMutation } from '../../dataservice';

type UserRegisterFormProps = {
    className?: string;
    onRegister: () => void;
};

function UserRegisterForm({ className, onRegister }: UserRegisterFormProps): JSX.Element {
    const registerUserOp = `
                mutation RegisterUser($userData: RegisterUserInput!) {
                    registerUser(userData: $userData) {
                        id
                        firstName
                        lastName
                        displayName
                        email
                    }
                }`;

    const queryClient = useQueryClient();

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const mutation = useMutation(makeGraphQLMutation);

    const clearForm = () => {
        setFormValues({
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        });
    };

    const updateField: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value
        });
    };

    const handleCancel: React.MouseEventHandler<HTMLButtonElement> = () => {
        clearForm();
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            mutation.mutate(
                { query: registerUserOp, variables: { userData: formValues } },
                {
                    onSuccess: () => {
                        clearForm();
                        queryClient.invalidateQueries('users');
                        onRegister();
                    }
                }
            );
        }
    };

    const isFormValid = () => {
        return (
            formValues.firstName.length > 0 &&
            formValues.lastName.length > 0 &&
            formValues.email.length > 0 &&
            formValues.password.length > 0
        );
    };

    return (
        <div className={className}>
            <h1 className="mb-4 text-2xl text-gray-600 font-semibold text-center sm:text-3xl">
                Register for Account
            </h1>
            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    className="mb-4"
                    id="firstName"
                    label="First Name"
                    value={formValues.firstName}
                    changeHandler={updateField}
                />
                <InputField
                    type="text"
                    className="mb-4"
                    id="lastName"
                    label="Last Name"
                    value={formValues.lastName}
                    changeHandler={updateField}
                />
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
                    <Button className="my-4 mr-6" variant="secondary" clickAction={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="my-4" variant="primary">
                        Register
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UserRegisterForm;
