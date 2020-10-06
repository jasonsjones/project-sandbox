import React from 'react';

function App(): JSX.Element {
    return (
        <div className="mt-8 mx-12 flex flex-col justify-center text-center border-2 rounded-lg shadow-md px-4 py-6">
            <h1 className="text-4xl text-purple-900">Hello React!</h1>
            <p className="text-lg text-gray-600">
                A simple React app built with Typescript and Tailwind CSS
            </p>
            <a
                className="mx-auto text-gray-900 border-2 border-purple-800 bg-purple-200 rounded-md py-2 px-4 mt-4"
                href="https://github.com/jasonsjones/side-project"
            >
                View Source
            </a>
        </div>
    );
}

export default App;
