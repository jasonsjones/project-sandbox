import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
    type?: 'button' | 'submit';
    className?: string;
    variant?: 'secondary' | 'primary';
    clickAction?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button({
    children,
    type = 'button',
    className = '',
    variant = 'primary',
    clickAction
}: ButtonProps): JSX.Element {
    const commonClasses = 'border-2 rounded-md py-2 px-4';
    const secondaryClasses = 'text-purple-800 border-purple-800 bg-gray-100';
    const primaryClasses = 'text-gray-900 border-purple-800 bg-purple-200';

    const variantClasses = variant === 'secondary' ? secondaryClasses : primaryClasses;

    return (
        <button
            type={type}
            className={`${className} ${commonClasses} ${variantClasses}`.trim()}
            onClick={clickAction}
        >
            {children}
        </button>
    );
}

export default Button;
