import React, { useState } from 'react';
import { Button, InputField } from '../common';

function LoginForm(): JSX.Element {
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
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
        console.log(formValues);
        if (formValues.email.length > 0 && formValues.password.length > 0) {
            console.log('submitting form...');
            clearForm();
        }
    };

    return (
        <React.Fragment>
            <h1 className="text-2xl font-semibold text-center text-gray-600 sm:text-3xl">Login</h1>
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
        </React.Fragment>
    );
}

export default LoginForm;
