import React from 'react';

interface InputFieldProps {
    id: string;
    type?: 'text' | 'email' | 'password';
    className?: string;
    label: string;
    value: string;
    changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
    id,
    type = 'text',
    className = '',
    label,
    value,
    changeHandler
}: InputFieldProps): JSX.Element {
    const classes = `flex flex-col ${className}`.trim();
    return (
        <div className={classes}>
            <label htmlFor={id} className="mb-1 text-gray-500">
                {label}
            </label>
            <input
                type={type}
                id={id}
                className="px-4 text-gray-700 border-2 border-gray-300 h-12 rounded-lg"
                value={value}
                onChange={changeHandler}
            />
        </div>
    );
}

export default InputField;
