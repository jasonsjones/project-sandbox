import React from 'react';

function HeroBanner(): JSX.Element {
    return (
        <div className="flex flex-col justify-center text-center border-2 rounded-lg shadow-md px-4 py-6">
            <h1 className="text-4xl text-purple-900">ORION Labs Side Project</h1>
            <p className="text-lg text-gray-600">
                A simple React app built with Typescript and Tailwind CSS
            </p>
            <a
                className="mx-auto text-gray-900 border-2 border-purple-800 bg-purple-200 rounded-md py-2 px-4 my-4"
                href="https://github.com/jasonsjones/side-project"
            >
                View Source
            </a>
        </div>
    );
}

export default HeroBanner;
