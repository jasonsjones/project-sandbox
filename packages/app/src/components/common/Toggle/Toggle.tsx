import React from 'react';

interface ToggleProps {
    label: string;
    changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Toggle({ label, changeHandler }: ToggleProps) {
    return (
        <div className="flex items-center justify-start w-full mb-12 px-8 md:px-4">
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="toggle"
                        className="sr-only"
                        onChange={changeHandler}
                    />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">{label}</div>
            </label>
        </div>
    );
}

export default Toggle;
